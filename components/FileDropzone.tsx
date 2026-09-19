'use client';

import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

type FileDropzoneProps = {
  accept?: string;
  multiple?: boolean;
  label: string;
  subtitle?: string;
  disabled?: boolean;
  onFiles: (files: File[]) => void;
};

export default function FileDropzone({
  accept,
  multiple = false,
  label,
  subtitle = 'Direct device processing • Files stay on your device where supported',
  disabled = false,
  onFiles,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = (incoming: FileList | File[]) => {
    const files = Array.from(incoming);
    if (!files.length || disabled) return;
    onFiles(files);
  };

  const openFilePicker = () => {
    if (disabled || !inputRef.current) return;
    // Clear before opening so selecting the same file again still fires change.
    inputRef.current.value = '';
    inputRef.current.click();
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={openFilePicker}
      onKeyDown={(event) => {
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          openFilePicker();
        }
      }}
      onDragEnter={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        if (event.currentTarget === event.target) setDragging(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={[
        'w-full rounded-3xl border-2 border-dashed px-6 py-8 sm:px-8 sm:py-10 text-center',
        'transition-colors duration-200 select-none',
        dragging
          ? 'border-violet-500 bg-violet-50/70 dark:bg-violet-950/20'
          : 'border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-900',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-violet-400 hover:bg-violet-50/40 dark:hover:bg-violet-950/10',
      ].join(' ')}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(event) => {
          handleFiles(event.target.files || []);
        }}
      />

      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
        <Upload className="h-7 w-7" strokeWidth={2.2} />
      </span>

      <div className="mt-4 text-base font-bold text-zinc-900 dark:text-white">
        {label}
      </div>

      <div className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
        {subtitle}
      </div>
    </div>
  );
}
