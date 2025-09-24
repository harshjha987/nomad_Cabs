import React, { useState } from 'react';
import { Plus, Edit, Trash2, Upload, CheckCircle, XCircle, Clock } from 'lucide-react';

const ManageVehicles = () => {
  const [vehicles, setVehicles] = useState([
    {
      id: '1',
      vehicleType: 'sedan',
      rcNumber: 'MH01AB1234',
      pucNumber: 'PUC123456',
      pucExpiryDate: '2024-12-31',
      insuranceNumber: 'INS789012',
      insuranceExpiryDate: '2024-11-30',
      isRcVerified: true,
      isPucVerified: false,
      isInsuranceVerified: true,
      status: 'active',
      createdAt: '2024-01-15'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    vehicleType: '',
    rcNumber: '',
    pucNumber: '',
    pucExpiryDate: '',
    insuranceNumber: '',
    insuranceExpiryDate: '',
    vehiclePhoto: null
  });

  const vehicleTypes = [
    { value: 'bike', label: 'Bike', icon: '🏍️' },
    { value: 'auto', label: 'Auto Rickshaw', icon: '🛺' },
    { value: 'hatchback', label: 'Hatchback', icon: '🚗' },
    { value: 'sedan', label: 'Sedan', icon: '🚙' },
    { value: 'suv', label: 'SUV', icon: '🚐' }
  ];

  const handleAddVehicle = (e) => {
    e.preventDefault();
    const vehicle = {
      id: Date.now().toString(),
      ...newVehicle,
      isRcVerified: false,
      isPucVerified: false,
      isInsuranceVerified: false,
      status: 'pending_verification',
      createdAt: new Date().toISOString()
    };
    setVehicles(prev => [...prev, vehicle]);
    setNewVehicle({
      vehicleType: '',
      rcNumber: '',
      pucNumber: '',
      pucExpiryDate: '',
      insuranceNumber: '',
      insuranceExpiryDate: '',
      vehiclePhoto: null
    });
    setShowAddForm(false);
    alert('Vehicle registered successfully! Awaiting verification.');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewVehicle(prev => ({ ...prev, vehiclePhoto: file }));
    }
  };

  const getVerificationStatus = (vehicle) => {
    if (vehicle.isRcVerified && vehicle.isPucVerified && vehicle.isInsuranceVerified) {
      return { status: 'verified', color: 'text-green-400 bg-green-900/20' };
    } else if (!vehicle.isRcVerified || !vehicle.isPucVerified || !vehicle.isInsuranceVerified) {
      return { status: 'pending', color: 'text-yellow-400 bg-yellow-900/20' };
    } else {
      return { status: 'rejected', color: 'text-red-400 bg-red-900/20' };
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Vehicles</h1>
          <p className="text-gray-400">Register and manage your vehicles</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Vehicle
        </button>
      </div>

      {/* Vehicles List */}
      <div className="space-y-4">
        {vehicles.map((vehicle) => {
          const verification = getVerificationStatus(vehicle);
          return (
            <div key={vehicle.id} className="glass-effect p-6 rounded-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">
                      {vehicleTypes.find(t => t.value === vehicle.vehicleType)?.icon || '🚗'}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold capitalize">{vehicle.vehicleType}</h3>
                      <p className="text-gray-400 text-sm">RC: {vehicle.rcNumber}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${verification.color}`}>
                      {verification.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center">
                      {vehicle.isRcVerified ? (
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-400 mr-2" />
                      )}
                      <span>RC Document</span>
                    </div>
                    <div className="flex items-center">
                      {vehicle.isPucVerified ? (
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-400 mr-2" />
                      )}
                      <span>PUC Certificate</span>
                    </div>
                    <div className="flex items-center">
                      {vehicle.isInsuranceVerified ? (
                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-400 mr-2" />
                      )}
                      <span>Insurance</span>
                    </div>
                  </div>

                  <div className="mt-2 text-sm text-gray-400">
                    <p>PUC Expires: {new Date(vehicle.pucExpiryDate).toLocaleDateString()}</p>
                    <p>Insurance Expires: {new Date(vehicle.insuranceExpiryDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm transition-colors">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Vehicle Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-effect p-8 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Register New Vehicle</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddVehicle} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {vehicleTypes.map((type) => (
                    <div
                      key={type.value}
                      onClick={() => setNewVehicle(prev => ({ ...prev, vehicleType: type.value }))}
                      className={`p-4 rounded-lg cursor-pointer transition-all text-center ${
                        newVehicle.vehicleType === type.value
                          ? 'bg-purple-600 border-2 border-purple-400'
                          : 'glass-effect border-2 border-transparent hover:border-gray-600'
                      }`}
                    >
                      <div className="text-2xl mb-2">{type.icon}</div>
                      <div className="text-sm font-medium">{type.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">RC Number</label>
                  <input
                    type="text"
                    value={newVehicle.rcNumber}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, rcNumber: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">PUC Number</label>
                  <input
                    type="text"
                    value={newVehicle.pucNumber}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, pucNumber: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">PUC Expiry Date</label>
                  <input
                    type="date"
                    value={newVehicle.pucExpiryDate}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, pucExpiryDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Insurance Number</label>
                  <input
                    type="text"
                    value={newVehicle.insuranceNumber}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, insuranceNumber: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Insurance Expiry Date</label>
                  <input
                    type="date"
                    value={newVehicle.insuranceExpiryDate}
                    onChange={(e) => setNewVehicle(prev => ({ ...prev, insuranceExpiryDate: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Vehicle Photo</label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="vehicle-photo"
                  />
                  <label
                    htmlFor="vehicle-photo"
                    className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-purple-400 transition-colors"
                  >
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Click to upload vehicle photo</p>
                      {newVehicle.vehiclePhoto && (
                        <p className="text-sm text-purple-400 mt-2">{newVehicle.vehiclePhoto.name}</p>
                      )}
                    </div>
                  </label>
                </div>
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
                  Register Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageVehicles;