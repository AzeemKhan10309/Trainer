// src/services/api.js
// Axios-based API service for Node.js backend

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:5000/api"
    : "http:/192.168.18.246:5000/api"; // Replace with your backend URL

// ─── Axios instance ─────────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401s globally
api.interceptors.response.use(
  res => res,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('authToken');
      // Navigate to login — handle via event emitter or context
    }
    return Promise.reject(error);
  }
);

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════
export const authAPI = {
  login: (email, password, role) =>
    api.post('/auth/login', { email, password, role }),

  signup: (data) =>
    api.post('/auth/signup', data),

  logout: () =>
    api.post('/auth/logout'),

  resetPassword: (email) =>
    api.post('/auth/reset-password', { email }),

  refreshToken: (refreshToken) =>
    api.post('/auth/refresh', { refreshToken }),
};

// ═══════════════════════════════════════════════════════════
// USERS / PROFILES
// ═══════════════════════════════════════════════════════════
export const usersAPI = {
  getProfile: (userId) =>
    api.get(`/users/${userId}`),

  updateProfile: (userId, data) =>
    api.patch(`/users/${userId}`, data),

  uploadAvatar: (userId, formData) =>
    api.post(`/users/${userId}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ═══════════════════════════════════════════════════════════
// TRAINER — CLIENT MANAGEMENT
// ═══════════════════════════════════════════════════════════
export const trainerAPI = {
  getClients: (trainerId) =>
    api.get(`/trainers/${trainerId}/clients`),

  addClient: (trainerId, clientEmail) =>
    api.post(`/trainers/${trainerId}/clients`, { email: clientEmail }),

  removeClient: (trainerId, clientId) =>
    api.delete(`/trainers/${trainerId}/clients/${clientId}`),

  getClientProgress: (trainerId, clientId) =>
    api.get(`/trainers/${trainerId}/clients/${clientId}/progress`),

  getAnalytics: (trainerId, period = 'month') =>
    api.get(`/trainers/${trainerId}/analytics?period=${period}`),
};

// ═══════════════════════════════════════════════════════════
// DIET PLANS
// ═══════════════════════════════════════════════════════════
export const dietAPI = {
  createPlan: (trainerId, planData) =>
    api.post(`/trainers/${trainerId}/diet-plans`, planData),

  getPlans: (trainerId) =>
    api.get(`/trainers/${trainerId}/diet-plans`),

  updatePlan: (planId, data) =>
    api.patch(`/diet-plans/${planId}`, data),

  deletePlan: (planId) =>
    api.delete(`/diet-plans/${planId}`),

  assignPlan: (planId, clientId) =>
    api.post(`/diet-plans/${planId}/assign`, { clientId }),

  getClientPlan: (clientId) =>
    api.get(`/clients/${clientId}/diet-plan`),

  // Meal completion — core feature
  completeMeal: (clientId, mealData) =>
    api.post(`/clients/${clientId}/meal-completions`, {
      ...mealData,
      completedAt: new Date().toISOString(),
    }),

  getMealCompletions: (clientId, date) =>
    api.get(`/clients/${clientId}/meal-completions?date=${date}`),

  uploadMealPhoto: (completionId, formData) =>
    api.post(`/meal-completions/${completionId}/photo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ═══════════════════════════════════════════════════════════
// WORKOUT PLANS
// ═══════════════════════════════════════════════════════════
export const workoutAPI = {
  createPlan: (trainerId, planData) =>
    api.post(`/trainers/${trainerId}/workout-plans`, planData),

  getClientWorkout: (clientId) =>
    api.get(`/clients/${clientId}/workout-plan`),

  completeExercise: (clientId, exerciseData) =>
    api.post(`/clients/${clientId}/exercise-completions`, {
      ...exerciseData,
      completedAt: new Date().toISOString(),
    }),
};

// ═══════════════════════════════════════════════════════════
// MESSAGES
// ═══════════════════════════════════════════════════════════
export const chatAPI = {
  getConversations: (userId) =>
    api.get(`/users/${userId}/conversations`),

  getMessages: (conversationId, page = 1) =>
    api.get(`/conversations/${conversationId}/messages?page=${page}`),

  sendMessage: (conversationId, content) =>
    api.post(`/conversations/${conversationId}/messages`, { content }),

  sendImage: (conversationId, formData) =>
    api.post(`/conversations/${conversationId}/messages/image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  markRead: (conversationId) =>
    api.patch(`/conversations/${conversationId}/read`),
};

// ═══════════════════════════════════════════════════════════
// PROGRESS & MEASUREMENTS
// ═══════════════════════════════════════════════════════════
export const progressAPI = {
  logWeight: (clientId, weight, date) =>
    api.post(`/clients/${clientId}/weight-log`, { weight, date }),

  getWeightHistory: (clientId, period = 'month') =>
    api.get(`/clients/${clientId}/weight-log?period=${period}`),

  updateMeasurements: (clientId, measurements) =>
    api.post(`/clients/${clientId}/measurements`, measurements),

  uploadProgressPhoto: (clientId, formData) =>
    api.post(`/clients/${clientId}/progress-photos`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// ═══════════════════════════════════════════════════════════
// NOTIFICATIONS
// ═══════════════════════════════════════════════════════════
export const notificationsAPI = {
  getAll: (userId) =>
    api.get(`/users/${userId}/notifications`),

  markRead: (notifId) =>
    api.patch(`/notifications/${notifId}/read`),

  markAllRead: (userId) =>
    api.patch(`/users/${userId}/notifications/read-all`),

  savePushToken: (userId, token) =>
    api.post(`/users/${userId}/push-token`, { token }),
};

// ═══════════════════════════════════════════════════════════
// SUBSCRIPTIONS / PAYMENTS
// ═══════════════════════════════════════════════════════════
export const paymentsAPI = {
  getPlans: () =>
    api.get('/subscription-plans'),

  subscribe: (clientId, planId, paymentMethodId) =>
    api.post(`/clients/${clientId}/subscribe`, { planId, paymentMethodId }),

  cancelSubscription: (clientId) =>
    api.post(`/clients/${clientId}/cancel-subscription`),

  getInvoices: (userId) =>
    api.get(`/users/${userId}/invoices`),
};

export default api;
