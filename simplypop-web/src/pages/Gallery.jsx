// src/pages/Gallery.jsx
import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import apiClient from "../api/client";

const filters = [
  { id: "all",            label: "All Events" },
  { id: "Birthdays",      label: "Birthdays" },
  { id: "Baby Showers",   label: "Baby Showers" },
  { id: "Baptism",        label: "Baptism" },
  { id: "Weddings",       label: "Weddings" },
  { id: "Gender Reveals", label: "Gender Reveals" },
  { id: "Corporate",      label: "Corporate" },
];

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const urlFilter = searchParams.get('filter') || "all";

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/gallery');
      setItems(response.data);
    } catch (err) {
      console.error('Failed to fetch gallery:', err);
      setError('Failed to load gallery. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchItems(); }, []);

  const filteredItems = useMemo(() => {
    if (urlFilter === "all") return items;
    return items.filter(item => item.event_type?.toLowerCase() === urlFilter.toLowerCase());
  }, [items, urlFilter]);

  const handleFilterClick = (filter) => {
    if (filter === "all") setSearchParams({});
    else setSearchParams({ filter });
  };

  return (
    <div className="min-h-screen bg-cream">

      {/* ── HERO ── */}
      <section className="bg-cream pt-36 pb-20 px-4 border-b border-warm-line">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-6">Portfolio</p>
          <h1 className="font-display font-light text-5xl md:text-6xl text-charcoal mb-5">
            Our Gallery
          </h1>
          <span className="block w-12 h-px bg-gold mx-auto mb-6" />
          <p className="font-sans font-light text-lg text-warm-gray max-w-xl mx-auto">
            Explore our balloon creations and find inspiration for your next celebration
          </p>
        </div>
      </section>

      {/* ── FILTERS ── */}
      <section className="py-10 px-4 bg-white border-b border-warm-line">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {filters.map((filter) => {
              const active = urlFilter.toLowerCase() === filter.id.toLowerCase();
              return (
                <button
                  key={filter.id}
                  onClick={() => handleFilterClick(filter.id)}
                  className={`px-5 py-2 font-sans text-xs tracking-wider transition-all duration-200 border ${
                    active
                      ? "bg-charcoal text-cream border-charcoal"
                      : "bg-transparent text-warm-gray border-warm-line hover:border-charcoal/40 hover:text-charcoal"
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>

          <div className="text-center mt-6">
            <p className="font-sans text-xs text-warm-gray">
              {loading ? "Loading..." : error ? (
                <span className="text-red-600">{error}</span>
              ) : (
                <>
                  Showing <span className="text-charcoal font-medium">{filteredItems.length}</span>{" "}
                  {filteredItems.length === 1 ? 'creation' : 'creations'}
                  {urlFilter !== "all" && ` — ${urlFilter}`}
                </>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-cream-deep h-72 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-charcoal mb-2">Something went wrong</p>
              <p className="font-sans font-light text-sm text-warm-gray mb-8">{error}</p>
              <button
                onClick={fetchItems}
                className="bg-charcoal text-cream px-8 py-3 font-sans text-xs tracking-widest uppercase hover:bg-charcoal-light transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-charcoal mb-2">No creations found</p>
              <p className="font-sans font-light text-sm text-warm-gray mb-8">
                Try a different filter or check back soon for new work.
              </p>
              <button
                onClick={() => handleFilterClick("all")}
                className="bg-charcoal text-cream px-8 py-3 font-sans text-xs tracking-widest uppercase hover:bg-charcoal-light transition-colors duration-200"
              >
                View All
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredItems.map((item) => (
                <GalleryCard key={item.id} item={item} setSelectedImage={setSelectedImage} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {selectedImage && (
        <LightboxModal selectedImage={selectedImage} onClose={() => setSelectedImage(null)} />
      )}

      {/* ── CTA ── */}
      <section className="py-24 px-4 bg-charcoal">
        <div className="max-w-3xl mx-auto text-center">
          <span className="block w-12 h-px bg-gold/40 mx-auto mb-10" />
          <h2 className="font-display font-light text-4xl md:text-5xl text-cream mb-5">
            Love What You See?
          </h2>
          <p className="font-sans font-light text-sm text-warm-gray mb-10 max-w-sm mx-auto leading-relaxed">
            Let's create something equally beautiful for your special occasion.
          </p>
          <Link
            to="/contact"
            className="inline-block border border-cream/40 text-cream px-10 py-3.5 font-sans text-sm tracking-wide hover:bg-cream hover:text-charcoal transition-all duration-300"
          >
            Book Your Event
          </Link>
        </div>
      </section>
    </div>
  );
}

const GalleryCard = ({ item, setSelectedImage }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  const handleImageClick = () => {
    setSelectedImage({
      url: `${API_BASE_URL}${item.large_url || item.image_url}`,
      title: item.title,
      category: item.event_type,
    });
  };

  return (
    <div
      className="group bg-white border border-warm-line overflow-hidden hover:border-gold/60 hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleImageClick}
    >
      <div className="relative h-64 sm:h-72 overflow-hidden bg-cream-deep">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-cream-deep animate-pulse" />
        )}
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-cream-deep">
            <div className="text-center text-warm-gray">
              <svg className="w-12 h-12 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="font-sans text-xs">Unavailable</p>
            </div>
          </div>
        )}
        {!imageError && (
          <img
            src={`${API_BASE_URL}${item.thumbnail_url || item.image_url}`}
            alt={item.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => { setImageError(true); setImageLoaded(true); }}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        <div className="absolute inset-0 bg-charcoal/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-10 h-10 border border-cream/60 flex items-center justify-center">
            <svg className="w-4 h-4 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-warm-line">
        <h3 className="font-display font-medium text-lg text-charcoal leading-tight line-clamp-2">{item.title}</h3>
        {item.event_type && (
          <p className="font-sans text-[11px] tracking-wider uppercase text-warm-gray mt-1.5">
            {item.event_type}
          </p>
        )}
      </div>
    </div>
  );
};

const LightboxModal = ({ selectedImage, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-charcoal/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full">
        <button
          className="absolute -top-12 right-0 flex items-center gap-2 font-sans text-xs tracking-widest uppercase text-warm-gray hover:text-cream transition-colors"
          onClick={onClose}
          aria-label="Close lightbox"
        >
          Close
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div
          className="bg-white overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={selectedImage.url}
            alt={selectedImage.title}
            className="w-full max-h-[80vh] object-contain"
          />
          <div className="p-6 border-t border-warm-line bg-cream">
            <h3 className="font-display font-medium text-2xl text-charcoal mb-2">{selectedImage.title}</h3>
            {selectedImage.category && (
              <span className="inline-block font-sans text-[11px] tracking-widest uppercase text-warm-gray border border-warm-line px-3 py-1">
                {selectedImage.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
