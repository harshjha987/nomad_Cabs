import { useAuthStore } from "../store/authStore";

const BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:8080/api/v1";

const getToken = () => useAuthStore.getState().token;

const apiCall = async (endpoint, options = {}) => {
  const token = getToken();
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: response.statusText || `HTTP ${response.status}` }));
      throw new Error(error.message);
    }
    
    if (response.status === 204) return null;
    return await response.json();
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
};


export const bookingService = {
  async createBooking(bookingData) {
    const payload = {
      pickup_address: bookingData.pickup_address,
      pickup_latitude: bookingData.pickup_latitude,
      pickup_longitude: bookingData.pickup_longitude,
      dropoff_address: bookingData.dropoff_address,
      dropoff_latitude: bookingData.dropoff_latitude,
      dropoff_longitude: bookingData.dropoff_longitude,
      vehicle_type: bookingData.vehicle_type,
    };
    return apiCall("/bookings", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getMyBookings(filters = {}) {
    const query = new URLSearchParams();
    Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== '') {
            query.append(key, filters[key]);
        }
    });

    return apiCall(`/bookings/me?${query.toString()}`);
  },

  async getBookingDetails(bookingId) {
    return apiCall(`/bookings/${bookingId}`);
  },

  async cancelBooking(bookingId) {
    return apiCall(`/bookings/${bookingId}/cancel`, {
      method: "PUT",
    });
  },
};

export const driverBookingService = {
  async getAvailableBookings() {
    return apiCall(`/driver/bookings/available`);
  },

  async getMyBookings(filters = {}) {
    const query = new URLSearchParams(filters);
    return apiCall(`/driver/bookings/me?${query.toString()}`);
  },

  async getActiveBooking() {
    try {
        return await apiCall(`/driver/bookings/active`);
    } catch(error) {
        if (error.message.includes('404')) return null;
        throw error;
    }
  },

  async getBookingDetails(bookingId) {
    return apiCall(`/driver/bookings/${bookingId}`);
  },

  async acceptBooking(bookingId, vehicleId) {
    return apiCall(`/driver/bookings/${bookingId}/accept`, {
        method: "PUT",
        body: JSON.stringify({ vehicle_id: vehicleId }),
      }
    );
  },

  async startRide(bookingId) {
    return apiCall(`/driver/bookings/${bookingId}/start`, {
        method: "PUT",
        body: JSON.stringify({
          start_time: new Date().toISOString(),
        }),
      }
    );
  },

  async completeRide(bookingId, data = {}) {
    const payload = {
      final_distance_km: data.finalDistanceKm || null,
      final_duration_minutes: data.finalDurationMinutes || null,
    };

    Object.keys(payload).forEach(key => {
      if (payload[key] === null) delete payload[key];
    });

    return apiCall(`/driver/bookings/${bookingId}/complete`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }
    );
  },

  async cancelBooking(bookingId, reason = "") {
    return apiCall(`/driver/bookings/${bookingId}/cancel`, {
      method: "PUT",
      body: JSON.stringify({ 
        cancellation_reason: reason || "Cancelled by driver" 
      }),
    });
  },
};

export default {
  bookingService,
  driverBookingService,
};