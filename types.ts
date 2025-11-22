import { LucideIcon } from 'lucide-react';

export enum ToolType {
  MERGE = 'merge',
  SPLIT = 'split',
  ROTATE = 'rotate',
  IMG_TO_PDF = 'img-to-pdf',
  WORD_TO_PDF = 'word-to-pdf',
  PDF_TO_WORD = 'pdf-to-word',
  AI_SUMMARIZE = 'ai-summarize',
}

export interface ToolDef {
  id: ToolType;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  path: string;
}

export interface ProcessedFile {
  file: File;
  id: string;
  preview?: string; // URL for image preview if applicable
}

export type PDFPageRange = {
  start: number;
  end: number;
};