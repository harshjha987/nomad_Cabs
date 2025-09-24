import React, { useState } from 'react';
import { Plus, Edit, Eye, CheckCircle, XCircle, Clock, User } from 'lucide-react';

const ManageDrivers = () => {
  const [drivers, setDrivers] = useState([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+91 9876543210',
      aadharNumber: '123456789012',
      panNumber: 'ABCDE1234F',
      licenseNumber: 'DL1234567890',
      licenseExpiryDate: '2025-12-31',
      isAadharVerified: true,
      isPanVerified: false,
      isLicenseVerified: true,
      status: 'active',
      createdAt: '2024-01-10'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newDriver, setNewDriver] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    aadharNumber: '',
    panNumber: '',
    licenseNumber: '',
    licenseExpiryDate: '',
    aadharDocument: null,
    panDocument: null,
    licenseDocument: null
  });

  const handleAddDriver = (e) => {
    e.preventDefault();
    const driver = {
      id: Date.now().toString(),
      ...newDriver,
      isAadharVerified: false,
      isPanVerified: false,
      isLicenseVerified: false,
      status: 'pending_verification',
      createdAt: new Date().toISOString()
    };
    setDrivers(prev => [...prev, driver]);
    setNewDriver({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      aadharNumber: '',
      panNumber: '',
      licenseNumber: '',
      licenseExpiryDate: '',
      aadharDocument: null,
      panDocument: null,
      licenseDocument: null
    });
    setShowAddForm(false);
    alert('Driver registered successfully! Awaiting verification.');
  };

  const handleFileUpload = (field, e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDriver(prev => ({ ...prev, [field]: file }));
    }
  };

  const getVerificationStatus = (driver) => {
    if (driver.isAadharVerified && driver.isPanVerified && driver.isLicenseVerified) {
      return { status: 'verified', color: 'text-green-400 bg-green-900/20' };
    } else if (!driver.isAadharVerified || !driver.isPanVerified || !driver.isLicenseVerified) {
      return { status: 'pending', color: 'text-yellow-400 bg-yellow-900/20' };
    } else {
      return { status: 'rejected', color: 'text-red-400 bg-red-900/20' };
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Drivers</h1>
          <p className="text-gray-400">Register and manage drivers in your fleet</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Driver
        </button>
      </div>

      {/* Drivers List */}
      <div className="space-y-4">
        {drivers.map((driver) => {
          const verification = getVerificationStatus(driver);
          return (
            <div key={driver.id} className="glass-effect p-6 rounded-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{driver.firstName} {driver.lastName}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${verification.color}`}>
                        {verification.status}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{driver.phoneNumber}</p>
                    <p className="text-gray-400 text-sm">License: {driver.licenseNumber}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      {driver.isAadharVerified ? (
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-400 mr-2" />
                      )}
                      <span>Aadhar</span>
                    </div>
                    <div className="flex items-center">
                      {driver.isPanVerified ? (
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-400 mr-2" />
                      )}
                      <span>PAN</span>
                    </div>
                    <div className="flex items-center">
                      {driver.isLicenseVerified ? (
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-400 mr-2" />
                      )}
                      <span>License</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </button>
                    <button className="flex items-center px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm transition-colors">
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Driver Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-effect p-8 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Register New Driver</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddDriver} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    value={newDriver.firstName}
                    onChange={(e) => setNewDriver(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    value={newDriver.lastName}
                    onChange={(e) => setNewDriver(prev => ({ ...prev, lastName: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={newDriver.phoneNumber}
                    onChange={(e) => setNewDriver(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Aadhar Number</label>
                  <input
                    type="text"
                    value={newDriver.aadharNumber}
                    onChange={(e) => setNewDriver(prev => ({ ...prev, aadharNumber: e.target.value }))}
                    required
                    maxLength="12"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">PAN Number</label>
                  <input
                    type="text"
                    value={newDriver.panNumber}
                    onChange={(e) => setNewDriver(prev => ({ ...prev, panNumber: e.target.value }))}
                    required
                    maxLength="10"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">License Number</label>
                  <input
                    type="text"
                    value={newDriver.licenseNumber}
                    onChange={(e) => setNewDriver(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">License Expiry Date</label>
                  <input
                    type="date"
                    value={newDriver.licenseExpiryDate}
                    onChange={(e) => setNewDriver(prev => ({ ...prev, licenseExpiryDate: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Document Uploads */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Upload Documents</h3>
                
                {[
                  { field: 'aadharDocument', label: 'Aadhar Card' },
                  { field: 'panDocument', label: 'PAN Card' },
                  { field: 'licenseDocument', label: 'Driving License' }
                ].map((doc) => (
                  <div key={doc.field}>
                    <label className="block text-sm font-medium mb-2">{doc.label}</label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(doc.field, e)}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                    />
                    {newDriver[doc.field] && (
                      <p className="text-sm text-purple-400 mt-1">{newDriver[doc.field].name}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  Register Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDrivers;