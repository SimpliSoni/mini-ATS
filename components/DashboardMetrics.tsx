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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-xl bg-white border border-slate-200/80 p-5 shadow-sm animate-pulse"
          >
            <div className="h-4 w-24 bg-slate-200 rounded mb-3" />
            <div className="h-8 w-16 bg-slate-200 rounded" />
          </div>
        ))}
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
    <div className="space-y-6 mb-8">
      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Candidates */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
              Total Candidates
            </span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {totalCandidates}
            </span>
            <span className="text-xs text-slate-500 font-medium">profiles stored</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Active recruitment pipeline</span>
          </div>
        </div>

        {/* Active Pipelines */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
              Active In Process
            </span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <GitBranch className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {activePipelines}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({totalCandidates > 0 ? Math.round((activePipelines / totalCandidates) * 100) : 0}%)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Applied, Screening & Tech</p>
        </div>

        {/* Offers Extended */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
              Offers Extended
            </span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-emerald-600 tracking-tight">
              {offersExtended}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({totalCandidates > 0 ? Math.round((offersExtended / totalCandidates) * 100) : 0}% success)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Ready for onboarding</p>
        </div>

        {/* Rejection Rate */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500">
              Rejection Rate
            </span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600 group-hover:scale-110 transition-transform">
              <XCircle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {rejectionRate}%
            </span>
            <span className="text-xs text-slate-500 font-medium">
              ({stageCounts['Rejected']} rejected)
            </span>
          </div>
          <p className="mt-2 text-xs text-slate-500">Candidate benchmark ratio</p>
        </div>
      </div>

      {/* Visual Stage Breakdown & Insights Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Visual Stage Distribution */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Stage Pipeline Distribution</h3>
              <p className="text-xs text-slate-500">Click a stage to quickly filter the candidate view</p>
            </div>
            <button
              onClick={() => onSelectStage('all')}
              className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
                selectedStage === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Stages
            </button>
          </div>

          {/* Segmented Progress Bar */}
          <div className="h-3 w-full rounded-full bg-slate-100 flex overflow-hidden mb-4">
            {STAGES.map((st) => {
              const count = stageCounts[st] || 0;
              const percent = totalCandidates > 0 ? (count / totalCandidates) * 100 : 0;
              const colorMap: Record<CandidateStage, string> = {
                Applied: 'bg-blue-500',
                Screening: 'bg-amber-500',
                'Technical Interview': 'bg-purple-500',
                Offered: 'bg-emerald-500',
                Rejected: 'bg-rose-500',
              };

              if (count === 0) return null;
              return (
                <div
                  key={st}
                  style={{ width: `${percent}%` }}
                  title={`${st}: ${count} (${Math.round(percent)}%)`}
                  className={`${colorMap[st]} transition-all duration-500 hover:opacity-85 cursor-pointer`}
                  onClick={() => onSelectStage(st)}
                />
              );
            })}
          </div>

          {/* Interactive stage pill list */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {STAGES.map((st) => {
              const count = stageCounts[st] || 0;
              const percent = totalCandidates > 0 ? Math.round((count / totalCandidates) * 100) : 0;
              const isSelected = selectedStage === st;
              const color = STAGE_COLORS[st];

              return (
                <button
                  key={st}
                  onClick={() => onSelectStage(isSelected ? 'all' : st)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    isSelected
                      ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/40 shadow-sm'
                      : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`h-2 w-2 rounded-full ${color.dot}`} />
                    <span className="text-[11px] font-semibold text-slate-700 truncate">
                      {st}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold text-slate-900">{count}</span>
                    <span className="text-[10px] text-slate-500">{percent}%</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Key Insights & Demographics */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900">Key Talent Insights</h3>
              <div className="p-1 rounded bg-slate-100 text-slate-600">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Average experience */}
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Clock className="h-3.5 w-3.5 text-blue-600" />
                <span>Avg. Experience</span>
              </div>
              <span className="text-xs font-bold text-slate-900">
                {averageExperience} years
              </span>
            </div>

            {/* Top roles */}
            <div className="mt-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Top Open Roles
              </span>
              <div className="space-y-1.5">
                {topRoles && topRoles.length > 0 ? (
                  topRoles.slice(0, 3).map((r) => (
                    <div
                      key={r.role}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-1.5 truncate max-w-[180px]">
                        <Briefcase className="h-3 w-3 text-slate-400 shrink-0" />
                        <span className="font-medium text-slate-700 truncate">{r.role}</span>
                      </div>
                      <span className="font-bold text-slate-900 px-1.5 py-0.5 rounded bg-white text-[10px] shadow-2xs">
                        {r.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No role data available</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Pipeline Health</span>
            <span className="font-semibold text-emerald-600">Optimal Velocity</span>
          </div>
        </div>
      </div>
    </div>
  );
};
