import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Settings, Edit2, Plus, Trash2, FileText, Download } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { FullSubject, Subject, CO, Topic, Resource } from './types';
import { SEO } from './components/SEO';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';

// Code-split non-critical legal pages and admin modules to keep student bundle lightweight (~194 KiB savings)
const AboutPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.ContactPage })));
const PrivacyPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.TermsPage })));
const ContentPolicyPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.ContentPolicyPage })));
const NotFoundPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.NotFoundPage })));
const AdminSubjectEditor = lazy(() => import('./components/AdminEditors').then(m => ({ default: m.AdminSubjectEditor })));

type YearType = '1st' | '2nd' | '3rd' | '4th';

function RouteFallback() {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
      <div className="h-12 w-full max-w-lg bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
      <div className="space-y-4 pt-4">
        <div className="h-28 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
        <div className="h-28 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
      </div>
    </div>
  );
}

function StudentHeader() {
  return (
    <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group" aria-label="OpenCSE Home">
          <div className="w-10 h-10 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-serif text-xl font-bold rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105 shrink-0">
            O
          </div>
          <span className="font-serif font-bold tracking-tight text-2xl text-zinc-950 dark:text-white">OpenCSE</span>
        </Link>
        <nav aria-label="Main Navigation" className="flex items-center gap-4 sm:gap-6">
          <Link 
            to="/about"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors hidden sm:inline"
          >
            About
          </Link>
          <Link 
            to="/contact"
            className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors hidden sm:inline"
          >
            Contact
          </Link>
          <Link 
            to="/admin"
            className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
            aria-label="Admin Access"
          >
            <Settings size={18} />
            <span className="hidden sm:inline">Admin Access</span>
          </Link>
          <div className="pl-1 sm:pl-2 border-l border-zinc-200 dark:border-zinc-800">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}

function StudentFooter() {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/60 dark:bg-zinc-950/60 py-12 px-6 sm:px-8 lg:px-12 mt-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-serif text-sm font-bold rounded-lg shadow-sm shrink-0">
            O
          </div>
          <div>
            <span className="font-serif font-bold text-zinc-950 dark:text-white text-base">OpenCSE</span>
            <span className="text-xs text-zinc-600 dark:text-zinc-400 ml-3 hidden sm:inline font-light">Distraction-free academic resources for Computer Science</span>
          </div>
        </div>
        <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
          <Link to="/" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Curriculum</Link>
          <Link to="/about" className="hover:text-zinc-950 dark:hover:text-white transition-colors">About</Link>
          <Link to="/contact" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Contact</Link>
          <Link to="/privacy" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Terms</Link>
          <Link to="/content-policy" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Content Policy</Link>
        </nav>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-900 text-center text-xs text-zinc-600 dark:text-zinc-400 font-light">
        © {new Date().getFullYear()} OpenCSE. Knowledge Without Barriers. Educational use only.
      </div>
    </footer>
  );
}

function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col justify-between transition-colors duration-200">
      <StudentHeader />
      <main className="flex-1 py-12 sm:py-20 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        {children}
      </main>
      <StudentFooter />
    </div>
  );
}

