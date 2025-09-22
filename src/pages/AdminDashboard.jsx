import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBooking } from '../contexts/BookingContext';
import { 
  Car, 
  Clock, 
  MapPin, 
  CreditCard, 
  Star, 
  User, 
  Calendar, 
  Navigation,
  Phone,
  Mail,
  FileText,
  Download,
  Filter,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Route as RouteIcon,
  Timer,
  Upload,
  MessageSquare,
  Settings,
  LogOut,
  Home,
  BookOpen,
  HelpCircle,
  UserCheck,
  Truck,
  Users,
  Shield,
  TrendingUp,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  FileCheck,
  Clock3,
  Ban,
  Activity,
  PieChart,
  Receipt,
  UserX,
  UserPlus,
  Zap
} from 'lucide-react';

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

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 glass-effect border-r border-gray-700">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center px-6 py-4 border-b border-gray-700">
            <Car className="h-8 w-8 text-green-400" />
            <span className="ml-2 text-xl font-bold">Nomad Cabs</span>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
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
                      ? 'bg-green-600 text-white'
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
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <Routes>
          <Route path="/" element={<AdminDashboardHome />} />
          <Route path="/dashboard" element={<AdminDashboardHome />} />
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

// Dashboard Home Component
const AdminDashboardHome = () => {
  const { bookings } = useBooking();

  const stats = [
    {
      label: 'Total Users',
      value: '1,234',
      icon: Users,
      color: 'text-blue-400',
      change: '+12%'
    },
    {
      label: 'Active Rides',
      value: '45',
      icon: Car,
      color: 'text-green-400',
      change: '+8%'
    },
    {
      label: 'Total Revenue',
      value: '₹2,45,670',
      icon: DollarSign,
      color: 'text-purple-400',
      change: '+15%'
    },
    {
      label: 'Pending Verifications',
      value: '23',
      icon: Shield,
      color: 'text-yellow-400',
      change: '-5%'
    }
  ];

  const recentActivities = [
    { id: 1, type: 'user_registered', message: 'New rider John Doe registered', time: '2 minutes ago' },
    { id: 2, type: 'verification_pending', message: 'Driver license verification pending', time: '5 minutes ago' },
    { id: 3, type: 'booking_completed', message: 'Ride #1234 completed successfully', time: '10 minutes ago' },
    { id: 4, type: 'support_ticket', message: 'New support ticket from rider', time: '15 minutes ago' },
    { id: 5, type: 'payment_received', message: 'Payment of ₹450 received', time: '20 minutes ago' }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-400">Monitor and manage your cab service platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-effect p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 ${stat.color}`} />
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-effect p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Revenue Analytics</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Revenue chart would go here</p>
            </div>
          </div>
        </div>

        <div className="glass-effect p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">User Distribution</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <PieChart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">User distribution chart would go here</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="glass-effect p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-gray-300">{activity.message}</span>
              </div>
              <span className="text-sm text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// User Board Component
const UserBoard = () => {
  const [activeTab, setActiveTab] = useState('riders');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState({
    riders: [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 9876543210',
        status: 'active',
        joinedDate: '2024-01-15',
        totalRides: 45,
        totalSpent: 2340
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '+91 9876543211',
        status: 'suspended',
        joinedDate: '2024-01-10',
        totalRides: 23,
        totalSpent: 1200
      }
    ],
    drivers: [
      {
        id: '1',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        phone: '+91 9876543212',
        status: 'active',
        joinedDate: '2024-01-12',
        totalRides: 120,
        totalEarnings: 15600,
        rating: 4.8
      },
      {
        id: '2',
        name: 'Sarah Wilson',
        email: 'sarah@example.com',
        phone: '+91 9876543213',
        status: 'pending',
        joinedDate: '2024-01-20',
        totalRides: 0,
        totalEarnings: 0,
        rating: 0
      }
    ]
  });

  const handleStatusUpdate = (userType, userId, newStatus) => {
    setUsers(prev => ({
      ...prev,
      [userType]: prev[userType].map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      )
    }));
    alert(`User ${newStatus} successfully!`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900/20';
      case 'suspended': return 'text-red-400 bg-red-900/20';
      case 'pending': return 'text-yellow-400 bg-yellow-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const filteredUsers = users[activeTab].filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Board</h1>
        <p className="text-gray-400">Manage riders and drivers</p>
      </div>

      {/* Tabs */}
      <div className="glass-effect p-1 rounded-xl mb-6 inline-flex">
        {[
          { id: 'riders', label: 'Riders' },
          { id: 'drivers', label: 'Drivers' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="glass-effect p-6 rounded-xl mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="glass-effect p-6 rounded-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                  <p className="text-gray-400 text-sm">{user.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-sm text-gray-400">Total {activeTab === 'riders' ? 'Rides' : 'Rides'}</p>
                  <p className="font-semibold">{user.totalRides}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-400">{activeTab === 'riders' ? 'Spent' : 'Earned'}</p>
                  <p className="font-semibold">₹{activeTab === 'riders' ? user.totalSpent : user.totalEarnings}</p>
                </div>
                {activeTab === 'drivers' && (
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Rating</p>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="font-semibold">{user.rating}</span>
                    </div>
                  </div>
                )}
                <div className="text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    Joined: {new Date(user.joinedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                {user.status === 'active' ? (
                  <button
                    onClick={() => handleStatusUpdate(activeTab, user.id, 'suspended')}
                    className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                  >
                    <Ban className="w-4 h-4 mr-1" />
                    Suspend
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusUpdate(activeTab, user.id, 'active')}
                    className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
                  >
                    <UserCheck className="w-4 h-4 mr-1" />
                    Activate
                  </button>
                )}
                <button
                  onClick={() => handleStatusUpdate(activeTab, user.id, 'deleted')}
                  className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                >
                  <UserX className="w-4 h-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Manage Verifications Component
const ManageVerifications = () => {
  const [activeTab, setActiveTab] = useState('drivers');
  const [verifications, setVerifications] = useState({
    drivers: [
      {
        id: '1',
        driverName: 'Mike Johnson',
        documentType: 'license',
        status: 'pending',
        submittedDate: '2024-01-20',
        documentUrl: '#'
      },
      {
        id: '2',
        driverName: 'Sarah Wilson',
        documentType: 'aadhar',
        status: 'pending',
        submittedDate: '2024-01-19',
        documentUrl: '#'
      }
    ],
    vehicles: [
      {
        id: '1',
        vehicleNumber: 'MH01AB1234',
        documentType: 'rc',
        status: 'pending',
        submittedDate: '2024-01-18',
        documentUrl: '#'
      }
    ]
  });

  const handleVerification = (type, id, status, remarks = '') => {
    setVerifications(prev => ({
      ...prev,
      [type]: prev[type].map(item => 
        item.id === id ? { ...item, status, remarks, verifiedDate: new Date().toISOString() } : item
      )
    }));
    alert(`Verification ${status} successfully!`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-400 bg-green-900/20';
      case 'pending': return 'text-yellow-400 bg-yellow-900/20';
      case 'rejected': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Verifications</h1>
        <p className="text-gray-400">Review and approve driver and vehicle documents</p>
      </div>

      {/* Tabs */}
      <div className="glass-effect p-1 rounded-xl mb-6 inline-flex">
        {[
          { id: 'drivers', label: 'Driver Verifications' },
          { id: 'vehicles', label: 'Vehicle Verifications' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Verifications List */}
      <div className="space-y-4">
        {verifications[activeTab].map((item) => (
          <div key={item.id} className="glass-effect p-6 rounded-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="text-sm text-gray-400">
                    Submitted: {new Date(item.submittedDate).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold mb-1">
                  {activeTab === 'drivers' ? item.driverName : item.vehicleNumber}
                </h3>
                <p className="text-gray-400 capitalize">{item.documentType} Document</p>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                  <Eye className="w-4 h-4 mr-1" />
                  View Document
                </button>
                {item.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleVerification(activeTab, item.id, 'verified')}
                      className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const remarks = prompt('Enter rejection reason:');
                        if (remarks) {
                          handleVerification(activeTab, item.id, 'rejected', remarks);
                        }
                      }}
                      className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {item.remarks && (
              <div className="mt-4 p-3 bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-300">
                  <strong>Rejection Reason:</strong> {item.remarks}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Feedback Management Component
const FeedbackManagement = () => {
  const [tickets, setTickets] = useState([
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      userType: 'rider',
      subject: 'Payment Issue',
      description: 'Unable to complete payment for my last ride',
      status: 'open',
      priority: 'high',
      createdDate: '2024-01-20',
      bookingId: 'booking123'
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Mike Johnson',
      userType: 'driver',
      subject: 'App Bug Report',
      description: 'The app crashes when I try to accept a ride',
      status: 'in_progress',
      priority: 'urgent',
      createdDate: '2024-01-19',
      bookingId: null
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleStatusUpdate = (ticketId, newStatus) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
    ));
    alert(`Ticket ${newStatus} successfully!`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-blue-400 bg-blue-900/20';
      case 'in_progress': return 'text-yellow-400 bg-yellow-900/20';
      case 'resolved': return 'text-green-400 bg-green-900/20';
      case 'closed': return 'text-gray-400 bg-gray-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-900/20';
      case 'high': return 'text-orange-400 bg-orange-900/20';
      case 'medium': return 'text-yellow-400 bg-yellow-900/20';
      case 'low': return 'text-green-400 bg-green-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter;
    const matchesSearch = ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.userName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feedback Management</h1>
        <p className="text-gray-400">Manage support tickets and user feedback</p>
      </div>

      {/* Filters */}
      <div className="glass-effect p-6 rounded-xl mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by subject or user name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {['all', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <div key={ticket.id} className="glass-effect p-6 rounded-xl">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <span className="text-sm text-gray-400">#{ticket.id}</span>
                </div>
                
                <h3 className="text-lg font-semibold mb-2">{ticket.subject}</h3>
                <p className="text-gray-300 mb-2">{ticket.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>By: {ticket.userName} ({ticket.userType})</span>
                  <span>Date: {new Date(ticket.createdDate).toLocaleDateString()}</span>
                  {ticket.bookingId && <span>Booking: #{ticket.bookingId}</span>}
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Reply
                </button>
                {ticket.status === 'open' && (
                  <button
                    onClick={() => handleStatusUpdate(ticket.id, 'in_progress')}
                    className="flex items-center px-3 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm transition-colors"
                  >
                    <Clock3 className="w-4 h-4 mr-1" />
                    In Progress
                  </button>
                )}
                {ticket.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusUpdate(ticket.id, 'resolved')}
                    className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Resolve
                  </button>
                )}
                <button
                  onClick={() => handleStatusUpdate(ticket.id, 'closed')}
                  className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Close
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Fare Management Component
const FareManagement = () => {
  const [activeTab, setActiveTab] = useState('pricing');
  const [cityPricing, setCityPricing] = useState([
    {
      id: '1',
      city: 'Mumbai',
      state: 'Maharashtra',
      vehicleType: 'sedan',
      baseFare: 120,
      perKmRate: 15,
      perMinRate: 2
    },
    {
      id: '2',
      city: 'Delhi',
      state: 'Delhi',
      vehicleType: 'hatchback',
      baseFare: 100,
      perKmRate: 12,
      perMinRate: 1.5
    }
  ]);

  const [commissionRules, setCommissionRules] = useState([
    {
      id: '1',
      minFare: 0,
      maxFare: 500,
      commission: 15,
      description: 'Standard rides'
    },
    {
      id: '2',
      minFare: 501,
      maxFare: 1000,
      commission: 12,
      description: 'Medium distance rides'
    },
    {
      id: '3',
      minFare: 1001,
      maxFare: 9999,
      commission: 10,
      description: 'Long distance rides'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPricing, setNewPricing] = useState({
    city: '',
    state: '',
    vehicleType: '',
    baseFare: '',
    perKmRate: '',
    perMinRate: ''
  });

  const vehicleTypes = ['bike', 'auto', 'hatchback', 'sedan', 'suv'];

  const handleAddPricing = (e) => {
    e.preventDefault();
    const pricing = {
      id: Date.now().toString(),
      ...newPricing,
      baseFare: parseFloat(newPricing.baseFare),
      perKmRate: parseFloat(newPricing.perKmRate),
      perMinRate: parseFloat(newPricing.perMinRate)
    };
    setCityPricing(prev => [...prev, pricing]);
    setNewPricing({
      city: '',
      state: '',
      vehicleType: '',
      baseFare: '',
      perKmRate: '',
      perMinRate: ''
    });
    setShowAddForm(false);
    alert('Pricing added successfully!');
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Fare Management</h1>
          <p className="text-gray-400">Manage city-wise pricing and commission structure</p>
        </div>
        {activeTab === 'pricing' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Pricing
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="glass-effect p-1 rounded-xl mb-6 inline-flex">
        {[
          { id: 'pricing', label: 'City Pricing' },
          { id: 'commission', label: 'Commission Rules' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* City Pricing */}
      {activeTab === 'pricing' && (
        <div className="space-y-4">
          {cityPricing.map((pricing) => (
            <div key={pricing.id} className="glass-effect p-6 rounded-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {pricing.city}, {pricing.state}
                  </h3>
                  <p className="text-gray-400 capitalize mb-2">{pricing.vehicleType}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Base Fare:</span>
                      <p className="font-semibold">₹{pricing.baseFare}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Per KM:</span>
                      <p className="font-semibold">₹{pricing.perKmRate}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Per Min:</span>
                      <p className="font-semibold">₹{pricing.perMinRate}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Commission Rules */}
      {activeTab === 'commission' && (
        <div className="space-y-4">
          {commissionRules.map((rule) => (
            <div key={rule.id} className="glass-effect p-6 rounded-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{rule.description}</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Min Fare:</span>
                      <p className="font-semibold">₹{rule.minFare}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Max Fare:</span>
                      <p className="font-semibold">₹{rule.maxFare === 9999 ? '∞' : rule.maxFare}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Commission:</span>
                      <p className="font-semibold">{rule.commission}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Pricing Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-effect p-8 rounded-xl w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add City Pricing</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddPricing} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={newPricing.city}
                    onChange={(e) => setNewPricing(prev => ({ ...prev, city: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    value={newPricing.state}
                    onChange={(e) => setNewPricing(prev => ({ ...prev, state: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                  <select
                    value={newPricing.vehicleType}
                    onChange={(e) => setNewPricing(prev => ({ ...prev, vehicleType: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-400 focus:outline-none"
                  >
                    <option value="">Select Type</option>
                    {vehicleTypes.map((type) => (
                      <option key={type} value={type} className="capitalize">{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Base Fare (₹)</label>
                  <input
                    type="number"
                    value={newPricing.baseFare}
                    onChange={(e) => setNewPricing(prev => ({ ...prev, baseFare: e.target.value }))}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Per KM Rate (₹)</label>
                  <input
                    type="number"
                    value={newPricing.perKmRate}
                    onChange={(e) => setNewPricing(prev => ({ ...prev, perKmRate: e.target.value }))}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Per Minute Rate (₹)</label>
                  <input
                    type="number"
                    value={newPricing.perMinRate}
                    onChange={(e) => setNewPricing(prev => ({ ...prev, perMinRate: e.target.value }))}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Add Pricing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Transaction Logs Component
const TransactionLogs = () => {
  const [transactions] = useState([
    {
      id: '1',
      bookingId: 'booking123',
      riderId: 'rider1',
      riderName: 'John Doe',
      driverId: 'driver1',
      driverName: 'Mike Johnson',
      amount: 450,
      commission: 45,
      driverEarning: 405,
      paymentMethod: 'upi',
      status: 'completed',
      date: '2024-01-20T10:30:00Z'
    },
    {
      id: '2',
      bookingId: 'booking124',
      riderId: 'rider2',
      riderName: 'Jane Smith',
      driverId: 'driver2',
      driverName: 'Sarah Wilson',
      amount: 320,
      commission: 32,
      driverEarning: 288,
      paymentMethod: 'cash',
      status: 'completed',
      date: '2024-01-20T09:15:00Z'
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.paymentMethod === filter;
    const matchesSearch = transaction.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.riderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalCommission = transactions.reduce((sum, t) => sum + t.commission, 0);
  const totalDriverEarnings = transactions.reduce((sum, t) => sum + t.driverEarning, 0);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Transaction Logs</h1>
        <p className="text-gray-400">View all financial transactions and analytics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Revenue', value: `₹${totalRevenue}`, color: 'text-green-400' },
          { label: 'Platform Commission', value: `₹${totalCommission}`, color: 'text-blue-400' },
          { label: 'Driver Earnings', value: `₹${totalDriverEarnings}`, color: 'text-purple-400' },
          { label: 'Total Transactions', value: transactions.length, color: 'text-yellow-400' }
        ].map((stat, index) => (
          <div key={index} className="glass-effect p-6 rounded-xl">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="glass-effect p-6 rounded-xl mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by booking ID, rider, or driver..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {['all', 'cash', 'upi', 'card', 'wallet'].map((method) => (
              <button
                key={method}
                onClick={() => setFilter(method)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === method
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {method.charAt(0).toUpperCase() + method.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="glass-effect p-6 rounded-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm text-gray-400">#{transaction.bookingId}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.status === 'completed' ? 'text-green-400 bg-green-900/20' : 'text-gray-400 bg-gray-900/20'
                  }`}>
                    {transaction.status}
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-900/20 text-blue-400 capitalize">
                    {transaction.paymentMethod}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Rider:</span>
                    <p className="font-medium">{transaction.riderName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Driver:</span>
                    <p className="font-medium">{transaction.driverName}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Date:</span>
                    <p className="font-medium">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Time:</span>
                    <p className="font-medium">{new Date(transaction.date).toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm text-gray-400">Total Amount</p>
                  <p className="text-xl font-bold">₹{transaction.amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Commission</p>
                  <p className="font-semibold text-blue-400">₹{transaction.commission}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Driver Earning</p>
                  <p className="font-semibold text-green-400">₹{transaction.driverEarning}</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  <button className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;