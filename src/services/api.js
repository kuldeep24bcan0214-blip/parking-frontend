import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor – attach JWT
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor – handle 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// ─── Auth ───────────────────────────────────────────────────
export const authAPI = {
    login: (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    getProfile: () => api.get('/auth/profile'),
};

// ─── Parking Slots ──────────────────────────────────────────
export const slotsAPI = {
    getAll: (params) => api.get('/slots', { params }),
    getAvailable: () => api.get('/slots?status=available'),
    getById: (id) => api.get(`/slots/${id}`),
    create: (data) => api.post('/slots', data),
    update: (id, data) => api.put(`/slots/${id}`, data),
    delete: (id) => api.delete(`/slots/${id}`),
    updateStatus: (id, status) => api.patch(`/slots/${id}/status`, { status }),
};

// ─── Bookings ───────────────────────────────────────────────
export const bookingsAPI = {
    getAll: (params) => api.get('/bookings', { params }),
    getMyBookings: () => api.get('/bookings/my'),
    getActiveBooking: () => api.get('/bookings/my/active'),
    getById: (id) => api.get(`/bookings/${id}`),
    create: (data) => api.post('/bookings', data),
    cancel: (id) => api.patch(`/bookings/${id}/cancel`),
    checkIn: (id) => api.patch(`/bookings/${id}/checkin`),
    checkOut: (id) => api.patch(`/bookings/${id}/checkout`),
};

// ─── Users ──────────────────────────────────────────────────
export const usersAPI = {
    getAll: (params) => api.get('/users', { params }),
    getById: (id) => api.get(`/users/${id}`),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
    changeRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
};

// ─── Revenue / Analytics ────────────────────────────────────
export const revenueAPI = {
    getSummary: () => api.get('/revenue/summary'),
    getDaily: (params) => api.get('/revenue/daily', { params }),
    getMonthly: (params) => api.get('/revenue/monthly', { params }),
};

// ─── Pricing ────────────────────────────────────────────────
export const pricingAPI = {
    get: () => api.get('/pricing'),
    update: (data) => api.put('/pricing', data),
};

// ─── Logs ───────────────────────────────────────────────────
export const logsAPI = {
    getAll: (params) => api.get('/logs', { params }),
};

export default api;
