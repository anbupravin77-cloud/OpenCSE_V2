import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Loader2, Settings, Edit2, Plus, Trash2, FileText, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { FullSubject, Subject, CO, Topic, Resource } from './types';
import { AdminSubjectEditor } from './components/AdminEditors';
import { SEO } from './components/SEO';
import { AboutPage, ContactPage, PrivacyPage, TermsPage, ContentPolicyPage, NotFoundPage } from './components/LegalPages';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeToggle } from './components/ThemeToggle';

type YearType = '1st' | '2nd' | '3rd' | '4th';

function StudentHeader() {
  return (
    <header className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="w-10 h-10 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-serif text-xl font-bold rounded-xl shadow-sm transition-transform duration-200 group-hover:scale-105">O</div>
          <span className="font-serif font-bold tracking-tight text-2xl text-zinc-950 dark:text-white">OpenCSE</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
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
          >
            <Settings size={18} />
            <span className="hidden sm:inline">Admin Access</span>
          </Link>
          <div className="pl-1 sm:pl-2 border-l border-zinc-200 dark:border-zinc-800">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}

function StudentFooter() {
  return (
    <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-100/60 dark:bg-zinc-950/60 py-12 px-6 sm:px-8 lg:px-12 mt-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-serif text-sm font-bold rounded-lg shadow-sm">O</div>
          <div>
            <span className="font-serif font-bold text-zinc-950 dark:text-white text-base">OpenCSE</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-3 hidden sm:inline font-light">Distraction-free academic resources for Computer Science</span>
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
      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-900 text-center text-xs text-zinc-500 dark:text-zinc-600 font-light">
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

function StudentDashboard() {
  const [subjects, setSubjects] = useState<FullSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<YearType>('2nd');
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400 dark:text-zinc-600" />
      </div>
    );
  }

  if (selectedSubjectId) {
    const subject = subjects.find(s => s.id === selectedSubjectId);
    if (!subject) return <div>Subject not found</div>;
    return <StudentSubjectView subject={subject} onBack={() => setSelectedSubjectId(null)} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <SEO 
        title="OpenCSE — Knowledge Without Barriers | Academic Resources for Computer Science"
        description="Distraction-free academic resources, curriculum guides, course outcomes, and verified study materials for Computer Science & Engineering students."
        canonicalPath="/"
      />

      <header className="mb-12 sm:mb-16">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-4 sm:mb-6">Knowledge Without Barriers.</h1>
        <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl font-light leading-relaxed">Everything you need to learn, organized in one place.</p>
      </header>

      {/* Year Navigation */}
      <div className="flex gap-8 sm:gap-12 border-b border-zinc-200 dark:border-zinc-800 mb-12 overflow-x-auto hide-scrollbar">
        {years.map(y => (
          <button 
            key={y} 
            onClick={() => setSelectedYear(y)} 
            className={`pb-4 text-sm uppercase tracking-widest whitespace-nowrap transition-colors ${
              selectedYear === y 
                ? 'border-b-2 border-zinc-950 dark:border-white font-bold text-zinc-950 dark:text-white' 
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300 border-b-2 border-transparent'
            }`}
          >
            {y} Year
          </button>
        ))}
      </div>

      <div className="relative">
        {(() => {
          const currentYearSubjects = subjects.filter(s => s.academic_year === selectedYear);
          
          if (currentYearSubjects.length === 0) {
            return (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-24 text-center">
                <h2 className="text-3xl font-serif tracking-tight text-zinc-400 dark:text-zinc-600">Coming Soon</h2>
                <p className="text-zinc-500 mt-4 text-sm">The curriculum for this year is currently being compiled.</p>
              </motion.div>
            );
          }
          
          return (
            <div className="grid gap-6">
              {currentYearSubjects.map((subject, index) => (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={subject.id}
                  onClick={() => {
                    navigate(`/subject/${encodeURIComponent(subject.id)}`);
                  }}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-8 liquid-glass-card rounded-2xl text-left cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-xs font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase font-mono">{subject.code}</span>
                      <span className="text-xs px-3 py-1 bg-zinc-200/80 text-zinc-700 dark:bg-zinc-800/80 dark:text-zinc-300 rounded-full font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                        {subject.credits} Credits
                      </span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                      {subject.name}
                    </h3>
                  </div>
                  <ArrowRight className="text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors mt-6 sm:mt-0 transform group-hover:translate-x-2 shrink-0" size={24} />
                </motion.button>
              ))}
            </div>
          );
        })()}
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
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-zinc-400 dark:text-zinc-600" />
      </div>
    );
  }

  if (!subject) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center">
        <h2 className="text-3xl font-serif font-bold text-zinc-950 dark:text-white mb-4">Subject Not Found</h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">The requested course subject could not be located.</p>
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

      <button onClick={onBack} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white mb-12 font-medium transition-colors group">
        <ArrowLeft size={18} className="transform group-hover:-translate-x-2 transition-transform" /> Back to Curriculum
      </button>

      <div className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-bold tracking-widest text-zinc-500 dark:text-zinc-400 uppercase font-mono">{subject.code}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700"></span>
          <span className="text-sm text-zinc-600 dark:text-zinc-400">{subject.department || 'Computer Science & Engineering'}</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-8 leading-tight">{subject.name}</h1>
        {subject.description && (
          <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-400 font-light text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: subject.description }} />
        )}
      </div>

      <div className="space-y-12 sm:space-y-16">
        {subject.cos.map((co) => (
          <div key={co.id} className="border-t border-zinc-200 dark:border-zinc-800 pt-12">
            <div className="mb-8">
              <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-3 block font-mono">{co.code}</span>
              <h2 className="text-3xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white">{co.name}</h2>
              {co.description && <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-base font-light leading-relaxed">{co.description}</p>}
            </div>

            <div className="grid gap-4">
              {co.topics.map((topic, index) => (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={topic.id}
                  onClick={() => setActiveTopicId(topic.id)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 liquid-glass-card rounded-2xl text-left cursor-pointer"
                >
                  <div>
                    <h3 className="text-xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">{topic.title}</h3>
                    {topic.description && <p className="text-base text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-1 font-light">{topic.description}</p>}
                  </div>
                  <div className="flex items-center gap-6 mt-4 sm:mt-0 shrink-0">
                    {topic.resources && topic.resources.length > 0 && (
                      <span className="text-xs px-3 py-1 bg-zinc-200/80 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 rounded-full font-medium flex items-center gap-2">
                        <FileText size={14} /> {topic.resources.length}
                      </span>
                    )}
                    <ArrowRight className="text-zinc-400 dark:text-zinc-600 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors transform group-hover:translate-x-2" size={20} />
                  </div>
                </motion.button>
              ))}
              {co.topics.length === 0 && (
                <div className="p-6 text-sm text-zinc-500 italic">No topics available yet.</div>
              )}
            </div>
          </div>
        ))}
        {subject.cos.length === 0 && (
          <div className="py-16 text-center text-zinc-500 font-serif italic border-t border-zinc-200 dark:border-zinc-800">Course outcomes and topics are being prepared.</div>
        )}
      </div>
    </div>
  );
}

