'use client';

import React from 'react';
import {
  Users,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Database,
  X,
} from 'lucide-react';

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onAddCandidate: () => void;
  onResetSeed: () => void;
  isSeeding: boolean;
  dataSource: 'mongodb' | 'in-memory' | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchTerm,
  onSearchChange,
  onAddCandidate,
  onResetSeed,
  isSeeding,
  dataSource,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                  TalentFlow
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase bg-blue-50 text-blue-700 border border-blue-200/60 rounded">
                  ATS Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Applicant Tracking System
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              <input
                id="global-search-input"
                type="text"
                placeholder="Search candidates by name, email, or role..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50/80 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all shadow-sm"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded"
                  title="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Buttons & DB Status */}
          <div className="flex items-center gap-2.5">
            {/* DB status pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-200 bg-slate-50 text-slate-600">
              <Database className="h-3.5 w-3.5 text-slate-500" />
              <span>
                {dataSource === 'mongodb' ? 'MongoDB Atlas' : 'In-Memory Store'}
              </span>
              <span
                className={`h-2 w-2 rounded-full ${
                  dataSource === 'mongodb' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse'
                }`}
                title={dataSource === 'mongodb' ? 'Connected to Atlas' : 'Local preview storage'}
              />
            </div>

            {/* Reset / Seed Button */}
            <button
              id="reset-seed-btn"
              onClick={onResetSeed}
              disabled={isSeeding}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-slate-300 active:bg-slate-100 disabled:opacity-60 transition-all shadow-sm"
              title="Reset candidates to initial pre-seeded sample data"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isSeeding ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
              <span className="hidden sm:inline">Reset Seed</span>
            </button>

            {/* Add Candidate Button */}
            <button
              id="add-candidate-btn"
              onClick={onAddCandidate}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm shadow-blue-500/25 transition-all hover:shadow"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Add Candidate</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, role, email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
