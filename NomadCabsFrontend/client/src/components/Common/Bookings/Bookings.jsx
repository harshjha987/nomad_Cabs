import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchFilter from "./SearchFilter";
import BookingCard from "./BookingCard";
import Pagination from "../Pagination";
import BookingCards from "./BookingCards";
import { useAuthStore } from "../../../store/authStore";
import { bookingService, driverBookingService } from "../../../services/bookingService";
import { toast } from "react-toastify";

const Bookings = ({ isRider = false, userRole = null }) => {
  const navigate = useNavigate();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterType, setFilterType] = useState("pickup");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingsData, setBookingsData] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
  });

  const user = useAuthStore((s) => s.user);
  const isDriver = userRole === "driver" || user?.role === "DRIVER";
  const pollingIntervalRef = useRef(null);

  const closeBooking = () => setSelectedBooking(null);

  const handleBookingClick = (booking) => {
    const activeStatuses = ['accepted', 'started'];
    if (activeStatuses.includes(booking.booking_status?.toLowerCase())) {
      const path = isDriver ? '/driver/ride-tracking' : '/rider/ride-tracking';
      navigate(path, { state: { bookingId: booking.id }, replace: true });
    } else {
      setSelectedBooking(booking);
    }
  };

  const fetchBookings = useCallback(async (isPoll = false) => {
    if (!isPoll) setLoading(true);
    try {
      const filters = {
        filterType: filterType !== "status" ? filterType : undefined,
        searchTerm: filterType !== "status" ? searchTerm : undefined,
        status: filterType === "status" ? searchTerm : statusFilter,
        page: currentPage,
        size: 10,
      };

      const service = isDriver ? driverBookingService : bookingService;
      const data = await service.getMyBookings(filters);
      setBookingsData(data);

    } catch (error) {
      console.error("Error fetching bookings:", error);
      if (!isPoll) {
        toast.error(error.message || "Failed to fetch bookings", { theme: "dark" });
      }
    } finally {
      if (!isPoll) setLoading(false);
    }
  }, [isDriver, filterType, searchTerm, statusFilter, currentPage]);

  useEffect(() => {
    const activeBooking = bookingsData.content.find(b => 
      ['accepted', 'started'].includes(b.booking_status?.toLowerCase())
    );

    if (activeBooking) {
      console.log(`Active booking found (Status: ${activeBooking.booking_status}). Navigating...`);
      const path = isDriver ? '/driver/ride-tracking' : '/rider/ride-tracking';
      navigate(path, { state: { bookingId: activeBooking.id }, replace: true });
    }
  }, [bookingsData, isDriver, navigate]);


  useEffect(() => {
    if (user) {
      fetchBookings(false);
    }
  }, [user, filterType, searchTerm, statusFilter, currentPage, fetchBookings]);

  useEffect(() => {
    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

    pollingIntervalRef.current = setInterval(() => {
      fetchBookings(true);
    }, 5000);

    return () => clearInterval(pollingIntervalRef.current);
  }, [fetchBookings]);

  const refreshBookings = () => fetchBookings(false);

  useEffect(() => {
    if (selectedBooking) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = "auto"; };
    }
  }, [selectedBooking]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-white/10 border-t-white" />
          <div className="absolute inset-0 flex items-center justify-center text-white/70 text-lg">
            🚗
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#151212] text-white">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold text-white mb-3">
          {`Good ${new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}${user?.first_name ? ", " + user.first_name : ""}!`}
        </h1>
        <p className="text-gray-300">Manage your ride bookings efficiently</p>
      </div>

      <SearchFilter
        filterType={filterType}
        setFilterType={setFilterType}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <ul className="space-y-4 flex-grow pb-24">
        {bookingsData.content.length === 0 ? (
          <div className="bg-[#141414] rounded-2xl p-12 text-center border border-white/10">
            <p className="text-gray-400 text-lg">No bookings found</p>
          </div>
        ) : (
          bookingsData.content.map((booking) => (
            <li key={booking.id}>
              <BookingCard
                booking={booking}
                isRider={isRider || !isDriver}
                onBookingClick={() => handleBookingClick(booking)}
              />
            </li>
          ))
        )}
      </ul>

      <Pagination
        currentPage={currentPage + 1}
        totalPages={bookingsData.totalPages || 1}
        onPageChange={(page) => setCurrentPage(page - 1)}
        position="relative"
        showLabels={false}
        variant="dark"
      />

      {selectedBooking && (
        <BookingCards
          booking={selectedBooking}
          user={user}
          isRider={isRider || !isDriver}
          onClose={closeBooking}
          onRefresh={refreshBookings}
        />
      )}
    </div>
  );
};

export default Bookings;