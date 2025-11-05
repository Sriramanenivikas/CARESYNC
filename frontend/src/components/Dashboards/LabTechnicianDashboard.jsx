import React, { useState, useEffect } from 'react';
import DashboardLayout from '../Layout/DashboardLayout';
import StatCard from '../Layout/StatCard';
import dashboardService from '../../services/dashboardService';
import { FaFlask, FaVial, FaClipboardCheck, FaMicroscope } from 'react-icons/fa';

const LabTechnicianDashboard = () => {
  const [stats, setStats] = useState({
    pendingTests: 0,
    completedToday: 0,
    totalTests: 0,
    criticalResults: 0,
  });
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard/lab-technician', icon: <FaMicroscope /> },
    { label: 'Pending Tests', path: '#pending', icon: <FaFlask />, onClick: () => setActiveTab('pending') },
    { label: 'In Progress', path: '#progress', icon: <FaVial />, onClick: () => setActiveTab('progress') },
    { label: 'Completed', path: '#completed', icon: <FaClipboardCheck />, onClick: () => setActiveTab('completed') },
  ];

  useEffect(() => {
    fetchDashboardData();
    // Mock test data since no backend endpoint exists yet
    setTests([
      { id: 1, patientName: 'John Doe', testType: 'CBC', status: 'PENDING', requestedDate: '2025-11-01', priority: 'HIGH' },
      { id: 2, patientName: 'Jane Smith', testType: 'Blood Sugar', status: 'IN_PROGRESS', requestedDate: '2025-11-01', priority: 'NORMAL' },
      { id: 3, patientName: 'Bob Johnson', testType: 'Lipid Profile', status: 'COMPLETED', requestedDate: '2025-10-31', result: 'Normal', priority: 'NORMAL' },
    ]);
    setStats(prev => ({ ...prev, pendingTests: 1, completedToday: 1, totalTests: 3 }));
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await dashboardService.getLabTechnicianDashboard();
      setStats((prev) => ({ ...prev, ...(data.stats || data || {}) }));
    } catch (err) {
      console.error(err);
      setError('Failed to load lab technician dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (testId) => {
    const updatedTests = tests.map(t =>
      t.id === testId ? { ...t, status: 'IN_PROGRESS' } : t
    );
    setTests(updatedTests);
    alert('Test started');
  };

  const handleCompleteTest = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const testData = {
      ...selectedTest,
      status: 'COMPLETED',
      result: formData.get('result'),
      notes: formData.get('notes'),
      completedDate: new Date().toISOString().split('T')[0],
    };

    const updatedTests = tests.map(t =>
      t.id === selectedTest.id ? testData : t
    );
    setTests(updatedTests);
    setShowTestModal(false);
    setSelectedTest(null);
    alert('Test results saved successfully');
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
            title="Pending Tests"
            value={stats.pendingTests || 0}
            icon={<FaFlask className="text-blue-600" />}
            bgColor="bg-blue-50 dark:bg-blue-900/30"
            textColor="text-blue-900 dark:text-blue-100"
          />
          <StatCard
            title="Completed Today"
            value={stats.completedToday || 0}
            icon={<FaClipboardCheck className="text-green-600" />}
            bgColor="bg-green-50 dark:bg-green-900/30"
            textColor="text-green-900 dark:text-green-100"
          />
          <StatCard
            title="Total Tests"
            value={stats.totalTests || 0}
            icon={<FaMicroscope className="text-purple-600" />}
            bgColor="bg-purple-50 dark:bg-purple-900/30"
            textColor="text-purple-900 dark:text-purple-100"
          />
          <StatCard
            title="Critical Results"
            value={stats.criticalResults || 0}
            icon={<FaVial className="text-red-600" />}
            bgColor="bg-red-50 dark:bg-red-900/30"
            textColor="text-red-900 dark:text-red-100"
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow dark:bg-gray-900">
          <div className="border-b dark:border-gray-800">
            <nav className="flex space-x-4 px-6">
              {['overview', 'pending', 'progress', 'completed'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-4 font-medium capitalize ${
                    activeTab === tab
                      ? 'border-b-2 border-blue-600 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white'
                  }`}
                >
                  {tab === 'progress' ? 'In Progress' : tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold mb-4">Today's Work Queue</h2>

                {/* Pending Tests */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FaFlask className="text-blue-600" /> Pending Tests
                  </h3>
                  <div className="space-y-2">
                    {tests.filter(t => t.status === 'PENDING').map((test) => (
                      <div key={test.id} className="p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{test.patientName}</p>
                          <p className="text-sm text-gray-600">{test.testType}</p>
                          <span className={`text-xs px-2 py-1 rounded ${
                            test.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {test.priority} Priority
                          </span>
                        </div>
                        <button
                          onClick={() => handleStartTest(test.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                          Start Test
                        </button>
                      </div>
                    ))}
                    {tests.filter(t => t.status === 'PENDING').length === 0 && (
                      <p className="text-gray-500 text-center py-4">No pending tests</p>
                    )}
                  </div>
                </div>

                {/* In Progress */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FaVial className="text-yellow-600" /> In Progress
                  </h3>
                  <div className="space-y-2">
                    {tests.filter(t => t.status === 'IN_PROGRESS').map((test) => (
                      <div key={test.id} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg flex justify-between items-center">
                        <div>
                          <p className="font-medium">{test.patientName}</p>
                          <p className="text-sm text-gray-600">{test.testType}</p>
                        </div>
                        <button
                          onClick={() => { setSelectedTest(test); setShowTestModal(true); }}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Enter Results
                        </button>
                      </div>
                    ))}
                    {tests.filter(t => t.status === 'IN_PROGRESS').length === 0 && (
                      <p className="text-gray-500 text-center py-4">No tests in progress</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Pending Tests Tab */}
            {activeTab === 'pending' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Pending Tests</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Test Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Requested Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Priority</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                      {tests.filter(t => t.status === 'PENDING').map((test) => (
                        <tr key={test.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{test.patientName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{test.testType}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{test.requestedDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded text-xs ${
                              test.priority === 'HIGH' ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                            }`}>
                              {test.priority}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleStartTest(test.id)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Start
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {tests.filter(t => t.status === 'PENDING').length === 0 && (
                    <div className="text-center py-8 text-gray-500">No pending tests</div>
                  )}
                </div>
              </div>
            )}

            {/* In Progress Tab */}
            {activeTab === 'progress' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Tests In Progress</h2>
                <div className="space-y-3">
                  {tests.filter(t => t.status === 'IN_PROGRESS').map((test) => (
                    <div key={test.id} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-lg">{test.patientName}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            <strong>Test:</strong> {test.testType}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Started:</strong> {test.requestedDate}
                          </p>
                        </div>
                        <button
                          onClick={() => { setSelectedTest(test); setShowTestModal(true); }}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                        >
                          Enter Results
                        </button>
                      </div>
                    </div>
                  ))}
                  {tests.filter(t => t.status === 'IN_PROGRESS').length === 0 && (
                    <div className="text-center py-8 text-gray-500">No tests in progress</div>
                  )}
                </div>
              </div>
            )}

            {/* Completed Tab */}
            {activeTab === 'completed' && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Completed Tests</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Patient</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Test Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Completed Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase dark:text-gray-400">Result</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-800">
                      {tests.filter(t => t.status === 'COMPLETED').map((test) => (
                        <tr key={test.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{test.patientName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{test.testType}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{test.completedDate}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200 rounded text-xs">
                              {test.result}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {tests.filter(t => t.status === 'COMPLETED').length === 0 && (
                    <div className="text-center py-8 text-gray-500">No completed tests</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Test Results Modal */}
        {showTestModal && selectedTest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full dark:bg-gray-900">
              <h2 className="text-xl font-semibold mb-4">
                Enter Test Results - {selectedTest.patientName}
              </h2>
              <form onSubmit={handleCompleteTest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Test Type</label>
                  <input type="text" value={selectedTest.testType} disabled className="w-full border rounded px-3 py-2 bg-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Result</label>
                  <select name="result" className="w-full border rounded px-3 py-2" required>
                    <option value="">Select Result</option>
                    <option value="Normal">Normal</option>
                    <option value="Abnormal">Abnormal</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Test Notes / Values</label>
                  <textarea name="notes" placeholder="Enter detailed test results and values..." className="w-full border rounded px-3 py-2" rows="4" required />
                </div>
                <div className="flex justify-end space-x-2">
                  <button type="button" onClick={() => { setShowTestModal(false); setSelectedTest(null); }} className="px-4 py-2 border rounded hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save Results</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LabTechnicianDashboard;
