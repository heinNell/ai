/**
 * FileDropzone
 * Drag-and-drop or click-to-browse dropzone for adding files.
 * Focusable, keyboard-accessible, with visual feedback on dragover.
 */

import { useRef, useState } from 'react';

interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
}

export default function FileDropzone({ onFiles }: FileDropzoneProps) {
  const [active, setActive] = useState(false);
  const zoneRef = useRef<HTMLDivElement | null>(null);

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const files = Array.from(list);
    if (files.length) onFiles(files);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const onBrowse = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = '.md,.txt,.ipynb,.html,.htm,.ts,.tsx,.js,.jsx,.py,.java,.cpp,.cs,.go,.rs,.php,.rb,.pdf,.docx,.xlsx';
    input.onchange = () => handleFiles(input.files);
    input.click();
  };

  return (
    <div
      ref={zoneRef}
      id="dropzone"
      className={`p-8 text-center rounded-xl cursor-pointer border-2 border-dashed transition ${
        active ? 'bg-indigo-50 border-indigo-500' : 'border-indigo-500'
      }`}
      role="button"
      tabIndex={0}
      aria-label="Upload files by dragging or browsing"
      onDragOver={(e) => {
        e.preventDefault();
        setActive(true);
      }}
      onDragLeave={() => setActive(false)}
      onDrop={onDrop}
      onClick={onBrowse}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onBrowse();
      }}
    >
      <div className="space-y-3">
        <div className="text-5xl text-indigo-500">☁️</div>
        <h3 className="font-semibold text-xl">Drag &amp; drop files here</h3>
        <p className="text-sm text-slate-600">or click to browse</p>
        <p className="text-xs text-slate-500">
          Supported: md, txt, ipynb, html, htm, ts/tsx, js/jsx, py, java, cpp, cs, go, rs, php, rb, pdf, docx, xlsx
        </p>
      </div>
    </div>
  );
}
