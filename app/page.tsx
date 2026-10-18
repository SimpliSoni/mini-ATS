'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { DashboardMetrics } from '@/components/DashboardMetrics';
import { FilterBar } from '@/components/FilterBar';
import { CandidateTriage } from '@/components/CandidateTriage';
import { CandidateKanban } from '@/components/CandidateKanban';
import { CandidateTable } from '@/components/CandidateTable';
import { CandidateModal } from '@/components/CandidateModal';
import { CandidateFormDialog } from '@/components/CandidateFormDialog';
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog';
import {
  ICandidate,
  CandidateFormData,
  CandidateStage,
  DashboardMetricsData,
} from '@/lib/types';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';

export default function Home() {
  const [candidates, setCandidates] = useState<ICandidate[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters & View State
  const [viewMode, setViewMode] = useState<'triage' | 'kanban' | 'table'>('triage');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'experience' | 'rating' | 'name'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals state
  const [selectedCandidate, setSelectedCandidate] = useState<ICandidate | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingCandidate, setEditingCandidate] = useState<ICandidate | null>(null);

  const [deleteCandidateTarget, setDeleteCandidateTarget] = useState<ICandidate | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Search debounce effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch candidates & metrics from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [candRes, metRes] = await Promise.all([
        fetch('/api/candidates'),
        fetch('/api/metrics'),
      ]);

      const candData = await candRes.json();
      const metData = await metRes.json();

      if (candData.success) {
        setCandidates(candData.data);
      }

      if (metData.success) {
        setMetrics(metData.data);
      }
    } catch (err) {
      console.error('Failed to load ATS data:', err);
      toast.error('Failed to connect to the ATS API server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Unique skills collection across all candidates for filter dropdown
  const availableSkills = useMemo(() => {
    const skillSet = new Set<string>();
    candidates.forEach((c) => {
      if (Array.isArray(c.skills)) {
        c.skills.forEach((s) => skillSet.add(s));
      }
    });
    return Array.from(skillSet).sort();
  }, [candidates]);

  // Client-side filtering & sorting for instantaneous response
  const filteredCandidates = useMemo(() => {
    let result = [...candidates];

    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.role.toLowerCase().includes(q)
      );
    }

    if (selectedStage !== 'all') {
      result = result.filter((c) => c.stage === selectedStage);
    }

    if (selectedSkill !== 'all') {
      result = result.filter(
        (c) =>
          Array.isArray(c.skills) &&
          c.skills.some((s) => s.toLowerCase() === selectedSkill.toLowerCase())
      );
    }

    result.sort((a, b) => {
      let diff = 0;
      if (sortBy === 'experience') {
        diff = a.experience - b.experience;
      } else if (sortBy === 'rating') {
        diff = a.rating - b.rating;
      } else if (sortBy === 'name') {
        diff = a.name.localeCompare(b.name);
      } else {
        diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return sortOrder === 'asc' ? diff : -diff;
    });

    return result;
  }, [candidates, debouncedSearch, selectedStage, selectedSkill, sortBy, sortOrder]);

  // Handle stage transition with optimistic update
  const handleStageChange = async (candidateId: string, newStage: CandidateStage) => {
    const candidate = candidates.find((c) => c._id === candidateId);
    if (!candidate || candidate.stage === newStage) return;

    const previousStage = candidate.stage;

    // Optimistically update UI
    setCandidates((prev) =>
      prev.map((c) => (c._id === candidateId ? { ...c, stage: newStage } : c))
    );

    if (selectedCandidate && selectedCandidate._id === candidateId) {
      setSelectedCandidate((prev) => (prev ? { ...prev, stage: newStage } : null));
    }

    toast.info(`Moving ${candidate.name} to ${newStage}...`);

    try {
      const res = await fetch(`/api/candidates/${candidateId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update stage');
      }

      toast.success(`${candidate.name} is now in ${newStage}`);
      // Refresh metrics in background
      fetch('/api/metrics')
        .then((r) => r.json())
        .then((m) => m.success && setMetrics(m.data));
    } catch (err: unknown) {
      // Revert optimistic update
      setCandidates((prev) =>
        prev.map((c) => (c._id === candidateId ? { ...c, stage: previousStage } : c))
      );
      const msg = err instanceof Error ? err.message : 'Stage update failed';
      toast.error(msg);
    }
  };

  // Handle create or update candidate
  const handleFormSubmit = async (formData: CandidateFormData): Promise<boolean> => {
    try {
      if (formMode === 'create') {
        const res = await fetch('/api/candidates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to create candidate');
        }

        toast.success(`Candidate ${data.data.name} added successfully!`);
        fetchData();
        return true;
      } else if (editingCandidate) {
        const res = await fetch(`/api/candidates/${editingCandidate._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || 'Failed to update candidate');
        }

        toast.success(`Profile for ${data.data.name} updated!`);
        fetchData();
        return true;
      }
      return false;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Action failed';
      toast.error(msg);
      throw err;
    }
  };

  // Handle delete candidate
  const handleConfirmDelete = async () => {
    if (!deleteCandidateTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/candidates/${deleteCandidateTarget._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to delete candidate');
      }

      toast.success(`${deleteCandidateTarget.name} removed from pipeline.`);
      setCandidates((prev) => prev.filter((c) => c._id !== deleteCandidateTarget._id));
      setIsDeleteOpen(false);
      setDeleteCandidateTarget(null);
      // Refresh metrics
      fetch('/api/metrics')
        .then((r) => r.json())
        .then((m) => m.success && setMetrics(m.data));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Delete failed';
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F5] text-[#373837] font-sans">
      {/* Top Navigation */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddCandidate={() => {
          setFormMode('create');
          setEditingCandidate(null);
          setFormDialogOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Title Section */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#5c2217] font-serif">
              Hiring Pipeline
            </h1>
            <p className="text-sm text-[#5b5d5e] mt-1">
              Track candidate stages, review interviewer notes, and coordinate hiring decisions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFormMode('create');
                setEditingCandidate(null);
                setFormDialogOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#ea694e] hover:bg-[#d8583d] active:scale-[0.98] rounded-full shadow-sm shadow-[#ea694e]/20 transition-all sm:hidden cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add Candidate</span>
            </button>
          </div>
        </div>

        {/* Analytics & KPI Dashboard Cards */}
        <DashboardMetrics
          metrics={metrics}
          loading={loading}
          selectedStage={selectedStage}
          onSelectStage={(stage) => setSelectedStage(stage)}
        />

        {/* View Switcher, Search Filters & Sorters */}
        <FilterBar
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          selectedStage={selectedStage}
          onStageFilterChange={setSelectedStage}
          selectedSkill={selectedSkill}
          onSkillFilterChange={setSelectedSkill}
          availableSkills={availableSkills}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortByChange={setSortBy}
          onToggleSortOrder={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          onResetFilters={() => {
            setSelectedStage('all');
            setSelectedSkill('all');
            setSortBy('date');
            setSearchTerm('');
          }}
          filteredCount={filteredCandidates.length}
          totalCount={candidates.length}
        />

        {/* Pipeline Views (Triage, Kanban or Table) */}
        {loading && candidates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-[#5b5d5e]">
            <Loader2 className="h-7 w-7 animate-spin text-[#ea694e] mb-3" />
            <p className="text-sm font-medium">Loading candidate pipeline...</p>
          </div>
        ) : viewMode === 'triage' ? (
          <CandidateTriage
            candidates={filteredCandidates}
            onSelectCandidate={(c) => {
              setSelectedCandidate(c);
              setIsDetailOpen(true);
            }}
            onEditCandidate={(c) => {
              setEditingCandidate(c);
              setFormMode('edit');
              setFormDialogOpen(true);
            }}
            onDeleteCandidate={(c) => {
              setDeleteCandidateTarget(c);
              setIsDeleteOpen(true);
            }}
            onStageChange={handleStageChange}
            selectedStageFilter={selectedStage}
            onStageFilterChange={setSelectedStage}
            onAddCandidate={() => {
              setFormMode('create');
              setEditingCandidate(null);
              setFormDialogOpen(true);
            }}
          />
        ) : viewMode === 'kanban' ? (
          <CandidateKanban
            candidates={filteredCandidates}
            onSelectCandidate={(c) => {
              setSelectedCandidate(c);
              setIsDetailOpen(true);
            }}
            onEditCandidate={(c) => {
              setEditingCandidate(c);
              setFormMode('edit');
              setFormDialogOpen(true);
            }}
            onDeleteCandidate={(c) => {
              setDeleteCandidateTarget(c);
              setIsDeleteOpen(true);
            }}
            onStageChange={handleStageChange}
          />
        ) : (
          <CandidateTable
            candidates={filteredCandidates}
            onSelectCandidate={(c) => {
              setSelectedCandidate(c);
              setIsDetailOpen(true);
            }}
            onEditCandidate={(c) => {
              setEditingCandidate(c);
              setFormMode('edit');
              setFormDialogOpen(true);
            }}
            onDeleteCandidate={(c) => {
              setDeleteCandidateTarget(c);
              setIsDeleteOpen(true);
            }}
            onStageChange={handleStageChange}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSortChange={(col) => {
              if (sortBy === col) {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy(col);
                setSortOrder('asc');
              }
            }}
            onAddCandidate={() => {
              setFormMode('create');
              setEditingCandidate(null);
              setFormDialogOpen(true);
            }}
          />
        )}
      </main>

      {/* Candidate Full Profile Slide-Over Drawer */}
      <CandidateModal
        candidate={selectedCandidate}
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedCandidate(null);
        }}
        onEdit={(c) => {
          setEditingCandidate(c);
          setFormMode('edit');
          setFormDialogOpen(true);
        }}
        onDelete={(c) => {
          setDeleteCandidateTarget(c);
          setIsDeleteOpen(true);
        }}
        onStageChange={handleStageChange}
      />

      {/* Add / Edit Candidate Form Modal */}
      <CandidateFormDialog
        isOpen={formDialogOpen}
        onClose={() => {
          setFormDialogOpen(false);
          setEditingCandidate(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingCandidate}
        mode={formMode}
      />

      {/* Confirmation Dialog for Deleting Candidates */}
      <DeleteConfirmDialog
        isOpen={isDeleteOpen}
        candidate={deleteCandidateTarget}
        onClose={() => {
          setIsDeleteOpen(false);
          setDeleteCandidateTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        loading={isDeleting}
      />
    </div>
  );
}
