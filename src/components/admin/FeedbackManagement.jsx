import React, { useState } from 'react';
import SearchFilter from '../common/SearchFilter';
import { MessageSquare, CheckCircle, XCircle, Clock3 } from 'lucide-react';

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

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Feedback Management</h1>
        <p className="text-gray-400">Manage support tickets and user feedback</p>
      </div>

      {/* Filters */}
      <SearchFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Search by subject or user name..."
        filters={filters}
        activeFilter={filter}
        onFilterChange={setFilter}
      />

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

export default FeedbackManagement;