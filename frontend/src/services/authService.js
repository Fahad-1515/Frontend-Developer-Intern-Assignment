// frontend/src/services/authService.js
const API_URL = "http://localhost:5000/api";

// Export apiRequest function separately
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
};

export const authService = {
  async login(email, password) {
    return apiRequest("/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },

  async register(userData) {
    return apiRequest("/auth/register", {
      method: "POST",
      body: userData,
    });
  },

  async getProfile() {
    const response = await apiRequest("/auth/me");
    return response.user;
  },
};

export default authService;
