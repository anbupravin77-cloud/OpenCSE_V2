import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Loader2, BookOpen, Settings, Eye, Edit2, Plus, Trash2, FileText, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FullSubject, Subject, CO, Topic, Resource } from './types';
import { AdminSubjectEditor } from './components/AdminEditors';

type YearType = '1st' | '2nd' | '3rd' | '4th';

function StudentApp() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white text-zinc-950 flex items-center justify-center font-serif text-xl font-bold rounded-xl">O</div>
            <span className="font-serif font-bold tracking-tight text-2xl text-white">OpenCSE</span>
          </Link>
          <Link 
            to="/admin"
            className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <Settings size={18} />
            <span className="hidden sm:inline">Admin Access</span>
          </Link>
        </div>
      </header>

      <main className="py-12 sm:py-20 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
        <StudentDashboard />
      </main>
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
      <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans">
        <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white text-zinc-950 flex items-center justify-center font-bold text-sm font-serif rounded-lg">A</div>
              <span className="font-bold text-sm tracking-widest uppercase text-white">Admin Panel</span>
            </div>
            <button 
              onClick={() => setEditingSubjectId(null)}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Exit Editor
            </button>
          </div>
        </header>
        <main className="py-12 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto">
          <AdminSubjectEditor subjectId={editingSubjectId} onBack={() => setEditingSubjectId(null)} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans">
      <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white text-zinc-950 flex items-center justify-center font-bold text-sm font-serif rounded-lg">A</div>
            <span className="font-bold text-sm tracking-widest uppercase text-white">Admin Panel</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Student View
            </Link>
            <button 
              onClick={() => {
                sessionStorage.removeItem('admin_auth');
                navigate('/');
              }}
              className="text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
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
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin') {
      sessionStorage.setItem('admin_auth', 'true');
      navigate('/admin');
    } else {
      setError('Incorrect password. Hint: admin');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col justify-center items-center p-6 font-sans text-zinc-50">
      <div className="bg-zinc-900/50 p-10 border border-zinc-800 w-full max-w-md rounded-2xl shadow-xl">
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 bg-white text-zinc-950 flex items-center justify-center font-serif text-3xl font-bold rounded-xl">A</div>
        </div>
        <h1 className="text-3xl font-serif font-bold tracking-tight text-center mb-8 text-white">Admin Access</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-3">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 p-4 text-sm focus:outline-none focus:border-zinc-500 rounded-xl transition-colors text-white"
              placeholder="Enter password"
            />
          </div>
          {error && <div className="text-red-400 text-sm font-medium">{error}</div>}
          <button type="submit" className="w-full bg-white text-zinc-950 p-4 text-sm font-bold rounded-xl hover:bg-zinc-200 transition-colors">
            Login
          </button>
        </form>
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-zinc-400 hover:text-white flex items-center justify-center gap-2">
            <ArrowLeft size={16} /> Back to Student View
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentApp />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </Router>
  );
}

