import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import SearchFilter from '../common/SearchFilter';
import { Car, MapPin, Navigation, Calendar, Download, FileText, Plus } from 'lucide-react';

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

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'accepted', label: 'Accepted' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

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
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by pickup or destination..."
        filters={filters}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

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

export default MyBookings;