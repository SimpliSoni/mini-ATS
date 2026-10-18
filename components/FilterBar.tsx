'use client';

import React from 'react';
import {
  Kanban,
  Table as TableIcon,
  LayoutList,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { CandidateStage } from '@/lib/types';
import { STAGES } from '@/lib/utils';

interface FilterBarProps {
  viewMode: 'triage' | 'kanban' | 'table';
  onViewModeChange: (mode: 'triage' | 'kanban' | 'table') => void;
  selectedStage: string;
  onStageFilterChange: (stage: string) => void;
  selectedSkill: string;
  onSkillFilterChange: (skill: string) => void;
  availableSkills: string[];
  sortBy: 'date' | 'experience' | 'rating' | 'name';
  sortOrder: 'asc' | 'desc';
  onSortByChange: (sort: 'date' | 'experience' | 'rating' | 'name') => void;
  onToggleSortOrder: () => void;
  onResetFilters: () => void;
  filteredCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  viewMode,
  onViewModeChange,
  selectedStage,
  onStageFilterChange,
  selectedSkill,
  onSkillFilterChange,
  availableSkills,
  sortBy,
  sortOrder,
  onSortByChange,
  onToggleSortOrder,
  onResetFilters,
  filteredCount,
  totalCount,
}) => {
  const hasActiveFilters =
    selectedStage !== 'all' || selectedSkill !== 'all' || sortBy !== 'date';

  return (
    <div className="bg-white rounded-2xl border border-[#5b5d5e]/15 p-3 shadow-[0_1px_3px_rgba(55,56,55,0.03),0_4px_12px_rgba(55,56,55,0.02)] mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3 font-sans">
      {/* Left side: View switcher & Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Segmented Control */}
        <div className="inline-flex p-1 bg-black/[0.04] rounded-xl border border-[#5b5d5e]/15">
          <button
            id="view-triage-btn"
            onClick={() => onViewModeChange('triage')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              viewMode === 'triage'
                ? 'bg-white text-[#5c2217] font-semibold shadow-[0_1px_3px_rgba(55,56,55,0.08)]'
                : 'text-[#5b5d5e] hover:text-[#373837]'
            }`}
          >
            <LayoutList className="h-3.5 w-3.5" />
            <span>Triage</span>
          </button>
          <button
            id="view-kanban-btn"
            onClick={() => onViewModeChange('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-white text-[#5c2217] font-semibold shadow-[0_1px_3px_rgba(55,56,55,0.08)]'
                : 'text-[#5b5d5e] hover:text-[#373837]'
            }`}
          >
            <Kanban className="h-3.5 w-3.5" />
            <span>Kanban</span>
          </button>
          <button
            id="view-table-btn"
            onClick={() => onViewModeChange('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-white text-[#5c2217] font-semibold shadow-[0_1px_3px_rgba(55,56,55,0.08)]'
                : 'text-[#5b5d5e] hover:text-[#373837]'
            }`}
          >
            <TableIcon className="h-3.5 w-3.5" />
            <span>Table</span>
          </button>
        </div>

        {/* Stage Filter */}
        <div className="flex items-center">
          <select
            id="stage-filter-select"
            value={selectedStage}
            onChange={(e) => onStageFilterChange(e.target.value)}
            className="text-xs font-medium bg-[#FAF7F5] hover:bg-black/[0.04] border border-[#5b5d5e]/20 rounded-xl px-3 py-2 text-[#373837] focus:outline-none focus:ring-2 focus:ring-[#ea694e]/20 focus:border-[#ea694e] cursor-pointer transition-colors"
          >
            <option value="all">All Stages</option>
            {STAGES.map((s) => (
              <option key={s} value={s}>
                Stage: {s}
              </option>
            ))}
          </select>
        </div>

        {/* Skill Filter */}
        <div className="flex items-center">
          <select
            id="skill-filter-select"
            value={selectedSkill}
            onChange={(e) => onSkillFilterChange(e.target.value)}
            className="text-xs font-medium bg-[#FAF7F5] hover:bg-black/[0.04] border border-[#5b5d5e]/20 rounded-xl px-3 py-2 text-[#373837] focus:outline-none focus:ring-2 focus:ring-[#ea694e]/20 focus:border-[#ea694e] cursor-pointer max-w-[160px] truncate transition-colors"
          >
            <option value="all">All Skills</option>
            {availableSkills.map((sk) => (
              <option key={sk} value={sk}>
                Skill: {sk}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs font-medium text-[#ea694e] hover:text-[#d8583d] px-2.5 py-1.5 rounded-lg hover:bg-[#ea694e]/10 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Right side: Sorting Controls and Candidate Count */}
      <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-[#5b5d5e]/15">
        {/* Count indicator */}
        <span className="text-xs font-normal text-[#5b5d5e]">
          Showing <strong className="font-semibold text-[#5c2217]">{filteredCount}</strong> of{' '}
          {totalCount} candidates
        </span>

        {/* Sort selector */}
        <div className="flex items-center gap-1.5">
          <select
            id="sort-by-select"
            value={sortBy}
            onChange={(e) =>
              onSortByChange(e.target.value as 'date' | 'experience' | 'rating' | 'name')
            }
            className="text-xs font-medium bg-[#FAF7F5] hover:bg-black/[0.04] border border-[#5b5d5e]/20 rounded-xl px-3 py-2 text-[#373837] focus:outline-none focus:ring-2 focus:ring-[#ea694e]/20 focus:border-[#ea694e] cursor-pointer transition-colors"
          >
            <option value="date">Sort: Applied Date</option>
            <option value="experience">Sort: Experience</option>
            <option value="rating">Sort: Rating</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>

          <button
            onClick={onToggleSortOrder}
            className="p-2 rounded-xl bg-[#FAF7F5] hover:bg-black/[0.04] border border-[#5b5d5e]/20 text-[#5b5d5e] hover:text-[#5c2217] transition-colors cursor-pointer"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
