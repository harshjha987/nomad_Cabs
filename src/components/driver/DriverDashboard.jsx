import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../common/Sidebar';
import DriverHome from './DriverHome';
import MyBookings from './MyBookings';
import ManageVehicles from './ManageVehicles';
import ManageDrivers from './ManageDrivers';
import VerificationStatus from './VerificationStatus';
import SupportFeedback from './SupportFeedback';
import ManageAccount from './ManageAccount';
import { Home, BookOpen, Car, Users, Shield, HelpCircle, UserCheck } from 'lucide-react';

const DriverDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'dashboard';
    setActiveTab(path);
  }, [location]);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/driver/dashboard' },
    { id: 'bookings', label: 'My Bookings', icon: BookOpen, path: '/driver/bookings' },
    { id: 'vehicles', label: 'Manage Vehicles', icon: Car, path: '/driver/vehicles' },
    { id: 'drivers', label: 'Manage Drivers', icon: Users, path: '/driver/drivers' },
    { id: 'verification', label: 'Verification Status', icon: Shield, path: '/driver/verification' },
    { id: 'support', label: 'Support & Feedback', icon: HelpCircle, path: '/driver/support' },
    { id: 'account', label: 'Manage Account', icon: UserCheck, path: '/driver/account' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Sidebar 
        user={user}
        navigation={navigation}
        activeTab={activeTab}
        onLogout={logout}
        brandColor="purple"
      />

      <div className="ml-64">
        <Routes>
          <Route path="/" element={<DriverHome />} />
          <Route path="/dashboard" element={<DriverHome />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/vehicles" element={<ManageVehicles />} />
          <Route path="/drivers" element={<ManageDrivers />} />
          <Route path="/verification" element={<VerificationStatus />} />
          <Route path="/support" element={<SupportFeedback />} />
          <Route path="/account" element={<ManageAccount />} />
        </Routes>
      </div>
    </div>
  );
};

export default DriverDashboard;