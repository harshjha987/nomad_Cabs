import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { driverBookingService } from '../../services/bookingService';
import paymentService from '../../services/paymentService';
import { MapPin, Clock, User, Phone, Check, Play, Flag, CreditCard } from 'lucide-react';
import { toast } from 'react-toastify';

const DriverRideTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingId = location.state?.bookingId;

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [paymentMarking, setPaymentMarking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const fetchBookingStatus = useCallback(async () => {
    if (!bookingId) return;
    try {
      const data = await driverBookingService.getBookingDetails(bookingId);
      setBooking(data);

      // If both ride and payment are complete, navigate away
      if (data.booking_status === 'completed' && data.payment_status === 'completed') {
        toast.success('🎉 Ride and payment completed!');
        setTimeout(() => navigate('/driver'), 2000);
      } else if (data.booking_status === 'cancelled') {
        toast.info(`Ride has been cancelled.`);
        setTimeout(() => navigate('/driver'), 2000);
      }
    } catch (error) {
      console.error('Error fetching ride status:', error);
      toast.error('Failed to fetch ride status');
      navigate('/driver');
    } finally {
      setLoading(false);
    }
  }, [bookingId, navigate]);

  useEffect(() => {
    if (!bookingId) {
      toast.error("No booking ID found.");
      navigate('/driver');
      return;
    }
    fetchBookingStatus();
    const interval = setInterval(fetchBookingStatus, 10000);
    return () => clearInterval(interval);
  }, [bookingId, navigate, fetchBookingStatus]);

  useEffect(() => {
    let timer;
    if (booking?.booking_status === 'started') {
      const startTime = new Date(booking.start_time);
      const now = new Date();
      const initialElapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(initialElapsed > 0 ? initialElapsed : 0);
      
      timer = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [booking?.booking_status, booking?.start_time]);

  const handleStartRide = async () => {
    setActionLoading(true);
    try {
      await driverBookingService.startRide(bookingId);
      toast.success('🚀 Ride Started!');
      fetchBookingStatus();
    } catch (error) {
      toast.error(error.message || 'Failed to start ride');
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleCompleteRide = async () => {
    const finalDistance = prompt("Enter final trip distance in KM (optional):");
    const finalDuration = Math.round(elapsedTime / 60);

    setActionLoading(true);
    try {
      const payload = {
        finalDistanceKm: finalDistance ? parseFloat(finalDistance) : null,
        finalDurationMinutes: finalDuration > 0 ? finalDuration : null,
      };
      await driverBookingService.completeRide(bookingId, payload);
      toast.success('🎉 Ride Completed! Waiting for payment...');
      fetchBookingStatus();
    } catch (error) {
      toast.error(error.message || 'Failed to complete ride');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkPaymentComplete = async () => {
    const confirmPayment = window.confirm(
      "Have you received the payment from the rider?\n\nThis will mark the booking as fully complete."
    );
    
    if (!confirmPayment) return;
    
    setPaymentMarking(true);
    try {
      await paymentService.markPaymentComplete(bookingId);
      toast.success('✅ Payment marked as complete!');
      fetchBookingStatus();
    } catch (error) {
      toast.error(error.message || 'Failed to mark payment complete');
    } finally {
      setPaymentMarking(false);
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#151212] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/10 border-t-white mx-auto mb-4" />
          <p className="text-white/60">Loading ride details...</p>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  const renderActionButtons = () => {
    if (booking.booking_status === 'accepted') {
      return (
        <button
          onClick={handleStartRide}
          disabled={actionLoading}
          className="w-full p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play className="w-5 h-5" />
          {actionLoading ? 'Starting...' : 'Start Ride'}
        </button>
      );
    }
    if (booking.booking_status === 'started') {
      return (
        <button
          onClick={handleCompleteRide}
          disabled={actionLoading}
          className="w-full p-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Flag className="w-5 h-5" />
          {actionLoading ? 'Completing...' : 'Complete Ride'}
        </button>
      );
    }
    if (booking.booking_status === 'completed' && booking.payment_status === 'pending') {
      return (
        <button
          onClick={handleMarkPaymentComplete}
          disabled={paymentMarking}
          className="w-full p-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard className="w-5 h-5" />
          {paymentMarking ? 'Marking Complete...' : 'Mark Payment as Complete'}
        </button>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#151212] text-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-[#141414] rounded-2xl p-6 mb-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-semibold mb-1">
                {booking.booking_status === 'accepted' ? 'Pickup Rider' : 
                 booking.booking_status === 'started' ? 'Ride in Progress' : 
                 'Ride Completed'}
              </h1>
              <p className="text-white/60 text-sm">
                Booking ID: {booking.id}
              </p>
            </div>
            <div className={`w-14 h-14 ${
              booking.booking_status === 'started' ? 'bg-blue-500/20' : 
              booking.booking_status === 'completed' ? 'bg-green-500/20' : 
              'bg-purple-500/20'
            } rounded-full flex items-center justify-center`}>
              <User className={`w-7 h-7 ${
                booking.booking_status === 'started' ? 'text-blue-400' : 
                booking.booking_status === 'completed' ? 'text-green-400' : 
                'text-purple-400'
              }`} />
            </div>
          </div>
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
          {booking.booking_status === 'completed' && booking.payment_status === 'pending' && (
            <div className="mt-4 py-3 px-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-yellow-400">Waiting for payment confirmation</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-[#141414] rounded-2xl p-6 mb-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Rider Details</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium">{booking.rider_name || 'Rider'}</p>
              </div>
            </div>
            {booking.rider_phone && (
              <a
                href={`tel:${booking.rider_phone}`}
                className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition"
              >
                <Phone className="w-5 h-5 text-white" />
              </a>
            )}
          </div>
        </div>

        <div className="bg-[#141414] rounded-2xl p-6 mb-6 border border-white/10">
          <h2 className="text-lg font-semibold mb-4">Trip Details</h2>
          <div className="flex gap-3 mb-4 pb-4 border-b border-white/5">
            <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Pickup</p>
              <p className="text-sm">{booking.pickup_address}</p>
            </div>
          </div>
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <p className="text-xs text-white/40 mb-1">Dropoff</p>
              <p className="text-sm">{booking.dropoff_address}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
};

export default DriverRideTracking;