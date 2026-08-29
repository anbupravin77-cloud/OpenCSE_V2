import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Shield, BookOpen, AlertCircle, FileText, CheckCircle2, Send, HelpCircle, Sparkles } from 'lucide-react';
import { SEO } from './SEO';

export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8">
      <SEO 
        title="About OpenCSE — Academic Curriculum & Course Materials" 
        description="Learn about OpenCSE: an open, distraction-free academic resource platform engineered for Computer Science & Engineering students."
        canonicalPath="/about"
      />

      <Link to="/" className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white mb-10 font-medium transition-colors group">
        <ArrowLeft size={18} className="transform group-hover:-translate-x-2 transition-transform" /> Back to Curriculum
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-zinc-950 dark:text-white shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="currentColor" aria-label="OpenCSE Logo"><path d="M 181.37 65.65 A 90 90 0 0 0 62.77 172.18 L 87.56 269.69 L 161.29 142 L 137.29 142 Z" /><path d="M 118.63 234.35 A 90 90 0 0 0 237.23 127.82 L 212.44 30.31 L 138.71 158 L 162.71 158 Z" /></svg>
          <span className="text-xs font-bold tracking-widest text-zinc-600 dark:text-zinc-400 uppercase">Platform Overview</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-6">About OpenCSE</h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
          An open, distraction-free academic workspace built specifically for Computer Science & Engineering students and educators.
        </p>
      </header>

      <div className="space-y-12">
        <section className="space-y-4">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">Our Mission: Knowledge Without Barriers</h2>
          <p className="text-zinc-600 dark:text-zinc-400 font-light text-base sm:text-lg leading-relaxed">
            Computer science education is one of the most dynamic and challenging fields in modern engineering. Yet, students routinely struggle with fragmented resources, cluttered portals, paywalled lecture notes, and disorganized course outcomes.
          </p>
          <p className="text-zinc-600 dark:text-zinc-400 font-light text-base sm:text-lg leading-relaxed">
            OpenCSE was created to eliminate these barriers. We provide a single, quiet, and structured repository where undergraduate and graduate students can access comprehensive course curricula, outcome-based topic summaries, and verified study materials completely free of distractions.
          </p>
        </section>

        <section aria-labelledby="platform-scope" className="grid sm:grid-cols-2 gap-6 pt-4">
          <h2 id="platform-scope" className="sr-only">Platform Scope and Audience</h2>
          <div className="p-6 sm:p-8 liquid-glass-panel rounded-2xl">
            <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-950 dark:text-white mb-4 shadow-sm shrink-0">
              <BookOpen size={20} />
            </div>
            <h3 className="text-xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-2">Who It Is For</h3>
            <p className="text-zinc-600 dark:text-zinc-400 font-light text-sm sm:text-base leading-relaxed">
              Designed for Computer Science undergraduates across all 4 academic years (1st through 4th year), engineering faculty seeking structured outcome-based outlines, and self-directed learners reviewing core computing fundamentals.
            </p>
          </div>

          <div className="p-6 sm:p-8 liquid-glass-panel rounded-2xl">
            <div className="w-10 h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-950 dark:text-white mb-4 shadow-sm shrink-0">
              <Sparkles size={20} />
            </div>
            <h3 className="text-xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-2">What You Will Find</h3>
            <p className="text-zinc-600 dark:text-zinc-400 font-light text-sm sm:text-base leading-relaxed">
              Full semester curricula covering fundamental subjects including Operating Systems, Data Structures & Algorithms, OOP, Probability & Statistics, and Programming Language Theory, mapped directly to Course Outcomes (COs).
            </p>
          </div>
        </section>

        <section className="space-y-6 border-t border-zinc-200 dark:border-zinc-800 pt-10">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">How Educational Resources Are Prepared</h2>
          <div className="space-y-4 text-zinc-600 dark:text-zinc-400 font-light text-base leading-relaxed">
            <div className="flex gap-4 items-start">
              <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
              <div>
                <strong className="text-zinc-950 dark:text-white font-medium">Curriculum Alignment:</strong> Topics and Course Outcomes (CO1 through CO5) are mapped according to accredited university Computer Science guidelines and standard Outcome-Based Education (OBE) frameworks.
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
              <div>
                <strong className="text-zinc-950 dark:text-white font-medium">Human-Led Editorial Review:</strong> Every topic summary, code example, and learning guide is authored or vetted by engineering academics and senior developers to ensure conceptual accuracy and pedagogical rigor.
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-1" />
              <div>
                <strong className="text-zinc-950 dark:text-white font-medium">Supplemental Slide Decks & Modules:</strong> We provide downloadable, curated PDF study modules and presentation slide decks (PPT/PPTX) for quick revision and deep exam preparation.
              </div>
            </div>
          </div>
        </section>

        <section className="p-8 liquid-glass-panel rounded-2xl">
          <h2 className="text-xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-3">Commitment to Free Academic Access</h2>
          <p className="text-zinc-600 dark:text-zinc-400 font-light text-sm sm:text-base leading-relaxed">
            We believe that university-level technical knowledge should be universally accessible. OpenCSE requires no paywalls, accounts, or mandatory sign-ups for students to access study notes and topic materials.
          </p>
        </section>
      </div>
    </div>
  );
}

