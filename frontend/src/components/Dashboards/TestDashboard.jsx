import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserRole, getUsername } from '../../utils/authUtils';
import authService from '../../services/authService';

const TestDashboard = () => {
  const navigate = useNavigate();
  const role = getUserRole();
  const username = getUsername();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ color: '#2563eb', fontSize: '32px', marginBottom: '20px' }}>
        ✅ Dashboard Loaded Successfully!
      </h1>

      <div style={{ backgroundColor: '#dbeafe', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>User Information</h2>
        <p><strong>Username:</strong> {username}</p>
        <p><strong>Role:</strong> {role}</p>
        <p><strong>Current URL:</strong> {window.location.href}</p>
      </div>

      <div style={{ backgroundColor: '#d1fae5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>✅ What's Working</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li>✅ Login successful</li>
          <li>✅ JWT token stored</li>
          <li>✅ Navigation working</li>
          <li>✅ Dashboard component rendering</li>
          <li>✅ React Router working</li>
        </ul>
      </div>

      <div style={{ backgroundColor: '#fef3c7', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>📋 localStorage Data</h2>
        <pre style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '4px', overflow: 'auto' }}>
          {JSON.stringify({
            jwtToken: localStorage.getItem('jwtToken') ? 'EXISTS (hidden for security)' : 'MISSING',
            userRole: localStorage.getItem('userRole'),
            userId: localStorage.getItem('userId'),
            username: localStorage.getItem('username'),
            email: localStorage.getItem('email'),
            dashboardUrl: localStorage.getItem('dashboardUrl')
          }, null, 2)}
        </pre>
      </div>

      <button
        onClick={handleLogout}
        style={{
          backgroundColor: '#dc2626',
          color: 'white',
          padding: '12px 24px',
          fontSize: '16px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        Logout
      </button>

      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '8px' }}>
        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>🔧 Next Steps:</h3>
        <p>Since this simple dashboard works, the issue is likely in the complex AdminDashboard component.</p>
        <p>Possible causes:</p>
        <ul style={{ marginTop: '10px', lineHeight: '1.8' }}>
          <li>Missing CSS/Tailwind compilation</li>
          <li>DashboardLayout component error</li>
          <li>API call hanging/blocking render</li>
          <li>Missing icon imports</li>
        </ul>
      </div>
    </div>
  );
};

export default TestDashboard;
