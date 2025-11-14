import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaMoon, FaSignOutAlt, FaSun, FaUser } from 'react-icons/fa';
import authService from '../../services/authService';
import { getUsername, getUserRole } from '../../utils/authUtils';

const Sidebar = ({ menuItems, isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleItemClick = (item) => {
    if (typeof item.onClick === 'function') {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-30 ${isOpen ? 'w-72' : 'w-20 md:w-20'} bg-gradient-to-br from-white to-gray-50 dark:from-black dark:via-gray-950 dark:to-black shadow-2xl transform transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className={`border-b border-gray-200 dark:border-gray-900 bg-gradient-to-r from-emerald-500 via-emerald-600 to-green-600 relative overflow-hidden ${isOpen ? 'p-8' : 'p-5'}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12"></div>
            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white font-black">C</div>
              {isOpen && (
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">CareSync</h1>
                  <p className="text-xs text-emerald-100 mt-1 font-bold tracking-wide">Hospital</p>
                </div>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleItemClick(item)}
                className={`sidebar-item group ${isOpen ? '' : 'justify-center'}`}
                title={!isOpen ? item.label : undefined}
              >
                <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{item.icon}</span>
                {isOpen && <span>{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className={`border-t border-gray-200 dark:border-gray-900 ${isOpen ? 'p-6' : 'p-4'} bg-white/70 dark:bg-black/20`}
          >
            {isOpen ? (
              <>
                <p className="text-xs text-gray-500 text-center font-semibold">© 2025 CareSync Hospital</p>
                <p className="text-xs text-gray-600 text-center mt-1">All Rights Reserved</p>
              </>
            ) : (
              <p className="text-[10px] text-center text-gray-500">© 2025</p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const username = getUsername();
  const userRole = getUserRole();
  const [showDropdown, setShowDropdown] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light'; // default to light theme
    const isDark = saved === 'dark';
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl px-8 py-5 border-b-2 border-gray-100 dark:border-gray-800 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="md:hidden text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 active:scale-95"
        >
          <FaBars className="text-2xl" />
        </button>

        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-3.5 rounded-2xl hover:bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 text-gray-700 dark:text-gray-200 transition-all duration-300 hover:scale-110 active:scale-95 shadow-md hover:shadow-lg"
            aria-label="Toggle theme"
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {dark ? <FaSun className="text-2xl text-yellow-500" /> : <FaMoon className="text-2xl text-emerald-600" />}
          </button>

          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-4 px-5 py-3 rounded-2xl hover:bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 transition-all duration-300 border-2 border-transparent hover:border-gray-300 dark:hover:border-gray-600 shadow-md hover:shadow-lg active:scale-95"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-emerald-600/40 text-lg">
                {username ? username.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-black text-gray-900 dark:text-gray-100">{username || 'User'}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-bold uppercase tracking-wide">{userRole || 'Role'}</p>
              </div>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-gray-100 dark:border-gray-800 py-3 z-50 animate-slide-up backdrop-blur-xl">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setShowDropdown(false);
                  }}
                  className="w-full px-5 py-3.5 text-left text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-800 dark:hover:to-gray-700 flex items-center space-x-3 dark:text-gray-200 transition-all duration-200 font-semibold rounded-xl mx-2"
                >
                  <FaUser className="text-lg" />
                  <span>My Profile</span>
                </button>
                <hr className="my-2 border-gray-100 dark:border-gray-800" />
                <button
                  onClick={handleLogout}
                  className="w-full px-5 py-3.5 text-left text-red-600 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-950/40 dark:hover:to-red-900/40 flex items-center space-x-3 transition-all duration-200 font-bold rounded-xl mx-2"
                >
                  <FaSignOutAlt className="text-lg" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const DashboardLayout = ({ children, menuItems }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50/20 to-indigo-50/30 dark:from-black dark:via-gray-950 dark:to-gray-900">
      <Sidebar menuItems={menuItems} isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      <div className="flex-1 flex flex-col">
        <Navbar toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto p-8">
          <div className="animate-fade-in max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
