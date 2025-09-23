import React, { useState } from 'react';
import { Eye, CheckCircle, XCircle } from 'lucide-react';

const ManageVerifications = () => {
  const [activeTab, setActiveTab] = useState('drivers');
  const [verifications, setVerifications] = useState({
    drivers: [
      {
        id: '1',
        driverName: 'Mike Johnson',
        documentType: 'license',
        status: 'pending',
        submittedDate: '2024-01-20',
        documentUrl: '#'
      },
      {
        id: '2',
        driverName: 'Sarah Wilson',
        documentType: 'aadhar',
        status: 'pending',
        submittedDate: '2024-01-19',
        documentUrl: '#'
      }
    ],
    vehicles: [
      {
        id: '1',
        vehicleNumber: 'MH01AB1234',
        documentType: 'rc',
        status: 'pending',
        submittedDate: '2024-01-18',
        documentUrl: '#'
      }
    ]
  });

  const handleVerification = (type, id, status, remarks = '') => {
    setVerifications(prev => ({
      ...prev,
      [type]: prev[type].map(item => 
        item.id === id ? { ...item, status, remarks, verifiedDate: new Date().toISOString() } : item
      )
    }));
    alert(`Verification ${status} successfully!`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'text-green-400 bg-green-900/20';
      case 'pending': return 'text-yellow-400 bg-yellow-900/20';
      case 'rejected': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const tabs = [
    { id: 'drivers', label: 'Driver Verifications' },
    { id: 'vehicles', label: 'Vehicle Verifications' }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Verifications</h1>
        <p className="text-gray-400">Review and approve driver and vehicle documents</p>
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

      {/* Verifications List */}
      <div className="space-y-4">
        {verifications[activeTab].map((item) => (
          <div key={item.id} className="glass-effect p-6 rounded-xl">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="text-sm text-gray-400">
                    Submitted: {new Date(item.submittedDate).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold mb-1">
                  {activeTab === 'drivers' ? item.driverName : item.vehicleNumber}
                </h3>
                <p className="text-gray-400 capitalize">{item.documentType} Document</p>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                  <Eye className="w-4 h-4 mr-1" />
                  View Document
                </button>
                {item.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleVerification(activeTab, item.id, 'verified')}
                      className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        const remarks = prompt('Enter rejection reason:');
                        if (remarks) {
                          handleVerification(activeTab, item.id, 'rejected', remarks);
                        }
                      }}
                      className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {item.remarks && (
              <div className="mt-4 p-3 bg-red-900/20 rounded-lg">
                <p className="text-sm text-red-300">
                  <strong>Rejection Reason:</strong> {item.remarks}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageVerifications;