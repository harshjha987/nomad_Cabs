import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import StatsCard from '../common/StatsCard';
import { Car, CheckCircle, Clock, DollarSign } from 'lucide-react';

const RiderHome = () => {
  const { user } = useAuth();
  const { bookings } = useBooking();

  const userBookings = bookings.filter(b => b.riderId === user?.id);

  const stats = [
    {
      label: 'Total Rides',
      value: userBookings.length,
      icon: Car,
      color: 'text-blue-400'
    },
    {
      label: 'Completed',
      value: userBookings.filter(b => b.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-green-400'
    },
    {
      label: 'Active Rides',
      value: userBookings.filter(b => ['accepted', 'in_progress'].includes(b.status)).length,
      icon: Clock,
      color: 'text-yellow-400'
    },
    {
      label: 'Total Spent',
      value: `₹${userBookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + (b.fare || 0), 0)}`,
      icon: DollarSign,
      color: 'text-purple-400'
    }
  ];

  const recentBookings = userBookings
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
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
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

export default RiderHome;