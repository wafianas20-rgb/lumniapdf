import { 
  Files, 
  Scissors, 
  RotateCw, 
  Image as ImageIcon, 
  Sparkles,
  FileType,
  FileText
} from 'lucide-react';
import { ToolDef, ToolType } from './types';

export const APP_NAME = "LuminaPDF";

export const TOOLS: ToolDef[] = [
  {
    id: ToolType.MERGE,
    title: "Merge PDF",
    description: "Combine multiple PDFs into one unified document in seconds.",
    icon: Files,
    color: "bg-red-500",
    path: "/merge",
  },
  {
    id: ToolType.SPLIT,
    title: "Split PDF",
    description: "Extract pages from your PDF or save each page as a separate file.",
    icon: Scissors,
    color: "bg-amber-500",
    path: "/split",
  },
  {
    id: ToolType.ROTATE,
    title: "Rotate PDF",
    description: "Rotate your PDF pages individually or all at once.",
    icon: RotateCw,
    color: "bg-blue-500",
    path: "/rotate",
  },
  {
    id: ToolType.IMG_TO_PDF,
    title: "JPG to PDF",
    description: "Convert JPG, PNG, or WebP images into a single PDF file.",
    icon: ImageIcon,
    color: "bg-emerald-500",
    path: "/img-to-pdf",
  },
  {
    id: ToolType.WORD_TO_PDF,
    title: "Word to PDF",
    description: "Convert WORD documents to PDF files securely.",
    icon: FileType,
    color: "bg-blue-700",
    path: "/word-to-pdf",
  },
  {
    id: ToolType.PDF_TO_WORD,
    title: "PDF to Word",
    description: "Convert PDF to editable Word documents using AI.",
    icon: FileText,
    color: "bg-blue-600",
    path: "/pdf-to-word",
  },
  {
    id: ToolType.AI_SUMMARIZE,
    title: "AI Summarize",
    description: "Use Gemini AI to summarize and analyze your PDF content.",
    icon: Sparkles,
    color: "bg-violet-600",
    path: "/ai-summarize",
  },
];