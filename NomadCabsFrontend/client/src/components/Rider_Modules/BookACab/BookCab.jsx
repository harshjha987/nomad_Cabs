import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  StepsProgress,
  StepRideDetails,
  StepVehicle,
  StepPayment,
} from "./BookingSteps";
import {
  getMockCoordinates,
} from "./bookingData";
import { bookingService } from "../../../services/bookingService";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../store/authStore";
import { AlertCircle, RefreshCw } from "lucide-react";

const BookCab = ({ setActiveSection }) => {
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    pickupAddress: "",
    dropoffAddress: "",
    scheduledDate: "",
    scheduledTime: "",
    vehicleType: "",
    paymentMethod: "cash",
  });
  const [hasActiveBooking, setHasActiveBooking] = useState(false);
  const [activeBookingId, setActiveBookingId] = useState(null);
  const [activeBookingStatus, setActiveBookingStatus] = useState(null);
  const [checkingBookings, setCheckingBookings] = useState(true);

  const checkActiveBookings = useCallback(async () => {
    if (!token) return;

    setCheckingBookings(true);
    try {
      const data = await bookingService.getMyBookings({ page: 0, size: 50 });
      
      const activeBooking = data.content?.find(b => {
        const status = b.booking_status?.toUpperCase();
        return ['PENDING', 'ACCEPTED', 'STARTED'].includes(status);
      });

      if (activeBooking) {
        setHasActiveBooking(true);
        setActiveBookingId(activeBooking.id);
        setActiveBookingStatus(activeBooking.booking_status);
        
        if (['PENDING','ACCEPTED', 'STARTED'].includes(activeBooking.booking_status)) {
          navigate('/rider/ride-tracking', { 
            state: { bookingId: activeBooking.id },
            replace: true 
          });
        }
      } else {
        setHasActiveBooking(false);
        setActiveBookingId(null);
        setActiveBookingStatus(null);
      }
    } catch (error) {
      console.error('Error checking active bookings:', error);
      setHasActiveBooking(false);
    } finally {
      setCheckingBookings(false);
    }
  }, [token, navigate]);

  useEffect(() => {
    checkActiveBookings();
  }, [checkActiveBookings]);

  const updateField = (field, value) =>
    setBookingData((prev) => ({ ...prev, [field]: value }));
  
  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
  if (hasActiveBooking) {
    toast.error("You already have an active booking. Please complete it first.", { theme: "dark" });
    return;
  }

  setLoading(true);
  
  try {
    const pickupCoords = await getMockCoordinates(bookingData.pickupAddress);
    const dropoffCoords = await getMockCoordinates(bookingData.dropoffAddress);
    
    const payload = {
      pickup_latitude: pickupCoords.lat,
      pickup_longitude: pickupCoords.lng,
      pickup_address: bookingData.pickupAddress,
      dropoff_latitude: dropoffCoords.lat,
      dropoff_longitude: dropoffCoords.lng,
      dropoff_address: bookingData.dropoffAddress,
      vehicle_type: bookingData.vehicleType.toUpperCase(), 
    };
    
    const createdBooking = await bookingService.createBooking(payload);
    
    toast.success(
      `🎉 Booking created! Fare: ₹${createdBooking.fare_amount}. Finding nearby drivers...`, 
      { theme: "dark", autoClose: 5000 }
    );
    
    // ✅ NAVIGATE TO BOOKING DETAILS OR TRACKING
    navigate('/rider/ride-tracking', { 
      state: { 
        bookingId: createdBooking.id,
        fare: createdBooking.fare_amount,
        distance: createdBooking.trip_distance_km
      } 
    });

  } catch (error) {
    console.error('Booking error:', error);
    toast.error(error.message || 'Failed to create booking', { theme: "dark" });
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-[#151212] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-semibold mb-2">Book a Ride</h1>
          <p className="text-gray-400">Choose your ride and get moving</p>
        </header>

        {checkingBookings ? (
          <div className="flex justify-center items-center py-24">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/10 border-t-white" />
              <p className="text-sm text-white/60">Checking active bookings...</p>
            </div>
          </div>
        ) : hasActiveBooking ? (
          <div className="bg-[#141414] rounded-2xl p-12 text-center border border-orange-500/30">
            <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-orange-400" />
            </div>
            <h2 className="text-2xl font-semibold mb-3 text-orange-300">
              Active Booking In Progress
            </h2>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              You already have an active booking (ID: <span className="font-mono text-orange-300">{activeBookingId}</span>). 
              <br />
              Status: <span className="font-semibold text-orange-300">{activeBookingStatus?.toUpperCase()}</span>
              <br />
              Please complete or cancel it before creating a new one.
            </p>
            <div className="flex justify-center gap-4">
              {['PENDING', 'ACCEPTED', 'STARTED'].includes(activeBookingStatus?.toUpperCase()) && (
                <button
                  onClick={() => navigate('/rider/ride-tracking', { state: { bookingId: activeBookingId } })}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition"
                >
                  Go to Ride Tracking
                </button>
              )}
              <button
                onClick={() => setActiveSection("myBooking")}
                className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition"
              >
                View My Bookings
              </button>
              <button
                onClick={checkActiveBookings}
                disabled={checkingBookings}
                className="px-6 py-3 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded-xl font-medium hover:bg-orange-500/30 transition disabled:opacity-50 flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${checkingBookings ? 'animate-spin' : ''}`} />
                Refresh Status
              </button>
            </div>
          </div>
        ) : (
          <>
            <StepsProgress step={step} />
            <div className="bg-[#141414] p-8 rounded-2xl border border-white/10">
              {step === 1 && (
                <StepRideDetails
                  data={bookingData}
                  onChange={updateField}
                  onNext={next}
                />
              )}
              {step === 2 && (
                <StepVehicle
                  data={bookingData}
                  onChange={updateField}
                  onNext={next}
                  onBack={back}
                />
              )}
              {step === 3 && (
                <StepPayment
                  data={bookingData}
                  onChange={updateField}
                  onBack={back}
                  onSubmit={handleSubmit}
                  loading={loading}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BookCab;