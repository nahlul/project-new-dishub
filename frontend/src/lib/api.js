import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper to format API error details
export const formatApiErrorDetail = (detail) => {
  if (detail == null) return 'Terjadi kesalahan. Silakan coba lagi.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((e) => (e && typeof e.msg === 'string' ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(' ');
  }
  if (detail && typeof detail.msg === 'string') return detail.msg;
  return String(detail);
};

// Auth API
export const authAPI = {
  login: (username, password) =>
    api.post('/auth/login', { username, password }),
  
  logout: () => api.post('/auth/logout'),
  
  getMe: () => api.get('/auth/me'),
  
  changePassword: (currentPassword, newPassword, newUsername) =>
    api.put('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
      new_username: newUsername,
    }),
};

// News API
export const newsAPI = {
  getAll: () => api.get('/news/'),
  
  getById: (id) => api.get(`/news/${id}`),
  
  create: (data) => api.post('/news/', data),
  
  update: (id, data) => api.put(`/news/${id}`, data),
  
  delete: (id) => api.delete(`/news/${id}`),
  
  uploadImage: (id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/news/${id}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Gallery API
export const galleryAPI = {
  getAll: () => api.get('/gallery/'),
  
  upload: (file, title, category) => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (category) formData.append('category', category);
    return api.post('/gallery/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  delete: (id) => api.delete(`/gallery/${id}`),
};

// Settings API
export const settingsAPI = {
  getContact: () => api.get('/settings/contact'),
  updateContact: (data) => api.put('/settings/contact', data),
  
  getSocialMedia: () => api.get('/settings/social-media'),
  updateSocialMedia: (data) => api.put('/settings/social-media', data),
  
  getAbout: () => api.get('/settings/about'),
  updateAbout: (content) => api.put('/settings/about', { content }),
};

export default api;
