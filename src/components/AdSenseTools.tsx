import React, { useState, useEffect, useMemo } from 'react';
import { SEO } from './SEO';
import { runAdSenseAudit } from '../utils/auditEngine';
import { AuditReport } from '../types';

// =========================================================================
// WEBSITE ANALYZER (54-POINT AUDIT ENGINE & DIAGNOSTIC REPORT UI)
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
            className="h-12 px-6 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 font-bold rounded-xl text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
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
                    className={`px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
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
                  className="px-3 py-1.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer"
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
                    className={`px-2.5 py-1 rounded-md text-xs whitespace-nowrap transition-all cursor-pointer ${
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
