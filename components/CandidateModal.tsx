'use client';

import React from 'react';
import {
  ICandidate,
  CandidateStage,
} from '@/lib/types';
import { STAGES, STAGE_COLORS, formatDate } from '@/lib/utils';
import {
  X,
  Mail,
  Phone,
  Briefcase,
  Star,
  Clock,
  FileText,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
} from 'lucide-react';

interface CandidateModalProps {
  candidate: ICandidate | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (candidate: ICandidate) => void;
  onDelete: (candidate: ICandidate) => void;
  onStageChange: (candidateId: string, newStage: CandidateStage) => void;
}

export const CandidateModal: React.FC<CandidateModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onStageChange,
}) => {
  if (!isOpen || !candidate) return null;

  const stageColor = STAGE_COLORS[candidate.stage] || STAGE_COLORS['Applied'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/30 backdrop-blur-md flex justify-end animate-in fade-in duration-200 font-sans">
      {/* Slide-over Sheet container */}
      <div className="w-full max-w-2xl bg-white min-h-screen shadow-2xl flex flex-col border-l border-[#5b5d5e]/20 animate-in slide-in-from-right duration-300">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#5b5d5e]/15 flex items-start justify-between bg-[#FAF7F5]/90">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${stageColor.badge}`}
              >
                {candidate.stage}
              </span>
              <span className="text-xs text-[#5b5d5e]">
                Applied on {formatDate(candidate.createdAt)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-[#5c2217] font-serif tracking-tight">
              {candidate.name}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-[#5b5d5e] font-medium">
              <Briefcase className="h-4 w-4 text-[#5b5d5e]" />
              <span>{candidate.role}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#5b5d5e] hover:text-[#5c2217] hover:bg-black/[0.05] transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 flex-1 space-y-6 overflow-y-auto">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl border border-[#5b5d5e]/15 bg-[#FAF7F5]">
              <span className="text-xs text-[#5b5d5e] font-medium block">Rating</span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex text-[#ea694e]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < candidate.rating
                          ? 'fill-[#ea694e] text-[#ea694e]'
                          : 'text-black/[0.12]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-[#5c2217]">
                  {candidate.rating}.0
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-[#5b5d5e]/15 bg-[#FAF7F5]">
              <span className="text-xs text-[#5b5d5e] font-medium block">
                Total Experience
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-[#5c2217] font-semibold text-sm">
                <Clock className="h-4 w-4 text-[#ea694e]" />
                <span>{candidate.experience} Years</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-[#5b5d5e]/15 bg-[#FAF7F5] col-span-2 sm:col-span-1">
              <span className="text-xs text-[#5b5d5e] font-medium block">
                Stage Transition
              </span>
              <select
                value={candidate.stage}
                onChange={(e) =>
                  onStageChange(candidate._id, e.target.value as CandidateStage)
                }
                className="mt-1 w-full text-xs font-semibold py-1.5 px-2.5 rounded-xl border border-[#5b5d5e]/20 bg-white text-[#373837] focus:outline-none focus:ring-2 focus:ring-[#ea694e]/20 focus:border-[#ea694e] cursor-pointer"
              >
                {STAGES.map((st) => (
                  <option key={st} value={st}>
                    Move to: {st}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5c2217] font-serif">
              Contact Details
            </h3>
            <div className="bg-[#FAF7F5] rounded-2xl p-4 border border-[#5b5d5e]/15 space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5 text-[#5b5d5e]">
                  <Mail className="h-4 w-4" />
                  <span>Email:</span>
                </div>
                <a
                  href={`mailto:${candidate.email}`}
                  className="font-medium text-[#ea694e] hover:underline"
                >
                  {candidate.email}
                </a>
              </div>

              {candidate.phone && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5 text-[#5b5d5e]">
                    <Phone className="h-4 w-4" />
                    <span>Phone:</span>
                  </div>
                  <a
                    href={`tel:${candidate.phone}`}
                    className="font-medium text-[#373837] hover:text-[#ea694e]"
                  >
                    {candidate.phone}
                  </a>
                </div>
              )}

              {candidate.resumeUrl && (
                <div className="flex items-center justify-between text-sm pt-2 border-t border-[#5b5d5e]/15">
                  <div className="flex items-center gap-2.5 text-[#5b5d5e]">
                    <FileText className="h-4 w-4" />
                    <span>Resume Link:</span>
                  </div>
                  <a
                    href={candidate.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-[#ea694e] hover:underline text-xs bg-[#ea694e]/10 px-2.5 py-1 rounded-lg border border-[#ea694e]/20"
                  >
                    <span>View CV / Resume</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5c2217] font-serif">
              Skills & Proficiencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills && candidate.skills.length > 0 ? (
                candidate.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-medium bg-[#e9b9a6]/25 text-[#5c2217] rounded-lg border border-[#e9b9a6]/50"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-[#5b5d5e] italic">No skills listed</p>
              )}
            </div>
          </div>

          {/* Interviewer Notes & Evaluations */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5c2217] font-serif">
              Interviewer Notes & Assessment
            </h3>
            <div className="bg-[#FAF7F5] rounded-2xl p-4 border border-[#5b5d5e]/15 text-sm text-[#373837] whitespace-pre-wrap leading-relaxed">
              {candidate.notes ? (
                candidate.notes
              ) : (
                <span className="text-[#5b5d5e] italic">No notes recorded yet.</span>
              )}
            </div>
          </div>

          {/* Pipeline Timeline Steps */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#5c2217] font-serif">
              Hiring Pipeline Progress
            </h3>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#5b5d5e]/20">
              {STAGES.map((st) => {
                const currentStageIdx = STAGES.indexOf(candidate.stage);
                const stepIdx = STAGES.indexOf(st);
                const isPassed = stepIdx <= currentStageIdx && candidate.stage !== 'Rejected';
                const isCurrent = candidate.stage === st;

                return (
                  <div key={st} className="relative flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`absolute -left-6 h-4 w-4 rounded-full flex items-center justify-center ${
                          isCurrent
                            ? 'bg-[#ea694e] text-white ring-4 ring-[#ea694e]/20'
                            : isPassed
                            ? 'bg-[#5c2217] text-white'
                            : 'bg-black/[0.1] text-black/[0.3]'
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                      <span
                        className={`font-medium ${
                          isCurrent ? 'text-[#ea694e] font-bold' : isPassed ? 'text-[#373837]' : 'text-[#5b5d5e]'
                        }`}
                      >
                        {st}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-[#ea694e]/10 text-[#ea694e] rounded-full border border-[#ea694e]/20">
                        Current Stage
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-[#5b5d5e]/15 bg-[#FAF7F5] flex items-center justify-between">
          <button
            onClick={() => {
              onDelete(candidate);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#5c2217] hover:bg-[#5c2217]/10 rounded-xl transition-colors cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Candidate</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#373837] bg-white border border-[#5b5d5e]/20 rounded-xl hover:bg-black/[0.04] transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onEdit(candidate);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#ea694e] hover:bg-[#d8583d] rounded-xl transition-colors shadow-sm shadow-[#ea694e]/25 cursor-pointer"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
