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
  Ban
} from 'lucide-react';

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
    { id: 'vehicles', label: 'Manage Vehicles', icon: Truck, path: '/driver/vehicles' },
    { id: 'drivers', label: 'Manage Drivers', icon: Users, path: '/driver/drivers' },
    { id: 'verification', label: 'Verification Status', icon: Shield, path: '/driver/verification' },
    { id: 'support', label: 'Support & Feedback', icon: HelpCircle, path: '/driver/support' },
    { id: 'account', label: 'Manage Account', icon: UserCheck, path: '/driver/account' },
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
            <Car className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold">Nomad Cabs</span>
          </div>

          {/* User Info */}
          <div className="px-6 py-4 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
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
                      ? 'bg-purple-600 text-white'
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
          <Route path="/" element={<DriverDashboardHome />} />
          <Route path="/dashboard" element={<DriverDashboardHome />} />
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

// Dashboard Home Component
const DriverDashboardHome = () => {
  const { user } = useAuth();
  const { bookings } = useBooking();

  const driverBookings = bookings.filter(b => b.driverId === user?.id);
  const completedBookings = driverBookings.filter(b => b.status === 'completed');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.fare || 0), 0);
  const monthlyEarnings = completedBookings
    .filter(b => new Date(b.createdAt).getMonth() === new Date().getMonth())
    .reduce((sum, b) => sum + (b.fare || 0), 0);

  const stats = [
    {
      label: 'Total Earnings',
      value: `₹${totalEarnings}`,
      icon: DollarSign,
      color: 'text-green-400'
    },
    {
      label: 'Monthly Earnings',
      value: `₹${monthlyEarnings}`,
      icon: TrendingUp,
      color: 'text-blue-400'
    },
    {
      label: 'Total Rides',
      value: driverBookings.length,
      icon: Car,
      color: 'text-purple-400'
    },
    {
      label: 'Active Rides',
      value: driverBookings.filter(b => ['accepted', 'in_progress'].includes(b.status)).length,
      icon: Clock,
      color: 'text-yellow-400'
    }
  ];

  const recentBookings = driverBookings
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
        <p className="text-gray-400">Here's your driving summary</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-effect p-6 rounded-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Earnings Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-effect p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Monthly Earnings</h2>
          <div className="h-64 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Earnings chart would go here</p>
            </div>
          </div>
        </div>

        <div className="glass-effect p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Average Rating</span>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span>4.8</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Completion Rate</span>
              <span>98%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Response Time</span>
              <span>2.5 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Distance</span>
              <span>1,250 km</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="glass-effect p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        {recentBookings.length > 0 ? (
          <div className="space-y-4">
            {recentBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    booking.status === 'completed' ? 'bg-green-400' :
                    booking.status === 'in_progress' ? 'bg-yellow-400' :
                    booking.status === 'accepted' ? 'bg-blue-400' :
                    'bg-gray-400'
                  }`}></div>
                  <div>
                    <p className="font-medium">{booking.pickupAddress} → {booking.dropoffAddress}</p>
                    <p className="text-sm text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{booking.fare || 'Pending'}</p>
                  <p className={`text-sm capitalize ${
                    booking.status === 'completed' ? 'text-green-400' :
                    booking.status === 'in_progress' ? 'text-yellow-400' :
                    booking.status === 'accepted' ? 'text-blue-400' :
                    'text-gray-400'
                  }`}>{booking.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No bookings yet. Start accepting rides!</p>
          </div>
        )}
      </div>
    </div>
  );
};

// My Bookings Component
const MyBookings = () => {
  const { user } = useAuth();
  const { bookings, loading, updateBookingStatus } = useBooking();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const driverBookings = bookings.filter(b => b.driverId === user?.id);

  const filteredBookings = driverBookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = booking.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.dropoffAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      const result = await updateBookingStatus(bookingId, newStatus);
      if (result.success) {
        alert(`Booking ${newStatus} successfully!`);
      } else {
        alert('Failed to update booking: ' + result.error);
      }
    } catch (error) {
      alert('Error updating booking: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-900/20';
      case 'in_progress': return 'text-yellow-400 bg-yellow-900/20';
      case 'accepted': return 'text-blue-400 bg-blue-900/20';
      case 'cancelled': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
        <p className="text-gray-400">Manage your rides and track earnings</p>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {[
          { label: 'Today\'s Earnings', value: '₹450', color: 'text-green-400' },
          { label: 'This Week', value: '₹2,340', color: 'text-blue-400' },
          { label: 'This Month', value: '₹8,750', color: 'text-purple-400' },
          { label: 'Total Earnings', value: '₹45,230', color: 'text-yellow-400' }
        ].map((stat, index) => (
          <div key={index} className="glass-effect p-4 rounded-xl">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
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
                placeholder="Search by ID, pickup, or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="glass-effect p-6 rounded-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                    <span className="text-sm text-gray-400">#{booking.id.slice(0, 8)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-gray-300">From: {booking.pickupAddress}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Navigation className="w-4 h-4 text-red-400 mr-2" />
                      <span className="text-gray-300">To: {booking.dropoffAddress}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 text-blue-400 mr-2" />
                      <span className="text-gray-300">{new Date(booking.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col lg:items-end gap-2">
                  <div className="text-right">
                    <p className="text-2xl font-bold">₹{booking.fare || 'Pending'}</p>
                    {booking.vehicleType && (
                      <p className="text-sm text-gray-400 capitalize">{booking.vehicleType}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {booking.status === 'accepted' && (
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'in_progress')}
                        className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm transition-colors"
                      >
                        Start Trip
                      </button>
                    )}
                    {booking.status === 'in_progress' && (
                      <button
                        onClick={() => handleStatusUpdate(booking.id, 'completed')}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
                      >
                        Complete
                      </button>
                    )}
                    <button className="flex items-center px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                      <Eye className="w-4 h-4 mr-1" />
                      Details
                    </button>
                    {booking.status === 'completed' && (
                      <button className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                        <Download className="w-4 h-4 mr-1" />
                        Receipt
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-effect p-12 rounded-xl text-center">
            <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
            <p className="text-gray-400">
              {filter === 'all' 
                ? "You haven't received any bookings yet." 
                : `No ${filter} bookings found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Manage Vehicles Component