function StudentDashboard() {
  const [subjects, setSubjects] = useState<FullSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<YearType>('2nd');

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
        <Loader2 className="w-8 h-8 animate-spin text-zinc-600" />
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
      <header className="mb-16">
        <h1 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-white mb-6">Curriculum</h1>
        <p className="text-xl text-zinc-400 max-w-2xl font-light leading-relaxed">Academic resources and course materials.</p>
      </header>

      {/* Year Navigation */}
      <div className="flex gap-8 sm:gap-12 border-b border-zinc-800 mb-12 overflow-x-auto hide-scrollbar">
        {years.map(y => (
          <button 
            key={y} 
            onClick={() => setSelectedYear(y)} 
            className={`pb-4 text-sm uppercase tracking-widest whitespace-nowrap transition-colors ${selectedYear === y ? 'border-b-2 border-white font-bold text-white' : 'text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent'}`}
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
                <h2 className="text-3xl font-serif tracking-tight text-zinc-600">Coming Soon</h2>
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
                  onClick={() => setSelectedSubjectId(subject.id)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-8 bg-zinc-900/40 border border-zinc-800 hover:border-zinc-500 rounded-2xl transition-all text-left"
                >
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">{subject.code}</span>
                      <span className="text-xs px-3 py-1 bg-zinc-800 text-zinc-300 rounded-full font-medium">{subject.credits} Credits</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold tracking-tight text-white group-hover:text-zinc-300 transition-colors">{subject.name}</h3>
                  </div>
                  <ArrowRight className="text-zinc-600 group-hover:text-white transition-colors mt-6 sm:mt-0 transform group-hover:translate-x-2" size={24} />
                </motion.button>
              ))}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

function StudentSubjectView({ subject, onBack }: { subject: FullSubject, onBack: () => void }) {
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);

  if (activeTopicId) {
    const topic = subject.cos.flatMap(co => co.topics).find(t => t.id === activeTopicId);
    if (!topic) return null;
    return <StudentTopicView topic={topic} subjectCode={subject.code} onBack={() => setActiveTopicId(null)} />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white mb-12 font-medium transition-colors group">
        <ArrowLeft size={18} className="transform group-hover:-translate-x-2 transition-transform" /> Back to Curriculum
      </button>

      <div className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-bold tracking-widest text-zinc-400 uppercase">{subject.code}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-700"></span>
          <span className="text-sm text-zinc-400">{subject.department}</span>
        </div>
        <h1 className="text-5xl sm:text-6xl font-serif font-bold tracking-tight text-white mb-8 leading-tight">{subject.name}</h1>
        {subject.description && (
          <div className="prose prose-invert max-w-none text-zinc-400 font-light text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: subject.description }} />
        )}
      </div>

      <div className="space-y-12 sm:space-y-16">
        {subject.cos.map((co, index) => (
          <div key={co.id} className="border-t border-zinc-800 pt-12">
            <div className="mb-8">
              <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-3 block">{co.code}</span>
              <h2 className="text-3xl font-serif font-bold tracking-tight text-white">{co.name}</h2>
              {co.description && <p className="text-zinc-400 mt-3 text-base font-light leading-relaxed">{co.description}</p>}
            </div>

            <div className="grid gap-4">
              {co.topics.map((topic, index) => (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={topic.id}
                  onClick={() => setActiveTopicId(topic.id)}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 sm:p-8 bg-zinc-900/40 border border-zinc-800 hover:border-zinc-500 rounded-2xl transition-all text-left"
                >
                  <div>
                    <h3 className="text-xl font-serif font-bold tracking-tight text-white">{topic.title}</h3>
                    {topic.description && <p className="text-base text-zinc-400 mt-2 line-clamp-1">{topic.description}</p>}
                  </div>
                  <div className="flex items-center gap-6 mt-4 sm:mt-0">
                    {topic.resources && topic.resources.length > 0 && (
                      <span className="text-sm font-medium text-zinc-500 flex items-center gap-2">
                        <FileText size={16} /> {topic.resources.length}
                      </span>
                    )}
                    <ArrowRight className="text-zinc-600 group-hover:text-white transition-colors transform group-hover:translate-x-2" size={20} />
                  </div>
                </motion.button>
              ))}
              {co.topics.length === 0 && (
                <div className="p-6 text-sm text-zinc-600 italic">No topics available yet.</div>
              )}
            </div>
          </div>
        ))}
        {subject.cos.length === 0 && (
          <div className="py-16 text-center text-zinc-600 font-serif italic border-t border-zinc-800">Course outcomes and topics are being prepared.</div>
        )}
      </div>
    </div>
  );
}

function StudentTopicView({ topic, subjectCode, onBack }: { topic: any, subjectCode: string, onBack: () => void }) {
  return (
    <div className="max-w-3xl mx-auto pb-32">
      <button onClick={onBack} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white mb-12 font-medium transition-colors group">
        <ArrowLeft size={18} className="transform group-hover:-translate-x-2 transition-transform" /> Back to Subject
      </button>

      <header className="mb-16">
        <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-4 block">{subjectCode}</span>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-white mb-6 leading-tight">{topic.title}</h1>
        {topic.description && (
          <p className="text-xl text-zinc-400 font-light leading-relaxed">{topic.description}</p>
        )}
      </header>

      {topic.resources && topic.resources.length > 0 && (
        <div className="mb-16 bg-zinc-900/40 p-8 border border-zinc-800 rounded-3xl">
          <h3 className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-6">Study Resources</h3>
          <div className="grid gap-4">
            {topic.resources.map((res: any) => (
              <a
                key={res.id}
                href={res.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-5 bg-zinc-950 border border-zinc-800 hover:border-zinc-500 rounded-2xl transition-colors group"
              >
                <div className="flex items-center gap-5 overflow-hidden">
                  <div className="w-10 h-10 flex-shrink-0 bg-zinc-900 rounded-xl flex items-center justify-center text-zinc-400">
                    <FileText size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-base text-white truncate">{res.title}</div>
                    <div className="text-xs text-zinc-500 uppercase mt-1 tracking-widest">{res.file_type}</div>
                  </div>
                </div>
                <div className="flex-shrink-0 ml-6 flex items-center gap-4 text-sm font-medium text-zinc-500 group-hover:text-white transition-colors">
                  <span className="hidden sm:inline">Open</span>
                  <Download size={18} />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {topic.content ? (
        <div className="prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:tracking-tight prose-headings:font-bold prose-headings:text-white prose-a:text-white prose-a:font-bold hover:prose-a:text-zinc-300 prose-img:border prose-img:border-zinc-800 prose-img:rounded-3xl prose-blockquote:border-white prose-blockquote:font-serif prose-blockquote:italic" dangerouslySetInnerHTML={{ __html: topic.content }} />
      ) : (
        <div className="py-20 text-center text-zinc-600 font-serif italic border border-zinc-800 border-dashed rounded-3xl">Content is being prepared for this topic.</div>
      )}
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

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-zinc-600" /></div>;

  const currentSubjects = subjects.filter(s => s.academic_year === selectedYear);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-serif font-bold tracking-tight text-white mb-3">Content Management</h1>
          <p className="text-zinc-400">Manage subjects, outcomes, topics and resources.</p>
        </div>
        <button onClick={createSubject} className="flex items-center justify-center gap-2 bg-white text-zinc-950 px-6 py-3 rounded-xl hover:bg-zinc-200 transition-colors text-sm font-bold shrink-0">
          <Plus size={18} /> New Subject
        </button>
      </div>

      <div className="flex gap-8 sm:gap-12 border-b border-zinc-800 mb-10 overflow-x-auto hide-scrollbar">
        {years.map(y => (
          <button 
            key={y} 
            onClick={() => setSelectedYear(y)} 
            className={`pb-4 text-sm uppercase tracking-widest whitespace-nowrap transition-colors ${selectedYear === y ? 'border-b-2 border-white font-bold text-white' : 'text-zinc-500 hover:text-zinc-300 border-b-2 border-transparent'}`}
          >
            {y} Year
          </button>
        ))}
      </div>

      <div className="bg-zinc-900/40 border border-zinc-800 rounded-3xl overflow-hidden">
        <div className="hidden sm:grid sm:grid-cols-12 gap-6 p-6 border-b border-zinc-800 bg-zinc-900/80 text-xs font-bold text-zinc-500 uppercase tracking-widest">
          <div className="col-span-2">Code</div>
          <div className="col-span-6">Subject</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        <div className="divide-y divide-zinc-800/50">
          {currentSubjects.map(subject => (
            <div key={subject.id} className="flex flex-col sm:grid sm:grid-cols-12 gap-6 p-6 sm:items-center hover:bg-zinc-800/30 transition-colors">
              <div className="sm:col-span-2 flex items-center justify-between sm:block">
                <span className="font-mono text-sm font-bold text-zinc-400">{subject.code}</span>
                <div className="sm:hidden flex gap-3">
                  <button onClick={() => onEditSubject(subject.id)} className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors" title="Edit">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={async () => {
                      if (confirm('Delete subject?')) {
                        await fetch(`/api/subjects/${subject.id}`, { method: 'DELETE' });
                        setSubjects(subjects.filter(s => s.id !== subject.id));
                      }
                    }} 
                    className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition-colors" title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="sm:col-span-6">
                <div className="font-bold text-white text-lg sm:text-base mb-1">{subject.name}</div>
                <div className="text-sm text-zinc-500">{subject.department || 'General'}</div>
              </div>
              <div className="sm:col-span-2 sm:text-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${subject.is_active ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                  {subject.is_active ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="hidden sm:flex col-span-2 justify-end gap-3">
                <button onClick={() => onEditSubject(subject.id)} className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors" title="Edit">
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={async () => {
                    if (confirm('Delete subject?')) {
                      await fetch(`/api/subjects/${subject.id}`, { method: 'DELETE' });
                      setSubjects(subjects.filter(s => s.id !== subject.id));
                    }
                  }} 
                  className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition-colors" title="Delete"
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
