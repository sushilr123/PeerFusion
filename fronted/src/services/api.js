import axios from "axios";

const API_BASE_URL = "http://localhost:7777";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookie-based auth
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login/signup pages
      const currentPath = window.location.pathname;
      if (
        currentPath !== "/login" &&
        currentPath !== "/signup" &&
        currentPath !== "/"
      ) {
        console.log("[API] Unauthorized access, redirecting to login");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth Service
export const authService = {
  login: async (credentials) => {
    const response = await api.post("/login", credentials);
    return response.data.data; // Now login also returns { message, data: user }
  },

  signup: async (userData) => {
    const response = await api.post("/signup", userData);
    return response.data.data; // Backend returns { message, data: user }
  },

  logout: async () => {
    const response = await api.post("/logout");
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get("/profile/view");
    return response.data.data; // Now profile view returns { message, data: user }
  },
};

// Profile Service
export const profileService = {
  getProfile: async () => {
    const response = await api.get("/profile/view");
    return response.data.data; // Consistent with standardized format
  },

  updateProfile: async (profileData) => {
    const response = await api.patch("/profile/edit", profileData);
    return response.data.data; // Profile edit also returns { message, data: user }
  },
};

// User Service
export const userService = {
  getFeed: async () => {
    const response = await api.get("/feed");
    return response.data;
  },

  getConnections: async () => {
    const response = await api.get("/user/connections");
    return response.data;
  },

  getReceivedRequests: async () => {
    const response = await api.get("/user/requests/received");
    return response.data;
  },
};

// Connection Request Service
export const connectionService = {
  sendRequest: async (status, userId) => {
    const response = await api.post(`/request/send/${status}/${userId}`);
    return response.data;
  },

  reviewRequest: async (status, requestId) => {
    const response = await api.post(`/request/review/${status}/${requestId}`);
    return response.data;
  },
};

// Chat Service
export const chatService = {
  getMessages: async (targetUserId) => {
    const response = await api.get(`/chat/${targetUserId}`);
    return response.data;
  },

  sendMessage: async (targetUserId, text) => {
    const response = await api.post(`/chat/${targetUserId}/message`, { text });
    return response.data;
  },
};

// Payment Service
export const paymentService = {
  createPayment: async (paymentData) => {
    const response = await api.post("/payment/create", paymentData);
    return response.data;
  },

  verifyPremium: async () => {
    const response = await api.get("/premium/verify");
    return response.data;
  },
};

export default api;
