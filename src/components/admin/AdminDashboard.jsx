import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../common/Sidebar';
import AdminHome from './AdminHome';
import UserBoard from './UserBoard';
import ManageVerifications from './ManageVerifications';
import FeedbackManagement from './FeedbackManagement';
import FareManagement from './FareManagement';
import TransactionLogs from './TransactionLogs';
import { Home, Users, Shield, MessageSquare, DollarSign, Receipt } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const path = location.pathname.split('/')[2] || 'dashboard';
    setActiveTab(path);
  }, [location]);

  const navigation = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/admin/dashboard' },
    { id: 'users', label: 'User Board', icon: Users, path: '/admin/users' },
    { id: 'verifications', label: 'Manage Verifications', icon: Shield, path: '/admin/verifications' },
    { id: 'feedback', label: 'Feedback Management', icon: MessageSquare, path: '/admin/feedback' },
    { id: 'fare', label: 'Fare Management', icon: DollarSign, path: '/admin/fare' },
    { id: 'transactions', label: 'Transaction Logs', icon: Receipt, path: '/admin/transactions' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Sidebar 
        user={user}
        navigation={navigation}
        activeTab={activeTab}
        onLogout={logout}
        brandColor="green"
      />

      <div className="ml-64">
        <Routes>
          <Route path="/" element={<AdminHome />} />
          <Route path="/dashboard" element={<AdminHome />} />
          <Route path="/users" element={<UserBoard />} />
          <Route path="/verifications" element={<ManageVerifications />} />
          <Route path="/feedback" element={<FeedbackManagement />} />
          <Route path="/fare" element={<FareManagement />} />
          <Route path="/transactions" element={<TransactionLogs />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;