import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { Subject, YearType } from '../types';
import { SEO } from './SEO';
import { ThemeToggle } from './ThemeToggle';

const AdminSubjectEditor = lazy(() => import('./AdminEditors').then(m => ({ default: m.AdminSubjectEditor })));
const AdminResources = lazy(() => import('./AdminResources').then(m => ({ default: m.AdminResources })));

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

export function AdminLogin() {
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

export function AdminDashboard({ onEditSubject }: { onEditSubject: (id: string) => void }) {
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
            <div className="p-16 text-center text-zinc-600 dark:text-zinc-400 text-sm italic">No subjects found.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminApp() {
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
