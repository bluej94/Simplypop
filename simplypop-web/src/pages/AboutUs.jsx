// src/pages/AboutUs.jsx
import { Link } from 'react-router-dom';

const API_URL = "/api";

const features = [
  {
    title: "Custom Designs",
    body:  "Every creation is uniquely tailored to your vision, theme, and color scheme — never a template.",
  },
  {
    title: "Premium Quality",
    body:  "We use only high-quality balloons and materials that hold beautifully throughout your entire event.",
  },
  {
    title: "Reliable Service",
    body:  "Professional setup, on-time delivery, and responsive communication from first inquiry to final install.",
  },
  {
    title: "Personalized Care",
    body:  "Small-business attention to detail with a personal touch you simply won't find elsewhere.",
  },
];

const services = [
  "Birthday Parties",
  "Weddings",
  "Baby Showers",
  "Gender Reveals",
  "Corporate Events",
  "Special Occasions",
];

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-cream">

      {/* ── HERO ── */}
      <section className="bg-cream pt-36 pb-20 px-4 border-b border-warm-line">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-6">Our Story</p>
          <h1 className="font-display font-light text-5xl md:text-6xl text-charcoal mb-5">
            About Us
          </h1>
          <span className="block w-12 h-px bg-gold mx-auto mb-6" />
          <p className="font-sans font-light text-lg text-warm-gray max-w-xl mx-auto">
            Creating magical moments, one balloon at a time
          </p>
        </div>
      </section>

      {/* ── MEET CRISTAL ── */}
      <section className="py-0">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-b border-warm-line">

            {/* Image */}
            <div className="relative h-96 lg:h-auto min-h-[420px] bg-cream-deep overflow-hidden">
              <img
                src={`${API_URL}/gallery/cristal.jpeg`}
                alt="Cristal — Founder of SimplyPop Creations"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 text-white">
                <p className="font-display font-light text-3xl leading-none mb-1">Cristal</p>
                <p className="font-sans text-[11px] tracking-[0.2em] uppercase text-cream/70">Founder & Balloon Artist</p>
              </div>
            </div>

            {/* Text */}
            <div className="bg-white p-10 md:p-14 flex flex-col justify-center">
              <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-6">Meet the Artist</p>
              <h2 className="font-display font-light text-4xl text-charcoal mb-8 leading-tight">
                Hi, I'm Cristal
              </h2>

              <p className="font-display italic text-xl text-rose leading-relaxed mb-6 border-l-2 border-gold/40 pl-5">
                "What started as a mom wanting to make her kids' parties special turned into something I never expected — a passion that lights me up every single day."
              </p>

              <div className="space-y-4 font-sans font-light text-sm text-charcoal-light leading-relaxed">
                <p>
                  Welcome to SimplyPop Creations. I'm a wife to my amazing husband Juan, a mom to four beautiful kiddos, and a balloon artist who absolutely loves what I do.
                </p>
                <p>
                  My balloon journey began with my children's birthday parties and family celebrations — staying up late the night before, excited to bring my vision to life. That creative spark simply needed to come out.
                </p>
                <p>
                  There's something incredible about transforming a space with balloons. It's not just about the decorations; it's about the moment when someone walks into a room and their face lights up. That's the feeling I want to give every single one of my clients.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT DRIVES ME ── */}
      <section className="py-20 px-4 bg-cream-deep border-b border-warm-line">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-4">Our Philosophy</p>
            <h2 className="font-display font-light text-4xl text-charcoal">What Drives Me</h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-5 font-sans font-light text-sm text-charcoal-light leading-relaxed mb-14 text-center">
            <p>
              Every celebration is special — whether it's a first birthday, a quinceañera, a wedding, or simply a "because we feel like celebrating" kind of day. I pour my heart into every installation because these aren't just events; they're memories being made.
            </p>
            <p className="font-display italic text-xl text-charcoal">
              "I treat every project like I'm decorating for my own family."
            </p>
            <p>
              That means attention to detail, designs that reflect your style rather than what's trending, and someone who genuinely cares that your event is everything you dreamed of.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative h-60 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80"
                alt="Cristal working on balloon installation"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-charcoal/30" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-display font-light text-lg">Behind the Scenes</p>
                <p className="font-sans text-[11px] tracking-wide uppercase text-cream/70">Creating magic</p>
              </div>
            </div>
            <div className="relative h-60 overflow-hidden">
              <img
                src={`${API_URL}/gallery/fam.jpeg`}
                alt="Simply Pop Creations family"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-charcoal/30" />
              <div className="absolute bottom-4 left-4 text-white">
                <p className="font-display font-light text-lg">Family First</p>
                <p className="font-sans text-[11px] tracking-wide uppercase text-cream/70">Where it all began</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 px-4 bg-white border-b border-warm-line">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-4">Why Choose Us</p>
            <h2 className="font-display font-light text-4xl text-charcoal">The SimplyPop Difference</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map(f => (
              <div key={f.title} className="border border-warm-line bg-cream p-8">
                <span className="block w-8 h-px bg-gold mb-5" />
                <h3 className="font-display font-medium text-xl text-charcoal mb-3">{f.title}</h3>
                <p className="font-sans font-light text-sm text-warm-gray leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE CREATE ── */}
      <section className="py-20 px-4 bg-cream-deep border-b border-warm-line">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-4">Our Services</p>
            <h2 className="font-display font-light text-4xl text-charcoal">What We Create</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-warm-line mb-12">
            {services.map(s => (
              <div key={s} className="bg-cream p-6 text-center hover:bg-white transition-colors duration-200">
                <h3 className="font-display font-medium text-lg text-charcoal">{s}</h3>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/gallery"
              className="font-sans text-[11px] tracking-widest uppercase text-charcoal/50 hover:text-charcoal border-b border-warm-line hover:border-gold transition-all duration-200 pb-0.5"
            >
              View Our Portfolio
            </Link>
          </div>
        </div>
      </section>

      {/* ── SOCIAL ── */}
      <section className="py-20 px-4 bg-charcoal">
        <div className="max-w-5xl mx-auto text-center">
          <span className="block w-12 h-px bg-gold/40 mx-auto mb-10" />
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-5">Stay Connected</p>
          <h2 className="font-display font-light text-4xl text-cream mb-5">Join Our Community</h2>
          <p className="font-sans font-light text-sm text-warm-gray max-w-lg mx-auto mb-10 leading-relaxed">
            Follow us for daily inspiration, behind-the-scenes content, exclusive offers, and the latest balloon trends.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-14">
            <a
              href="https://www.facebook.com/profile.php?id=61565272086892"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 border border-cream/30 text-cream px-8 py-3.5 font-sans text-sm tracking-wide hover:bg-cream/10 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Follow on Facebook
            </a>
            <a
              href="https://www.instagram.com/simplypopcreations?igsh=bmY3MnM1Z3B5NGE5"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 border border-cream/30 text-cream px-8 py-3.5 font-sans text-sm tracking-wide hover:bg-cream/10 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow on Instagram
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Latest Work",       body: "Fresh photos from recent events posted regularly." },
              { title: "Exclusive Offers",  body: "Special discounts and promotions for our followers." },
              { title: "Party Inspiration", body: "Tips, trends, and ideas for your next celebration." },
            ].map(c => (
              <div key={c.title} className="border border-white/10 p-6">
                <span className="block w-6 h-px bg-gold/40 mb-4" />
                <h3 className="font-display font-medium text-lg text-cream mb-2">{c.title}</h3>
                <p className="font-sans font-light text-sm text-warm-gray leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE AREA ── */}
      <section className="py-16 px-4 bg-white border-b border-warm-line">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-4">Where We Serve</p>
          <h2 className="font-display font-light text-3xl text-charcoal mb-5">Serving Tulsa, Oklahoma</h2>
          <p className="font-sans font-light text-sm text-warm-gray leading-relaxed">
            We're based in Tulsa and love serving our local community. Not sure if we cover your area?{" "}
            <Link to="/contact" className="text-rose hover:text-charcoal underline underline-offset-4 transition-colors">
              Contact us
            </Link>{" "}
            to check availability.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 px-4 bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-5">Ready to Begin</p>
          <h2 className="font-display font-light text-4xl text-charcoal mb-5">
            Ready to Create Something Amazing?
          </h2>
          <span className="block w-12 h-px bg-gold mx-auto mb-8" />
          <p className="font-sans font-light text-sm text-warm-gray mb-10 max-w-md mx-auto leading-relaxed">
            Let's work together to bring your celebration to life with stunning balloon artistry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-rose text-white border border-rose px-10 py-3.5 font-sans text-sm tracking-wide hover:bg-charcoal hover:border-charcoal transition-all duration-300"
            >
              Get Your Free Quote
            </Link>
            <Link
              to="/gallery"
              className="border border-charcoal/40 text-charcoal px-10 py-3.5 font-sans text-sm tracking-wide hover:border-charcoal hover:bg-charcoal hover:text-cream transition-all duration-300"
            >
              Browse Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
