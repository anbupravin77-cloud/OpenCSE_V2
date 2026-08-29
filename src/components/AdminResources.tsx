import React, { useState, useEffect } from 'react';
import { AcademicResource, Subject } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Edit2, Trash2, ExternalLink, Save, X, BookOpen } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

export function AdminResources() {
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [editingResource, setEditingResource] = useState<AcademicResource | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetch('/api/academic-resources').then(res => res.json()).then(setResources);
    fetch('/api/subjects').then(res => res.json()).then(setSubjects);
  }, []);

  const handleSave = (resource: AcademicResource) => {
    if (isCreating) {
      fetch('/api/academic-resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resource)
      })
      .then(res => res.json())
      .then(saved => {
        setResources([...resources, saved]);
        setIsCreating(false);
        setEditingResource(null);
      });
    } else {
      fetch(`/api/academic-resources/${resource.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resource)
      })
      .then(res => res.json())
      .then(saved => {
        setResources(resources.map(r => r.id === saved.id ? saved : r));
        setEditingResource(null);
      });
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      fetch(`/api/academic-resources/${id}`, { method: 'DELETE' })
        .then(() => {
          setResources(resources.filter(r => r.id !== id));
        });
    }
  };

  if (editingResource) {
    return <ResourceEditor 
             resource={editingResource} 
             subjects={subjects}
             onSave={handleSave} 
             onCancel={() => {
               setEditingResource(null);
               setIsCreating(false);
             }} 
           />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <BookOpen className="text-zinc-400" />
          Academic Resources
        </h2>
        <button
          onClick={() => {
            setIsCreating(true);
            setEditingResource({
              id: '',
              title: '',
              slug: '',
              category: 'Guide',
              description: '',
              content: '',
              reading_time_minutes: 5,
              status: 'DRAFT'
            });
          }}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 rounded-xl font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors"
        >
          <Plus size={16} /> Create Resource
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 font-medium uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {resources.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-zinc-600">
                    No resources found. Create one to get started.
                  </td>
                </tr>
              ) : resources.map(resource => (
                <tr key={resource.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{resource.title}</div>
                    <div className="text-zinc-500 mt-1">/{resource.slug}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2 py-1 rounded text-xs font-medium">
                      {resource.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      resource.status === 'PUBLISHED' 
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {resource.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <a 
                        href={`/resources/${resource.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-zinc-600 hover:text-emerald-600 dark:hover:text-emerald-400 bg-zinc-100 dark:bg-zinc-800 rounded-lg transition-colors"
                        title="Preview"
                      >
                        <ExternalLink size={16} />
                      </a>
                      <button 
                        onClick={() => { setIsCreating(false); setEditingResource(resource); }}
                        className="p-2 text-zinc-600 hover:text-blue-600 dark:hover:text-blue-400 bg-zinc-100 dark:bg-zinc-800 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(resource.id)}
                        className="p-2 text-zinc-600 hover:text-red-600 dark:hover:text-red-400 bg-zinc-100 dark:bg-zinc-800 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ResourceEditor({ resource, subjects, onSave, onCancel }: { resource: AcademicResource, subjects: Subject[], onSave: (r: AcademicResource) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState<AcademicResource>(resource);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'reading_time_minutes' ? parseInt(value) || 0 : value
    }));
  };

  const handleSlugify = () => {
    if (formData.title) {
      const slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {resource.id ? 'Edit Resource' : 'Create New Resource'}
        </h3>
        <button onClick={onCancel} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
          <X size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white outline-none transition"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Slug <button type="button" onClick={handleSlugify} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">(Generate from title)</button>
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white outline-none transition"
            required
          />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white outline-none transition"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white outline-none transition"
            placeholder="e.g., Guide, Tutorial, Reference"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Reading Time (min)</label>
          <input
            type="number"
            name="reading_time_minutes"
            value={formData.reading_time_minutes}
            onChange={handleChange}
            min={1}
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white outline-none transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white outline-none transition"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Related Subject (Optional)</label>
          <select
            name="related_subject_id"
            value={formData.related_subject_id || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus:ring-2 focus:ring-zinc-950 dark:focus:ring-white outline-none transition"
          >
            <option value="">None</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.code} - {s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Article Content</label>
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden">
          <RichTextEditor 
            content={formData.content} 
            onChange={(content) => setFormData(prev => ({ ...prev, content }))} 
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-zinc-200 dark:border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 rounded-xl font-medium transition-colors"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => onSave(formData)}
          disabled={!formData.title || !formData.slug || !formData.content}
          className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 rounded-xl font-medium transition-colors disabled:opacity-50"
        >
          <Save size={18} />
          Save Resource
        </button>
      </div>
    </div>
  );
}
