import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import StatsCard from '../common/StatsCard';
import { Car, DollarSign, Clock, TrendingUp, MapPin, Calendar } from 'lucide-react';

const DriverHome = () => {
  const { user } = useAuth();
  const { bookings } = useBooking();

  const driverBookings = bookings.filter(b => b.driverId === user?.id);
  const completedBookings = driverBookings.filter(b => b.status === 'completed');
  const totalEarnings = completedBookings.reduce((sum, b) => sum + (b.fare || 0), 0);
  const todayBookings = driverBookings.filter(b => 
    new Date(b.createdAt).toDateString() === new Date().toDateString()
  );

  const stats = [
    {
      label: 'Total Rides',
      value: driverBookings.length,
      icon: Car,
      color: 'text-purple-400',
      change: '+12%'
    },
    {
      label: 'Total Earnings',
      value: `₹${totalEarnings}`,
      icon: DollarSign,
      color: 'text-green-400',
      change: '+18%'
    },
    {
      label: 'Today\'s Rides',
      value: todayBookings.length,
      icon: Clock,
      color: 'text-blue-400',
      change: '+5%'
    },
    {
      label: 'Rating',
      value: '4.8',
      icon: TrendingUp,
      color: 'text-yellow-400',
      change: '+0.2'
    }
  ];

  const recentBookings = driverBookings
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const upcomingBookings = driverBookings.filter(b => 
    ['accepted', 'in_progress'].includes(b.status)
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.firstName}!</h1>
        <p className="text-gray-400">Here's your driving summary and earnings</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Rides */}
        <div className="glass-effect p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Upcoming Rides</h2>
          {upcomingBookings.length > 0 ? (
            <div className="space-y-4">
              {upcomingBookings.map((booking) => (
                <div key={booking.id} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'accepted' ? 'bg-blue-900/20 text-blue-400' : 'bg-yellow-900/20 text-yellow-400'
                    }`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                    <span className="text-sm text-gray-400">₹{booking.fare}</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-green-400 mr-2" />
                      <span className="text-gray-300">{booking.pickupAddress}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 text-red-400 mr-2" />
                      <span className="text-gray-300">{booking.dropoffAddress}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-blue-400 mr-2" />
                      <span className="text-gray-300">{new Date(booking.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Car className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No upcoming rides</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="glass-effect p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
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
                      <p className="font-medium text-sm">{booking.pickupAddress} → {booking.dropoffAddress}</p>
                      <p className="text-xs text-gray-400">{new Date(booking.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">₹{booking.fare || 'Pending'}</p>
                    <p className={`text-xs capitalize ${
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
              <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverHome;