'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Search,
  MoreHorizontal,
  Copy,
  Check,
  Eye,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  IdCard,
} from 'lucide-react';
import { VoterRecord, SortField, SortOrder } from '../types/voter';

interface VoterTableProps {
  voters: VoterRecord[];
  sortField: SortField;
  sortOrder: SortOrder;
  onSort: (field: SortField) => void;
  onViewCard: (voter: VoterRecord) => void;
  onViewDetails?: (voter: VoterRecord) => void;
  onEdit: (voter: VoterRecord) => void;
  onDelete: (voter: VoterRecord) => void;
  onToggleStatus: (voter: VoterRecord) => void;
  onResetFilters?: () => void;
}

export const VoterTable: React.FC<VoterTableProps> = ({
  voters,
  sortField,
  sortOrder,
  onSort,
  onViewCard,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
  onResetFilters,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [copiedNid, setCopiedNid] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Reset to page 1 if voters list changes
  useEffect(() => {
    setCurrentPage(1);
  }, [voters.length]);

  // Close 3-dot menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const totalPages = Math.ceil(voters.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentVoters = voters.slice(startIndex, startIndex + pageSize);

  const handleCopyNid = (e: React.MouseEvent, nid: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(nid);
    setCopiedNid(nid);
    setTimeout(() => setCopiedNid(null), 2000);
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} style={{ opacity: 0.35 }} />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={12} color="var(--primary-green)" />
    ) : (
      <ArrowDown size={12} color="var(--primary-green)" />
    );
  };

  const getStatusBadge = (status: VoterRecord['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="badge badge-active" style={{ height: '22px' }}>
            <span className="status-dot status-dot-active" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="badge badge-inactive" style={{ height: '22px' }}>
            <span className="status-dot status-dot-inactive" />
            Inactive
          </span>
        );
      case 'deceased':
        return (
          <span className="badge badge-deceased" style={{ height: '22px' }}>
            <span className="status-dot status-dot-danger" />
            Deceased
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  // Empty State
  if (voters.length === 0) {
    return (
      <div
        className="card"
        style={{
          padding: '4rem 1.5rem',
          textAlign: 'center',
          background: 'var(--bg-surface)',
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--bg-subtle)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.85rem',
          }}
        >
          <Search size={22} />
        </div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
          No voters found
        </h3>
        <p
          style={{
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            marginTop: '0.25rem',
            maxWidth: '360px',
            margin: '0.25rem auto 1.25rem',
          }}
        >
          Try adjusting your search query or clearing active filters to see registered citizens.
        </p>
        {onResetFilters && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onResetFilters}
            style={{ fontSize: '0.825rem' }}
          >
            Clear Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="card" style={{ overflow: 'hidden', background: 'var(--bg-surface)' }}>
      {/* Light Data Table */}
      <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table className="voter-data-table">
          <thead>
            <tr>
              {/* Serial */}
              <th
                onClick={() => onSort('serial_no')}
                style={{ cursor: 'pointer', width: '70px', whiteSpace: 'nowrap' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Serial</span>
                  {getSortIcon('serial_no')}
                </div>
              </th>

              {/* Voter & NID */}
              <th
                onClick={() => onSort('name')}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap', minWidth: '180px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Voter</span>
                  {getSortIcon('name')}
                </div>
              </th>

              {/* Parent Information */}
              <th style={{ whiteSpace: 'nowrap', minWidth: '160px' }}>
                Parent Information
              </th>

              {/* Gender */}
              <th style={{ whiteSpace: 'nowrap', width: '85px' }}>
                Gender
              </th>

              {/* Occupation */}
              <th style={{ whiteSpace: 'nowrap', minWidth: '100px' }}>
                Occupation
              </th>

              {/* Date of Birth */}
              <th
                onClick={() => onSort('date_of_birth')}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap', width: '105px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Date of Birth</span>
                  {getSortIcon('date_of_birth')}
                </div>
              </th>

              {/* Address */}
              <th style={{ whiteSpace: 'nowrap', minWidth: '180px' }}>
                Address
              </th>

              {/* Ward / Area */}
              <th style={{ whiteSpace: 'nowrap', width: '120px' }}>
                Ward / Area
              </th>

              {/* Status */}
              <th
                onClick={() => onSort('status')}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap', width: '100px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span>Status</span>
                  {getSortIcon('status')}
                </div>
              </th>

              {/* Row Actions */}
              <th style={{ textAlign: 'right', whiteSpace: 'nowrap', width: '90px' }}>
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {currentVoters.map((voter) => {
              const rowKey = voter.voter_id || voter.serial_no;
              const isMenuOpen = openMenuId === rowKey;

              return (
                <tr key={rowKey}>
                  {/* Serial */}
                  <td className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    #{voter.serial_no}
                  </td>

                  {/* Voter (Name + NID in clean monospace) */}
                  <td>
                    <div>
                      <button
                        type="button"
                        onClick={() => onViewDetails ? onViewDetails(voter) : onViewCard(voter)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          padding: 0,
                          fontWeight: 600,
                          fontSize: '0.875rem',
                          color: 'var(--text-primary)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          display: 'inline-block',
                        }}
                        className="hover-underline"
                      >
                        {voter.name}
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.15rem' }}>
                        <span className="nid-link-mono">
                          {voter.voter_id}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleCopyNid(e, voter.voter_id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: copiedNid === voter.voter_id ? 'var(--primary-green)' : 'var(--text-muted)',
                            cursor: 'pointer',
                            padding: '0.1rem',
                            display: 'inline-flex',
                          }}
                          title="Copy NID"
                        >
                          {copiedNid === voter.voter_id ? <Check size={12} /> : <Copy size={12} />}
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Parent Information */}
                  <td>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)' }}>F:</span> {voter.father_name || '—'}
                      </div>
                      <div style={{ marginTop: '0.1rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>M:</span> {voter.mother_name || '—'}
                      </div>
                    </div>
                  </td>

                  {/* Gender */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          background: voter.gender === 'female' ? '#db2777' : '#2563eb',
                        }}
                      />
                      <span style={{ textTransform: 'capitalize' }}>{voter.gender}</span>
                    </div>
                  </td>

                  {/* Occupation */}
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-primary)' }}>
                    {voter.occupation || '—'}
                  </td>

                  {/* Date of Birth */}
                  <td className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                    {voter.date_of_birth || '—'}
                  </td>

                  {/* Address (Max 2 lines, truncated) */}
                  <td style={{ maxWidth: '240px' }}>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: 'var(--text-primary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                      title={voter.address}
                    >
                      {voter.address || '—'}
                    </div>
                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-muted)',
                        marginTop: '0.1rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {voter.upazila}, {voter.district}
                    </div>
                  </td>

                  {/* Ward & Area */}
                  <td>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Ward {voter.ward_number}
                    </div>
                    <div className="font-mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Area {voter.voter_area_code || '—'}
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    {getStatusBadge(voter.status)}
                  </td>

                  {/* Streamlined Row Actions: View and ⋯ */}
                  <td style={{ textAlign: 'right', position: 'relative' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                      {/* View Button */}
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => onViewDetails ? onViewDetails(voter) : onViewCard(voter)}
                        title="View Details"
                        style={{ width: '28px', height: '28px', border: 'none' }}
                      >
                        <Eye size={14} />
                      </button>

                      {/* 3-Dot More Menu */}
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(isMenuOpen ? null : rowKey);
                        }}
                        title="More Actions"
                        style={{ width: '28px', height: '28px', border: 'none' }}
                      >
                        <MoreHorizontal size={14} />
                      </button>
                    </div>

                    {/* Popover Dropdown Menu */}
                    {isMenuOpen && (
                      <div ref={menuRef} className="dropdown-menu">
                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => {
                            setOpenMenuId(null);
                            onViewDetails ? onViewDetails(voter) : onViewCard(voter);
                          }}
                        >
                          <Eye size={13} color="var(--text-muted)" />
                          <span>View Details</span>
                        </button>

                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => {
                            setOpenMenuId(null);
                            onViewCard(voter);
                          }}
                        >
                          <IdCard size={13} color="var(--primary-green)" />
                          <span>Smart NID Card</span>
                        </button>

                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => {
                            setOpenMenuId(null);
                            onEdit(voter);
                          }}
                        >
                          <Edit2 size={13} color="var(--info)" />
                          <span>Edit Voter</span>
                        </button>

                        <button
                          type="button"
                          className="dropdown-item"
                          onClick={() => {
                            setOpenMenuId(null);
                            onToggleStatus(voter);
                          }}
                        >
                          {voter.status === 'active' ? (
                            <ToggleRight size={13} color="var(--warning)" />
                          ) : (
                            <ToggleLeft size={13} color="var(--primary-green)" />
                          )}
                          <span>{voter.status === 'active' ? 'Mark Inactive' : 'Mark Active'}</span>
                        </button>

                        <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '0.2rem 0' }} />

                        <button
                          type="button"
                          className="dropdown-item dropdown-item-danger"
                          onClick={() => {
                            setOpenMenuId(null);
                            onDelete(voter);
                          }}
                        >
                          <Trash2 size={13} />
                          <span>Delete Record</span>
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Minimal Clean Pagination Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.75rem 1rem',
          borderTop: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '0.75rem',
          background: 'var(--bg-surface)',
        }}
      >
        {/* Left: Showing range */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Showing{' '}
          <strong style={{ color: 'var(--text-primary)' }}>
            {startIndex + 1}–{Math.min(startIndex + pageSize, voters.length)}
          </strong>{' '}
          of <strong style={{ color: 'var(--text-primary)' }}>{voters.length.toLocaleString()}</strong> voters
        </div>

        {/* Right: Rows per page & Prev/Next */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <span>Rows:</span>
            <select
              className="form-select font-mono"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{
                padding: '0.15rem 0.45rem',
                fontSize: '0.78rem',
                width: '64px',
                height: '30px',
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '0 0.65rem',
                height: '30px',
                fontSize: '0.78rem',
                opacity: currentPage === 1 ? 0.45 : 1,
              }}
            >
              <ChevronLeft size={13} />
              <span>Previous</span>
            </button>

            <span
              className="font-mono"
              style={{
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                padding: '0 0.4rem',
              }}
            >
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '0 0.65rem',
                height: '30px',
                fontSize: '0.78rem',
                opacity: currentPage === totalPages ? 0.45 : 1,
              }}
            >
              <span>Next</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
