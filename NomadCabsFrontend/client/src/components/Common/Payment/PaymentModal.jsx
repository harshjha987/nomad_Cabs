import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { X, CreditCard, Lock, Loader } from "lucide-react";
import { toast } from "react-toastify";
import { STRIPE_CONFIG } from "../../../config/stripe";
import PaymentForm from "./PaymentForm";
import paymentService from "../../../services/paymentService";

const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

const PaymentModal = ({ booking, onClose, onSuccess }) => {
  const [mounted, setMounted] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        setLoading(true);

        const bookingId=booking.id;
        const response = await paymentService.createPaymentIntent(bookingId);      
        setClientSecret(response.client_secret);
      } catch (err) {
        setError(err.message || 'Failed to initialize payment');
        toast.error(err.message || 'Failed to initialize payment', { theme: 'dark' });
      } finally {
        setLoading(false);
      }
    };

    if (booking?.id) {
      fetchClientSecret();
    }
  }, [booking?.id]);

  if (!mounted || !booking) return null;

  if (loading) {
    return (
      <div 
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      >
        <div className="bg-[#141414] text-white rounded-2xl p-8 border border-white/10 flex flex-col items-center gap-4">
          <Loader className="w-12 h-12 animate-spin text-white" />
          <p className="text-sm text-gray-400">Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div className="bg-[#141414] text-white rounded-2xl p-8 border border-white/10 max-w-md">
          <h3 className="text-xl font-semibold mb-4 text-red-400">Payment Error</h3>
          <p className="text-sm text-gray-400 mb-6">{error}</p>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret: clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#ff4d31',
        colorBackground: '#1a1a1a',
        colorText: '#ffffff',
        colorDanger: '#df1b41',
        fontFamily: 'Poppins, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '12px',
      },
    },
  };

  return (
    <div 
      className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-[#141414] text-white rounded-2xl shadow-2xl border border-white/10 w-full max-w-md max-h-[90vh] overflow-y-auto relative animate-slideUp"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-b from-[#141414] to-[#141414]/95 backdrop-blur-sm p-6 pb-4 border-b border-white/10 z-10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all hover:rotate-90 duration-300"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-full mb-3 shadow-lg">
              <CreditCard className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Complete Payment</h2>
            <p className="text-gray-400 text-sm">Secure payment powered by Stripe</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Booking Summary */}
          <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/10 space-y-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
              Booking Summary
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">From</span>
                <span className="text-white/90 font-medium text-right max-w-[60%] truncate">
                  {booking.pickup_address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">To</span>
                <span className="text-white/90 font-medium text-right max-w-[60%] truncate">
                  {booking.dropoff_address}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Vehicle</span>
                <span className="text-white/90 font-medium uppercase">
                  {booking.vehicle_type}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-center">
              <span className="text-gray-400 font-medium">Total Amount</span>
              <div className="flex items-center gap-1 text-green-400 font-bold text-2xl">
                <span className="text-lg">₹</span>
                {booking.fare_amount}
              </div>
            </div>
          </div>

          {/* Stripe Payment Form */}
          {clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm 
                booking={booking} 
                onSuccess={onSuccess} 
                onCancel={onClose} 
              />
            </Elements>
          )}

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Lock className="w-3 h-3" />
            <span>Secured by Stripe • Your payment info is encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;