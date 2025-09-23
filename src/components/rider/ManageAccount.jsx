import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Settings, CheckCircle, AlertCircle } from 'lucide-react';

const ManageAccount = () => {
  const { user, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    city: user?.city || '',
    state: user?.state || ''
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Manage Account</h1>
        <p className="text-gray-400">Update your profile information and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Picture */}
        <div className="glass-effect p-6 rounded-xl">
          <h2 className="text-xl font-semibold mb-4">Profile Picture</h2>
          <div className="text-center">
            <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-16 h-16" />
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
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
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <input
                  type="text"
                  value={profileData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <input
                  type="text"
                  value={profileData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center"
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
              <p className="font-medium">Phone Pending</p>
              <p className="text-sm text-gray-400">Verify your phone number</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAccount;