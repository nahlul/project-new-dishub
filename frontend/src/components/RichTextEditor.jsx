import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Bold, Italic, Underline, List, ListOrdered, Heading2, Heading3, AlignCenter, AlignLeft, Minus } from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder = 'Tulis konten di sini...' }) => {
  const editorRef = useRef(null);
  const isInitialized = useRef(false);
  const [activeFormats, setActiveFormats] = useState({});

  useEffect(() => {
    if (editorRef.current && !isInitialized.current) {
      editorRef.current.innerHTML = value || '';
      isInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (editorRef.current && value !== undefined) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const checkActiveFormats = useCallback(() => {
    const formats = {
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
      orderedList: document.queryCommandState('insertOrderedList'),
      center: document.queryCommandState('justifyCenter'),
    };

    // Check heading
    const block = document.queryCommandValue('formatBlock');
    formats.h2 = block.toLowerCase() === 'h2';
    formats.h3 = block.toLowerCase() === 'h3';

    setActiveFormats(formats);
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
    checkActiveFormats();
  }, [onChange, checkActiveFormats]);

  const execCommand = (command, val = null) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    handleInput();
    setTimeout(checkActiveFormats, 10);
  };

  const ToolbarButton = ({ onClick, active, children, title }) => (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      title={title}
      className={`p-2 rounded transition-all duration-150 ${
        active
          ? 'bg-sky-600 text-white shadow-sm scale-95'
          : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="border-2 border-gray-200 rounded-lg overflow-hidden focus-within:border-sky-500 transition-colors">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <ToolbarButton onClick={() => execCommand('bold')} active={activeFormats.bold} title="Bold (Ctrl+B)">
          <Bold className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('italic')} active={activeFormats.italic} title="Italic (Ctrl+I)">
          <Italic className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('underline')} active={activeFormats.underline} title="Underline (Ctrl+U)">
          <Underline className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton onClick={() => execCommand('formatBlock', 'h2')} active={activeFormats.h2} title="Heading Besar">
          <Heading2 className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('formatBlock', 'h3')} active={activeFormats.h3} title="Heading Kecil">
          <Heading3 className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton onClick={() => execCommand('insertUnorderedList')} active={activeFormats.unorderedList} title="Bullet List">
          <List className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('insertOrderedList')} active={activeFormats.orderedList} title="Numbered List">
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <ToolbarButton onClick={() => execCommand('justifyCenter')} active={activeFormats.center} title="Rata Tengah">
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('justifyLeft')} active={false} title="Rata Kiri">
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => execCommand('insertHorizontalRule')} active={false} title="Garis Pemisah">
          <Minus className="w-4 h-4" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyUp={checkActiveFormats}
        onMouseUp={checkActiveFormats}
        onFocus={checkActiveFormats}
        data-placeholder={placeholder}
        className="min-h-[250px] p-4 text-gray-800 leading-relaxed focus:outline-none prose prose-sm max-w-none
          [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-400
          [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2
          [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-2
          [&_p]:mb-3
          [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3
          [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3
          [&_li]:mb-1
          [&_hr]:my-4 [&_hr]:border-gray-300"
      />
    </div>
  );
};

export default RichTextEditor;
