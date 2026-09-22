'use client';

import React, { useState } from 'react';
import {
  IdCard,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Copy,
  Check,
  Eye,
  Search,
} from 'lucide-react';
import { VoterRecord } from '../types/voter';

interface VoterCardGridProps {
  voters: VoterRecord[];
  onViewCard: (voter: VoterRecord) => void;
  onViewDetails?: (voter: VoterRecord) => void;
  onEdit: (voter: VoterRecord) => void;
  onDelete: (voter: VoterRecord) => void;
  onToggleStatus: (voter: VoterRecord) => void;
}

export const VoterCardGrid: React.FC<VoterCardGridProps> = ({
  voters,
  onViewCard,
  onViewDetails,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [copiedNid, setCopiedNid] = useState<string | null>(null);

  const handleCopyNid = (e: React.MouseEvent, nid: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(nid);
    setCopiedNid(nid);
    setTimeout(() => setCopiedNid(null), 2000);
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
          }}
        >
          No citizen profiles matched your filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1rem',
      }}
    >
      {voters.map((voter) => (
        <div
          key={voter.voter_id || voter.serial_no}
          className="card card-hover"
          style={{
            padding: '1.15rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'var(--bg-surface)',
          }}
        >
          <div>
            {/* Top row: Name, NID and Status Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '0.5rem',
                marginBottom: '0.75rem',
              }}
            >
              <div>
                <button
                  type="button"
                  onClick={() => onViewDetails ? onViewDetails(voter) : onViewCard(voter)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    lineHeight: 1.3,
                  }}
                >
                  {voter.name}
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                  <span className="nid-link-mono">
                    NID: {voter.voter_id}
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

              {getStatusBadge(voter.status)}
            </div>

            {/* Demographics / Parents Info */}
            <div
              style={{
                padding: '0.65rem 0.75rem',
                borderRadius: '6px',
                background: 'var(--bg-subtle)',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem',
                marginBottom: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Father:</span>
                <span style={{ color: 'var(--text-primary)' }}>{voter.father_name || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mother:</span>
                <span style={{ color: 'var(--text-primary)' }}>{voter.mother_name || '—'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.25rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>Ward & Area:</span>
                <span className="font-mono" style={{ color: 'var(--text-primary)' }}>
                  Ward {voter.ward_number} · Area {voter.voter_area_code || '—'}
                </span>
              </div>
            </div>
          </div>

          {/* Clean Action Bar */}
          <div
            style={{
              paddingTop: '0.65rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.35rem',
            }}
          >
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onViewDetails ? onViewDetails(voter) : onViewCard(voter)}
              style={{ flex: 1, height: '32px', fontSize: '0.78rem' }}
            >
              <Eye size={13} />
              <span>Details</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onViewCard(voter)}
              style={{ height: '32px', padding: '0 0.55rem', fontSize: '0.78rem', color: 'var(--primary-green)' }}
              title="Print Smart Card"
            >
              <IdCard size={14} />
            </button>

            <button
              type="button"
              className="btn-icon"
              onClick={() => onEdit(voter)}
              title="Edit voter"
              style={{ width: '32px', height: '32px' }}
            >
              <Edit2 size={13} />
            </button>

            <button
              type="button"
              className="btn-icon"
              onClick={() => onToggleStatus(voter)}
              title={`Toggle status (${voter.status})`}
              style={{ width: '32px', height: '32px' }}
            >
              {voter.status === 'active' ? <ToggleRight size={15} color="var(--warning)" /> : <ToggleLeft size={15} color="var(--primary-green)" />}
            </button>

            <button
              type="button"
              className="btn-icon btn-icon-danger"
              onClick={() => onDelete(voter)}
              title="Delete record"
              style={{ width: '32px', height: '32px' }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
