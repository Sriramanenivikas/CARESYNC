import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Layout/DashboardLayout';
import StatCard from '../Layout/StatCard';
import dashboardService from '../../services/dashboardService';
import patientService from '../../services/patientService';
import { FaHeartbeat, FaUserInjured, FaNotesMedical, FaSyringe } from 'react-icons/fa';

const NurseDashboard = () => {
  const [stats, setStats] = useState({
    assignedPatients: 0,
    vitalChecks: 0,
    medications: 0,
    emergencies: 0,
  });
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard/nurse', icon: <FaHeartbeat /> },
    { label: 'Patients', path: '#patients', icon: <FaUserInjured />, onClick: () => setActiveTab('patients') },
    { label: 'Vitals', path: '#vitals', icon: <FaNotesMedical />, onClick: () => setActiveTab('vitals') },
    { label: 'Medications', path: '#medications', icon: <FaSyringe />, onClick: () => setActiveTab('medications') },
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchPatients();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dashboardService.getNurseDashboard();
      setStats((prev) => ({ ...prev, ...(data.stats || data || {}) }));
    } catch (err) {
      console.error(err);
      setError('Failed to load nurse dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    try {
      const data = await patientService.getAllPatients();
      setPatients(data || []);
      setStats(prev => ({ ...prev, assignedPatients: data?.length || 0 }));
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    }
  };

  const handleRecordVitals = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const vitalsData = {
      patientId: selectedPatient?.id,
      bloodPressure: formData.get('bloodPressure'),
      heartRate: formData.get('heartRate'),
      temperature: formData.get('temperature'),
      oxygenSaturation: formData.get('oxygenSaturation'),
      respiratoryRate: formData.get('respiratoryRate'),
      notes: formData.get('notes'),
    };

    console.log('Recording vitals:', vitalsData);
    alert('Vitals recorded successfully');
    setShowVitalsModal(false);
    setSelectedPatient(null);
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
            title="Assigned Patients"
            value={stats.assignedPatients || 0}
            icon={<FaUserInjured className="text-blue-600" />}
            bgColor="bg-blue-50 dark:bg-blue-900/30"
            textColor="text-blue-900 dark:text-blue-100"
          />
          <StatCard
            title="Vitals Checked Today"
            value={stats.vitalChecks || 0}
            icon={<FaHeartbeat className="text-green-600" />}
            bgColor="bg-green-50 dark:bg-green-900/30"
            textColor="text-green-900 dark:text-green-100"
          />
          <StatCard
            title="Medications Given"
            value={stats.medications || 0}
            icon={<FaSyringe className="text-purple-600" />}
            bgColor="bg-purple-50 dark:bg-purple-900/30"
            textColor="text-purple-900 dark:text-purple-100"
          />
          <StatCard
            title="Emergencies"
            value={stats.emergencies || 0}
            icon={<FaNotesMedical className="text-red-600" />}
            bgColor="bg-red-50 dark:bg-red-900/30"
            textColor="text-red-900 dark:text-red-100"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="border-b dark:border-gray-800">
            <nav className="flex space-x-4 px-6">
              {['overview', 'patients', 'vitals', 'medications'].map(tab => (
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
                <h2 className="text-xl font-semibold mb-4">Today's Tasks</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Pending Vitals Checks</h3>
                    <ul className="space-y-2">
                      {patients.slice(0, 5).map((patient) => (
                        <li key={patient.id} className="flex justify-between items-center">
                          <span className="text-sm">{patient.firstName} {patient.lastName}</span>
                          <button
                            onClick={() => { setSelectedPatient(patient); setShowVitalsModal(true); }}
                            className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                          >
                            Record Vitals
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">Medication Schedule</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li>9:00 AM - Patient A - Insulin</li>
                      <li>10:00 AM - Patient B - Antibiotic</li>
                      <li>11:00 AM - Patient C - Pain Relief</li>
                      <li>2:00 PM - Patient D - Blood Thinner</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Patients Tab */}
            {activeTab === 'patients' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Assigned Patients</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Age</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Blood Group</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                      {patients.map((patient) => (
                        <tr key={patient.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.patientCode}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.name || `${patient.firstName} ${patient.lastName}`}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">-</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{patient.bloodGroup}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => { setSelectedPatient(patient); setShowVitalsModal(true); }}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-2"
                            >
                              Record Vitals
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {patients.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No patients assigned</div>
                  )}
                </div>
              </div>
            )}

            {/* Vitals Tab */}
            {activeTab === 'vitals' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Vital Signs Records</h2>
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg">
                    <p className="font-medium">Patient: John Doe</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
                      <div>
                        <span className="text-gray-600">BP:</span> <span className="font-medium">120/80</span>
                      </div>
                      <div>
                        <span className="text-gray-600">HR:</span> <span className="font-medium">72 bpm</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Temp:</span> <span className="font-medium">98.6°F</span>
                      </div>
                      <div>
                        <span className="text-gray-600">SpO2:</span> <span className="font-medium">98%</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Recorded at 09:30 AM today</p>
                  </div>
                </div>
              </div>
            )}

            {/* Medications Tab */}
            {activeTab === 'medications' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Medication Administration</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Medication</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Dosage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Patient A</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">Insulin</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">10 units</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">9:00 AM</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 rounded text-xs">Given</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Vitals Modal */}
        {showVitalsModal && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full dark:bg-gray-900">
              <h2 className="text-xl font-semibold mb-4">
                Record Vitals - {selectedPatient.firstName} {selectedPatient.lastName}
              </h2>
              <form onSubmit={handleRecordVitals} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Blood Pressure</label>
                    <input name="bloodPressure" placeholder="e.g., 120/80" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Heart Rate (bpm)</label>
                    <input name="heartRate" type="number" placeholder="e.g., 72" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Temperature (°F)</label>
                    <input name="temperature" type="number" step="0.1" placeholder="e.g., 98.6" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Oxygen Saturation (%)</label>
                    <input name="oxygenSaturation" type="number" placeholder="e.g., 98" className="input-field" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Respiratory Rate</label>
                    <input name="respiratoryRate" type="number" placeholder="e.g., 16" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <textarea name="notes" placeholder="Additional observations" className="input-field" rows="3" />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => { setShowVitalsModal(false); setSelectedPatient(null); }}
                    className="px-4 py-2 border rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Save Vitals
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

export default NurseDashboard;

