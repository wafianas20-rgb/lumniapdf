import React, { useCallback } from 'react';
import { UploadCloud, FilePlus2, Plus } from 'lucide-react';

interface FileUploaderProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  description?: string;
  compact?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  accept = ".pdf",
  multiple = false,
  description = "or drag and drop files here",
  compact = false,
}) => {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
    }
  };

  if (compact) {
    return (
        <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full min-h-[160px] border-2 border-dashed border-slate-200 rounded-2xl hover:border-brand-400 hover:bg-brand-50/50 transition-all group bg-white">
        <div className="flex flex-col items-center gap-3 text-slate-400 group-hover:text-brand-600 transition-colors">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                <Plus size={24} />
            </div>
            <span className="font-medium text-sm">Add more files</span>
        </div>
        <input
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInput}
        />
        </label>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="w-full h-full"
    >
      <label className="flex flex-col items-center justify-center w-full h-[400px] border-3 border-dashed border-slate-200 rounded-3xl cursor-pointer bg-white hover:bg-brand-50/30 hover:border-brand-300 transition-all duration-300 group shadow-sm relative overflow-hidden">
        
        {/* Decorative background blur */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50/0 to-brand-50/0 group-hover:from-brand-50/50 group-hover:to-transparent transition-all duration-500"></div>

        <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center relative z-10">
          <div className="relative mb-8">
              <div className="absolute inset-0 bg-brand-400 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
              <div className="w-24 h-24 bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-brand-500/30 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <UploadCloud size={44} strokeWidth={1.5} />
              </div>
          </div>
          
          <h3 className="text-2xl font-bold text-slate-900 mb-2">
            Select {accept === '.pdf' ? 'PDF files' : 'files'}
          </h3>
          <p className="text-slate-500 mb-8 text-base max-w-xs mx-auto leading-relaxed">{description}</p>
          
          <span className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg hover:bg-slate-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2">
            <FilePlus2 size={18} />
            Choose Files
          </span>
        </div>
        <input
          type="file"
          className="hidden"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInput}
        />
      </label>
    </div>
  );
};