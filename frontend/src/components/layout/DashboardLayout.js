import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Toast } from '../common';

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 dot-grid">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
      />

      {/* Main Content */}
      <div className={`transition-all duration-200 ${sidebarCollapsed ? 'ml-16' : 'ml-56'}`}>
        <Header onMenuToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className="p-6 min-h-[calc(100vh-3.5rem)]">
          <Outlet />
        </main>
      </div>

      {/* Toast notifications */}
      <Toast />
    </div>
  );
};

export default DashboardLayout;
