import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Button } from './components/Button';
import { FileUploader } from './components/FileUploader';
import { TOOLS } from './constants';
import { ProcessedFile } from './types';
import { mergePdfs, splitPdf, rotatePdf, imagesToPdf, wordToPdf, downloadBlob, getPageCount } from './services/pdfService';
import { summarizePdf, convertPdfToWordContent } from './services/geminiService';
import { Trash2, MoveLeft, MoveRight, RotateCw, FileText, ArrowRight, CheckCircle2, Sparkles, ChevronLeft, GripHorizontal, Download, AlertCircle, FileType } from 'lucide-react';

// --- Helper: Hash Router ---
const useHashPath = () => {
  const [path, setPath] = useState(window.location.hash.substring(1) || '/');
  
  useEffect(() => {
    const handleHashChange = () => {
        setPath(window.location.hash.substring(1) || '/');
        window.scrollTo(0, 0);
    };
    
    // Initial check
    handleHashChange();
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  return path;
};

// --- Component: Home Page ---
const HomePage = () => {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full bg-white border-b border-slate-200 relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-200/20 blur-[100px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto px-4 pt-20 pb-24 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider mb-6">
             <Sparkles size={12} />
             <span>Powered by AI & Client-Side Tech</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
            Every tool you need <br/> for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-brand-400">PDFs</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Merge, split, compress, convert, rotate, unlock and watermark PDFs with just a few clicks. 100% Free.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
             <Button size="xl" onClick={() => document.getElementById('tools')?.scrollIntoView({behavior: 'smooth'})}>
                Explore All PDF Tools
             </Button>
             <Button size="xl" variant="outline" icon={<Sparkles size={18} className="text-brand-500"/>} onClick={() => window.location.hash = '#/ai-summarize'}>
                Try AI Summarizer
             </Button>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div id="tools" className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <a key={tool.id} href={`#${tool.path}`} className="group relative">
                <div className="h-full bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-xl hover:border-brand-200 hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 ${tool.color.replace('bg-', 'bg-').replace('text-', 'text-')} shadow-opacity-20`}>
                        <Icon size={28} strokeWidth={2} />
                     </div>
                     <div className="w-8 h-8 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-500 transition-colors">
                        <ArrowRight size={16} />
                     </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">{tool.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{tool.description}</p>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Features Strip */}
      <div className="w-full bg-slate-900 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-around items-center gap-8 text-center md:text-left">
             <div className="flex flex-col items-center md:items-start gap-2">
                <span className="text-4xl font-bold text-brand-400">1M+</span>
                <span className="text-slate-400 font-medium">Files Processed</span>
             </div>
             <div className="w-px h-16 bg-slate-700 hidden md:block"></div>
             <div className="flex flex-col items-center md:items-start gap-2">
                <span className="text-4xl font-bold text-blue-400">100%</span>
                <span className="text-slate-400 font-medium">Secure & Client-side</span>
             </div>
             <div className="w-px h-16 bg-slate-700 hidden md:block"></div>
             <div className="flex flex-col items-center md:items-start gap-2">
                <span className="text-4xl font-bold text-emerald-400">Free</span>
                <span className="text-slate-400 font-medium">Forever</span>
             </div>
          </div>
      </div>
    </div>
  );
};

// --- Shared: Tool Workspace Wrapper ---
const ToolWorkspace: React.FC<{
  title: string;
  description?: string;
  icon: React.ElementType;
  children: React.ReactNode;
  actions?: React.ReactNode;
  backPath?: string;
}> = ({ title, description, icon: Icon, children, actions, backPath = "/" }) => (
  <div className="flex-grow flex flex-col bg-[#F4F7FC]">
    {/* Tool Header */}
    <div className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <a href={`#${backPath}`} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors">
                        <ChevronLeft size={24} />
                    </a>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            {title}
                        </h1>
                        {description && <p className="text-slate-500 text-sm mt-1">{description}</p>}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {actions}
                </div>
            </div>
        </div>
    </div>

    {/* Workspace Canvas */}
    <div className="flex-grow p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto h-full flex flex-col">
            {children}
        </div>
    </div>
  </div>
);

// --- Tool: Merge PDF ---
const MergeTool = () => {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = (newFiles: File[]) => {
    const processed = newFiles.map(f => ({ file: f, id: Math.random().toString(36).substr(2, 9) }));
    setFiles(prev => [...prev, ...processed]);
  };

  const removeFile = (id: string) => setFiles(files.filter(f => f.id !== id));
  const moveFile = (index: number, direction: -1 | 1) => {
    const newFiles = [...files];
    const temp = newFiles[index];
    newFiles[index] = newFiles[index + direction];
    newFiles[index + direction] = temp;
    setFiles(newFiles);
  };

  const handleMerge = async () => {
    setIsProcessing(true);
    try {
      const rawFiles = files.map(f => f.file);
      const mergedBytes = await mergePdfs(rawFiles);
      downloadBlob(mergedBytes, `lumina-merged-${Date.now()}.pdf`);
    } catch (e) {
      alert("Error merging PDFs");
    } finally {
      setIsProcessing(false);
    }
  };

  if (files.length === 0) {
    return (
      <ToolWorkspace title="Merge PDF" description="Combine PDFs in the order you want with the easiest PDF merger available." icon={FileText}>
        <div className="flex-grow flex items-center justify-center">
            <div className="w-full max-w-3xl">
                <FileUploader onFilesSelected={handleFiles} multiple={true} />
            </div>
        </div>
      </ToolWorkspace>
    );
  }

  return (
    <ToolWorkspace 
        title="Merge PDF" 
        icon={FileText}
        actions={
            <div className="flex gap-3">
                 <Button variant="outline" onClick={() => setFiles([])} disabled={isProcessing}>Reset</Button>
                 <Button onClick={handleMerge} isLoading={isProcessing} size="lg" icon={<Download size={18}/>}>Merge PDF</Button>
            </div>
        }
    >
      <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 auto-rows-max pb-20">
        {files.map((file, index) => (
          <div key={file.id} className="relative group animate-in fade-in zoom-in duration-300">
            <div className="aspect-[1/1.4] bg-white rounded-xl shadow-sm border-2 border-slate-200 group-hover:border-brand-400 transition-all flex flex-col items-center justify-center p-4 relative overflow-hidden">
               <div className="absolute top-2 right-2 z-10">
                  <button onClick={() => removeFile(file.id)} className="p-1.5 bg-white/90 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-full shadow-sm transition-colors">
                    <Trash2 size={14}/>
                  </button>
               </div>
               
               <FileText size={48} className="text-brand-100 mb-4" />
               <p className="text-xs font-medium text-slate-700 text-center line-clamp-2 w-full px-1 break-words">{file.file.name}</p>
               <p className="text-[10px] text-slate-400 mt-1">{(file.file.size / 1024).toFixed(0)} KB</p>
               
               {/* Hover overlay for movement */}
               <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-2">
                   <button 
                    disabled={index === 0} 
                    onClick={() => moveFile(index, -1)} 
                    className="p-2 bg-white text-slate-700 rounded-lg shadow-md hover:bg-brand-50 hover:text-brand-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-700"
                   >
                    <MoveLeft size={16} />
                   </button>
                   <button 
                    disabled={index === files.length - 1} 
                    onClick={() => moveFile(index, 1)} 
                    className="p-2 bg-white text-slate-700 rounded-lg shadow-md hover:bg-brand-50 hover:text-brand-600 disabled:opacity-50 disabled:hover:bg-white disabled:hover:text-slate-700"
                   >
                    <MoveRight size={16} />
                   </button>
               </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {index + 1}
            </div>
          </div>
        ))}
        <div className="aspect-[1/1.4]">
            <FileUploader onFilesSelected={handleFiles} multiple={true} compact={true} />
        </div>
      </div>
    </ToolWorkspace>
  );
};

// --- Tool: Split PDF ---
const SplitTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [range, setRange] = useState({ from: 1, to: 1 });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    try {
        const count = await getPageCount(f);
        setPageCount(count);
        setRange({ from: 1, to: count });
    } catch (e) {
        console.error(e);
        alert("Could not parse PDF. Is it a valid PDF?");
        setFile(null);
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const splitBytes = await splitPdf(file, range.from, range.to);
      downloadBlob(splitBytes, `lumina-split-${range.from}-${range.to}-${file.name}`);
    } catch (e) {
      alert("Error splitting PDF");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!file) {
    return (
      <ToolWorkspace title="Split PDF" description="Separate one page or a whole set for easy conversion into independent PDF files." icon={FileText}>
        <div className="flex-grow flex items-center justify-center">
            <div className="w-full max-w-3xl">
                <FileUploader onFilesSelected={handleFile} />
            </div>
        </div>
      </ToolWorkspace>
    );
  }

  return (
    <ToolWorkspace 
        title="Split PDF" 
        icon={FileText}
        actions={<Button onClick={() => setFile(null)} variant="ghost">Cancel</Button>}
    >
      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center h-full pt-10">
        {/* Preview Card */}
        <div className="w-full lg:w-1/3 max-w-sm mx-auto">
           <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100 flex flex-col items-center text-center">
               <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
                   <FileText size={40} />
               </div>
               <h3 className="font-bold text-slate-900 text-lg mb-1 truncate w-full">{file.name}</h3>
               <p className="text-slate-500 mb-6">{pageCount} Pages</p>
               <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-brand-500 w-full"></div>
               </div>
           </div>
        </div>
        
        {/* Controls */}
        <div className="w-full lg:w-1/2 max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-soft border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <GripHorizontal className="text-brand-500" /> Split Options
            </h3>
            
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-4">Page Range</label>
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-3 text-slate-400 text-xs uppercase font-bold">From</span>
                            <input 
                                type="number" 
                                min={1} 
                                max={pageCount} 
                                value={range.from} 
                                onChange={(e) => setRange({ ...range, from: parseInt(e.target.value) || 1 })}
                                className="w-full pt-8 pb-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white outline-none font-semibold text-lg"
                            />
                        </div>
                        <div className="text-slate-300">
                            <ArrowRight size={24} />
                        </div>
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-3 text-slate-400 text-xs uppercase font-bold">To</span>
                            <input 
                                type="number" 
                                min={1} 
                                max={pageCount} 
                                value={range.to} 
                                onChange={(e) => setRange({ ...range, to: parseInt(e.target.value) || 1 })}
                                className="w-full pt-8 pb-2 px-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-brand-500 focus:bg-white outline-none font-semibold text-lg"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm flex gap-3">
                    <AlertCircle size={20} className="flex-shrink-0" />
                    <p>This will create a new PDF containing only pages <strong>{range.from}</strong> through <strong>{range.to}</strong>.</p>
                </div>

                <Button onClick={handleSplit} isLoading={isProcessing} size="xl" fullWidth icon={<Download />}>
                    Download Split PDF
                </Button>
            </div>
        </div>
      </div>
    </ToolWorkspace>
  );
};

// --- Tool: Rotate PDF ---
const RotateTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [rotation, setRotation] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFile = (files: File[]) => setFile(files[0]);

    const handleRotate = async () => {
        if (!file) return;
        setIsProcessing(true);
        try {
            const rotatedBytes = await rotatePdf(file, rotation);
            downloadBlob(rotatedBytes, `lumina-rotated-${file.name}`);
        } catch (e) {
            alert("Error rotating PDF");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!file) {
        return (
            <ToolWorkspace title="Rotate PDF" description="Rotate your PDF pages. You can select the angle of rotation." icon={RotateCw}>
                <div className="flex-grow flex items-center justify-center">
                    <div className="w-full max-w-3xl">
                        <FileUploader onFilesSelected={handleFile} />
                    </div>
                </div>
            </ToolWorkspace>
        );
    }

    return (
        <ToolWorkspace title="Rotate PDF" icon={RotateCw} actions={<Button onClick={() => setFile(null)} variant="ghost">Cancel</Button>}>
             <div className="flex flex-col items-center justify-center h-full py-8">
                <div className="relative group">
                    <div 
                        className="w-64 h-[360px] bg-white shadow-2xl border border-slate-200 rounded-2xl flex items-center justify-center mb-12 transition-all duration-500 ease-in-out relative z-10"
                        style={{ transform: `rotate(${rotation}deg)` }}
                    >
                        <div className="text-center p-6 border-2 border-dashed border-slate-100 m-4 rounded-xl w-[calc(100%-2rem)] h-[calc(100%-2rem)] flex flex-col items-center justify-center">
                            <FileText size={64} className="text-slate-200 mb-4" />
                            <p className="text-sm font-bold text-slate-300 uppercase tracking-widest">Preview</p>
                        </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-slate-100 rounded-full -z-0"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-dashed border-slate-200 rounded-full -z-0 opacity-50"></div>
                </div>
                
                <div className="bg-white p-2 rounded-2xl shadow-lg border border-slate-100 flex gap-4 mb-10">
                    <Button onClick={() => setRotation(r => r - 90)} variant="ghost" className="text-slate-600" icon={<RotateCw className="-scale-x-100" size={20} />}>Left</Button>
                    <div className="w-px bg-slate-200 my-2"></div>
                    <Button onClick={() => setRotation(r => r + 90)} variant="ghost" className="text-slate-600" icon={<RotateCw size={20} />}>Right</Button>
                </div>

                <Button onClick={handleRotate} isLoading={isProcessing} size="xl" className="min-w-[200px]" icon={<Download />}>
                    Download PDF
                </Button>
             </div>
        </ToolWorkspace>
    );
};

// --- Tool: Images to PDF ---
const ImageToPdfTool = () => {
  const [files, setFiles] = useState<ProcessedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFiles = (newFiles: File[]) => {
    const processed = newFiles.map(f => ({ 
        file: f, 
        id: Math.random().toString(36).substr(2, 9),
        preview: URL.createObjectURL(f)
    }));
    setFiles(prev => [...prev, ...processed]);
  };

  const removeFile = (id: string) => setFiles(files.filter(f => f.id !== id));

  const handleConvert = async () => {
    setIsProcessing(true);
    try {
      const rawFiles = files.map(f => f.file);
      const pdfBytes = await imagesToPdf(rawFiles);
      downloadBlob(pdfBytes, `lumina-images-${Date.now()}.pdf`);
    } catch (e) {
      alert("Error converting images");
    } finally {
      setIsProcessing(false);
    }
  };

  if (files.length === 0) {
    return (
      <ToolWorkspace title="JPG to PDF" description="Convert your images to PDF in seconds. Adjust orientation and margins." icon={FileText}>
        <div className="flex-grow flex items-center justify-center">
             <div className="w-full max-w-3xl">
                <FileUploader onFilesSelected={handleFiles} multiple={true} accept="image/jpeg, image/png, image/jpg" description="or drop JPG, PNG images here" />
            </div>
        </div>
      </ToolWorkspace>
    );
  }

  return (
    <ToolWorkspace 
        title="JPG to PDF" 
        icon={FileText}
        actions={
            <div className="flex gap-3">
                 <Button variant="outline" onClick={() => setFiles([])}>Reset</Button>
                 <Button onClick={handleConvert} isLoading={isProcessing} size="lg" icon={<Download size={18} />}>Convert to PDF</Button>
            </div>
        }
    >
       <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 pb-20">
        {files.map((file, index) => (
          <div key={file.id} className="relative group aspect-[3/4] animate-in zoom-in duration-200">
            <img src={file.preview} alt="preview" className="w-full h-full object-cover rounded-xl shadow-md border border-slate-200 group-hover:border-brand-400 transition-colors" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl"></div>
            <button 
                onClick={() => removeFile(file.id)} 
                className="absolute top-2 right-2 bg-white text-red-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:bg-red-50"
            >
                <Trash2 size={16} />
            </button>
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-md backdrop-blur-sm">
                {index + 1}
            </div>
          </div>
        ))}
        <div className="aspect-[3/4]">
            <FileUploader onFilesSelected={handleFiles} multiple={true} accept="image/*" compact={true} />
        </div>
      </div>
    </ToolWorkspace>
  );
};

// --- Tool: Word to PDF ---
const WordToPdfTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (files: File[]) => {
        setFile(files[0]);
        setError(null);
    };

    const handleConvert = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError(null);
        try {
            const pdfBytes = await wordToPdf(file);
            downloadBlob(pdfBytes, `lumina-converted-${file.name}.pdf`);
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Error converting Word file. Is it a valid .docx?");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!file) {
        return (
            <ToolWorkspace title="Word to PDF" description="Convert your DOCX files to PDF directly in your browser." icon={FileType}>
                <div className="flex-grow flex items-center justify-center">
                    <div className="w-full max-w-3xl">
                        <FileUploader onFilesSelected={handleFile} accept=".docx" description="Drop WORD files here" />
                    </div>
                </div>
            </ToolWorkspace>
        );
    }

    return (
        <ToolWorkspace title="Word to PDF" icon={FileType} actions={<Button onClick={() => setFile(null)} variant="ghost">Cancel</Button>}>
             <div className="flex flex-col items-center justify-center h-full py-12 space-y-8">
                <div className="bg-blue-50 p-10 rounded-full">
                    <FileType size={64} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">{file.name}</h3>
                <p className="text-slate-500 max-w-md text-center">
                    Ready to convert. Note: This client-side tool converts text content securely. Layouts may vary from the original.
                </p>
                
                {error && (
                    <div className="max-w-md w-full bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 text-red-700 text-sm">
                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                        {error}
                    </div>
                )}

                <Button onClick={handleConvert} isLoading={isProcessing} size="xl" icon={<Download />}>
                    Convert to PDF
                </Button>
             </div>
        </ToolWorkspace>
    );
};

