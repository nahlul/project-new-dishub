import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import {
  ClassicEditor,
  Essentials,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading,
  Font,
  Alignment,
  List,
  Indent,
  Link,
  BlockQuote,
  Undo,
  Paragraph,
  HorizontalLine,
  SourceEditing,
} from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';

const RichTextEditor = ({ value, onChange, placeholder = 'Tulis konten di sini...' }) => {
  const editorConfig = {
    plugins: [
      Essentials,
      Bold,
      Italic,
      Underline,
      Strikethrough,
      Heading,
      Font,
      Alignment,
      List,
      Indent,
      Link,
      BlockQuote,
      Undo,
      Paragraph,
      HorizontalLine,
      SourceEditing,
    ],
    toolbar: {
      items: [
        'undo', 'redo',
        '|',
        'heading',
        '|',
        'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor',
        '|',
        'bold', 'italic', 'underline', 'strikethrough',
        '|',
        'alignment',
        '|',
        'numberedList', 'bulletedList',
        'outdent', 'indent',
        '|',
        'blockQuote', 'horizontalLine', 'link',
        '|',
        'sourceEditing',
      ],
      shouldNotGroupWhenFull: false,
    },
    placeholder: placeholder,
    heading: {
      options: [
        { model: 'paragraph', title: 'Normal', class: 'ck-heading_paragraph' },
        { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
        { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
        { model: 'heading3', view: 'h3', title: 'Heading 3', class: 'ck-heading_heading3' },
      ],
    },
    fontSize: {
      options: [10, 12, 14, 16, 18, 20, 24, 28, 32],
    },
    fontFamily: {
      options: [
        'default',
        'Arial, Helvetica, sans-serif',
        'Georgia, serif',
        'Times New Roman, Times, serif',
        'Verdana, Geneva, sans-serif',
      ],
    },
  };

  return (
    <div className="ck-editor-wrapper">
      <CKEditor
        editor={ClassicEditor}
        config={editorConfig}
        data={value || ''}
        onChange={(event, editor) => {
          const data = editor.getData();
          if (onChange) onChange(data);
        }}
      />
      <style>{`
        .ck-editor-wrapper .ck-editor__editable {
          min-height: 300px;
          font-size: 15px;
        }
        .ck-editor-wrapper .ck.ck-editor__main > .ck-editor__editable {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        .ck-editor-wrapper .ck.ck-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
