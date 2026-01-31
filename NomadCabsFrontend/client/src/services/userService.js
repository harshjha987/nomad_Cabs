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

    // ✅ Handle 204 No Content
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
};

export const userService = {
  async getUserById(userId) {
    return apiCall(`/admin/users/${userId}`);
  },

  async getAllRidersPaginated(page = 0, size = 20) {
    const params = new URLSearchParams({
      role: 'RIDER',
      page: page.toString(),
      size: size.toString(),
    });
    return apiCall(`/admin/users?${params.toString()}`);
  },

  /**
   * Update user (Admin only)
   */
  async updateUser(userId, data) {
    return apiCall(`/admin/users/${userId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },


  async updateUserStatus(userId, status) {
    return apiCall(`/admin/users/${userId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status: status.toUpperCase() }),
    });
  },

  /**
   * Delete user (Admin only)
   */
  async deleteUser(userId) {
    return apiCall(`/admin/users/${userId}`, {
      method: "DELETE",
    });
  },

  /**
   * Get current user profile
   */
  async getCurrentUser() {
    return apiCall("/users/me");
  },

  /**
   * Update current user profile
   */
  async updateCurrentUser(data) {
    return apiCall("/users/me", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};