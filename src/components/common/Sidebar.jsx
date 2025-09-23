import React from 'react';
import { Link } from 'react-router-dom';
import { Car, User, LogOut } from 'lucide-react';

const Sidebar = ({ user, navigation, activeTab, onLogout, brandColor = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    purple: 'text-purple-400'
  };

  const activeColorClasses = {
    blue: 'bg-blue-600',
    green: 'bg-green-600',
    purple: 'bg-purple-600'
  };

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 glass-effect border-r border-gray-700">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-4 border-b border-gray-700">
          <Car className={`h-8 w-8 ${colorClasses[brandColor]}`} />
          <span className="ml-2 text-xl font-bold">Nomad Cabs</span>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-gray-700">
          <div className="flex items-center">
            <div className={`w-10 h-10 ${activeColorClasses[brandColor]} rounded-full flex items-center justify-center`}>
              <User className="w-6 h-6" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? `${activeColorClasses[brandColor]} text-white`
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-700">
          <button
            onClick={onLogout}
            className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;