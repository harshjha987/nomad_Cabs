import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { bookingService } from '../../services/bookingService';
import PaymentModal from '../Common/Payment/PaymentModal';
import { MapPin, Clock, User, Phone, X, Car } from 'lucide-react';
import { toast } from 'react-toastify';

const RideTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location.state?.bookingId;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);



  const fetchBookingStatus = async () => {
    try {
      const data = await bookingService.getBookingDetails(bookingId);
      setBooking(data);

      if (data.booking_status === 'completed' && data.payment_status === 'pending') {
        setShowPaymentModal(true);
      }
      
      if (data.booking_status === 'completed' && data.payment_status === 'completed') {
        setTimeout(() => navigate('/rider'), 2000);
      } else if (data.booking_status === 'cancelled') {
        toast.error('Ride cancelled');
        setTimeout(() => navigate('/rider'), 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to fetch ride status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!bookingId) {
      navigate('/rider');
      return;
    }
    fetchBookingStatus();
    const interval = setInterval(fetchBookingStatus, 3000);
    return () => clearInterval(interval);
  }, [bookingId]);

  useEffect(() => {
    if (booking?.booking_status === 'started') {
      const timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [booking?.booking_status]);

  const handleCancelBooking = async () => {
    setCancelLoading(true);
    try {
      await bookingService.cancelBooking(bookingId);
      setTimeout(() => navigate('/rider'), 1500);
    } catch (error) {
      toast.error(error.message || 'Failed to cancel');
    } finally {
      setCancelLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    toast.success('🎉 Payment successful!');
    fetchBookingStatus();
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#151212] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/10 border-t-white mx-auto mb-4" />
          <p className="text-white/60">Loading ride...</p>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-[#151212] text-white p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-[#141414] rounded-2xl p-6 mb-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-semibold mb-1">
                {booking.booking_status === 'accepted' ? '🚗 Driver on the way' : 
                 booking.booking_status === 'started' ? '🚀 Ride in Progress' : 
                 '✅ Ride Completed'}
              </h1>
              <p className="text-white/60 text-sm">
                {booking.booking_status === 'accepted' ? 'Your driver will arrive soon' : 
                 booking.booking_status === 'started' ? 'Enjoy your ride' : 
                 'Please complete payment'}
              </p>
            </div>
            <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center">
              <Car className="w-7 h-7 text-green-400 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              booking.booking_status !== 'pending' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'
            }`}>
              Accepted
            </div>
            <div className={`w-8 h-0.5 ${booking.booking_status === 'started' || booking.booking_status === 'completed' ? 'bg-green-500' : 'bg-white/10'}`} />
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              booking.booking_status === 'started' || booking.booking_status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'
            }`}>
              Started
            </div>
            <div className={`w-8 h-0.5 ${booking.booking_status === 'completed' ? 'bg-green-500' : 'bg-white/10'}`} />
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              booking.booking_status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'
            }`}>
              Completed
            </div>
          </div>

          {/* Timer */}
          {booking.booking_status === 'started' && (
            <div className="mt-4 py-3 px-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center justify-between">
                <span className="text-white/60 text-sm">Ride Duration</span>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span className="text-xl font-bold text-blue-400">{formatTime(elapsedTime)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Driver Info */}
        <div className="bg-[#141414] rounded-2xl p-6 mb-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Driver</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-medium">{booking.driver_name || 'Driver'}</p>
                <p className="text-sm text-white/60">{booking.vehicle_type?.toUpperCase()}</p>
              </div>
            </div>
            {booking.driver_phone && (
              <a
                href={`tel:${booking.driver_phone}`}
                className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition"
              >
                <Phone className="w-5 h-5 text-white" />
              </a>
            )}
          </div>
        </div>

        {/* Trip Details */}
        <div className="bg-[#141414] rounded-2xl p-6 mb-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Trip</h2>
          
          {/* Pickup */}
          <div className="flex gap-3 mb-4 pb-4 border-b border-white/5">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Pickup</p>
              <p className="text-sm">{booking.pickup_address}</p>
            </div>
          </div>

          {/* Dropoff */}
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Dropoff</p>
              <p className="text-sm">{booking.dropoff_address}</p>
            </div>
          </div>

          {/* Fare */}
          <div className="flex justify-between items-center pt-4 border-t border-white/5">
            <span className="text-white/60">Estimated Fare</span>
            <span className="text-2xl font-bold text-green-400">₹{booking.fare_amount}</span>
          </div>
        </div>

        {/* Cancel Button*/}
        {booking.booking_status === 'accepted' || booking.booking_status === 'pending' && (
          <button
            onClick={handleCancelBooking}
            disabled={cancelLoading}
            className="w-full p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl font-medium transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <X className="w-5 h-5" />
                Cancel Ride
              </>
            )}
          </button>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && booking && (
        <PaymentModal
          booking={booking}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
};

export default RideTracking;