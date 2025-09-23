import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../common/Sidebar';
import RiderHome from './RiderHome';
import MyBookings from './MyBookings';
import BookVehicle from './BookVehicle';
import SupportFeedback from './SupportFeedback';
import ManageAccount from './ManageAccount';
import { Home, BookOpen, Car, HelpCircle, UserCheck } from 'lucide-react';

const RiderDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'dashboard';
    setActiveTab(path);
  }, [location]);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/rider/dashboard' },
    { id: 'bookings', label: 'My Bookings', icon: BookOpen, path: '/rider/bookings' },
    { id: 'book-ride', label: 'Book Vehicle', icon: Car, path: '/rider/book-ride' },
    { id: 'support', label: 'Support & Feedback', icon: HelpCircle, path: '/rider/support' },
    { id: 'account', label: 'Manage Account', icon: UserCheck, path: '/rider/account' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Sidebar 
        user={user}
        navigation={navigation}
        activeTab={activeTab}
        onLogout={logout}
        brandColor="blue"
      />

      <div className="ml-64">
        <Routes>
          <Route path="/" element={<RiderHome />} />
          <Route path="/dashboard" element={<RiderHome />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/book-ride" element={<BookVehicle />} />
          <Route path="/support" element={<SupportFeedback />} />
          <Route path="/account" element={<ManageAccount />} />
        </Routes>
      </div>
    </div>
  );
};

export default RiderDashboard;