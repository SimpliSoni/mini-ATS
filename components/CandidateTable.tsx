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
      <div className="bg-white rounded-2xl border border-[#5b5d5e]/15 p-12 text-center shadow-xs font-sans">
        <div className="h-12 w-12 rounded-full bg-[#FAF7F5] flex items-center justify-center mx-auto mb-3 text-[#5b5d5e]">
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="text-base font-bold text-[#5c2217] font-serif mb-1">
          No candidates found
        </h3>
        <p className="text-sm text-[#5b5d5e] max-w-sm mx-auto">
          No profiles matched your active search or filter criteria. Try adjusting your filters.
        </p>
      </div>
    );
  }

  const renderSortIndicator = (col: string) => {
    if (sortBy !== col) {
      return (
        <ArrowUpDown className="h-3 w-3 text-[#5b5d5e] opacity-0 group-hover:opacity-100 transition-opacity" />
      );
    }
    return (
      <span className="text-[#ea694e] font-bold text-xs">
        {sortOrder === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-[#5b5d5e]/15 shadow-[0_1px_3px_rgba(55,56,55,0.03),0_4px_12px_rgba(55,56,55,0.02)] overflow-hidden font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-[#373837]">
          <thead className="bg-[#FAF7F5]/90 text-xs uppercase font-semibold text-[#5b5d5e] border-b border-[#5b5d5e]/15">
            <tr>
              <th
                onClick={() => onSortChange('name')}
                className="py-3.5 px-4 cursor-pointer hover:bg-black/[0.03] transition-colors group"
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
                className="py-3.5 px-4 cursor-pointer hover:bg-black/[0.03] transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Exp</span>
                  {renderSortIndicator('experience')}
                </div>
              </th>
              <th
                onClick={() => onSortChange('rating')}
                className="py-3.5 px-4 cursor-pointer hover:bg-black/[0.03] transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Rating</span>
                  {renderSortIndicator('rating')}
                </div>
              </th>
              <th className="py-3.5 px-4">Skills</th>
              <th
                onClick={() => onSortChange('date')}
                className="py-3.5 px-4 cursor-pointer hover:bg-black/[0.03] transition-colors group"
              >
                <div className="flex items-center gap-1.5">
                  <span>Applied</span>
                  {renderSortIndicator('date')}
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#5b5d5e]/10">
            {candidates.map((candidate) => {
              const stageColor = STAGE_COLORS[candidate.stage] || STAGE_COLORS['Applied'];

              return (
                <tr
                  key={candidate._id}
                  className="hover:bg-[#FAF7F5]/70 transition-colors group cursor-default"
                >
                  {/* Candidate Name & Contact */}
                  <td className="py-3.5 px-4">
                    <div>
                      <button
                        onClick={() => onSelectCandidate(candidate)}
                        className="font-bold text-sm text-[#5c2217] hover:text-[#ea694e] transition-colors text-left cursor-pointer font-serif"
                      >
                        {candidate.name}
                      </button>
                      <div className="flex items-center gap-3 text-xs text-[#5b5d5e] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3 text-[#5b5d5e]" />
                          <span className="truncate max-w-[150px]">{candidate.email}</span>
                        </span>
                        {candidate.phone && (
                          <span className="hidden sm:flex items-center gap-1">
                            <Phone className="h-3 w-3 text-[#5b5d5e]" />
                            <span>{candidate.phone}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-4">
                    <span className="font-medium text-[#373837] text-xs bg-[#FAF7F5] px-2.5 py-1 rounded-md border border-[#5b5d5e]/15 inline-block">
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
                        className={`text-xs font-semibold py-1 px-2.5 rounded-full border cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ea694e]/20 ${stageColor.badge}`}
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
                    <span className="font-medium text-[#373837] text-xs">
                      {candidate.experience} yrs
                    </span>
                  </td>

                  {/* Rating */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1">
                      <div className="flex items-center text-[#ea694e]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < candidate.rating
                                ? 'fill-[#ea694e] text-[#ea694e]'
                                : 'text-black/[0.12]'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-[#5c2217] ml-1">
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
                              className="px-2 py-0.5 text-[10px] font-medium bg-[#e9b9a6]/25 text-[#5c2217] rounded-md border border-[#e9b9a6]/50"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.skills.length > 2 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-medium bg-black/[0.04] text-[#5b5d5e] rounded-md border border-[#5b5d5e]/15">
                              +{candidate.skills.length - 2}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-[#5b5d5e]">—</span>
                      )}
                    </div>
                  </td>

                  {/* Applied Date */}
                  <td className="py-3.5 px-4 text-xs text-[#5b5d5e] whitespace-nowrap">
                    {formatDate(candidate.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectCandidate(candidate)}
                        className="p-1.5 rounded-lg text-[#5b5d5e] hover:text-[#ea694e] hover:bg-[#ea694e]/10 transition-colors cursor-pointer"
                        title="View Profile Details"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditCandidate(candidate)}
                        className="p-1.5 rounded-lg text-[#5b5d5e] hover:text-[#5c2217] hover:bg-black/[0.05] transition-colors cursor-pointer"
                        title="Edit Candidate"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteCandidate(candidate)}
                        className="p-1.5 rounded-lg text-[#5b5d5e] hover:text-[#5c2217] hover:bg-[#5c2217]/10 transition-colors cursor-pointer"
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
