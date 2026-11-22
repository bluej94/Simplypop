// src/pages/AdminPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import apiClient from "../api/client";

// ========================
// EDIT MODAL COMPONENT
// ========================

const EditModal = ({ item, onClose, onSave }) => {
  const [title, setTitle] = useState(item.title);
  const [eventType, setEventType] = useState(item.event_type);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(item.id, title, eventType);
  };

  const eventOptions = [
    "Birthdays", 
    "Weddings", 
    "Baby Showers", 
    "Gender Reveals", 
    "Corporate"
  ];

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Edit Gallery Item</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Image Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Type
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
              required
            >
              <option value="">Select Event Type</option>
              {eventOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-6 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-3 px-6 rounded-lg text-white font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ========================
// IMAGE MODAL COMPONENT
// ========================

const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
      onClick={onClose}
    >
      <div className="relative max-w-6xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-pink-400 transition-colors text-lg font-semibold flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
        >
          <span>Close</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img 
          src={imageUrl} 
          alt="Full size" 
          className="w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" 
        />
      </div>
    </div>
  );
};

// ========================
// STATS CARD COMPONENT
// ========================

const StatsCard = ({ icon, label, value, color }) => (
  <div className={`bg-gradient-to-br ${color} p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform duration-200`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90 mb-1">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="text-5xl opacity-80">{icon}</div>
    </div>
  </div>
);

// ========================
// MAIN ADMIN PAGE COMPONENT
// ========================

export default function AdminPage() {
  // ✅ Use Zustand for authentication
  const { isAdmin, user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('gallery');
  
  const [galleryItems, setGalleryItems] = useState([]);
  const [contactForms, setContactForms] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  
  const [newImageTitle, setNewImageTitle] = useState('');
  const [newImageEventType, setNewImageEventType] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [modalImage, setModalImage] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const statuses = ["New", "Pending", "Archived", "Follow-up"];

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  // ✅ Redirect if not authenticated
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  const showMessage = (msg, type = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const fetchData = async () => {
    try {
      // ✅ Fetch gallery (public endpoint)
      const galleryRes = await apiClient.get('/gallery');
      setGalleryItems(galleryRes.data);

      // ✅ Fetch contact forms (protected endpoint)
      const formsRes = await apiClient.get('/contactforms');
      setContactForms(formsRes.data);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      if (err.response?.status === 401) {
        logout();
        navigate('/admin/login');
      } else {
        showMessage("Failed to load data", "error");
      }
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleEdit = async (itemId, newTitle, newEventType) => {
    try {
      await apiClient.put(`/gallery-edit/${itemId}`, {
        title: newTitle,
        event_type: newEventType
      });

      showMessage('Gallery item updated successfully!');
      setItemToEdit(null);
      fetchData();
    } catch (err) {
      console.error("Update failed:", err);
      if (err.response?.status === 401) {
        logout();
        navigate('/admin/login');
      } else {
        showMessage('Failed to update gallery item', 'error');
      }
    }
  };
  
  const handleNewImageSubmit = async (e) => {
    e.preventDefault();
    if (!newImageFile) {
      showMessage('Please select a file to upload', 'error');
      return;
    }

    setUploading(true);
    const data = new FormData();
    data.append("title", newImageTitle);
    data.append("event_type", newImageEventType);
    data.append("image", newImageFile);

    try {
      await apiClient.post('/gallery', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      showMessage('Image uploaded successfully!');
      setNewImageTitle('');
      setNewImageEventType('');
      setNewImageFile(null);
      document.getElementById('file-input').value = '';
      fetchData();
    } catch (err) {
      console.error("Upload failed:", err);
      if (err.response?.status === 401) {
        logout();
        navigate('/admin/login');
      } else {
        showMessage('Failed to upload image', 'error');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      try {
        await apiClient.delete(`/gallery-delete/${itemId}`);
        showMessage('Image deleted successfully!');
        fetchData();
      } catch (err) {
        console.error("Delete failed:", err);
        if (err.response?.status === 401) {
          logout();
          navigate('/admin/login');
        } else {
          showMessage('Failed to delete image', 'error');
        }
      }
    }
  };
  
  const handleStatusChange = async (formId, newStatus) => {
    try {
      await apiClient.patch(`/contactforms/${formId}`, {
        status: newStatus
      });

      showMessage(`Status updated to ${newStatus}`);
      fetchData();
    } catch (err) {
      console.error("Status update failed:", err);
      if (err.response?.status === 401) {
        logout();
        navigate('/admin/login');
      } else {
        showMessage('Failed to update status', 'error');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    showMessage('Logged out successfully');
  };

  // Filter contact forms
  const filteredForms = contactForms.filter(form => {
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(form.status || "New");
    const matchesSearch = !searchTerm || 
      form.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      form.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    totalGallery: galleryItems.length,
    totalContacts: contactForms.length,
    newContacts: contactForms.filter(f => (f.status || "New") === "New").length,
    pendingContacts: contactForms.filter(f => f.status === "Pending").length,
  };

  // ✅ Don't render anything if not authenticated (will redirect)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <ImageModal imageUrl={modalImage} onClose={() => setModalImage(null)} />
      
      {itemToEdit && (
        <EditModal 
          item={itemToEdit} 
          onClose={() => setItemToEdit(null)} 
          onSave={handleEdit} 
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-8 px-4 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-pink-100">
              Welcome back{user?.name ? `, ${user.name}` : ''}! Manage your gallery and inquiries
            </p>
          </div>
          <button 
            onClick={handleLogout}
            className="py-3 px-6 rounded-lg bg-white/20 backdrop-blur-sm text-white font-semibold hover:bg-white/30 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 animate-fadeIn ${
            messageType === 'success' 
              ? 'bg-green-50 border-2 border-green-300 text-green-800' 
              : 'bg-red-50 border-2 border-red-300 text-red-800'
          }`}>
            {messageType === 'success' ? (
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-medium">{message}</span>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard icon="🖼️" label="Gallery Images" value={stats.totalGallery} color="from-blue-500 to-blue-600" />
          <StatsCard icon="📧" label="Total Inquiries" value={stats.totalContacts} color="from-purple-500 to-purple-600" />
          <StatsCard icon="🆕" label="New Inquiries" value={stats.newContacts} color="from-pink-500 to-pink-600" />
          <StatsCard icon="⏳" label="Pending" value={stats.pendingContacts} color="from-orange-500 to-orange-600" />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-lg p-2 mb-8 flex space-x-2">
          <button
            onClick={() => setActiveTab('gallery')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
              activeTab === 'gallery'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            🖼️ Gallery Management
          </button>
          <button
            onClick={() => setActiveTab('contacts')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all relative ${
              activeTab === 'contacts'
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            📬 Contact Inquiries
            {stats.newContacts > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                {stats.newContacts}
              </span>
            )}
          </button>
        </div>

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <>
            {/* Upload New Image Section */}
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                <span className="text-3xl mr-3">➕</span>
                Add New Gallery Image
              </h2>
              <form onSubmit={handleNewImageSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Image Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Sweet 16 Birthday Party"
                      value={newImageTitle}
                      onChange={(e) => setNewImageTitle(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Event Type
                    </label>
                    <select
                      value={newImageEventType}
                      onChange={(e) => setNewImageEventType(e.target.value)}
                      className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      required
                    >
                      <option value="">Select Event Type</option>
                      <option value="Birthdays">Birthdays</option>
                      <option value="Weddings">Weddings</option>
                      <option value="Baby Showers">Baby Showers</option>
                      <option value="Gender Reveals">Gender Reveals</option>
                      <option value="Baptism">Baptism</option>
                      <option value="Corporate">Corporate</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewImageFile(e.target.files[0])}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 file:cursor-pointer"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg transition-all ${
                    uploading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {uploading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Uploading...
                    </span>
                  ) : (
                    '📤 Upload Image'
                  )}
                </button>
              </form>
            </div>

            {/* Gallery Grid */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                Gallery Images ({galleryItems.length})
              </h2>
              {galleryItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {galleryItems.map(item => (
                    <div key={item.id} className="bg-white border-2 border-gray-100 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                      <div className="relative h-64 overflow-hidden bg-gray-100">
                        <img
                          src={`${API_BASE_URL}${item.thumbnail_url || item.image_url}`}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-full mb-2">
                          {item.event_type || "N/A"}
                        </span>
                        <h3 className="font-bold text-lg text-gray-900 mb-4 line-clamp-2">{item.title}</h3>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setItemToEdit(item)}
                            className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-semibold flex items-center justify-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />

                            </svg>
                            <span>Edit</span>
                          </button>
                          
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors font-semibold flex items-center justify-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p className="text-gray-500 text-lg">No gallery images yet. Upload your first image above!</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* CONTACTS TAB */}
        {activeTab === 'contacts' && (
          <>
            {/* Filters and Search */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 gap-4">
                {/* Search Bar */}
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by name, email, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>

                {/* Status Filters */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-semibold text-gray-700 self-center mr-2">Filter:</span>
                  {statuses.map(status => (
                    <button
                      key={status}
                      onClick={() => {
                        setSelectedStatuses(prev => 
                          prev.includes(status) 
                            ? prev.filter(s => s !== status) 
                            : [...prev, status]
                        );
                      }}
                      className={`py-2 px-4 rounded-full text-sm font-semibold transition-all ${
                        selectedStatuses.includes(status) 
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md scale-105' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 text-sm text-gray-600">
                Showing <span className="font-bold text-pink-600">{filteredForms.length}</span> of <span className="font-bold">{contactForms.length}</span> inquiries
              </div>
            </div>

            {/* Contact Forms List */}
            <div className="space-y-6">
              {filteredForms.length > 0 ? (
                filteredForms.map((form) => (
                  <div key={form.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                      {/* Image Section */}
                      <div className="lg:col-span-1">
                        {form.inspiration_file ? (
                          <div
                            onClick={() => setModalImage(`${API_BASE_URL}${form.inspiration_file}`)}
                            className="cursor-pointer group relative overflow-hidden rounded-xl"
                          >
                            <img
                              src={`${API_BASE_URL}${form.inspiration_file}`}
                              alt="Inspiration"
                              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center rounded-xl">
                            <svg className="w-16 h-16 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-gray-500 text-sm">No image uploaded</span>
                          </div>
                        )}
                      </div>

                      {/* Details Section */}
                      <div className="lg:col-span-2 space-y-4">
                        {/* Header with Status */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-1">
                              {form.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Submitted on {new Date(form.created_at).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          
                          {/* Status Dropdown */}
                          <select
                            value={form.status || "New"} 
                            onChange={(e) => handleStatusChange(form.id, e.target.value)}
                            className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-colors cursor-pointer ${
                              (form.status || "New") === "New" ? 'bg-pink-50 border-pink-300 text-pink-700' :
                              form.status === "Pending" ? 'bg-orange-50 border-orange-300 text-orange-700' :
                              form.status === "Archived" ? 'bg-gray-50 border-gray-300 text-gray-700' :
                              'bg-blue-50 border-blue-300 text-blue-700'
                            }`}
                          >
                            {statuses.map(status => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <a href={`mailto:${form.email}`} className="text-sm font-medium text-pink-600 hover:text-purple-600">
                                {form.email}
                              </a>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <div>
                              <p className="text-xs text-gray-500">Phone</p>
                              <a href={`tel:${form.phone}`} className="text-sm font-medium text-pink-600 hover:text-purple-600">
                                {form.phone}
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Event Date */}
                        {form.event_date && (
                          <div className="flex items-center space-x-2 bg-purple-50 px-4 py-2 rounded-lg inline-block">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm font-semibold text-purple-700">
                              Event Date: {form.event_date}
                            </span>
                          </div>
                        )}

                        {/* Event Description */}
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Event Description
                          </h4>
                          <p className="text-gray-700 bg-white p-4 rounded-lg border-2 border-gray-100">
                            {form.description}
                          </p>
                        </div>

                        {/* Budget */}
                        {form.budget && (
                          <div className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-lg inline-block">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm font-semibold text-green-700">
                              Budget: ${form.budget}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="text-6xl mb-4">📭</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No inquiries found
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || selectedStatuses.length > 0
                      ? "Try adjusting your filters or search term"
                      : "New client inquiries will appear here"}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}