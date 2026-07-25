import React, { useMemo } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const RichTextEditor = ({ value, onChange, placeholder = 'Tulis konten di sini...' }) => {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      ['blockquote'],
      ['link'],
      ['clean'],
    ],
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet',
    'indent',
    'blockquote',
    'link',
  ];

  return (
    <div className="rich-editor">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
      />
      <style>{`
        .rich-editor .ql-container {
          min-height: 250px;
          font-size: 15px;
          font-family: inherit;
        }
        .rich-editor .ql-editor {
          min-height: 250px;
          line-height: 1.8;
        }
        .rich-editor .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          background: #f9fafb;
          border-color: #e5e7eb;
        }
        .rich-editor .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          border-color: #e5e7eb;
        }
        .rich-editor .ql-toolbar .ql-active {
          color: #0284c7 !important;
        }
        .rich-editor .ql-toolbar .ql-active .ql-stroke {
          stroke: #0284c7 !important;
        }
        .rich-editor .ql-toolbar .ql-active .ql-fill {
          fill: #0284c7 !important;
        }
        .rich-editor .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
