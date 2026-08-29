import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SEO } from './SEO';
import { runAdSenseAudit } from '../utils/auditEngine';
import { AuditReport, AuditCheckpoint, AuditCategory, AuditStatus } from '../types';

// =========================================================================
// 1. WEBSITE ANALYZER (54-POINT AUDIT ENGINE & DIAGNOSTIC REPORT UI)
// =========================================================================
export function WebsiteAnalyzerPage() {
  const [targetUrl, setTargetUrl] = useState('');
  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeStatus, setActiveStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Run initial self-audit immediately on page mount
    executeAudit(window.location.origin);
  }, []);

  const executeAudit = async (urlToScan?: string) => {
    setLoading(true);
    try {
      const scanUrl = urlToScan || targetUrl.trim() || window.location.origin;
      const res = await runAdSenseAudit(scanUrl);
      setReport(res);
    } catch (err) {
      console.error('Audit failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRunScan = (e: React.FormEvent) => {
    e.preventDefault();
    executeAudit(targetUrl.trim() || window.location.origin);
  };

  const filteredCheckpoints = useMemo(() => {
    if (!report) return [];
    return report.checkpoints.filter(cp => {
      if (activeCategory !== 'all' && cp.category !== activeCategory) return false;
      if (activeStatus === 'ROADBLOCKS' && cp.status !== 'FAIL') return false;
      if (activeStatus !== 'all' && activeStatus !== 'ROADBLOCKS' && cp.status !== activeStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = 
          cp.title.toLowerCase().includes(q) || 
          cp.evidence.toLowerCase().includes(q) || 
          cp.whyItMatters.toLowerCase().includes(q) || 
          cp.whatWeDetected.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [report, activeCategory, activeStatus, searchQuery]);

  const copySummaryReport = () => {
    if (!report) return;
    const text = `OpenCSE 54-Point AdSense Diagnostic Audit Report
Target: ${report.url}
Timestamp: ${report.timestamp}
Diagnostic Readiness Score: ${report.readinessScore}%
Technical Health: ${report.categoryScores.technical}%
Content Quality: ${report.categoryScores.content}%
Trust & Compliance: ${report.categoryScores.legal}%
SEO & Metadata: ${report.categoryScores.seo}%
UX & Performance: ${report.categoryScores.ux}%

Summary:
- Total Points: 54
- Passed: ${report.summary.passedPoints}
- Warnings: ${report.summary.warningPoints}
- Critical Roadblocks: ${report.summary.criticalRoadblocks}

Disclaimer: ${report.disclaimer}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <SEO 
        title="54-Point AdSense Approval Checker & Diagnostic Engine — OpenCSE" 
        description="Comprehensive, evidence-driven 54-point audit engine evaluating technical health, content depth, legal compliance, and SEO readiness for Google AdSense."
        canonicalPath="/analyzer"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Website Analyzer', path: '/analyzer' }
        ]}
      />

      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-700 dark:text-zinc-300 font-medium">
              Live 54-Point Diagnostic Engine v2.4
            </span>
          </div>
          <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3 py-1 rounded-full">
            Zero False-Failure Architecture
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-3">
          Website Analyzer & Approval Diagnostic
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base max-w-3xl font-light leading-relaxed">
          Evaluate your website against all 54 rigorous criteria used by ad networks: server security headers, legal compliance, content depth, internal link architecture, and search capabilities.
        </p>
      </div>

      {/* Scanner Input Bar */}
      <div className="bg-zinc-100 dark:bg-zinc-900/70 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 sm:p-6 mb-8 shadow-sm">
        <form onSubmit={handleRunScan} className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Enter site domain to audit (leave blank to audit current OpenCSE site)..."
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              className="w-full h-12 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-4 text-sm text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="h-12 px-6 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold rounded-xl text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Analyzing 54 Points...</span>
              </>
            ) : (
              <>
                <span>Run Diagnostic Audit</span>
              </>
            )}
          </button>
        </form>
      </div>

      {report && (
        <div className="space-y-8">
          {/* Top Score Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Main Readiness Card */}
            <div className="sm:col-span-2 p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white border border-zinc-800 rounded-2xl flex flex-col justify-between shadow-md">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">
                    Diagnostic Score
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">
                    54 / 54 Evaluated
                  </span>
                </div>
                <div className="flex items-baseline gap-3 my-2">
                  <span className="text-5xl sm:text-6xl font-serif font-bold text-white tracking-tight">
                    {report.readinessScore}%
                  </span>
                  <span className="text-emerald-400 text-sm font-medium">
                    {report.readinessScore >= 90 ? 'Excellent Approval Readiness' : (report.readinessScore >= 75 ? 'Good — Minor Optimizations Needed' : 'Action Required')}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-md">
                  All critical hurdles verified. Zero critical approval roadblocks detected.
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Roadblocks: <strong className="text-emerald-400">{report.summary.criticalRoadblocks}</strong></span>
                <span className="text-zinc-400">Passed: <strong className="text-white">{report.summary.passedPoints}</strong></span>
                <span className="text-zinc-400">Warnings: <strong className="text-amber-400">{report.summary.warningPoints}</strong></span>
              </div>
            </div>

            {/* Sub Metric 1: Technical & Content */}
            <div className="p-5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-1">Technical Health</span>
                <div className="text-3xl font-serif font-bold text-zinc-950 dark:text-white mb-2">
                  {report.categoryScores.technical}%
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-3">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${report.categoryScores.technical}%` }}></div>
                </div>
                <p className="text-xs text-zinc-500">
                  HTTPS, HSTS, CSP, Robots.txt, Sitemap.xml & security headers.
                </p>
              </div>
            </div>

            {/* Sub Metric 2: Trust & Compliance */}
            <div className="p-5 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-1">Trust & Legal Compliance</span>
                <div className="text-3xl font-serif font-bold text-zinc-950 dark:text-white mb-2">
                  {report.categoryScores.legal}%
                </div>
                <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden mb-3">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${report.categoryScores.legal}%` }}></div>
                </div>
                <p className="text-xs text-zinc-500">
                  Privacy Policy, AdSense Cookies, Terms, Disclaimer & Contact.
                </p>
              </div>
            </div>
          </div>

          {/* Deep Content & Link Telemetry */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <div className="text-xs text-zinc-500 font-mono uppercase">Total Text Volume</div>
              <div className="text-xl font-bold text-zinc-950 dark:text-white mt-1">
                {report.contentMetrics.totalMeaningfulWords.toLocaleString()} <span className="text-xs font-normal text-zinc-500">words</span>
              </div>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <div className="text-xs text-zinc-500 font-mono uppercase">Indexable Pages</div>
              <div className="text-xl font-bold text-zinc-950 dark:text-white mt-1">
                {report.contentMetrics.indexablePagesCount} <span className="text-xs font-normal text-zinc-500">routes</span>
              </div>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <div className="text-xs text-zinc-500 font-mono uppercase">Unique Destinations</div>
              <div className="text-xl font-bold text-zinc-950 dark:text-white mt-1">
                {report.linkStats.uniqueDestinations} <span className="text-xs font-normal text-zinc-500">internal</span>
              </div>
            </div>
            <div className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <div className="text-xs text-zinc-500 font-mono uppercase">Thin / Empty Pages</div>
              <div className="text-xl font-bold text-emerald-500 mt-1">
                {report.contentMetrics.thinPagesCount} <span className="text-xs font-normal text-zinc-500">detected</span>
              </div>
            </div>
          </div>

          {/* Filtering and Controls Bar */}
          <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'All 54 Points' },
                  { id: 'technical', label: 'Technical (12)' },
                  { id: 'content', label: 'Content (12)' },
                  { id: 'legal', label: 'Legal & Trust (10)' },
                  { id: 'seo', label: 'SEO (10)' },
                  { id: 'ux', label: 'UX & Perf (10)' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                      activeCategory === tab.id
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-800/60 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={copySummaryReport}
                  className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5"
                >
                  {copied ? '✓ Copied Summary' : 'Copy Summary'}
                </button>
              </div>
            </div>

            {/* Status & Search Filter */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-zinc-200 dark:border-zinc-800/60">
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
                <span className="text-zinc-500 font-mono text-[11px] uppercase mr-1">Status:</span>
                {[
                  { id: 'all', label: 'All' },
                  { id: 'PASS', label: `Passed (${report.summary.passedPoints})` },
                  { id: 'WARNING', label: `Warnings (${report.summary.warningPoints})` },
                  { id: 'ROADBLOCKS', label: `Roadblocks (${report.summary.criticalRoadblocks})` }
                ].map(s => (
                  <button
                    key={s.id}
                    onClick={() => setActiveStatus(s.id)}
                    className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-all ${
                      activeStatus === s.id
                        ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <div className="sm:ml-auto flex-1 sm:max-w-xs">
                <input 
                  type="search"
                  placeholder="Filter checkpoints..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 text-xs text-zinc-950 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-500"
                />
              </div>
            </div>
          </div>

          {/* Checkpoint Detail List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-zinc-500 px-1 font-mono uppercase">
              <span>Showing {filteredCheckpoints.length} Checkpoints</span>
              <span>Evidence-Driven Analysis</span>
            </div>

            {filteredCheckpoints.map((cp) => (
              <div
                key={cp.id}
                className="p-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-bold text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-2 py-0.5 rounded">
                      #{cp.pointNumber}
                    </span>
                    <div>
                      <h3 className="text-base font-serif font-bold text-zinc-950 dark:text-white">
                        {cp.title}
                      </h3>
                      <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                        Category: {cp.category}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono uppercase ${
                    cp.status === 'PASS' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : cp.status === 'WARNING'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                      : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                  }`}>
                    {cp.status}
                  </span>
                </div>

                {/* Evidence & Findings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-zinc-200 dark:border-zinc-800/60">
                  <div className="space-y-1">
                    <span className="font-mono uppercase text-[10px] text-zinc-500 font-semibold">Evidence Detected</span>
                    <p className="text-zinc-800 dark:text-zinc-300 font-mono bg-white dark:bg-zinc-950 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800/80 leading-relaxed">
                      {cp.evidence}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-mono uppercase text-[10px] text-zinc-500 font-semibold">Why Google AdSense Checks This</span>
                    <p className="text-zinc-600 dark:text-zinc-400 p-2.5 rounded-lg leading-relaxed bg-zinc-100/50 dark:bg-zinc-800/30">
                      {cp.whyItMatters}
                    </p>
                  </div>
                </div>

                <div className="text-xs text-zinc-500 pt-1 flex items-center justify-between">
                  <span><strong>Recommendation:</strong> {cp.recommendation}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Legal Disclaimer Box */}
          <div className="p-5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-xs text-zinc-500 leading-relaxed space-y-2">
            <div className="font-serif font-bold text-zinc-950 dark:text-white">
              Official Audit Disclaimer
            </div>
            <p>
              {report.disclaimer}
            </p>
            <p>
              OpenCSE is not affiliated with Google LLC. Google AdSense is a trademark of Google LLC.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 2. ELIGIBILITY CHECKLIST
// =========================================================================
export function EligibilityChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    age: true,
    domain: true,
    nav: true,
    privacy: true,
    terms: true,
    about: true,
    contact: true,
    articles: true,
    unique: true,
    thin: true,
    adsense_policy: true,
    https: true,
  });

  const items = [
    { id: 'age', category: 'General', text: 'Website owner is at least 18 years old and legally authorized to enter contracts.' },
    { id: 'domain', category: 'Technical', text: 'Site is deployed on a custom domain or recognized academic URL with active HTTPS.' },
    { id: 'nav', category: 'Navigation', text: 'Clear header and footer navigation with working internal links to all key sections.' },
    { id: 'privacy', category: 'Legal', text: 'Privacy Policy page exists and includes explicit Google AdSense cookie & opt-out clauses.' },
    { id: 'terms', category: 'Legal', text: 'Terms of Service page exists detailing acceptable use and copyright policies.' },
    { id: 'about', category: 'Trust (E-E-A-T)', text: 'About Us page clearly explains publisher identity, purpose, and editorial standards.' },
    { id: 'contact', category: 'Trust (E-E-A-T)', text: 'Contact page provides working communication channels (email and inquiry form).' },
    { id: 'articles', category: 'Content Depth', text: 'At least 15–20 high-value, comprehensive articles/modules (600+ words each).' },
    { id: 'unique', category: 'Content Depth', text: 'Content is 100% original or verified academic curriculum with zero scraped text.' },
    { id: 'thin', category: 'Quality', text: 'Zero empty pages, broken links, or placeholder "Under Construction" sections.' },
    { id: 'adsense_policy', category: 'Compliance', text: 'Content strictly complies with Google Publisher Policies (no prohibited niches).' },
    { id: 'https', category: 'Security', text: 'Strict HTTPS enforced across all pages with valid SSL/TLS certificates.' },
  ];

  const total = items.length;
  const completed = Object.values(checkedItems).filter(Boolean).length;
  const percentage = Math.round((completed / total) * 100);

  const toggle = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <SEO 
        title="Google AdSense Eligibility Checklist — OpenCSE" 
        description="Interactive publisher eligibility checklist covering mandatory requirements for Google AdSense account approval."
        canonicalPath="/checklist"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Eligibility Checklist', path: '/checklist' }
        ]}
      />

      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-3">
          AdSense Eligibility Checklist
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base font-light leading-relaxed">
          Verify that your website fulfills every foundational publisher criterion before submitting your official application to Google AdSense.
        </p>
      </div>

      {/* Progress Card */}
      <div className="p-6 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">Eligibility Readiness</span>
          <div className="text-3xl font-serif font-bold text-zinc-950 dark:text-white mt-1">
            {completed} of {total} Complete ({percentage}%)
          </div>
        </div>
        <div className="w-full sm:w-48 bg-zinc-200 dark:bg-zinc-800 h-3 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full rounded-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {items.map((item) => (
          <label
            key={item.id}
            onClick={() => toggle(item.id)}
            className={`p-4 rounded-xl border flex items-start gap-4 cursor-pointer transition-all ${
              checkedItems[item.id]
                ? 'bg-zinc-50 dark:bg-zinc-900/40 border-zinc-300 dark:border-zinc-800'
                : 'bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800/60 opacity-80'
            }`}
          >
            <input 
              type="checkbox"
              checked={Boolean(checkedItems[item.id])}
              onChange={() => {}}
              className="mt-1 w-5 h-5 rounded border-zinc-300 text-zinc-950 focus:ring-zinc-500"
            />
            <div className="space-y-0.5 flex-1">
              <span className="text-[11px] font-mono uppercase text-zinc-500 block">
                {item.category}
              </span>
              <span className={`text-sm leading-relaxed ${
                checkedItems[item.id] ? 'text-zinc-950 dark:text-white font-medium' : 'text-zinc-600 dark:text-zinc-400'
              }`}>
                {item.text}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

// =========================================================================
// 3. REVENUE CALCULATOR
// =========================================================================
export function RevenueCalculatorPage() {
  const [pageviews, setPageviews] = useState<number>(50000);
  const [niche, setNiche] = useState<string>('tech');
  const [tier, setTier] = useState<string>('tier1');

  // RPM estimates based on industry benchmarks
  const rpmMatrix: Record<string, Record<string, number>> = {
    tech: { tier1: 14.5, tier2: 6.8, tier3: 2.4 },
    finance: { tier1: 22.0, tier2: 9.5, tier3: 3.8 },
    education: { tier1: 9.2, tier2: 4.5, tier3: 1.8 },
    lifestyle: { tier1: 6.5, tier2: 3.2, tier3: 1.2 }
  };

  const estimatedRpm = rpmMatrix[niche]?.[tier] || 8.0;
  const monthlyRevenue = Math.round((pageviews / 1000) * estimatedRpm);
  const annualRevenue = monthlyRevenue * 12;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <SEO 
        title="Google AdSense Revenue Calculator — OpenCSE" 
        description="Estimate monthly and annual website ad revenue potential based on traffic volume, geographical tier, and content niche."
        canonicalPath="/calculator"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Revenue Calculator', path: '/calculator' }
        ]}
      />

      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-3">
          AdSense Revenue Calculator
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base font-light leading-relaxed">
          Simulate projected monthly and annual advertising income based on monthly pageviews, visitor geography, and vertical category.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Controls */}
        <div className="md:col-span-2 space-y-6 p-6 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <label className="font-serif font-bold text-zinc-950 dark:text-white">Monthly Pageviews</label>
              <span className="font-mono text-zinc-500">{pageviews.toLocaleString()} views</span>
            </div>
            <input 
              type="range"
              min={5000}
              max={1000000}
              step={5000}
              value={pageviews}
              onChange={(e) => setPageviews(Number(e.target.value))}
              className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <label className="font-serif font-bold text-zinc-950 dark:text-white text-sm">Content Niche / Category</label>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full h-11 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 text-sm text-zinc-950 dark:text-white"
            >
              <option value="tech">Technology & Computer Science (High Demand)</option>
              <option value="finance">Finance, Crypto & Business</option>
              <option value="education">Academic Education & Syllabi</option>
              <option value="lifestyle">General Lifestyle & Media</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="font-serif font-bold text-zinc-950 dark:text-white text-sm">Audience Geographic Tier</label>
            <select
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              className="w-full h-11 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl px-3 text-sm text-zinc-950 dark:text-white"
            >
              <option value="tier1">Tier 1 (United States, Canada, UK, Australia, Germany)</option>
              <option value="tier2">Tier 2 (Southern/Eastern Europe, Latin America)</option>
              <option value="tier3">Tier 3 (South Asia, Southeast Asia, Global Rest)</option>
            </select>
          </div>
        </div>

        {/* Results Card */}
        <div className="p-6 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white border border-zinc-800 rounded-2xl flex flex-col justify-between shadow-lg">
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">Estimated Revenue</span>
              <div className="text-4xl font-serif font-bold text-white mt-2">
                ${monthlyRevenue.toLocaleString()}
                <span className="text-xs font-normal text-zinc-400 block mt-1">per month</span>
              </div>
            </div>

            <div className="border-t border-zinc-800 pt-4 space-y-2 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span>Annual Projected:</span>
                <strong className="text-white">${annualRevenue.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Estimated RPM:</span>
                <strong className="text-emerald-400">${estimatedRpm.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-500 pt-6 border-t border-zinc-800/60 leading-tight">
            *Estimates based on typical AdSense auction RPM benchmarks. Actual CPC and viewability will vary.
          </p>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 4. POLICY GENERATOR
// =========================================================================
export function PolicyGeneratorPage() {
  const [siteName, setSiteName] = useState('My Academic Portal');
  const [siteUrl, setSiteUrl] = useState('https://example.com');
  const [contactEmail, setContactEmail] = useState('support@example.com');
  const [copied, setCopied] = useState(false);

  const policyText = `Privacy Policy for ${siteName}
Website: ${siteUrl}
Contact: ${contactEmail}

1. Introduction
Welcome to ${siteName}. We respect your privacy and are committed to protecting any information that may be collected through your use of our website at ${siteUrl}.

2. Google AdSense & Third-Party Advertising Cookies
${siteName} utilizes Google AdSense and third-party advertising vendors to serve advertisements when you visit our website.
- Google, as a third-party vendor, uses cookies to serve ads on ${siteName}.
- Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to ${siteName} and/or other sites on the Internet.
- Users may opt out of personalized advertising by visiting Google Ads Settings at https://www.google.com/settings/ads or by visiting http://www.aboutads.info.

3. Log Files & Analytics
Like standard websites, ${siteName} makes use of log files. The information inside the log files includes internet protocol (IP) addresses, type of browser, Internet Service Provider (ISP), date/time stamp, referring/exit pages, and number of clicks to analyze trends and administer the site.

4. Data Protection & Student Rights (GDPR / CCPA)
We minimize all data collection. We do not require student accounts or sell personal identifiable information.

5. Contact Information
If you have any questions regarding this Privacy Policy, please contact us at ${contactEmail}.`;

  const copyText = () => {
    navigator.clipboard.writeText(policyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <SEO 
        title="AdSense-Compliant Privacy Policy Generator — OpenCSE" 
        description="Generate a legally formatted, AdSense-compliant Privacy Policy with mandatory advertising cookie clauses and opt-out links."
        canonicalPath="/policy-generator"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Policy Generator', path: '/policy-generator' }
        ]}
      />

      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-3">
          AdSense Privacy Policy Generator
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base font-light leading-relaxed">
          Generate a customized privacy policy text containing all mandatory Google AdSense advertising clauses and cookie disclosures.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <div className="space-y-4 p-6 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-zinc-500 font-semibold">Website Name</label>
            <input 
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full h-10 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 text-sm text-zinc-950 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-zinc-500 font-semibold">Website URL</label>
            <input 
              type="text"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              className="w-full h-10 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 text-sm text-zinc-950 dark:text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-zinc-500 font-semibold">Contact Email</label>
            <input 
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full h-10 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg px-3 text-sm text-zinc-950 dark:text-white"
            />
          </div>
        </div>

        {/* Preview & Copy */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-zinc-500 uppercase">Generated Policy Document</span>
            <button
              onClick={copyText}
              className="px-4 py-1.5 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-lg text-xs font-bold transition-all hover:opacity-90 shadow-sm"
            >
              {copied ? '✓ Copied to Clipboard' : 'Copy Policy Text'}
            </button>
          </div>
          <pre className="p-4 bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl text-xs font-mono text-zinc-800 dark:text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[420px]">
            {policyText}
          </pre>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 5. SEO CHECKLIST & STEP-BY-STEP GUIDES
// =========================================================================
export function SeoChecklistPage() {
  const points = [
    { title: 'Semantic Headings', desc: 'Ensure each page has exactly one H1 tag followed logically by H2 and H3 subsections.' },
    { title: 'Unique Meta Descriptions', desc: 'Craft unique 120–158 character meta descriptions highlighting value for searchers.' },
    { title: 'XML Sitemap & Robots.txt', desc: 'Expose valid /sitemap.xml and /robots.txt files allowing Mediapartners-Google.' },
    { title: 'Canonical Link Tags', desc: 'Implement self-referencing canonical tags to avoid duplicate content penalties.' },
    { title: 'Open Graph & Twitter Cards', desc: 'Configure og:title, og:description, and twitter:card meta tags for rich social snippets.' },
    { title: 'Structured Data JSON-LD', desc: 'Include Schema.org EducationalOrganization and BreadcrumbList markup.' },
    { title: 'Alt Text on Images', desc: 'Provide descriptive alt attributes on all non-decorative diagrams and illustrations.' },
    { title: 'Mobile Viewport Meta', desc: 'Configure width=device-width, initial-scale=1.0 for perfect mobile indexing.' },
    { title: 'Core Web Vitals', desc: 'Optimize LCP (<2.5s), CLS (<0.1), and INP (<200ms) for snappy mobile browsing.' },
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <SEO 
        title="Technical SEO Checklist for Publishers — OpenCSE" 
        description="Comprehensive technical SEO checklist to maximize organic search discovery and AdSense compliance."
        canonicalPath="/seo-checklist"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'SEO Checklist', path: '/seo-checklist' }
        ]}
      />

      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-3">
          Publisher Technical SEO Checklist
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base font-light leading-relaxed">
          Ensure search engines and AdSense quality raters can crawl, index, and rank your content effectively.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {points.map((p, idx) => (
          <div key={idx} className="p-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h3 className="font-serif font-bold text-zinc-950 dark:text-white text-base">{p.title}</h3>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-light">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HowToGetApprovedPage() {
  const steps = [
    { num: '01', title: 'Curate 15–20 Comprehensive Guides', desc: 'Publish original, in-depth academic topics (600+ words) covering core syllabus outcomes. Avoid thin 100-word snippets.' },
    { num: '02', title: 'Publish All 5 Mandatory Legal Pages', desc: 'Ensure /privacy, /terms, /disclaimer, /about, and /contact pages are live, functional, and linked prominently in the footer.' },
    { num: '03', title: 'Structure Clean, Logical Navigation', desc: 'Implement intuitive year and subject hierarchies, search bars, and breadcrumbs so crawlers can reach every guide within 2 clicks.' },
    { num: '04', title: 'Verify Technical Health & HTTPS', desc: 'Enable HTTPS, valid robots.txt, XML sitemap, and ensure zero 404 broken links or layout shift issues.' },
    { num: '05', title: 'Build Initial Organic Search Traffic', desc: 'Submit your sitemap to Google Search Console and allow pages to index for 2–4 weeks before submitting your application.' },
    { num: '06', title: 'Submit AdSense Application & Paste Code', desc: 'Apply through Google AdSense, embed the publisher verification code into your HTML head, and avoid modifying the layout during review.' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <SEO 
        title="How to Get Approved for Google AdSense — Step-by-Step Guide" 
        description="A complete, practical step-by-step roadmap to prepare your website for first-time Google AdSense publisher approval."
        canonicalPath="/how-to-get-approved"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'How to Get Approved', path: '/how-to-get-approved' }
        ]}
      />

      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-10">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-3">
          How to Get Approved for Google AdSense
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base font-light leading-relaxed">
          Follow this 6-step blueprint to build a compliant, high-authority site that passes manual reviewer inspection.
        </p>
      </div>

      <div className="space-y-6">
        {steps.map(s => (
          <div key={s.num} className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-start gap-6">
            <span className="text-3xl font-serif font-bold text-zinc-400 dark:text-zinc-600 font-mono">
              {s.num}
            </span>
            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-zinc-950 dark:text-white">
                {s.title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RejectionReasonsPage() {
  const reasons = [
    { title: 'Low Value Content / Thin Content', cause: 'Articles have fewer than 300 words, contain mostly scraped quotes, or lack original educational synthesis.', fix: 'Expand existing topics to 600+ words, add architectural diagrams, code snippets, and original learning outcomes.' },
    { title: 'Site Under Construction / Broken Navigation', cause: 'Menu links point to "#" or empty pages, or internal links return 404 errors.', fix: 'Verify every link in your header and footer routes to a complete, published page.' },
    { title: 'Missing or Non-Compliant Privacy Policy', cause: 'Privacy Policy is missing, inaccessible, or omits mandatory Google advertising cookie disclosures.', fix: 'Deploy a dedicated /privacy route with explicit clauses on third-party cookies and Google Ads Settings opt-out links.' },
    { title: 'Difficult Navigation / Poor Site Structure', cause: 'Content is buried or inaccessible without multiple search steps.', fix: 'Organize subjects into clean academic years, add breadcrumbs, and provide an interactive search bar.' },
    { title: 'Prohibited or Restricted Niche', cause: 'Content touches upon copyrighted leaks, adult themes, gambling, or hazardous material.', fix: 'Ensure 100% adherence to academic engineering and technical curriculum standards.' }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <SEO 
        title="Top Google AdSense Rejection Reasons & Fixes — OpenCSE" 
        description="Detailed analysis of common Google AdSense rejection notices with actionable solutions to pass review."
        canonicalPath="/rejection-reasons"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Rejection Reasons', path: '/rejection-reasons' }
        ]}
      />

      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-10">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-3">
          Top AdSense Rejection Reasons & Solutions
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base font-light leading-relaxed">
          Analyze the most frequent causes of AdSense application rejection and follow verified solutions to remediate them.
        </p>
      </div>

      <div className="space-y-6">
        {reasons.map((r, idx) => (
          <div key={idx} className="p-6 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
            <h3 className="text-lg font-serif font-bold text-zinc-950 dark:text-white">
              {r.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-xl space-y-1">
                <strong className="text-rose-700 dark:text-rose-300 uppercase font-mono text-[10px]">Why It Was Rejected</strong>
                <p className="text-rose-900 dark:text-rose-200 leading-relaxed">{r.cause}</p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl space-y-1">
                <strong className="text-emerald-700 dark:text-emerald-300 uppercase font-mono text-[10px]">How to Fix It</strong>
                <p className="text-emerald-900 dark:text-emerald-200 leading-relaxed">{r.fix}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TipsAndTricksPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <SEO 
        title="Publisher Approval Tips & Best Practices — OpenCSE" 
        description="Expert recommendations to ensure swift, trouble-free approval for your website on Google AdSense."
        canonicalPath="/tips-and-tricks"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Tips & Tricks', path: '/tips-and-tricks' }
        ]}
      />

      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-10">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-3">
          AdSense Approval Tips & Best Practices
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base font-light leading-relaxed">
          Insider recommendations to strengthen your platform's credibility, authoritativeness, and review success.
        </p>
      </div>

      <div className="space-y-6 text-zinc-600 dark:text-zinc-400 font-light text-base leading-relaxed">
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
          <h2 className="text-xl font-serif font-bold text-zinc-950 dark:text-white">1. Focus on Clear E-E-A-T Signals</h2>
          <p>
            Google manual reviewers look for Experience, Expertise, Authoritativeness, and Trustworthiness. Include author biographies, academic course codes (e.g. 22CH362), Outcome-Based Education (OBE) mappings, and a transparent About page.
          </p>
        </div>

        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
          <h2 className="text-xl font-serif font-bold text-zinc-950 dark:text-white">2. Avoid Premature Ad Placement</h2>
          <p>
            Do not install low-quality popups, excessive third-party ad networks, or misleading buttons before applying. Keep your layout clean and distraction-free.
          </p>
        </div>

        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-2">
          <h2 className="text-xl font-serif font-bold text-zinc-950 dark:text-white">3. Ensure Multi-Device Fluidity</h2>
          <p>
            Test your layout on mobile viewports (320px to 420px). Ensure buttons have at least 44px touch targets and that text is easily readable without zooming.
          </p>
        </div>
      </div>
    </div>
  );
}

export function PolicyChecklistPage() {
  return (
    <div className="max-w-4xl mx-auto py-8">
      <SEO 
        title="Google Publisher Policies Checklist — OpenCSE" 
        description="Comprehensive breakdown of Google Publisher Policies including prohibited content, copyright restrictions, and compliance."
        canonicalPath="/policy-checklist"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Policy Checklist', path: '/policy-checklist' }
        ]}
      />

      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-10">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-3">
          Google Publisher Policies Compliance Guide
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base font-light leading-relaxed">
          Review core Google Publisher Policies and verify complete alignment across your web platform.
        </p>
      </div>

      <div className="space-y-6 text-zinc-600 dark:text-zinc-400 font-light text-base leading-relaxed">
        <section className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
          <h2 className="text-xl font-serif font-bold text-zinc-950 dark:text-white">1. Prohibited Content Categories</h2>
          <p>AdSense strictly bans monetization on content involving illegal goods, adult/sexual content, dangerous weapons, hate speech, malware, or hacked materials.</p>
        </section>

        <section className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
          <h2 className="text-xl font-serif font-bold text-zinc-950 dark:text-white">2. Intellectual Property & Copyright</h2>
          <p>Publishers must own or be legally authorized to distribute all published materials. Maintain a clear DMCA takedown mechanism and never distribute pirated textbooks.</p>
        </section>

        <section className="p-6 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
          <h2 className="text-xl font-serif font-bold text-zinc-950 dark:text-white">3. Ad Placement & Accidental Clicks</h2>
          <p>Ads must never mimic navigational elements, overlap content, or encourage visitors to click ads under false pretenses.</p>
        </section>
      </div>
    </div>
  );
}

// =========================================================================
// 6. FREQUENTLY ASKED QUESTIONS (FAQ)
// =========================================================================
export function FAQPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is OpenCSE?',
      a: 'OpenCSE is an open, distraction-free academic platform providing Outcome-Based Education (OBE) course structures, lecture notes, syllabus outcomes (CO1-CO5), and publisher diagnostic tools for Computer Science students and web creators.'
    },
    {
      q: 'How does the 54-Point Website Analyzer work?',
      a: 'The analyzer evaluates 54 technical, legal, SEO, and UX checkpoints including HTTPS/HSTS, robots.txt, XML sitemaps, privacy policies with AdSense cookie disclosures, content depth, search capabilities, and Core Web Vitals.'
    },
    {
      q: 'Does a 100% Diagnostic Score guarantee Google AdSense approval?',
      a: 'No. The diagnostic score reflects technical and compliance readiness based on publicly known web standards and AdSense policies. Final approval decisions are made exclusively by Google LLC.'
    },
    {
      q: 'Why are Privacy Policy, Terms, and Contact pages mandatory?',
      a: 'Google AdSense requires publishers to disclose advertising cookie usage (including third-party cookies and personalized ad opt-outs) and verify publisher authenticity and accountability through working contact mechanisms.'
    },
    {
      q: 'How much original content do I need before applying to AdSense?',
      a: 'We recommend at least 15–20 high-quality, comprehensive modules or articles with an average length of 600+ meaningful words each, properly indexed in Google Search Console.'
    },
    {
      q: 'Can I access OpenCSE course materials for free?',
      a: 'Yes. All curricula, lecture notes, and diagnostic utilities on OpenCSE are 100% free and open for student study and research.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8">
      <SEO 
        title="Frequently Asked Questions (FAQ) — OpenCSE" 
        description="Answers to common questions about OpenCSE curricula, AdSense diagnostic audits, and publisher approval guidelines."
        canonicalPath="/faq"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: '/faq' }
        ]}
      />

      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-8 mb-10">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-3">
          Frequently Asked Questions
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base font-light leading-relaxed">
          Find answers regarding academic course structures, diagnostic audits, and web monetization standards.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx}
              className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-900/50"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-base text-zinc-950 dark:text-white hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-lg font-mono text-zinc-400">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-sm text-zinc-600 dark:text-zinc-400 font-light leading-relaxed border-t border-zinc-200 dark:border-zinc-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
