// src/pages/TermsOfService.jsx
import { Link } from 'react-router-dom';

const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const Section = ({ title, children }) => (
  <div className="mb-12 pb-12 border-b border-warm-line last:border-0 last:mb-0 last:pb-0">
    <span className="block w-8 h-px bg-gold mb-5" />
    <h2 className="font-display font-light text-2xl text-charcoal mb-5">{title}</h2>
    {children}
  </div>
);

const Sub = ({ title }) => (
  <h3 className="font-display font-medium text-lg text-charcoal mt-7 mb-3">{title}</h3>
);

const P = ({ children }) => (
  <p className="font-sans font-light text-sm text-charcoal-light leading-relaxed mb-4">{children}</p>
);

const Ul = ({ items }) => (
  <ul className="space-y-2 mb-4 pl-4">
    {items.map((item, i) => (
      <li key={i} className="flex gap-3 font-sans font-light text-sm text-charcoal-light leading-relaxed">
        <span className="text-gold mt-1.5 flex-shrink-0">—</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-cream">

      {/* ── HERO ── */}
      <section className="bg-cream pt-36 pb-20 px-4 border-b border-warm-line">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-6">Legal</p>
          <h1 className="font-display font-light text-5xl md:text-6xl text-charcoal mb-5">
            Terms of Service
          </h1>
          <span className="block w-12 h-px bg-gold mx-auto mb-6" />
          <p className="font-sans font-light text-sm text-warm-gray">Please read these terms carefully before using our services</p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-warm-line p-8 md:p-12">

            <p className="font-sans text-xs text-warm-gray mb-10 pb-8 border-b border-warm-line">
              <span className="text-charcoal-light">Last Updated:</span> {lastUpdated}
            </p>

            <Section title="Agreement to Terms">
              <P>Welcome to SimplyPop Creations. These Terms of Service ("Terms") govern your use of our website and services. By accessing or using our website, booking our services, or engaging with us in any way, you agree to be bound by these Terms.</P>
              <P>If you do not agree to these Terms, please do not use our website or services. We reserve the right to modify these Terms at any time, and changes will be effective immediately upon posting.</P>
            </Section>

            <Section title="Our Services">
              <P>SimplyPop Creations provides custom balloon decoration and installation services for various events including:</P>
              <Ul items={[
                "Birthday parties",
                "Baby showers",
                "Weddings",
                "Gender reveal parties",
                "Corporate events",
                "Other special occasions",
              ]} />
              <P>We serve the Tulsa, Oklahoma and surrounding areas. All services are subject to availability and our acceptance of your booking request.</P>
            </Section>

            <Section title="Booking Process">
              <Sub title="1. Inquiry and Consultation" />
              <P>You may submit an inquiry through our website contact form. We will respond within 24–48 hours with a preliminary consultation to discuss your event details, design preferences, and budget.</P>

              <Sub title="2. Quote and Agreement" />
              <P>After consultation, we will provide you with a detailed quote outlining the services, pricing, and any specific requirements. A booking is only confirmed once you accept the quote and provide the required deposit.</P>

              <Sub title="3. Deposit" />
              <P>A non-refundable deposit (typically 50% of the total cost) is required to secure your booking. The deposit confirms your event date and reserves our services exclusively for you.</P>

              <Sub title="4. Final Payment" />
              <P>The remaining balance is due no later than 7 days before your event date. We accept payment via cash, check, Venmo, Zelle, or other agreed-upon payment methods.</P>
            </Section>

            <Section title="Cancellations and Refunds">
              <Sub title="Client Cancellations" />
              <Ul items={[
                "More than 30 days before event — 50% of deposit will be refunded",
                "15–30 days before event — 25% of deposit will be refunded",
                "Less than 15 days before event — no refund will be provided",
                "Final payment — once paid, the final balance is non-refundable",
              ]} />

              <Sub title="Rescheduling" />
              <P>If you need to reschedule your event, please notify us as soon as possible. We will make every effort to accommodate your new date, subject to availability. One free reschedule is permitted; additional rescheduling may incur a fee.</P>

              <Sub title="Our Cancellations" />
              <P>In the unlikely event that we must cancel your booking due to unforeseen circumstances, we will provide a full refund of all payments made. We are not liable for any additional costs or damages beyond the refund.</P>
            </Section>

            <Section title="Event Details and Changes">
              <P>You must provide accurate and complete information about your event, including:</P>
              <Ul items={[
                "Event date, time, and location",
                "Venue access information",
                "Any venue restrictions or requirements",
                "Number of guests (if relevant to design)",
                "Theme, color scheme, and design preferences",
              ]} />
              <P>Changes to your order may be requested up to 14 days before the event date. Changes requested within 14 days may not be possible and could incur additional fees. Significant changes may require a new quote.</P>
            </Section>

            <Section title="Venue Requirements">
              <P>It is your responsibility to:</P>
              <Ul items={[
                "Ensure we have appropriate access to the venue for setup and teardown",
                "Inform us of any venue restrictions (ceiling height, balloon policies, etc.)",
                "Obtain any necessary permissions from the venue for balloon installations",
                "Provide adequate space and electrical outlets if required",
                "Ensure the venue is ready for our arrival at the scheduled setup time",
              ]} />
              <P>We are not responsible for any issues arising from venue restrictions or access problems that were not communicated to us in advance.</P>
            </Section>

            <Section title="Liability and Damages">
              <Sub title="Our Liability" />
              <P>While we take great care in creating and installing our balloon decorations, balloons are delicate items affected by environmental factors. We cannot guarantee that all balloons will remain inflated for any specific duration.</P>
              <P>We are not liable for:</P>
              <Ul items={[
                "Balloons that deflate due to extreme temperatures, humidity, or other environmental conditions",
                "Damage caused by third parties, guests, or venue staff after installation",
                "Issues arising from inaccurate information provided by the client",
                "Venue access problems or restrictions not communicated to us",
                "Consequential or indirect damages",
              ]} />

              <Sub title="Your Liability" />
              <P>You are responsible for any damage to our equipment or installations caused by you, your guests, or venue staff. You agree to indemnify and hold us harmless from any claims, damages, or expenses arising from your event.</P>

              <Sub title="Limitation of Liability" />
              <P>Our total liability for any claim related to our services shall not exceed the amount you paid for those services.</P>
            </Section>

            <Section title="Weather and Force Majeure">
              <P>For outdoor events, balloons are weather-dependent. Extreme heat, cold, wind, or rain can affect balloon performance and durability. We will provide recommendations based on weather forecasts, but cannot guarantee outdoor balloon longevity.</P>
              <P>In cases of extreme weather or other force majeure events (natural disasters, etc.), we may need to cancel or reschedule services. In such cases, we will work with you to find an alternative date or provide a full refund.</P>
            </Section>

            <Section title="Intellectual Property and Photography">
              <P>All designs, concepts, and creative work produced by SimplyPop Creations remain our intellectual property. By booking our services, you grant us permission to:</P>
              <Ul items={[
                "Photograph our installations at your event",
                "Use photos and videos of our work for marketing purposes",
                "Share images on our website, social media, and promotional materials",
              ]} />
              <P>If you prefer that we do not photograph or share images from your event, please notify us in writing at the time of booking.</P>
            </Section>

            <Section title="Client Conduct">
              <P>We expect all clients to treat our staff with respect and professionalism. We reserve the right to refuse service or terminate a booking if we experience:</P>
              <Ul items={[
                "Abusive, threatening, or harassing behavior",
                "Unsafe working conditions",
                "Breach of these Terms",
                "Non-payment or payment issues",
              ]} />
              <P>In such cases, no refund will be provided.</P>
            </Section>

            <Section title="Warranties and Disclaimers">
              <P>We warrant that our services will be performed in a professional manner consistent with industry standards. However, we make no other warranties, express or implied, including warranties of merchantability or fitness for a particular purpose.</P>
              <P>Our services are provided "as is" and "as available." We do not warrant that our services will be uninterrupted, error-free, or meet your specific requirements.</P>
            </Section>

            <Section title="Privacy">
              <P>Your privacy is important to us. Please review our{" "}
                <Link to="/privacy" className="text-rose hover:text-charcoal underline underline-offset-4 transition-colors">
                  Privacy Policy
                </Link>{" "}
                to understand how we collect, use, and protect your personal information.
              </P>
            </Section>

            <Section title="Governing Law and Disputes">
              <P>These Terms shall be governed by and construed in accordance with the laws of the State of Oklahoma, without regard to its conflict of law provisions.</P>
              <P>Any disputes arising from these Terms or our services shall first be resolved through good faith negotiation. If negotiation fails, disputes shall be resolved in the courts of Tulsa County, Oklahoma.</P>
            </Section>

            <Section title="Severability">
              <P>If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.</P>
            </Section>

            <Section title="Entire Agreement">
              <P>These Terms, together with our Privacy Policy and any written agreement or quote provided to you, constitute the entire agreement between you and SimplyPop Creations regarding our services.</P>
            </Section>

            <Section title="Contact Us">
              <P>If you have any questions about these Terms of Service, please contact us:</P>
              <div className="bg-cream-deep border border-warm-line p-6 mt-4">
                <p className="font-display font-medium text-lg text-charcoal mb-3">SimplyPop Creations</p>
                <p className="font-sans font-light text-sm text-charcoal-light mb-1">Tulsa, Oklahoma and surrounding areas</p>
                <p className="font-sans font-light text-sm text-charcoal-light mb-1">
                  Contact:{" "}
                  <Link to="/contact" className="text-rose hover:text-charcoal underline underline-offset-4 transition-colors">
                    Use our contact form
                  </Link>
                </p>
                <p className="font-sans font-light text-sm text-charcoal-light">
                  Social:{" "}
                  <a href="https://www.facebook.com/profile.php?id=61565272086892" target="_blank" rel="noopener noreferrer" className="text-rose hover:text-charcoal underline underline-offset-4 transition-colors">Facebook</a>
                  {" · "}
                  <a href="https://www.instagram.com/simplypopcreations?igsh=bmY3MnM1Z3B5NGE5" target="_blank" rel="noopener noreferrer" className="text-rose hover:text-charcoal underline underline-offset-4 transition-colors">Instagram</a>
                </p>
              </div>
            </Section>

            {/* Acknowledgment */}
            <div className="border-l-2 border-gold pl-6 py-1 bg-gold-light/20">
              <p className="font-sans font-light text-sm text-charcoal-light leading-relaxed">
                By using our website, submitting an inquiry, or booking our services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>

            {/* Back */}
            <div className="mt-12 pt-8 border-t border-warm-line text-center">
              <Link
                to="/"
                className="inline-block bg-charcoal text-cream px-8 py-3 font-sans text-xs tracking-widest uppercase hover:bg-charcoal-light transition-colors duration-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
