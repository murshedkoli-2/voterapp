'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { LoginPage } from '../components/auth/LoginPage';
import { Sidebar, AdminTab } from '../components/admin/Sidebar';
import { AdminHeader } from '../components/admin/AdminHeader';
import { VoterDirectoryHeader } from '../components/admin/VoterDirectoryHeader';
import { VoterDetailDrawer } from '../components/admin/VoterDetailDrawer';
import { OverviewView } from '../components/admin/OverviewView';
import { AreaAnalyticsView } from '../components/admin/AreaAnalyticsView';
import { BackupView } from '../components/admin/BackupView';
import { SearchAndFilterBar } from '../components/SearchAndFilterBar';
import { VoterTable } from '../components/VoterTable';
import { VoterCardGrid } from '../components/VoterCardGrid';
import { VoterModal } from '../components/VoterModal';
import { VoterIdCardModal } from '../components/VoterIdCardModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { ExportImportModal } from '../components/ExportImportModal';
import { JsonDataImporterModal, ImportMode } from '../components/importer/JsonDataImporterModal';
import { INITIAL_VOTERS } from '../data/initialVoters';
import { VoterRecord, VoterFilterState, SortField, SortOrder } from '../types/voter';
import { filterVoters, sortVoters } from '../utils/search';

const STORAGE_KEY = 'ec_voter_registry_v1';

