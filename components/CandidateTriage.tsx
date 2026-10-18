'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  ICandidate,
  CandidateStage,
} from '@/lib/types';
import { STAGES, STAGE_COLORS, formatDate, formatRelativeTime } from '@/lib/utils';
import {
  Star,
  Clock,
  Briefcase,
  Mail,
  Phone,
  FileText,
  ExternalLink,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  XCircle,
  ArrowRight,
  FastForward,
  UserCheck,
  Search,
  Sparkles,
  Inbox,
  Plus,
} from 'lucide-react';

interface CandidateTriageProps {
  candidates: ICandidate[];
  onSelectCandidate: (candidate: ICandidate) => void;
  onEditCandidate: (candidate: ICandidate) => void;
  onDeleteCandidate: (candidate: ICandidate) => void;
  onStageChange: (candidateId: string, newStage: CandidateStage) => void;
  selectedStageFilter: string;
  onStageFilterChange: (stage: string) => void;
  onAddCandidate?: () => void;
}

export const CandidateTriage: React.FC<CandidateTriageProps> = ({
  candidates,
  onSelectCandidate,
  onEditCandidate,
  onDeleteCandidate,
  onStageChange,
  selectedStageFilter,
  onStageFilterChange,
  onAddCandidate,
}) => {
  // Selected candidate state in the detail pane
  const [activeCandidateId, setActiveCandidateId] = useState<string | null>(
    candidates.length > 0 ? candidates[0]._id : null
  );

  // Mobile state: toggle between list and candidate dossier
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  // Sync active candidate when candidate list updates
  useEffect(() => {
    if (candidates.length === 0) {
      setActiveCandidateId(null);
    } else if (!candidates.some((c) => c._id === activeCandidateId)) {
      setActiveCandidateId(candidates[0]._id);
    }
  }, [candidates, activeCandidateId]);

  // Current candidate object
  const activeCandidate = useMemo(
    () => candidates.find((c) => c._id === activeCandidateId) || null,
    [candidates, activeCandidateId]
  );

  // Keyboard navigation: ArrowUp and ArrowDown to cycle through candidate queue
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (candidates.length === 0) return;

      const currentIndex = candidates.findIndex((c) => c._id === activeCandidateId);

      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % candidates.length;
        setActiveCandidateId(candidates[nextIndex]._id);
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + candidates.length) % candidates.length;
        setActiveCandidateId(candidates[prevIndex]._id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [candidates, activeCandidateId]);

  // Determine stage progression options
  const getNextStage = (currentStage: CandidateStage): CandidateStage | null => {
    switch (currentStage) {
      case 'Applied':
        return 'Screening';
      case 'Screening':
        return 'Technical Interview';
      case 'Technical Interview':
        return 'Offered';
      case 'Offered':
      case 'Rejected':
      default:
        return null;
    }
  };

  const nextStage = activeCandidate ? getNextStage(activeCandidate.stage) : null;
  const activeColor = activeCandidate
    ? STAGE_COLORS[activeCandidate.stage]
    : STAGE_COLORS['Applied'];

  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-[#5b5d5e]/15 p-12 text-center shadow-xs font-sans">
        <div className="h-14 w-14 rounded-2xl bg-[#FAF7F5] border border-[#5b5d5e]/15 flex items-center justify-center mx-auto mb-3 text-[#5b5d5e]">
          <Inbox className="h-7 w-7 text-[#ea694e]" />
        </div>
        <h3 className="text-lg font-bold text-[#5c2217] font-serif mb-1">
          No Candidates in Triage Queue
        </h3>
        <p className="text-sm text-[#5b5d5e] max-w-sm mx-auto mb-4">
          No candidates match your current filters, or no candidates have been added to the pipeline yet.
        </p>
        {onAddCandidate && (
          <button
            onClick={onAddCandidate}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#ea694e] hover:bg-[#d8583d] active:scale-[0.98] rounded-full shadow-sm shadow-[#ea694e]/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Candidate</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="font-sans space-y-3">
      {/* Stage Cohort Tabs at the Top of Triage */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 kanban-scroll">
        <button
          onClick={() => onStageFilterChange('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedStageFilter === 'all'
              ? 'bg-[#5c2217] text-white shadow-xs'
              : 'bg-white border border-[#5b5d5e]/15 text-[#5b5d5e] hover:text-[#373837] hover:bg-[#FAF7F5]'
          }`}
        >
          All Stages ({candidates.length})
        </button>
        {STAGES.map((st) => {
          const color = STAGE_COLORS[st];
          const isSelected = selectedStageFilter === st;
          return (
            <button
              key={st}
              onClick={() => onStageFilterChange(st)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'text-white shadow-xs'
                  : 'bg-white border border-[#5b5d5e]/15 text-[#373837] hover:bg-[#FAF7F5]'
              }`}
              style={{
                backgroundColor: isSelected ? color.accent : undefined,
                borderColor: isSelected ? color.accent : undefined,
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: isSelected ? '#ffffff' : color.accent,
                }}
              />
              <span>{st}</span>
            </button>
          );
        })}
      </div>

      {/* Main Split Command Center Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ================= LEFT MASTER LIST (5 of 12 columns) ================= */}
        <div
          className={`lg:col-span-5 bg-white rounded-2xl border border-[#5b5d5e]/15 shadow-[0_1px_3px_rgba(55,56,55,0.03),0_4px_12px_rgba(55,56,55,0.02)] overflow-hidden flex flex-col ${
            mobileShowDetail ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* List Header */}
          <div className="p-3.5 border-b border-[#5b5d5e]/15 bg-[#FAF7F5]/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#5c2217] font-serif uppercase tracking-wider">
                Candidates Queue
              </span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white text-[#5c2217] border border-[#5b5d5e]/15 shadow-2xs">
                {candidates.length}
              </span>
            </div>
            <div className="text-[11px] text-[#5b5d5e] hidden sm:block">
              Use <kbd className="px-1 py-0.5 bg-white rounded border border-[#5b5d5e]/20 text-[10px]">↑</kbd>{' '}
              <kbd className="px-1 py-0.5 bg-white rounded border border-[#5b5d5e]/20 text-[10px]">↓</kbd> to triage
            </div>
          </div>

          {/* Scrollable Candidate Feed */}
          <div className="divide-y divide-[#5b5d5e]/10 overflow-y-auto max-h-[720px] kanban-scroll">
            {candidates.map((candidate) => {
              const isSelected = candidate._id === activeCandidateId;
              const color = STAGE_COLORS[candidate.stage] || STAGE_COLORS['Applied'];

              return (
                <button
                  key={candidate._id}
                  onClick={() => {
                    setActiveCandidateId(candidate._id);
                    setMobileShowDetail(true);
                  }}
                  className={`w-full text-left p-4 transition-all duration-150 cursor-pointer relative group flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-[#ea694e]/[0.05]'
                      : 'hover:bg-[#FAF7F5]/70'
                  }`}
                >
                  {/* Left Active Selection Indicator */}
                  {isSelected && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ea694e]" />
                  )}

                  {/* Candidate Avatar Initials */}
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center font-bold font-serif text-sm shrink-0 border shadow-2xs transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: `${color.accent}18`,
                      borderColor: `${color.accent}40`,
                      color: color.accent,
                    }}
                  >
                    {candidate.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4
                        className={`text-sm font-bold truncate font-serif transition-colors ${
                          isSelected ? 'text-[#ea694e]' : 'text-[#5c2217] group-hover:text-[#ea694e]'
                        }`}
                      >
                        {candidate.name}
                      </h4>
                      <span className="text-[11px] text-[#5b5d5e] whitespace-nowrap shrink-0">
                        {formatRelativeTime(candidate.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-[#5b5d5e] truncate mb-2">
                      {candidate.role}
                    </p>

                    {/* Bottom Metadata: Stage Badge & Rating */}
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${color.badge}`}
                      >
                        {candidate.stage}
                      </span>

                      <div className="flex items-center gap-1.5 text-xs">
                        <div className="flex items-center text-[#ea694e]">
                          <Star className="h-3 w-3 fill-[#ea694e] text-[#ea694e] mr-0.5" />
                          <span className="font-semibold text-[#5c2217] text-[11px]">
                            {candidate.rating}.0
                          </span>
                        </div>
                        <span className="text-[#5b5d5e]/50">•</span>
                        <span className="text-[11px] text-[#5b5d5e]">
                          {candidate.experience}y exp
                        </span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight
                    className={`h-4 w-4 shrink-0 mt-3 transition-transform ${
                      isSelected
                        ? 'text-[#ea694e] translate-x-0.5'
                        : 'text-[#5b5d5e]/30 group-hover:text-[#5b5d5e]'
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT DETAIL DOSSIER (7 of 12 columns) ================= */}
        <div
          className={`lg:col-span-7 bg-white rounded-2xl border border-[#5b5d5e]/15 shadow-[0_1px_3px_rgba(55,56,55,0.03),0_4px_12px_rgba(55,56,55,0.02)] overflow-hidden flex flex-col ${
            !mobileShowDetail ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {activeCandidate ? (
            <div>
              {/* Mobile Back Button */}
              <div className="p-3 border-b border-[#5b5d5e]/15 bg-[#FAF7F5] lg:hidden flex items-center justify-between">
                <button
                  onClick={() => setMobileShowDetail(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5c2217] hover:text-[#ea694e] cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back to Queue</span>
                </button>
                <span className="text-xs text-[#5b5d5e]">
                  Candidate Profile
                </span>
              </div>

              {/* Dossier Header */}
              <div className="p-6 border-b border-[#5b5d5e]/15 bg-gradient-to-b from-[#FAF7F5] to-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div
                      className="h-14 w-14 rounded-2xl flex items-center justify-center font-bold font-serif text-lg shrink-0 border shadow-sm"
                      style={{
                        backgroundColor: `${activeColor.accent}20`,
                        borderColor: `${activeColor.accent}50`,
                        color: activeColor.accent,
                      }}
                    >
                      {activeCandidate.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>

                    <div>
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#5c2217] tracking-tight">
                          {activeCandidate.name}
                        </h2>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${activeColor.badge}`}
                        >
                          {activeCandidate.stage}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-[#5b5d5e] mt-1">
                        <Briefcase className="h-4 w-4 text-[#5b5d5e] shrink-0" />
                        <span>{activeCandidate.role}</span>
                        <span>•</span>
                        <span>Applied {formatDate(activeCandidate.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={() => onEditCandidate(activeCandidate)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#373837] bg-white border border-[#5b5d5e]/20 rounded-xl hover:bg-[#FAF7F5] transition-colors cursor-pointer"
                      title="Edit Profile"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onDeleteCandidate(activeCandidate)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#5c2217] hover:bg-[#5c2217]/10 rounded-xl transition-colors cursor-pointer"
                      title="Delete Candidate"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ================= STAGE ACCELERATOR DECK ================= */}
              <div className="p-5 border-b border-[#5b5d5e]/15 bg-[#FAF7F5]/50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-[#5c2217] font-serif uppercase tracking-wider">
                    Pipeline Acceleration Gate
                  </span>
                  <span className="text-xs text-[#5b5d5e]">
                    Current: <strong className="text-[#373837]">{activeCandidate.stage}</strong>
                  </span>
                </div>

                {/* Visual Connected Step Track */}
                <div className="grid grid-cols-5 gap-1.5 mb-4">
                  {STAGES.map((st, idx) => {
                    const currentIdx = STAGES.indexOf(activeCandidate.stage);
                    const isPassed = idx <= currentIdx && activeCandidate.stage !== 'Rejected';
                    const isCurrent = activeCandidate.stage === st;
                    const stageCol = STAGE_COLORS[st];

                    return (
                      <button
                        key={st}
                        onClick={() => onStageChange(activeCandidate._id, st)}
                        className={`p-2 rounded-xl border text-center transition-all cursor-pointer relative group ${
                          isCurrent
                            ? 'shadow-xs'
                            : 'border-[#5b5d5e]/15 bg-white hover:border-[#5b5d5e]/30'
                        }`}
                        style={{
                          backgroundColor: isCurrent ? `${stageCol.accent}15` : undefined,
                          borderColor: isCurrent ? stageCol.accent : undefined,
                        }}
                      >
                        <div
                          className="h-1 w-full absolute top-0 left-0 rounded-t-xl"
                          style={{
                            backgroundColor: isCurrent || isPassed ? stageCol.accent : 'transparent',
                          }}
                        />
                        <span
                          className="block text-[10px] font-bold truncate mt-0.5"
                          style={{ color: isCurrent ? stageCol.accent : '#5b5d5e' }}
                        >
                          {st}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Quick 1-Click Action Bar */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  {nextStage ? (
                    <button
                      onClick={() => onStageChange(activeCandidate._id, nextStage)}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-[#ea694e] hover:bg-[#d8583d] active:scale-[0.98] rounded-xl shadow-xs transition-all cursor-pointer"
                    >
                      <FastForward className="h-4 w-4" />
                      <span>Advance to {nextStage}</span>
                    </button>
                  ) : activeCandidate.stage === 'Offered' ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#ea694e]/12 text-[#ea694e] rounded-xl border border-[#ea694e]/30">
                      <UserCheck className="h-4 w-4" />
                      <span>Offer Extended — Awaiting Candidate Acceptance</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => onStageChange(activeCandidate._id, 'Applied')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#373837] bg-white border border-[#5b5d5e]/20 rounded-xl hover:bg-[#FAF7F5] cursor-pointer"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      <span>Re-activate Candidate</span>
                    </button>
                  )}

                  {activeCandidate.stage !== 'Rejected' && (
                    <button
                      onClick={() => onStageChange(activeCandidate._id, 'Rejected')}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#5b5d5e] hover:text-[#5c2217] hover:bg-black/[0.04] rounded-xl transition-colors cursor-pointer"
                    >
                      <XCircle className="h-3.5 w-3.5 text-[#5b5d5e]" />
                      <span>Pass / Reject</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Dossier Body Content */}
              <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto kanban-scroll">
                {/* 3 Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl border border-[#5b5d5e]/15 bg-[#FAF7F5]">
                    <span className="text-[11px] font-semibold text-[#5b5d5e] uppercase tracking-wider block">
                      Candidate Rating
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex text-[#ea694e]">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= activeCandidate.rating
                                ? 'fill-[#ea694e] text-[#ea694e]'
                                : 'text-black/[0.12]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold text-[#5c2217]">
                        {activeCandidate.rating}.0
                      </span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-[#5b5d5e]/15 bg-[#FAF7F5]">
                    <span className="text-[11px] font-semibold text-[#5b5d5e] uppercase tracking-wider block">
                      Total Experience
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 text-[#5c2217] font-bold text-sm">
                      <Clock className="h-4 w-4 text-[#ea694e]" />
                      <span>{activeCandidate.experience} Years</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-[#5b5d5e]/15 bg-[#FAF7F5]">
                    <span className="text-[11px] font-semibold text-[#5b5d5e] uppercase tracking-wider block">
                      Pipeline Velocity
                    </span>
                    <div className="flex items-center gap-1.5 mt-1 text-[#373837] font-semibold text-xs">
                      <Sparkles className="h-4 w-4 text-[#ea694e]" />
                      <span>Active {formatRelativeTime(activeCandidate.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information Card */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5c2217] font-serif mb-2.5">
                    Contact & Resume Dossier
                  </h4>
                  <div className="bg-[#FAF7F5] rounded-2xl p-4 border border-[#5b5d5e]/15 space-y-2.5 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[#5b5d5e]">
                        <Mail className="h-4 w-4" />
                        <span>Email:</span>
                      </div>
                      <a
                        href={`mailto:${activeCandidate.email}`}
                        className="font-medium text-[#ea694e] hover:underline"
                      >
                        {activeCandidate.email}
                      </a>
                    </div>

                    {activeCandidate.phone && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[#5b5d5e]">
                          <Phone className="h-4 w-4" />
                          <span>Phone:</span>
                        </div>
                        <a
                          href={`tel:${activeCandidate.phone}`}
                          className="font-medium text-[#373837] hover:text-[#ea694e]"
                        >
                          {activeCandidate.phone}
                        </a>
                      </div>
                    )}

                    {activeCandidate.resumeUrl && (
                      <div className="flex items-center justify-between pt-2 border-t border-[#5b5d5e]/15">
                        <div className="flex items-center gap-2 text-[#5b5d5e]">
                          <FileText className="h-4 w-4" />
                          <span>CV / Resume:</span>
                        </div>
                        <a
                          href={activeCandidate.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 font-semibold text-xs text-[#ea694e] hover:underline bg-[#ea694e]/10 px-3 py-1 rounded-lg border border-[#ea694e]/20"
                        >
                          <span>View Full Resume</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills Section */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5c2217] font-serif mb-2.5">
                    Assessed Skills & Proficiencies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeCandidate.skills && activeCandidate.skills.length > 0 ? (
                      activeCandidate.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-xs font-medium bg-[#e9b9a6]/25 text-[#5c2217] rounded-lg border border-[#e9b9a6]/50"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-[#5b5d5e] italic">No skills recorded</p>
                    )}
                  </div>
                </div>

                {/* Interviewer Notes */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#5c2217] font-serif mb-2.5">
                    Interviewer Assessment & Notes
                  </h4>
                  <div className="bg-[#FAF7F5] rounded-2xl p-4 border border-[#5b5d5e]/15 text-sm text-[#373837] leading-relaxed whitespace-pre-wrap">
                    {activeCandidate.notes ? (
                      activeCandidate.notes
                    ) : (
                      <span className="text-[#5b5d5e] italic">
                        No notes or evaluation summary recorded yet.
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center text-[#5b5d5e]">
              <Search className="h-8 w-8 mx-auto mb-2 text-[#5b5d5e]/40" />
              <p className="text-sm font-medium">Select a candidate to view dossier</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
