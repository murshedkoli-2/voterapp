'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid,
} from 'lucide-react';
import { VoterRecord, VoterFilterState } from '../types/voter';

interface SearchAndFilterBarProps {
  filters: VoterFilterState;
  onFilterChange: (updated: Partial<VoterFilterState>) => void;
  onResetFilters: () => void;
  voters: VoterRecord[];
  activeFilterCount: number;
  viewMode: 'table' | 'grid';
  onViewModeChange: (mode: 'table' | 'grid') => void;
  filteredCount: number;
}

export const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  voters,
  activeFilterCount,
  viewMode,
  onViewModeChange,
  filteredCount,
}) => {
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut (Cmd+K or /) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Status counts
  const totalCount = voters.length;
  const activeCount = voters.filter((v) => v.status === 'active').length;
  const inactiveCount = voters.filter((v) => v.status === 'inactive').length;
  const deceasedCount = voters.filter((v) => v.status === 'deceased').length;

  // Filter options derived from voters
  const districts = Array.from(new Set(voters.map((v) => v.district).filter(Boolean))).sort();
  const upazilas = Array.from(
    new Set(
      voters
        .filter((v) => !filters.district || filters.district === 'all' || v.district === filters.district)
        .map((v) => v.upazila)
        .filter(Boolean)
    )
  ).sort();

  const unions = Array.from(
    new Set(
      voters
        .filter(
          (v) =>
            (!filters.district || filters.district === 'all' || v.district === filters.district) &&
            (!filters.upazila || filters.upazila === 'all' || v.upazila === filters.upazila)
        )
        .map((v) => v.union)
        .filter(Boolean)
    )
  ).sort();

  const wards = Array.from(
    new Set(
      voters
        .filter(
          (v) =>
            (!filters.district || filters.district === 'all' || v.district === filters.district) &&
            (!filters.upazila || filters.upazila === 'all' || v.upazila === filters.upazila)
        )
        .map((v) => v.ward_number)
        .filter(Boolean)
    )
  ).sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  // Determine active filter chips for display
  const activeChips: { key: keyof VoterFilterState; label: string; value: string }[] = [];
  if (filters.gender !== 'all') {
    activeChips.push({ key: 'gender', label: 'Gender', value: filters.gender });
  }
  if (filters.status !== 'all') {
    activeChips.push({ key: 'status', label: 'Status', value: filters.status });
  }
  if (filters.district !== 'all') {
    activeChips.push({ key: 'district', label: 'District', value: filters.district });
  }
  if (filters.upazila !== 'all') {
    activeChips.push({ key: 'upazila', label: 'Upazila', value: filters.upazila });
  }
  if (filters.union !== 'all') {
    activeChips.push({ key: 'union', label: 'Union', value: filters.union });
  }
  if (filters.ward_number !== 'all') {
    activeChips.push({ key: 'ward_number', label: 'Ward', value: filters.ward_number });
  }

  const statusTabs = [
    { id: 'all', label: 'All', count: totalCount },
    { id: 'active', label: 'Active', count: activeCount },
    { id: 'inactive', label: 'Inactive', count: inactiveCount },
    { id: 'deceased', label: 'Deceased', count: deceasedCount },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
      {/* 1. Main Search & Filters Toolbar */}
      <div
        className="card"
        style={{
          padding: '0.65rem 0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
        }}
      >
        {/* Search Input Container */}
        <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: '0.85rem',
              color: 'var(--text-muted)',
              pointerEvents: 'none',
            }}
          />
          <input
            ref={searchInputRef}
            type="text"
            className="form-input"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            placeholder="Search name, NID, parent, occupation, address..."
            style={{
              paddingLeft: '2.4rem',
              paddingRight: filters.searchQuery ? '4.5rem' : '3.5rem',
              height: '38px',
              fontSize: '0.875rem',
              borderRadius: '6px',
            }}
          />

          {/* Right action inside input: Clear button & Keyboard shortcut hint */}
          <div
            style={{
              position: 'absolute',
              right: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            {filters.searchQuery && (
              <button
                type="button"
                onClick={() => onFilterChange({ searchQuery: '' })}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  display: 'flex',
                }}
                title="Clear Search"
              >
                <X size={14} />
              </button>
            )}
            <kbd
              className="font-mono"
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                background: 'var(--bg-subtle)',
                padding: '0.15rem 0.35rem',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
                userSelect: 'none',
              }}
            >
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Filters Button */}
        <button
          type="button"
          onClick={() => setShowFiltersPanel(!showFiltersPanel)}
          className={`btn ${showFiltersPanel || activeChips.length > 0 ? 'btn-primary' : 'btn-secondary'}`}
          style={{
            height: '38px',
            padding: '0 0.85rem',
            gap: '0.45rem',
            borderRadius: '6px',
          }}
        >
          <SlidersHorizontal size={14} />
          <span>Filters</span>
          {activeChips.length > 0 && (
            <span
              className="font-mono"
              style={{
                background: showFiltersPanel ? 'rgba(255,255,255,0.25)' : 'var(--primary-green)',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '0.1rem 0.4rem',
                borderRadius: '999px',
                lineHeight: 1,
              }}
            >
              {activeChips.length}
            </span>
          )}
        </button>
      </div>

      {/* 2. Collapsible Filter Drawer / Panel */}
      {showFiltersPanel && (
        <div
          className="card"
          style={{
            padding: '1.15rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '0.85rem',
            }}
          >
            {/* Gender */}
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={filters.gender}
                onChange={(e) => onFilterChange({ gender: e.target.value })}
                style={{ height: '36px', fontSize: '0.85rem' }}
              >
                <option value="all">All Genders</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Status */}
            <div className="form-group">
              <label className="form-label">Voter Status</label>
              <select
                className="form-select"
                value={filters.status}
                onChange={(e) => onFilterChange({ status: e.target.value })}
                style={{ height: '36px', fontSize: '0.85rem' }}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="deceased">Deceased</option>
                <option value="transferred">Transferred</option>
              </select>
            </div>

            {/* District */}
            <div className="form-group">
              <label className="form-label">District</label>
              <select
                className="form-select"
                value={filters.district}
                onChange={(e) =>
                  onFilterChange({
                    district: e.target.value,
                    upazila: 'all',
                    union: 'all',
                    ward_number: 'all',
                  })
                }
                style={{ height: '36px', fontSize: '0.85rem' }}
              >
                <option value="all">All Districts</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Upazila */}
            <div className="form-group">
              <label className="form-label">Upazila / Thana</label>
              <select
                className="form-select"
                value={filters.upazila}
                onChange={(e) =>
                  onFilterChange({ upazila: e.target.value, union: 'all', ward_number: 'all' })
                }
                style={{ height: '36px', fontSize: '0.85rem' }}
              >
                <option value="all">All Upazilas</option>
                {upazilas.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {/* Union */}
            <div className="form-group">
              <label className="form-label">Union / Municipality</label>
              <select
                className="form-select"
                value={filters.union}
                onChange={(e) => onFilterChange({ union: e.target.value })}
                style={{ height: '36px', fontSize: '0.85rem' }}
              >
                <option value="all">All Unions</option>
                {unions.map((un) => (
                  <option key={un} value={un}>
                    {un}
                  </option>
                ))}
              </select>
            </div>

            {/* Ward */}
            <div className="form-group">
              <label className="form-label">Ward No.</label>
              <select
                className="form-select"
                value={filters.ward_number}
                onChange={(e) => onFilterChange({ ward_number: e.target.value })}
                style={{ height: '36px', fontSize: '0.85rem' }}
              >
                <option value="all">All Wards</option>
                {wards.map((w) => (
                  <option key={w} value={w}>
                    Ward {w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Panel Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.65rem',
              marginTop: '1rem',
              paddingTop: '0.85rem',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onResetFilters}
              style={{ height: '34px', fontSize: '0.8rem' }}
            >
              Reset Filters
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setShowFiltersPanel(false)}
              style={{ height: '34px', fontSize: '0.8rem' }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* 3. Active Filters Chips (only when filters are active) */}
      {activeChips.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active filters:</span>
          {activeChips.map((chip) => (
            <span
              key={chip.key}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.55rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                color: 'var(--text-primary)',
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>{chip.label}:</span>
              <strong>{chip.value}</strong>
              <button
                type="button"
                onClick={() => onFilterChange({ [chip.key]: 'all' })}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                }}
                title={`Remove ${chip.label} filter`}
              >
                <X size={12} />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={onResetFilters}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--danger)',
              fontSize: '0.75rem',
              cursor: 'pointer',
              marginLeft: '0.25rem',
              fontWeight: 500,
            }}
          >
            Clear all
          </button>
        </div>
      )}

      {/* 4. Segmented Status Tabs & Results/View Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '0.45rem',
        }}
      >
        {/* Status Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {statusTabs.map((tab) => {
            const isActive = filters.status === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange({ status: tab.id })}
                style={{
                  background: isActive ? 'var(--primary-green-light)' : 'transparent',
                  border: 'none',
                  color: isActive ? 'var(--primary-green-dark)' : 'var(--text-secondary)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.825rem',
                  fontWeight: isActive ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                }}
              >
                <span>{tab.label}</span>
                <span
                  className="font-mono"
                  style={{
                    fontSize: '0.72rem',
                    color: isActive ? 'var(--primary-green-dark)' : 'var(--text-muted)',
                  }}
                >
                  {tab.count.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right side: Results readout & Table/Grid Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {activeFilterCount > 0 || filters.searchQuery ? (
              <>
                <strong style={{ color: 'var(--text-primary)' }}>{filteredCount.toLocaleString()}</strong> voters found
              </>
            ) : (
              <>
                <strong style={{ color: 'var(--text-primary)' }}>{filteredCount.toLocaleString()}</strong> voters
              </>
            )}
          </span>

          {/* Table / Grid Switcher */}
          <div
            style={{
              display: 'flex',
              background: 'var(--bg-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => onViewModeChange('table')}
              style={{
                background: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '4px',
                padding: '0.25rem 0.55rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: viewMode === 'table' ? 600 : 400,
                boxShadow: viewMode === 'table' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <TableIcon size={13} />
              <span>Table</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              style={{
                background: viewMode === 'grid' ? '#ffffff' : 'transparent',
                color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: '4px',
                padding: '0.25rem 0.55rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.75rem',
                fontWeight: viewMode === 'grid' ? 600 : 400,
                boxShadow: viewMode === 'grid' ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <LayoutGrid size={13} />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};