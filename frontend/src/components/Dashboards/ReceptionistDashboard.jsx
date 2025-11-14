import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Layout/DashboardLayout';
import StatCard from '../Layout/StatCard';
import dashboardService from '../../services/dashboardService';
import appointmentService from '../../services/appointmentService';
import patientService from '../../services/patientService';
import { FaCalendarAlt, FaUsers, FaPlus, FaEdit, FaCheckCircle } from 'react-icons/fa';

const ReceptionistDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingAppointments: 0,
    totalPatients: 0,
    checkedIn: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
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
      const pending = (data || []).filter(a => a.status === 'PENDING');
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

  const handleSavePatient = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const patientData = {
      patientCode: formData.get('patientCode'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      dateOfBirth: formData.get('dateOfBirth'),
      gender: formData.get('gender'),
      phonePrimary: formData.get('phonePrimary'),
      phoneSecondary: formData.get('phoneSecondary') || null,
      email: formData.get('email') || null,
      addressLine1: formData.get('addressLine1') || null,
      addressLine2: formData.get('addressLine2') || null,
      city: formData.get('city') || null,
      state: formData.get('state') || null,
      country: formData.get('country') || null,
      postalCode: formData.get('postalCode') || null,
      bloodGroup: formData.get('bloodGroup') || null,
      maritalStatus: formData.get('maritalStatus') || null,
      occupation: formData.get('occupation') || null,
      registrationDate: formData.get('registrationDate') || new Date().toISOString().split('T')[0],
      isActive: true
    };

    try {
      await patientService.createPatient(patientData);
      alert('Patient registered successfully');
      setShowPatientModal(false);
      fetchPatients();
    } catch (err) {
      alert('Failed to register patient: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleSaveAppointment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const appointmentData = {
      appointmentCode: formData.get('appointmentCode'),
      patientId: formData.get('patientId'),
      doctorId: formData.get('doctorId'),
      departmentId: formData.get('departmentId') || 1, // Default department
      appointmentDate: formData.get('appointmentDate'),
      appointmentTime: formData.get('appointmentTime'),
      appointmentType: formData.get('appointmentType'),
      priority: formData.get('priority') || 'NORMAL',
      reason: formData.get('reason'),
      symptoms: formData.get('symptoms') || null,
      notes: formData.get('notes') || null,
      consultationFee: formData.get('consultationFee') || null,
      status: 'SCHEDULED'
    };

    try {
      await appointmentService.createAppointment(appointmentData);
      alert('Appointment scheduled successfully');
      setShowAppointmentModal(false);
      fetchAppointments();
    } catch (err) {
      alert('Failed to schedule appointment: ' + (err.response?.data?.message || err.message));
    }
  };

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
            title="Today's Appointments"
            value={stats.todayAppointments || 0}
            icon={<FaCalendarAlt className="text-blue-600" />}
            bgColor="bg-blue-50 dark:bg-blue-900/30"
            textColor="text-blue-900 dark:text-blue-100"
          />
          <StatCard
            title="Pending Appointments"
            value={stats.pendingAppointments || 0}
            icon={<FaCalendarAlt className="text-yellow-600" />}
            bgColor="bg-yellow-50 dark:bg-yellow-900/30"
            textColor="text-yellow-900 dark:text-yellow-100"
          />
          <StatCard
            title="Total Patients"
            value={stats.totalPatients || 0}
            icon={<FaUsers className="text-green-600" />}
            bgColor="bg-green-50 dark:bg-green-900/30"
            textColor="text-green-900 dark:text-green-100"
          />
          <StatCard
            title="Checked In Today"
            value={stats.checkedIn || 0}
            icon={<FaCheckCircle className="text-purple-600" />}
            bgColor="bg-purple-50 dark:bg-purple-900/30"
            textColor="text-purple-900 dark:text-purple-100"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="border-b dark:border-gray-800">
            <nav className="flex space-x-4 px-6">
              {['overview', 'appointments', 'patients'].map(tab => (
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
                    onClick={() => setShowPatientModal(true)}
                    className="p-4 border border-blue-300 rounded-lg hover:bg-blue-50 text-blue-600 font-medium flex items-center justify-center gap-2"
                  >
                    <FaPlus /> Register Patient
                  </button>
                  <button
                    onClick={() => setShowAppointmentModal(true)}
                    className="p-4 border border-green-300 rounded-lg hover:bg-green-50 text-green-600 font-medium flex items-center justify-center gap-2"
                  >
                    <FaPlus /> Schedule Appointment
                  </button>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="p-4 border rounded-lg hover:bg-gray-50 font-medium"
                  >
                    View Today's Schedule
                  </button>
                </div>

                {/* Today's Appointments Preview */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Today's Appointments</h3>
                  <div className="space-y-2">
                    {appointments.slice(0, 5).map((appointment) => (
                      <div key={appointment.id} className="p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{appointment.patientName}</p>
                          <p className="text-sm text-gray-600">
                            Dr. {appointment.doctorName} - {appointment.appointmentTime}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded text-sm ${
                          appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
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
                  <h2 className="text-xl font-semibold">Appointments</h2>
                  <button
                    onClick={() => setShowAppointmentModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FaPlus /> Schedule Appointment
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Doctor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{appointment.appointmentCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{appointment.patientName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">Dr. {appointment.doctorName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{appointment.appointmentDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{appointment.appointmentTime}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${
                              appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                              appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-2" title="Edit">
                              <FaEdit />
                            </button>
                            <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300" title="Check In">
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
                  <h2 className="text-xl font-semibold">Patients</h2>
                  <button
                    onClick={() => setShowPatientModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FaPlus /> Register Patient
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Blood Group</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                      {patients.map((patient) => (
                        <tr key={patient.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.patientCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.name || `${patient.firstName} ${patient.lastName}`}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.gender}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.phoneNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.bloodGroup}</td>
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

        {/* Patient Modal */}
        {showPatientModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-900 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Register New Patient</h2>
                <button
                  type="button"
                  onClick={() => setShowPatientModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSavePatient} className="space-y-6">
                {/* Personal Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Patient Code *</label>
                      <input name="patientCode" placeholder="PAT-001" className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">First Name *</label>
                      <input name="firstName" placeholder="John" className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Last Name *</label>
                      <input name="lastName" placeholder="Doe" className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date of Birth *</label>
                      <input name="dateOfBirth" type="date" className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Gender *</label>
                      <select name="gender" className="input-field" required>
                        <option value="">Select Gender</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Blood Group</label>
                      <select name="bloodGroup" className="input-field">
                        <option value="">Select Blood Group</option>
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
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Marital Status</label>
                      <select name="maritalStatus" className="input-field">
                        <option value="">Select Status</option>
                        <option value="SINGLE">Single</option>
                        <option value="MARRIED">Married</option>
                        <option value="DIVORCED">Divorced</option>
                        <option value="WIDOWED">Widowed</option>
                        <option value="SEPARATED">Separated</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Occupation</label>
                      <input name="occupation" placeholder="Software Engineer" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Registration Date</label>
                      <input name="registrationDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="input-field" />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Primary Phone *</label>
                      <input name="phonePrimary" type="tel" placeholder="+1 234 567 8900" className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Secondary Phone</label>
                      <input name="phoneSecondary" type="tel" placeholder="+1 234 567 8901" className="input-field" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Email</label>
                      <input name="email" type="email" placeholder="john.doe@example.com" className="input-field" />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="pb-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Address Line 1</label>
                      <input name="addressLine1" placeholder="123 Main Street" className="input-field" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Address Line 2</label>
                      <input name="addressLine2" placeholder="Apt 4B" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">City</label>
                      <input name="city" placeholder="New York" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">State</label>
                      <input name="state" placeholder="NY" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Country</label>
                      <input name="country" placeholder="United States" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Postal Code</label>
                      <input name="postalCode" placeholder="10001" className="input-field" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowPatientModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition"
                  >
                    Register Patient
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Appointment Modal */}
        {showAppointmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-900 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Schedule Appointment</h2>
                <button
                  type="button"
                  onClick={() => setShowAppointmentModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSaveAppointment} className="space-y-6">
                {/* Appointment Details */}
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Appointment Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Appointment Code *</label>
                      <input name="appointmentCode" placeholder="APT-001" className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Select Patient *</label>
                      <select name="patientId" className="input-field" required>
                        <option value="">Select Patient</option>
                        {patients.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name || `${p.firstName} ${p.lastName}`} ({p.patientCode})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Select Doctor *</label>
                      <select name="doctorId" className="input-field" required>
                        <option value="">Select Doctor</option>
                        <option value="1">Dr. Smith - Cardiology</option>
                        <option value="2">Dr. Johnson - Orthopedics</option>
                        <option value="3">Dr. Williams - Neurology</option>
                        <option value="4">Dr. Brown - Pediatrics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Department</label>
                      <select name="departmentId" className="input-field">
                        <option value="1">Cardiology</option>
                        <option value="2">Orthopedics</option>
                        <option value="3">Neurology</option>
                        <option value="4">Pediatrics</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Appointment Date *</label>
                      <input name="appointmentDate" type="date" className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Appointment Time *</label>
                      <input name="appointmentTime" type="time" className="input-field" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Appointment Type *</label>
                      <select name="appointmentType" className="input-field" required>
                        <option value="">Select Type</option>
                        <option value="CONSULTATION">Consultation</option>
                        <option value="FOLLOW_UP">Follow-up</option>
                        <option value="EMERGENCY">Emergency</option>
                        <option value="CHECKUP">Checkup</option>
                        <option value="PROCEDURE">Procedure</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Priority</label>
                      <select name="priority" className="input-field">
                        <option value="NORMAL">Normal</option>
                        <option value="LOW">Low</option>
                        <option value="HIGH">High</option>
                        <option value="EMERGENCY">Emergency</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Consultation Fee ($)</label>
                      <input name="consultationFee" type="number" step="0.01" min="0" placeholder="150.00" className="input-field" />
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="pb-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Medical Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Reason for Visit *</label>
                      <textarea name="reason" placeholder="Enter reason for visit..." className="input-field w-full" rows="2" required />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Symptoms</label>
                      <textarea name="symptoms" placeholder="Describe symptoms..." className="input-field w-full" rows="2" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Additional Notes</label>
                      <textarea name="notes" placeholder="Any additional notes..." className="input-field w-full" rows="2" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => setShowAppointmentModal(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-md hover:shadow-lg transition"
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
