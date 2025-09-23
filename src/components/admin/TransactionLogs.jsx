import React, { useState } from 'react';
import SearchFilter from '../common/SearchFilter';
import { Eye, Download } from 'lucide-react';

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

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'cash', label: 'Cash' },
    { value: 'upi', label: 'UPI' },
    { value: 'card', label: 'Card' },
    { value: 'wallet', label: 'Wallet' }
  ];

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
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by booking ID, rider, or driver..."
        filters={filters}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

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

export default TransactionLogs;