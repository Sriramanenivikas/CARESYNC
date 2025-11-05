import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Layout/DashboardLayout';
import StatCard from '../Layout/StatCard';
import dashboardService from '../../services/dashboardService';
import appointmentService from '../../services/appointmentService';
import prescriptionService from '../../services/prescriptionService';
import patientService from '../../services/patientService';
import { FaCalendarAlt, FaUserInjured, FaPrescriptionBottleAlt, FaClipboardList, FaPlus, FaEye } from 'react-icons/fa';

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    totalPrescriptions: 0,
    completedToday: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard/doctor', icon: <FaClipboardList /> },
    { label: 'Appointments', path: '#appointments', icon: <FaCalendarAlt />, onClick: () => setActiveTab('appointments') },
    { label: 'Patients', path: '#patients', icon: <FaUserInjured />, onClick: () => setActiveTab('patients') },
    { label: 'Prescriptions', path: '#prescriptions', icon: <FaPrescriptionBottleAlt />, onClick: () => setActiveTab('prescriptions') },
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchAppointments();
    fetchPatients();
    fetchPrescriptions();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dashboardService.getDoctorDashboard();
      setStats((prev) => ({ ...prev, ...(data.stats || data || {}) }));
    } catch (err) {
      console.error(err);
      setError('Failed to load doctor dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const data = await appointmentService.getAppointmentsByDoctor(userId);
      setAppointments(data || []);
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = (data || []).filter(a => a.appointmentDate === today);
      setStats(prev => ({ ...prev, todayAppointments: todayAppts.length }));
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

  const fetchPrescriptions = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const data = await prescriptionService.getPrescriptionsByDoctor(userId);
      setPrescriptions(data || []);
      setStats(prev => ({ ...prev, totalPrescriptions: data?.length || 0 }));
    } catch (err) {
      console.error('Failed to fetch prescriptions:', err);
    }
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const prescriptionData = {
      patientId: formData.get('patientId'),
      medication: formData.get('medication'),
      dosage: formData.get('dosage'),
      frequency: formData.get('frequency'),
      duration: formData.get('duration'),
      instructions: formData.get('instructions'),
    };

    try {
      await prescriptionService.createPrescription(prescriptionData);
      alert('Prescription created successfully');
      setShowPrescriptionModal(false);
      fetchPrescriptions();
    } catch (err) {
      alert('Failed to create prescription: ' + (err.response?.data?.message || err.message));
    }
  };

  if (loading && activeTab === 'overview') {
    return <DashboardLayout menuItems={menuItems}><div className="flex items-center justify-center h-64"><div className="text-lg">Loading...</div></div></DashboardLayout>;
  }

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="space-y-6">
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Today's Appointments"
            value={stats.todayAppointments || 0}
            icon={<FaCalendarAlt className="text-blue-600" />}
            bgColor="bg-blue-50"
          />
          <StatCard
            title="Total Patients"
            value={stats.totalPatients || 0}
            icon={<FaUserInjured className="text-green-600" />}
            bgColor="bg-green-50"
          />
          <StatCard
            title="Prescriptions Issued"
            value={stats.totalPrescriptions || 0}
            icon={<FaPrescriptionBottleAlt className="text-purple-600" />}
            bgColor="bg-purple-50"
          />
          <StatCard
            title="Completed Today"
            value={stats.completedToday || 0}
            icon={<FaClipboardList className="text-yellow-600" />}
            bgColor="bg-yellow-50"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b">
            <nav className="flex space-x-4 px-6">
              {['overview', 'appointments', 'patients', 'prescriptions'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-4 font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
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
                    onClick={() => setShowPrescriptionModal(true)}
                    className="p-4 border border-blue-300 rounded-lg hover:bg-blue-50 text-blue-600 font-medium flex items-center justify-center gap-2"
                  >
                    <FaPlus /> New Prescription
                  </button>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="p-4 border rounded-lg hover:bg-gray-50 font-medium"
                  >
                    View Appointments
                  </button>
                  <button
                    onClick={() => setActiveTab('patients')}
                    className="p-4 border rounded-lg hover:bg-gray-50 font-medium"
                  >
                    View Patients
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
                          <p className="text-sm text-gray-600">{appointment.appointmentTime} - {appointment.reason}</p>
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
                      <p className="text-gray-500 text-center py-4">No appointments scheduled for today</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{appointment.appointmentCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{appointment.patientName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{appointment.appointmentDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{appointment.appointmentTime}</td>
                          <td className="px-6 py-4 text-sm">{appointment.reason}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${
                              appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-800" title="View Details">
                              <FaEye />
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
                <h2 className="text-xl font-semibold mb-4">Patients</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Blood Group</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {patients.map((patient) => (
                        <tr key={patient.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.patientCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.firstName} {patient.lastName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.gender}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.phoneNumber}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.bloodGroup}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => { setSelectedPatient(patient); setShowPrescriptionModal(true); }}
                              className="text-blue-600 hover:text-blue-800 mr-2"
                              title="Prescribe"
                            >
                              <FaPrescriptionBottleAlt />
                            </button>
                            <button className="text-green-600 hover:text-green-800" title="View Details">
                              <FaEye />
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

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Prescriptions</h2>
                  <button
                    onClick={() => setShowPrescriptionModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FaPlus /> New Prescription
                  </button>
                </div>
                <div className="space-y-4">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{prescription.patientName}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Medication:</strong> {prescription.medication}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Dosage:</strong> {prescription.dosage} | <strong>Frequency:</strong> {prescription.frequency}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Duration:</strong> {prescription.duration}
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">{prescription.createdAt}</span>
                      </div>
                    </div>
                  ))}
                  {prescriptions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No prescriptions found</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Prescription Modal */}
        {showPrescriptionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">New Prescription</h2>
              <form onSubmit={handleSavePrescription} className="space-y-4">
                <div className="space-y-4">
                  <select
                    name="patientId"
                    defaultValue={selectedPatient?.id || ''}
                    className="w-full border rounded px-3 py-2"
                    required
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} ({patient.patientCode})
                      </option>
                    ))}
                  </select>
                  <input name="medication" placeholder="Medication Name" className="w-full border rounded px-3 py-2" required />
                  <input name="dosage" placeholder="Dosage (e.g., 500mg)" className="w-full border rounded px-3 py-2" required />
                  <input name="frequency" placeholder="Frequency (e.g., Twice daily)" className="w-full border rounded px-3 py-2" required />
                  <input name="duration" placeholder="Duration (e.g., 7 days)" className="w-full border rounded px-3 py-2" required />
                  <textarea name="instructions" placeholder="Special Instructions" className="w-full border rounded px-3 py-2" rows="3" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => { setShowPrescriptionModal(false); setSelectedPatient(null); }}
                    className="px-4 py-2 border rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Create Prescription
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

export default DoctorDashboard;