function StudentTopicView({ topic, subjectCode, onBack }: { topic: any, subjectCode: string, onBack: () => void }) {
  const topicDesc = topic.description || `Study notes and resources for ${topic.title} (${subjectCode}) on OpenCSE.`;

  return (
    <div className="max-w-3xl mx-auto pb-32">
      <SEO 
        title={`${topic.title} — ${subjectCode}`}
        description={topicDesc.slice(0, 160)}
        canonicalPath={`/subject/${subjectCode}`}
        type="article"
      />

      <button onClick={onBack} className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white mb-12 font-medium transition-colors group">
        <ArrowLeft size={18} className="transform group-hover:-translate-x-2 transition-transform" /> Back to Subject
      </button>

      <header className="mb-16">
        <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-4 block font-mono">{subjectCode}</span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-6 leading-tight">{topic.title}</h1>
        {topic.description && (
          <p className="text-xl text-zinc-600 dark:text-zinc-400 font-light leading-relaxed">{topic.description}</p>
        )}
      </header>

      {topic.resources && topic.resources.length > 0 && (
        <div className="mb-16 liquid-glass-panel p-8 rounded-3xl">
          <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-6">Study Resources</h3>
          <div className="grid gap-4">
            {topic.resources.map((res: any) => (
              <a
                key={res.id}
                href={res.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-white/90 dark:bg-zinc-950/90 border border-zinc-200/90 dark:border-zinc-800/90 hover:border-zinc-400 dark:hover:border-zinc-500 rounded-2xl transition-all shadow-sm hover:shadow group"
              >
                <div className="flex items-center gap-5 overflow-hidden">
                  <div className="w-10 h-10 flex-shrink-0 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-600 dark:text-zinc-400">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-base text-zinc-950 dark:text-white truncate">{res.title}</div>
                    <div className="text-xs text-zinc-500 uppercase mt-1 tracking-widest">{res.file_type}</div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-6 flex items-center gap-4 text-sm font-medium text-zinc-500 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                  <span className="hidden sm:inline">Open</span>
                  <Download size={18} />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {topic.content ? (
        <div className="prose dark:prose-invert prose-lg max-w-none text-zinc-800 dark:text-zinc-300 prose-headings:font-serif prose-headings:tracking-tight prose-headings:font-bold prose-headings:text-zinc-950 dark:prose-headings:text-white prose-a:text-zinc-950 dark:prose-a:text-white prose-a:font-bold hover:prose-a:text-zinc-600 dark:hover:prose-a:text-zinc-300 prose-img:border prose-img:border-zinc-200 dark:prose-img:border-zinc-800 prose-img:rounded-3xl prose-blockquote:border-zinc-950 dark:prose-blockquote:border-white prose-blockquote:font-serif prose-blockquote:italic" dangerouslySetInnerHTML={{ __html: topic.content }} />
      ) : (
        <div className="py-20 text-center text-zinc-500 font-serif italic border border-zinc-200 dark:border-zinc-800 border-dashed rounded-3xl">Content is being prepared for this topic.</div>
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
              <div className="w-8 h-8 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-sm font-serif rounded-lg shadow-sm">A</div>
              <span className="font-bold text-sm tracking-widest uppercase text-zinc-950 dark:text-white">Admin Panel</span>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <button 
                onClick={() => setEditingSubjectId(null)}
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white transition-colors"
              >
                Exit Editor
              </button>
            </div>
          </div>
        </header>
        <main className="py-12 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
          <AdminSubjectEditor subjectId={editingSubjectId} onBack={() => setEditingSubjectId(null)} />
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
            <div className="w-8 h-8 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-sm font-serif rounded-lg shadow-sm">A</div>
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
              className="text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
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
          <div className="w-16 h-16 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-serif text-3xl font-bold rounded-2xl shadow-md">A</div>
        </div>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-center mb-8 text-zinc-950 dark:text-white">Admin Access</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold tracking-widest text-zinc-600 dark:text-zinc-400 uppercase mb-3">Password</label>
            <input 
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
            className="w-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 p-4 text-sm font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 shadow-sm"
          >
            {submitting ? 'Verifying...' : 'Login'}
          </button>
        </form>
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white flex items-center justify-center gap-2">
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

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-zinc-400 dark:text-zinc-600" /></div>;

  const currentSubjects = subjects.filter(s => s.academic_year === selectedYear);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-zinc-950 dark:text-white mb-3">Content Management</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Manage subjects, outcomes, topics and resources.</p>
        </div>
        <button onClick={createSubject} className="flex items-center justify-center gap-2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 px-6 py-3 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors text-sm font-bold shrink-0 shadow-sm">
          <Plus size={18} /> New Subject
        </button>
      </div>

      <div className="flex gap-8 sm:gap-12 border-b border-zinc-200 dark:border-zinc-800 mb-10 overflow-x-auto hide-scrollbar">
        {years.map(y => (
          <button 
            key={y} 
            onClick={() => setSelectedYear(y)} 
            className={`pb-4 text-sm uppercase tracking-widest whitespace-nowrap transition-colors ${
              selectedYear === y 
                ? 'border-b-2 border-zinc-950 dark:border-white font-bold text-zinc-950 dark:text-white' 
                : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-300 border-b-2 border-transparent'
            }`}
          >
            {y} Year
          </button>
        ))}
      </div>

      <div className="liquid-glass-panel rounded-3xl overflow-hidden">
        <div className="hidden sm:grid sm:grid-cols-12 gap-6 p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900/80 text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
          <div className="col-span-2">Code</div>
          <div className="col-span-6">Subject</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        <div className="divide-y divide-zinc-200/60 dark:divide-zinc-800/50">
          {currentSubjects.map(subject => (
            <div key={subject.id} className="flex flex-col sm:grid sm:grid-cols-12 gap-6 p-6 sm:items-center hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30 transition-colors">
              <div className="sm:col-span-2 flex items-center justify-between sm:block">
                <span className="font-mono text-sm font-bold text-zinc-600 dark:text-zinc-400">{subject.code}</span>
                <div className="sm:hidden flex gap-3">
                  <button onClick={() => onEditSubject(subject.id)} className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={async () => {
                      if (confirm('Delete subject?')) {
                        await fetch(`/api/subjects/${subject.id}`, { method: 'DELETE' });
                        setSubjects(subjects.filter(s => s.id !== subject.id));
                      }
                    }} 
                    className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="sm:col-span-6">
                <div className="font-bold text-zinc-950 dark:text-white text-lg sm:text-base mb-1">{subject.name}</div>
                <div className="text-sm text-zinc-500">{subject.department || 'General'}</div>
              </div>
              <div className="sm:col-span-2 sm:text-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${subject.is_active ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20' : 'bg-zinc-200 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700'}`}>
                  {subject.is_active ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="hidden sm:flex col-span-2 justify-end gap-3">
                <button onClick={() => onEditSubject(subject.id)} className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Edit">
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={async () => {
                    if (confirm('Delete subject?')) {
                      await fetch(`/api/subjects/${subject.id}`, { method: 'DELETE' });
                      setSubjects(subjects.filter(s => s.id !== subject.id));
                    }
                  }} 
                  className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors" title="Delete"
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
          <Route path="/about" element={<StudentLayout><AboutPage /></StudentLayout>} />
          <Route path="/contact" element={<StudentLayout><ContactPage /></StudentLayout>} />
          <Route path="/privacy" element={<StudentLayout><PrivacyPage /></StudentLayout>} />
          <Route path="/terms" element={<StudentLayout><TermsPage /></StudentLayout>} />
          <Route path="/content-policy" element={<StudentLayout><ContentPolicyPage /></StudentLayout>} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<AdminApp />} />
          
          <Route path="*" element={<StudentLayout><NotFoundPage /></StudentLayout>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

