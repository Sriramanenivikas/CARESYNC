import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar, Dropdown, DropdownItem, GlobalSearch } from '../common';
import {
  FiBell,
  FiUser,
  FiLogOut,
  FiMenu,
  FiSun,
  FiMoon,
} from 'react-icons/fi';

const Header = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-14 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-4 sticky top-0 z-30">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <FiMenu className="w-5 h-5" />
        </button>

        {/* Global Search */}
        <div className="hidden md:block">
          <GlobalSearch />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-1">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          title={isDark ? 'Light mode' : 'Dark mode'}
        >
          {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
        </button>

        {/* Notifications */}
        <Dropdown
          trigger={
            <button className="relative p-2 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <FiBell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
            </button>
          }
        >
          <div className="w-72">
            <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800">
              <h3 className="font-medium text-sm text-zinc-900 dark:text-white">Notifications</h3>
            </div>
            <div className="py-6 text-center text-zinc-400 text-sm">
              No new notifications
            </div>
          </div>
        </Dropdown>

        {/* User menu */}
        <Dropdown
          trigger={
            <button className="flex items-center gap-2 p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg transition-colors ml-1">
              <Avatar
                firstName={user?.firstName || user?.username}
                lastName={user?.lastName}
                size="sm"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-200">
                  {user?.firstName || user?.username}
                </p>
                <p className="text-xs text-zinc-400 capitalize">{user?.role?.toLowerCase()}</p>
              </div>
            </button>
          }
        >
          <DropdownItem icon={FiUser} onClick={() => navigate('/profile')}>
            Profile
          </DropdownItem>
          <div className="border-t border-zinc-100 dark:border-zinc-800 my-1" />
          <DropdownItem icon={FiLogOut} onClick={handleLogout} danger>
            Sign out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
