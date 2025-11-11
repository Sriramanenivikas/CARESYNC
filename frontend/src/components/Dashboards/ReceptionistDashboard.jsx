import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Layout/DashboardLayout';
import StatCard from '../Layout/StatCard';
import dashboardService from '../../services/dashboardService';
import appointmentService from '../../services/appointmentService';
import patientService from '../../services/patientService';
import doctorService from '../../services/doctorService';
import { FaCalendarAlt, FaUsers, FaPlus, FaEdit, FaCheckCircle, FaUserMd } from 'react-icons/fa';

const ReceptionistDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
    checkedIn: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard/receptionist', icon: <FaCheckCircle /> },
    { label: 'Appointments', path: '#appointments', icon: <FaCalendarAlt />, onClick: () => setActiveTab('appointments') },
    { label: 'Patients', path: '#patients', icon: <FaUsers />, onClick: () => setActiveTab('patients') },
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dashboardService.getReceptionistDashboard();
      setStats((prev) => ({ ...prev, ...(data.stats || data || {}) }));
    } catch (err) {
      console.error(err);
      setError('Failed to load receptionist dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getAllAppointments();
      setAppointments(data || []);
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = (data || []).filter(a => a.appointmentDate === today);
      const pending = (data || []).filter(a => a.status === 'PENDING' || a.status === 'SCHEDULED');
      setStats(prev => ({
        ...prev,
        todayAppointments: todayAppts.length,
        pendingAppointments: pending.length
      }));
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await patientService.getAllPatients();
      setPatients(data || []);
      setStats(prev => ({ ...prev, totalPatients: data?.length || 0 }));
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const data = await doctorService.getAllDoctors();
      setDoctors(data || []);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  const handleSavePatient = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Generate patient code if not provided
    const patientCode = formData.get('patientCode') || `P${Date.now()}`;
    const registrationDate = formData.get('registrationDate') || new Date().toISOString().split('T')[0];

    const patientData = {
      patientCode,
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      dateOfBirth: formData.get('dateOfBirth'),
      gender: formData.get('gender'),
      bloodGroup: formData.get('bloodGroup') || null,
      phonePrimary: formData.get('phonePrimary'),
      phoneSecondary: formData.get('phoneSecondary') || null,
      email: formData.get('email') || null,
      addressLine1: formData.get('addressLine1') || null,
      addressLine2: formData.get('addressLine2') || null,
      city: formData.get('city') || null,
      state: formData.get('state') || null,
      postalCode: formData.get('postalCode') || null,
      country: formData.get('country') || 'India',
      maritalStatus: formData.get('maritalStatus') || null,
      occupation: formData.get('occupation') || null,
      allergies: formData.get('allergies') || null,
      chronicConditions: formData.get('chronicConditions') || null,
      currentMedications: formData.get('currentMedications') || null,
      registrationDate,
      isActive: true
    };

    try {
      await patientService.createPatient(patientData);
      alert('Patient registered successfully!');
      setShowPatientModal(false);
      fetchPatients();
      e.target.reset();
    } catch (err) {
      alert('Failed to register patient: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSaveAppointment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Generate appointment code if not provided
    const appointmentCode = `APT${Date.now()}`;

    const appointmentData = {
      appointmentCode,
      patientId: parseInt(formData.get('patientId')),
      doctorId: parseInt(formData.get('doctorId')),
      departmentId: parseInt(formData.get('departmentId')) || 1,
      appointmentDate: formData.get('appointmentDate'),
      appointmentTime: formData.get('appointmentTime'),
      appointmentType: formData.get('appointmentType'),
      priority: formData.get('priority') || 'NORMAL',
      reason: formData.get('reason'),
      symptoms: formData.get('symptoms') || null,
      consultationFee: parseFloat(formData.get('consultationFee')) || 0,
      notes: formData.get('notes') || null,
      status: 'SCHEDULED',
      isActive: true
    };

    try {
      await appointmentService.createAppointment(appointmentData);
      alert('Appointment scheduled successfully!');
      setShowAppointmentModal(false);
      fetchAppointments();
      e.target.reset();
    } catch (err) {
      alert('Failed to schedule appointment: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading && activeTab === 'overview') {
    return <DashboardLayout menuItems={menuItems}><div className="flex items-center justify-center h-64"><div className="text-lg text-primary-600">Loading...</div></div></DashboardLayout>;
  }

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        {error && (
          <div className="bg-primary-50 border border-primary-300 text-primary-900 px-4 py-3 rounded-lg dark:bg-primary-900/30 dark:border-primary-700 dark:text-primary-200">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Today's Appointments"
            value={stats.todayAppointments || 0}
            icon={<FaCalendarAlt className="text-primary-600" />}
            bgColor="bg-primary-50 dark:bg-primary-900/30"
            textColor="text-primary-900 dark:text-primary-100"
          />
          <StatCard
            title="Pending Appointments"
            value={stats.pendingAppointments || 0}
            icon={<FaCalendarAlt className="text-luxury-600" />}
            bgColor="bg-luxury-50 dark:bg-luxury-900/30"
            textColor="text-luxury-900 dark:text-luxury-100"
          />
          <StatCard
            title="Total Patients"
            value={stats.totalPatients || 0}
            icon={<FaUsers className="text-accent-600" />}
            bgColor="bg-accent-50 dark:bg-accent-900/30"
            textColor="text-accent-900 dark:text-accent-100"
          />
          <StatCard
            title="Checked In Today"
            value={stats.checkedIn || 0}
            icon={<FaCheckCircle className="text-primary-700" />}
            bgColor="bg-primary-100 dark:bg-primary-800/30"
            textColor="text-primary-900 dark:text-primary-100"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg dark:bg-gray-900 border border-primary-200 dark:border-primary-800">
          <div className="border-b border-primary-200 dark:border-primary-800">
            <nav className="flex space-x-4 px-6">
              {['overview', 'appointments', 'patients'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-4 font-medium capitalize transition-colors ${
                    activeTab === tab
                      ? 'border-b-2 border-primary-600 text-primary-700 dark:text-primary-400'
                      : 'text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4 text-primary-900 dark:text-primary-100">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setShowPatientModal(true)}
                    className="p-4 border-2 border-primary-400 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-700 dark:text-primary-400 font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
                  >
                    <FaPlus /> Register Patient
                  </button>
                  <button
                    onClick={() => setShowAppointmentModal(true)}
                    className="p-4 border-2 border-luxury-400 rounded-lg hover:bg-luxury-50 dark:hover:bg-luxury-900/20 text-luxury-700 dark:text-luxury-400 font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
                  >
                    <FaPlus /> Schedule Appointment
                  </button>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="p-4 border-2 border-primary-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 text-primary-800 dark:text-primary-300 font-medium transition-all shadow-sm hover:shadow-md"
                  >
                    View Today's Schedule
                  </button>
                </div>

                {/* Today's Appointments Preview */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3 text-primary-900 dark:text-primary-100">Today's Appointments</h3>
                  <div className="space-y-2">
                    {appointments.slice(0, 5).map((appointment) => (
                      <div key={appointment.id} className="p-4 border border-primary-200 dark:border-primary-800 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 flex justify-between items-center transition-colors">
                        <div>
                          <p className="font-medium text-primary-900 dark:text-primary-100">{appointment.patientName}</p>
                          <p className="text-sm text-primary-700 dark:text-primary-300">
                            Dr. {appointment.doctorName} - {appointment.appointmentTime}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded text-sm font-medium ${
                          appointment.status === 'CONFIRMED' ? 'bg-luxury-100 text-luxury-800 dark:bg-luxury-900/40 dark:text-luxury-200' :
                          appointment.status === 'SCHEDULED' || appointment.status === 'PENDING' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    ))}
                    {appointments.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No appointments for today</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-primary-900 dark:text-primary-100">Appointments</h2>
                  <button
                    onClick={() => setShowAppointmentModal(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
                  >
                    <FaPlus /> Schedule Appointment
                  </button>
                </div>
                <div className="overflow-x-auto rounded-lg border border-primary-200 dark:border-primary-800">
                  <table className="min-w-full divide-y divide-primary-200 dark:divide-primary-800">
                    <thead className="bg-primary-50 dark:bg-primary-900/30">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primary-800 uppercase dark:text-primary-300">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primary-800 uppercase dark:text-primary-300">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primary-800 uppercase dark:text-primary-300">Doctor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primary-800 uppercase dark:text-primary-300">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primary-800 uppercase dark:text-primary-300">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primary-800 uppercase dark:text-primary-300">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primary-800 uppercase dark:text-primary-300">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primary-800 uppercase dark:text-primary-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-primary-100 dark:bg-gray-900 dark:divide-primary-900">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id} className="hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 dark:text-primary-100">{appointment.appointmentCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 dark:text-primary-100">{appointment.patientName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 dark:text-primary-100">Dr. {appointment.doctorName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 dark:text-primary-100">{appointment.appointmentDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 dark:text-primary-100">{appointment.appointmentTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 dark:text-primary-100">{appointment.appointmentType}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              appointment.status === 'CONFIRMED' ? 'bg-luxury-100 text-luxury-800 dark:bg-luxury-900/40 dark:text-luxury-200' :
                              appointment.status === 'SCHEDULED' ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/40 dark:text-primary-200' :
                              appointment.status === 'COMPLETED' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                              appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 mr-2" title="Edit">
                              <FaEdit />
                            </button>
                            <button className="text-luxury-600 hover:text-luxury-800 dark:text-luxury-400 dark:hover:text-luxury-300" title="Check In">
                              <FaCheckCircle />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {appointments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No appointments found</div>
                  )}
                </div>
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-primary-900 dark:text-primary-100">Patients</h2>
                  <button
                    onClick={() => setShowPatientModal(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
                  >
                    <FaPlus /> Register Patient
                  </button>
                </div>
                <div className="overflow-x-auto rounded-lg border border-primary-200 dark:border-primary-800">
                  <table className="min-w-full divide-y divide-primary-200 dark:divide-primary-800">
                    <thead className="bg-primary-50 dark:bg-primary-900/30">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primary-800 uppercase dark:text-primary-300">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primary-800 uppercase dark:text-primary-300">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primary-800 uppercase dark:text-primary-300">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primary-800 uppercase dark:text-primary-300">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primary-800 uppercase dark:text-primary-300">Blood Group</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-primary-800 uppercase dark:text-primary-300">Email</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-primary-100 dark:bg-gray-900 dark:divide-primary-900">
                      {patients.map((patient) => (
                        <tr key={patient.id} className="hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 dark:text-primary-100">{patient.patientCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 dark:text-primary-100">{patient.name || `${patient.firstName} ${patient.lastName}`}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 dark:text-primary-100">{patient.gender}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 dark:text-primary-100">{patient.phonePrimary}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 dark:text-primary-100">{patient.bloodGroup}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-primary-900 dark:text-primary-100">{patient.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {patients.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No patients found</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* COMPLETE Patient Modal - ALL FIELDS */}
        {showPatientModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-900 border-2 border-primary-400">
              <h2 className="text-2xl font-bold mb-6 text-primary-800 dark:text-primary-300 border-b-2 border-primary-400 pb-3">Register New Patient</h2>
              <form onSubmit={handleSavePatient} className="space-y-6">

                {/* Basic Information */}
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-300 mb-3">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      name="patientCode"
                      placeholder="Patient Code (Auto-generated)"
                      className="input-field border-primary-300 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <input
                      name="firstName"
                      placeholder="First Name *"
                      className="input-field border-primary-300 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                    <input
                      name="lastName"
                      placeholder="Last Name *"
                      className="input-field border-primary-300 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                    <input
                      name="dateOfBirth"
                      type="date"
                      placeholder="Date of Birth"
                      className="input-field border-primary-300 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                    <select name="gender" className="input-field border-primary-300 focus:ring-primary-500 focus:border-primary-500" required>
                      <option value="">Select Gender *</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                    <select name="bloodGroup" className="input-field border-primary-300 focus:ring-primary-500 focus:border-primary-500">
                      <option value="">Blood Group</option>
                      <option value="A_POSITIVE">A+</option>
                      <option value="A_NEGATIVE">A-</option>
                      <option value="B_POSITIVE">B+</option>
                      <option value="B_NEGATIVE">B-</option>
                      <option value="O_POSITIVE">O+</option>
                      <option value="O_NEGATIVE">O-</option>
                      <option value="AB_POSITIVE">AB+</option>
                      <option value="AB_NEGATIVE">AB-</option>
                    </select>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-luxury-50 dark:bg-luxury-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-luxury-800 dark:text-luxury-300 mb-3">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="phonePrimary"
                      placeholder="Primary Phone *"
                      className="input-field border-luxury-300 focus:ring-luxury-500 focus:border-luxury-500"
                      required
                    />
                    <input
                      name="phoneSecondary"
                      placeholder="Secondary Phone"
                      className="input-field border-luxury-300 focus:ring-luxury-500 focus:border-luxury-500"
                    />
                    <input
                      name="email"
                      type="email"
                      placeholder="Email Address"
                      className="input-field border-luxury-300 focus:ring-luxury-500 focus:border-luxury-500 md:col-span-2"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-accent-50 dark:bg-accent-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-accent-800 dark:text-accent-300 mb-3">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="addressLine1"
                      placeholder="Address Line 1"
                      className="input-field border-accent-300 focus:ring-accent-500 focus:border-accent-500"
                    />
                    <input
                      name="addressLine2"
                      placeholder="Address Line 2"
                      className="input-field border-accent-300 focus:ring-accent-500 focus:border-accent-500"
                    />
                    <input
                      name="city"
                      placeholder="City"
                      className="input-field border-accent-300 focus:ring-accent-500 focus:border-accent-500"
                    />
                    <input
                      name="state"
                      placeholder="State"
                      className="input-field border-accent-300 focus:ring-accent-500 focus:border-accent-500"
                    />
                    <input
                      name="postalCode"
                      placeholder="Postal Code"
                      className="input-field border-accent-300 focus:ring-accent-500 focus:border-accent-500"
                    />
                    <input
                      name="country"
                      placeholder="Country"
                      defaultValue="India"
                      className="input-field border-accent-300 focus:ring-accent-500 focus:border-accent-500"
                    />
                  </div>
                </div>

                {/* Personal Details */}
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-300 mb-3">Personal Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select name="maritalStatus" className="input-field border-primary-300 focus:ring-primary-500 focus:border-primary-500">
                      <option value="">Marital Status</option>
                      <option value="SINGLE">Single</option>
                      <option value="MARRIED">Married</option>
                      <option value="DIVORCED">Divorced</option>
                      <option value="WIDOWED">Widowed</option>
                      <option value="SEPARATED">Separated</option>
                    </select>
                    <input
                      name="occupation"
                      placeholder="Occupation"
                      className="input-field border-primary-300 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <input
                      name="registrationDate"
                      type="date"
                      placeholder="Registration Date"
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="input-field border-primary-300 focus:ring-primary-500 focus:border-primary-500 md:col-span-2"
                    />
                  </div>
                </div>

                {/* Medical History */}
                <div className="bg-luxury-50 dark:bg-luxury-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-luxury-800 dark:text-luxury-300 mb-3">Medical History</h3>
                  <div className="space-y-3">
                    <textarea
                      name="allergies"
                      placeholder="Allergies (e.g., Penicillin, Peanuts, Latex)"
                      className="input-field w-full border-luxury-300 focus:ring-luxury-500 focus:border-luxury-500"
                      rows="2"
                    />
                    <textarea
                      name="chronicConditions"
                      placeholder="Chronic Conditions (e.g., Diabetes, Hypertension, Asthma)"
                      className="input-field w-full border-luxury-300 focus:ring-luxury-500 focus:border-luxury-500"
                      rows="2"
                    />
                    <textarea
                      name="currentMedications"
                      placeholder="Current Medications (e.g., Metformin 500mg, Aspirin 75mg)"
                      className="input-field w-full border-luxury-300 focus:ring-luxury-500 focus:border-luxury-500"
                      rows="2"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t-2 border-primary-300">
                  <button
                    type="button"
                    onClick={() => setShowPatientModal(false)}
                    className="px-6 py-2 border-2 border-primary-400 text-primary-700 rounded-lg hover:bg-primary-50 dark:border-primary-600 dark:text-primary-400 dark:hover:bg-primary-900/20 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg font-medium"
                  >
                    Register Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* COMPLETE Appointment Modal - ALL FIELDS */}
        {showAppointmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-900 border-2 border-luxury-400">
              <h2 className="text-2xl font-bold mb-6 text-luxury-800 dark:text-luxury-300 border-b-2 border-luxury-400 pb-3">Schedule New Appointment</h2>
              <form onSubmit={handleSaveAppointment} className="space-y-6">

                {/* Patient & Doctor Selection */}
                <div className="bg-luxury-50 dark:bg-luxury-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-luxury-800 dark:text-luxury-300 mb-3">Patient & Doctor</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select name="patientId" className="input-field border-luxury-300 focus:ring-luxury-500 focus:border-luxury-500" required>
                      <option value="">Select Patient *</option>
                      {patients.map(p => (
                        <option key={p.id} value={p.id}>
                          {p.name || `${p.firstName} ${p.lastName}`} ({p.patientCode})
                        </option>
                      ))}
                    </select>
                    <select name="doctorId" className="input-field border-luxury-300 focus:ring-luxury-500 focus:border-luxury-500" required>
                      <option value="">Select Doctor *</option>
                      {doctors.map(d => (
                        <option key={d.id} value={d.id}>
                          Dr. {d.firstName} {d.lastName} - {d.specialization}
                        </option>
                      ))}
                    </select>
                    <input
                      name="departmentId"
                      type="number"
                      placeholder="Department ID (default: 1)"
                      defaultValue="1"
                      className="input-field border-luxury-300 focus:ring-luxury-500 focus:border-luxury-500 md:col-span-2"
                    />
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-primary-800 dark:text-primary-300 mb-3">Appointment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      name="appointmentDate"
                      type="date"
                      className="input-field border-primary-300 focus:ring-primary-500 focus:border-primary-500"
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                    <input
                      name="appointmentTime"
                      type="time"
                      className="input-field border-primary-300 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                    <select name="appointmentType" className="input-field border-primary-300 focus:ring-primary-500 focus:border-primary-500" required>
                      <option value="">Appointment Type *</option>
                      <option value="CONSULTATION">Consultation</option>
                      <option value="FOLLOW_UP">Follow-up</option>
                      <option value="EMERGENCY">Emergency</option>
                      <option value="CHECKUP">Checkup</option>
                      <option value="PROCEDURE">Procedure</option>
                    </select>
                    <select name="priority" className="input-field border-primary-300 focus:ring-primary-500 focus:border-primary-500">
                      <option value="NORMAL">Normal</option>
                      <option value="LOW">Low</option>
                      <option value="HIGH">High</option>
                      <option value="EMERGENCY">Emergency</option>
                    </select>
                    <input
                      name="consultationFee"
                      type="number"
                      step="0.01"
                      placeholder="Consultation Fee"
                      className="input-field border-primary-300 focus:ring-primary-500 focus:border-primary-500 md:col-span-2"
                    />
                  </div>
                </div>

                {/* Clinical Information */}
                <div className="bg-accent-50 dark:bg-accent-900/20 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-accent-800 dark:text-accent-300 mb-3">Clinical Information</h3>
                  <div className="space-y-3">
                    <textarea
                      name="reason"
                      placeholder="Reason for Visit * (e.g., Annual checkup, Back pain, Fever)"
                      className="input-field w-full border-accent-300 focus:ring-accent-500 focus:border-accent-500"
                      rows="2"
                      required
                    />
                    <textarea
                      name="symptoms"
                      placeholder="Symptoms (e.g., Cough, Headache, Nausea)"
                      className="input-field w-full border-accent-300 focus:ring-accent-500 focus:border-accent-500"
                      rows="2"
                    />
                    <textarea
                      name="notes"
                      placeholder="Additional Notes"
                      className="input-field w-full border-accent-300 focus:ring-accent-500 focus:border-accent-500"
                      rows="2"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t-2 border-luxury-300">
                  <button
                    type="button"
                    onClick={() => setShowAppointmentModal(false)}
                    className="px-6 py-2 border-2 border-luxury-400 text-luxury-700 rounded-lg hover:bg-luxury-50 dark:border-luxury-600 dark:text-luxury-400 dark:hover:bg-luxury-900/20 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-luxury-600 text-white rounded-lg hover:bg-luxury-700 transition-colors shadow-md hover:shadow-lg font-medium"
                  >
                    Schedule Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ReceptionistDashboard;
