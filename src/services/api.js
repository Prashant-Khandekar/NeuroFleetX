import axios from "axios";

// Base API instance
const api = axios.create({
  baseURL: 'http://localhost:8080/api' // from .env
});

// Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global error handler (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Bus related endpoints
export const getAllBuses = () => api.get('/buses');
export const addBus = (busData) => api.post('/buses', busData);

// Booking related endpoints
export const createBooking = (bookingData) => api.post('/bookings/book', bookingData);
export const getMyBookings = (userId) => api.get(`/bookings/user/${userId}`);

export default api;