const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: '1',
      type: 'sedan',
      make: 'Honda',
      model: 'City',
      year: '2020',
      registrationNumber: 'MH01AB1234',
      status: 'active',
      verificationStatus: 'verified'
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    type: '',
    make: '',
    model: '',
    year: '',
    registrationNumber: '',
    seatingCapacity: '',
    documents: []
  });

  const vehicleTypes = [
    { value: 'bike', label: 'Bike' },
    { value: 'auto', label: 'Auto Rickshaw' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' }
  ];

  const handleAddVehicle = (e) => {
    e.preventDefault();
    const vehicle = {
      id: Date.now().toString(),
      ...newVehicle,
      status: 'active',
      verificationStatus: 'pending'
    };
    setVehicles(prev => [...prev, vehicle]);
    setNewVehicle({
      type: '',
      make: '',
      model: '',
      year: '',
      registrationNumber: '',
      seatingCapacity: '',
      documents: []
    });
    setShowAddForm(false);
    alert('Vehicle added successfully!');
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Vehicles</h1>
          <p className="text-gray-400">Register and manage your fleet</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Vehicle
        </button>
      </div>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} className="glass-effect p-6 rounded-xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{vehicle.make} {vehicle.model}</h3>
                <p className="text-gray-400 text-sm">{vehicle.year} • {vehicle.registrationNumber}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.verificationStatus)}`}>
                {vehicle.verificationStatus}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Type:</span>
                <span className="capitalize">{vehicle.type}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Status:</span>
                <span className={`capitalize ${vehicle.status === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                  {vehicle.status}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                <Eye className="w-4 h-4 mr-1" />
                View
              </button>
              <button className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </button>
              <button className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors">
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-effect p-8 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add New Vehicle</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                  <select
                    value={newVehicle.type}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, type: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  >
                    <option value="">Select Type</option>
                    {vehicleTypes.map((type) => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Make</label>
                  <input
                    type="text"
                    value={newVehicle.make}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, make: e.target.value }))}
                    placeholder="e.g., Honda, Toyota"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Model</label>
                  <input
                    type="text"
                    value={newVehicle.model}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, model: e.target.value }))}
                    placeholder="e.g., City, Camry"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Year</label>
                  <input
                    type="number"
                    value={newVehicle.year}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, year: e.target.value }))}
                    placeholder="2020"
                    min="2000"
                    max={new Date().getFullYear()}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Registration Number</label>
                  <input
                    type="text"
                    value={newVehicle.registrationNumber}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, registrationNumber: e.target.value }))}
                    placeholder="MH01AB1234"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Seating Capacity</label>
                  <input
                    type="number"
                    value={newVehicle.seatingCapacity}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, seatingCapacity: e.target.value }))}
                    placeholder="4"
                    min="1"
                    max="10"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Documents</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">Upload RC, Insurance, PUC certificates</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="vehicle-documents"
                  />
                  <label
                    htmlFor="vehicle-documents"
                    className="inline-block mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors"
                  >
                    Choose Files
                  </label>
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
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Add Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Manage Drivers Component
const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([
    {
      id: '1',
      name: 'John Doe',
      phone: '+91 9876543210',
      licenseNumber: 'MH0120210001234',
      status: 'verified',
      joinedDate: '2024-01-15'
    }
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    aadharNumber: '',
    licenseNumber: '',
    documents: []
  });

  const handleAddDriver = (e) => {
    e.preventDefault();
    const driver = {
      id: Date.now().toString(),
      ...newDriver,
      status: 'pending',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setDrivers(prev => [...prev, driver]);
    setNewDriver({
      name: '',
      phone: '',
      aadharNumber: '',
      licenseNumber: '',
      documents: []
    });
    setShowAddForm(false);
    alert('Driver added successfully!');
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Drivers</h1>
          <p className="text-gray-400">Register and manage your drivers</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Driver
        </button>
      </div>

      {/* Drivers List */}
      <div className="space-y-4">
        {drivers.map((driver) => (
          <div key={driver.id} className="glass-effect p-6 rounded-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{driver.name}</h3>
                  <p className="text-gray-400 text-sm">{driver.phone}</p>
                  <p className="text-gray-400 text-sm">License: {driver.licenseNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                    {driver.status}
                  </span>
                  <p className="text-sm text-gray-400 mt-1">Joined: {new Date(driver.joinedDate).toLocaleDateString()}</p>
                </div>

                <div className="flex gap-2">
                  <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  <button className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors">
                    <Ban className="w-4 h-4 mr-1" />
                    Suspend
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Driver Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-effect p-8 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add New Driver</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={newDriver.name}
                    onChange={(e) => setNewDriver(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={newDriver.phone}
                    onChange={(e) => setNewDriver(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 9876543210"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Aadhar Number</label>
                  <input
                    type="text"
                    value={newDriver.aadharNumber}
                    onChange={(e) => setNewDriver(prev => ({ ...prev, aadharNumber: e.target.value }))}
                    placeholder="1234 5678 9012"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">License Number</label>
                  <input
                    type="text"
                    value={newDriver.licenseNumber}
                    onChange={(e) => setNewDriver(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    placeholder="MH0120210001234"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Documents</label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400">Upload Aadhar, License, and Photo</p>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    id="driver-documents"
                  />
                  <label
                    htmlFor="driver-documents"
                    className="inline-block mt-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg cursor-pointer transition-colors"
                  >
                    Choose Files
                  </label>
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
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Add Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Verification Status Component
const VerificationStatus = () => {
  const [verifications, setVerifications] = useState([
    {
      id: '1',
      type: 'driver',
      documentType: 'license',
      status: 'verified',
      submittedDate: '2024-01-15',
      verifiedDate: '2024-01-16',
      remarks: 'All documents verified successfully'
    },
    {
      id: '2',
      type: 'vehicle',
      documentType: 'rc',
      status: 'pending',
      submittedDate: '2024-01-20',
      verifiedDate: null,
      remarks: null
    },
    {
      id: '3',
      type: 'driver',
      documentType: 'aadhar',
      status: 'rejected',
      submittedDate: '2024-01-18',
      verifiedDate: '2024-01-19',
      remarks: 'Document image is not clear. Please resubmit.'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-400 bg-green-900/20';
      case 'pending': return 'text-yellow-400 bg-yellow-900/20';
      case 'rejected': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending': return <Clock3 className="w-5 h-5 text-yellow-400" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Verification Status</h1>
        <p className="text-gray-400">Track your document verification progress</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Submitted', value: '8', color: 'text-blue-400' },
          { label: 'Verified', value: '5', color: 'text-green-400' },
          { label: 'Pending', value: '2', color: 'text-yellow-400' },
          { label: 'Rejected', value: '1', color: 'text-red-400' }
        ].map((stat, index) => (
          <div key={index} className="glass-effect p-6 rounded-xl">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Verification List */}
      <div className="space-y-4">
        {verifications.map((verification) => (
          <div key={verification.id} className="glass-effect p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                {getStatusIcon(verification.status)}
                <div>
                  <h3 className="text-lg font-semibold capitalize">
                    {verification.type} - {verification.documentType}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Submitted: {new Date(verification.submittedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(verification.status)}`}>
                {verification.status}
              </span>
            </div>

            {verification.verifiedDate && (
              <p className="text-sm text-gray-400 mb-2">
                Verified: {new Date(verification.verifiedDate).toLocaleDateString()}
              </p>
            )}

            {verification.remarks && (
              <div className={`p-3 rounded-lg text-sm ${
                verification.status === 'rejected' 
                  ? 'bg-red-900/20 text-red-300' 
                  : 'bg-green-900/20 text-green-300'
              }`}>
                <p className="font-medium mb-1">Remarks:</p>
                <p>{verification.remarks}</p>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                <FileCheck className="w-4 h-4 mr-1" />
                View Document
              </button>
              {verification.status === 'rejected' && (
                <button className="flex items-center px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors">
                  <Upload className="w-4 h-4 mr-1" />
                  Resubmit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Support & Feedback Component (Similar to Rider's)
const SupportFeedback = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('create');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    description: '',
    priority: 'medium',
    attachments: []
  });

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const ticket = {
        id: Date.now().toString(),
        ...newTicket,
        userId: user.id,
        status: 'open',
        createdAt: new Date().toISOString()
      };
      
      setTickets(prev => [ticket, ...prev]);
      setNewTicket({ subject: '', description: '', priority: 'medium', attachments: [] });
      setActiveTab('active');
      alert('Support ticket created successfully!');
    } catch (error) {
      alert('Error creating ticket: ' + error.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Support & Feedback</h1>
        <p className="text-gray-400">Get help or share your feedback with us</p>
      </div>

      {/* Similar implementation as Rider's Support component */}
      <div className="glass-effect p-8 rounded-xl">
        <h2 className="text-2xl font-semibold mb-6">Create Support Ticket</h2>
        
        <form onSubmit={handleCreateTicket} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Subject</label>
            <input
              type="text"
              value={newTicket.subject}
              onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="Brief description of your issue"
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              value={newTicket.description}
              onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of your issue or feedback"
              rows={6}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Creating Ticket...
              </>
            ) : (
              <>
                <MessageSquare className="w-5 h-5 mr-2" />
                Create Ticket
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// Manage Account Component (Similar to Rider's)
const ManageAccount = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    city: user?.city || '',
    state: user?.state || '',
    bankAccount: '',
    ifscCode: ''
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile: ' + result.error);
      }
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Account</h1>
        <p className="text-gray-400">Update your profile information and bank details</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture */}
        <div className="glass-effect p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
          <div className="text-center">
            <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-16 h-16" />
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
              Change Photo
            </button>
          </div>
        </div>

        {/* Account Information */}
        <div className="lg:col-span-2 glass-effect p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-6">Account Information</h2>
          
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bank Account</label>
                <input
                  type="text"
                  value={profileData.bankAccount}
                  onChange={(e) => handleInputChange('bankAccount', e.target.value)}
                  placeholder="Account Number"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">IFSC Code</label>
                <input
                  type="text"
                  value={profileData.ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                  placeholder="IFSC Code"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Settings className="w-5 h-5 mr-2" />
                  Update Profile
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;