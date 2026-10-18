'use client';

import React from 'react';
import {
  Users,
  GitBranch,
  Award,
  XCircle,
  TrendingUp,
  Briefcase,
  Clock,
  Sparkles,
} from 'lucide-react';
import { DashboardMetricsData, CandidateStage } from '@/lib/types';
import { STAGE_COLORS, STAGES } from '@/lib/utils';

interface DashboardMetricsProps {
  metrics: DashboardMetricsData | null;
  loading: boolean;
  selectedStage: string;
  onSelectStage: (stage: string) => void;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({
  metrics,
  loading,
  selectedStage,
  onSelectStage,
}) => {
  if (loading || !metrics) {
    return (
      <div className="space-y-4 mb-6 font-sans">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-white border border-[#5b5d5e]/15 p-5 shadow-xs animate-pulse"
            >
              <div className="h-4 w-24 bg-[#5b5d5e]/10 rounded mb-3" />
              <div className="h-8 w-16 bg-[#5b5d5e]/10 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const {
    totalCandidates,
    activePipelines,
    offersExtended,
    rejectionRate,
    averageExperience,
    stageCounts,
    topRoles,
  } = metrics;

  return (
    <div className="space-y-4 mb-6 font-sans">
      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Candidates */}
        <div className="bg-white rounded-2xl border border-[#5b5d5e]/15 p-5 shadow-[0_1px_3px_rgba(55,56,55,0.03),0_4px_12px_rgba(55,56,55,0.02)] hover:shadow-[0_4px_16px_rgba(92,34,23,0.06)] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#5b5d5e]">
              Total Candidates
            </span>
            <div className="p-2 rounded-xl bg-[#ea694e]/10 text-[#ea694e]">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#5c2217] font-serif tracking-tight">
              {totalCandidates}
            </span>
            <span className="text-xs text-[#5b5d5e] font-normal">in talent pool</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-[#5c2217] font-medium">
            <TrendingUp className="h-3.5 w-3.5 text-[#ea694e]" />
            <span>Active hiring pipeline</span>
          </div>
        </div>

        {/* Active In Process */}
        <div className="bg-white rounded-2xl border border-[#5b5d5e]/15 p-5 shadow-[0_1px_3px_rgba(55,56,55,0.03),0_4px_12px_rgba(55,56,55,0.02)] hover:shadow-[0_4px_16px_rgba(92,34,23,0.06)] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#5b5d5e]">
              Active in Process
            </span>
            <div className="p-2 rounded-xl bg-[#e9b9a6]/40 text-[#5c2217]">
              <GitBranch className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#373837] font-serif tracking-tight">
              {activePipelines}
            </span>
            <span className="text-xs text-[#5b5d5e] font-normal">
              ({totalCandidates > 0 ? Math.round((activePipelines / totalCandidates) * 100) : 0}%)
            </span>
          </div>
          <p className="mt-2 text-xs text-[#5b5d5e]">Applied, Screening & Interview</p>
        </div>

        {/* Offers Extended */}
        <div className="bg-white rounded-2xl border border-[#5b5d5e]/15 p-5 shadow-[0_1px_3px_rgba(55,56,55,0.03),0_4px_12px_rgba(55,56,55,0.02)] hover:shadow-[0_4px_16px_rgba(92,34,23,0.06)] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#5b5d5e]">
              Offers Extended
            </span>
            <div className="p-2 rounded-xl bg-[#ea694e]/15 text-[#ea694e]">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#ea694e] font-serif tracking-tight">
              {offersExtended}
            </span>
            <span className="text-xs text-[#5b5d5e] font-normal">
              ({totalCandidates > 0 ? Math.round((offersExtended / totalCandidates) * 100) : 0}% rate)
            </span>
          </div>
          <p className="mt-2 text-xs text-[#5b5d5e]">Ready for onboarding</p>
        </div>

        {/* Rejection Rate */}
        <div className="bg-white rounded-2xl border border-[#5b5d5e]/15 p-5 shadow-[0_1px_3px_rgba(55,56,55,0.03),0_4px_12px_rgba(55,56,55,0.02)] hover:shadow-[0_4px_16px_rgba(92,34,23,0.06)] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-[#5b5d5e]">
              Rejection Rate
            </span>
            <div className="p-2 rounded-xl bg-[#5b5d5e]/10 text-[#5b5d5e]">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-[#5b5d5e] font-serif tracking-tight">
              {rejectionRate}%
            </span>
            <span className="text-xs text-[#5b5d5e] font-normal">
              ({stageCounts['Rejected'] || 0} candidates)
            </span>
          </div>
          <p className="mt-2 text-xs text-[#5b5d5e]">Decision benchmark</p>
        </div>
      </div>

      {/* Visual Stage Breakdown & Insights Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visual Stage Distribution */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#5b5d5e]/15 p-5 shadow-[0_1px_3px_rgba(55,56,55,0.03),0_4px_12px_rgba(55,56,55,0.02)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold font-serif text-[#5c2217]">Pipeline Distribution</h3>
              <p className="text-xs text-[#5b5d5e]">Click a stage to filter pipeline view</p>
            </div>
            <button
              onClick={() => onSelectStage('all')}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                selectedStage === 'all'
                  ? 'bg-[#ea694e] text-white shadow-xs'
                  : 'bg-black/[0.04] text-[#373837] hover:bg-black/[0.08]'
              }`}
            >
              All Stages
            </button>
          </div>

          {/* Segmented Progress Bar */}
          <div className="h-3.5 w-full rounded-full bg-[#5b5d5e]/10 p-0.5 flex overflow-hidden mb-4 shadow-inner">
            {STAGES.map((st) => {
              const count = stageCounts[st] || 0;
              const percent = totalCandidates > 0 ? (count / totalCandidates) * 100 : 0;
              const color = STAGE_COLORS[st];

              if (count === 0) return null;
              return (
                <div
                  key={st}
                  style={{
                    width: `${percent}%`,
                    backgroundColor: color.accent,
                  }}
                  title={`${st}: ${count} (${Math.round(percent)}%)`}
                  className="h-full transition-all duration-300 hover:opacity-85 cursor-pointer first:rounded-l-full last:rounded-r-full"
                  onClick={() => onSelectStage(st)}
                />
              );
            })}
          </div>

          {/* Interactive stage pill list */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {STAGES.map((st) => {
              const count = stageCounts[st] || 0;
              const percent = totalCandidates > 0 ? Math.round((count / totalCandidates) * 100) : 0;
              const isSelected = selectedStage === st;
              const color = STAGE_COLORS[st];

              return (
                <button
                  key={st}
                  onClick={() => onSelectStage(isSelected ? 'all' : st)}
                  className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                    isSelected
                      ? 'shadow-xs'
                      : 'border-[#5b5d5e]/15 bg-white hover:border-[#5b5d5e]/30 hover:bg-[#FAF7F5]'
                  }`}
                  style={{
                    backgroundColor: isSelected ? `${color.accent}14` : undefined,
                    borderColor: isSelected ? color.accent : undefined,
                    boxShadow: isSelected ? `0 0 0 2px ${color.accent}30` : undefined,
                  }}
                >
                  {/* Top Color Accent Strip */}
                  <div
                    className="h-1 w-full absolute top-0 left-0 transition-opacity"
                    style={{
                      backgroundColor: color.accent,
                      opacity: isSelected ? 1 : 0.75,
                    }}
                  />

                  <div className="flex items-center gap-1.5 mb-1.5 mt-0.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: color.accent }}
                    />
                    <span className="text-[11px] font-bold text-[#373837] truncate font-sans">
                      {st}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-xl font-bold font-serif text-[#5c2217]">{count}</span>
                    <span
                      className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
                      style={{
                        backgroundColor: `${color.accent}20`,
                        color: color.accent,
                      }}
                    >
                      {percent}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Key Insights & Demographics */}
        <div className="bg-white rounded-2xl border border-[#5b5d5e]/15 p-5 shadow-[0_1px_3px_rgba(55,56,55,0.03),0_4px_12px_rgba(55,56,55,0.02)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold font-serif text-[#5c2217]">Talent Insights</h3>
              <div className="p-1.5 rounded-lg bg-[#ea694e]/10 text-[#ea694e]">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Average experience */}
            <div className="flex items-center justify-between py-2 border-b border-black/[0.05]">
              <div className="flex items-center gap-2 text-xs text-[#5b5d5e]">
                <Clock className="h-3.5 w-3.5 text-[#ea694e]" />
                <span>Avg. Experience</span>
              </div>
              <span className="text-xs font-semibold text-[#373837]">
                {averageExperience} years
              </span>
            </div>

            {/* Top roles */}
            <div className="mt-3">
              <span className="text-xs font-semibold text-[#5b5d5e] uppercase tracking-wider block mb-2">
                Top Open Roles
              </span>
              <div className="space-y-1.5">
                {topRoles && topRoles.length > 0 ? (
                  topRoles.slice(0, 3).map((r) => (
                    <div
                      key={r.role}
                      className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-xl bg-[#FAF7F5] border border-[#5b5d5e]/10"
                    >
                      <div className="flex items-center gap-1.5 truncate max-w-[170px]">
                        <Briefcase className="h-3 w-3 text-[#5b5d5e] shrink-0" />
                        <span className="font-medium text-[#373837] truncate">{r.role}</span>
                      </div>
                      <span className="font-semibold text-[#5c2217] px-2 py-0.5 rounded-full bg-white text-[10px] shadow-2xs border border-[#5b5d5e]/15">
                        {r.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-[#5b5d5e]">No role data available</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-black/[0.05] flex items-center justify-between text-[11px] text-[#5b5d5e]">
            <span>Pipeline Health</span>
            <span className="font-semibold text-[#5c2217]">Active & Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
