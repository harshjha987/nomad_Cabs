import React from 'react';
import StatsCard from '../common/StatsCard';
import { Users, Car, DollarSign, Shield, BarChart3, PieChart, Activity } from 'lucide-react';

const AdminHome = () => {
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
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
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

export default AdminHome;