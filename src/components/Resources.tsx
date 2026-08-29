import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AcademicResource, Subject } from '../types';
import { BookOpen, Search, Clock, ChevronRight, FileText } from 'lucide-react';
import { SEO } from './SEO';

export function ResourcesPage() {
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/academic-resources').then(res => res.json()),
      fetch('/api/subjects').then(res => res.json())
    ]).then(([resData, subData]) => {
      setResources((resData || []).filter((r: AcademicResource) => r.status === 'PUBLISHED'));
      setSubjects(subData || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const categories = ['All', ...Array.from(new Set(resources.map(r => r.category))).filter(Boolean)];

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO 
        title="Academic Resources & Study Guides"
        description="Comprehensive study guides, clear explanations, and academic resources for Computer Science and Engineering students."
      />

      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-4">
          Academic Resources & Guides
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl font-light leading-relaxed">
          OpenCSE provides clear explanations, study guides, programming concepts, computer science fundamentals, and exam-oriented learning material.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-zinc-100/80 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white focus:border-transparent text-sm transition-all"
            placeholder="Search resources, topics, or guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <nav aria-label="Category Filter" className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-4 mb-10 overflow-x-auto hide-scrollbar">
        {categories.map(category => {
          const isSelected = selectedCategory === category;
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
                isSelected 
                  ? 'bg-zinc-950 text-white dark:bg-white dark:text-zinc-950' 
                  : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white'
              }`}
            >
              {category}
            </button>
          );
        })}
      </nav>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-zinc-100 dark:bg-zinc-900 h-64 rounded-2xl"></div>
          ))}
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="text-center py-20 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-2xl">
          <BookOpen className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">No resources found</h3>
          <p className="mt-2 text-sm text-zinc-500">Try adjusting your search or category filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map(resource => {
            const subject = subjects.find(s => s.id === resource.related_subject_id);
            return (
              <Link 
                to={`/resources/${resource.slug}`}
                key={resource.id} 
                className="group flex flex-col bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-mono font-bold tracking-wider uppercase text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-900 px-2 py-1 rounded">
                      {resource.category}
                    </span>
                    {subject && (
                      <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 truncate">
                        • {subject.code}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-bold font-serif text-zinc-900 dark:text-zinc-100 mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {resource.title}
                  </h3>
                  
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-6 flex-1 font-light">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800/80 mt-auto">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                      <Clock size={14} />
                      {resource.reading_time_minutes} min read
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-zinc-950 dark:text-white flex items-center gap-1 group-hover:gap-2 transition-all">
                      Read Guide <ChevronRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ResourceArticlePage() {
  const { slug } = useParams();
  const [resource, setResource] = useState<AcademicResource | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/academic-resources/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data: AcademicResource) => {
        setResource(data);
        if (data.related_subject_id) {
          fetch('/api/subjects').then(res => res.json()).then((subjects: Subject[]) => {
            const found = subjects.find(s => s.id === data.related_subject_id);
            if (found) setSubject(found);
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 w-64 rounded"></div>
          <div className="h-4 bg-zinc-200 dark:bg-zinc-800 w-96 rounded"></div>
        </div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <SEO title="Resource Not Found" description="The requested resource could not be found." />
        <h1 className="text-3xl font-serif font-bold text-zinc-900 dark:text-zinc-100 mb-4">Resource Not Found</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">The guide you are looking for does not exist or has been removed.</p>
        <Link to="/resources" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors">
          Browse All Resources
        </Link>
      </div>
    );
  }

  // Schema structured data for the article
  const schemaOrgJSONLD = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": resource.title,
    "description": resource.description,
    "datePublished": resource.created_at || new Date().toISOString(),
    "dateModified": resource.updated_at || new Date().toISOString(),
    "author": {
      "@type": "Organization",
      "name": "OpenCSE"
    }
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SEO 
        title={`${resource.title} - OpenCSE Resources`}
        description={resource.description}
      />
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>

      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-zinc-500">
          <li>
            <Link to="/resources" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Resources</Link>
          </li>
          <li><ChevronRight size={14} className="mx-1" /></li>
          <li className="font-medium text-zinc-900 dark:text-zinc-100 truncate" aria-current="page">
            {resource.title}
          </li>
        </ol>
      </nav>

      <header className="mb-12 border-b border-zinc-200 dark:border-zinc-800 pb-10">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/30">
            {resource.category}
          </span>
          <span className="text-xs font-medium text-zinc-500 flex items-center gap-1.5">
            <Clock size={14} /> {resource.reading_time_minutes} min read
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-6 leading-[1.15]">
          {resource.title}
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">
          {resource.description}
        </p>

        {subject && (
          <div className="mt-8 inline-flex items-center gap-3 p-3 pr-5 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="w-10 h-10 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg flex items-center justify-center text-zinc-500">
              <FileText size={18} />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500 mb-0.5">Related Course</div>
              <Link to={`/subject/${subject.id}`} className="text-sm font-medium text-zinc-950 dark:text-white hover:underline decoration-zinc-300 dark:decoration-zinc-700 underline-offset-4">
                {subject.code} — {subject.name}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 
        This div applies typography styles for the raw HTML.
        We ensure code blocks, tables, lists, and headings are styled appropriately. 
      */}
      <div 
        className="prose prose-zinc dark:prose-invert prose-lg max-w-none 
                   prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight
                   prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-zinc-200 dark:prose-h2:border-zinc-800
                   prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
                   prose-p:font-light prose-p:leading-relaxed prose-p:mb-6
                   prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline prose-a:underline-offset-4
                   prose-li:font-light prose-ul:list-disc prose-ol:list-decimal
                   prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800 prose-pre:rounded-xl
                   prose-code:text-emerald-600 dark:prose-code:text-emerald-400 prose-code:bg-emerald-50 dark:prose-code:bg-emerald-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                   prose-table:w-full prose-table:border-collapse prose-table:text-sm
                   prose-th:border prose-th:border-zinc-200 dark:prose-th:border-zinc-800 prose-th:bg-zinc-50 dark:prose-th:bg-zinc-900 prose-th:p-3 prose-th:text-left
                   prose-td:border prose-td:border-zinc-200 dark:prose-td:border-zinc-800 prose-td:p-3
                   prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-50/50 dark:prose-blockquote:bg-emerald-900/10 prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:not-italic prose-blockquote:rounded-r-xl
                   mb-20"
        dangerouslySetInnerHTML={{ __html: resource.content }}
      />
    </article>
  );
}
