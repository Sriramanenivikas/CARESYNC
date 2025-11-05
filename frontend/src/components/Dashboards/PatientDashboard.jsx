import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Layout/DashboardLayout';
import StatCard from '../Layout/StatCard';
import dashboardService from '../../services/dashboardService';
import appointmentService from '../../services/appointmentService';
import prescriptionService from '../../services/prescriptionService';
import billingService from '../../services/billingService';
import { FaCalendarAlt, FaPrescriptionBottleAlt, FaDollarSign, FaNotesMedical, FaPlus } from 'react-icons/fa';

const PatientDashboard = () => {
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    activePrescriptions: 0,
    pendingBills: 0,
    totalVisits: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard/patient', icon: <FaNotesMedical /> },
    { label: 'Appointments', path: '#appointments', icon: <FaCalendarAlt />, onClick: () => setActiveTab('appointments') },
    { label: 'Prescriptions', path: '#prescriptions', icon: <FaPrescriptionBottleAlt />, onClick: () => setActiveTab('prescriptions') },
    { label: 'Bills', path: '#bills', icon: <FaDollarSign />, onClick: () => setActiveTab('bills') },
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchAppointments();
    fetchPrescriptions();
    fetchBills();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dashboardService.getPatientDashboard();
      setStats((prev) => ({ ...prev, ...(data.stats || data || {}) }));
    } catch (err) {
      console.error(err);
      setError('Failed to load patient dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const data = await appointmentService.getAppointmentsByPatient(userId);
      setAppointments(data || []);
      setStats(prev => ({ ...prev, upcomingAppointments: data?.length || 0 }));
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const data = await prescriptionService.getPrescriptionsByPatient(userId);
      setPrescriptions(data || []);
      setStats(prev => ({ ...prev, activePrescriptions: data?.length || 0 }));
    } catch (err) {
      console.error('Failed to fetch prescriptions:', err);
    }
  };

  const fetchBills = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const data = await billingService.getBillsByPatient(userId);
      setBills(data || []);
      const pending = (data || []).filter(b => b.paymentStatus === 'PENDING');
      setStats(prev => ({ ...prev, pendingBills: pending.length }));
    } catch (err) {
      console.error('Failed to fetch bills:', err);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const appointmentData = {
      doctorId: formData.get('doctorId'),
      appointmentDate: formData.get('appointmentDate'),
      appointmentTime: formData.get('appointmentTime'),
      reason: formData.get('reason'),
      symptoms: formData.get('symptoms'),
    };

    try {
      await appointmentService.createAppointment(appointmentData);
      alert('Appointment booked successfully');
      setShowAppointmentModal(false);
      fetchAppointments();
    } catch (err) {
      alert('Failed to book appointment: ' + (err.response?.data?.message || err.message));
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
            title="Upcoming Appointments"
            value={stats.upcomingAppointments || 0}
            icon={<FaCalendarAlt className="text-blue-600" />}
            bgColor="bg-blue-50 dark:bg-blue-900/30"
            textColor="text-blue-900 dark:text-blue-100"
          />
          <StatCard
            title="Active Prescriptions"
            value={stats.activePrescriptions || 0}
            icon={<FaPrescriptionBottleAlt className="text-green-600" />}
            bgColor="bg-green-50 dark:bg-green-900/30"
            textColor="text-green-900 dark:text-green-100"
          />
          <StatCard
            title="Pending Bills"
            value={stats.pendingBills || 0}
            icon={<FaDollarSign className="text-red-600" />}
            bgColor="bg-red-50 dark:bg-red-900/30"
            textColor="text-red-900 dark:text-red-100"
          />
          <StatCard
            title="Total Visits"
            value={stats.totalVisits || 0}
            icon={<FaNotesMedical className="text-purple-600" />}
            bgColor="bg-purple-50 dark:bg-purple-900/30"
            textColor="text-purple-900 dark:text-purple-100"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="border-b dark:border-gray-800">
            <nav className="flex space-x-4 px-6">
              {['overview', 'appointments', 'prescriptions', 'bills'].map(tab => (
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
              <div className="space-y-6">
                <div>
                  <button
                    onClick={() => setShowAppointmentModal(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2 mb-4"
                  >
                    <FaPlus /> Book New Appointment
                  </button>
                </div>

                {/* Upcoming Appointments */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Upcoming Appointments</h3>
                  <div className="space-y-2">
                    {appointments.slice(0, 3).map((appointment) => (
                      <div key={appointment.id} className="p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">Dr. {appointment.doctorName}</p>
                            <p className="text-sm text-gray-600">
                              {appointment.appointmentDate} at {appointment.appointmentTime}
                            </p>
                            <p className="text-sm text-gray-600">{appointment.reason}</p>
                          </div>
                          <span className={`px-3 py-1 rounded text-sm ${
                            appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {appointments.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No upcoming appointments</p>
                    )}
                  </div>
                </div>

                {/* Recent Prescriptions */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recent Prescriptions</h3>
                  <div className="space-y-2">
                    {prescriptions.slice(0, 3).map((prescription) => (
                      <div key={prescription.id} className="p-4 border rounded-lg">
                        <p className="font-medium">{prescription.medication}</p>
                        <p className="text-sm text-gray-600">
                          Dosage: {prescription.dosage} | Frequency: {prescription.frequency}
                        </p>
                        <p className="text-sm text-gray-600">Duration: {prescription.duration}</p>
                      </div>
                    ))}
                    {prescriptions.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No prescriptions</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Tab */}
            {activeTab === 'appointments' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">My Appointments</h2>
                  <button
                    onClick={() => setShowAppointmentModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    <FaPlus /> Book Appointment
                  </button>
                </div>
                <div className="space-y-3">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-lg">Dr. {appointment.doctorName}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Date:</strong> {appointment.appointmentDate} at {appointment.appointmentTime}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Reason:</strong> {appointment.reason}
                          </p>
                          {appointment.symptoms && (
                            <p className="text-sm text-gray-600">
                              <strong>Symptoms:</strong> {appointment.symptoms}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            <strong>Code:</strong> {appointment.appointmentCode}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded text-sm ${
                          appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {appointments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No appointments found</div>
                  )}
                </div>
              </div>
            )}

            {/* Prescriptions Tab */}
            {activeTab === 'prescriptions' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">My Prescriptions</h2>
                <div className="space-y-3">
                  {prescriptions.map((prescription) => (
                    <div key={prescription.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-lg">{prescription.medication}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Prescribed by:</strong> Dr. {prescription.doctorName}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Dosage:</strong> {prescription.dosage}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Frequency:</strong> {prescription.frequency}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Duration:</strong> {prescription.duration}
                          </p>
                          {prescription.instructions && (
                            <p className="text-sm text-gray-600 mt-2">
                              <strong>Instructions:</strong> {prescription.instructions}
                            </p>
                          )}
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

            {/* Bills Tab */}
            {activeTab === 'bills' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">My Bills</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Bill Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                      {bills.map((bill) => (
                        <tr key={bill.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{bill.billCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{bill.billDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">${bill.totalAmount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${
                              bill.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                              bill.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                              'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200'
                            }`}>
                              {bill.paymentStatus}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">View</button>
                            {bill.paymentStatus === 'PENDING' && (
                              <button className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 ml-3">Pay Now</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {bills.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No bills found</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Appointment Modal */}
        {showAppointmentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto dark:bg-gray-900">
              <h2 className="text-xl font-semibold mb-4">Book New Appointment</h2>
              <form onSubmit={handleBookAppointment} className="space-y-4">
                <div className="space-y-4">
                  <select name="doctorId" className="w-full border rounded px-3 py-2" required>
                    <option value="">Select Doctor</option>
                    <option value="1">Dr. Smith - Cardiology</option>
                    <option value="2">Dr. Johnson - Orthopedics</option>
                    <option value="3">Dr. Williams - General Medicine</option>
                  </select>
                  <input name="appointmentDate" type="date" className="w-full border rounded px-3 py-2" required />
                  <input name="appointmentTime" type="time" className="w-full border rounded px-3 py-2" required />
                  <input name="reason" placeholder="Reason for visit" className="w-full border rounded px-3 py-2" required />
                  <textarea name="symptoms" placeholder="Describe your symptoms (optional)" className="w-full border rounded px-3 py-2" rows="3" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => setShowAppointmentModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Book Appointment</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PatientDashboard;

