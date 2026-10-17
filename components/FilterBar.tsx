'use client';

import React from 'react';
import {
  Kanban,
  Table as TableIcon,
  Filter,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';
import { CandidateStage } from '@/lib/types';
import { STAGES } from '@/lib/utils';

interface FilterBarProps {
  viewMode: 'kanban' | 'table';
  onViewModeChange: (mode: 'kanban' | 'table') => void;
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
    <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-xs mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Left side: View switcher & Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5">
        {/* Kanban / Table Toggle */}
        <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200/80">
          <button
            id="view-kanban-btn"
            onClick={() => onViewModeChange('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              viewMode === 'kanban'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Kanban className="h-3.5 w-3.5" />
            <span>Kanban</span>
          </button>
          <button
            id="view-table-btn"
            onClick={() => onViewModeChange('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              viewMode === 'table'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
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
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
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
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer max-w-[150px] truncate"
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
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 px-2 py-1.5 rounded-md hover:bg-blue-50 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Right side: Sorting Controls and Candidate Count */}
      <div className="flex items-center justify-between md:justify-end gap-3 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
        {/* Count indicator */}
        <span className="text-xs font-medium text-slate-500">
          Showing <strong className="text-slate-800">{filteredCount}</strong> of{' '}
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
            className="text-xs font-medium bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="date">Sort: Applied Date</option>
            <option value="experience">Sort: Experience</option>
            <option value="rating">Sort: Rating</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>

          <button
            onClick={onToggleSortOrder}
            className="p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
