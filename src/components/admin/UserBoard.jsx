import React, { useState } from 'react';
import SearchFilter from '../common/SearchFilter';
import { User, Eye, Ban, UserCheck, UserX, Star } from 'lucide-react';

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

  const tabs = [
    { id: 'riders', label: 'Riders' },
    { id: 'drivers', label: 'Drivers' }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">User Board</h1>
        <p className="text-gray-400">Manage riders and drivers</p>
      </div>

      {/* Tabs */}
      <div className="glass-effect p-1 rounded-xl mb-6 inline-flex">
        {tabs.map((tab) => (
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
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search users by name or email..."
      />

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

export default UserBoard;