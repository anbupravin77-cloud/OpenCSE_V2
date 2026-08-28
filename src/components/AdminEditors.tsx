import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, Edit2, CheckCircle2, Save, MoveUp, MoveDown, BookOpen, ArrowRight, Menu, X } from 'lucide-react';
import { FullSubject, Subject, CO, Topic, Resource } from '../types';
import RichTextEditor from './RichTextEditor';
import ResourceUploader from './ResourceUploader';

export function AdminSubjectEditor({ subjectId, onBack }: { subjectId: string, onBack: () => void }) {
  const [subject, setSubject] = useState<Subject | null>(null);
  const [cos, setCos] = useState<CO[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'INFO' | 'CONTENT'>('INFO');
  const [activeCoId, setActiveCoId] = useState<string | null>(null);
  const [activeTopicId, setActiveTopicId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch(`/api/subjects`).then(r => r.json()).then(data => {
      setSubject(data.find((s: Subject) => s.id === subjectId) || null);
    });
    fetch(`/api/cos/${subjectId}`).then(r => r.json()).then(data => {
      setCos(data);
    });
  }, [subjectId]);

  useEffect(() => {
    if (activeCoId) {
      fetch(`/api/topics/${activeCoId}`).then(r => r.json()).then(setTopics);
    } else {
      setTopics([]);
    }
  }, [activeCoId]);

  const saveSubject = async () => {
    if (!subject) return;
    setSaving(true);
    await fetch(`/api/subjects/${subject.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subject)
    });
    setSaving(false);
  };

  if (!subject) return <div className="py-20 text-center text-sm text-zinc-500">Loading editor...</div>;

  if (activeTopicId) {
    return <AdminTopicEditor topicId={activeTopicId} onBack={() => setActiveTopicId(null)} />;
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-500 hover:text-white mb-4 uppercase transition-colors">
            <ArrowLeft size={14} /> Back
          </button>
          <h2 className="text-3xl font-serif font-bold tracking-tighter text-white">Edit Subject</h2>
        </div>
        <button onClick={saveSubject} disabled={saving} className="flex items-center justify-center gap-2 bg-white text-zinc-950 px-5 py-2.5 rounded-xl hover:bg-zinc-200 transition-colors text-sm font-bold w-full sm:w-auto">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 flex flex-col md:flex-row min-h-[600px] items-stretch rounded-2xl overflow-hidden">
        {/* Mobile Header / Drawer Toggle */}
        <div className="md:hidden border-b border-zinc-800 bg-zinc-900 p-4 flex items-center justify-between">
          <span className="font-bold text-sm text-zinc-300 tracking-widest uppercase">
            {activeTab === 'INFO' ? 'Information' : cos.find(c => c.id === activeCoId)?.code || 'Content'}
          </span>
          <button onClick={() => setMobileMenuOpen(true)} className="text-zinc-500 hover:text-white transition-colors -mr-2 p-2" aria-label="Open navigation menu">
            <Menu size={20} />
          </button>
        </div>

        {/* Mobile Drawer Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-[100] flex">
            <div className="fixed inset-0 bg-black/80 transition-opacity" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative flex flex-col w-64 max-w-[80%] bg-zinc-950 h-full border-r border-zinc-800 shadow-xl overflow-hidden">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900">
                <span className="font-bold text-sm tracking-widest uppercase text-zinc-300">Navigation</span>
                <button onClick={() => setMobileMenuOpen(false)} className="text-zinc-500 hover:text-white transition-colors -mr-2 p-2" aria-label="Close navigation menu">
                  <X size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto flex-1 flex flex-col">
                <button onClick={() => { setActiveTab('INFO'); setMobileMenuOpen(false); }} className={`p-4 text-left font-bold text-sm transition-colors ${activeTab === 'INFO' ? 'bg-zinc-900 border-l-2 border-white text-white' : 'text-zinc-500 hover:bg-zinc-900 border-l-2 border-transparent'}`}>
                  Subject Information
                </button>
                
                <div className="px-4 py-3 text-xs font-bold text-zinc-600 uppercase tracking-widest mt-4">Course Outcomes</div>
                
                {cos.map((co) => (
                  <button key={co.id} onClick={() => { setActiveTab('CONTENT'); setActiveCoId(co.id); setMobileMenuOpen(false); }} className={`p-4 text-left text-sm transition-colors flex items-center justify-between group ${activeTab === 'CONTENT' && activeCoId === co.id ? 'bg-zinc-900 border-l-2 border-white text-white font-bold' : 'text-zinc-500 hover:bg-zinc-900 border-l-2 border-transparent'}`}>
                    <span className="truncate pr-2">{co.code}</span>
                  </button>
                ))}
                
                <button 
                  onClick={async () => {
                    const res = await fetch('/api/cos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject_id: subjectId, code: `CO${cos.length + 1}`, name: 'New Outcome', display_order: cos.length + 1 }) });
                    const newCo = await res.json();
                    setCos([...cos, newCo]);
                    setActiveCoId(newCo.id);
                    setActiveTab('CONTENT');
                    setMobileMenuOpen(false);
                  }}
                  className="p-4 text-left text-sm text-zinc-500 hover:text-white hover:bg-zinc-900 font-bold flex items-center gap-2 border-l-2 border-transparent mt-2"
                >
                  <Plus size={16} /> Add Outcome
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden md:flex w-64 bg-zinc-900/50 border-r border-zinc-800 flex-col shrink-0">
          <button onClick={() => setActiveTab('INFO')} className={`p-4 text-left font-bold text-sm transition-colors ${activeTab === 'INFO' ? 'bg-zinc-800/50 border-l-2 border-white text-white' : 'text-zinc-500 hover:bg-zinc-800/50 border-l-2 border-transparent'}`}>
            Subject Information
          </button>
          <div className="px-4 py-3 text-xs font-bold text-zinc-600 uppercase tracking-widest mt-4">Course Outcomes</div>
          {cos.map((co) => (
            <button key={co.id} onClick={() => { setActiveTab('CONTENT'); setActiveCoId(co.id); }} className={`p-4 text-left text-sm transition-colors flex items-center justify-between group ${activeTab === 'CONTENT' && activeCoId === co.id ? 'bg-zinc-800/50 border-l-2 border-white text-white font-bold' : 'text-zinc-500 hover:bg-zinc-800/50 border-l-2 border-transparent'}`}>
              <span className="truncate pr-2">{co.code}</span>
            </button>
          ))}
          <button 
            onClick={async () => {
              const res = await fetch('/api/cos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subject_id: subjectId, code: `CO${cos.length + 1}`, name: 'New Outcome', display_order: cos.length + 1 }) });
              const newCo = await res.json();
              setCos([...cos, newCo]);
              setActiveCoId(newCo.id);
              setActiveTab('CONTENT');
            }}
            className="p-4 text-left text-sm text-zinc-500 hover:text-white hover:bg-zinc-800/50 font-bold flex items-center gap-2 border-l-2 border-transparent mt-2"
          >
            <Plus size={16} /> Add Outcome
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-5 sm:p-8 bg-zinc-950 min-w-0">
          {activeTab === 'INFO' && (
            <div className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Subject Code</label>
                  <input type="text" value={subject.code} onChange={e => setSubject({ ...subject, code: e.target.value })} className="w-full bg-zinc-950 px-4 py-3 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Status</label>
                  <select value={subject.is_active ? 'true' : 'false'} onChange={e => setSubject({ ...subject, is_active: e.target.value === 'true' })} className="w-full bg-zinc-950 px-4 py-3 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-sm text-white">
                    <option value="true">Active (Published)</option>
                    <option value="false">Draft (Hidden)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Subject Name</label>
                <input type="text" value={subject.name} onChange={e => setSubject({ ...subject, name: e.target.value })} className="w-full bg-zinc-950 px-4 py-3 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-sm text-white" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Academic Year</label>
                  <select value={subject.academic_year || '2nd'} onChange={e => setSubject({ ...subject, academic_year: e.target.value })} className="w-full bg-zinc-950 px-4 py-3 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-sm text-white">
                    <option value="1st">1st Year</option>
                    <option value="2nd">2nd Year</option>
                    <option value="3rd">3rd Year</option>
                    <option value="4th">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Department</label>
                  <input type="text" value={subject.department || ''} onChange={e => setSubject({ ...subject, department: e.target.value })} className="w-full bg-zinc-950 px-4 py-3 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-sm text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Semester</label>
                  <input type="text" value={subject.semester || ''} onChange={e => setSubject({ ...subject, semester: e.target.value })} className="w-full bg-zinc-950 px-4 py-3 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-sm text-white" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Description</label>
                <div className="border border-zinc-800 rounded-xl overflow-hidden focus-within:border-zinc-500 transition-colors">
                  <RichTextEditor content={subject.description} onChange={content => setSubject({ ...subject, description: content })} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'CONTENT' && activeCoId && (
            <AdminCOEditor 
              coId={activeCoId} 
              topics={topics} 
              onTopicsChange={setTopics} 
              onEditTopic={setActiveTopicId}
              onCoDeleted={() => {
                setCos(cos.filter(c => c.id !== activeCoId));
                setActiveCoId(null);
                setActiveTab('INFO');
              }}
              onCoUpdated={(updated) => {
                setCos(cos.map(c => c.id === updated.id ? updated : c));
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function AdminCOEditor({ coId, topics, onTopicsChange, onEditTopic, onCoDeleted, onCoUpdated }: { coId: string, topics: Topic[], onTopicsChange: (t: Topic[]) => void, onEditTopic: (id: string) => void, onCoDeleted: () => void, onCoUpdated: (co: CO) => void }) {
  const [co, setCo] = useState<CO | null>(null);

  useEffect(() => {
    fetch(`/api/subjects`).then(r => r.json()).then(subjects => {
      let found = false;
      for (const s of subjects) {
        fetch(`/api/cos/${s.id}`).then(r => r.json()).then(cos => {
          const matched = cos.find((c: CO) => c.id === coId);
          if (matched && !found) {
            found = true;
            setCo(matched);
          }
        });
      }
    });
  }, [coId]);

  if (!co) return <div className="text-sm text-zinc-500">Loading outcome...</div>;

  const handleUpdate = async (field: keyof CO, value: string) => {
    const updated = { ...co, [field]: value };
    setCo(updated);
    await fetch(`/api/cos/${co.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updated) });
    onCoUpdated(updated);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this CO and ALL its topics?')) return;
    await fetch(`/api/cos/${co.id}`, { method: 'DELETE' });
    onCoDeleted();
  };

  const handleAddTopic = async () => {
    const res = await fetch('/api/topics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject_id: co.subject_id, co_id: co.id, title: 'New Topic', display_order: topics.length + 1, content: '' })
    });
    const newTopic = await res.json();
    onTopicsChange([...topics, newTopic]);
    onEditTopic(newTopic.id);
  };

  return (
    <div className="space-y-10">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-serif font-bold tracking-tighter text-white">Outcome Settings</h3>
          <button onClick={handleDelete} className="text-xs font-bold text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1">
            <Trash2 size={14} /> Delete CO
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="sm:col-span-1">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Code</label>
            <input type="text" value={co.code} onChange={e => handleUpdate('code', e.target.value)} className="w-full bg-zinc-950 px-4 py-3 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-sm text-white" />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Name / Description</label>
            <input type="text" value={co.name} onChange={e => handleUpdate('name', e.target.value)} className="w-full bg-zinc-950 px-4 py-3 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-sm text-white" />
          </div>
        </div>
      </div>

      <div className="border-t border-zinc-800 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-serif font-bold tracking-tighter text-white">Topics</h3>
          <button onClick={handleAddTopic} className="flex items-center gap-1.5 bg-zinc-800 text-white px-4 py-2 rounded-lg hover:bg-zinc-700 transition-colors text-xs font-bold uppercase tracking-widest">
            <Plus size={14} /> Add Topic
          </button>
        </div>
        
        <div className="space-y-3">
          {topics.map(topic => (
            <div key={topic.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-zinc-600 transition-colors gap-4">
              <div className="font-bold text-white text-sm truncate">{topic.title}</div>
              <button onClick={() => onEditTopic(topic.id)} className="flex items-center gap-2 text-zinc-400 hover:text-white font-bold text-sm transition-colors w-fit">
                Edit Content <ArrowRight size={16} />
              </button>
            </div>
          ))}
          {topics.length === 0 && <div className="p-4 border border-dashed border-zinc-800 rounded-xl text-zinc-600 text-sm italic text-center">No topics created for this outcome.</div>}
        </div>
      </div>
    </div>
  );
}

