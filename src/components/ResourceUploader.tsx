import React, { useState } from 'react';
import { Upload, FileText, Trash2, Loader2, Link2, ExternalLink } from 'lucide-react';
import { Resource } from '../types';

interface ResourceUploaderProps {
  resources: Resource[];
  onUpload: (url: string, name: string, type: string, mime: string, size: number) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function ResourceUploader({ resources, onUpload, onDelete }: ResourceUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/uploads', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      
      const ext = file.name.split('.').pop()?.toUpperCase() || 'FILE';
      await onUpload(data.fileUrl, file.name, ext, data.mimeType, data.fileSize);
    } catch (e) {
      console.error(e);
      alert('Failed to upload file');
    }
    setUploading(false);
  };

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-6">
      <div 
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${dragActive ? 'border-zinc-500 bg-zinc-900' : 'border-zinc-800 hover:border-zinc-700 bg-zinc-950'}`}
        onDragEnter={onDrag} onDragLeave={onDrag} onDragOver={onDrag} onDrop={onDrop}
      >
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 mb-2">
            {uploading ? <Loader2 size={24} className="animate-spin text-white" /> : <Upload size={24} className="text-white" />}
          </div>
          <div className="text-sm font-bold text-white uppercase tracking-widest">
            {uploading ? 'Uploading...' : 'Upload Resource'}
          </div>
          <p className="text-xs text-zinc-500">Drag & Drop files here or click to browse.</p>
          <p className="text-[10px] text-zinc-600 font-mono">Supported: PDF, PPTX, PPT, DOCX, DOC</p>
          
          <label className="mt-4 bg-white text-zinc-950 px-6 py-2 rounded-xl cursor-pointer hover:bg-zinc-200 transition-colors text-sm font-bold">
            Select File
            <input 
              type="file" 
              className="hidden" 
              accept=".pdf,.ppt,.pptx,.doc,.docx"
              onChange={(e) => {
                if (e.target.files?.[0]) handleUpload(e.target.files[0]);
              }} 
            />
          </label>
        </div>
      </div>

      {resources.length > 0 && (
        <div className="grid gap-3">
          {resources.map((res) => (
            <div key={res.id} className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-xl hover:border-zinc-500 transition-colors group">
              <div className="flex items-center gap-4 overflow-hidden">
                <div className="w-10 h-10 bg-zinc-900 rounded-lg flex items-center justify-center text-zinc-500 flex-shrink-0">
                  <FileText size={20} />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white text-sm truncate">{res.title}</div>
                  <div className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">{res.file_type} • {(res.file_size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                <a href={res.file_url} target="_blank" rel="noopener noreferrer" className="p-2 text-zinc-500 hover:text-white transition-colors" title="View File">
                  <ExternalLink size={16} />
                </a>
                <button onClick={() => onDelete(res.id)} className="p-2 text-zinc-500 hover:text-red-400 transition-colors" title="Delete File">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
