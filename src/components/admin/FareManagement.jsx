import React, { useState } from 'react';
import { Plus, Edit, Trash2, XCircle } from 'lucide-react';

const FareManagement = () => {
  const [activeTab, setActiveTab] = useState('pricing');
  const [cityPricing, setCityPricing] = useState([
    {
      id: '1',
      city: 'Mumbai',
      state: 'Maharashtra',
      vehicleType: 'sedan',
      baseFare: 120,
      perKmRate: 15,
      perMinRate: 2
    },
    {
      id: '2',
      city: 'Delhi',
      state: 'Delhi',
      vehicleType: 'hatchback',
      baseFare: 100,
      perKmRate: 12,
      perMinRate: 1.5
    }
  ]);

  const [commissionRules] = useState([
    {
      id: '1',
      minFare: 0,
      maxFare: 500,
      commission: 15,
      description: 'Standard rides'
    },
    {
      id: '2',
      minFare: 501,
      maxFare: 1000,
      commission: 12,
      description: 'Medium distance rides'
    },
    {
      id: '3',
      minFare: 1001,
      maxFare: 9999,
      commission: 10,
      description: 'Long distance rides'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newPricing, setNewPricing] = useState({
    city: '',
    state: '',
    vehicleType: '',
    baseFare: '',
    perKmRate: '',
    perMinRate: ''
  });

  const vehicleTypes = ['bike', 'auto', 'hatchback', 'sedan', 'suv'];

  const handleAddPricing = (e) => {
    e.preventDefault();
    const pricing = {
      id: Date.now().toString(),
      ...newPricing,
      baseFare: parseFloat(newPricing.baseFare),
      perKmRate: parseFloat(newPricing.perKmRate),
      perMinRate: parseFloat(newPricing.perMinRate)
    };
    setCityPricing(prev => [...prev, pricing]);
    setNewPricing({
      city: '',
      state: '',
      vehicleType: '',
      baseFare: '',
      perKmRate: '',
      perMinRate: ''
    });
    setShowAddForm(false);
    alert('Pricing added successfully!');
  };

  const tabs = [
    { id: 'pricing', label: 'City Pricing' },
    { id: 'commission', label: 'Commission Rules' }
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Fare Management</h1>
          <p className="text-gray-400">Manage city-wise pricing and commission structure</p>
        </div>
        {activeTab === 'pricing' && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Pricing
          </button>
        )}
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

      {/* City Pricing */}
      {activeTab === 'pricing' && (
        <div className="space-y-4">
          {cityPricing.map((pricing) => (
            <div key={pricing.id} className="glass-effect p-6 rounded-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">
                    {pricing.city}, {pricing.state}
                  </h3>
                  <p className="text-gray-400 capitalize mb-2">{pricing.vehicleType}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Base Fare:</span>
                      <p className="font-semibold">₹{pricing.baseFare}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Per KM:</span>
                      <p className="font-semibold">₹{pricing.perKmRate}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Per Min:</span>
                      <p className="font-semibold">₹{pricing.perMinRate}</p>
                    </div>
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
          ))}
        </div>
      )}

      {/* Commission Rules */}
      {activeTab === 'commission' && (
        <div className="space-y-4">
          {commissionRules.map((rule) => (
            <div key={rule.id} className="glass-effect p-6 rounded-xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">{rule.description}</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Min Fare:</span>
                      <p className="font-semibold">₹{rule.minFare}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Max Fare:</span>
                      <p className="font-semibold">₹{rule.maxFare === 9999 ? '∞' : rule.maxFare}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Commission:</span>
                      <p className="font-semibold">{rule.commission}%</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Pricing Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-effect p-8 rounded-xl w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Add City Pricing</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleAddPricing} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={newPricing.city}
                    onChange={(e) => setNewPricing(prev => ({ ...prev, city: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    value={newPricing.state}
                    onChange={(e) => setNewPricing(prev => ({ ...prev, state: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Vehicle Type</label>
                  <select
                    value={newPricing.vehicleType}
                    onChange={(e) => setNewPricing(prev => ({ ...prev, vehicleType: e.target.value }))}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-400 focus:outline-none"
                  >
                    <option value="">Select Type</option>
                    {vehicleTypes.map((type) => (
                      <option key={type} value={type} className="capitalize">{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Base Fare (₹)</label>
                  <input
                    type="number"
                    value={newPricing.baseFare}
                    onChange={(e) => setNewPricing(prev => ({ ...prev, baseFare: e.target.value }))}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Per KM Rate (₹)</label>
                  <input
                    type="number"
                    value={newPricing.perKmRate}
                    onChange={(e) => setNewPricing(prev => ({ ...prev, perKmRate: e.target.value }))}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Per Minute Rate (₹)</label>
                  <input
                    type="number"
                    value={newPricing.perMinRate}
                    onChange={(e) => setNewPricing(prev => ({ ...prev, perMinRate: e.target.value }))}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-green-400 focus:outline-none"
                  />
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
                  className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                >
                  Add Pricing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FareManagement;