'use client';

import React, { useState, useEffect } from 'react';
import {
  ICandidate,
  CandidateFormData,
  CandidateStage,
} from '@/lib/types';
import { STAGES } from '@/lib/utils';
import { X, Star, AlertCircle, Loader2 } from 'lucide-react';

interface CandidateFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CandidateFormData) => Promise<boolean>;
  initialData?: ICandidate | null;
  mode: 'create' | 'edit';
}

export const CandidateFormDialog: React.FC<CandidateFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}) => {
  const [formData, setFormData] = useState<CandidateFormData>({
    name: '',
    email: '',
    phone: '',
    role: '',
    stage: 'Applied',
    skills: [],
    resumeUrl: '',
    experience: 0,
    rating: 3,
    notes: '',
  });

  const [skillsInput, setSkillsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        role: initialData.role || '',
        stage: initialData.stage || 'Applied',
        skills: initialData.skills || [],
        resumeUrl: initialData.resumeUrl || '',
        experience: initialData.experience || 0,
        rating: initialData.rating || 3,
        notes: initialData.notes || '',
      });
      setSkillsInput(initialData.skills ? initialData.skills.join(', ') : '');
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        stage: 'Applied',
        skills: [],
        resumeUrl: '',
        experience: 2,
        rating: 3,
        notes: '',
      });
      setSkillsInput('');
    }
    setError(null);
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic client-side validation
    if (!formData.name.trim()) {
      setError('Candidate name is required');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please provide a valid email address');
      return;
    }
    if (!formData.role.trim()) {
      setError('Target role is required');
      return;
    }

    const processedSkills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setSubmitting(true);
    try {
      const success = await onSubmit({
        ...formData,
        skills: processedSkills,
      });
      if (success) {
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save candidate';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/35 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-[#5b5d5e]/15 overflow-hidden animate-in fade-in zoom-in-95 duration-200 font-sans">
        {/* Header */}
        <div className="p-5 border-b border-[#5b5d5e]/15 flex items-center justify-between bg-[#FAF7F5]">
          <div>
            <h3 className="text-lg font-bold text-[#5c2217] font-serif tracking-tight">
              {mode === 'create' ? 'Add New Candidate' : 'Edit Candidate Profile'}
            </h3>
            <p className="text-xs text-[#5b5d5e] mt-0.5">
              {mode === 'create'
                ? 'Fill in the candidate details to register them in the hiring pipeline.'
                : 'Modify candidate attributes, stage, evaluations, and notes.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#5b5d5e] hover:text-[#5c2217] hover:bg-black/[0.05] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-[#5c2217]/10 border border-[#5c2217]/25 flex items-center gap-2 text-[#5c2217] text-xs font-medium">
              <AlertCircle className="h-4 w-4 shrink-0 text-[#ea694e]" />
              <span>{error}</span>
            </div>
          )}

          {/* Row 1: Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#373837] mb-1">
                Full Name <span className="text-[#ea694e]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Maya Patel"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#FAF7F5] border border-[#5b5d5e]/20 rounded-xl text-[#373837] placeholder-[#5b5d5e]/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ea694e]/20 focus:border-[#ea694e] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#373837] mb-1">
                Target Role <span className="text-[#ea694e]">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Senior Frontend Engineer"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#FAF7F5] border border-[#5b5d5e]/20 rounded-xl text-[#373837] placeholder-[#5b5d5e]/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ea694e]/20 focus:border-[#ea694e] transition-all"
              />
            </div>
          </div>

          {/* Row 2: Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#373837] mb-1">
                Email Address <span className="text-[#ea694e]">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="maya.patel@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#FAF7F5] border border-[#5b5d5e]/20 rounded-xl text-[#373837] placeholder-[#5b5d5e]/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ea694e]/20 focus:border-[#ea694e] transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#373837] mb-1">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="+1 (555) 234-5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#FAF7F5] border border-[#5b5d5e]/20 rounded-xl text-[#373837] placeholder-[#5b5d5e]/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ea694e]/20 focus:border-[#ea694e] transition-all"
              />
            </div>
          </div>

          {/* Row 3: Stage & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#373837] mb-1">
                Pipeline Stage
              </label>
              <select
                value={formData.stage}
                onChange={(e) =>
                  setFormData({ ...formData, stage: e.target.value as CandidateStage })
                }
                className="w-full px-3.5 py-2 text-sm bg-[#FAF7F5] border border-[#5b5d5e]/20 rounded-xl text-[#373837] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ea694e]/20 focus:border-[#ea694e] transition-all cursor-pointer"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#373837] mb-1">
                Experience (Years)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="0.5"
                value={formData.experience}
                onChange={(e) =>
                  setFormData({ ...formData, experience: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3.5 py-2 text-sm bg-[#FAF7F5] border border-[#5b5d5e]/20 rounded-xl text-[#373837] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ea694e]/20 focus:border-[#ea694e] transition-all"
              />
            </div>
          </div>

          {/* Row 4: Rating & Resume URL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-xs font-semibold text-[#373837] mb-1">
                Candidate Rating (1 to 5)
              </label>
              <div className="flex items-center gap-1.5 py-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="p-1 hover:scale-110 transition-transform focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        star <= formData.rating
                          ? 'fill-[#ea694e] text-[#ea694e]'
                          : 'text-[#5b5d5e]/30'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-semibold text-[#5c2217] ml-2">
                  {formData.rating}.0 / 5.0
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#373837] mb-1">
                Resume Link / URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/resume.pdf"
                value={formData.resumeUrl}
                onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-[#FAF7F5] border border-[#5b5d5e]/20 rounded-xl text-[#373837] placeholder-[#5b5d5e]/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ea694e]/20 focus:border-[#ea694e] transition-all"
              />
            </div>
          </div>

          {/* Row 5: Skills */}
          <div>
            <label className="block text-xs font-semibold text-[#373837] mb-1">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              placeholder="e.g. React, Next.js, TypeScript, Node.js"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-[#FAF7F5] border border-[#5b5d5e]/20 rounded-xl text-[#373837] placeholder-[#5b5d5e]/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ea694e]/20 focus:border-[#ea694e] transition-all"
            />
          </div>

          {/* Row 6: Notes */}
          <div>
            <label className="block text-xs font-semibold text-[#373837] mb-1">
              Interviewer Notes & Background
            </label>
            <textarea
              rows={3}
              placeholder="Assessment summary, cultural fit, salary expectations..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-[#FAF7F5] border border-[#5b5d5e]/20 rounded-xl text-[#373837] placeholder-[#5b5d5e]/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ea694e]/20 focus:border-[#ea694e] transition-all resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#5b5d5e]/15 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-xs font-medium text-[#373837] bg-white border border-[#5b5d5e]/20 rounded-xl hover:bg-[#FAF7F5] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#ea694e] hover:bg-[#d8583d] active:scale-[0.98] rounded-xl transition-all shadow-xs disabled:opacity-60 cursor-pointer"
            >
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{mode === 'create' ? 'Create Candidate' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

