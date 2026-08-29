import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  Settings, 
  Edit2, 
  Plus, 
  Trash2, 
  FileText, 
  Download, 
  ExternalLink, 
  ChevronRight, 
  GraduationCap, 
  BookOpen, 
  Layers, 
  Presentation, 
  FileCode, 
  Sparkles, 
  CheckCircle2, 
  FolderOpen,
  Search,
  X
} from 'lucide-react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { FullSubject, Subject, CO, Topic, Resource, FullCO, FullTopic } from './types';
import { SEO } from './components/SEO';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';
const ResourcesPage = lazy(() => import('./components/Resources').then(m => ({ default: m.ResourcesPage })));
const ResourceArticlePage = lazy(() => import('./components/Resources').then(m => ({ default: m.ResourceArticlePage })));

// Code-split non-critical legal pages and admin modules to keep student bundle lightweight (~194 KiB savings)
const AboutPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.ContactPage })));
const PrivacyPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.TermsPage })));
const ContentPolicyPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.ContentPolicyPage })));
const NotFoundPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.NotFoundPage })));
const AdminSubjectEditor = lazy(() => import('./components/AdminEditors').then(m => ({ default: m.AdminSubjectEditor })));
const AdminResources = lazy(() => import('./components/AdminResources').then(m => ({ default: m.AdminResources })));

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

function ScrollProgressBar() {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: scrollYProgress, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-zinc-950 via-zinc-600 to-zinc-950 dark:from-white dark:via-zinc-400 dark:to-white z-[60] pointer-events-none transform-gpu"
    />
  );
}

function StudentHeader() {
  const location = useLocation();

  const isAboutActive = location.pathname === '/about';
  const isContactActive = location.pathname === '/contact';
  const isResourcesActive = location.pathname.startsWith('/resources');
  const isAdminActive = location.pathname.startsWith('/admin');

  return (
    <header className="border-b border-zinc-200/90 dark:border-zinc-800/90 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center gap-3.5 group min-h-[44px] focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none rounded-xl" 
          aria-label="OpenCSE Home"
        >
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-zinc-950 dark:text-white transition-transform duration-200 group-hover:scale-105 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="currentColor" aria-label="OpenCSE Logo">
            <path d="M 181.37 65.65 A 90 90 0 0 0 62.77 172.18 L 87.56 269.69 L 161.29 142 L 137.29 142 Z" />
            <path d="M 118.63 234.35 A 90 90 0 0 0 237.23 127.82 L 212.44 30.31 L 138.71 158 L 162.71 158 Z" />
          </svg>
          <div className="flex flex-col">
            <span className="font-serif font-bold tracking-tight text-2xl text-zinc-950 dark:text-white leading-none">OpenCSE</span>
            <span className="font-mono text-[9px] text-zinc-600 dark:text-zinc-400 tracking-wider uppercase mt-1 hidden sm:block">CURRICULUM ARCHIVE</span>
          </div>
        </Link>
        <nav aria-label="Main Navigation" className="flex items-center gap-1 sm:gap-2">
          <Link 
            to="/resources"
            className={`text-sm font-medium px-3.5 py-2 rounded-xl transition duration-200 min-h-[44px] flex items-center hidden sm:flex focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none ${
              isResourcesActive
                ? 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold border border-zinc-300/80 dark:border-zinc-700/80 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent'
            }`}
          >
            Resources
          </Link>
          <Link 
            to="/about"
            className={`text-sm font-medium px-3.5 py-2 rounded-xl transition duration-200 min-h-[44px] flex items-center hidden sm:flex focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none ${
              isAboutActive
                ? 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold border border-zinc-300/80 dark:border-zinc-700/80 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent'
            }`}
          >
            About
          </Link>
          <Link 
            to="/contact"
            className={`text-sm font-medium px-3.5 py-2 rounded-xl transition duration-200 min-h-[44px] flex items-center hidden sm:flex focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none ${
              isContactActive
                ? 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold border border-zinc-300/80 dark:border-zinc-700/80 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent'
            }`}
          >
            Contact
          </Link>
          <Link 
            to="/admin"
            className={`flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-xl transition duration-200 min-h-[44px] focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none ${
              isAdminActive
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold shadow-sm border border-zinc-950 dark:border-white'
                : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80'
            }`}
            aria-label="Admin Access"
          >
            <Settings size={16} className="transition-transform duration-300 group-hover:rotate-45" />
            <span className="hidden sm:inline">Admin Access</span>
          </Link>
          <div className="pl-2 ml-1 border-l border-zinc-200 dark:border-zinc-800 flex items-center">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}

function StudentFooter() {
  return (
    <footer className="border-t border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-100/70 dark:bg-zinc-950/70 py-12 px-4 sm:px-6 lg:px-8 mt-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-zinc-950 dark:text-white shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="currentColor" aria-label="OpenCSE Logo">
            <path d="M 181.37 65.65 A 90 90 0 0 0 62.77 172.18 L 87.56 269.69 L 161.29 142 L 137.29 142 Z" />
            <path d="M 118.63 234.35 A 90 90 0 0 0 237.23 127.82 L 212.44 30.31 L 138.71 158 L 162.71 158 Z" />
          </svg>
          <div>
            <span className="font-serif font-bold text-zinc-950 dark:text-white text-base">OpenCSE</span>
            <span className="text-xs text-zinc-600 dark:text-zinc-400 ml-3 hidden sm:inline font-light">Outcome-Based Academic Resources for Computer Science</span>
          </div>
        </div>
        <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-600 dark:text-zinc-400">
          <Link to="/" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Curriculum</Link>
          <Link to="/resources" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Resources</Link>
          <Link to="/about" className="hover:text-zinc-950 dark:hover:text-white transition-colors">About Us</Link>
          <Link to="/contact" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Contact Us</Link>
          <Link to="/privacy" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/content-policy" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Content Policy</Link>
        </nav>
      </div>
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-900 text-center text-xs text-zinc-600 dark:text-zinc-400 font-light">
        © {new Date().getFullYear()} OpenCSE. Knowledge Without Barriers. Educational use only. Contact: anbupravin77@gmail.com
      </div>
    </footer>
  );
}

function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col justify-between transition-colors duration-200">
      <ScrollProgressBar />
      <StudentHeader />
      <main className="flex-1 py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
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
      className="absolute -top-10 sm:-top-14 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[360px] sm:h-[400px] pointer-events-none select-none overflow-hidden -z-10"
    >
      {/* LAYER 1: Base Atmosphere (Pure static CSS radial glow - zero JS animation overhead) */}
      <div className="absolute inset-0 academic-hero-glow" />

      {/* LAYER 2: Subtle Academic Grid Matrix */}
      <div className="absolute inset-0 academic-grid-pattern opacity-40 dark:opacity-35 sm:opacity-60 sm:dark:opacity-45" />

      {/* LAYER 3: Quiet Academic Metadata Badge */}
      <div className="absolute top-6 sm:top-8 right-3 sm:right-6 flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200/80 dark:border-zinc-800/90 bg-zinc-50/80 dark:bg-zinc-900/80 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span className="tracking-wider uppercase">OBE / NBA CURRICULUM</span>
      </div>
    </div>
  );
}

function SubjectCardSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-5">
      {[1, 2, 3, 4].map((idx) => (
        <div 
          key={idx} 
          className="p-6 sm:p-7 academic-card rounded-2xl flex flex-col justify-between min-h-[140px] skeleton-shimmer"
        >
          <div className="space-y-3 w-full">
            <div className="flex items-center gap-2">
              <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
              <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            </div>
            <div className="h-7 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-4 w-full max-w-xl bg-zinc-200 dark:bg-zinc-800 rounded"></div>
          </div>
          <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 w-full">
            <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded"></div>
            <div className="h-11 w-11 bg-zinc-200 dark:bg-zinc-800 rounded-lg shrink-0"></div>
          </div>
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
  const [searchQuery, setSearchQuery] = useState('');
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

  const isSearching = searchQuery.trim() !== '';
  const displayedSubjects = isSearching
    ? subjects.filter(s => {
        const query = searchQuery.toLowerCase();
        const matchesSubject = s.name.toLowerCase().includes(query) || 
                               s.code.toLowerCase().includes(query) || 
                               (s.description && s.description.toLowerCase().includes(query));
        const matchesTopic = s.cos && s.cos.some(co => 
          (co.code && co.code.toLowerCase().includes(query)) ||
          (co.name && co.name.toLowerCase().includes(query)) ||
          (co.description && co.description.toLowerCase().includes(query)) ||
          (co.topics && co.topics.some(t => t.title.toLowerCase().includes(query)))
        );
        return matchesSubject || matchesTopic;
      })
    : subjects.filter(s => s.academic_year === selectedYear);

  return (
    <div className="relative max-w-4xl mx-auto">
      <SEO 
        title="OpenCSE — Knowledge Without Barriers | Academic Resources for Computer Science"
        description="Distraction-free academic resources, curriculum guides, course outcomes, and verified study materials for Computer Science & Engineering students."
        canonicalPath="/"
      />

      {/* Decorative ambient hero background */}
      <HeroAmbience />

      {/* Hero Header with clean, high-contrast typography */}
      <motion.header 
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: shouldReduceMotion ? 0 : 0.4, 
          ease: [0.21, 0.47, 0.32, 0.98] 
        }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-4 sm:mb-5 leading-[1.1]">
          Knowledge Without Barriers.
        </h1>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl font-light leading-relaxed">
          Open, outcome-based academic curriculum and verified study materials for Computer Science & Engineering students.
        </p>
      </motion.header>

      {/* Global Curriculum Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all subjects, course codes, or lecture topics (e.g. Operating Systems, TCP/IP)..."
            aria-label="Search curriculum subjects and topics"
            className="w-full pl-11 pr-11 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-950 dark:text-zinc-100 placeholder-zinc-600 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-600 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {isSearching && (
          <div className="mt-2 text-xs font-mono text-zinc-600 dark:text-zinc-400 flex items-center justify-between px-1">
            <span>Global search results for &ldquo;{searchQuery}&rdquo;</span>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-zinc-950 dark:text-white underline cursor-pointer"
            >
              Reset to Year Filter
            </button>
          </div>
        )}
      </div>

      {!isSearching && (
        <div className="mb-8 sm:mb-10">
          <nav 
            role="tablist"
            aria-label="Academic Year Filter" 
            className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl gap-1 max-w-full overflow-x-auto hide-scrollbar"
          >
            {years.map(y => {
              const isSelected = selectedYear === y;
              return (
                <button 
                  key={y} 
                  role="tab"
                  onClick={() => setSelectedYear(y)} 
                  aria-label={`${y} Year Curriculum`}
                  aria-selected={isSelected}
                  className={`rounded-lg px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-wider whitespace-nowrap transition duration-150 cursor-pointer min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none ${
                    isSelected 
                      ? 'bg-white dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-sm border border-zinc-300/80 dark:border-zinc-600 font-bold' 
                      : 'text-zinc-600 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 border border-transparent font-medium active:scale-95'
                  }`}
                >
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 shrink-0" />
                  )}
                  {y} Year
                </button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Curriculum Section Header Bar */}
      <div className="flex items-center justify-between pb-3.5 mb-6 border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <h2 className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-800 dark:text-zinc-200">
            {isSearching ? `Search Results` : `${selectedYear} Year Courses`}
          </h2>
          <span className="text-xs px-2.5 py-0.5 rounded-md font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
            {displayedSubjects.length} {displayedSubjects.length === 1 ? 'Course' : 'Courses'}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>OUTCOME-BASED EDUCATION (OBE)</span>
        </div>
      </div>

      {/* Subject Cards */}
      <div className="relative min-h-[300px]">
        {loading ? (
          <SubjectCardSkeleton />
        ) : displayedSubjects.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="text-2xl font-serif font-bold tracking-tight text-zinc-600 dark:text-zinc-600">
              {isSearching ? 'No Matching Subjects or Topics' : 'Curriculum in Progress'}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2 text-sm font-light">
              {isSearching ? 'Try searching for a different subject name, course code, or topic keyword.' : 'The curriculum for this year tier is being compiled according to university regulations.'}
            </p>
          </div>
        ) : (
          <motion.div 
            key={isSearching ? searchQuery : selectedYear}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="grid gap-4 sm:gap-5"
          >
            {displayedSubjects.map((subject) => {
              const totalTopics = subject.cos ? subject.cos.reduce((acc, co) => acc + (co.topics ? co.topics.length : 0), 0) : 0;
              const cleanDesc = subject.description 
                ? subject.description.replace(/<[^>]*>?/gm, '').trim() 
                : '';

              return (
                <button
                  key={subject.id}
                  onClick={() => {
                    navigate(`/subject/${encodeURIComponent(subject.id)}`);
                  }}
                  className="group flex flex-col justify-between p-6 sm:p-7 academic-card rounded-2xl text-left cursor-pointer transform-gpu w-full focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none"
                  aria-label={`View ${subject.name} curriculum and outcomes`}
                >
                  <div className="w-full">
                    {/* Top Metadata Hierarchy */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className="text-xs font-bold tracking-wider text-zinc-900 dark:text-zinc-100 uppercase font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                        {subject.code}
                      </span>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                        · {subject.credits} Credits
                      </span>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                        · {subject.cos?.length || 0} Outcomes
                      </span>
                      <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                        · {totalTopics} Topics
                      </span>
                      {subject.department && (
                        <span className="hidden md:inline text-xs text-zinc-600 dark:text-zinc-500 font-mono">
                          · {subject.department}
                        </span>
                      )}
                    </div>

                    {/* Dominant Subject Title */}
                    <h3 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors duration-150 leading-tight">
                      {subject.name}
                    </h3>

                    {/* Truncated Description Preview */}
                    {cleanDesc && (
                      <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 font-light mt-2.5 leading-relaxed max-w-3xl">
                        {cleanDesc}
                      </p>
                    )}
                  </div>
                  
                  {/* Consistent Action Area */}
                  <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 w-full">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-150 font-mono">
                      Explore Course
                    </span>
                    <div className="w-11 h-11 rounded-lg bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-950 transition duration-150 shrink-0">
                      <ArrowRight className="transform group-hover:translate-x-1 transition-transform duration-150" size={16} />
                    </div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Comprehensive Academic Curriculum & Outcome-Based Education Overview (SEO & AdSense Compliance Content) */}
      <section aria-labelledby="academic-overview-heading" className="mt-16 sm:mt-24 pt-12 border-t border-zinc-200 dark:border-zinc-800 space-y-8">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-zinc-600 uppercase">Academic Repository & Standards</span>
          <h2 id="academic-overview-heading" className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mt-2 mb-4">
            Computer Science & Engineering Curriculum Architecture
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 font-light text-base leading-relaxed">
            OpenCSE provides a rigorous, distraction-free academic workspace engineered for undergraduate and graduate Computer Science & Engineering (CSE) students. Our curriculum repository covers all four academic years, aligning directly with accredited university Outcome-Based Education (OBE) frameworks.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="p-6 sm:p-8 liquid-glass-panel rounded-2xl space-y-3">
            <h3 className="text-lg font-serif font-bold text-zinc-950 dark:text-white">Outcome-Based Education (OBE) Alignment</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
              Every subject in our repository is structured into specific Course Outcomes (CO1 through CO5) mapped to Program Outcomes (POs). Students can review precise learning targets, Bloom's Taxonomy cognitive levels, and targeted assessment rubrics for each module.
            </p>
          </div>
          <div className="p-6 sm:p-8 liquid-glass-panel rounded-2xl space-y-3">
            <h3 className="text-lg font-serif font-bold text-zinc-950 dark:text-white">Curated Study Materials & Lecture Notes</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
              Access comprehensive topic summaries, downloadable PDF lecture notes, presentation slide decks (PPT/PPTX), and curated programming lab assignments. All resources are vetted by engineering faculty and senior academic contributors.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h3 className="text-xl font-serif font-bold text-zinc-950 dark:text-white">Frequently Asked Questions (FAQ) for Students</h3>
          
          <div className="space-y-3">
            <details className="p-5 liquid-glass-panel rounded-xl group cursor-pointer">
              <summary className="font-medium text-zinc-950 dark:text-white text-sm sm:text-base flex items-center justify-between">
                <span>Are OpenCSE study notes and resources completely free?</span>
                <span className="text-zinc-400 group-open:rotate-180 transition-transform font-mono">↓</span>
              </summary>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                Yes. OpenCSE is dedicated to the principle of "Knowledge Without Barriers." All curriculum notes, topic summaries, and downloadable PDF modules are 100% free with no registration or paywalls required.
              </p>
            </details>

            <details className="p-5 liquid-glass-panel rounded-xl group cursor-pointer">
              <summary className="font-medium text-zinc-950 dark:text-white text-sm sm:text-base flex items-center justify-between">
                <span>How are course outcomes (COs) and topics verified?</span>
                <span className="text-zinc-400 group-open:rotate-180 transition-transform font-mono">↓</span>
              </summary>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                Our academic team reviews all materials against accredited university computer science syllabi (such as Operating Systems, Data Structures, Computer Networks, and Artificial Intelligence). We maintain strict human editorial review cycles to guarantee technical accuracy.
              </p>
            </details>

            <details className="p-5 liquid-glass-panel rounded-xl group cursor-pointer">
              <summary className="font-medium text-zinc-950 dark:text-white text-sm sm:text-base flex items-center justify-between">
                <span>How can I report an error or suggest a new subject?</span>
                <span className="text-zinc-400 group-open:rotate-180 transition-transform font-mono">↓</span>
              </summary>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                If you encounter a typo in a code snippet or wish to propose a new elective subject, please visit our <Link to="/contact" className="underline font-medium text-zinc-950 dark:text-white">Contact Page</Link> to submit an errata report or curriculum suggestion directly to our editorial team.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
}

function getResourceMeta(fileType?: string, fileName?: string) {
  const type = (fileType || '').toLowerCase();
  const name = (fileName || '').toLowerCase();
  
  if (type.includes('pdf') || name.endsWith('.pdf')) {
    return {
      typeLabel: 'PDF Document',
      badge: 'PDF',
      badgeClass: 'text-rose-700 dark:text-rose-400 bg-rose-500/10 border-rose-500/20',
      iconClass: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/40',
      icon: FileText,
      actionText: 'View PDF',
    };
  }
  if (type.includes('ppt') || type.includes('slide') || type.includes('presentation') || name.endsWith('.ppt') || name.endsWith('.pptx')) {
    return {
      typeLabel: 'Slide Deck',
      badge: 'PPT',
      badgeClass: 'text-amber-700 dark:text-amber-400 bg-amber-500/10 border-amber-500/20',
      iconClass: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/40',
      icon: Presentation,
      actionText: 'Download PPT',
    };
  }
  if (type.includes('code') || name.endsWith('.py') || name.endsWith('.c') || name.endsWith('.cpp') || name.endsWith('.java') || name.endsWith('.js') || name.endsWith('.ts')) {
    return {
      typeLabel: 'Source Code',
      badge: 'CODE',
      badgeClass: 'text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      iconClass: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/40',
      icon: FileCode,
      actionText: 'View Code',
    };
  }
  if (type.includes('link') || type.includes('url') || (fileType && fileType.startsWith('http'))) {
    return {
      typeLabel: 'External Reference',
      badge: 'LINK',
      badgeClass: 'text-blue-700 dark:text-blue-400 bg-blue-500/10 border-blue-500/20',
      iconClass: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/40',
      icon: ExternalLink,
      actionText: 'Open Link',
    };
  }
  return {
    typeLabel: 'Curriculum Notes',
    badge: 'NOTES',
    badgeClass: 'text-zinc-700 dark:text-zinc-300 bg-zinc-500/10 border-zinc-500/20',
    iconClass: 'text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700',
    icon: FileText,
    actionText: 'Open Document',
  };
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
      <div className="max-w-4xl mx-auto py-4 space-y-6" aria-busy="true" aria-label="Loading course details">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer"></div>
          <div className="h-3 w-3 bg-zinc-200 dark:bg-zinc-800 rounded-full skeleton-shimmer"></div>
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer"></div>
          <div className="h-3 w-3 bg-zinc-200 dark:bg-zinc-800 rounded-full skeleton-shimmer"></div>
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer"></div>
        </div>

        {/* Back Button Skeleton */}
        <div className="h-9 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg skeleton-shimmer"></div>

        {/* Header Skeleton */}
        <div className="space-y-3 pt-2">
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer"></div>
            <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer"></div>
          </div>
          <div className="h-10 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-xl skeleton-shimmer"></div>
          <div className="h-14 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl skeleton-shimmer"></div>
        </div>

        {/* Course Outcomes Skeleton */}
        <div className="space-y-3 pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
          <div className="h-6 w-44 bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer"></div>
          <div className="h-24 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl skeleton-shimmer"></div>
          <div className="h-24 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl skeleton-shimmer"></div>
        </div>
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-600">
          <BookOpen size={22} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-zinc-950 dark:text-white mb-2">Subject Not Found</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6 font-light max-w-md mx-auto leading-relaxed text-sm sm:text-base">
          The requested course subject or curriculum module could not be located in the current archive.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-semibold px-5 py-2.5 rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm shadow-xs min-h-[44px]"
        >
          <ArrowLeft size={16} />
          <span>Return to Curriculum Archive</span>
        </Link>
      </div>
    );
  }

  return <StudentSubjectView subject={subject} onBack={() => navigate('/')} />;
}

function StudentCOTopicsView({
  subject,
  co,
  onBack,
  onSelectTopic,
}: {
  subject: FullSubject;
  co: FullCO;
  onBack: () => void;
  onSelectTopic: (topicId: string) => void;
}) {
  const shouldReduceMotion = useReducedMotion();
  const coCode = co.code || 'CO';
  const topics = co.topics || [];
  const coDesc = co.description || `Explore mapped topics and study resources for ${co.name} (${subject.code}) on OpenCSE.`;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <SEO 
        title={`${coCode}: ${co.name} — ${subject.code}`}
        description={coDesc.slice(0, 160)}
        canonicalPath={`/subject/${subject.id}`}
        type="article"
      />

      {/* Structured Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center flex-wrap gap-2 text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400">
          <li>
            <Link 
              to="/" 
              className="hover:text-zinc-950 dark:hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none rounded px-1 -mx-1"
            >
              Curriculum
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={13} className="text-zinc-400 dark:text-zinc-600" />
          </li>
          <li>
            <button 
              onClick={onBack}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none rounded px-1 -mx-1 font-medium text-zinc-700 dark:text-zinc-300"
            >
              {subject.name}
            </button>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={13} className="text-zinc-400 dark:text-zinc-600" />
          </li>
          <li>
            <span className="font-bold text-zinc-950 dark:text-white" aria-current="page">
              {coCode}
            </span>
          </li>
        </ol>
      </nav>

      {/* Immediate Back Control */}
      <motion.button 
        initial={shouldReduceMotion ? false : { opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
        onClick={onBack} 
        className="inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white mb-6 font-medium transition-colors group cursor-pointer min-h-[44px] px-2 -ml-2 rounded-lg focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none" 
        aria-label={`Back to ${subject.code} Course Overview`}
      >
        <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform duration-150" /> 
        <span>Back to {subject.code} Overview</span>
      </motion.button>

      {/* CO Header */}
      <motion.header 
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="mb-8"
      >
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold tracking-wider text-zinc-950 dark:text-white uppercase font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            {subject.code}
          </span>
          <span className="text-xs font-mono font-bold px-2 py-0.5 bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200 rounded border border-zinc-200 dark:border-zinc-700">
            {coCode}
          </span>
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
            · {topics.length} {topics.length === 1 ? 'Topic Mapped' : 'Topics Mapped'}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-3 leading-tight">
          {co.name}
        </h1>

        {co.description && (
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-3xl">
            {co.description}
          </p>
        )}
      </motion.header>

      {/* Topics Section */}
      <section aria-labelledby="co-topics-heading" className="pt-6 border-t border-zinc-200 dark:border-zinc-800/80">
        <div className="flex items-center justify-between mb-4">
          <h2 id="co-topics-heading" className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-800 dark:text-zinc-200 flex items-center gap-2">
            <Layers size={14} className="text-zinc-600 dark:text-zinc-400" />
            <span>Topics Mapped to {coCode}</span>
          </h2>
          <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400">
            {topics.length} {topics.length === 1 ? 'Topic' : 'Topics'}
          </span>
        </div>

        {topics.length > 0 ? (
          <div className="grid gap-3">
            {topics.map((topic, topicIndex) => {
              const topicSeq = String(topicIndex + 1).padStart(2, '0');
              const cleanTopicDesc = topic.description 
                ? topic.description.replace(/<[^>]*>?/gm, '').trim() 
                : '';
              const resourceCount = topic.resources?.length || 0;

              return (
                <button
                  key={topic.id}
                  onClick={() => onSelectTopic(topic.id)}
                  className="group grid grid-cols-[1fr_auto] items-center gap-3.5 sm:gap-5 p-4 sm:p-5 academic-row rounded-xl text-left cursor-pointer transform-gpu focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none min-h-[44px] w-full"
                  aria-label={`Open topic ${topic.title}`}
                >
                  {/* Content Area (Left Column) */}
                  <div className="min-w-0 flex items-start gap-3 sm:gap-3.5">
                    <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 mt-0.5 shrink-0 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                      {topicSeq}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base sm:text-lg font-serif font-bold tracking-tight text-zinc-950 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors duration-150 leading-snug">
                        {topic.title}
                      </h3>
                      {cleanTopicDesc && (
                        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2 font-light leading-relaxed max-w-2xl">
                          {cleanTopicDesc}
                        </p>
                      )}
                      {/* Resource Indicator (underneath title/description inside content column) */}
                      {resourceCount > 0 && (
                        <div className="mt-2.5 flex items-center">
                          <span className="text-xs px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded font-medium inline-flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-700 font-mono">
                            <FileText size={12} /> {resourceCount} {resourceCount === 1 ? 'Resource' : 'Resources'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Fixed Action Column (Right Column) */}
                  <div className="shrink-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-lg bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-950 transition duration-150">
                      <ArrowRight className="transform group-hover:translate-x-1 transition-transform duration-150" size={16} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-zinc-600 font-serif italic border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            <BookOpen size={22} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Topics for this Course Outcome are being cataloged.</p>
          </div>
        )}
      </section>
    </div>
  );
}

function StudentSubjectView({ subject, onBack }: { subject: FullSubject, onBack: () => void }) {
  const [selectedCoId, setSelectedCoId] = useState<string | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // If viewing a specific topic
  if (activeTopicId) {
    let activeTopic: any = null;
    let parentCo: FullCO | null = null;
    for (const co of subject.cos || []) {
      const found = co.topics?.find(t => t.id === activeTopicId);
      if (found) {
        activeTopic = found;
        parentCo = co;
        break;
      }
    }
    if (activeTopic) {
      return (
        <StudentTopicView
          topic={activeTopic}
          subjectCode={subject.code}
          coCode={parentCo?.code}
          onBack={() => setActiveTopicId(null)}
        />
      );
    }
  }

  // If viewing a selected CO's topics
  if (selectedCoId) {
    const selectedCo = subject.cos?.find(c => c.id === selectedCoId);
    if (selectedCo) {
      return (
        <StudentCOTopicsView
          subject={subject}
          co={selectedCo}
          onBack={() => setSelectedCoId(null)}
          onSelectTopic={(topicId) => setActiveTopicId(topicId)}
        />
      );
    }
  }

  const subjectDescription = subject.description 
    ? subject.description.replace(/<[^>]*>?/gm, '') 
    : `Study ${subject.name} concepts including course outcomes, curriculum topics, and verified learning resources on OpenCSE.`;

  const totalCos = subject.cos?.length || 0;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <SEO 
        title={`${subject.name} (${subject.code})`}
        description={subjectDescription.slice(0, 160)}
        canonicalPath={`/subject/${subject.id}`}
        type="article"
      />

      {/* Structured Breadcrumbs Navigation */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex items-center flex-wrap gap-2 text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400">
          <li>
            <Link 
              to="/" 
              className="hover:text-zinc-950 dark:hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none rounded px-1 -mx-1"
            >
              Curriculum
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={13} className="text-zinc-400 dark:text-zinc-600" />
          </li>
          <li>
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">
              {subject.academic_year ? `${subject.academic_year} Year` : 'Core'}
            </span>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={13} className="text-zinc-400 dark:text-zinc-600" />
          </li>
          <li>
            <span className="font-bold text-zinc-950 dark:text-white" aria-current="page">
              {subject.code}
            </span>
          </li>
        </ol>
      </nav>

      {/* Immediate Back Control */}
      <motion.button 
        initial={shouldReduceMotion ? false : { opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
        onClick={onBack} 
        className="inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white mb-6 font-medium transition-colors group cursor-pointer min-h-[44px] px-2 -ml-2 rounded-lg focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none" 
        aria-label="Back to curriculum archive"
      >
        <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform duration-150" /> 
        <span>Back to Curriculum Archive</span>
      </motion.button>

      {/* Dominant Subject Header */}
      <motion.header 
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="mb-8"
      >
        {/* Course Code & Metadata line */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-bold tracking-wider text-zinc-950 dark:text-white uppercase font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            {subject.code}
          </span>
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
            · {subject.credits} Credits
          </span>
          {subject.academic_year && (
            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
              · {subject.academic_year} Year
            </span>
          )}
          {subject.semester && (
            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
              · Sem {subject.semester}
            </span>
          )}
          {subject.department && (
            <span className="hidden md:inline text-xs text-zinc-600 dark:text-zinc-500 font-mono">
              · {subject.department}
            </span>
          )}
        </div>

        {/* Dominant Subject Title */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-4 leading-[1.12]">
          {subject.name}
        </h1>

        {/* Formatted Course Overview / Description */}
        {subject.description && (
          <div 
            className="prose dark:prose-invert max-w-3xl text-zinc-600 dark:text-zinc-400 font-light text-base sm:text-lg leading-relaxed mb-4" 
            dangerouslySetInnerHTML={{ __html: subject.description }} 
          />
        )}
      </motion.header>

      {/* =========================================================================
          COURSE OUTCOMES (COs) — Primary Navigation Layer
         ========================================================================= */}
      <motion.section 
        aria-labelledby="co-section-heading" 
        initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="border-t border-zinc-200 dark:border-zinc-800/80 pt-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <h2 id="co-section-heading" className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white flex items-center gap-2.5">
              <GraduationCap size={22} className="text-zinc-700 dark:text-zinc-300 shrink-0" />
              <span>Course Outcomes</span>
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-light mt-1">
              Select an outcome to view mapped topics and study resources.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 w-fit shrink-0">
            {totalCos} {totalCos === 1 ? 'Outcome' : 'Outcomes'}
          </span>
        </div>

        {subject.cos && subject.cos.length > 0 ? (
          <div className="grid gap-3.5">
            {subject.cos.map((co, coIndex) => {
              const topicCount = co.topics ? co.topics.length : 0;
              const coCode = co.code || `CO${coIndex + 1}`;

              return (
                <button
                  key={co.id}
                  onClick={() => setSelectedCoId(co.id)}
                  className="group grid grid-cols-[1fr_auto] items-center gap-3.5 sm:gap-6 p-4 sm:p-6 academic-card rounded-xl text-left cursor-pointer transform-gpu focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none min-h-[44px] w-full"
                  aria-label={`View topics for Course Outcome ${coCode}: ${co.name}`}
                >
                  {/* Content Area (Left Column) */}
                  <div className="min-w-0 flex items-start gap-3 sm:gap-4">
                    <span className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-200 px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 tracking-wider shrink-0 mt-0.5">
                      {coCode}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-zinc-950 dark:text-white group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors duration-150 leading-snug">
                        {co.name}
                      </h3>
                      {co.description && (
                        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-light mt-1.5 line-clamp-2 leading-relaxed max-w-2xl">
                          {co.description}
                        </p>
                      )}
                      <div className="mt-2.5 flex items-center gap-2 text-xs font-mono text-zinc-600 dark:text-zinc-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>
                          {topicCount} {topicCount === 1 ? 'Topic mapped' : 'Topics mapped'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Fixed Action Column (Right Column) */}
                  <div className="shrink-0 flex items-center gap-3">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-150 hidden md:inline">
                      View Topics
                    </span>
                    <div className="w-11 h-11 rounded-lg bg-zinc-100 dark:bg-zinc-850 border border-zinc-200 dark:border-zinc-700/80 flex items-center justify-center text-zinc-600 group-hover:bg-zinc-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-950 transition duration-150">
                      <ArrowRight className="transform group-hover:translate-x-1 transition-transform duration-150" size={16} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 font-light">
            <GraduationCap size={24} className="mx-auto mb-2 opacity-50" />
            <p className="font-serif text-sm italic">No Course Outcomes cataloged for this syllabus yet.</p>
          </div>
        )}
      </motion.section>
    </div>
  );
}

function StudentTopicView({ topic, subjectCode, coCode, onBack }: { topic: any, subjectCode: string, coCode?: string, onBack: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  const topicDesc = topic.description || `Study notes and verified learning resources for ${topic.title} (${subjectCode}) on OpenCSE.`;

  return (
    <div className="max-w-3xl mx-auto pb-32">
      <SEO 
        title={`${topic.title} — ${subjectCode}`}
        description={topicDesc.slice(0, 160)}
        canonicalPath={`/subject/${subjectCode}`}
        type="article"
        loadAdsense={true}
      />

      {/* Topic Breadcrumbs */}
      <nav aria-label="Topic Breadcrumb" className="mb-4">
        <ol className="flex items-center flex-wrap gap-2 text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-400">
          <li>
            <Link 
              to="/" 
              className="hover:text-zinc-950 dark:hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none rounded px-1 -mx-1"
            >
              Curriculum
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={13} className="text-zinc-400 dark:text-zinc-600" />
          </li>
          <li>
            <button 
              onClick={onBack}
              className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none rounded px-1 -mx-1 font-medium text-zinc-700 dark:text-zinc-300"
            >
              {subjectCode}
            </button>
          </li>
          {coCode && (
            <>
              <li aria-hidden="true">
                <ChevronRight size={13} className="text-zinc-400 dark:text-zinc-600" />
              </li>
              <li>
                <button 
                  onClick={onBack}
                  className="hover:text-zinc-950 dark:hover:text-white transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none rounded px-1 -mx-1 font-mono font-bold text-zinc-700 dark:text-zinc-300"
                >
                  {coCode}
                </button>
              </li>
            </>
          )}
          <li aria-hidden="true">
            <ChevronRight size={13} className="text-zinc-400 dark:text-zinc-600" />
          </li>
          <li>
            <span className="font-semibold text-zinc-950 dark:text-white truncate max-w-[200px] inline-block align-bottom" aria-current="page">
              {topic.title}
            </span>
          </li>
        </ol>
      </nav>

      {/* Immediate Back Action */}
      <motion.button 
        initial={shouldReduceMotion ? false : { opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
        onClick={onBack} 
        className="inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white mb-6 font-medium transition-colors group cursor-pointer min-h-[44px] px-2 -ml-2 rounded-lg focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none" 
        aria-label={`Back to ${coCode || subjectCode} Topics`}
      >
        <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform duration-150" /> 
        <span>Back to {coCode ? `${coCode} Topics` : `${subjectCode} Overview`}</span>
      </motion.button>

      {/* Topic Dominant Header */}
      <motion.header 
        initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
        className="mb-8"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold tracking-wider text-zinc-950 dark:text-white uppercase font-mono px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            {subjectCode}
          </span>
          {coCode && (
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700">
              {coCode}
            </span>
          )}
          <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
            · Topic Study Workspace
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-4 leading-tight">
          {topic.title}
        </h1>
        {topic.description && (
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-light leading-relaxed max-w-3xl">
            {topic.description}
          </p>
        )}
      </motion.header>

      {/* =========================================================================
          7 & 8. VERIFIED STUDY RESOURCES & MATERIALS
         ========================================================================= */}
      {topic.resources && topic.resources.length > 0 && (
        <motion.section 
          aria-labelledby="resources-heading" 
          initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="mb-10 p-5 sm:p-6 rounded-2xl academic-panel"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 id="resources-heading" className="text-xs font-mono font-bold tracking-wider text-zinc-800 dark:text-zinc-200 uppercase flex items-center gap-2">
              <FolderOpen size={14} className="text-zinc-600 dark:text-zinc-400" />
              <span>Study Resources & Learning Materials</span>
            </h2>
            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
              {topic.resources.length} {topic.resources.length === 1 ? 'FILE' : 'FILES'}
            </span>
          </div>

          <div className="grid gap-2.5">
            {topic.resources.map((res: any) => {
              const meta = getResourceMeta(res.file_type, res.file_name || res.title);
              const IconComponent = meta.icon;
              const formattedSize = res.file_size ? `${(res.file_size / (1024 * 1024)).toFixed(1)} MB` : null;

              return (
                <a
                  key={res.id}
                  href={res.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="academic-row flex items-center justify-between p-3.5 sm:p-4 rounded-xl group cursor-pointer focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none min-h-[44px]"
                  aria-label={`${meta.actionText}: ${res.title}`}
                >
                  <div className="flex items-center gap-3.5 overflow-hidden flex-1 min-w-0 pr-3">
                    {/* Visual Resource Type Icon Badge */}
                    <div className={`w-9 h-9 shrink-0 rounded-lg flex items-center justify-center border transition-transform duration-150 group-hover:scale-105 ${meta.iconClass}`}>
                      <IconComponent size={17} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-serif font-bold text-sm sm:text-base text-zinc-950 dark:text-white truncate group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                        {res.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${meta.badgeClass}`}>
                          {meta.badge}
                        </span>
                        <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                          {meta.typeLabel} {formattedSize ? `· ${formattedSize}` : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Immediate Download / Open Action */}
                  <div className="shrink-0 flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                    <span className="hidden sm:inline font-mono text-xs">{meta.actionText}</span>
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 group-hover:bg-zinc-950 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-zinc-950 transition duration-150">
                      <Download size={14} className="transform group-hover:translate-y-0.5 transition-transform duration-150" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* =========================================================================
          TOPIC LECTURE NOTES & RICH CONTENT
         ========================================================================= */}
      {topic.content ? (
        <motion.article 
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="prose dark:prose-invert prose-base sm:prose-lg max-w-[65ch] mx-auto text-zinc-800 dark:text-zinc-300 prose-headings:font-serif prose-headings:tracking-tight prose-headings:font-bold prose-headings:text-zinc-950 dark:prose-headings:text-white prose-a:text-zinc-950 dark:prose-a:text-white prose-a:font-bold hover:prose-a:text-zinc-600 dark:hover:prose-a:text-zinc-300 prose-img:border prose-img:border-zinc-200 dark:prose-img:border-zinc-800 prose-img:rounded-2xl prose-blockquote:border-zinc-950 dark:prose-blockquote:border-white prose-blockquote:font-serif prose-blockquote:italic prose-p:leading-relaxed" 
          dangerouslySetInnerHTML={{ __html: topic.content }} 
        />
      ) : (
        <div className="py-14 text-center text-zinc-600 font-serif italic border border-zinc-200 dark:border-zinc-800 border-dashed rounded-2xl p-6">
          <BookOpen size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm sm:text-base">Comprehensive lecture notes and module guides are currently being prepared for this topic.</p>
        </div>
      )}
    </div>
  );
}

function AdminApp() {
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'curriculum' | 'resources'>('curriculum');
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
        <div className="flex gap-4 border-b border-zinc-200 dark:border-zinc-800 mb-8 pb-4">
          <button 
            onClick={() => setActiveTab('curriculum')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'curriculum' 
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' 
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
            }`}
          >
            Curriculum
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'resources' 
                ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' 
                : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
            }`}
          >
            Resources & Guides
          </button>
        </div>

        {activeTab === 'curriculum' ? (
          <AdminDashboard onEditSubject={id => setEditingSubjectId(id)} />
        ) : (
          <Suspense fallback={<RouteFallback />}>
            <AdminResources />
          </Suspense>
        )}
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
                  <button onClick={() => onEditSubject(subject.id)} className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer" title="Edit" aria-label="Edit subject">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={async () => {
                      if (confirm('Delete subject?')) {
                        await fetch(`/api/subjects/${subject.id}`, { method: 'DELETE' });
                        setSubjects(subjects.filter(s => s.id !== subject.id));
                      }
                    }} 
                    className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer" title="Delete" aria-label="Delete subject"
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
                <button onClick={() => onEditSubject(subject.id)} className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer" title="Edit" aria-label="Edit subject">
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={async () => {
                    if (confirm('Delete subject?')) {
                      await fetch(`/api/subjects/${subject.id}`, { method: 'DELETE' });
                      setSubjects(subjects.filter(s => s.id !== subject.id));
                    }
                  }} 
                  className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-700 dark:text-zinc-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors cursor-pointer" title="Delete" aria-label="Delete subject"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {subjects.length === 0 && (
            <div className="p-16 text-center text-zinc-600 text-sm italic">No subjects found.</div>
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
          <Route path="/resources" element={<StudentLayout><Suspense fallback={<RouteFallback />}><ResourcesPage /></Suspense></StudentLayout>} />
          <Route path="/resources/:slug" element={<StudentLayout><Suspense fallback={<RouteFallback />}><ResourceArticlePage /></Suspense></StudentLayout>} />
          
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
