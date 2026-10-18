'use client';

import React from 'react';
import { ICandidate } from '@/lib/types';
import { AlertTriangle, Trash2, Loader2 } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  candidate: ICandidate | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export const DeleteConfirmDialog: React.FC<DeleteConfirmDialogProps> = ({
  isOpen,
  candidate,
  onClose,
  onConfirm,
  loading = false,
}) => {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/35 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-[#5b5d5e]/15 p-6 animate-in fade-in zoom-in-95 duration-200 font-sans">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-[#5c2217]/10 border border-[#5c2217]/25 flex items-center justify-center text-[#5c2217] shrink-0">
            <AlertTriangle className="h-5 w-5 text-[#ea694e]" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-bold text-[#5c2217] font-serif">
              Delete Candidate Profile
            </h3>
            <p className="text-xs text-[#5b5d5e] mt-1 leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-[#373837]">{candidate.name}</span>?
              This will permanently remove their application history, ratings, and notes
              from the pipeline.
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-xs font-medium text-[#373837] bg-white border border-[#5b5d5e]/20 rounded-xl hover:bg-[#FAF7F5] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#5c2217] hover:bg-[#481a11] active:scale-[0.98] rounded-xl transition-all shadow-xs disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            <span>Delete Permanently</span>
          </button>
        </div>
      </div>
    </div>
  );
};
