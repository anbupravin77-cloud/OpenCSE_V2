import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  BookOpen, 
  Layers, 
  GraduationCap, 
  FileText, 
  Presentation, 
  FileCode, 
  ExternalLink, 
  FolderOpen, 
  ChevronRight, 
  Download 
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { FullSubject, FullCO, FullTopic } from '../types';
import { SEO } from './SEO';

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

export function StudentTopicView({ topic, subjectCode, coCode, onBack }: { topic: any, subjectCode: string, coCode?: string, onBack: () => void }) {
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
        className="inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white mb-6 font-medium transition-colors group cursor-pointer min-h-[44px] px-2 -ml-2 rounded-lg focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none transform-gpu" 
        aria-label={`Back to ${coCode || subjectCode} Topics`}
      >
        <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform duration-150" /> 
        <span>Back to {coCode ? `${coCode} Topics` : `${subjectCode} Overview`}</span>
      </motion.button>

      {/* Topic Dominant Header */}
      <header className="mb-8 transform-gpu">
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
      </header>

      {/* VERIFIED STUDY RESOURCES & MATERIALS */}
      {topic.resources && topic.resources.length > 0 && (
        <section 
          aria-labelledby="resources-heading" 
          className="mb-10 p-5 sm:p-6 rounded-2xl academic-panel transform-gpu"
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
        </section>
      )}

      {/* TOPIC LECTURE NOTES & RICH CONTENT */}
      {topic.content ? (
        <article 
          className="prose dark:prose-invert prose-base sm:prose-lg max-w-[65ch] mx-auto text-zinc-800 dark:text-zinc-300 prose-headings:font-serif prose-headings:tracking-tight prose-headings:font-bold prose-headings:text-zinc-950 dark:prose-headings:text-white prose-a:text-zinc-950 dark:prose-a:text-white prose-a:font-bold hover:prose-a:text-zinc-600 dark:hover:prose-a:text-zinc-300 prose-img:border prose-img:border-zinc-200 dark:prose-img:border-zinc-800 prose-img:rounded-2xl prose-blockquote:border-zinc-950 dark:prose-blockquote:border-white prose-blockquote:font-serif prose-blockquote:italic prose-p:leading-relaxed transform-gpu" 
          dangerouslySetInnerHTML={{ __html: topic.content }} 
        />
      ) : (
        <div className="py-14 text-center text-zinc-700 dark:text-zinc-300 font-serif italic border border-zinc-200 dark:border-zinc-800 border-dashed rounded-2xl p-6">
          <BookOpen size={24} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm sm:text-base">Comprehensive lecture notes and module guides are currently being prepared for this topic.</p>
        </div>
      )}
    </div>
  );
}

export function StudentCOTopicsView({
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

      <motion.button 
        initial={shouldReduceMotion ? false : { opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
        onClick={onBack} 
        className="inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white mb-6 font-medium transition-colors group cursor-pointer min-h-[44px] px-2 -ml-2 rounded-lg focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none transform-gpu" 
        aria-label={`Back to ${subject.code} Course Overview`}
      >
        <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform duration-150" /> 
        <span>Back to {subject.code} Overview</span>
      </motion.button>

      <header className="mb-8 transform-gpu">
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
      </header>

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
                      {resourceCount > 0 && (
                        <div className="mt-2.5 flex items-center">
                          <span className="text-xs px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded font-medium inline-flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-700 font-mono">
                            <FileText size={12} /> {resourceCount} {resourceCount === 1 ? 'Resource' : 'Resources'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

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
          <div className="p-8 text-center text-zinc-700 dark:text-zinc-300 font-serif italic border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
            <BookOpen size={22} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Topics for this Course Outcome are being cataloged.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export function StudentSubjectView({ subject, onBack }: { subject: FullSubject, onBack: () => void }) {
  const [selectedCoId, setSelectedCoId] = useState<string | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

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

      <motion.button 
        initial={shouldReduceMotion ? false : { opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
        onClick={onBack} 
        className="inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white mb-6 font-medium transition-colors group cursor-pointer min-h-[44px] px-2 -ml-2 rounded-lg focus-visible:ring-2 focus-visible:ring-zinc-950 dark:focus-visible:ring-white focus-visible:outline-none transform-gpu" 
        aria-label="Back to curriculum archive"
      >
        <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform duration-150" /> 
        <span>Back to Curriculum Archive</span>
      </motion.button>

      <header className="mb-8 transform-gpu">
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
            <span className="hidden md:inline text-xs text-zinc-600 dark:text-zinc-400 font-mono">
              · {subject.department}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-4 leading-[1.12]">
          {subject.name}
        </h1>

        {subject.description && (
          <div 
            className="prose dark:prose-invert max-w-3xl text-zinc-600 dark:text-zinc-400 font-light text-base sm:text-lg leading-relaxed mb-4" 
            dangerouslySetInnerHTML={{ __html: subject.description }} 
          />
        )}
      </header>

      <section 
        aria-labelledby="co-section-heading" 
        className="border-t border-zinc-200 dark:border-zinc-800/80 pt-8 transform-gpu"
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
      </section>
    </div>
  );
}

export default function StudentSubjectRoute() {
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
        <div className="flex items-center gap-2">
          <div className="h-4 w-16 bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer"></div>
          <div className="h-3 w-3 bg-zinc-200 dark:bg-zinc-800 rounded-full skeleton-shimmer"></div>
          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer"></div>
          <div className="h-3 w-3 bg-zinc-200 dark:bg-zinc-800 rounded-full skeleton-shimmer"></div>
          <div className="h-4 w-24 bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer"></div>
        </div>

        <div className="h-9 w-48 bg-zinc-200 dark:bg-zinc-800 rounded-lg skeleton-shimmer"></div>

        <div className="space-y-3 pt-2">
          <div className="flex gap-2">
            <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer"></div>
            <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-800 rounded skeleton-shimmer"></div>
          </div>
          <div className="h-10 w-3/4 bg-zinc-200 dark:bg-zinc-800 rounded-xl skeleton-shimmer"></div>
          <div className="h-14 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl skeleton-shimmer"></div>
        </div>

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
