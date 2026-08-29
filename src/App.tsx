import React, { useState, useEffect, Suspense, lazy, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ArrowRight, 
  Settings, 
  Search, 
  X, 
  ArrowLeft 
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { FullSubject, YearType } from './types';
import { SEO } from './components/SEO';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';

// Code-split route chunks for ultra-fast First Contentful Paint (FCP) and Largest Contentful Paint (LCP)
const StudentSubjectRoute = lazy(() => import('./components/StudentSubjectViewer'));
const ResourcesPage = lazy(() => import('./components/Resources').then(m => ({ default: m.ResourcesPage })));
const ResourceArticlePage = lazy(() => import('./components/Resources').then(m => ({ default: m.ResourceArticlePage })));
const AboutPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.ContactPage })));
const PrivacyPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.PrivacyPage })));
const TermsPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.TermsPage })));
const ContentPolicyPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.ContentPolicyPage })));
const DisclaimerPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.DisclaimerPage })));
const SitemapPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.SitemapPage })));
const NotFoundPage = lazy(() => import('./components/LegalPages').then(m => ({ default: m.NotFoundPage })));

// AdSense Approval Checker & Diagnostic Tools
const WebsiteAnalyzerPage = lazy(() => import('./components/AdSenseTools').then(m => ({ default: m.WebsiteAnalyzerPage })));
const EligibilityChecklistPage = lazy(() => import('./components/AdSenseTools').then(m => ({ default: m.EligibilityChecklistPage })));
const RevenueCalculatorPage = lazy(() => import('./components/AdSenseTools').then(m => ({ default: m.RevenueCalculatorPage })));
const PolicyGeneratorPage = lazy(() => import('./components/AdSenseTools').then(m => ({ default: m.PolicyGeneratorPage })));
const SeoChecklistPage = lazy(() => import('./components/AdSenseTools').then(m => ({ default: m.SeoChecklistPage })));
const HowToGetApprovedPage = lazy(() => import('./components/AdSenseTools').then(m => ({ default: m.HowToGetApprovedPage })));
const RejectionReasonsPage = lazy(() => import('./components/AdSenseTools').then(m => ({ default: m.RejectionReasonsPage })));
const TipsAndTricksPage = lazy(() => import('./components/AdSenseTools').then(m => ({ default: m.TipsAndTricksPage })));
const PolicyChecklistPage = lazy(() => import('./components/AdSenseTools').then(m => ({ default: m.PolicyChecklistPage })));
const FAQPage = lazy(() => import('./components/AdSenseTools').then(m => ({ default: m.FAQPage })));

const AdminLogin = lazy(() => import('./components/AdminApp').then(m => ({ default: m.AdminLogin })));
const AdminApp = lazy(() => import('./components/AdminApp'));

function RouteFallback() {
  return (
    <div className="max-w-4xl mx-auto py-12 space-y-6" aria-busy="true" aria-label="Loading page content">
      <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-xl skeleton-shimmer"></div>
      <div className="h-12 w-full max-w-lg bg-zinc-200 dark:bg-zinc-800 rounded-2xl skeleton-shimmer"></div>
      <div className="space-y-4 pt-4">
        <div className="h-28 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl skeleton-shimmer"></div>
        <div className="h-28 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl skeleton-shimmer"></div>
      </div>
    </div>
  );
}

// Zero-reflow, high-performance scroll progress bar using passive rAF
function ScrollProgressBar() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const updateProgress = () => {
      if (!barRef.current) return;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const progress = total > 0 ? window.scrollY / total : 0;
      barRef.current.style.transform = `scaleX(${progress})`;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-zinc-950 via-zinc-600 to-zinc-950 dark:from-white dark:via-zinc-400 dark:to-white z-[60] pointer-events-none origin-left transform-gpu will-change-transform"
      style={{ transform: 'scaleX(0)' }}
    />
  );
}