function AdminTopicEditor({ topicId, onBack }: { topicId: string, onBack: () => void }) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [resources, setResources] = useState<Resource[]>([]);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    fetch('/api/full-subjects').then(r => r.json()).then(data => {
      for (const s of data) {
        for (const co of s.cos) {
          const t = co.topics.find((t: any) => t.id === topicId);
          if (t) {
            setTopic(t);
            setResources(t.resources || []);
            setHasUnsavedChanges(false);
            return;
          }
        }
      }
    });
  }, [topicId]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const saveTopic = async () => {
    if (!topic) return;
    setSaving(true);
    await fetch(`/api/topics/${topic.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...topic, resources: undefined })
    });
    setSaving(false);
    setHasUnsavedChanges(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this topic and its resources?')) return;
    await fetch(`/api/topics/${topicId}`, { method: 'DELETE' });
    onBack();
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (!confirm('You have unsaved changes. Leave without saving?')) {
        return;
      }
    }
    onBack();
  };

  const handleContentChange = (content: string) => {
    setTopic(prev => prev ? { ...prev, content } : prev);
    setHasUnsavedChanges(true);
  };

  if (!topic) return <div className="py-20 text-center text-sm text-zinc-500">Loading topic...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <button onClick={handleBack} className="flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-500 hover:text-white mb-4 uppercase transition-colors">
            <ArrowLeft size={14} /> Back to Subject
          </button>
          <h2 className="text-3xl font-serif font-bold tracking-tighter text-white">Edit Topic</h2>
        </div>
        <div className="flex gap-3">
          <button onClick={handleDelete} className="flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-red-400 px-4 py-2 rounded-xl hover:bg-zinc-800 transition-colors text-sm font-bold">
            <Trash2 size={16} /> <span className="hidden sm:inline">Delete</span>
          </button>
          <button onClick={saveTopic} disabled={saving} className="flex items-center justify-center gap-2 bg-white text-zinc-950 px-5 py-2 rounded-xl hover:bg-zinc-200 transition-colors text-sm font-bold">
            <Save size={16} /> {saving ? 'Saving...' : 'Save Topic'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Topic Title</label>
          <input 
            type="text" 
            value={topic.title} 
            onChange={e => { setTopic({ ...topic, title: e.target.value }); setHasUnsavedChanges(true); }} 
            className="w-full bg-zinc-950 px-4 py-3 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 font-bold text-lg text-white" 
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Short Description (Optional)</label>
          <input 
            type="text" 
            value={topic.description || ''} 
            onChange={e => { setTopic({ ...topic, description: e.target.value }); setHasUnsavedChanges(true); }} 
            className="w-full bg-zinc-950 px-4 py-3 border border-zinc-800 rounded-xl focus:outline-none focus:border-zinc-500 text-sm text-white" 
            placeholder="Brief summary" 
          />
        </div>

        <div className="border border-zinc-800 rounded-xl overflow-hidden focus-within:border-zinc-500 transition-colors min-h-[500px] flex flex-col">
          <div className="bg-zinc-900 border-b border-zinc-800 flex items-center">
            <button 
              onClick={() => setMode('edit')}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${mode === 'edit' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Edit
            </button>
            <button 
              onClick={() => setMode('preview')}
              className={`px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${mode === 'preview' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              Preview
            </button>
          </div>
          <div className="flex-1 bg-zinc-950">
            {mode === 'edit' ? (
              <RichTextEditor content={topic.content} onChange={handleContentChange} />
            ) : (
              <div className="p-6 sm:p-8 bg-white dark:bg-zinc-950 min-h-[500px]">
                {topic.content ? (
                  <article 
                    className="prose dark:prose-invert prose-base sm:prose-lg max-w-none text-zinc-800 dark:text-zinc-300 prose-headings:font-serif prose-headings:tracking-tight prose-headings:font-bold prose-headings:text-zinc-950 dark:prose-headings:text-white prose-a:text-zinc-950 dark:prose-a:text-white prose-a:font-bold hover:prose-a:text-zinc-600 dark:hover:prose-a:text-zinc-300 prose-img:border prose-img:border-zinc-200 dark:prose-img:border-zinc-800 prose-img:rounded-2xl prose-blockquote:border-zinc-950 dark:prose-blockquote:border-white prose-blockquote:font-serif prose-blockquote:italic" 
                    dangerouslySetInnerHTML={{ __html: topic.content }} 
                  />
                ) : (
                  <div className="py-14 text-center text-zinc-500 font-serif italic border border-zinc-200 dark:border-zinc-800 border-dashed rounded-2xl p-6">
                    <p className="text-sm sm:text-base">No content provided yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-8 mt-12">
          <label className="block text-sm font-sans font-bold tracking-widest uppercase text-zinc-400 mb-2">Learning Resources</label>
          <p className="text-sm text-zinc-500 mb-6">Upload PDFs, Presentations, and Documents related to this topic.</p>
          <ResourceUploader 
            resources={resources} 
            onUpload={async (fileUrl, fileName, fileType, mimeType, fileSize) => {
              const res = await fetch('/api/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  subject_id: topic.subject_id,
                  topic_id: topic.id,
                  title: fileName,
                  file_name: fileName,
                  file_url: fileUrl,
                  file_type: fileType,
                  mime_type: mimeType,
                  file_size: fileSize,
                  display_order: resources.length + 1
                })
              });
              const newRes = await res.json();
              setResources([...resources, newRes]);
            }}
            onDelete={async (id) => {
              if(!confirm('Delete this resource?')) return;
              await fetch(`/api/resources/${id}`, { method: 'DELETE' });
              setResources(resources.filter(r => r.id !== id));
            }}
          />
        </div>
      </div>
    </div>
  );
}
