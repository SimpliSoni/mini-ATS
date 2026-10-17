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
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  Building,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      {/* Slide-over Sheet / Modal container */}
      <div className="w-full max-w-2xl bg-white min-h-screen shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-300">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50/60">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${stageColor.badge}`}
              >
                {candidate.stage}
              </span>
              <span className="text-xs text-slate-500">
                Applied on {formatDate(candidate.createdAt)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {candidate.name}
            </h2>
            <div className="flex items-center gap-2 mt-1 text-sm text-slate-600 font-medium">
              <Briefcase className="h-4 w-4 text-slate-400" />
              <span>{candidate.role}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 flex-1 space-y-6 overflow-y-auto">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <span className="text-xs text-slate-500 font-medium block">Rating</span>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < candidate.rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-800">
                  {candidate.rating}.0
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50">
              <span className="text-xs text-slate-500 font-medium block">
                Total Experience
              </span>
              <div className="flex items-center gap-1.5 mt-1 text-slate-800 font-bold text-sm">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{candidate.experience} Years</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 col-span-2 sm:col-span-1">
              <span className="text-xs text-slate-500 font-medium block">
                Stage Transition
              </span>
              <select
                value={candidate.stage}
                onChange={(e) =>
                  onStageChange(candidate._id, e.target.value as CandidateStage)
                }
                className="mt-1 w-full text-xs font-semibold py-1 px-2 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Contact Details
            </h3>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>Email:</span>
                </div>
                <a
                  href={`mailto:${candidate.email}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {candidate.email}
                </a>
              </div>

              {candidate.phone && (
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span>Phone:</span>
                  </div>
                  <a
                    href={`tel:${candidate.phone}`}
                    className="font-medium text-slate-800 hover:text-blue-600"
                  >
                    {candidate.phone}
                  </a>
                </div>
              )}

              {candidate.resumeUrl && (
                <div className="flex items-center justify-between text-sm pt-1 border-t border-slate-200/60">
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span>Resume Link:</span>
                  </div>
                  <a
                    href={candidate.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:underline text-xs bg-blue-50 px-2.5 py-1 rounded border border-blue-200"
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
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Skills & Proficiencies
            </h3>
            <div className="flex flex-wrap gap-2">
              {candidate.skills && candidate.skills.length > 0 ? (
                candidate.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-lg border border-slate-200 shadow-2xs"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No skills listed</p>
              )}
            </div>
          </div>

          {/* Interviewer Notes & Evaluations */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Interviewer Notes & Assessment
            </h3>
            <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {candidate.notes ? (
                candidate.notes
              ) : (
                <span className="text-slate-400 italic">No notes recorded yet.</span>
              )}
            </div>
          </div>

          {/* Pipeline Timeline Steps */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Hiring Pipeline Progress
            </h3>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
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
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                            : isPassed
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        <CheckCircle2 className="h-3 w-3" />
                      </div>
                      <span
                        className={`font-semibold ${
                          isCurrent ? 'text-blue-600 font-bold' : isPassed ? 'text-slate-800' : 'text-slate-400'
                        }`}
                      >
                        {st}
                      </span>
                    </div>
                    {isCurrent && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 rounded border border-blue-200">
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
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              onDelete(candidate);
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Candidate</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onEdit(candidate);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
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
