import { formatDateSafe } from "../../../utils/DateUtil";
import {
  Check,
  CircleDashed,
  IndianRupee,
  TriangleAlert,
  X,
  MapPin,
  Navigation,
  User,
  Phone,
  CreditCard,
} from "lucide-react";
import { useState } from "react";
import PaymentModal from "../Payment/PaymentModal";

const BookingCards = ({ booking, user, isRider, onClose, onRefresh }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const shouldShowPayButton = 
    booking.booking_status === "completed" && 
    (booking.payment_status === "pending" || !booking.payment_status);

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    onRefresh?.();
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        onClick={onClose}
      >
        <div 
          className="bg-[#141414] text-white rounded-2xl shadow-2xl border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-slideUp"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-b from-[#141414] to-[#141414]/95 backdrop-blur-sm p-6 pb-4 border-b border-white/10 z-10">
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="absolute top-4 right-4 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:rotate-90 duration-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full mb-3 shadow-lg">
                <span className="text-lg font-bold">
                  {(user?.first_name?.[0] || "U").toUpperCase()}
                  {(user?.last_name?.[0] || "").toUpperCase()}
                </span>
              </div>
              <h2 className="text-xl font-semibold mb-1">Booking Details</h2>
              <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                {formatDateSafe(booking.created_at, {
                  locale: "en-IN",
                  timeZone: "Asia/Kolkata",
                  variant: "datetime",
                  fallback: "—",
                  assumeUTCForMySQL: true,
                })}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Location Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Trip Details
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 hover:border-green-500/30 transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/30 transition-all">
                      <MapPin className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
                        Pickup Location
                      </label>
                      <div className="text-white/90 font-medium">
                        {booking.pickup?.address || booking.pickup_address}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10 hover:border-red-500/30 transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/30 transition-all">
                      <Navigation className="w-4 h-4 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-400 uppercase tracking-wide mb-1">
                        Drop-off Location
                      </label>
                      <div className="text-white/90 font-medium">
                        {booking.dropoff?.address || booking.dropoff_address}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                <User className="w-4 h-4" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <User className="w-3 h-3" />
                    {isRider ? "Driver Name" : "Rider Name"}
                  </label>
                  <div className="text-white/90 font-medium">
                    {isRider ? (booking?.driver_name || "Not assigned yet") : (booking?.rider_name || "—")}
                  </div>
                </div>

                <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    {isRider ? "Driver Mobile" : "Rider Mobile"}
                  </label>
                  <div className="text-white/90 font-medium">
                    {user?.phone_number || "—"}
                  </div>
                </div>
              </div>
            </div>

            {/* Fare and Status */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                Payment Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-4 rounded-xl border border-green-500/30">
                  <label className="block text-xs text-green-400 uppercase tracking-wide mb-2">
                    Fare Amount
                  </label>
                  <div className="text-green-400 font-bold text-2xl inline-flex items-center gap-1">
                    <IndianRupee className="w-5 h-5" />
                    {booking.fare_amount ?? booking.fare ?? "TBD"}
                  </div>
                </div>

                <div className="bg-[#1a1a1a] p-4 rounded-xl border border-white/10">
                  <label className="block text-xs text-gray-400 uppercase tracking-wide mb-2">
                    Payment Status
                  </label>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      booking.payment_status === "completed"
                        ? "bg-green-900/40 text-green-300 border-green-700"
                        : booking.payment_status === "failed"
                        ? "bg-red-900/40 text-red-300 border-red-700"
                        : "bg-yellow-900/40 text-yellow-300 border-yellow-700"
                    }`}
                  >
                    {booking.payment_status === "completed" && <Check className="w-4 h-4" />}
                    {booking.payment_status === "failed" && <X className="w-4 h-4" />}
                    {booking.payment_status === "pending" && <TriangleAlert className="w-4 h-4" />}
                    {(booking.payment_status || "pending").toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Pay Now Button */}
              {shouldShowPayButton && isRider && (
                <div className="pt-4">
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <CreditCard className="w-6 h-6" />
                    Pay Now - ₹{booking.fare_amount}
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Secure payment powered by Stripe
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          booking={booking}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </>
  );
};

export default BookingCards;