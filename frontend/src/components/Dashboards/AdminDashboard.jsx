import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Layout/DashboardLayout';
import StatCard from '../Layout/StatCard';
import dashboardService from '../../services/dashboardService';
import patientService from '../../services/patientService';
import doctorService from '../../services/doctorService';
import appointmentService from '../../services/appointmentService';
import { FaUsers, FaUserMd, FaCalendarAlt, FaDollarSign, FaCog, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0,
    todayRevenue: 0,
  });
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard/admin', icon: <FaCog /> },
    { label: 'Patients', path: '#patients', icon: <FaUsers />, onClick: () => setActiveTab('patients') },
    { label: 'Doctors', path: '#doctors', icon: <FaUserMd />, onClick: () => setActiveTab('doctors') },
    { label: 'Appointments', path: '#appointments', icon: <FaCalendarAlt />, onClick: () => setActiveTab('appointments') },
    { label: 'Billing', path: '#billing', icon: <FaDollarSign />, onClick: () => setActiveTab('billing') },
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchPatients();
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dashboardService.getAdminDashboard();
      setStats((prev) => ({ ...prev, ...(data.stats || data || {}) }));
    } catch (err) {
      console.error(err);
      setError('Failed to load admin dashboard.');
    } finally {
      setLoading(false);
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
      setStats(prev => ({ ...prev, totalDoctors: data?.length || 0 }));
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const data = await appointmentService.getAllAppointments();
      setAppointments(data || []);
      setStats(prev => ({ ...prev, totalAppointments: data?.length || 0 }));
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  const handleDeletePatient = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.deletePatient(id);
        fetchPatients();
        alert('Patient deleted successfully');
      } catch (err) {
        alert('Failed to delete patient');
      }
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await doctorService.deleteDoctor(id);
        fetchDoctors();
        alert('Doctor deleted successfully');
      } catch (err) {
        alert('Failed to delete doctor');
      }
    }
  };

  const handleSavePatient = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const patientData = {
      patientCode: formData.get('patientCode'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      dateOfBirth: formData.get('dateOfBirth'),
      gender: formData.get('gender'),
      phoneNumber: formData.get('phoneNumber'),
      email: formData.get('email'),
      address: formData.get('address'),
      bloodGroup: formData.get('bloodGroup'),
      isActive: true
    };

    try {
      if (editingPatient) {
        await patientService.updatePatient(editingPatient.id, patientData);
        alert('Patient updated successfully');
      } else {
        await patientService.createPatient(patientData);
        alert('Patient created successfully');
      }
      setShowPatientModal(false);
      setEditingPatient(null);
      fetchPatients();
    } catch (err) {
      alert('Failed to save patient: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSaveDoctor = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const doctorData = {
      doctorCode: formData.get('doctorCode'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      specialization: formData.get('specialization'),
      phoneNumber: formData.get('phoneNumber'),
      email: formData.get('email'),
      experience: parseInt(formData.get('experience')),
      consultationFee: parseFloat(formData.get('consultationFee')),
      isActive: true
    };

    try {
      if (editingDoctor) {
        await doctorService.updateDoctor(editingDoctor.id, doctorData);
        alert('Doctor updated successfully');
      } else {
        await doctorService.createDoctor(doctorData);
        alert('Doctor created successfully');
      }
      setShowDoctorModal(false);
      setEditingDoctor(null);
      fetchDoctors();
    } catch (err) {
      alert('Failed to save doctor: ' + (err.response?.data?.message || err.message));
    }
  };

  const openPatientDetails = async (id) => {
    try {
      const details = await patientService.getPatientDetails(id);
      setPatientDetails(details);
      setShowPatientDetails(true);
    } catch (e) {
      alert('Failed to load patient details');
    }
  };

  // Helpers for display formatting
  const formatDate = (iso) => {
    if (!iso) return '-';
    try {
      const d = new Date(iso);
      return isNaN(d.getTime()) ? iso : d.toLocaleDateString();
    } catch { return iso; }
  };

  const formatCurrency = (num) => {
    if (num == null) return '$0';
    try { return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(num)); }
    catch { return `$${num}`; }
  };

  const renderBloodGroup = (value) => value || '-';

  if (loading && activeTab === 'overview') {
    return <DashboardLayout menuItems={menuItems}><div className="flex items-center justify-center h-64"><div className="text-lg">Loading...</div></div></DashboardLayout>;
  }

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg dark:bg-yellow-900/30 dark:border-yellow-800 dark:text-yellow-200">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Patients"
            value={stats.totalPatients || 0}
            icon={<FaUsers className="text-blue-600" />}
            bgColor="bg-blue-50 dark:bg-blue-900/30"
            textColor="text-blue-900 dark:text-blue-100"
            iconBgColor="bg-blue-100 dark:bg-blue-800"
          />
          <StatCard
            title="Total Doctors"
            value={stats.totalDoctors || 0}
            icon={<FaUserMd className="text-green-600" />}
            bgColor="bg-green-50 dark:bg-green-900/30"
            textColor="text-green-900 dark:text-green-100"
            iconBgColor="bg-green-100 dark:bg-green-800"
          />
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments || 0}
            icon={<FaCalendarAlt className="text-purple-600" />}
            bgColor="bg-purple-50 dark:bg-purple-900/30"
            textColor="text-purple-900 dark:text-purple-100"
            iconBgColor="bg-purple-100 dark:bg-purple-800"
          />
          <StatCard
            title="Today's Revenue"
            value={`$${stats.todayRevenue || 0}`}
            icon={<FaDollarSign className="text-yellow-600" />}
            bgColor="bg-yellow-50 dark:bg-yellow-900/30"
            textColor="text-yellow-900 dark:text-yellow-100"
            iconBgColor="bg-yellow-100 dark:bg-yellow-800"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="border-b dark:border-gray-800">
            <nav className="flex space-x-4 px-6">
              {['overview', 'patients', 'doctors', 'appointments'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-4 font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
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
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => { setEditingPatient(null); setShowPatientModal(true); }}
                    className="p-4 border border-blue-300 rounded-lg hover:bg-blue-50 text-blue-600 font-medium flex items-center justify-center gap-2 dark:border-blue-900 dark:hover:bg-blue-900/20"
                  >
                    <FaPlus /> Add Patient
                  </button>
                  <button
                    onClick={() => { setEditingDoctor(null); setShowDoctorModal(true); }}
                    className="p-4 border border-green-300 rounded-lg hover:bg-green-50 text-green-600 font-medium flex items-center justify-center gap-2 dark:border-green-900 dark:hover:bg-green-900/20"
                  >
                    <FaPlus /> Add Doctor
                  </button>
                  <button
                    onClick={() => setActiveTab('patients')}
                    className="p-4 border rounded-lg hover:bg-gray-50 font-medium dark:border-gray-800 dark:hover:bg-gray-800"
                  >
                    Manage Patients
                  </button>
                  <button
                    onClick={() => setActiveTab('doctors')}
                    className="p-4 border rounded-lg hover:bg-gray-50 font-medium dark:border-gray-800 dark:hover:bg-gray-800"
                  >
                    Manage Doctors
                  </button>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="p-4 border rounded-lg hover:bg-gray-50 font-medium dark:border-gray-800 dark:hover:bg-gray-800"
                  >
                    View Appointments
                  </button>
                  <button className="p-4 border rounded-lg hover:bg-gray-50 font-medium dark:border-gray-800 dark:hover:bg-gray-800">
                    System Settings
                  </button>
                </div>
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Patients Management</h2>
                  <button
                    onClick={() => { setEditingPatient(null); setShowPatientModal(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FaPlus /> Add Patient
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Birthdate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visits</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                      {patients.map((p) => (
                        <tr key={p.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{p.name || `${p.firstName || ''} ${p.lastName || ''}`.trim()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{p.email || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{p.gender || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{renderBloodGroup(p.bloodGroup)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(p.birthdate)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{p.appointmentCount ?? '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button
                              onClick={() => openPatientDetails(p.id)}
                              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                              title="View"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => { setEditingPatient(p); setShowPatientModal(true); }}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeletePatient(p.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </td>
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

            {/* Doctors Tab */}
            {activeTab === 'doctors' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Doctors Management</h2>
                  <button
                    onClick={() => { setEditingDoctor(null); setShowDoctorModal(true); }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <FaPlus /> Add Doctor
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialization</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                      {doctors.map((d) => (
                        <tr key={d.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{d.doctorCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{d.fullName || `${d.firstName || ''} ${d.lastName || ''}`.trim()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{d.specialization}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{d.phonePrimary || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{formatCurrency(d.consultationFee)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                            <button
                              onClick={() => { setEditingDoctor(d); setShowDoctorModal(true); }}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteDoctor(d.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {doctors.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No doctors found</div>
                  )}
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Appointments</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{appointment.appointmentCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{appointment.patientName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{appointment.doctorName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{appointment.appointmentDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${
                              appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                              appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                            }`}>
                              {appointment.status}
                            </span>
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
          </div>
        </div>

        {/* Patient Modal */}
        {showPatientModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-900">
              <h2 className="text-xl font-semibold mb-4">{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h2>
              <form onSubmit={handleSavePatient} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input name="patientCode" defaultValue={editingPatient?.patientCode} placeholder="Patient Code" className="input-field" required />
                  <input name="firstName" defaultValue={editingPatient?.firstName} placeholder="First Name" className="input-field" required />
                  <input name="lastName" defaultValue={editingPatient?.lastName} placeholder="Last Name" className="input-field" required />
                  <input name="dateOfBirth" type="date" defaultValue={editingPatient?.dateOfBirth} className="input-field" required />
                  <select name="gender" defaultValue={editingPatient?.gender} className="input-field" required>
                    <option value="">Select Gender</option>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                  <input name="phoneNumber" defaultValue={editingPatient?.phoneNumber} placeholder="Phone Number" className="input-field" required />
                  <input name="email" type="email" defaultValue={editingPatient?.email} placeholder="Email" className="input-field" />
                  <select name="bloodGroup" defaultValue={editingPatient?.bloodGroup} className="input-field">
                    <option value="">Blood Group</option>
                    <option value="O_POSITIVE">O_POSITIVE</option>
                    <option value="O_NEGATIVE">O_NEGATIVE</option>
                    <option value="A_POSITIVE">A_POSITIVE</option>
                    <option value="A_NEGATIVE">A_NEGATIVE</option>
                    <option value="B_POSITIVE">B_POSITIVE</option>
                    <option value="B_NEGATIVE">B_NEGATIVE</option>
                    <option value="AB_POSITIVE">AB_POSITIVE</option>
                    <option value="AB_NEGATIVE">AB_NEGATIVE</option>
                  </select>
                </div>
                <textarea name="address" defaultValue={editingPatient?.address} placeholder="Address" className="input-field w-full" rows="3" />
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => { setShowPatientModal(false); setEditingPatient(null); }} className="px-4 py-2 border rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Doctor Modal */}
        {showDoctorModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-900">
              <h2 className="text-xl font-semibold mb-4">{editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}</h2>
              <form onSubmit={handleSaveDoctor} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input name="doctorCode" defaultValue={editingDoctor?.doctorCode} placeholder="Doctor Code" className="border rounded px-3 py-2" required />
                  <input name="firstName" defaultValue={editingDoctor?.firstName} placeholder="First Name" className="border rounded px-3 py-2" required />
                  <input name="lastName" defaultValue={editingDoctor?.lastName} placeholder="Last Name" className="border rounded px-3 py-2" required />
                  <input name="specialization" defaultValue={editingDoctor?.specialization} placeholder="Specialization" className="border rounded px-3 py-2" required />
                  <input name="phoneNumber" defaultValue={editingDoctor?.phoneNumber} placeholder="Phone Number" className="border rounded px-3 py-2" required />
                  <input name="email" type="email" defaultValue={editingDoctor?.email} placeholder="Email" className="border rounded px-3 py-2" />
                  <input name="experience" type="number" defaultValue={editingDoctor?.experience} placeholder="Experience (years)" className="border rounded px-3 py-2" />
                  <input name="consultationFee" type="number" step="0.01" defaultValue={editingDoctor?.consultationFee} placeholder="Consultation Fee" className="border rounded px-3 py-2" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => { setShowDoctorModal(false); setEditingDoctor(null); }} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Patient Details Modal */}
        {showPatientDetails && patientDetails && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold">Patient Details</h3>
                <button onClick={() => setShowPatientDetails(false)} className="px-3 py-1 border rounded dark:border-gray-700">Close</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card">
                  <h4 className="font-semibold mb-2">Profile</h4>
                  <p><span className="text-gray-500">Name:</span> {patientDetails.name}</p>
                  <p><span className="text-gray-500">Email:</span> {patientDetails.email || '-'}</p>
                  <p><span className="text-gray-500">Gender:</span> {patientDetails.gender || '-'}</p>
                  <p><span className="text-gray-500">Blood Group:</span> {renderBloodGroup(patientDetails.bloodGroup)}</p>
                  <p><span className="text-gray-500">DOB:</span> {formatDate(patientDetails.birthdate)}</p>
                  <p><span className="text-gray-500">Created:</span> {formatDate(patientDetails.createdAt)}</p>
                </div>
                <div className="card">
                  <h4 className="font-semibold mb-2">Insurance</h4>
                  {patientDetails.insurance ? (
                    <div>
                      <p><span className="text-gray-500">Provider:</span> {patientDetails.insurance.provider || '-'}</p>
                      <p><span className="text-gray-500">Policy No:</span> {patientDetails.insurance.policyNumber || '-'}</p>
                      <p><span className="text-gray-500">Coverage:</span> {patientDetails.insurance.coverage || '-'}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500">No insurance on file</p>
                  )}
                </div>
              </div>

              <div className="card mt-4">
                <h4 className="font-semibold mb-2">Recent Appointments</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                      {(patientDetails.appointments || []).slice(0, 10).map((a) => (
                        <tr key={a.id}>
                          <td className="px-4 py-2 text-sm">{a.appointmentCode || a.id}</td>
                          <td className="px-4 py-2 text-sm">{a.doctorName || '-'}</td>
                          <td className="px-4 py-2 text-sm">{formatDate(a.appointmentDate)}</td>
                          <td className="px-4 py-2 text-sm">{a.status || '-'}</td>
                        </tr>
                      ))}
                      {(!patientDetails.appointments || patientDetails.appointments.length === 0) && (
                        <tr><td colSpan="4" className="px-4 py-4 text-center text-gray-500">No appointments</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;

