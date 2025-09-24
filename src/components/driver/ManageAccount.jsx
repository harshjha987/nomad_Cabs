import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Settings, CheckCircle, AlertCircle, CreditCard, MapPin } from 'lucide-react';

const ManageAccount = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    city: user?.city || '',
    state: user?.state || ''
  });

  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    bankName: '',
    branchName: ''
  });

  const [serviceAreas, setServiceAreas] = useState([
    { id: '1', city: 'Mumbai', state: 'Maharashtra', isActive: true },
    { id: '2', city: 'Pune', state: 'Maharashtra', isActive: false }
  ]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await updateProfile(profileData);
      if (result.success) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile: ' + result.error);
      }
    } catch (error) {
      alert('Error updating profile: ' + error.message);
    }
    
    setLoading(false);
  };

  const handleUpdateBankDetails = (e) => {
    e.preventDefault();
    alert('Bank details updated successfully!');
  };

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleBankInputChange = (field, value) => {
    setBankDetails(prev => ({ ...prev, [field]: value }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'bank', label: 'Bank Details', icon: CreditCard },
    { id: 'service', label: 'Service Areas', icon: MapPin }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Account</h1>
        <p className="text-gray-400">Update your profile, bank details, and service areas</p>
      </div>

      {/* Tabs */}
      <div className="glass-effect p-1 rounded-xl mb-6 inline-flex">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture */}
          <div className="glass-effect p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
            <div className="text-center">
              <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-16 h-16" />
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors">
                Change Photo
              </button>
            </div>
          </div>

          {/* Account Information */}
          <div className="lg:col-span-2 glass-effect p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-6">Account Information</h2>
            
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={profileData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={profileData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    value={profileData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Settings className="w-5 h-5 mr-2" />
                    Update Profile
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Bank Details Tab */}
      {activeTab === 'bank' && (
        <div className="glass-effect p-8 rounded-xl">
          <h2 className="text-2xl font-semibold mb-6">Bank Details</h2>
          
          <form onSubmit={handleUpdateBankDetails} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Account Holder Name</label>
                <input
                  type="text"
                  value={bankDetails.accountHolderName}
                  onChange={(e) => handleBankInputChange('accountHolderName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Account Number</label>
                <input
                  type="text"
                  value={bankDetails.accountNumber}
                  onChange={(e) => handleBankInputChange('accountNumber', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">IFSC Code</label>
                <input
                  type="text"
                  value={bankDetails.ifscCode}
                  onChange={(e) => handleBankInputChange('ifscCode', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Bank Name</label>
                <input
                  type="text"
                  value={bankDetails.bankName}
                  onChange={(e) => handleBankInputChange('bankName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Branch Name</label>
                <input
                  type="text"
                  value={bankDetails.branchName}
                  onChange={(e) => handleBankInputChange('branchName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-purple-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center justify-center"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Update Bank Details
            </button>
          </form>
        </div>
      )}

      {/* Service Areas Tab */}
      {activeTab === 'service' && (
        <div className="glass-effect p-8 rounded-xl">
          <h2 className="text-2xl font-semibold mb-6">Service Areas</h2>
          
          <div className="space-y-4">
            {serviceAreas.map((area) => (
              <div key={area.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <MapPin className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="font-medium">{area.city}, {area.state}</p>
                    <p className="text-sm text-gray-400">Service area</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    area.isActive ? 'bg-green-900/20 text-green-400' : 'bg-gray-900/20 text-gray-400'
                  }`}>
                    {area.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => setServiceAreas(prev => prev.map(a => 
                      a.id === area.id ? { ...a, isActive: !a.isActive } : a
                    ))}
                    className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                      area.isActive 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {area.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-6 flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors">
            <MapPin className="w-5 h-5 mr-2" />
            Add Service Area
          </button>
        </div>
      )}

      {/* Account Status */}
      <div className="mt-8 glass-effect p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Account Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
            <div>
              <p className="font-medium">Account Active</p>
              <p className="text-sm text-gray-400">Your account is in good standing</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
            <div>
              <p className="font-medium">Email Verified</p>
              <p className="text-sm text-gray-400">Your email is verified</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-yellow-400 mr-3" />
            <div>
              <p className="font-medium">Documents Pending</p>
              <p className="text-sm text-gray-400">Some documents need verification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAccount;