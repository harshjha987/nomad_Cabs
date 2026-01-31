import { useState } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { CreditCard, Loader } from "lucide-react";
import { toast } from "react-toastify";
import paymentService from "../../../services/paymentService";

const PaymentForm = ({ booking, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {      
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/rider',
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message);
        toast.error(stripeError.message, { theme: "dark" });
        
        await paymentService.markPaymentFailed(
          booking.id, 
          stripeError.message
        );
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        
        await paymentService.updatePayment(booking.id, {
          paymentId: paymentIntent.id,
          amount: booking.fare_amount,
          paymentMethod: paymentIntent.payment_method_types[0] || 'upi',
        });

        toast.success("Payment successful! 🎉", { theme: "dark" });
        onSuccess?.();
      }
    } catch (err) {
      setError(err.message || "Payment failed. Please try again.");
      toast.error(err.message || "Payment failed", { theme: "dark" });
      
      try {
        await paymentService.markPaymentFailed(booking.id, err.message);
      } catch (backendErr) {
        console.error("Failed to mark payment as failed:", backendErr);
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div className="bg-[#1a1a1a] rounded-xl p-4 border border-white/10">
        <PaymentElement />
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="flex-1 px-6 py-3 rounded-xl bg-white/10 text-white border border-white/15 hover:bg-white/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pay ₹{booking.fare_amount}
            </>
          )}
        </button>
      </div>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center">
        By confirming payment, you agree to our Terms of Service and Privacy Policy
      </p>
    </form>
  );
};

export default PaymentForm;