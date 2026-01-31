import { useAuthStore } from "../store/authStore";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080/api/v1";

const getToken = () => useAuthStore.getState().token;

const getAuthHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const apiCall = async (endpoint, options = {}) => {
  try {
    console.log(`📤 API Call: ${options.method || 'GET'} ${endpoint}`, options.body ? JSON.parse(options.body) : '');
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    console.log(`📥 Response status: ${response.status}`);

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      console.error(`❌ API Error:`, error);
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    if (response.status === 204) {
      return null;
    }

    const data = await response.json();
    console.log(`✅ API Success:`, data);
    return data;
    
  } catch (error) {
    console.error(`❌ Payment API Error [${endpoint}]:`, error);
    throw error;
  }
};

export const paymentService = {

  async createPaymentIntent(bookingId) {
    console.log('🔑 Creating payment intent for booking:', bookingId);
    
    return apiCall("/payments/rider/create-intent", {
      method: "POST",
      body: JSON.stringify({ 
        booking_id: bookingId
      }),
    });
  },


  async updatePayment(bookingId, paymentData) {
    
    return apiCall("/payments", {
      method: "POST",
      body: JSON.stringify({
        booking_id: bookingId,
        payment_id: paymentData.paymentId,
        amount: paymentData.amount,
        payment_method: paymentData.paymentMethod || "upi",
        payment_status: "completed",
      }),
    });
  },

  async getPaymentDetails(bookingId) {
    console.log('📋 Getting payment details for booking:', bookingId);
    return apiCall(`/payments/${bookingId}`);
  },

  async markPaymentFailed(bookingId, reason = "") {
    console.log('❌ Marking payment as failed for booking:', bookingId, 'Reason:', reason);
    return apiCall(`/payments/${bookingId}/failed?reason=${encodeURIComponent(reason)}`, {
      method: "POST",
    });
  },

  async markPaymentComplete(bookingId) {
    console.log('✅ Marking payment as complete for booking:', bookingId);
    return apiCall(`/payments/driver/${bookingId}/complete`, {
      method: "POST",
    });
  },
};

export default paymentService;