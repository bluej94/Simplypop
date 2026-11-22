// ✅ GOOD: src/hooks/useGallery.js
import { useState, useEffect } from 'react';
import { galleryService } from '../api/galleryService';

export function useGallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await galleryService.getAll();
      setImages(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchImages();
  }, []);
  
  const deleteImage = async (id) => {
    await galleryService.delete(id);
    setImages(prev => prev.filter(img => img.id !== id));
  };
  
  return { images, loading, error, refetch: fetchImages, deleteImage };
}