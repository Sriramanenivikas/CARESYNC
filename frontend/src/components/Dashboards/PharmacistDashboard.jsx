// filepath: /Users/vikas/Downloads/CareSync/frontend/src/components/Dashboards/PharmacistDashboard.jsx
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../Layout/DashboardLayout';
import StatCard from '../Layout/StatCard';
import dashboardService from '../../services/dashboardService';
import prescriptionService from '../../services/prescriptionService';
import { FaCapsules, FaClipboardCheck, FaExclamationTriangle, FaPlus } from 'react-icons/fa';

const PharmacistDashboard = () => {
  const [stats, setStats] = useState({
    pendingPrescriptions: 0,
    dispensedToday: 0,
    totalPrescriptions: 0,
    stockAlerts: 0,
  });
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard/pharmacist', icon: <FaCapsules /> },
    { label: 'Prescriptions', path: '#prescriptions', icon: <FaClipboardCheck />, onClick: () => setActiveTab('prescriptions') },
  ];

  useEffect(() => {
    fetchDashboardData();
    fetchPrescriptions();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dashboardService.getPharmacistDashboard();
      setStats((prev) => ({ ...prev, ...(data.stats || data || {}) }));
    } catch (err) {
      console.error(err);
      setError('Failed to load pharmacist dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescriptions = async () => {
    try {
      const data = await prescriptionService.getAllPrescriptions();
      setPrescriptions(data || []);
      const pending = (data || []).filter(p => p.status === 'PENDING');
      const dispensedToday = (data || []).filter(p => (p.status === 'DISPENSED') && p.dispensedDate === new Date().toISOString().split('T')[0]);
      setStats(prev => ({ ...prev, pendingPrescriptions: pending.length, dispensedToday: dispensedToday.length, totalPrescriptions: (data||[]).length }));
    } catch (err) {
      console.error('Failed to fetch prescriptions:', err);
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
            title="Pending Prescriptions"
            value={stats.pendingPrescriptions || 0}
            icon={<FaClipboardCheck className="text-blue-600" />}
            bgColor="bg-blue-50 dark:bg-blue-900/30"
            textColor="text-blue-900 dark:text-blue-100"
          />
          <StatCard
            title="Dispensed Today"
            value={stats.dispensedToday || 0}
            icon={<FaCapsules className="text-green-600" />}
            bgColor="bg-green-50 dark:bg-green-900/30"
            textColor="text-green-900 dark:text-green-100"
          />
          <StatCard
            title="Total Prescriptions"
            value={stats.totalPrescriptions || 0}
            icon={<FaClipboardCheck className="text-purple-600" />}
            bgColor="bg-purple-50 dark:bg-purple-900/30"
            textColor="text-purple-900 dark:text-purple-100"
          />
          <StatCard
            title="Stock Alerts"
            value={stats.stockAlerts || 0}
            icon={<FaExclamationTriangle className="text-yellow-600" />}
            bgColor="bg-yellow-50 dark:bg-yellow-900/30"
            textColor="text-yellow-900 dark:text-yellow-100"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="border-b dark:border-gray-800">
            <nav className="flex space-x-4 px-6">
              {['overview', 'prescriptions'].map(tab => (
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
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <button className="p-4 border rounded-lg hover:bg-gray-50 font-medium dark:border-gray-800 dark:hover:bg-gray-800 flex items-center gap-2">
                  <FaPlus /> New Stock Entry
                </button>
              </div>
            )}

            {activeTab === 'prescriptions' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Prescriptions</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medication</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                      {prescriptions.map((p) => (
                        <tr key={p.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{p.prescriptionCode || p.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{p.patientName || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{p.doctorName || '-'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{p.medication}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${
                              p.status === 'DISPENSED' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200' :
                              p.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                            }`}>
                              {p.status || 'PENDING'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {prescriptions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No prescriptions found</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PharmacistDashboard;

