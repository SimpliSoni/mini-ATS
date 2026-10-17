'use client';

import React, { useState } from 'react';
import {
  ICandidate,
  CandidateStage,
} from '@/lib/types';
import { STAGES, STAGE_COLORS, formatRelativeTime } from '@/lib/utils';
import {
  MoreVertical,
  Star,
  Clock,
  ExternalLink,
  Edit2,
  Trash2,
  GripVertical,
  ArrowRightCircle,
  FileText,
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
    if (activeDropStage === stage) {
      setActiveDropStage(null);
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 overflow-x-auto pb-6">
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
            className={`flex flex-col rounded-xl border transition-all duration-200 min-w-[280px] ${
              color.columnBg
            } ${
              isDropTarget
                ? 'border-blue-500 ring-2 ring-blue-500/30 scale-[1.01]'
                : 'border-slate-200/90'
            }`}
          >
            {/* Column Header */}
            <div className="p-3.5 border-b border-slate-200/80 bg-white/70 backdrop-blur-xs rounded-t-xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${color.dot}`} />
                <h3 className="font-bold text-sm text-slate-800">{stage}</h3>
              </div>
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {stageCandidates.length}
              </span>
            </div>

            {/* Candidate Cards List */}
            <div className="p-2.5 flex-1 space-y-3 min-h-[320px] max-h-[720px] overflow-y-auto kanban-scroll">
              {stageCandidates.length === 0 ? (
                <div className="h-44 border-2 border-dashed border-slate-200/80 rounded-lg flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-xs font-medium text-slate-400">
                    No candidates in {stage}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Drag cards here or use stage switcher
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
                      className={`group bg-white rounded-xl border border-slate-200 p-3.5 shadow-xs hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing relative ${
                        isBeingDragged ? 'opacity-40 scale-95 border-dashed border-blue-400' : ''
                      }`}
                    >
                      {/* Top Bar: Drag indicator, Role & Options */}
                      <div className="flex items-start justify-between gap-1 mb-2">
                        <div className="flex-1 pr-1">
                          <button
                            onClick={() => onSelectCandidate(candidate)}
                            className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors text-left line-clamp-1"
                          >
                            {candidate.name}
                          </button>
                          <p className="text-xs font-medium text-slate-500 line-clamp-1 mt-0.5">
                            {candidate.role}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-slate-400">
                          <GripVertical className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>

                      {/* Ratings and Experience Badges */}
                      <div className="flex items-center gap-2 mb-2.5">
                        <div className="flex items-center text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded text-[11px] font-semibold border border-amber-200/60">
                          <Star className="h-3 w-3 fill-amber-400 mr-1" />
                          <span>{candidate.rating}.0</span>
                        </div>
                        <div className="flex items-center text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                          <Clock className="h-3 w-3 text-slate-400 mr-1" />
                          <span>{candidate.experience} yrs exp</span>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      {candidate.skills && candidate.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {candidate.skills.slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700 rounded border border-slate-200/60 truncate max-w-[110px]"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 3 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-500 rounded">
                              +{candidate.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Notes snippet preview */}
                      {candidate.notes && (
                        <p className="text-[11px] text-slate-500 italic line-clamp-2 mb-3 bg-slate-50/70 p-2 rounded border border-slate-100">
                          &ldquo;{candidate.notes}&rdquo;
                        </p>
                      )}

                      {/* Card Footer: Quick Stage Switcher & Action Icons */}
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        {/* Instant Quick Stage Switcher */}
                        <div className="flex items-center gap-1">
                          <ArrowRightCircle className="h-3.5 w-3.5 text-slate-400" />
                          <select
                            value={candidate.stage}
                            onChange={(e) =>
                              onStageChange(candidate._id, e.target.value as CandidateStage)
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="text-[11px] font-medium bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                          >
                            {STAGES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Actions: View details, Edit, Delete */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onSelectCandidate(candidate)}
                            className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="View Full Profile"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onEditCandidate(candidate)}
                            className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title="Edit Candidate"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteCandidate(candidate)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
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
