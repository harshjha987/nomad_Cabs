import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, Upload, XCircle } from 'lucide-react';

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

  const tabs = [
    { id: 'create', label: 'Create Ticket' },
    { id: 'active', label: 'Active Tickets' },
    { id: 'closed', label: 'Closed Tickets' }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Support & Feedback</h1>
        <p className="text-gray-400">Get help or share your feedback with us</p>
      </div>

      {/* Tabs */}
      <div className="glass-effect p-1 rounded-xl mb-6 inline-flex">
        {tabs.map((tab) => (
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

export default SupportFeedback;