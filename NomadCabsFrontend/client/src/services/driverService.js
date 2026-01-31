import { useAuthStore } from "../store/authStore";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8080/api/v1";

// Get token from store
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

    // Handle 204 No Content
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
// DRIVER PROFILE MANAGEMENT
// ============================================
export const driverService = {
  /**
   * Get my driver profile
   */
  async getMyProfile() {
    return apiCall("/drivers/me");
  },

  /**
   * Create driver profile
   */
  async createProfile(data) {
    return apiCall("/drivers/me/profile", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /**
   * Update driver profile
   */
  async updateProfile(data) {
    return apiCall("/drivers/me/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};

// ============================================
// ADMIN DRIVER MANAGEMENT
// ============================================
export const adminDriverService = {
  /**
   * Get all drivers with pagination
   * @param {number} page - Page number (0-indexed)
   * @param {number} size - Page size
   * @param {string} status - Optional verification status filter
   */
  async getAllDriversPaginated(page = 0, size = 20, status = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (status) {
      params.append("status", status.toUpperCase());
    }

    return apiCall(`/admin/drivers?${params.toString()}`);
  },


  async getDriverById(driverId) {
    return apiCall(`/admin/drivers/${driverId}`);
  },

  /**
   * Verify driver (approve/reject/under_review)
   * @param {string} driverId - Driver ID
   * @param {string} action - APPROVE | REJECT | UNDER_REVIEW
   * @param {string} rejectionReason - Optional reason if rejecting
   */
  async verifyDriver(driverId, action, rejectionReason = null) {
    const data = {
      action: action.toUpperCase(),
      rejectionReason,
    };
    return apiCall(`/admin/drivers/${driverId}/verify`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete driver
   */
  async deleteDriver(driverId) {
    return apiCall(`/admin/drivers/${driverId}`, {
      method: "DELETE",
    });
  },
};

export default {
  driverService,
  adminDriverService,
};