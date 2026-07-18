import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

// FIXME: No auth interceptor yet
// TODO: Add request interceptor for auth tokens
// TODO: Add response interceptor for error handling

// Properties
export const propertiesApi = {
  list: (params?: Record<string, unknown>) => api.get('/properties', { params }),
  search: (params?: Record<string, unknown>) => api.get('/properties/search', { params }),
  get: (id: string) => api.get(`/properties/${id}`),
  create: (data: Record<string, unknown>) => api.post('/properties', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/properties/${id}`, data),
  delete: (id: string) => api.delete(`/properties/${id}`),
};

// Rooms
export const roomsApi = {
  list: (params?: Record<string, unknown>) => api.get('/rooms', { params }),
  get: (id: string) => api.get(`/rooms/${id}`),
  availability: (id: string, checkIn: string, checkOut: string) =>
    api.get(`/rooms/${id}/availability`, { params: { checkIn, checkOut } }),
  available: (checkIn: string, checkOut: string, propertyId?: string) =>
    api.get('/rooms/available', { params: { checkIn, checkOut, propertyId } }),
  create: (data: Record<string, unknown>) => api.post('/rooms', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/rooms/${id}`, data),
  delete: (id: string) => api.delete(`/rooms/${id}`),
};

// Bookings
export const bookingsApi = {
  list: (params?: Record<string, unknown>) => api.get('/bookings', { params }),
  get: (id: string) => api.get(`/bookings/${id}`),
  create: (data: Record<string, unknown>) => api.post('/bookings', data),
  cancel: (id: string) => api.post(`/bookings/${id}/cancel`),
};

// Guests
export const guestsApi = {
  list: () => api.get('/guests'),
  get: (id: string) => api.get(`/guests/${id}`),
  create: (data: Record<string, unknown>) => api.post('/guests', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/guests/${id}`, data),
  delete: (id: string) => api.delete(`/guests/${id}`),
};

// Pricing Rules
export const pricingRulesApi = {
  list: (params?: Record<string, unknown>) => api.get('/pricing-rules', { params }),
  create: (data: Record<string, unknown>) => api.post('/pricing-rules', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/pricing-rules/${id}`, data),
  delete: (id: string) => api.delete(`/pricing-rules/${id}`),
};

// Amenities
export const amenitiesApi = {
  list: () => api.get('/amenities'),
  create: (data: Record<string, unknown>) => api.post('/amenities', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/amenities/${id}`, data),
  delete: (id: string) => api.delete(`/amenities/${id}`),
};

export default api;
