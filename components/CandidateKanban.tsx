'use client';

import React, { useState } from 'react';
import {
  ICandidate,
  CandidateStage,
} from '@/lib/types';
import { STAGES, STAGE_COLORS } from '@/lib/utils';
import {
  Star,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  GripVertical,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface CandidateKanbanProps {
  candidates: ICandidate[];
  onSelectCandidate: (candidate: ICandidate) => void;
  onEditCandidate: (candidate: ICandidate) => void;
  onDeleteCandidate: (candidate: ICandidate) => void;
  onStageChange: (candidateId: string, newStage: CandidateStage) => void;
}

export const CandidateKanban: React.FC<CandidateKanbanProps> = ({
  candidates,
  onSelectCandidate,
  onEditCandidate,
  onDeleteCandidate,
  onStageChange,
}) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [activeDropStage, setActiveDropStage] = useState<CandidateStage | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedId(id);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setActiveDropStage(null);
  };

  const handleDragOver = (e: React.DragEvent, stage: CandidateStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropStage !== stage) {
      setActiveDropStage(stage);
    }
  };

  const handleDragLeave = (e: React.DragEvent, stage: CandidateStage) => {
    e.preventDefault();
    // Only clear if the cursor actually exited the column container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      if (activeDropStage === stage) {
        setActiveDropStage(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent, stage: CandidateStage) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      onStageChange(id, stage);
    }
    setDraggedId(null);
    setActiveDropStage(null);
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-1 items-start kanban-scroll min-h-[calc(100vh-340px)] font-sans">
      {STAGES.map((stage) => {
        const stageCandidates = candidates.filter((c) => c.stage === stage);
        const color = STAGE_COLORS[stage];
        const isDropTarget = activeDropStage === stage;

        return (
          <div
            key={stage}
            onDragOver={(e) => handleDragOver(e, stage)}
            onDragLeave={(e) => handleDragLeave(e, stage)}
            onDrop={(e) => handleDrop(e, stage)}
            className={`w-[290px] sm:w-[310px] min-w-[290px] sm:min-w-[310px] shrink-0 flex flex-col rounded-2xl bg-[#FAF7F5] border transition-all duration-200 p-2 relative overflow-hidden ${
              isDropTarget
                ? 'border-[#ea694e] ring-2 ring-[#ea694e]/25 bg-[#ea694e]/[0.02]'
                : 'border-[#5b5d5e]/15'
            }`}
          >
            {/* Top Accent Strip */}
            <div
              className="h-1 w-full absolute top-0 left-0 opacity-80"
              style={{ backgroundColor: color.accent }}
            />

            {/* Column Header */}
            <div className="p-3 mb-1.5 flex items-center justify-between pt-3.5">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0 shadow-2xs"
                  style={{ backgroundColor: color.accent }}
                />
                <h3 className="font-bold text-[14px] tracking-tight text-[#5c2217] font-serif">
                  {stage}
                </h3>
              </div>
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-black/[0.04] text-[#5b5d5e]">
                {stageCandidates.length}
              </span>
            </div>

            {/* Candidate Cards Column Area */}
            <div className="space-y-2.5 flex-1 min-h-[380px] max-h-[760px] overflow-y-auto px-1 pb-2 kanban-scroll">
              {stageCandidates.length === 0 ? (
                <div
                  className={`h-36 border border-dashed rounded-xl flex flex-col items-center justify-center p-4 text-center transition-colors ${
                    isDropTarget
                      ? 'border-[#ea694e] bg-[#ea694e]/5'
                      : 'border-[#5b5d5e]/20 bg-white/60'
                  }`}
                >
                  <p className="text-xs font-medium text-[#5b5d5e]">
                    No candidates in {stage}
                  </p>
                  <p className="text-[11px] text-[#5b5d5e]/70 mt-1">
                    Drop candidate card here
                  </p>
                </div>
              ) : (
                stageCandidates.map((candidate) => {
                  const isBeingDragged = draggedId === candidate._id;

                  return (
                    <div
                      key={candidate._id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, candidate._id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onSelectCandidate(candidate)}
                      className={`group bg-white rounded-xl border border-[#5b5d5e]/15 p-3.5 shadow-[0_1px_3px_rgba(55,56,55,0.03),0_2px_8px_rgba(55,56,55,0.01)] hover:shadow-[0_4px_16px_rgba(92,34,23,0.08),0_2px_4px_rgba(92,34,23,0.03)] hover:-translate-y-0.5 transition-all duration-200 cursor-grab active:cursor-grabbing relative select-none ${
                        isBeingDragged
                          ? 'opacity-30 scale-95 border-dashed border-[#ea694e]'
                          : ''
                      }`}
                    >
                      {/* Top Bar: Name, Role & Drag Handle */}
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <div className="flex-1 pr-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectCandidate(candidate);
                            }}
                            className="font-bold text-sm text-[#5c2217] hover:text-[#ea694e] transition-colors text-left line-clamp-1 cursor-pointer font-serif"
                          >
                            {candidate.name}
                          </button>
                          <p className="text-xs text-[#5b5d5e] font-normal line-clamp-1 mt-0.5 font-sans">
                            {candidate.role}
                          </p>
                        </div>
                        <div className="flex items-center text-[#5b5d5e] pt-0.5">
                          <GripVertical className="h-4 w-4 opacity-30 group-hover:opacity-75 transition-opacity" />
                        </div>
                      </div>

                      {/* Ratings and Experience Badges */}
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <div className="inline-flex items-center bg-[#ea694e]/10 text-[#ea694e] border border-[#ea694e]/20 px-2 py-0.5 rounded-full text-[11px] font-medium font-sans">
                          <Star className="h-3 w-3 fill-[#ea694e] text-[#ea694e] mr-1" />
                          <span>{candidate.rating}.0</span>
                        </div>
                        <div className="inline-flex items-center bg-black/[0.03] text-[#373837] border border-[#5b5d5e]/15 px-2 py-0.5 rounded-full text-[11px] font-medium font-sans">
                          <Clock className="h-3 w-3 text-[#5b5d5e] mr-1" />
                          <span>{candidate.experience}y exp</span>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      {candidate.skills && candidate.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2.5">
                          {candidate.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 text-[10px] font-medium bg-[#e9b9a6]/25 text-[#5c2217] rounded-md border border-[#e9b9a6]/50 truncate max-w-[100px] font-sans"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-black/[0.04] text-[#5b5d5e] rounded-md border border-[#5b5d5e]/15 font-sans">
                              +{candidate.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Notes snippet preview */}
                      {candidate.notes && (
                        <p className="text-[11px] text-[#5b5d5e] line-clamp-2 mb-2.5 bg-[#FAF7F5] p-2 rounded-lg border border-[#5b5d5e]/10 font-sans italic">
                          &ldquo;{candidate.notes}&rdquo;
                        </p>
                      )}

                      {/* Card Footer: Quick Stage Switcher & Action Icons */}
                      <div
                        className="pt-2.5 border-t border-[#5b5d5e]/15 flex items-center justify-between text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Stage Switcher */}
                        <div className="flex items-center gap-1">
                          <ArrowRight className="h-3 w-3 text-[#5b5d5e]" />
                          <select
                            value={candidate.stage}
                            onChange={(e) =>
                              onStageChange(candidate._id, e.target.value as CandidateStage)
                            }
                            className="text-[11px] font-medium bg-[#FAF7F5] hover:bg-black/[0.04] border border-[#5b5d5e]/20 rounded-md px-1.5 py-0.5 text-[#373837] focus:outline-none focus:ring-1 focus:ring-[#ea694e] cursor-pointer transition-colors font-sans"
                          >
                            {STAGES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Actions: View details, Edit, Delete */}
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onSelectCandidate(candidate)}
                            className="p-1 rounded-md text-[#5b5d5e] hover:text-[#ea694e] hover:bg-[#ea694e]/10 transition-colors cursor-pointer"
                            title="View Full Profile"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onEditCandidate(candidate)}
                            className="p-1 rounded-md text-[#5b5d5e] hover:text-[#5c2217] hover:bg-black/[0.05] transition-colors cursor-pointer"
                            title="Edit Candidate"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteCandidate(candidate)}
                            className="p-1 rounded-md text-[#5b5d5e] hover:text-[#5c2217] hover:bg-[#5c2217]/10 transition-colors cursor-pointer"
                            title="Delete Candidate"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
