import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Upload, RefreshCw } from 'lucide-react';

const VerificationStatus = () => {
  const [verifications, setVerifications] = useState([
    {
      id: '1',
      type: 'driver',
      documentType: 'aadhar',
      status: 'verified',
      submittedDate: '2024-01-15',
      verifiedDate: '2024-01-16',
      remarks: null
    },
    {
      id: '2',
      type: 'driver',
      documentType: 'license',
      status: 'pending',
      submittedDate: '2024-01-18',
      verifiedDate: null,
      remarks: null
    },
    {
      id: '3',
      type: 'vehicle',
      documentType: 'rc',
      status: 'rejected',
      submittedDate: '2024-01-10',
      verifiedDate: '2024-01-12',
      remarks: 'Document image is not clear. Please upload a clearer image.'
    }
  ]);

  const [activeTab, setActiveTab] = useState('all');

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'text-green-400 bg-green-900/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-900/20';
      case 'rejected':
        return 'text-red-400 bg-red-900/20';
      default:
        return 'text-gray-400 bg-gray-900/20';
    }
  };

  const getDocumentLabel = (type, documentType) => {
    const labels = {
      driver: {
        aadhar: 'Aadhar Card',
        pan: 'PAN Card',
        license: 'Driving License'
      },
      vehicle: {
        rc: 'Registration Certificate',
        puc: 'PUC Certificate',
        insurance: 'Insurance Policy'
      }
    };
    return labels[type]?.[documentType] || documentType;
  };

  const filteredVerifications = verifications.filter(verification => {
    if (activeTab === 'all') return true;
    return verification.status === activeTab;
  });

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'pending', label: 'Pending' },
    { id: 'verified', label: 'Verified' },
    { id: 'rejected', label: 'Rejected' }
  ];

  const handleResubmit = (verificationId) => {
    // Mock resubmission
    setVerifications(prev => prev.map(v => 
      v.id === verificationId 
        ? { ...v, status: 'pending', submittedDate: new Date().toISOString(), remarks: null }
        : v
    ));
    alert('Document resubmitted successfully!');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Verification Status</h1>
        <p className="text-gray-400">Track the status of your document verifications</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Documents', value: verifications.length, color: 'text-blue-400' },
          { label: 'Verified', value: verifications.filter(v => v.status === 'verified').length, color: 'text-green-400' },
          { label: 'Pending', value: verifications.filter(v => v.status === 'pending').length, color: 'text-yellow-400' },
          { label: 'Rejected', value: verifications.filter(v => v.status === 'rejected').length, color: 'text-red-400' }
        ].map((stat, index) => (
          <div key={index} className="glass-effect p-6 rounded-xl">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="glass-effect p-1 rounded-xl mb-6 inline-flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? 'bg-purple-600 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Verifications List */}
      <div className="space-y-4">
        {filteredVerifications.length > 0 ? (
          filteredVerifications.map((verification) => (
            <div key={verification.id} className="glass-effect p-6 rounded-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(verification.status)}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {getDocumentLabel(verification.type, verification.documentType)}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(verification.status)}`}>
                        {verification.status}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-900/20 text-gray-400 capitalize">
                        {verification.type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      <p>Submitted: {new Date(verification.submittedDate).toLocaleDateString()}</p>
                      {verification.verifiedDate && (
                        <p>Processed: {new Date(verification.verifiedDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  {verification.status === 'rejected' && (
                    <button
                      onClick={() => handleResubmit(verification.id)}
                      className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition-colors"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resubmit
                    </button>
                  )}
                  <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                    <Upload className="w-4 h-4 mr-2" />
                    View Document
                  </button>
                </div>
              </div>

              {verification.remarks && (
                <div className="mt-4 p-4 bg-red-900/20 rounded-lg border border-red-800/30">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-400">Rejection Reason:</p>
                      <p className="text-sm text-red-300 mt-1">{verification.remarks}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="glass-effect p-12 rounded-xl text-center">
            <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No verifications found</h3>
            <p className="text-gray-400">
              {activeTab === 'all' 
                ? "You haven't submitted any documents for verification yet." 
                : `No ${activeTab} verifications found.`}
            </p>
          </div>
        )}
      </div>

      {/* Help Section */}
      <div className="mt-8 glass-effect p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Verification Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2 text-purple-400">Document Requirements</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Clear, high-resolution images</li>
              <li>• All text must be readable</li>
              <li>• Documents should be valid and not expired</li>
              <li>• File size should be less than 5MB</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-purple-400">Processing Time</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Standard verification: 1-2 business days</li>
              <li>• Resubmissions: 24-48 hours</li>
              <li>• You'll be notified via email/SMS</li>
              <li>• Contact support for urgent cases</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationStatus;