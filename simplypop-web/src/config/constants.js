// ✅ src/config/constants.js
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024,  // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 10
};

export const PAGINATION = {
  ITEMS_PER_PAGE: 12,
  INITIAL_PAGE: 1
};

export const ROUTES = {
  HOME: '/',
  GALLERY: '/gallery',
  CONTACT: '/contact',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard'
};

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You must be logged in to perform this action.',
  FILE_TOO_LARGE: 'File size exceeds 5MB limit.'
};