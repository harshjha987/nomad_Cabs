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
  UserCheck
} from 'lucide-react';

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
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
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
                      ? 'bg-blue-600 text-white'
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
          <Route path="/" element={<RiderDashboardHome />} />
          <Route path="/dashboard" element={<RiderDashboardHome />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/book-ride" element={<BookVehicle />} />
          <Route path="/support" element={<SupportFeedback />} />
          <Route path="/account" element={<ManageAccount />} />
        </Routes>
      </div>
    </div>
  );
};

// Dashboard Home Component
const RiderDashboardHome = () => {
  const { user } = useAuth();
  const { bookings } = useBooking();

  const stats = [
    {
      label: 'Total Rides',
      value: bookings.filter(b => b.riderId === user?.id).length,
      icon: Car,
      color: 'text-blue-400'
    },
    {
      label: 'Completed',
      value: bookings.filter(b => b.riderId === user?.id && b.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      label: 'Active Rides',
      value: bookings.filter(b => b.riderId === user?.id && ['accepted', 'in_progress'].includes(b.status)).length,
      icon: Clock,
      color: 'text-yellow-400'
    },
    {
      label: 'Total Spent',
      value: `₹${bookings.filter(b => b.riderId === user?.id && b.status === 'completed').reduce((sum, b) => sum + (b.fare || 0), 0)}`,
      icon: DollarSign,
      color: 'text-purple-400'
    }
  ];

  const recentBookings = bookings
    .filter(b => b.riderId === user?.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
        <p className="text-gray-400">Here's your ride summary</p>
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
            <p className="text-gray-400">No bookings yet. Book your first ride!</p>
            <Link
              to="/rider/book-ride"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg transition-colors"
            >
              Book a Ride
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// My Bookings Component
const MyBookings = () => {
  const { user } = useAuth();
  const { bookings, loading } = useBooking();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const userBookings = bookings.filter(b => b.riderId === user?.id);

  const filteredBookings = userBookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = booking.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.dropoffAddress.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
        <p className="text-gray-400">Track all your rides and download receipts</p>
      </div>

      {/* Filters */}
      <div className="glass-effect p-6 rounded-xl mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by pickup or destination..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
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
                    ? 'bg-blue-600 text-white'
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
                    {booking.status === 'completed' && (
                      <button className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                        <Download className="w-4 h-4 mr-1" />
                        Receipt
                      </button>
                    )}
                    <button className="flex items-center px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                      <FileText className="w-4 h-4 mr-1" />
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-effect p-12 rounded-xl text-center">
            <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
            <p className="text-gray-400 mb-6">
              {filter === 'all' 
                ? "You haven't made any bookings yet." 
                : `No ${filter} bookings found.`}
            </p>
            <Link
              to="/rider/book-ride"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Book Your First Ride
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

// Book Vehicle Component
const BookVehicle = () => {
  const { user } = useAuth();
  const { createBooking, calculateFare } = useBooking();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    pickupAddress: '',
    dropoffAddress: '',
    scheduledDate: '',
    scheduledTime: '',
    vehicleType: '',
    paymentMethod: 'cash'
  });

  const vehicleTypes = [
    {
      type: 'bike',
      name: 'Bike',
      description: 'Quick and economical',
      capacity: '1 person',
      icon: '🏍️',
      basePrice: 50
    },
    {
      type: 'auto',
      name: 'Auto Rickshaw',
      description: 'Affordable short trips',
      capacity: '3 people',
      icon: '🛺',
      basePrice: 80
    },
    {
      type: 'hatchback',
      name: 'Hatchback',
      description: 'Comfortable rides',
      capacity: '4 people',
      icon: '🚗',
      basePrice: 120
    },
    {
      type: 'sedan',
      name: 'Sedan',
      description: 'Premium comfort',
      capacity: '4 people',
      icon: '🚙',
      basePrice: 150
    },
    {
      type: 'suv',
      name: 'SUV',
      description: 'Spacious family rides',
      capacity: '6-7 people',
      icon: '🚐',
      basePrice: 200
    }
  ];

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      const booking = {
        ...bookingData,
        riderId: user.id,
        status: 'pending',
        fare: calculateFare(5, bookingData.vehicleType).total // Mock distance of 5km
      };

      const result = await createBooking(booking);
      if (result.success) {
        alert('Booking created successfully!');
        setStep(1);
        setBookingData({
          pickupAddress: '',
          dropoffAddress: '',
          scheduledDate: '',
          scheduledTime: '',
          vehicleType: '',
          paymentMethod: 'cash'
        });
      } else {
        alert('Failed to create booking: ' + result.error);
      }
    } catch (error) {
      alert('Error creating booking: ' + error.message);
    }
    setLoading(false);
  };

  const fareBreakdown = bookingData.vehicleType ? calculateFare(5, bookingData.vehicleType) : null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book a Vehicle</h1>
        <p className="text-gray-400">Choose your ride and get moving</p>
      </div>

      {/* Progress Steps */}
      <div className="glass-effect p-6 rounded-xl mb-6">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                {stepNum}
              </div>
              <span className={`ml-2 ${step >= stepNum ? 'text-white' : 'text-gray-400'}`}>
                {stepNum === 1 ? 'Ride Details' : stepNum === 2 ? 'Vehicle Selection' : 'Payment'}
              </span>
              {stepNum < 3 && <div className={`w-16 h-1 mx-4 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-700'}`}></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="glass-effect p-8 rounded-xl">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Ride Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Pickup Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                  <input
                    type="text"
                    value={bookingData.pickupAddress}
                    onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                    placeholder="Enter pickup location"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Drop-off Location</label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 w-5 h-5" />
                  <input
                    type="text"
                    value={bookingData.dropoffAddress}
                    onChange={(e) => handleInputChange('dropoffAddress', e.target.value)}
                    placeholder="Enter destination"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <input
                    type="date"
                    value={bookingData.scheduledDate}
                    onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    type="time"
                    value={bookingData.scheduledTime}
                    onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!bookingData.pickupAddress || !bookingData.dropoffAddress}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Next: Select Vehicle
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Select Vehicle Type</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicleTypes.map((vehicle) => (
                <div
                  key={vehicle.type}
                  onClick={() => handleInputChange('vehicleType', vehicle.type)}
                  className={`p-6 rounded-xl cursor-pointer transition-all card-hover ${
                    bookingData.vehicleType === vehicle.type
                      ? 'bg-blue-600 border-2 border-blue-400'
                      : 'glass-effect border-2 border-transparent hover:border-gray-600'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{vehicle.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{vehicle.name}</h3>
                    <p className="text-sm text-gray-300 mb-2">{vehicle.description}</p>
                    <p className="text-xs text-gray-400 mb-3">{vehicle.capacity}</p>
                    <p className="text-xl font-bold text-blue-400">₹{vehicle.basePrice}+</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!bookingData.vehicleType}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Next: Payment
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Payment & Confirmation</h2>
            
            {/* Fare Breakdown */}
            {fareBreakdown && (
              <div className="glass-effect p-6 rounded-xl mb-6">
                <h3 className="text-lg font-semibold mb-4">Fare Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Fare</span>
                    <span>₹{fareBreakdown.baseFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance Fare (5 km)</span>
                    <span>₹{fareBreakdown.distanceFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span>₹{fareBreakdown.platformFee}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>₹{fareBreakdown.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'cash', label: 'Cash', icon: DollarSign },
                  { id: 'upi', label: 'UPI', icon: Phone },
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'wallet', label: 'Wallet', icon: CreditCard }
                ].map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      onClick={() => handleInputChange('paymentMethod', method.id)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        bookingData.paymentMethod === method.id
                          ? 'bg-blue-600 border-2 border-blue-400'
                          : 'glass-effect border-2 border-transparent hover:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <Icon className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-sm">{method.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Booking Summary */}
            <div className="glass-effect p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">From:</span>
                  <span>{bookingData.pickupAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">To:</span>
                  <span>{bookingData.dropoffAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vehicle:</span>
                  <span className="capitalize">{bookingData.vehicleType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date & Time:</span>
                  <span>{bookingData.scheduledDate} {bookingData.scheduledTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment:</span>
                  <span className="capitalize">{bookingData.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleBooking}
                disabled={loading}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner mr-2"></div>
                    Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Support & Feedback Component
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
      // Mock API call
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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setNewTicket(prev => ({ ...prev, attachments: files }));
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Support & Feedback</h1>
        <p className="text-gray-400">Get help or share your feedback with us</p>
      </div>

      {/* Tabs */}
      <div className="glass-effect p-1 rounded-xl mb-6 inline-flex">
        {[
          { id: 'create', label: 'Create Ticket' },
          { id: 'active', label: 'Active Tickets' },
          { id: 'closed', label: 'Closed Tickets' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Create Ticket */}
      {activeTab === 'create' && (
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
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={newTicket.priority}
                onChange={(e) => setNewTicket(prev => ({ ...prev, priority: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of your issue or feedback"
                rows={6}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Attachments (Max 3 files)</label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400">Click to upload files</p>
                    <p className="text-xs text-gray-500 mt-1">Images, PDF, DOC files only</p>
                  </div>
                </label>
              </div>
              
              {newTicket.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  {newTicket.attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-700 rounded">
                      <span className="text-sm">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => setNewTicket(prev => ({
                          ...prev,
                          attachments: prev.attachments.filter((_, i) => i !== index)
                        }))}
                        className="text-red-400 hover:text-red-300"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
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
      )}

      {/* Active/Closed Tickets */}
      {(activeTab === 'active' || activeTab === 'closed') && (
        <div className="space-y-4">
          {tickets.filter(t => activeTab === 'active' ? t.status === 'open' : t.status === 'closed').length > 0 ? (
            tickets
              .filter(t => activeTab === 'active' ? t.status === 'open' : t.status === 'closed')
              .map((ticket) => (
                <div key={ticket.id} className="glass-effect p-6 rounded-xl">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{ticket.subject}</h3>
                      <p className="text-gray-400 text-sm">#{ticket.id} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.priority === 'urgent' ? 'bg-red-900/20 text-red-400' :
                        ticket.priority === 'high' ? 'bg-orange-900/20 text-orange-400' :
                        ticket.priority === 'medium' ? 'bg-yellow-900/20 text-yellow-400' :
                        'bg-green-900/20 text-green-400'
                      }`}>
                        {ticket.priority}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        ticket.status === 'open' ? 'bg-blue-900/20 text-blue-400' : 'bg-gray-900/20 text-gray-400'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4">{ticket.description}</p>
                  <div className="flex justify-end">
                    <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                  </div>
                </div>
              ))
          ) : (
            <div className="glass-effect p-12 rounded-xl text-center">
              <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No {activeTab} tickets</h3>
              <p className="text-gray-400">
                {activeTab === 'active' 
                  ? "You don't have any active support tickets." 
                  : "You don't have any closed support tickets."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Manage Account Component
const ManageAccount = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    city: user?.city || '',
    state: user?.state || ''
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
        <p className="text-gray-400">Update your profile information and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture */}
        <div className="glass-effect p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
          <div className="text-center">
            <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-16 h-16" />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  value={profileData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
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

      {/* Account Status */}
      <div className="mt-8 glass-effect p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Account Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
            <div>
              <p className="font-medium">Account Active</p>
              <p className="text-sm text-gray-400">Your account is in good standing</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
            <div>
              <p className="font-medium">Email Verified</p>
              <p className="text-sm text-gray-400">Your email is verified</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-yellow-400 mr-3" />
            <div>
              <p className="font-medium">Phone Pending</p>
              <p className="text-sm text-gray-400">Verify your phone number</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;