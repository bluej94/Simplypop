// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import apiClient from "../api/client";

const NOISE = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")";

const services = [
  { num: "01", title: "Birthdays",      filter: "Birthdays",      desc: "Make their special day unforgettable with bespoke balloon artistry" },
  { num: "02", title: "Baby Showers",   filter: "Baby Showers",   desc: "Celebrate the newest arrival with delicate, refined décor" },
  { num: "03", title: "Weddings",       filter: "Weddings",       desc: "Romantic balloon elegance that complements your perfect day" },
  { num: "04", title: "Gender Reveals", filter: "Gender Reveals", desc: "Announce your joy with a beautifully crafted reveal experience" },
];

const steps = [
  { n: "01", title: "Share Your Vision",    body: "Fill out our form with your event details. Upload inspiration photos — every detail matters." },
  { n: "02", title: "Receive Your Proposal", body: "Within 24 hours, receive a tailored proposal. We'll refine every element together." },
  { n: "03", title: "Relax & Celebrate",    body: "Secure your date and let us handle the artistry while you focus on the celebration." },
];

export default function Home() {
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/gallery');
        setRecentItems(response.data.slice(0, 9));
      } catch (err) {
        console.error('Failed to fetch gallery:', err);
        setError('Failed to load gallery images');
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const slidesToShow = width <= 640 ? 1 : width <= 1024 ? 2 : 3;
  const carouselSettings = {
    dots: true,
    arrows: width > 768,
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
  };

  return (
    <div className="bg-cream">

      {/* ── HERO ── */}
      <section className="relative bg-cream pt-36 pb-28 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: NOISE }} />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-8">
            Balloon Artistry · Tulsa, Oklahoma
          </p>
          <h1 className="font-display font-light text-6xl md:text-7xl lg:text-8xl text-charcoal leading-[1.05] mb-8">
            Transform Every<br />
            <span className="italic">Celebration</span> into Art
          </h1>
          <span className="block w-16 h-px bg-gold mx-auto mb-8" />
          <p className="font-sans font-light text-lg text-warm-gray max-w-xl mx-auto mb-12 leading-relaxed">
            Luxury balloon designs crafted for life's most meaningful moments —
            from intimate gatherings to grand celebrations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/contact"
              className="bg-rose text-white border border-rose px-10 py-3.5 font-sans text-sm tracking-wide hover:bg-charcoal hover:border-charcoal transition-all duration-300"
            >
              Begin Planning
            </Link>
            <Link
              to="/gallery"
              className="border border-charcoal/40 text-charcoal px-10 py-3.5 font-sans text-sm tracking-wide hover:border-charcoal hover:bg-charcoal hover:text-cream transition-all duration-300"
            >
              View Portfolio
            </Link>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 text-[11px] tracking-widest uppercase text-warm-gray font-sans">
            <span>100+ Events Created</span>
            <span className="text-gold">—</span>
            <span>5-Star Rated</span>
            <span className="text-gold">—</span>
            <span>Serving Tulsa</span>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-4">What We Create</p>
            <h2 className="font-display font-light text-4xl md:text-5xl text-charcoal">
              Celebrations We Elevate
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-warm-line">
            {services.map((service) => (
              <Link
                key={service.num}
                to={`/gallery?filter=${encodeURIComponent(service.filter)}`}
                className="group bg-white p-9 hover:bg-cream transition-colors duration-300 flex flex-col"
              >
                <span className="font-display text-5xl font-light text-gold/35 mb-6 select-none">{service.num}</span>
                <h3 className="font-display font-medium text-2xl text-charcoal mb-3">{service.title}</h3>
                <p className="font-sans font-light text-sm text-warm-gray leading-relaxed flex-grow">{service.desc}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-sans text-[11px] tracking-widest uppercase text-charcoal/40 group-hover:text-rose transition-colors duration-200">
                  Explore
                  <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/gallery"
              className="font-sans text-[11px] tracking-widest uppercase text-charcoal/50 hover:text-charcoal border-b border-warm-line hover:border-gold transition-all duration-200 pb-0.5"
            >
              See All Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* ── PROCESS ── */}
      <section className="py-24 px-4 bg-cream-deep">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-4">How It Works</p>
            <h2 className="font-display font-light text-4xl md:text-5xl text-charcoal">From Vision to Reality</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-px bg-gold/25" />
            {steps.map((step) => (
              <div key={step.n} className="relative text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 mb-8">
                  <span className="font-display text-3xl font-light text-gold leading-none">{step.n}</span>
                  <span className="absolute inset-0 border border-gold/30 rounded-full" />
                </div>
                <h3 className="font-display font-medium text-2xl text-charcoal mb-4">{step.title}</h3>
                <p className="font-sans font-light text-sm text-warm-gray leading-relaxed max-w-xs mx-auto">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link
              to="/contact"
              className="inline-block bg-charcoal text-cream px-10 py-3.5 font-sans text-sm tracking-wide hover:bg-charcoal-light transition-colors duration-300"
            >
              Begin Your Journey
            </Link>
          </div>
        </div>
      </section>

      {/* ── RECENT WORK ── */}
      {(recentItems.length > 0 || loading) && (
        <section className="py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-4">Our Portfolio</p>
              <h2 className="font-display font-light text-4xl md:text-5xl text-charcoal mb-5">Recent Creations</h2>
              <span className="block w-12 h-px bg-gold mx-auto" />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-cream-deep h-80 animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="font-sans text-warm-gray">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 font-sans text-sm text-charcoal hover:text-rose underline underline-offset-4 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <Slider {...carouselSettings}>
                {recentItems.map(item => (
                  <div key={item.id} className="px-3">
                    <div className="bg-white border border-warm-line overflow-hidden group">
                      <div className="relative h-80 overflow-hidden bg-cream-deep">
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL || '/api'}${item.medium_url || item.image_url}`}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                        />
                        <div className="absolute inset-0 bg-charcoal/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="p-5 border-t border-warm-line">
                        <h3 className="font-display font-medium text-lg text-charcoal">{item.title}</h3>
                        {item.event_type && (
                          <p className="font-sans text-[11px] tracking-wider uppercase text-warm-gray mt-1">{item.event_type}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            )}

            <div className="text-center mt-12">
              <Link
                to="/gallery"
                className="font-sans text-[11px] tracking-widest uppercase text-charcoal/50 hover:text-charcoal border-b border-warm-line hover:border-gold transition-all duration-200 pb-0.5"
              >
                View Full Gallery
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── FINAL CTA ── */}
      <section className="py-28 px-4 bg-charcoal relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: NOISE }} />
        <div className="relative max-w-3xl mx-auto text-center">
          <span className="block w-12 h-px bg-gold/40 mx-auto mb-12" />
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-6">Ready to Begin</p>
          <h2 className="font-display font-light text-4xl md:text-5xl text-cream mb-6 leading-tight">
            Create Something<br /><span className="italic">Unforgettable</span>
          </h2>
          <p className="font-sans font-light text-sm text-warm-gray mb-12 max-w-md mx-auto leading-relaxed">
            Let us bring your vision to life with bespoke balloon artistry designed for your most precious celebrations.
          </p>
          <span className="block w-12 h-px bg-gold/40 mx-auto mb-12" />
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