function AdminDashboardContent() {
  const { isAuthenticated, isInitialized } = useAuth();

  const [voters, setVoters] = useState<VoterRecord[]>(INITIAL_VOTERS);
  const [currentTab, setCurrentTab] = useState<AdminTab>('voters');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<VoterFilterState>({
    searchQuery: '',
    gender: 'all',
    status: 'all',
    district: 'all',
    upazila: 'all',
    union: 'all',
    ward_number: 'all',
  });

  // Sorting and View State
  const [sortField, setSortField] = useState<SortField>('serial_no');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  // Modal & Drawer Dialogs
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingVoter, setEditingVoter] = useState<VoterRecord | null>(null);
  const [viewingCardVoter, setViewingCardVoter] = useState<VoterRecord | null>(null);
  const [viewingDetailVoter, setViewingDetailVoter] = useState<VoterRecord | null>(null);
  const [deletingVoter, setDeletingVoter] = useState<VoterRecord | null>(null);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [isJsonImporterOpen, setIsJsonImporterOpen] = useState(false);

  // Fetch from Neon PostgreSQL on mount
  const fetchVotersFromDb = async () => {
    try {
      const res = await fetch('/api/voters');
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setVoters(json.data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
        return;
      }
    } catch (err) {
      console.error('Failed to fetch from Neon DB, using localStorage', err);
    }
    // Fallback to localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVoters(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to load voters from localStorage', e);
    }
  };

  useEffect(() => {
    fetchVotersFromDb();
  }, []);

  // Sync to localStorage
  const persistVoters = (newVoters: VoterRecord[]) => {
    setVoters(newVoters);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newVoters));
    } catch (e) {
      console.error('Failed to save voters to localStorage', e);
    }
  };

  // Filter & Sort Calculation
  const filteredAndSortedVoters = useMemo(() => {
    const filtered = filterVoters(voters, filters);
    return sortVoters(filtered, sortField, sortOrder);
  }, [voters, filters, sortField, sortOrder]);

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery.trim()) count++;
    if (filters.gender !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.district !== 'all') count++;
    if (filters.upazila !== 'all') count++;
    if (filters.union !== 'all') count++;
    if (filters.ward_number !== 'all') count++;
    return count;
  }, [filters]);

  const handleFilterChange = (updated: Partial<VoterFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      gender: 'all',
      status: 'all',
      district: 'all',
      upazila: 'all',
      union: 'all',
      ward_number: 'all',
    });
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // CRUD Operations with Neon PostgreSQL
  const handleOpenAdd = () => {
    setEditingVoter(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (voter: VoterRecord) => {
    setEditingVoter(voter);
    setIsFormModalOpen(true);
  };

  const handleSaveVoter = async (savedVoter: VoterRecord) => {
    if (editingVoter) {
      const updated = voters.map((v) =>
        v.voter_id === editingVoter.voter_id ? savedVoter : v
      );
      setVoters(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        await fetch(`/api/voters/${editingVoter.voter_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedVoter),
        });
      } catch (err) {
        console.error('Failed to update voter in Neon DB', err);
      }
    } else {
      const updated = [savedVoter, ...voters];
      setVoters(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        await fetch('/api/voters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(savedVoter),
        });
      } catch (err) {
        console.error('Failed to create voter in Neon DB', err);
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingVoter) return;
    const toDeleteId = deletingVoter.voter_id;
    const updated = voters.filter((v) => v.voter_id !== toDeleteId);
    setVoters(updated);
    if (viewingDetailVoter && viewingDetailVoter.voter_id === toDeleteId) {
      setViewingDetailVoter(null);
    }
    setDeletingVoter(null);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      await fetch(`/api/voters/${toDeleteId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete from Neon DB', err);
    }
  };

  const handleToggleStatus = async (voter: VoterRecord) => {
    const nextStatusMap: Record<string, VoterRecord['status']> = {
      active: 'inactive',
      inactive: 'active',
      deceased: 'active',
      transferred: 'active',
    };
    const nextStatus = nextStatusMap[voter.status] || 'active';
    const updatedVoter = { ...voter, status: nextStatus };
    const updated = voters.map((v) =>
      v.voter_id === voter.voter_id ? updatedVoter : v
    );
    setVoters(updated);
    if (viewingDetailVoter && viewingDetailVoter.voter_id === voter.voter_id) {
      setViewingDetailVoter(updatedVoter);
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      await fetch(`/api/voters/${voter.voter_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedVoter),
      });
    } catch (err) {
      console.error('Failed to toggle status in Neon DB', err);
    }
  };

  const handleSelectArea = (district: string, upazila: string) => {
    setFilters((prev) => ({
      ...prev,
      district,
      upazila,
    }));
    setCurrentTab('voters');
  };

  const handleCommitJsonImport = async (importedRecords: VoterRecord[], mode: ImportMode) => {
    try {
      const res = await fetch('/api/voters/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: importedRecords, mode }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchVotersFromDb();
        return;
      }
    } catch (err) {
      console.error('Failed to batch import to Neon DB, falling back to local', err);
    }

    // Local fallback
    if (mode === 'replace') {
      persistVoters(importedRecords);
    } else if (mode === 'merge') {
      const existingIds = new Set(voters.map((v) => v.voter_id));
      const onlyNew = importedRecords.filter((r) => !existingIds.has(r.voter_id));
      persistVoters([...onlyNew, ...voters]);
    } else if (mode === 'update') {
      const importedMap = new Map(importedRecords.map((r) => [r.voter_id, r]));
      const updatedExisting = voters.map((v) =>
        importedMap.has(v.voter_id) ? importedMap.get(v.voter_id)! : v
      );
      const existingIds = new Set(voters.map((v) => v.voter_id));
      const brandNew = importedRecords.filter((r) => !existingIds.has(r.voter_id));
      persistVoters([...brandNew, ...updatedExisting]);
    }
  };

  const handleResetToDefault = async () => {
    try {
      const res = await fetch('/api/voters/reset', { method: 'POST' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setVoters(json.data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(json.data));
        return;
      }
    } catch (err) {
      console.error('Failed to reset Neon DB', err);
    }
    persistVoters(INITIAL_VOTERS);
  };

  // Next available serial number suggestion
  const nextSerial = useMemo(() => {
    const maxSerial = voters.reduce((max, v) => {
      const num = parseInt(v.serial_no, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    return String(maxSerial + 1).padStart(4, '0');
  }, [voters]);

  if (!isInitialized) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
      }}>
        Loading system...
      </div>
    );
  }

  // If unauthenticated, show official Admin Login Portal
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="admin-layout">
      {/* Responsive Clean Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        totalVoters={voters.length}
      />

      {/* Main Admin Content Wrapper */}
      <div className="admin-main-wrapper">
        {/* Admin Header */}
        <AdminHeader
          currentTab={currentTab}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onOpenAddModal={handleOpenAdd}
          onOpenJsonImporter={() => setIsJsonImporterOpen(true)}
          totalVoters={voters.length}
        />

        {/* Content Body based on Active Tab */}
        <main className="container admin-content-body">
          {/* TAB 1: OVERVIEW */}
          {currentTab === 'overview' && (
            <OverviewView
              voters={voters}
              onGoToVoters={() => setCurrentTab('voters')}
              onViewCard={(v) => setViewingCardVoter(v)}
            />
          )}

          {/* TAB 2: VOTERS DIRECTORY & UNIVERSAL SEARCH */}
          {currentTab === 'voters' && (
            <div>
              {/* Page Title & 4 Compact Stats */}
              <VoterDirectoryHeader voters={voters} />

              {/* Universal Search, Filter Drawer & Status Tabs Toolbar */}
              <SearchAndFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                voters={voters}
                activeFilterCount={activeFilterCount}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                filteredCount={filteredAndSortedVoters.length}
              />

              {/* Data Table or Card Grid */}
              {viewMode === 'table' ? (
                <VoterTable
                  voters={filteredAndSortedVoters}
                  sortField={sortField}
                  sortOrder={sortOrder}
                  onSort={handleSort}
                  onViewCard={(voter) => setViewingCardVoter(voter)}
                  onViewDetails={(voter) => setViewingDetailVoter(voter)}
                  onEdit={handleOpenEdit}
                  onDelete={(voter) => setDeletingVoter(voter)}
                  onToggleStatus={handleToggleStatus}
                  onResetFilters={handleResetFilters}
                />
              ) : (
                <VoterCardGrid
                  voters={filteredAndSortedVoters}
                  onViewCard={(voter) => setViewingCardVoter(voter)}
                  onViewDetails={(voter) => setViewingDetailVoter(voter)}
                  onEdit={handleOpenEdit}
                  onDelete={(voter) => setDeletingVoter(voter)}
                  onToggleStatus={handleToggleStatus}
                />
              )}
            </div>
          )}

          {/* TAB 3: AREA ANALYTICS */}
          {currentTab === 'analytics' && (
            <AreaAnalyticsView
              voters={voters}
              onSelectArea={handleSelectArea}
            />
          )}

          {/* TAB 4: BACKUP & AUDIT */}
          {currentTab === 'backup' && (
            <BackupView
              voters={voters}
              onImport={persistVoters}
              onResetToDefault={handleResetToDefault}
              onOpenImporter={() => setIsJsonImporterOpen(true)}
            />
          )}
        </main>

        {/* Clean Light Footer */}
        <footer style={{
          borderTop: '1px solid var(--border-subtle)',
          padding: '1.25rem 0',
          textAlign: 'center',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
          background: 'var(--bg-surface)',
        }}>
          <div className="container">
            <p>© {new Date().getFullYear()} Voter Information & Services Center • Administrative Dashboard</p>
            <p style={{ marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Bangladesh Election Commission • Digital Voter Registry & Real-Time Smart Search System
            </p>
          </div>
        </footer>
      </div>

      {/* Slide-Over Voter Detail Drawer */}
      <VoterDetailDrawer
        isOpen={!!viewingDetailVoter}
        onClose={() => setViewingDetailVoter(null)}
        voter={viewingDetailVoter}
        onViewCard={(v) => {
          setViewingCardVoter(v);
        }}
        onEdit={(v) => {
          handleOpenEdit(v);
        }}
        onDelete={(v) => {
          setDeletingVoter(v);
        }}
        onToggleStatus={handleToggleStatus}
      />

      {/* Modals */}
      <VoterModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveVoter}
        initialData={editingVoter}
        nextSerial={nextSerial}
      />

      <VoterIdCardModal
        isOpen={!!viewingCardVoter}
        onClose={() => setViewingCardVoter(null)}
        voter={viewingCardVoter}
      />

      <DeleteConfirmModal
        isOpen={!!deletingVoter}
        onClose={() => setDeletingVoter(null)}
        onConfirm={handleDeleteConfirm}
        voter={deletingVoter}
      />

      <ExportImportModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        voters={voters}
        onImport={persistVoters}
        onResetToDefault={handleResetToDefault}
      />

      <JsonDataImporterModal
        isOpen={isJsonImporterOpen}
        onClose={() => setIsJsonImporterOpen(false)}
        existingVoters={voters}
        onCommitImport={handleCommitJsonImport}
      />
    </div>
  );
}

export default function VoterDashboardPage() {
  return (
    <AuthProvider>
      <AdminDashboardContent />
    </AuthProvider>
  );
}
