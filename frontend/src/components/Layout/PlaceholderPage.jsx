// ...existing code...
// PlaceholderPage.jsx - simple protected page used when full feature pages are not implemented yet
import React from 'react';
import DashboardLayout from './DashboardLayout';

const PlaceholderPage = ({ title = 'Page' }) => {
  const menuItems = [
    { label: 'Dashboard', path: '/dashboard/admin', icon: '📊' },
    { label: 'Patients', path: '/patients', icon: '👥' },
    { label: 'Doctors', path: '/doctors', icon: '🩺' },
    { label: 'Appointments', path: '/appointments', icon: '📅' },
    { label: 'Departments', path: '/departments', icon: '🏥' },
    { label: 'Reports', path: '/reports', icon: '📄' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="card">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-gray-600 mt-2">This section is not implemented yet. Placeholder view.</p>
      </div>
    </DashboardLayout>
  );
};

export default PlaceholderPage;
// ...existing code...