function StudentHeader() {
  const location = useLocation();

  const isAboutActive = location.pathname === '/about';
  const isContactActive = location.pathname === '/contact';
  const isResourcesActive = location.pathname.startsWith('/resources');
  const isAnalyzerActive = location.pathname === '/analyzer' || location.pathname === '/checker';
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
            to="/analyzer"
            className={`text-sm font-medium px-3.5 py-2 rounded-xl transition duration-200 min-h-[44px] flex items-center hidden md:flex focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none ${
              isAnalyzerActive
                ? 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-950 dark:text-white font-semibold border border-zinc-300/80 dark:border-zinc-700/80 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 shrink-0"></span>
            Analyzer
          </Link>
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
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-600 dark:text-zinc-400 text-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Academic Curriculum */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-zinc-950 dark:text-white shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="currentColor">
                <path d="M 181.37 65.65 A 90 90 0 0 0 62.77 172.18 L 87.56 269.69 L 161.29 142 L 137.29 142 Z" />
                <path d="M 118.63 234.35 A 90 90 0 0 0 237.23 127.82 L 212.44 30.31 L 138.71 158 L 162.71 158 Z" />
              </svg>
              <span className="font-serif font-bold text-lg text-zinc-950 dark:text-white">OpenCSE</span>
            </div>
            <p className="font-light text-zinc-600 dark:text-zinc-400 leading-relaxed text-xs">
              Distraction-free academic resources, curriculum guides, course outcomes (CO1-CO5), and verified study materials.
            </p>
            <ul className="space-y-2 pt-1 font-medium">
              <li>
                <Link to="/" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Curriculum Archive</Link>
              </li>
              <li>
                <Link to="/resources" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Academic Resource Hub</Link>
              </li>
              <li>
                <Link to="/sitemap" className="hover:text-zinc-950 dark:hover:text-white transition-colors">HTML Directory Sitemap</Link>
              </li>
            </ul>
          </div>

          {/* Column 2: AdSense Diagnostic Tools */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white block">
              AdSense Diagnostic Tools
            </span>
            <ul className="space-y-2.5">
              <li>
                <Link to="/analyzer" className="hover:text-zinc-950 dark:hover:text-white transition-colors font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  54-Point Website Analyzer
                </Link>
              </li>
              <li>
                <Link to="/checklist" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Eligibility Checklist</Link>
              </li>
              <li>
                <Link to="/calculator" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Revenue Calculator</Link>
              </li>
              <li>
                <Link to="/policy-generator" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Privacy Policy Generator</Link>
              </li>
              <li>
                <Link to="/seo-checklist" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Technical SEO Checklist</Link>
              </li>
              <li>
                <Link to="/policy-checklist" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Publisher Policy Guide</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Publisher Guides & Knowledge Base */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white block">
              Publisher Knowledge Base
            </span>
            <ul className="space-y-2.5">
              <li>
                <Link to="/how-to-get-approved" className="hover:text-zinc-950 dark:hover:text-white transition-colors">How to Get Approved</Link>
              </li>
              <li>
                <Link to="/rejection-reasons" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Top Rejection Reasons</Link>
              </li>
              <li>
                <Link to="/tips-and-tricks" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Approval Tips & Best Practices</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Frequently Asked Questions</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Compliance */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-950 dark:text-white block">
              Legal, Trust & Admin
            </span>
            <ul className="space-y-2.5">
              <li>
                <Link to="/about" className="hover:text-zinc-950 dark:hover:text-white transition-colors">About OpenCSE</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Contact & Feedback</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Disclaimer & Notice</Link>
              </li>
              <li>
                <Link to="/content-policy" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Content & DMCA Policy</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-zinc-950 dark:hover:text-white transition-colors font-medium">Admin Portal</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
          <p>© {new Date().getFullYear()} OpenCSE. Dedicated to knowledge without barriers.</p>
          <div className="flex items-center gap-6">
            <span>54-Point Diagnostic Engine</span>
            <span>Outcome-Based Education</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 font-sans flex flex-col justify-between selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 transition-colors duration-200">
      <ScrollProgressBar />
      <StudentHeader />
      <main className="py-8 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-1">
        {children}
      </main>
      <StudentFooter />
    </div>
  );
}

function HeroAmbience() {
  return (
    <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-full max-w-5xl h-64 sm:h-80 pointer-events-none overflow-hidden select-none -z-10" aria-hidden="true">
      <div className="absolute inset-0 academic-hero-glow transform-gpu" />
      <div className="absolute inset-0 academic-grid-pattern opacity-40 dark:opacity-35 sm:opacity-60 sm:dark:opacity-45 transform-gpu" />
      <div className="absolute top-6 sm:top-8 right-3 sm:right-6 flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-200/80 dark:border-zinc-800/90 bg-zinc-50/80 dark:bg-zinc-900/80 text-[11px] font-mono text-zinc-600 dark:text-zinc-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span className="tracking-wider uppercase">OBE / NBA CURRICULUM</span>
      </div>
    </div>
  );
}

function SubjectCardSkeleton() {
  return (
    <div className="grid gap-4 sm:gap-5" aria-busy="true" aria-label="Loading curriculum subjects">
      {[1, 2, 3, 4].map((idx) => (
        <div 
          key={idx} 
          className="p-6 sm:p-7 academic-card rounded-2xl flex flex-col justify-between min-h-[140px] skeleton-shimmer transform-gpu"
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

      {/* Hero Header with clean, high-contrast typography — Rendered immediately without hidden initial opacity for fastest LCP */}
      <header className="mb-6 sm:mb-8 transform-gpu">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-4 sm:mb-5 leading-[1.1]">
          Knowledge Without Barriers.
        </h1>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl font-light leading-relaxed">
          Open, outcome-based academic curriculum and verified study materials for Computer Science & Engineering students.
        </p>
      </header>

      {/* AdSense Approval Diagnostic & 54-Point Audit Tool Feature Card */}
      <div className="mb-8 p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-2xl border border-zinc-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold">
              Live Diagnostic Engine v2.4
            </span>
          </div>
          <h2 className="text-xl font-serif font-bold text-white tracking-tight">
            54-Point AdSense Approval Checker & Website Analyzer
          </h2>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            Run an instant evidence-driven scan verifying server security headers, legal compliance pages, E-E-A-T trust signals, and SEO architecture.
          </p>
        </div>
        <Link
          to="/analyzer"
          className="px-5 py-2.5 bg-white text-zinc-950 hover:bg-zinc-200 font-bold rounded-xl text-xs uppercase tracking-wider font-mono whitespace-nowrap transition-all shadow-sm flex items-center gap-2 shrink-0"
        >
          <span>Run Analyzer</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Global Curriculum Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-600 dark:text-zinc-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all subjects, course codes, or lecture topics (e.g. Operating Systems, TCP/IP)..."
            aria-label="Search curriculum subjects and topics"
            className="w-full pl-11 pr-11 py-3.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-zinc-950 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-950 dark:focus:ring-zinc-100 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-600 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 cursor-pointer"
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
            <h3 className="text-2xl font-serif font-bold tracking-tight text-zinc-700 dark:text-zinc-300">
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
                        <span className="hidden md:inline text-xs text-zinc-600 dark:text-zinc-400 font-mono">
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
      <section aria-labelledby="academic-overview-heading" className="mt-16 sm:mt-24 pt-12 border-t border-zinc-200 dark:border-zinc-800 space-y-8 transform-gpu">
        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-zinc-700 dark:text-zinc-300 uppercase">Academic Repository & Standards</span>
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
                <span className="text-zinc-600 dark:text-zinc-400 group-open:rotate-180 transition-transform font-mono">↓</span>
              </summary>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                Yes. OpenCSE is dedicated to the principle of "Knowledge Without Barriers." All curriculum notes, topic summaries, and downloadable PDF modules are 100% free with no registration or paywalls required.
              </p>
            </details>

            <details className="p-5 liquid-glass-panel rounded-xl group cursor-pointer">
              <summary className="font-medium text-zinc-950 dark:text-white text-sm sm:text-base flex items-center justify-between">
                <span>How are course outcomes (COs) and topics verified?</span>
                <span className="text-zinc-600 dark:text-zinc-400 group-open:rotate-180 transition-transform font-mono">↓</span>
              </summary>
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                Our academic team reviews all materials against accredited university computer science syllabi (such as Operating Systems, Data Structures, Computer Networks, and Artificial Intelligence). We maintain strict human editorial review cycles to guarantee technical accuracy.
              </p>
            </details>

            <details className="p-5 liquid-glass-panel rounded-xl group cursor-pointer">
              <summary className="font-medium text-zinc-950 dark:text-white text-sm sm:text-base flex items-center justify-between">
                <span>How can I report an error or suggest a new subject?</span>
                <span className="text-zinc-600 dark:text-zinc-400 group-open:rotate-180 transition-transform font-mono">↓</span>
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

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<StudentLayout><StudentDashboard /></StudentLayout>} />
          <Route path="/subject/:subjectId" element={<StudentLayout><Suspense fallback={<RouteFallback />}><StudentSubjectRoute /></Suspense></StudentLayout>} />
          <Route path="/resources" element={<StudentLayout><Suspense fallback={<RouteFallback />}><ResourcesPage /></Suspense></StudentLayout>} />
          <Route path="/resources/:slug" element={<StudentLayout><Suspense fallback={<RouteFallback />}><ResourceArticlePage /></Suspense></StudentLayout>} />
          
          {/* AdSense Approval Diagnostic & Tools */}
          <Route path="/analyzer" element={<StudentLayout><Suspense fallback={<RouteFallback />}><WebsiteAnalyzerPage /></Suspense></StudentLayout>} />
          <Route path="/checker" element={<StudentLayout><Suspense fallback={<RouteFallback />}><WebsiteAnalyzerPage /></Suspense></StudentLayout>} />
          <Route path="/checklist" element={<StudentLayout><Suspense fallback={<RouteFallback />}><EligibilityChecklistPage /></Suspense></StudentLayout>} />
          <Route path="/calculator" element={<StudentLayout><Suspense fallback={<RouteFallback />}><RevenueCalculatorPage /></Suspense></StudentLayout>} />
          <Route path="/policy-generator" element={<StudentLayout><Suspense fallback={<RouteFallback />}><PolicyGeneratorPage /></Suspense></StudentLayout>} />
          <Route path="/seo-checklist" element={<StudentLayout><Suspense fallback={<RouteFallback />}><SeoChecklistPage /></Suspense></StudentLayout>} />
          <Route path="/how-to-get-approved" element={<StudentLayout><Suspense fallback={<RouteFallback />}><HowToGetApprovedPage /></Suspense></StudentLayout>} />
          <Route path="/rejection-reasons" element={<StudentLayout><Suspense fallback={<RouteFallback />}><RejectionReasonsPage /></Suspense></StudentLayout>} />
          <Route path="/tips-and-tricks" element={<StudentLayout><Suspense fallback={<RouteFallback />}><TipsAndTricksPage /></Suspense></StudentLayout>} />
          <Route path="/policy-checklist" element={<StudentLayout><Suspense fallback={<RouteFallback />}><PolicyChecklistPage /></Suspense></StudentLayout>} />
          <Route path="/faq" element={<StudentLayout><Suspense fallback={<RouteFallback />}><FAQPage /></Suspense></StudentLayout>} />

          {/* Legal, Trust & Transparency */}
          <Route path="/about" element={<StudentLayout><Suspense fallback={<RouteFallback />}><AboutPage /></Suspense></StudentLayout>} />
          <Route path="/contact" element={<StudentLayout><Suspense fallback={<RouteFallback />}><ContactPage /></Suspense></StudentLayout>} />
          <Route path="/privacy" element={<StudentLayout><Suspense fallback={<RouteFallback />}><PrivacyPage /></Suspense></StudentLayout>} />
          <Route path="/terms" element={<StudentLayout><Suspense fallback={<RouteFallback />}><TermsPage /></Suspense></StudentLayout>} />
          <Route path="/disclaimer" element={<StudentLayout><Suspense fallback={<RouteFallback />}><DisclaimerPage /></Suspense></StudentLayout>} />
          <Route path="/content-policy" element={<StudentLayout><Suspense fallback={<RouteFallback />}><ContentPolicyPage /></Suspense></StudentLayout>} />
          <Route path="/sitemap" element={<StudentLayout><Suspense fallback={<RouteFallback />}><SitemapPage /></Suspense></StudentLayout>} />
          
          <Route path="/admin/login" element={<Suspense fallback={<RouteFallback />}><AdminLogin /></Suspense>} />
          <Route path="/admin/*" element={<Suspense fallback={<RouteFallback />}><AdminApp /></Suspense>} />
          
          <Route path="*" element={<StudentLayout><Suspense fallback={<RouteFallback />}><NotFoundPage /></Suspense></StudentLayout>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}
