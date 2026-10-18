import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CandidateStage } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const STAGES: CandidateStage[] = [
  'Applied',
  'Screening',
  'Technical Interview',
  'Offered',
  'Rejected',
];

export const STAGE_COLORS: Record<CandidateStage, {
  badge: string;
  bg: string;
  border: string;
  text: string;
  dot: string;
  columnBg: string;
  accent: string;
}> = {
  Applied: {
    badge: 'bg-[#e9b9a6]/35 text-[#5c2217] border-[#e9b9a6]/70',
    bg: 'bg-[#e9b9a6]/15',
    border: 'border-[#e9b9a6]/50',
    text: 'text-[#5c2217]',
    dot: 'bg-[#e9b9a6]',
    columnBg: 'bg-[#FAF7F5]',
    accent: '#e9b9a6',
  },
  Screening: {
    badge: 'bg-[#5b5d5e]/12 text-[#5b5d5e] border-[#5b5d5e]/25',
    bg: 'bg-[#5b5d5e]/5',
    border: 'border-[#5b5d5e]/25',
    text: 'text-[#5b5d5e]',
    dot: 'bg-[#5b5d5e]',
    columnBg: 'bg-[#FAF7F5]',
    accent: '#5b5d5e',
  },
  'Technical Interview': {
    badge: 'bg-[#5c2217]/10 text-[#5c2217] border-[#5c2217]/25',
    bg: 'bg-[#5c2217]/5',
    border: 'border-[#5c2217]/25',
    text: 'text-[#5c2217]',
    dot: 'bg-[#5c2217]',
    columnBg: 'bg-[#FAF7F5]',
    accent: '#5c2217',
  },
  Offered: {
    badge: 'bg-[#ea694e]/12 text-[#ea694e] border-[#ea694e]/30',
    bg: 'bg-[#ea694e]/5',
    border: 'border-[#ea694e]/25',
    text: 'text-[#ea694e]',
    dot: 'bg-[#ea694e]',
    columnBg: 'bg-[#FAF7F5]',
    accent: '#ea694e',
  },
  Rejected: {
    badge: 'bg-[#373837]/10 text-[#373837] border-[#373837]/20',
    bg: 'bg-[#373837]/5',
    border: 'border-[#373837]/20',
    text: 'text-[#373837]',
    dot: 'bg-[#373837]',
    columnBg: 'bg-[#FAF7F5]',
    accent: '#373837',
  },
};


export function formatDate(dateString: string | Date | undefined): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatRelativeTime(dateString: string | Date | undefined): string {
  if (!dateString) return '';
  const now = new Date();
  const date = new Date(dateString);
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays}d ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
  return formatDate(dateString);
}
