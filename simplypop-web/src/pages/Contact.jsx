// src/pages/Contact.jsx
import { useState, useRef } from "react";
import apiClient from "../api/client";
import { validateEmail, validateFileSize, validateImageType } from "../utils/validators";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", eventDate: "",
    description: "", budget: "", inspiration: null,
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [submitError, setSubmitError] = useState("");

  const inspirationRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "inspiration") {
      const file = files[0];
      if (file) {
        if (!validateFileSize(file, 10)) {
          setErrors({ ...errors, inspiration: "File size must be less than 10MB" });
          return;
        }
        if (!validateImageType(file)) {
          setErrors({ ...errors, inspiration: "Only JPG, PNG, WEBP, and GIF images are allowed" });
          return;
        }
        setFormData({ ...formData, inspiration: file });
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
        if (errors.inspiration) setErrors({ ...errors, inspiration: "" });
      }
    } else {
      setFormData({ ...formData, [name]: value });
      if (errors[name]) setErrors({ ...errors, [name]: "" });
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, inspiration: null });
    setPreviewImage(null);
    if (inspirationRef.current) inspirationRef.current.value = "";
    if (errors.inspiration) setErrors({ ...errors, inspiration: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim())        newErrors.name        = "Name is required";
    if (!formData.email.trim())       newErrors.email       = "Email is required";
    if (!formData.phone.trim())       newErrors.phone       = "Phone is required";
    if (!formData.description.trim()) newErrors.description = "Event description is required";
    if (formData.email && !validateEmail(formData.email)) newErrors.email = "Please enter a valid email";
    const phoneRegex = /^[\d\s\-+()]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) newErrors.phone = "Please enter a valid phone number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validateForm()) return;
    setLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("event_Date", formData.eventDate || "");
    data.append("description", formData.description);
    if (formData.budget)     data.append("budget", formData.budget);
    if (formData.inspiration) data.append("inspiration", formData.inspiration);

    try {
      await apiClient.post('/contact', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true);
      setLoading(false);
      setTimeout(() => setSuccess(false), 8000);
      setFormData({ name: "", email: "", phone: "", eventDate: "", description: "", budget: "", inspiration: null });
      setPreviewImage(null);
      setErrors({});
      if (inspirationRef.current) inspirationRef.current.value = "";
    } catch (err) {
      console.error("Form submission error:", err);
      setLoading(false);
      const errorMessage = err.response?.data?.detail || err.response?.data?.message || "Error submitting form. Please try again.";
      setSubmitError(errorMessage);
      setTimeout(() => setSubmitError(""), 5000);
    }
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 bg-cream border transition-colors focus:outline-none font-sans text-sm text-charcoal placeholder:text-warm-gray/50 ${
      errors[field]
        ? 'border-red-400 focus:border-red-400'
        : 'border-warm-line focus:border-gold'
    }`;

  return (
    <div className="min-h-screen bg-cream">

      {/* ── SUCCESS MODAL ── */}
      {success && (
        <div className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-cream border-t-2 border-gold shadow-2xl p-10 max-w-md w-full text-center">
            <div className="w-14 h-14 border border-gold/50 flex items-center justify-center mx-auto mb-6">
              <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display font-light text-3xl text-charcoal mb-3">Thank You</h3>
            <p className="font-sans font-light text-sm text-warm-gray mb-8 leading-relaxed">
              We've received your inquiry and will be in touch within 24 hours to discuss your celebration.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="bg-charcoal text-cream px-8 py-3 font-sans text-xs tracking-widest uppercase hover:bg-charcoal-light transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="bg-cream pt-36 pb-20 px-4 border-b border-warm-line">
        <div className="max-w-6xl mx-auto text-center">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-6">Get in Touch</p>
          <h1 className="font-display font-light text-5xl md:text-6xl text-charcoal mb-5">
            Let's Create Magic
          </h1>
          <span className="block w-12 h-px bg-gold mx-auto mb-6" />
          <p className="font-sans font-light text-lg text-warm-gray max-w-xl mx-auto">
            Share your vision and we'll bring it to life with stunning balloon artistry
          </p>
        </div>
      </section>

      {/* ── PROCESS STEPS ── */}
      <section className="py-20 px-4 bg-white border-b border-warm-line">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative">
            <div className="hidden md:block absolute top-8 left-[16.6%] right-[16.6%] h-px bg-gold/25" />
            {[
              { n: "01", title: "Share Your Vision",    body: "Fill out our form with your event details and upload inspiration photos." },
              { n: "02", title: "Receive Your Quote",   body: "Within 24 hours, we'll send a tailored proposal and discuss your ideas." },
              { n: "03", title: "Relax & Celebrate",    body: "Secure your date and let us create the magic for your celebration." },
            ].map(step => (
              <div key={step.n} className="relative text-center">
                <div className="relative inline-flex items-center justify-center w-16 h-16 mb-6">
                  <span className="font-display text-3xl font-light text-gold leading-none">{step.n}</span>
                  <span className="absolute inset-0 border border-gold/30 rounded-full" />
                </div>
                <h3 className="font-display font-medium text-xl text-charcoal mb-3">{step.title}</h3>
                <p className="font-sans font-light text-sm text-warm-gray leading-relaxed max-w-xs mx-auto">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORM ── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-warm-line p-8 md:p-12">
            <h2 className="font-display font-light text-3xl text-charcoal mb-2">Book Your Event</h2>
            <p className="font-sans font-light text-sm text-warm-gray mb-8">
              Fill out the form and we'll respond within 24 hours.
            </p>

            {submitError && (
              <div className="mb-6 border border-red-200 bg-red-50 text-red-700 px-4 py-3 flex items-center gap-3 animate-fadeIn">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-sans text-sm">{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-[11px] tracking-wider uppercase text-charcoal-light mb-2">
                    Your Name <span className="text-rose">*</span>
                  </label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Jane Doe" className={inputClass('name')} />
                  {errors.name && <p className="font-sans text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block font-sans text-[11px] tracking-wider uppercase text-charcoal-light mb-2">
                    Email Address <span className="text-rose">*</span>
                  </label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane@example.com" className={inputClass('email')} />
                  {errors.email && <p className="font-sans text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-sans text-[11px] tracking-wider uppercase text-charcoal-light mb-2">
                    Phone Number <span className="text-rose">*</span>
                  </label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="(555) 123-4567" className={inputClass('phone')} />
                  {errors.phone && <p className="font-sans text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block font-sans text-[11px] tracking-wider uppercase text-charcoal-light mb-2">
                    Event Date <span className="text-warm-gray font-light normal-case text-xs">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 bg-cream border border-warm-line focus:border-gold focus:outline-none font-sans text-sm text-charcoal transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-sans text-[11px] tracking-wider uppercase text-charcoal-light mb-2">
                  Budget Range <span className="text-warm-gray font-light normal-case text-xs">(Optional)</span>
                </label>
                <input type="text" name="budget" value={formData.budget} onChange={handleChange} placeholder="e.g., $500–$1,000" className="w-full px-4 py-3 bg-cream border border-warm-line focus:border-gold focus:outline-none font-sans text-sm text-charcoal placeholder:text-warm-gray/50 transition-colors" />
              </div>

              <div>
                <label className="block font-sans text-[11px] tracking-wider uppercase text-charcoal-light mb-2">
                  Describe Your Vision <span className="text-rose">*</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about your event — theme, colors, any specific ideas..."
                  rows="5"
                  className={`${inputClass('description')} resize-none`}
                />
                {errors.description && <p className="font-sans text-xs text-red-500 mt-1">{errors.description}</p>}
              </div>

              <div>
                <label className="block font-sans text-[11px] tracking-wider uppercase text-charcoal-light mb-2">
                  Inspiration Image <span className="text-warm-gray font-light normal-case text-xs">(Optional)</span>
                </label>
                {!previewImage ? (
                  <div className="relative">
                    <input
                      type="file"
                      name="inspiration"
                      onChange={handleChange}
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                      className="hidden"
                      ref={inspirationRef}
                      id="inspiration-upload"
                    />
                    <label
                      htmlFor="inspiration-upload"
                      className={`w-full flex flex-col items-center justify-center px-4 py-10 border-2 border-dashed cursor-pointer transition-colors ${
                        errors.inspiration
                          ? 'border-red-300 bg-red-50'
                          : 'border-warm-line hover:border-gold/60 hover:bg-cream-deep'
                      }`}
                    >
                      <svg className="w-10 h-10 text-warm-gray/40 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="font-sans text-sm text-charcoal-light mb-1">Click to upload inspiration photo</p>
                      <p className="font-sans text-xs text-warm-gray">PNG, JPG, WEBP, GIF · up to 10MB</p>
                    </label>
                    {errors.inspiration && <p className="font-sans text-xs text-red-500 mt-1">{errors.inspiration}</p>}
                  </div>
                ) : (
                  <div className="relative">
                    <img src={previewImage} alt="Preview" className="w-full h-56 object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-charcoal text-cream p-1.5 hover:bg-charcoal-light transition-colors shadow-lg"
                      aria-label="Remove image"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 font-sans text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-3 ${
                  loading
                    ? 'bg-warm-line text-warm-gray cursor-not-allowed'
                    : 'bg-rose text-white hover:bg-charcoal'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Submit Inquiry'
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ── INFO CARDS ── */}
      <section className="py-16 px-4 bg-cream-deep border-t border-warm-line">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Fast Response",    body: "We typically respond within 24 hours to all inquiries." },
              { title: "Custom Designs",   body: "Every creation is uniquely tailored to your vision and style." },
              { title: "Local Service",    body: "Proudly serving Tulsa and surrounding communities." },
            ].map(card => (
              <div key={card.title} className="bg-white border border-warm-line p-8">
                <span className="block w-8 h-px bg-gold mb-5" />
                <h3 className="font-display font-medium text-xl text-charcoal mb-2">{card.title}</h3>
                <p className="font-sans font-light text-sm text-warm-gray leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
