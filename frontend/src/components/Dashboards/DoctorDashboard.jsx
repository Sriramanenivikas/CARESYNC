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

  const [prescriptionItems, setPrescriptionItems] = useState([{
    medicineName: '',
    medicineType: 'TABLET',
    dosage: '',
    frequency: '',
    duration: '',
    quantity: '',
    route: 'ORAL',
    timing: 'AFTER_MEALS',
    instructions: ''
  }]);

  const addPrescriptionItem = () => {
    setPrescriptionItems([...prescriptionItems, {
      medicineName: '',
      medicineType: 'TABLET',
      dosage: '',
      frequency: '',
      duration: '',
      quantity: '',
      route: 'ORAL',
      timing: 'AFTER_MEALS',
      instructions: ''
    }]);
  };

  const removePrescriptionItem = (index) => {
    const items = prescriptionItems.filter((_, i) => i !== index);
    setPrescriptionItems(items.length > 0 ? items : [prescriptionItems[0]]);
  };

  const handleSavePrescription = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const prescriptionData = {
      prescriptionNumber: formData.get('prescriptionNumber'),
      patientId: formData.get('patientId'),
      doctorId: localStorage.getItem('userId'),
      appointmentId: formData.get('appointmentId'),
      prescriptionDate: formData.get('prescriptionDate'),
      diagnosis: formData.get('diagnosis'),
      chiefComplaints: formData.get('chiefComplaints'),
      followUpDate: formData.get('followUpDate'),
      specialInstructions: formData.get('specialInstructions'),
      items: prescriptionItems
    };

    try {
      await prescriptionService.createPrescription(prescriptionData);
      alert('Prescription created successfully');
      setShowPrescriptionModal(false);
      setPrescriptionItems([{
        medicineName: '',
        medicineType: 'TABLET',
        dosage: '',
        frequency: '',
        duration: '',
        quantity: '',
        route: 'ORAL',
        timing: 'AFTER_MEALS',
        instructions: ''
      }]);
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
            icon={<FaCalendarAlt className="text-primary-600" />}
            bgColor="bg-primary-50 dark:bg-primary-900/30"
            textColor="text-primary-900 dark:text-primary-100"
          />
          <StatCard
            title="Total Patients"
            value={stats.totalPatients || 0}
            icon={<FaUserInjured className="text-luxury-600" />}
            bgColor="bg-luxury-50 dark:bg-luxury-900/30"
            textColor="text-luxury-900 dark:text-luxury-100"
          />
          <StatCard
            title="Prescriptions Issued"
            value={stats.totalPrescriptions || 0}
            icon={<FaPrescriptionBottleAlt className="text-accent-600" />}
            bgColor="bg-accent-50 dark:bg-accent-900/30"
            textColor="text-accent-900 dark:text-accent-100"
          />
          <StatCard
            title="Completed Today"
            value={stats.completedToday || 0}
            icon={<FaClipboardList className="text-primary-700" />}
            bgColor="bg-primary-100 dark:bg-primary-800/30"
            textColor="text-primary-900 dark:text-primary-100"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="border-b dark:border-gray-800">
            <nav className="flex space-x-4 px-6">
              {['overview', 'appointments', 'patients', 'prescriptions'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-4 font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-primary-600 text-primary-600 dark:border-primary-500 dark:text-primary-400'
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
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setShowPrescriptionModal(true)}
                    className="p-4 border border-primary-300 rounded-lg hover:bg-primary-50 text-primary-600 font-medium flex items-center justify-center gap-2 dark:border-primary-700 dark:hover:bg-primary-900/30 dark:text-primary-400"
                  >
                    <FaPlus /> New Prescription
                  </button>
                  <button
                    onClick={() => setActiveTab('appointments')}
                    className="p-4 border rounded-lg hover:bg-gray-50 font-medium dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-200"
                  >
                    View Appointments
                  </button>
                  <button
                    onClick={() => setActiveTab('patients')}
                    className="p-4 border rounded-lg hover:bg-gray-50 font-medium dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-200"
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
                            <button className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300" title="View Details">
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
                              className="text-primary-600 hover:text-primary-800 mr-2 dark:text-primary-400 dark:hover:text-primary-300"
                              title="Prescribe"
                            >
                              <FaPrescriptionBottleAlt />
                            </button>
                            <button className="text-luxury-600 hover:text-luxury-800 dark:text-luxury-400 dark:hover:text-luxury-300" title="View Details">
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
                  <h2 className="text-xl font-semibold dark:text-white">Prescriptions</h2>
                  <button
                    onClick={() => setShowPrescriptionModal(true)}
                    className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 flex items-center gap-2 dark:bg-primary-700 dark:hover:bg-primary-600"
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-6xl w-full max-h-[95vh] overflow-y-auto dark:bg-gray-900">
              <h2 className="text-2xl font-bold mb-6 text-primary-700 dark:text-primary-400">New Prescription</h2>
              <form onSubmit={handleSavePrescription} className="space-y-6">

                {/* Basic Prescription Information - Gold Section */}
                <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-200 dark:border-primary-800">
                  <h3 className="text-lg font-semibold mb-3 text-primary-800 dark:text-primary-300">Prescription Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-gray-300">Prescription Number</label>
                      <input
                        name="prescriptionNumber"
                        placeholder="Auto-generated or manual"
                        className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-gray-300">Prescription Date *</label>
                      <input
                        name="prescriptionDate"
                        type="date"
                        defaultValue={new Date().toISOString().split('T')[0]}
                        className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-gray-300">Patient *</label>
                      <select
                        name="patientId"
                        defaultValue={selectedPatient?.id || ''}
                        className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        required
                      >
                        <option value="">Select Patient</option>
                        {patients.map(patient => (
                          <option key={patient.id} value={patient.id}>
                            {patient.firstName} {patient.lastName} ({patient.patientCode})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-gray-300">Appointment (Optional)</label>
                      <select
                        name="appointmentId"
                        className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                      >
                        <option value="">Select Appointment</option>
                        {appointments.map(apt => (
                          <option key={apt.id} value={apt.id}>
                            {apt.appointmentCode} - {apt.appointmentDate} {apt.appointmentTime}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Medical Information - Luxury Gold Section */}
                <div className="bg-luxury-50 dark:bg-luxury-900/20 p-4 rounded-lg border border-luxury-200 dark:border-luxury-800">
                  <h3 className="text-lg font-semibold mb-3 text-luxury-800 dark:text-luxury-300">Medical Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-gray-300">Chief Complaints *</label>
                      <textarea
                        name="chiefComplaints"
                        placeholder="Patient's main complaints and symptoms"
                        className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        rows="2"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 dark:text-gray-300">Diagnosis *</label>
                      <textarea
                        name="diagnosis"
                        placeholder="Medical diagnosis"
                        className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        rows="2"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Follow-up Date</label>
                        <input
                          name="followUpDate"
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1 dark:text-gray-300">Special Instructions</label>
                        <input
                          name="specialInstructions"
                          placeholder="e.g., Avoid alcohol, Complete the course"
                          className="w-full border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Prescription Items - Rose Gold Section */}
                <div className="bg-accent-50 dark:bg-accent-900/20 p-4 rounded-lg border border-accent-200 dark:border-accent-800">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-accent-800 dark:text-accent-300">Medications</h3>
                    <button
                      type="button"
                      onClick={addPrescriptionItem}
                      className="bg-accent-600 text-white px-3 py-1 rounded hover:bg-accent-700 text-sm flex items-center gap-1 dark:bg-accent-700 dark:hover:bg-accent-600"
                    >
                      <FaPlus /> Add Medicine
                    </button>
                  </div>

                  <div className="space-y-4">
                    {prescriptionItems.map((item, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded border border-accent-200 dark:border-accent-700">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-accent-700 dark:text-accent-400">Medicine #{index + 1}</h4>
                          {prescriptionItems.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removePrescriptionItem(index)}
                              className="text-red-600 hover:text-red-800 text-sm dark:text-red-400"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Medicine Name *</label>
                            <input
                              value={item.medicineName}
                              onChange={(e) => {
                                const items = [...prescriptionItems];
                                items[index].medicineName = e.target.value;
                                setPrescriptionItems(items);
                              }}
                              placeholder="e.g., Paracetamol"
                              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Type *</label>
                            <select
                              value={item.medicineType}
                              onChange={(e) => {
                                const items = [...prescriptionItems];
                                items[index].medicineType = e.target.value;
                                setPrescriptionItems(items);
                              }}
                              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              required
                            >
                              <option value="TABLET">Tablet</option>
                              <option value="CAPSULE">Capsule</option>
                              <option value="SYRUP">Syrup</option>
                              <option value="INJECTION">Injection</option>
                              <option value="CREAM">Cream</option>
                              <option value="OINTMENT">Ointment</option>
                              <option value="DROPS">Drops</option>
                              <option value="INHALER">Inhaler</option>
                              <option value="POWDER">Powder</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Dosage *</label>
                            <input
                              value={item.dosage}
                              onChange={(e) => {
                                const items = [...prescriptionItems];
                                items[index].dosage = e.target.value;
                                setPrescriptionItems(items);
                              }}
                              placeholder="e.g., 500mg"
                              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Frequency *</label>
                            <input
                              value={item.frequency}
                              onChange={(e) => {
                                const items = [...prescriptionItems];
                                items[index].frequency = e.target.value;
                                setPrescriptionItems(items);
                              }}
                              placeholder="e.g., Twice daily, 1-0-1"
                              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Duration *</label>
                            <input
                              value={item.duration}
                              onChange={(e) => {
                                const items = [...prescriptionItems];
                                items[index].duration = e.target.value;
                                setPrescriptionItems(items);
                              }}
                              placeholder="e.g., 7 days, 2 weeks"
                              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Quantity</label>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => {
                                const items = [...prescriptionItems];
                                items[index].quantity = e.target.value;
                                setPrescriptionItems(items);
                              }}
                              placeholder="Number of units"
                              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Route *</label>
                            <select
                              value={item.route}
                              onChange={(e) => {
                                const items = [...prescriptionItems];
                                items[index].route = e.target.value;
                                setPrescriptionItems(items);
                              }}
                              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              required
                            >
                              <option value="ORAL">Oral</option>
                              <option value="INJECTION">Injection</option>
                              <option value="TOPICAL">Topical</option>
                              <option value="INHALATION">Inhalation</option>
                              <option value="RECTAL">Rectal</option>
                              <option value="SUBLINGUAL">Sublingual</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Timing *</label>
                            <select
                              value={item.timing}
                              onChange={(e) => {
                                const items = [...prescriptionItems];
                                items[index].timing = e.target.value;
                                setPrescriptionItems(items);
                              }}
                              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              required
                            >
                              <option value="BEFORE_MEALS">Before Meals</option>
                              <option value="AFTER_MEALS">After Meals</option>
                              <option value="WITH_MEALS">With Meals</option>
                              <option value="EMPTY_STOMACH">Empty Stomach</option>
                              <option value="BEDTIME">Bedtime</option>
                              <option value="AS_NEEDED">As Needed</option>
                            </select>
                          </div>
                          <div className="md:col-span-3">
                            <label className="block text-sm font-medium mb-1 dark:text-gray-300">Special Instructions</label>
                            <input
                              value={item.instructions}
                              onChange={(e) => {
                                const items = [...prescriptionItems];
                                items[index].instructions = e.target.value;
                                setPrescriptionItems(items);
                              }}
                              placeholder="e.g., Take with plenty of water, Avoid sun exposure"
                              className="w-full border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPrescriptionModal(false);
                      setSelectedPatient(null);
                      setPrescriptionItems([{
                        medicineName: '',
                        medicineType: 'TABLET',
                        dosage: '',
                        frequency: '',
                        duration: '',
                        quantity: '',
                        route: 'ORAL',
                        timing: 'AFTER_MEALS',
                        instructions: ''
                      }]);
                    }}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-600"
                  >
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

