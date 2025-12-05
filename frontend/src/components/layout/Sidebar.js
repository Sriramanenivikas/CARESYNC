import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiUsers,
  FiUserPlus,
  FiCalendar,
  FiFileText,
  FiDollarSign,
  FiBarChart2,
  FiChevronLeft,
  FiSettings,
} from 'react-icons/fi';

const Sidebar = ({ collapsed, onToggle }) => {
  const { hasRole } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: FiHome,
      path: '/app/dashboard',
      roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT', 'TEST'],
    },
    {
      title: 'Patients',
      icon: FiUsers,
      path: '/app/patients',
      roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'TEST'],
    },
    {
      title: 'Doctors',
      icon: FiUserPlus,
      path: '/app/doctors',
      roles: ['ADMIN', 'RECEPTIONIST', 'TEST'],
    },
    {
      title: 'Appointments',
      icon: FiCalendar,
      path: '/app/appointments',
      roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PATIENT', 'TEST'],
    },
    {
      title: 'Prescriptions',
      icon: FiFileText,
      path: '/app/prescriptions',
      roles: ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT', 'TEST'],
    },
    {
      title: 'Billing',
      icon: FiDollarSign,
      path: '/app/bills',
      roles: ['ADMIN', 'RECEPTIONIST', 'PATIENT', 'TEST'],
    },
    {
      title: 'Analytics',
      icon: FiBarChart2,
      path: '/app/analytics',
      roles: ['ADMIN', 'TEST'],
    },
    {
      title: 'Users',
      icon: FiSettings,
      path: '/app/users',
      roles: ['ADMIN', 'TEST'],
    },
  ];

  const filteredMenu = menuItems.filter(item => hasRole(item.roles));

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white dark:bg-zinc-900 
        border-r border-zinc-200 dark:border-zinc-800 z-40 transition-all duration-200
        ${collapsed ? 'w-16' : 'w-56'}`}
    >
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-zinc-200 dark:border-zinc-800">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              Care<span className="text-blue-500">Sync</span>
            </span>
          </div>
        )}
        {collapsed && (
          <span className="text-xl font-black text-blue-500 mx-auto" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
            C
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1 overflow-y-auto h-[calc(100vh-3.5rem)]">
        {filteredMenu.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg
                transition-colors duration-150
                ${isActive 
                  ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium' 
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-white'
                }
                ${collapsed ? 'justify-center px-2' : ''}`}
              title={collapsed ? item.title : ''}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 w-6 h-6 bg-white dark:bg-zinc-900
          border border-zinc-200 dark:border-zinc-700 rounded-full 
          flex items-center justify-center text-zinc-400
          hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800
          transition-colors duration-150 shadow-sm"
      >
        <FiChevronLeft className={`w-3 h-3 transition-transform duration-150 ${collapsed ? 'rotate-180' : ''}`} />
      </button>
    </aside>
  );
};

export default Sidebar;
