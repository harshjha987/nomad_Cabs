import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useBooking } from '../../contexts/BookingContext';
import { MapPin, Navigation, Calendar, Clock, CheckCircle, DollarSign, Phone, CreditCard } from 'lucide-react';

const BookVehicle = () => {
  const { user } = useAuth();
  const { createBooking, calculateFare } = useBooking();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    pickupAddress: '',
    dropoffAddress: '',
    scheduledDate: '',
    scheduledTime: '',
    vehicleType: '',
    paymentMethod: 'cash'
  });

  const vehicleTypes = [
    {
      type: 'bike',
      name: 'Bike',
      description: 'Quick and economical',
      capacity: '1 person',
      icon: '🏍️',
      basePrice: 50
    },
    {
      type: 'auto',
      name: 'Auto Rickshaw',
      description: 'Affordable short trips',
      capacity: '3 people',
      icon: '🛺',
      basePrice: 80
    },
    {
      type: 'hatchback',
      name: 'Hatchback',
      description: 'Comfortable rides',
      capacity: '4 people',
      icon: '🚗',
      basePrice: 120
    },
    {
      type: 'sedan',
      name: 'Sedan',
      description: 'Premium comfort',
      capacity: '4 people',
      icon: '🚙',
      basePrice: 150
    },
    {
      type: 'suv',
      name: 'SUV',
      description: 'Spacious family rides',
      capacity: '6-7 people',
      icon: '🚐',
      basePrice: 200
    }
  ];

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleBooking = async () => {
    setLoading(true);
    try {
      const booking = {
        ...bookingData,
        riderId: user.id,
        status: 'pending',
        fare: calculateFare(5, bookingData.vehicleType).total // Mock distance of 5km
      };

      const result = await createBooking(booking);
      if (result.success) {
        alert('Booking created successfully!');
        setStep(1);
        setBookingData({
          pickupAddress: '',
          dropoffAddress: '',
          scheduledDate: '',
          scheduledTime: '',
          vehicleType: '',
          paymentMethod: 'cash'
        });
      } else {
        alert('Failed to create booking: ' + result.error);
      }
    } catch (error) {
      alert('Error creating booking: ' + error.message);
    }
    setLoading(false);
  };

  const fareBreakdown = bookingData.vehicleType ? calculateFare(5, bookingData.vehicleType) : null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Book a Vehicle</h1>
        <p className="text-gray-400">Choose your ride and get moving</p>
      </div>

      {/* Progress Steps */}
      <div className="glass-effect p-6 rounded-xl mb-6">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
              }`}>
                {stepNum}
              </div>
              <span className={`ml-2 ${step >= stepNum ? 'text-white' : 'text-gray-400'}`}>
                {stepNum === 1 ? 'Ride Details' : stepNum === 2 ? 'Vehicle Selection' : 'Payment'}
              </span>
              {stepNum < 3 && <div className={`w-16 h-1 mx-4 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-700'}`}></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="glass-effect p-8 rounded-xl">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Ride Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Pickup Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400 w-5 h-5" />
                  <input
                    type="text"
                    value={bookingData.pickupAddress}
                    onChange={(e) => handleInputChange('pickupAddress', e.target.value)}
                    placeholder="Enter pickup location"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Drop-off Location</label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 w-5 h-5" />
                  <input
                    type="text"
                    value={bookingData.dropoffAddress}
                    onChange={(e) => handleInputChange('dropoffAddress', e.target.value)}
                    placeholder="Enter destination"
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                  <input
                    type="date"
                    value={bookingData.scheduledDate}
                    onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                  <input
                    type="time"
                    value={bookingData.scheduledTime}
                    onChange={(e) => handleInputChange('scheduledTime', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!bookingData.pickupAddress || !bookingData.dropoffAddress}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Next: Select Vehicle
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Select Vehicle Type</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicleTypes.map((vehicle) => (
                <div
                  key={vehicle.type}
                  onClick={() => handleInputChange('vehicleType', vehicle.type)}
                  className={`p-6 rounded-xl cursor-pointer transition-all card-hover ${
                    bookingData.vehicleType === vehicle.type
                      ? 'bg-blue-600 border-2 border-blue-400'
                      : 'glass-effect border-2 border-transparent hover:border-gray-600'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{vehicle.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{vehicle.name}</h3>
                    <p className="text-sm text-gray-300 mb-2">{vehicle.description}</p>
                    <p className="text-xs text-gray-400 mb-3">{vehicle.capacity}</p>
                    <p className="text-xl font-bold text-blue-400">₹{vehicle.basePrice}+</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!bookingData.vehicleType}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                Next: Payment
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-6">Payment & Confirmation</h2>
            
            {/* Fare Breakdown */}
            {fareBreakdown && (
              <div className="glass-effect p-6 rounded-xl mb-6">
                <h3 className="text-lg font-semibold mb-4">Fare Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Base Fare</span>
                    <span>₹{fareBreakdown.baseFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance Fare (5 km)</span>
                    <span>₹{fareBreakdown.distanceFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span>₹{fareBreakdown.platformFee}</span>
                  </div>
                  <div className="border-t border-gray-600 pt-2 mt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>₹{fareBreakdown.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'cash', label: 'Cash', icon: DollarSign },
                  { id: 'upi', label: 'UPI', icon: Phone },
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'wallet', label: 'Wallet', icon: CreditCard }
                ].map((method) => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      onClick={() => handleInputChange('paymentMethod', method.id)}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        bookingData.paymentMethod === method.id
                          ? 'bg-blue-600 border-2 border-blue-400'
                          : 'glass-effect border-2 border-transparent hover:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <Icon className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-sm">{method.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Booking Summary */}
            <div className="glass-effect p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">From:</span>
                  <span>{bookingData.pickupAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">To:</span>
                  <span>{bookingData.dropoffAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vehicle:</span>
                  <span className="capitalize">{bookingData.vehicleType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Date & Time:</span>
                  <span>{bookingData.scheduledDate} {bookingData.scheduledTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Payment:</span>
                  <span className="capitalize">{bookingData.paymentMethod}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleBooking}
                disabled={loading}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center"
              >
                {loading ? (
                  <>
                    <div className="loading-spinner mr-2"></div>
                    Booking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Confirm Booking
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookVehicle;