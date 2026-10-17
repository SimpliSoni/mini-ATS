'use client';

import React from 'react';
import {
  ICandidate,
  CandidateStage,
} from '@/lib/types';
import { STAGES, STAGE_COLORS, formatDate } from '@/lib/utils';
import {
  Star,
  ExternalLink,
  Edit2,
  Trash2,
  ArrowUpDown,
  Mail,
  Phone,
  FileText,
} from 'lucide-react';

interface CandidateTableProps {
  candidates: ICandidate[];
  onSelectCandidate: (candidate: ICandidate) => void;
  onEditCandidate: (candidate: ICandidate) => void;
  onDeleteCandidate: (candidate: ICandidate) => void;
  onStageChange: (candidateId: string, newStage: CandidateStage) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (column: 'date' | 'experience' | 'rating' | 'name') => void;
}

export const CandidateTable: React.FC<CandidateTableProps> = ({
  candidates,
  onSelectCandidate,
  onEditCandidate,
  onDeleteCandidate,
  onStageChange,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  if (candidates.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-800 mb-1">
          No candidates found
        </h3>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          No profiles matched your active search or filter criteria. Try adjusting your filters.
        </p>
      </div>
    );
  }

  const renderSortIndicator = (col: string) => {
    if (sortBy !== col) {
      return <ArrowUpDown className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return (
      <span className="text-blue-600 font-bold text-xs">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/80 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
            <tr>
              <th
                onClick={() => onSortChange('name')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Candidate</span>
                  {renderSortIndicator('name')}
                </div>
              </th>
              <th className="py-3.5 px-4">Role</th>
              <th className="py-3.5 px-4">Stage</th>
              <th
                onClick={() => onSortChange('experience')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Exp</span>
                  {renderSortIndicator('experience')}
                </div>
              </th>
              <th
                onClick={() => onSortChange('rating')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Rating</span>
                  {renderSortIndicator('rating')}
                </div>
              </th>
              <th className="py-3.5 px-4">Skills</th>
              <th
                onClick={() => onSortChange('date')}
                className="py-3.5 px-4 cursor-pointer hover:bg-slate-100/70 transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Applied</span>
                  {renderSortIndicator('date')}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.map((candidate) => {
              const stageColor = STAGE_COLORS[candidate.stage] || STAGE_COLORS['Applied'];

              return (
                <tr
                  key={candidate._id}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Candidate Name & Contact */}
                  <td className="py-3.5 px-4">
                    <div>
                      <button
                        onClick={() => onSelectCandidate(candidate)}
                        className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-left"
                      >
                        {candidate.name}
                      </button>
                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span className="truncate max-w-[150px]">{candidate.email}</span>
                        </span>
                        {candidate.phone && (
                          <span className="hidden sm:flex items-center gap-1">
                            <Phone className="h-3 w-3 text-slate-400" />
                            <span>{candidate.phone}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-slate-800 text-xs bg-slate-100/70 px-2.5 py-1 rounded-md border border-slate-200/60 inline-block">
                      {candidate.role}
                    </span>
                  </td>

                  {/* Stage Dropdown Selector */}
                  <td className="py-3.5 px-4">
                    <div className="relative inline-block">
                      <select
                        value={candidate.stage}
                        onChange={(e) =>
                          onStageChange(candidate._id, e.target.value as CandidateStage)
                        }
                        className={`text-xs font-semibold py-1 px-2.5 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${stageColor.badge}`}
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </td>

                  {/* Experience */}
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-700 text-xs">
                      {candidate.experience} yrs
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < candidate.rating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-slate-600 ml-1">
                        {candidate.rating}
                      </span>
                    </div>
                  </td>

                  {/* Skills tags */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[200px]">
                      {candidate.skills && candidate.skills.length > 0 ? (
                        <>
                          {candidate.skills.slice(0, 2).map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-700 rounded border border-slate-200/60"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 2 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-500 rounded">
                              +{candidate.skills.length - 2}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </div>
                  </td>

                  {/* Applied Date */}
                  <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                    {formatDate(candidate.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onSelectCandidate(candidate)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="View Profile Details"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditCandidate(candidate)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Edit Candidate"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteCandidate(candidate)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Candidate"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
