import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { 
  Menu, 
  X, 
  Bell, 
  User, 
  LogOut, 
  Settings,
  BookOpen,
  Users,
  BarChart3,
  MapPin,
  CheckCircle
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { notifications } = useApp();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read && n.userId === user?.id);

  const getNavItems = () => {
    if (!user) return [];

    switch (user.role) {
      case 'student':
        return [
          { name: 'Dashboard', href: '/student/dashboard', icon: BarChart3 },
          { name: 'Logbook', href: '/student/logbook', icon: BookOpen },
          { name: 'Check-in', href: '/student/checkin', icon: Users },
        ];
      case 'supervisor':
        return [
          { name: 'Dashboard', href: '/supervisor/dashboard', icon: BarChart3 },
          { name: 'Review Logs', href: '/supervisor/logs', icon: BookOpen },
          { name: 'Students', href: '/supervisor/students', icon: Users },
          { name: 'Location Tracker', href: '/supervisor/location-tracker', icon: MapPin },
        ];
      case 'admin':
        return [
          { name: 'Dashboard', href: '/admin/dashboard', icon: BarChart3 },
          { name: 'Users', href: '/admin/users', icon: Users },
          { name: 'Settings', href: '/admin/settings', icon: Settings },
        ];
      case 'industrial_supervisor':
        return [
          { name: 'Dashboard', href: '/industrial/dashboard', icon: BarChart3 },
          { name: 'Confirmations', href: '/industrial/confirmations', icon: CheckCircle },
          { name: 'Students', href: '/industrial/students', icon: Users },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  if (!user) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                {/* <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" /> */}
                <img src="https://edurank.org/assets/img/uni-logos/mountain-top-university-logo.png" alt="" className="h-6 w-6 " />
                <span className="text-lg sm:text-xl font-bold text-gray-900">Mountain Top University Electronic Logbook Tracker</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-2 sm:px-3 py-2 rounded-md text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              {/* <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" /> */}
              <img src="c:\Users\TAYE\Downloads\mountain-top-university-logo-removebg-preview.png" alt="" className="h-6 w-6 sm:h-8 sm:w-8" />
              <span className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:block">Mountain Top University Electronic Logbook Tracker</span>
              <span className="text-lg font-bold text-gray-900 sm:hidden"></span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotifications.length > 9 ? '9+' : unreadNotifications.length}
                </span>
              )}
            </Link>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center space-x-2 p-1 sm:p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-6 w-6 sm:h-8 sm:w-8 rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
                )}
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-900 border-b border-gray-100">
                      <div className="font-medium truncate">{user.name}</div>
                      <div className="text-gray-500 truncate">{user.email}</div>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

           {/* Mobile menu button */}
           <div className="md:hidden z-50 relative">
            <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent background overlays from interfering
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              </div>
            </div>
            </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                      isActive
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Overlay for profile menu */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;