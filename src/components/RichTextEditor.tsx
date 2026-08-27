import React, { useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Bold, Italic, List, ListOrdered, Heading1, Heading2, Code, Image as ImageIcon, Link as LinkIcon, Loader2, Quote, SeparatorHorizontal } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [uploading, setUploading] = React.useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true }),
      Link.configure({ openOnClick: false }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] p-4 font-sans prose-headings:font-serif prose-headings:tracking-tight prose-headings:text-white',
      },
    },
  });

  const uploadImage = useCallback(async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/uploads', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      editor?.chain().focus().setImage({ src: data.fileUrl }).run();
    } catch (e) {
      console.error(e);
      alert('Failed to upload image');
    }
    setUploading(false);
  }, [editor]);

  if (!editor) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) uploadImage(e.target.files[0]);
  };

  const addLink = () => {
    const url = window.prompt('URL');
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const ToolbarButton = ({ onClick, isActive = false, children, title }: any) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 transition-colors rounded-lg ${isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-zinc-800 bg-zinc-900">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
          <Italic size={16} />
        </ToolbarButton>
        <div className="w-px h-6 bg-zinc-800 mx-1"></div>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 1">
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Heading 2">
          <Heading2 size={16} />
        </ToolbarButton>
        <div className="w-px h-6 bg-zinc-800 mx-1"></div>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List">
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote">
          <Quote size={16} />
        </ToolbarButton>
        <div className="w-px h-6 bg-zinc-800 mx-1"></div>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
          <Code size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Separator">
          <SeparatorHorizontal size={16} />
        </ToolbarButton>
        <div className="w-px h-6 bg-zinc-800 mx-1"></div>
        <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Link">
          <LinkIcon size={16} />
        </ToolbarButton>
        
        <label className="p-2 rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer transition-colors" title="Insert Image">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
