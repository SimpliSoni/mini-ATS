'use client';

import React from 'react';
import {
  Users,
  Plus,
  Search,
  X,
} from 'lucide-react';

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onAddCandidate: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchTerm,
  onSearchChange,
  onAddCandidate,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-[#5b5d5e]/15 apple-glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#5c2217] via-[#ea694e] to-[#e9b9a6] flex items-center justify-center text-white shadow-sm shadow-[#ea694e]/25">
              <Users className="h-4.5 w-4.5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-[#5c2217] font-serif">
                  TalentFlow
                </span>
              </div>
              <p className="text-[11px] text-[#5b5d5e] hidden sm:block font-normal font-sans">
                Applicant Tracking System
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5b5d5e] pointer-events-none" />
              <input
                id="global-search-input"
                type="text"
                placeholder="Search candidates by name, email, or role..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2 text-sm bg-black/[0.03] border border-[#5b5d5e]/20 rounded-xl text-[#373837] placeholder-[#5b5d5e] focus:outline-none focus:ring-2 focus:ring-[#ea694e]/25 focus:border-[#ea694e] focus:bg-white transition-all shadow-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#5b5d5e] hover:text-[#373837] rounded-md transition-colors"
                  title="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action: Add Candidate Button */}
          <div className="flex items-center gap-2.5">
            <button
              id="add-candidate-btn"
              onClick={onAddCandidate}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-[#ea694e] hover:bg-[#d8583d] active:scale-[0.98] rounded-full shadow-sm shadow-[#ea694e]/25 transition-all cursor-pointer font-sans"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Add Candidate</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5b5d5e]" />
            <input
              type="text"
              placeholder="Search by name, role, email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-black/[0.03] border border-[#5b5d5e]/20 rounded-xl text-[#373837] placeholder-[#5b5d5e] focus:outline-none focus:ring-2 focus:ring-[#ea694e]/25 focus:border-[#ea694e] focus:bg-white transition-all font-sans"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#5b5d5e] hover:text-[#373837]"
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