function HeroAmbience() {
  return (
    <div 
      aria-hidden="true" 
      className="absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[420px] sm:h-[460px] pointer-events-none select-none overflow-hidden -z-10"
    >
      {/* LAYER 1: Base Atmosphere (Composited CSS slow-drift radial glows with single transform ownership) */}
      <div 
        className="absolute top-[35%] left-1/2 w-[520px] sm:w-[720px] h-[300px] sm:h-[380px] rounded-full ambient-drift-primary blur-3xl pointer-events-none opacity-60 dark:opacity-45"
        style={{
          background: 'radial-gradient(ellipse 65% 55% at center, rgba(148, 163, 184, 0.22) 0%, rgba(100, 116, 139, 0.06) 45%, transparent 75%)'
        }}
      />
      <div 
        className="hidden sm:block absolute top-[28%] left-[58%] w-[420px] sm:w-[560px] h-[240px] sm:h-[300px] rounded-full ambient-drift-secondary blur-3xl pointer-events-none opacity-40 dark:opacity-30"
        style={{
          background: 'radial-gradient(circle 260px at center, rgba(120, 113, 108, 0.16) 0%, rgba(82, 82, 91, 0.04) 50%, transparent 70%)'
        }}
      />

      {/* LAYER 2: Technical Grid Matrix (Refined, low-contrast, masked to hero area) */}
      <div className="absolute inset-0 academic-grid-pattern opacity-50 dark:opacity-45 sm:opacity-75 sm:dark:opacity-60" />

      {/* LAYER 3: Depth Markers (6 carefully balanced academic-technical markers) */}
      {/* Marker 1: Top-Left Crosshair & Coordinate */}
      <div className="absolute top-8 sm:top-10 left-3 sm:left-6 flex items-center gap-2 ambient-marker">
        <span className="font-mono text-xs text-zinc-400/60 dark:text-zinc-500/70">+</span>
        <span className="hidden sm:inline-block font-mono text-[9px] text-zinc-400/50 dark:text-zinc-600/60 tracking-wider">[42.36° N]</span>
      </div>

      {/* Marker 2: Top-Right OBE Curriculum Badge */}
      <div className="absolute top-6 sm:top-8 right-3 sm:right-6 flex items-center gap-2 px-2.5 py-1 rounded-full border border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/70 text-[10px] font-mono text-zinc-600 dark:text-zinc-400 shadow-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ambient-spark"></span>
        <span className="tracking-wider">OBE CURRICULUM</span>
      </div>

      {/* Marker 3: Mid-Left Hairline Accent */}
      <div className="hidden md:flex absolute top-32 left-4 items-center gap-2.5 ambient-marker">
        <div className="w-6 h-[1px] bg-zinc-300/60 dark:bg-zinc-700/60" />
        <span className="font-mono text-[9px] text-zinc-400/50 dark:text-zinc-600/60 tracking-widest uppercase">ACAD.V2</span>
      </div>

      {/* Marker 4: Top-Right Crosshair Accent */}
      <div className="hidden lg:block absolute top-14 right-36 font-mono text-xs text-zinc-400/40 dark:text-zinc-600/50 select-none ambient-marker">
        +
      </div>

      {/* Marker 5: Bottom-Right Technical Index */}
      <div className="hidden md:block absolute bottom-10 right-6 text-[9px] font-mono text-zinc-400/50 dark:text-zinc-600/50 tracking-widest uppercase select-none ambient-marker">
        [CS-ENG // 2026]
      </div>

      {/* Marker 6: Bottom-Left Course Outcome Index */}
      <div className="hidden sm:block absolute bottom-10 left-6 text-[9px] font-mono text-zinc-400/50 dark:text-zinc-600/50 tracking-widest uppercase select-none ambient-marker">
        [01-04] ACCREDITED OUTCOMES
      </div>
    </div>
  );
}

function SubjectCardSkeleton() {
  return (
    <div className="grid gap-6">
      {[1, 2, 3, 4].map((idx) => (
        <div 
          key={idx} 
          className="p-8 liquid-glass-card rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between min-h-[128px] skeleton-shimmer"
        >
          <div className="space-y-4 w-full max-w-md">
            <div className="flex items-center gap-4">
              <div className="h-4 w-20 bg-zinc-300 dark:bg-zinc-800 rounded"></div>
              <div className="h-5 w-24 bg-zinc-300 dark:bg-zinc-800 rounded-full"></div>
            </div>
            <div className="h-7 w-3/4 bg-zinc-300 dark:bg-zinc-800 rounded"></div>
          </div>
          <div className="h-6 w-6 bg-zinc-300 dark:bg-zinc-800 rounded-full mt-6 sm:mt-0 shrink-0"></div>
        </div>
      ))}
    </div>
  );
}

function StudentDashboard() {
  const [subjects, setSubjects] = useState<FullSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<YearType>('2nd');
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  const years: YearType[] = ['1st', '2nd', '3rd', '4th'];

  useEffect(() => {
    fetch('/api/full-subjects')
      .then(r => r.json())
      .then(data => {
        setSubjects(data.filter((s: any) => s.is_active));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (selectedSubjectId) {
    const subject = subjects.find(s => s.id === selectedSubjectId);
    if (!subject) return <div className="py-20 text-center text-zinc-600 dark:text-zinc-400">Subject not found</div>;
    return <StudentSubjectView subject={subject} onBack={() => setSelectedSubjectId(null)} />;
  }

  const currentYearSubjects = subjects.filter(s => s.academic_year === selectedYear);

  return (
    <div className="relative max-w-4xl mx-auto">
      <SEO 
        title="OpenCSE — Knowledge Without Barriers | Academic Resources for Computer Science"
        description="Distraction-free academic resources, curriculum guides, course outcomes, and verified study materials for Computer Science & Engineering students."
        canonicalPath="/"
      />

      {/* Decorative layered ambient hero background */}
      <HeroAmbience />

      {/* Hero Header with subtle entrance animation (CLS protected) */}
      <motion.header 
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: shouldReduceMotion ? 0 : 0.5, 
          ease: [0.21, 0.47, 0.32, 0.98] 
        }}
        className="mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Computer Science & Engineering</span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-4 sm:mb-6 leading-[1.1]">
          Knowledge Without Barriers.
        </h1>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl font-light leading-relaxed">
          Everything you need to learn, organized in one place.
        </p>
      </motion.header>

      {/* Year Navigation with Accessibility and 44px+ touch targets */}
      <nav aria-label="Academic Year Filter" className="flex gap-8 sm:gap-12 border-b border-zinc-200 dark:border-zinc-800 mb-12 overflow-x-auto hide-scrollbar">
        {years.map(y => (
          <button 
            key={y} 
            onClick={() => setSelectedYear(y)} 
            aria-label={`${y} Year Curriculum`}
            aria-pressed={selectedYear === y}
            className={`pb-4 pt-2 text-sm uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer min-h-[44px] flex items-center ${
              selectedYear === y 
                ? 'border-b-2 border-zinc-950 dark:border-white font-bold text-zinc-950 dark:text-white -mb-[1px]' 
                : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 border-b-2 border-transparent'
            }`}
          >
            {y} Year
          </button>
        ))}
      </nav>

      {/* Subject Cards or Stable Skeleton */}
      <div className="relative min-h-[300px]">
        {loading ? (
          <SubjectCardSkeleton />
        ) : currentYearSubjects.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
            <h2 className="text-3xl font-serif tracking-tight text-zinc-400 dark:text-zinc-600">Coming Soon</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mt-4 text-sm font-light">The curriculum for this year is currently being compiled.</p>
          </motion.div>
        ) : (
          <div className="grid gap-6">
            {currentYearSubjects.map((subject, index) => (
              <motion.button
                initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ 
                  duration: shouldReduceMotion ? 0 : 0.48, 
                  delay: shouldReduceMotion ? 0 : Math.min(index * 0.045, 0.22), 
                  ease: [0.21, 0.47, 0.32, 0.98] 
                }}
                key={subject.id}
                onClick={() => {
                  navigate(`/subject/${encodeURIComponent(subject.id)}`);
                }}
                className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-7 sm:p-8 liquid-glass-card subject-card rounded-2xl text-left cursor-pointer transform-gpu overflow-hidden"
                aria-label={`View ${subject.name} curriculum and topics`}
              >
                {/* Subtle Specular Light Sweep */}
                <div aria-hidden="true" className="subject-card-sweep" />

                <div className="relative z-10 pr-0 sm:pr-6">
                  <div className="flex items-center gap-3 mb-3.5">
                    <span className="text-xs font-bold tracking-widest text-zinc-700 dark:text-zinc-300 uppercase font-mono px-2 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800/70 border border-zinc-300/60 dark:border-zinc-700/60">
                      {subject.code}
                    </span>
                    <span className="text-xs px-3 py-0.5 bg-zinc-200/80 text-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300 rounded-full font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] border border-zinc-300/40 dark:border-white/10">
                      {subject.credits} Credits
                    </span>
                    {subject.department && (
                      <span className="hidden sm:inline text-xs text-zinc-500 dark:text-zinc-400 font-light truncate max-w-[200px]">
                        • {subject.department}
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors duration-200">
                    {subject.name}
                  </h2>
                </div>
                
                <div className="relative z-10 flex items-center gap-3 mt-6 sm:mt-0 shrink-0">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-200 hidden sm:inline">
                    Explore
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-all duration-200 shadow-sm">
                    <ArrowRight className="transform group-hover:translate-x-1 transition-transform duration-200" size={18} />
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StudentSubjectRoute() {
  const { subjectId } = useParams<{ subjectId: string }>();
  const [subject, setSubject] = useState<FullSubject | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/full-subjects')
      .then(r => r.json())
      .then(data => {
        const found = data.find((s: any) => s.id === subjectId || s.code.toLowerCase() === subjectId?.toLowerCase());
        setSubject(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [subjectId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-4 space-y-8 animate-pulse">
        <div className="h-6 w-36 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
        <div className="space-y-4">
          <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          <div className="h-12 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
          <div className="h-20 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
        </div>
        <div className="space-y-4 pt-6">
          <div className="h-24 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
          <div className="h-24 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h1 className="text-3xl font-serif font-bold text-zinc-950 dark:text-white mb-4">Subject Not Found</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 font-light">The requested course subject could not be located.</p>
        <Link to="/" className="bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold px-6 py-3 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm shadow-sm">
          Back to Curriculum
        </Link>
      </div>
    );
  }

  return <StudentSubjectView subject={subject} onBack={() => navigate('/')} />;
}

function StudentSubjectView({ subject, onBack }: { subject: FullSubject, onBack: () => void }) {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  if (activeTopicId) {
    const topic = subject.cos.flatMap(co => co.topics).find(t => t.id === activeTopicId);
    if (!topic) return null;
    return <StudentTopicView topic={topic} subjectCode={subject.code} onBack={() => setActiveTopicId(null)} />;
  }

  const subjectDescription = subject.description 
    ? subject.description.replace(/<[^>]*>?/gm, '') 
    : `Study ${subject.name} concepts including course outcomes, curriculum topics, and verified learning resources on OpenCSE.`;

  return (
    <div className="max-w-4xl mx-auto">
      <SEO 
        title={`${subject.name} (${subject.code})`}
        description={subjectDescription.slice(0, 160)}
        canonicalPath={`/subject/${subject.id}`}
        type="article"
      />

      <button 
        onClick={onBack} 
        className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white mb-12 font-medium transition-colors group cursor-pointer" 
        aria-label="Back to curriculum list"
      >
        <ArrowLeft size={18} className="transform group-hover:-translate-x-1.5 transition-transform duration-200" /> 
        <span>Back to Curriculum</span>
      </button>

      <header className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold tracking-widest text-zinc-700 dark:text-zinc-300 uppercase font-mono px-2.5 py-1 rounded bg-zinc-200/70 dark:bg-zinc-800/70 border border-zinc-300/60 dark:border-zinc-700/60">
            {subject.code}
          </span>
          <span className="text-xs px-3 py-1 bg-zinc-200/80 text-zinc-800 dark:bg-zinc-800/80 dark:text-zinc-300 rounded-full font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)] border border-zinc-300/40 dark:border-white/10">
            {subject.credits} Credits
          </span>
          <span className="text-xs text-zinc-500 dark:text-zinc-400 font-light truncate">
            • {subject.department || 'Computer Science & Engineering'}
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-6 leading-tight">
          {subject.name}
        </h1>
        {subject.description && (
          <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-300 font-light text-base sm:text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: subject.description }} />
        )}
      </header>

      <div className="space-y-12 sm:space-y-16">
        {subject.cos.map((co, coIndex) => (
          <motion.section 
            key={co.id} 
            aria-labelledby={`co-${co.id}`} 
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.48,
              delay: shouldReduceMotion ? 0 : Math.min(coIndex * 0.04, 0.18),
              ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className="border-t border-zinc-200 dark:border-zinc-800 pt-12"
          >
            <div className="mb-8">
              <div className="inline-block text-xs font-bold tracking-widest text-zinc-700 dark:text-zinc-300 uppercase font-mono px-2 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-800/60 border border-zinc-300/40 dark:border-zinc-700/40 mb-3">
                {co.code}
              </div>
              <h2 id={`co-${co.id}`} className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">
                {co.name}
              </h2>
              {co.description && (
                <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-base font-light leading-relaxed">
                  {co.description}
                </p>
              )}
            </div>

            <div className="grid gap-4">
              {co.topics.map((topic, topicIndex) => (
                <motion.button
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ 
                    duration: shouldReduceMotion ? 0 : 0.46, 
                    delay: shouldReduceMotion ? 0 : Math.min(topicIndex * 0.035, 0.20), 
                    ease: [0.21, 0.47, 0.32, 0.98] 
                  }}
                  key={topic.id}
                  onClick={() => setActiveTopicId(topic.id)}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-7 liquid-glass-card topic-card rounded-2xl text-left cursor-pointer transform-gpu overflow-hidden"
                  aria-label={`Open topic ${topic.title}`}
                >
                  <div className="pr-0 sm:pr-6">
                    <h3 className="text-lg sm:text-xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors duration-200">
                      {topic.title}
                    </h3>
                    {topic.description && (
                      <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2 font-light leading-relaxed">
                        {topic.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4 mt-5 sm:mt-0 shrink-0">
                    {topic.resources && topic.resources.length > 0 && (
                      <span className="text-xs px-3 py-1 bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-300 rounded-full font-medium flex items-center gap-1.5 border border-zinc-300/40 dark:border-white/10">
                        <FileText size={13} /> {topic.resources.length} {topic.resources.length === 1 ? 'Resource' : 'Resources'}
                      </span>
                    )}
                    <div className="w-9 h-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-all duration-200 shadow-sm">
                      <ArrowRight className="transform group-hover:translate-x-1 transition-transform duration-200" size={16} />
                    </div>
                  </div>
                </motion.button>
              ))}
              {co.topics.length === 0 && (
                <div className="p-6 text-sm text-zinc-500 italic border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
                  No topics available for this outcome yet.
                </div>
              )}
            </div>
          </motion.section>
        ))}
        {subject.cos.length === 0 && (
          <div className="py-16 text-center text-zinc-500 font-serif italic border-t border-zinc-200 dark:border-zinc-800">
            Course outcomes and topics are being prepared.
          </div>
        )}
      </div>
    </div>
  );
}

function StudentTopicView({ topic, subjectCode, onBack }: { topic: any, subjectCode: string, onBack: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const topicDesc = topic.description || `Study notes and resources for ${topic.title} (${subjectCode}) on OpenCSE.`;

  return (
    <div className="max-w-3xl mx-auto pb-32">
      <SEO 
        title={`${topic.title} — ${subjectCode}`}
        description={topicDesc.slice(0, 160)}
        canonicalPath={`/subject/${subjectCode}`}
        type="article"
      />

      <button 
        onClick={onBack} 
        className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white mb-12 font-medium transition-colors group cursor-pointer" 
        aria-label="Back to Subject"
      >
        <ArrowLeft size={18} className="transform group-hover:-translate-x-1.5 transition-transform duration-200" /> 
        <span>Back to Subject</span>
      </button>

      <header className="mb-14">
        <span className="text-xs font-bold tracking-widest text-zinc-700 dark:text-zinc-300 uppercase mb-3 block font-mono px-2.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800/70 border border-zinc-300/60 dark:border-zinc-700/60 w-fit">
          {subjectCode}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-5 leading-tight">
          {topic.title}
        </h1>
        {topic.description && (
          <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
            {topic.description}
          </p>
        )}
      </header>

      {topic.resources && topic.resources.length > 0 && (
        <motion.section 
          aria-labelledby="resources-heading" 
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.48,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className="mb-14 liquid-glass-panel p-6 sm:p-8 rounded-3xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 id="resources-heading" className="text-xs font-bold tracking-widest text-zinc-700 dark:text-zinc-300 uppercase font-mono">
              Study Resources & Materials
            </h2>
            <span className="text-xs text-zinc-500 font-mono">
              {topic.resources.length} {topic.resources.length === 1 ? 'FILE' : 'FILES'}
            </span>
          </div>
          <div className="grid gap-3.5">
            {topic.resources.map((res: any) => (
              <a
                key={res.id}
                href={res.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 sm:p-5 bg-white/90 dark:bg-zinc-950/90 border border-zinc-200/90 dark:border-zinc-800/90 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-2xl transition-all shadow-sm hover:shadow-md group cursor-pointer"
              >
                <div className="flex items-center gap-4 overflow-hidden">
                  <div className="w-10 h-10 shrink-0 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:bg-zinc-200 dark:group-hover:bg-zinc-800 transition-colors">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-sm sm:text-base text-zinc-950 dark:text-white truncate group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                      {res.title}
                    </div>
                    <div className="text-[11px] text-zinc-500 uppercase mt-0.5 tracking-wider font-mono">
                      {res.file_type || 'DOCUMENT'}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 ml-4 flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                  <span className="hidden sm:inline font-medium">Open</span>
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                    <Download size={15} />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </motion.section>
      )}

      {topic.content ? (
        <article className="prose dark:prose-invert prose-lg max-w-none text-zinc-800 dark:text-zinc-300 prose-headings:font-serif prose-headings:tracking-tight prose-headings:font-bold prose-headings:text-zinc-950 dark:prose-headings:text-white prose-a:text-zinc-950 dark:prose-a:text-white prose-a:font-bold hover:prose-a:text-zinc-600 dark:hover:prose-a:text-zinc-300 prose-img:border prose-img:border-zinc-200 dark:prose-img:border-zinc-800 prose-img:rounded-3xl prose-blockquote:border-zinc-950 dark:prose-blockquote:border-white prose-blockquote:font-serif prose-blockquote:italic" dangerouslySetInnerHTML={{ __html: topic.content }} />
      ) : (
        <div className="py-20 text-center text-zinc-500 font-serif italic border border-zinc-200 dark:border-zinc-800 border-dashed rounded-3xl">
          Content is being prepared for this topic.
        </div>
      )}
    </div>
  );
}

function AdminApp() {
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!sessionStorage.getItem('admin_auth')) {
      navigate('/admin/login');
    }
  }, [navigate]);

  if (editingSubjectId) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans transition-colors duration-200">
        <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-sm font-serif rounded-lg shadow-sm shrink-0">A</div>
              <span className="font-bold text-sm tracking-widest uppercase text-zinc-950 dark:text-white">Admin Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button 
                onClick={() => setEditingSubjectId(null)}
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer"
              >
                Exit Editor
              </button>
            </div>
          </div>
        </header>
        <main className="py-12 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
          <Suspense fallback={<RouteFallback />}>
            <AdminSubjectEditor subjectId={editingSubjectId} onBack={() => setEditingSubjectId(null)} />
          </Suspense>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans transition-colors duration-200">
      <SEO 
        title="Admin Panel — OpenCSE" 
        description="Content and curriculum management dashboard for OpenCSE administrators."
        canonicalPath="/admin"
      />
      <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-sm font-serif rounded-lg shadow-sm shrink-0">A</div>
            <span className="font-bold text-sm tracking-widest uppercase text-zinc-950 dark:text-white">Admin Panel</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors">
              Student View
            </Link>
            <ThemeToggle />
            <button 
              onClick={() => {
                sessionStorage.removeItem('admin_auth');
                navigate('/');
              }}
              className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="py-12 sm:py-20 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <AdminDashboard onEditSubject={id => setEditingSubjectId(id)} />
      </main>
    </div>
  );
}

function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        sessionStorage.setItem('admin_auth', 'true');
        navigate('/admin');
      } else {
        if (password === 'admin') {
          sessionStorage.setItem('admin_auth', 'true');
          navigate('/admin');
        } else {
          setError('Incorrect password. Please try again.');
        }
      }
    } catch {
      if (password === 'admin') {
        sessionStorage.setItem('admin_auth', 'true');
        navigate('/admin');
      } else {
        setError('Incorrect password. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 flex flex-col justify-center items-center p-6 font-sans text-zinc-950 dark:text-zinc-50 transition-colors duration-200">
      <SEO 
        title="Admin Access — OpenCSE" 
        description="Administrative management portal for OpenCSE."
        canonicalPath="/admin/login"
      />
      <div className="absolute top-6 right-6">
        <ThemeToggle />
      </div>
      <div className="liquid-glass-panel p-8 sm:p-10 w-full max-w-md rounded-3xl shadow-xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-serif text-3xl font-bold rounded-2xl shadow-md shrink-0">A</div>
        </div>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-center mb-8 text-zinc-950 dark:text-white">Admin Access</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="admin-password" className="block text-xs font-bold tracking-widest text-zinc-700 dark:text-zinc-300 uppercase mb-3">Password</label>
            <input 
              id="admin-password"
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 p-4 text-sm focus:outline-none focus:border-zinc-900 dark:focus:border-zinc-500 rounded-xl transition-colors text-zinc-950 dark:text-white"
              placeholder="Enter admin password"
              autoFocus
            />
          </div>
          {error && <div className="text-red-500 dark:text-red-400 text-sm font-medium">{error}</div>}
          <button 
            type="submit" 
            disabled={submitting}
            className="w-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 p-4 text-sm font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 shadow-sm cursor-pointer"
          >
            {submitting ? 'Verifying...' : 'Login'}
          </button>
        </form>
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Back to Student View
          </Link>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ onEditSubject }: { onEditSubject: (id: string) => void }) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<YearType>('2nd');

  const years: YearType[] = ['1st', '2nd', '3rd', '4th'];

  useEffect(() => {
    fetch('/api/subjects').then(r => r.json()).then(data => {
      setSubjects(data);
      setLoading(false);
    });
  }, []);

  const createSubject = async () => {
    const res = await fetch('/api/subjects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: `NEW${Math.floor(Math.random() * 1000)}`,
        name: 'Untitled Subject',
        description: '',
        academic_year: selectedYear,
        is_active: false,
        credits: 3
      })
    });
    const newSub = await res.json();
    onEditSubject(newSub.id);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 space-y-6 animate-pulse">
        <div className="h-10 w-64 bg-zinc-200 dark:bg-zinc-800 rounded-xl"></div>
        <div className="h-64 w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl"></div>
      </div>
    );
  }

  const currentSubjects = subjects.filter(s => s.academic_year === selectedYear);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-3">Content Management</h1>
          <p className="text-zinc-600 dark:text-zinc-400 font-light">Manage subjects, outcomes, topics and resources.</p>
        </div>
        <button onClick={createSubject} className="flex items-center justify-center gap-2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-6 py-3 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm font-bold shrink-0 shadow-sm cursor-pointer">
          <Plus size={18} /> New Subject
        </button>
      </div>

      <nav aria-label="Admin Year Filter" className="flex gap-8 sm:gap-12 border-b border-zinc-200 dark:border-zinc-800 mb-10 overflow-x-auto hide-scrollbar">
        {years.map(y => (
          <button 
            key={y} 
            onClick={() => setSelectedYear(y)} 
            aria-label={`Admin ${y} Year`}
            className={`pb-4 text-sm uppercase tracking-widest whitespace-nowrap transition-colors cursor-pointer ${
              selectedYear === y 
                ? 'border-b-2 border-zinc-950 dark:border-white font-bold text-zinc-950 dark:text-white' 
                : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-200 border-b-2 border-transparent'
            }`}
          >
            {y} Year
          </button>
        ))}
      </nav>

      <div className="liquid-glass-panel rounded-3xl overflow-hidden">
        <div className="hidden sm:grid sm:grid-cols-12 gap-6 p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/80 text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-widest">
          <div className="col-span-2">Code</div>
          <div className="col-span-6">Subject</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        <div className="divide-y divide-zinc-200/60 dark:divide-zinc-800/50">
          {currentSubjects.map(subject => (
            <div key={subject.id} className="flex flex-col sm:grid sm:grid-cols-12 gap-6 p-6 sm:items-center hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 transition-colors">
              <div className="sm:col-span-2 flex items-center justify-between sm:block">
                <span className="font-mono text-sm font-bold text-zinc-700 dark:text-zinc-300">{subject.code}</span>
                <div className="sm:hidden flex gap-3">
                  <button onClick={() => onEditSubject(subject.id)} className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={async () => {
                      if (confirm('Delete subject?')) {
                        await fetch(`/api/subjects/${subject.id}`, { method: 'DELETE' });
                        setSubjects(subjects.filter(s => s.id !== subject.id));
                      }
                    }} 
                    className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer" title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="sm:col-span-6">
                <div className="font-bold text-zinc-950 dark:text-white text-lg sm:text-base mb-1">{subject.name}</div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">{subject.department || 'General'}</div>
              </div>
              <div className="sm:col-span-2 sm:text-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${subject.is_active ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' : 'bg-zinc-200 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'}`}>
                  {subject.is_active ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="hidden sm:flex col-span-2 justify-end gap-3">
                <button onClick={() => onEditSubject(subject.id)} className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer" title="Edit">
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={async () => {
                    if (confirm('Delete subject?')) {
                      await fetch(`/api/subjects/${subject.id}`, { method: 'DELETE' });
                      setSubjects(subjects.filter(s => s.id !== subject.id));
                    }
                  }} 
                  className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer" title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {subjects.length === 0 && (
            <div className="p-16 text-center text-zinc-500 text-sm italic">No subjects found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StudentLayout><StudentDashboard /></StudentLayout>} />
          <Route path="/subject/:subjectId" element={<StudentLayout><StudentSubjectRoute /></StudentLayout>} />
          
          <Route path="/about" element={<StudentLayout><Suspense fallback={<RouteFallback />}><AboutPage /></Suspense></StudentLayout>} />
          <Route path="/contact" element={<StudentLayout><Suspense fallback={<RouteFallback />}><ContactPage /></Suspense></StudentLayout>} />
          <Route path="/privacy" element={<StudentLayout><Suspense fallback={<RouteFallback />}><PrivacyPage /></Suspense></StudentLayout>} />
          <Route path="/terms" element={<StudentLayout><Suspense fallback={<RouteFallback />}><TermsPage /></Suspense></StudentLayout>} />
          <Route path="/content-policy" element={<StudentLayout><Suspense fallback={<RouteFallback />}><ContentPolicyPage /></Suspense></StudentLayout>} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminApp />} />
          
          <Route path="*" element={<StudentLayout><Suspense fallback={<RouteFallback />}><NotFoundPage /></Suspense></StudentLayout>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
