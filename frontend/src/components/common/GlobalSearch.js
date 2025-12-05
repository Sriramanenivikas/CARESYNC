import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiUser, FiCalendar, FiUserPlus, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import patientService from '../../services/patientService';
import doctorService from '../../services/doctorService';
import appointmentService from '../../services/appointmentService';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({ patients: [], doctors: [], appointments: [] });
  const { user } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const extractResults = (res) => {
    if (!res || !res.success) return [];
    const data = res.data;
    if (Array.isArray(data)) return data.slice(0, 5);
    if (data?.content && Array.isArray(data.content)) return data.content.slice(0, 5);
    return [];
  };

  const filterByQuery = (items, searchQuery) => {
    const q = searchQuery.toLowerCase();
    return items.filter(item => {
      const searchableFields = [
        item.firstName, item.lastName, item.email, item.phone,
        item.patientName, item.doctorName, item.specialization,
        item.fullName, `${item.firstName || ''} ${item.lastName || ''}`
      ].filter(Boolean);
      return searchableFields.some(field => field.toLowerCase().includes(q));
    });
  };

  const searchAll = useCallback(async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults({ patients: [], doctors: [], appointments: [] });
      return;
    }

    setIsLoading(true);
    try {
      const [patientsRes, doctorsRes, appointmentsRes] = await Promise.allSettled([
        patientService.search(searchQuery),
        doctorService.search(searchQuery),
        appointmentService.getAll({ size: 50 }),
      ]);

      const patients = patientsRes.status === 'fulfilled' ? extractResults(patientsRes.value) : [];
      const doctors = doctorsRes.status === 'fulfilled' ? extractResults(doctorsRes.value) : [];
      const allAppointments = appointmentsRes.status === 'fulfilled' ? extractResults(appointmentsRes.value) : [];
      const appointments = filterByQuery(allAppointments, searchQuery);

      setResults({
        patients: patients.slice(0, 5),
        doctors: doctors.slice(0, 5),
        appointments: appointments.slice(0, 5),
      });
    } catch (err) {
      console.error('Search error:', err);
      setResults({ patients: [], doctors: [], appointments: [] });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchAll(value);
    }, 300);
  };

  const handleResultClick = (type, item) => {
    setIsOpen(false);
    setQuery('');
    
    switch (type) {
      case 'patient':
        navigate('/patients', { state: { highlightId: item.id } });
        break;
      case 'doctor':
        navigate('/doctors', { state: { highlightId: item.id } });
        break;
      case 'appointment':
        navigate('/appointments', { state: { highlightId: item.id } });
        break;
      default:
        break;
    }
  };

  const hasResults = results.patients.length > 0 || results.doctors.length > 0 || results.appointments.length > 0;
  const canSearchPatients = ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'TEST'].includes(user?.role);
  const canSearchDoctors = true;
  const canSearchAppointments = true;

  return (
    <div ref={searchRef} className="relative">
      <div className="relative">
        <FiSearch className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          placeholder="Search... (⌘K)"
          className="pl-9 pr-8 py-2 w-64 lg:w-72 bg-zinc-100 dark:bg-zinc-800 
                   border-0 rounded-lg text-sm text-zinc-700 dark:text-zinc-200 
                   placeholder-zinc-400 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:bg-white 
                   dark:focus:bg-zinc-900 transition-all duration-150"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults({ patients: [], doctors: [], appointments: [] }); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded"
          >
            <FiX className="w-3.5 h-3.5 text-zinc-400" />
          </button>
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-zinc-900 
                      border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg 
                      overflow-hidden z-50 max-h-80 overflow-y-auto">
          
          {isLoading ? (
            <div className="flex items-center justify-center py-6 text-zinc-400">
              <div className="w-4 h-4 border-2 border-zinc-300 border-t-blue-500 rounded-full animate-spin mr-2" />
              <span className="text-sm">Searching...</span>
            </div>
          ) : !hasResults ? (
            <div className="py-6 text-center text-zinc-400 text-sm">
              No results for "{query}"
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {canSearchPatients && results.patients.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/50">
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Patients ({results.patients.length})
                    </span>
                  </div>
                  {results.patients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => handleResultClick('patient', patient)}
                      className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-zinc-50 
                               dark:hover:bg-zinc-800/50 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/30 
                                    flex items-center justify-center flex-shrink-0">
                        <FiUser className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate">
                          {patient.firstName} {patient.lastName}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">{patient.phone || patient.email}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {canSearchDoctors && results.doctors.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/50">
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Doctors ({results.doctors.length})
                    </span>
                  </div>
                  {results.doctors.map((doctor) => (
                    <button
                      key={doctor.id}
                      onClick={() => handleResultClick('doctor', doctor)}
                      className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-zinc-50 
                               dark:hover:bg-zinc-800/50 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 
                                    flex items-center justify-center flex-shrink-0">
                        <FiUserPlus className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">{doctor.specialization}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {canSearchAppointments && results.appointments.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800/50">
                    <span className="text-[10px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                      Appointments ({results.appointments.length})
                    </span>
                  </div>
                  {results.appointments.map((apt) => (
                    <button
                      key={apt.id}
                      onClick={() => handleResultClick('appointment', apt)}
                      className="w-full px-3 py-2 flex items-center gap-2.5 hover:bg-zinc-50 
                               dark:hover:bg-zinc-800/50 transition-colors text-left"
                    >
                      <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 
                                    flex items-center justify-center flex-shrink-0">
                        <FiCalendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200 truncate">
                          {apt.patientName || 'Patient'} • {apt.doctorName || 'Doctor'}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">
                          {apt.appointmentDate} at {apt.appointmentTime?.slice(0, 5)}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
