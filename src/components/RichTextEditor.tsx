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
        class: 'prose prose-invert prose-base sm:prose-lg max-w-none focus:outline-none min-h-[400px] font-sans prose-headings:font-serif prose-headings:tracking-tight prose-headings:font-bold prose-headings:text-white prose-a:text-white prose-a:font-bold hover:prose-a:text-zinc-300 prose-img:border prose-img:border-zinc-800 prose-img:rounded-2xl prose-blockquote:border-white prose-blockquote:font-serif prose-blockquote:italic',
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
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    
    if (url === null) {
      return; // Cancelled
    }
    
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const ToolbarButton = ({ onClick, isActive = false, children, title }: any) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`p-2.5 sm:p-2 transition-colors rounded-lg flex items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 ${isActive ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div className="flex items-center gap-1 sm:gap-1.5 p-2 border-b border-zinc-800 bg-zinc-900 overflow-x-auto whitespace-nowrap shrink-0 custom-scrollbar min-h-[56px] sm:min-h-0">
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Bold">
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Italic">
          <Italic size={16} />
        </ToolbarButton>
        <div className="w-px h-6 bg-zinc-800 mx-1 shrink-0"></div>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editor.isActive('heading', { level: 1 })} title="Heading 1">
          <Heading1 size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <Heading2 size={16} />
        </ToolbarButton>
        <div className="w-px h-6 bg-zinc-800 mx-1 shrink-0"></div>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Bullet List">
          <List size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Numbered List">
          <ListOrdered size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Quote">
          <Quote size={16} />
        </ToolbarButton>
        <div className="w-px h-6 bg-zinc-800 mx-1 shrink-0"></div>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} title="Code Block">
          <Code size={16} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Separator">
          <SeparatorHorizontal size={16} />
        </ToolbarButton>
        <div className="w-px h-6 bg-zinc-800 mx-1 shrink-0"></div>
        <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} title="Link">
          <LinkIcon size={16} />
        </ToolbarButton>
        
        <label className="p-2.5 sm:p-2 transition-colors rounded-lg flex items-center justify-center min-w-[40px] min-h-[40px] sm:min-w-0 sm:min-h-0 text-zinc-400 hover:bg-zinc-800 hover:text-white cursor-pointer shrink-0" title="Insert Image">
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </label>
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