// --- Tool: PDF to Word ---
const PdfToWordTool = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = (files: File[]) => {
        setFile(files[0]);
        setError(null);
    };

    const handleConvert = async () => {
        if (!file) return;
        setIsProcessing(true);
        setError(null);
        try {
            const wordBlob = await convertPdfToWordContent(file);
            downloadBlob(wordBlob, `lumina-converted-${file.name}.doc`, 'application/msword');
        } catch (e: any) {
            console.error(e);
            setError(e.message || "Conversion failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (!file) {
        return (
            <ToolWorkspace title="PDF to Word" description="Use AI to intelligently convert PDF content to editable Word documents." icon={FileText}>
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex gap-4 text-blue-900">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-600">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold mb-1">AI-Powered Conversion</h4>
                            <p className="text-sm text-blue-700/80 leading-relaxed">
                                We use Gemini AI to analyze the structure of your PDF and reconstruct it as a Word document. 
                                This ensures better handling of tables, lists, and headers than standard converters.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex-grow flex items-center justify-center">
                    <div className="w-full max-w-3xl">
                        <FileUploader onFilesSelected={handleFile} description="Drop PDF files here" />
                    </div>
                </div>
            </ToolWorkspace>
        );
    }

    return (
        <ToolWorkspace title="PDF to Word" icon={FileText} actions={<Button onClick={() => setFile(null)} variant="ghost">Cancel</Button>}>
             <div className="flex flex-col items-center justify-center h-full py-12 space-y-8">
                <div className="bg-indigo-50 p-10 rounded-full relative">
                    <FileText size={64} className="text-indigo-600" />
                    <div className="absolute -right-2 -top-2 bg-indigo-600 text-white p-2 rounded-full border-4 border-white">
                        <Sparkles size={20} />
                    </div>
                </div>
                <div className="text-center">
                     <h3 className="text-2xl font-bold text-slate-900 mb-2">{file.name}</h3>
                     <p className="text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                
                {error && (
                    <div className="max-w-md w-full bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 text-red-700 text-sm">
                        <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                        {error}
                    </div>
                )}

                <Button onClick={handleConvert} isLoading={isProcessing} size="xl" icon={<Download />}>
                    Convert to Word (AI)
                </Button>
             </div>
        </ToolWorkspace>
    );
};

// --- Tool: AI Summarize ---
const AiSummarizeTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (files: File[]) => {
    setFile(files[0]);
    setSummary("");
    setError(null);
  };

  const handleSummarize = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await summarizePdf(file);
      setSummary(result);
    } catch (e: any) {
      setError(e.message || "Failed to generate summary");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!file) {
    return (
      <ToolWorkspace title="AI PDF Summarizer" description="Use advanced AI to read and summarize your documents securely." icon={Sparkles}>
         <div className="max-w-3xl mx-auto mb-8">
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex gap-4 text-indigo-900">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 text-indigo-600">
                    <Sparkles size={24} />
                </div>
                <div>
                    <h4 className="font-bold mb-1">AI-Powered Analysis</h4>
                    <p className="text-sm text-indigo-700/80 leading-relaxed">
                        This tool uses Google Gemini to analyze your PDF content. Your file is processed securely and temporary. 
                        Perfect for long research papers, contracts, or books.
                    </p>
                </div>
            </div>
         </div>
         <div className="flex-grow flex items-center justify-center">
            <div className="w-full max-w-3xl">
                <FileUploader onFilesSelected={handleFile} description="Drop a PDF to analyze" />
            </div>
        </div>
      </ToolWorkspace>
    );
  }

  return (
    <ToolWorkspace title="AI Summarize" icon={Sparkles} actions={<Button onClick={() => setFile(null)} variant="ghost">Change File</Button>}>
      <div className="flex flex-col lg:flex-row gap-8 h-full">
          {/* Left: Controls */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-500">
                        <FileText size={24} />
                    </div>
                    <div className="overflow-hidden">
                        <h3 className="font-bold text-slate-900 truncate">{file.name}</h3>
                        <p className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                </div>
                
                <Button onClick={handleSummarize} isLoading={isProcessing} size="lg" fullWidth className="bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/30">
                    <Sparkles size={18} className="mr-2"/>
                    {summary ? "Regenerate Summary" : "Generate Summary"}
                </Button>
                
                 {error && (
                    <div className="mt-4 p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100 flex gap-2 items-start">
                        <AlertCircle size={16} className="flex-shrink-0 mt-0.5"/>
                        <span>{error}</span>
                    </div>
                 )}
            </div>
            
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
                <h4 className="font-bold text-indigo-900 mb-2 text-sm">How it works</h4>
                <p className="text-xs text-indigo-700 leading-relaxed">
                    The AI reads the text layer of your PDF and identifies key points, arguments, and conclusions, presenting them in a concise format.
                </p>
            </div>
          </div>

          {/* Right: Result */}
          <div className="flex-1 flex flex-col min-h-[500px] bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
             <div className="border-b border-slate-100 p-4 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <FileText size={18} className="text-indigo-500"/> Summary Result
                </h3>
                {summary && (
                    <button className="text-xs font-medium text-indigo-600 hover:text-indigo-800" onClick={() => navigator.clipboard.writeText(summary)}>
                        Copy Text
                    </button>
                )}
             </div>
             
             <div className="flex-grow p-8 overflow-y-auto prose prose-slate prose-headings:font-bold prose-a:text-brand-600 max-w-none">
                {isProcessing ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-6">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles size={20} className="text-indigo-500" />
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="font-medium text-slate-900 mb-1">Analyzing document...</p>
                            <p className="text-sm">This might take a few seconds depending on file size.</p>
                        </div>
                    </div>
                ) : summary ? (
                    <div className="whitespace-pre-wrap leading-relaxed text-slate-700 animate-in fade-in duration-500">{summary}</div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                            <FileText size={32} className="text-slate-300" />
                        </div>
                        <p className="text-sm">Summary will appear here.</p>
                    </div>
                )}
             </div>
          </div>
      </div>
    </ToolWorkspace>
  );
};

function App() {
  const currentPath = useHashPath();
  
  let content;
  switch (currentPath) {
    case '/merge':
        content = <MergeTool />;
        break;
    case '/split':
        content = <SplitTool />;
        break;
    case '/rotate':
        content = <RotateTool />;
        break;
    case '/img-to-pdf':
        content = <ImageToPdfTool />;
        break;
    case '/word-to-pdf':
        content = <WordToPdfTool />;
        break;
    case '/pdf-to-word':
        content = <PdfToWordTool />;
        break;
    case '/ai-summarize':
        content = <AiSummarizeTool />;
        break;
    default:
        content = <HomePage />;
        break;
  }

  return (
    <Layout currentPath={currentPath}>
        {content}
    </Layout>
  );
}

export default App;