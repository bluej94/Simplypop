// src/pages/PrivacyPolicy.jsx
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

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-cream">

      {/* ── HERO ── */}
      <section className="bg-cream pt-36 pb-20 px-4 border-b border-warm-line">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-sans text-[11px] tracking-[0.25em] uppercase text-gold mb-6">Legal</p>
          <h1 className="font-display font-light text-5xl md:text-6xl text-charcoal mb-5">
            Privacy Policy
          </h1>
          <span className="block w-12 h-px bg-gold mx-auto mb-6" />
          <p className="font-sans font-light text-sm text-warm-gray">Your privacy is important to us</p>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border border-warm-line p-8 md:p-12">

            <p className="font-sans text-xs text-warm-gray mb-10 pb-8 border-b border-warm-line">
              <span className="text-charcoal-light">Last Updated:</span> {lastUpdated}
            </p>

            <Section title="Introduction">
              <P>Simply Pop Creations ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</P>
              <P>By using our website and services, you agree to the collection and use of information in accordance with this policy. If you do not agree with our policies and practices, please do not use our services.</P>
            </Section>

            <Section title="Information We Collect">
              <Sub title="Personal Information" />
              <P>We collect personal information that you voluntarily provide to us when you:</P>
              <Ul items={[
                "Fill out our contact or booking inquiry form",
                "Communicate with us via email, phone, or social media",
                "Subscribe to our newsletter or marketing communications",
                "Book our services for an event",
              ]} />
              <P>This information may include:</P>
              <Ul items={[
                "Name",
                "Email address",
                "Phone number",
                "Event date and location",
                "Event descriptions and preferences",
                "Budget information",
                "Inspiration photos you upload",
                "Payment information (processed securely through third-party payment processors)",
              ]} />

              <Sub title="Automatically Collected Information" />
              <P>When you visit our website, we may automatically collect certain information about your device, including:</P>
              <Ul items={[
                "IP address",
                "Browser type and version",
                "Device type and operating system",
                "Pages you visit and time spent on those pages",
                "Referring website addresses",
                "Date and time of your visit",
                "Clickstream data",
              ]} />
            </Section>

            <Section title="How We Use Your Information">
              <P>We use the information we collect for the following purposes:</P>
              <Ul items={[
                "To provide our services — process inquiries, respond to requests, create custom quotes, and fulfill our contractual obligations",
                "Communication — contact you about your event, send confirmations, updates, and appointment reminders",
                "Service improvement — analyze usage patterns to improve our website, services, and customer experience",
                "Marketing — send promotional materials and updates about our services (with your consent where required by law)",
                "Legal compliance — comply with applicable laws, regulations, and legal processes",
                "Business operations — maintain records, process payments, prevent fraud, and manage our business",
                "Portfolio building — with your permission, use photos of our work at your event for marketing purposes",
              ]} />
            </Section>

            <Section title="How We Share Your Information">
              <P>We do not sell, rent, or trade your personal information to third parties. We may share your information in the following circumstances:</P>
              <Ul items={[
                "Service Providers — trusted third-party vendors who perform services on our behalf (payment processors, email services, web hosting)",
                "Business Transfers — if we are involved in a merger, acquisition, or sale of assets",
                "Legal Requirements — if required by law, court order, or valid requests by public authorities",
                "Protection of Rights — when necessary to protect our rights, property, or safety, or to prevent fraud",
                "With Your Consent — for any other purpose with your explicit consent",
              ]} />
            </Section>

            <Section title="Data Security">
              <P>We implement reasonable security measures designed to protect your personal information from unauthorized access, alteration, disclosure, or destruction:</P>
              <Ul items={[
                "Secure connections (HTTPS/SSL encryption) for data transmission",
                "Secure storage of sensitive information",
                "Limited access to personal information by authorized personnel only",
                "Regular security assessments and updates",
              ]} />
              <P>However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.</P>
            </Section>

            <Section title="Data Retention">
              <P>We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. Factors we consider include:</P>
              <Ul items={[
                "The nature of our relationship with you",
                "Legal and regulatory obligations",
                "Dispute resolution and legal claims",
                "Business operational needs",
              ]} />
              <P>When we no longer need your information, we will securely delete or anonymize it in accordance with our data retention policies.</P>
            </Section>

            <Section title="Your Privacy Rights">
              <P>Depending on your location, you may have certain rights regarding your personal information, including:</P>
              <Ul items={[
                "Access — request access to the personal information we hold about you",
                "Correction — request that we correct inaccurate or incomplete information",
                "Deletion — request that we delete your personal information (subject to legal obligations)",
                "Opt-out — unsubscribe from marketing communications at any time",
                "Data portability — request a copy of your information in a portable format",
                "Restriction — request that we restrict the processing of your information",
                "Objection — object to our processing of your information for certain purposes",
              ]} />
              <P>To exercise any of these rights, please contact us using the information below.</P>
            </Section>

            <Section title="Cookies and Tracking Technologies">
              <P>We may use cookies and similar tracking technologies to track activity on our website and store certain information. Cookies are small data files stored on your device that help us improve your browsing experience.</P>
              <Sub title="Types of Cookies We Use" />
              <Ul items={[
                "Essential Cookies — necessary for the website to function properly",
                "Analytics Cookies — help us understand how visitors interact with our website",
                "Functional Cookies — remember your preferences and settings",
                "Marketing Cookies — track browsing to show relevant advertisements (with your consent)",
              ]} />
              <P>You can control cookies through your browser settings. Please note that blocking or deleting cookies may affect your experience on our website and limit certain features.</P>
            </Section>

            <Section title="Third-Party Links and Services">
              <P>Our website may contain links to third-party websites, including social media platforms (Facebook, Instagram). We are not responsible for the privacy practices or content of these external sites.</P>
              <P>When you click on a third-party link, you will be directed to that site, which has its own privacy policy. We encourage you to review the privacy policies of any third-party sites you visit.</P>
            </Section>

            <Section title="Children's Privacy">
              <P>Our services are not directed to children under the age of 13, and we do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13 without parental consent, we will take steps to delete that information promptly.</P>
              <P>If you believe we have collected information from a child under 13, please contact us immediately.</P>
            </Section>

            <Section title="Changes to This Privacy Policy">
              <P>We may update this Privacy Policy from time to time to reflect changes in our practices, technology, or legal requirements. We will notify you of material changes by:</P>
              <Ul items={[
                "Posting the updated Privacy Policy on this page",
                "Updating the \"Last Updated\" date at the top of this page",
                "Sending you an email notification (for significant changes)",
              ]} />
              <P>Your continued use of our services after changes are made constitutes acceptance of those changes.</P>
            </Section>

            <Section title="California Residents (CCPA)">
              <P>If you are a California resident, you may have additional rights under the California Consumer Privacy Act (CCPA), including:</P>
              <Ul items={[
                "Right to Know — request information about the personal information we have collected in the past 12 months",
                "Right to Delete — request deletion of your personal information (subject to certain exceptions)",
                "Right to Opt-Out — opt-out of the sale of your personal information (note: we do not sell personal information)",
                "Right to Non-Discrimination — not receive discriminatory treatment for exercising your CCPA rights",
              ]} />
            </Section>

            <Section title="International Users">
              <P>Our services are primarily intended for users in the United States, specifically the Tulsa, Oklahoma and surrounding areas. If you are accessing our website from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States.</P>
              <P>By using our services, you consent to the transfer and processing of your information in accordance with this Privacy Policy and applicable U.S. law.</P>
            </Section>

            <Section title="Contact Us">
              <P>If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:</P>
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
                By using our website and services, you acknowledge that you have read, understood, and agree to this Privacy Policy and our collection, use, and disclosure of your personal information as described herein.
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
