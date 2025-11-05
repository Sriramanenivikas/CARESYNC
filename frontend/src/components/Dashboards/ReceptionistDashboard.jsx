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
      phoneNumber: formData.get('phoneNumber'),
      email: formData.get('email'),
      address: formData.get('address'),
      bloodGroup: formData.get('bloodGroup'),
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
      patientId: formData.get('patientId'),
      doctorId: formData.get('doctorId'),
      appointmentDate: formData.get('appointmentDate'),
      appointmentTime: formData.get('appointmentTime'),
      reason: formData.get('reason'),
      appointmentType: formData.get('appointmentType'),
      status: 'PENDING'
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-900">
              <h2 className="text-xl font-semibold mb-4">Register New Patient</h2>
              <form onSubmit={handleSavePatient} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input name="patientCode" placeholder="Patient Code" className="input-field" required />
                  <input name="firstName" placeholder="First Name" className="input-field" required />
                  <input name="lastName" placeholder="Last Name" className="input-field" required />
                  <input name="dateOfBirth" type="date" className="input-field" required />
                  <select name="gender" className="input-field" required>
                    <option value="">Select Gender</option>
                    <option value="MALE">MALE</option>
                    <option value="FEMALE">FEMALE</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                  <input name="phoneNumber" placeholder="Phone Number" className="input-field" required />
                  <input name="email" type="email" placeholder="Email" className="input-field" />
                  <select name="bloodGroup" className="input-field">
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
                <textarea name="address" placeholder="Address" className="input-field w-full" rows="3" />
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowPatientModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Register</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Appointment Modal */}
        {showAppointmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full dark:bg-gray-900">
              <h2 className="text-xl font-semibold mb-4">Schedule Appointment</h2>
              <form onSubmit={handleSaveAppointment} className="space-y-4">
                <select name="patientId" className="w-full input-field" required>
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name || `${p.firstName} ${p.lastName}`} ({p.patientCode})</option>
                  ))}
                </select>
                <select name="doctorId" className="w-full input-field" required>
                  <option value="">Select Doctor</option>
                  <option value="1">Dr. Smith - Cardiology</option>
                  <option value="2">Dr. Johnson - Orthopedics</option>
                </select>
                <input name="appointmentDate" type="date" className="w-full input-field" required />
                <input name="appointmentTime" type="time" className="w-full input-field" required />
                <select name="appointmentType" className="w-full input-field" required>
                  <option value="">Select Type</option>
                  <option value="CONSULTATION">Consultation</option>
                  <option value="FOLLOW_UP">Follow-up</option>
                  <option value="EMERGENCY">Emergency</option>
                </select>
                <textarea name="reason" placeholder="Reason for visit" className="w-full input-field" rows="3" required />
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowAppointmentModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Schedule</button>
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
