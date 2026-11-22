// ✅ GOOD: src/api/galleryService.js
import apiClient from './client';

export const galleryService = {
  getAll: () => apiClient.get('/api/gallery'),
  
  getById: (id) => apiClient.get(`/api/gallery/${id}`),
  
  create: (imageData) => apiClient.post('/api/admin/images', imageData),
  
  delete: (id) => apiClient.delete(`/api/admin/images/${id}`),
  
  upload: (formData) => apiClient.post('/api/admin/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};