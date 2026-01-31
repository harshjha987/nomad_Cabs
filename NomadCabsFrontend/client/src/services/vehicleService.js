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
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

// ============================================
// DRIVER VEHICLE MANAGEMENT
// ============================================
export const vehicleService = {
  /**
   * Get my vehicles
   */
  async getMyVehicles() {
    return apiCall("/vehicles");
  },

  /**
   * Get single vehicle
   */
  async getVehicle(vehicleId) {
    return apiCall(`/vehicles/${vehicleId}`);
  },

  /**
   * Add new vehicle
   */
  async addVehicle(data) {
    // Transform frontend format to backend format
    const payload = {
      registrationNumber: data.rc_number || data.registrationNumber,
      vehicleType: (data.vehicle_type || data.vehicleType).toUpperCase(),
      manufacturer: data.manufacturer || null,
      model: data.model || null,
      year: data.year ? parseInt(data.year) : null,
      color: data.color || null,
      insuranceNumber: data.insurance_policy_number || data.insuranceNumber || null,
      insuranceExpiryDate: data.insurance_expiry || data.insuranceExpiryDate || null,
      rcNumber: data.rc_number || data.registrationNumber,
      rcExpiryDate: data.rc_expiry || data.rcExpiryDate || null,
      pucNumber: data.puc_number || data.pucNumber || null,
      pucExpiryDate: data.puc_expiry || data.pucExpiryDate || null,
    };

    return apiCall("/vehicles", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Update vehicle
   */
  async updateVehicle(vehicleId, data) {
    const payload = {
      manufacturer: data.manufacturer || null,
      model: data.model || null,
      year: data.year ? parseInt(data.year) : null,
      color: data.color || null,
      insuranceNumber: data.insurance_policy_number || data.insuranceNumber || null,
      insuranceExpiryDate: data.insurance_expiry || data.insuranceExpiryDate || null,
      rcNumber: data.rc_number || data.rcNumber || null,
      rcExpiryDate: data.rc_expiry || data.rcExpiryDate || null,
      pucNumber: data.puc_number || data.pucNumber || null,
      pucExpiryDate: data.puc_expiry || data.pucExpiryDate || null,
    };

    return apiCall(`/vehicles/${vehicleId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /**
   * Delete vehicle (soft delete)
   */
  async deleteVehicle(vehicleId) {
    return apiCall(`/vehicles/${vehicleId}`, {
      method: "DELETE",
    });
  },
};

// ============================================
// ADMIN VEHICLE MANAGEMENT
// ============================================
export const adminVehicleService = {
  /**
   * Get vehicles by status with pagination
   */
  async getVehiclesByStatus(status = "PENDING", page = 0, size = 20) {
    const params = new URLSearchParams({
      status: status.toUpperCase(),
      page: page.toString(),
      size: size.toString(),
    });
    return apiCall(`/admin/vehicles?${params.toString()}`);
  },

  /**
   * Verify vehicle (approve/reject/under_review)
   */
  async verifyVehicle(vehicleId, action, rejectionReason = null) {
    const data = {
      action: action.toUpperCase(),
      rejectionReason,
    };
    return apiCall(`/admin/vehicles/${vehicleId}/verify`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  async getDriverVehicles(driverId) {
    return apiCall(`/admin/vehicles/driver/${driverId}`);
  },
};

export default {
  vehicleService,
  adminVehicleService,
};