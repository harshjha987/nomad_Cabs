import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { driverBookingService } from "../../../services/bookingService";
import { vehicleService } from "../../../services/vehicleService";
import { useAuthStore } from "../../../store/authStore";
import { toast } from "react-toastify";
import {
  MapPin,
  Navigation,
  IndianRupee,
  Car,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const Live = ({ setActiveSection }) => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [activeBooking, setActiveBooking] = useState(null);

  const intervalRef = useRef(null);

  console.log("live bookings:", bookings)

  const fetchBookings = useCallback(async () => {
    try {
      const data = await driverBookingService.getAvailableBookings();
      setBookings(data);
      setIsActive(false);
    } catch (err) {
      if (err.message?.includes("active booking")) {
        const active = await driverBookingService.getActiveBooking();
        if (active) {
          setIsActive(true);
          setActiveBooking(active);
          if (
            ["ACCEPTED", "STARTED"].includes(
              active.booking_status?.toUpperCase()
            )
          ) {
            navigate("/driver/ride-tracking", {
              state: { bookingId: active.id },
              replace: true,
            });
          }
        }
      }
    }
  }, [navigate]);

  useEffect(() => {
    const loadPrerequisites = async () => {
      if (!user) return;
      try {
        const vehicleData = await vehicleService.getMyVehicles();
        const approvedVehicles = vehicleData.filter(
          (v) => v.verificationStatus === "APPROVED"
        );
        setVehicles(approvedVehicles);
        if (approvedVehicles.length > 0) {
          setSelectedVehicle(approvedVehicles[0].id);
        }
      } catch {
        console.error("Failed to load vehicles");
      }
    };
    loadPrerequisites();
  }, [user]);

  useEffect(() => {
    if (!user || !selectedVehicle) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    fetchBookings(); // Initial fetch
    intervalRef.current = setInterval(fetchBookings, 8000); // Poll every 8 seconds

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [user, selectedVehicle, fetchBookings]);

  const handleAccept = async (bookingId) => {
    if (!selectedVehicle) {
      toast.error("You must select an approved vehicle first.", {
        theme: "dark",
      });
      return;
    }

    try {
      await driverBookingService.acceptBooking(bookingId, selectedVehicle);
      toast.success("✅ Booking accepted! Navigating to ride...", {
        theme: "dark",
      });
      navigate("/driver/ride-tracking", {
        state: { bookingId },
        replace: true,
      });
    } catch (err) {
      toast.error(
        err.message || "Failed to accept booking. It may have been taken.",
        { theme: "dark" }
      );
      fetchBookings(); 
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchBookings().finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen bg-[#151212] text-white p-6">
      {/* No Vehicle Warning */}
      {vehicles.length === 0 && !isActive && (
        <div className="bg-[#141414] rounded-2xl p-12 text-center border border-orange-500/30">
          <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Car className="w-8 h-8 text-orange-400" />
          </div>
          <h2 className="text-2xl font-semibold mb-3 text-orange-300">
            No Vehicle Found
          </h2>
          <p className="text-white/60 mb-6">
            You need to add and verify a vehicle before accepting rides.
          </p>
          <button
            onClick={() => {
              if (setActiveSection) {
                setActiveSection("vehicles");
              } else {
                navigate("/driver");
              }
            }}
            className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-100 transition"
          >
            Add Vehicle
          </button>
        </div>
      )}

      {vehicles.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-semibold mb-2">Live Bookings</h1>
              <p className="text-white/60">
                {isActive ? "Active ride in progress" : "Accept rides near you"}
              </p>
            </div>

            {!isActive && (
              <div className="flex gap-4">
                <select
                  value={selectedVehicle}
                  onChange={(e) => setSelectedVehicle(e.target.value)}
                  className="px-4 py-2 rounded-xl bg-[#1a1a1a] border border-white/10 focus:ring-2 focus:ring-white/20 outline-none min-w-[250px] disabled:opacity-50"
                  disabled={vehicles.length === 0}
                >
                  <option value="">
                    {vehicles.length > 0
                      ? "Select Vehicle"
                      : "No Approved Vehicles"}
                  </option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.manufacturer} {v.model} - {v.registrationNumber}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleRefresh}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition"
                >
                  <RefreshCw
                    className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
              </div>
            )}
          </div>

          {isActive && activeBooking ? (
            <div className="bg-[#141414] rounded-2xl p-12 text-center border border-orange-500/30">
              <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-orange-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-3 text-orange-300">
                Active Ride Detected
              </h2>
              <p className="text-white/60 mb-6">
                You have an ongoing ride. Complete it before accepting new ones.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() =>
                    navigate("/driver/ride-tracking", {
                      state: { bookingId: activeBooking.id },
                    })
                  }
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 transition"
                >
                  Go to Active Ride
                </button>
              </div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-[#141414] rounded-2xl p-12 text-center border border-white/10">
              <Car className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">
                {!selectedVehicle
                  ? "Please select a vehicle to see rides"
                  : "No rides available right now. Check back soon!"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#141414] p-6 rounded-2xl border border-white/10 hover:border-white/20 transition flex flex-col"
                >
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                    <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold">
                      {b.rider_name?.[0]?.toUpperCase() || "R"}
                    </div>
                    <div>
                      <p className="font-medium">{b.rider_name || "Rider"}</p>
                      <p className="text-xs text-white/60">{b.rider_phone}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4 flex-grow">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <p className="text-sm line-clamp-2">{b.pickup_address}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Navigation className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" />
                      <p className="text-sm line-clamp-2">
                        {b.dropoff_address}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-white/5 rounded-xl text-sm">
                    <div>
                      <p className="text-white/40 text-xs">Distance</p>
                      <p className="font-semibold">{b.trip_distance_km} km</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs">Duration</p>
                      <p className="font-semibold">
                        {b.trip_duration_minutes} min
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white/60 text-sm">Fare</span>
                    <span className="text-green-400 font-bold text-2xl flex items-center gap-1">
                      <IndianRupee className="w-5 h-5" />
                      {b.fare_amount}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAccept(b.id)}
                    disabled={!selectedVehicle}
                    className="w-full bg-white text-black py-3 rounded-xl font-medium hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Accept Ride
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Live;