export function ContactPage() {
  const [contactEmail, setContactEmail] = useState<string>('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [category, setCategory] = useState('Feedback');
  const [name, setName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Attempt to fetch configured email from server or client env
    const clientEnvEmail = (import.meta as any).env?.VITE_CONTACT_EMAIL || (import.meta as any).env?.CONTACT_EMAIL;
    if (clientEnvEmail) {
      setContactEmail(clientEnvEmail);
    } else {
      fetch('/api/config')
        .then(r => r.json())
        .then(data => {
          if (data && data.contactEmail) {
            setContactEmail(data.contactEmail);
          }
        })
        .catch(() => {});
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !name.trim() || !userEmail.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setErrorMessage('');
    
    // Direct mailto method pre-filling user input to anbupravin77@gmail.com
    const destinationEmail = contactEmail || 'anbupravin77@gmail.com';
    const subjectLine = encodeURIComponent(`[OpenCSE ${category}] from ${name} (${userEmail})`);
    const bodyText = encodeURIComponent(
      `Name: ${name}\nEmail: ${userEmail}\nCategory: ${category}\n\nMessage:\n${message}`
    );

    window.location.href = `mailto:${destinationEmail}?subject=${subjectLine}&body=${bodyText}`;
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8">
      <SEO 
        title="Contact OpenCSE — Academic Support & Feedback" 
        description="Get in touch with the OpenCSE academic team for feedback, content corrections, broken resource reports, and general inquiries."
        canonicalPath="/contact"
      />

      <Link to="/" className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white mb-10 font-medium transition-colors group">
        <ArrowLeft size={18} className="transform group-hover:-translate-x-2 transition-transform" /> Back to Curriculum
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-zinc-950 dark:text-white shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="currentColor" aria-label="OpenCSE Logo"><path d="M 181.37 65.65 A 90 90 0 0 0 62.77 172.18 L 87.56 269.69 L 161.29 142 L 137.29 142 Z" /><path d="M 118.63 234.35 A 90 90 0 0 0 237.23 127.82 L 212.44 30.31 L 138.71 158 L 162.71 158 Z" /></svg>
          <span className="text-xs font-bold tracking-widest text-zinc-600 dark:text-zinc-400 uppercase">Support & Communication</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-6">Contact Us</h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
          Have feedback on a course, found a typo, or want to contribute educational material? We welcome your input.
        </p>
      </header>

      <div className="grid md:grid-cols-12 gap-8 items-start">
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 liquid-glass-panel rounded-2xl space-y-4">
            <h2 className="text-lg font-serif font-bold tracking-tight text-zinc-950 dark:text-white">How We Can Help</h2>
            <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400 font-light">
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 dark:text-zinc-500 font-mono">•</span>
                <span><strong className="text-zinc-950 dark:text-zinc-100 font-medium">Content Corrections:</strong> Report errors in topic descriptions, code snippets, or notes.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 dark:text-zinc-500 font-mono">•</span>
                <span><strong className="text-zinc-950 dark:text-zinc-100 font-medium">Broken Resources:</strong> Notify us of missing slides or corrupted PDF links.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 dark:text-zinc-500 font-mono">•</span>
                <span><strong className="text-zinc-950 dark:text-zinc-100 font-medium">Curriculum Suggestions:</strong> Propose additional subjects, electives, or topics.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-zinc-400 dark:text-zinc-500 font-mono">•</span>
                <span><strong className="text-zinc-950 dark:text-zinc-100 font-medium">Copyright Inquiries:</strong> Takedown or intellectual property verification requests.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 liquid-glass-panel rounded-2xl">
            <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400 mb-2">
              <Mail size={18} className="text-zinc-950 dark:text-white shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-600 dark:text-zinc-400">Direct Email</span>
            </div>
            {contactEmail ? (
              <a 
                href={`mailto:${contactEmail}`} 
                className="text-zinc-950 dark:text-white font-mono text-sm hover:underline break-all"
              >
                {contactEmail}
              </a>
            ) : (
              <div className="text-xs text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                Contact inquiries can be submitted directly via the inquiry form.
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-7 liquid-glass-panel rounded-2xl p-6 sm:p-8">
          {formSubmitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={24} />
              </div>
              <h2 className="text-2xl font-serif font-bold text-zinc-950 dark:text-white">Thank You</h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm max-w-md mx-auto leading-relaxed">
                Your message has been processed. If you submitted via email client, our academic team will review your submission shortly.
              </p>
              <button 
                onClick={() => { setFormSubmitted(false); setMessage(''); }}
                className="mt-6 text-sm font-bold text-zinc-950 dark:text-white bg-zinc-200 dark:bg-zinc-800 px-6 py-2.5 rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="inquiry-category" className="block text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">Inquiry Category</label>
                <select 
                  id="inquiry-category"
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-500 transition-colors disabled:opacity-50"
                >
                  <option value="Feedback">General Feedback</option>
                  <option value="Correction">Course Content Correction / Errata</option>
                  <option value="Broken Resource">Broken Download / Missing Resource</option>
                  <option value="Subject Suggestion">Subject or Curriculum Suggestion</option>
                  <option value="Copyright">Copyright & Takedown Request</option>
                  <option value="Technical Issue">Technical / Platform Issue</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">Your Name</label>
                  <input 
                    id="contact-name"
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="e.g. Alex" 
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-500 transition-colors disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">Your Email</label>
                  <input 
                    id="contact-email"
                    type="email" 
                    value={userEmail} 
                    onChange={e => setUserEmail(e.target.value)}
                    disabled={isSubmitting}
                    placeholder="you@example.com" 
                    className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 py-3 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-500 transition-colors disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-300 mb-2">Message</label>
                <textarea 
                  id="contact-message"
                  rows={5} 
                  required
                  value={message} 
                  onChange={e => setMessage(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Please describe your question, feedback, or specific subject topic in detail..." 
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-4 text-sm text-zinc-950 dark:text-white focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-500 transition-colors resize-y disabled:opacity-50"
                />
              </div>

              {errorMessage && (
                <div className="text-red-500 dark:text-red-400 text-sm font-medium p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl">
                  {errorMessage}
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 py-3.5 px-6 rounded-xl font-bold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <Send size={16} className={isSubmitting ? "animate-pulse" : ""} /> {isSubmitting ? 'Sending...' : 'Submit Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8">
      <SEO 
        title="Privacy Policy — OpenCSE" 
        description="Read the OpenCSE Privacy Policy. We explain how user privacy is respected, log information, and advertising disclosures."
        canonicalPath="/privacy"
      />

      <Link to="/" className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white mb-10 font-medium transition-colors group">
        <ArrowLeft size={18} className="transform group-hover:-translate-x-2 transition-transform" /> Back to Curriculum
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-zinc-950 dark:text-white shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="currentColor" aria-label="OpenCSE Logo"><path d="M 181.37 65.65 A 90 90 0 0 0 62.77 172.18 L 87.56 269.69 L 161.29 142 L 137.29 142 Z" /><path d="M 118.63 234.35 A 90 90 0 0 0 237.23 127.82 L 212.44 30.31 L 138.71 158 L 162.71 158 Z" /></svg>
          <span className="text-xs font-bold tracking-widest text-zinc-600 dark:text-zinc-400 uppercase">Legal & Compliance</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-4">Privacy Policy</h1>
        <p className="text-sm text-zinc-600 font-mono">Last Updated: August 2026</p>
      </header>

      <div className="space-y-10 text-zinc-600 dark:text-zinc-400 font-light text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">1. Introduction</h2>
          <p>
            OpenCSE ("we", "our", or "the platform") is dedicated to providing an open and distraction-free academic repository for Computer Science students. This Privacy Policy clarifies our practices regarding information collection, storage, and visitor privacy when using our website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">2. Information Collection</h2>
          <p>
            We adhere to strict data minimization principles. As a public curriculum directory:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-800 dark:text-zinc-300">
            <li><strong className="text-zinc-950 dark:text-white">No Student Registration Required:</strong> Visitors can browse curricula, read topics, and download study modules without creating an account or providing names, phone numbers, or credit card details.</li>
            <li><strong className="text-zinc-950 dark:text-white">Standard Server Logs:</strong> Like most web servers, our hosting infrastructure may record standard non-personally identifiable technical logs (such as IP address, browser user-agent, requested page, and timestamp) strictly for server diagnostics, abuse prevention, and operational security.</li>
            <li><strong className="text-zinc-950 dark:text-white">Local Storage:</strong> We use browser storage (SessionStorage/LocalStorage) exclusively for client preferences (such as filtering by academic year) and administrator session authentication.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">3. Third-Party Services & Advertising Disclosures</h2>
          <p>
            OpenCSE may utilize reputable third-party partners to support infrastructure, CDN caching, and optional non-intrusive advertising in the future:
          </p>
          <div className="p-6 liquid-glass-panel rounded-2xl space-y-3 mt-4">
            <h3 className="text-lg font-serif font-bold text-zinc-950 dark:text-white">Advertising Disclosure (Google AdSense Preparation)</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              If and when advertising services (such as Google AdSense) are activated on the platform:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-xs sm:text-sm text-zinc-800 dark:text-zinc-300">
              <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.</li>
              <li>Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our sites and/or other sites on the Internet.</li>
              <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-zinc-950 dark:text-white underline hover:text-zinc-600 dark:hover:text-zinc-300">Google Ads Settings</a> or through <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-zinc-950 dark:text-white underline hover:text-zinc-600 dark:hover:text-zinc-300">aboutads.info</a>.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">4. Cookies and Web Beacons</h2>
          <p>
            Cookies are small data files stored on your device. OpenCSE does not use invasive tracking cookies. If third-party services (such as font delivery or future advertising networks) place cookies, they are governed by their respective privacy policies. You can configure your browser to reject cookies or notify you when a cookie is issued.
          </p>
        </section>

        <section className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">5. Data Security</h2>
          <p>
            We implement standard HTTPS encryption across all client-server communications to safeguard traffic integrity and protect students against eavesdropping.
          </p>
        </section>

        <section className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">6. Contact for Privacy Inquiries</h2>
          <p>
            If you have questions regarding this Privacy Policy or wish to request data verification, please visit our <Link to="/contact" className="text-zinc-950 dark:text-white underline hover:text-zinc-600 dark:hover:text-zinc-300">Contact Page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8">
      <SEO 
        title="Terms of Service — OpenCSE" 
        description="Review the terms and conditions for using OpenCSE academic resources and educational materials."
        canonicalPath="/terms"
      />

      <Link to="/" className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white mb-10 font-medium transition-colors group">
        <ArrowLeft size={18} className="transform group-hover:-translate-x-2 transition-transform" /> Back to Curriculum
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-zinc-950 dark:text-white shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="currentColor" aria-label="OpenCSE Logo"><path d="M 181.37 65.65 A 90 90 0 0 0 62.77 172.18 L 87.56 269.69 L 161.29 142 L 137.29 142 Z" /><path d="M 118.63 234.35 A 90 90 0 0 0 237.23 127.82 L 212.44 30.31 L 138.71 158 L 162.71 158 Z" /></svg>
          <span className="text-xs font-bold tracking-widest text-zinc-600 dark:text-zinc-400 uppercase">Legal Agreement</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-4">Terms of Service</h1>
        <p className="text-sm text-zinc-600 font-mono">Last Updated: August 2026</p>
      </header>

      <div className="space-y-10 text-zinc-600 dark:text-zinc-400 font-light text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">1. Acceptance of Terms</h2>
          <p>
            By accessing or browsing OpenCSE ("the platform"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Content Policy. If you do not agree, please discontinue use of the website.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">2. Educational & Non-Commercial Purpose</h2>
          <p>
            OpenCSE is provided solely for educational, academic study, reference, and non-commercial research purposes. You may read, view, and download materials for your individual study and exam revision.
          </p>
        </section>

        <section className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">3. Acceptable Use Policy</h2>
          <p>
            Users agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-800 dark:text-zinc-300">
            <li>Attempt unauthorized access to administrative endpoints, servers, or internal databases.</li>
            <li>Launch denial-of-service (DoS) attacks, scrape bandwidth excessively, or disrupt platform availability for other students.</li>
            <li>Upload malicious scripts, viruses, or unauthorized files.</li>
            <li>Misrepresent affiliation with OpenCSE or its educational contributors.</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">4. Academic Accuracy & Disclaimer of Warranties</h2>
          <p>
            While our team exercises diligence in curating and reviewing course topics, syllabus outlines, and slide decks, all materials are provided on an "AS IS" and "AS AVAILABLE" basis. OpenCSE makes no warranties that the materials will mirror every university's exact examination questions or syllabus updates. Students should always cross-reference their official departmental syllabus for formal degree requirements.
          </p>
        </section>

        <section className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">5. Intellectual Property & Uploaded Materials</h2>
          <p>
            All original structural organization, custom educational articles, and platform software are the intellectual property of OpenCSE. Referenced presentations, standard academic syllabi, and supplemental reference documents remain the property of their respective creators and educational institutions.
          </p>
        </section>

        <section className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">6. Limitation of Liability</h2>
          <p>
            In no event shall OpenCSE, its creators, or contributors be held liable for any direct, indirect, incidental, or consequential damages resulting from the use of, or inability to use, materials hosted on the platform.
          </p>
        </section>

        <section className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">7. Modifications & Inquiries</h2>
          <p>
            We reserve the right to revise these Terms of Service at any time. Continued use of the platform constitutes acceptance of updated terms. For inquiries regarding these terms, visit our <Link to="/contact" className="text-zinc-950 dark:text-white underline hover:text-zinc-600 dark:hover:text-zinc-300">Contact Page</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}

export function ContentPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8">
      <SEO 
        title="Content Policy & Copyright — OpenCSE" 
        description="Learn about OpenCSE's editorial standards, AI-assisted content transparency, human review process, and copyright takedown procedures."
        canonicalPath="/content-policy"
      />

      <Link to="/" className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white mb-10 font-medium transition-colors group">
        <ArrowLeft size={18} className="transform group-hover:-translate-x-2 transition-transform" /> Back to Curriculum
      </Link>

      <header className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-8 h-8 text-zinc-950 dark:text-white shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="currentColor" aria-label="OpenCSE Logo"><path d="M 181.37 65.65 A 90 90 0 0 0 62.77 172.18 L 87.56 269.69 L 161.29 142 L 137.29 142 Z" /><path d="M 118.63 234.35 A 90 90 0 0 0 237.23 127.82 L 212.44 30.31 L 138.71 158 L 162.71 158 Z" /></svg>
          <span className="text-xs font-bold tracking-widest text-zinc-600 dark:text-zinc-400 uppercase">Editorial Standards</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-4">Content & Copyright Policy</h1>
        <p className="text-sm text-zinc-600 font-mono">Last Updated: August 2026</p>
      </header>

      <div className="space-y-10 text-zinc-600 dark:text-zinc-400 font-light text-base leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">1. Editorial Philosophy & Originality</h2>
          <p>
            OpenCSE is committed to publishing high-yield, structured, and pedagogical academic material for Computer Science engineering courses. Our curriculum structures follow standard university course outcomes (COs) and outcome-based education (OBE) rubrics.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">2. AI-Assisted Content Disclosure & Human Review</h2>
          <p>
            Transparency in academic publishing is paramount:
          </p>
          <div className="p-6 liquid-glass-panel rounded-2xl space-y-3">
            <h3 className="text-lg font-serif font-bold text-zinc-950 dark:text-white">Our Review Framework</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              While AI assistance may be utilized during drafting to synthesize complex textbook explanations, generate illustrative diagrams, or format code snippets, <strong>every educational module is subjected to human editorial review</strong>.
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We do NOT mass-produce automated spam, thin placeholder content, or repetitive synthetic articles. We recognize that AI-generated text is not inherently copyright-free and must be vetted for factual rigor and originality.
            </p>
          </div>
        </section>

        <section className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">3. Copyright & Intellectual Property Protection</h2>
          <p>
            OpenCSE respects the intellectual property rights of authors, universities, professors, and content creators. We strive to provide original explanations and curated educational slide decks. If any uploaded document or study note is believed to infringe upon a valid copyright, we maintain a prompt takedown procedure.
          </p>
        </section>

        <section className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">4. Takedown & Copyright Notice Procedure (DMCA Compliance)</h2>
          <p>
            If you are a copyright holder or an authorized agent and believe that content hosted on OpenCSE infringes your intellectual property, please submit a formal notice via our <Link to="/contact" className="text-zinc-950 dark:text-white underline hover:text-zinc-600 dark:hover:text-zinc-300">Contact Page</Link> (selecting the "Copyright" category) containing:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-zinc-800 dark:text-zinc-300 text-sm">
            <li>Identification of the copyrighted work claimed to have been infringed.</li>
            <li>The exact URL / Subject / Topic location on OpenCSE where the material appears.</li>
            <li>Your contact information (name, organization, and official email address).</li>
            <li>A statement of good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law.</li>
            <li>A statement confirming the accuracy of the notice under penalty of perjury.</li>
          </ul>
          <p className="text-sm text-zinc-600 pt-2">
            Upon receipt of a verified request, our administration will promptly disable access to or remove the identified material within 48 business hours.
          </p>
        </section>

        <section className="space-y-3 border-t border-zinc-200 dark:border-zinc-800 pt-8">
          <h2 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">5. Reporting Errors & Academic Errata</h2>
          <p>
            If you find a technical error in a code sample, an incorrect mathematical formula in Probability notes, or an inaccurate statement in an OS lecture topic, please let us know immediately via our <Link to="/contact" className="text-zinc-950 dark:text-white underline hover:text-zinc-600 dark:hover:text-zinc-300">Contact Page</Link>. We maintain rapid editorial review cycles to correct community-reported errata.
          </p>
        </section>
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="max-w-xl mx-auto py-20 text-center">
      <SEO 
        title="Page Not Found (404) — OpenCSE" 
        description="The requested page could not be found on OpenCSE."
        canonicalPath="/404"
      />

      <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 rounded-2xl flex items-center justify-center font-serif text-2xl font-bold text-zinc-950 dark:text-white mx-auto mb-6 shadow-sm">
        404
      </div>
      
      <h1 className="text-4xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-4">Page Not Found</h1>
      <p className="text-zinc-600 dark:text-zinc-400 font-light text-base leading-relaxed mb-10 max-w-md mx-auto">
        The academic resource, topic, or page you are looking for does not exist or may have been relocated.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link 
          to="/" 
          className="w-full sm:w-auto bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold px-6 py-3 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm shadow-sm"
        >
          Return to Curriculum
        </Link>
        <Link 
          to="/about" 
          className="w-full sm:w-auto bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-950 dark:text-white font-medium px-6 py-3 rounded-xl hover:bg-zinc-300 dark:hover:bg-zinc-800 transition-colors text-sm"
        >
          About OpenCSE
        </Link>
      </div>
    </div>
  );
}

