'use client';

import React, { useEffect } from 'react';
import {
  X,
  Copy,
  Check,
  IdCard,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  User,
  MapPin,
  Calendar,
  Briefcase,
  Layers,
} from 'lucide-react';
import { VoterRecord } from '../../types/voter';

interface VoterDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  voter: VoterRecord | null;
  onViewCard: (voter: VoterRecord) => void;
  onEdit: (voter: VoterRecord) => void;
  onDelete: (voter: VoterRecord) => void;
  onToggleStatus: (voter: VoterRecord) => void;
}

export const VoterDetailDrawer: React.FC<VoterDetailDrawerProps> = ({
  isOpen,
  onClose,
  voter,
  onViewCard,
  onEdit,
  onDelete,
  onToggleStatus,
}) => {
  const [copiedNid, setCopiedNid] = React.useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !voter) return null;

  const handleCopyNid = () => {
    if (voter.voter_id) {
      navigator.clipboard.writeText(voter.voter_id);
      setCopiedNid(true);
      setTimeout(() => setCopiedNid(false), 2000);
    }
  };

  const getStatusBadge = (status: VoterRecord['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="badge badge-active">
            <span className="status-dot status-dot-active" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="badge badge-inactive">
            <span className="status-dot status-dot-inactive" />
            Inactive
          </span>
        );
      case 'deceased':
        return (
          <span className="badge badge-deceased">
            <span className="status-dot status-dot-danger" />
            Deceased
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <>
      <div className="drawer-backdrop" onClick={onClose} />

      <aside className="drawer-panel" aria-label="Voter Details">
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.01em',
                }}
              >
                {voter.name}
              </h2>
              {getStatusBadge(voter.status)}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.25rem' }}>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                NID: {voter.voter_id}
              </span>
              <button
                type="button"
                onClick={handleCopyNid}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: copiedNid ? 'var(--primary-green)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: '0.1rem',
                  display: 'flex',
                }}
                title="Copy NID"
              >
                {copiedNid ? <Check size={13} /> : <Copy size={13} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            title="Close Drawer"
            style={{ width: '32px', height: '32px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Content */}
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', flex: 1 }}>
          {/* Section 1: Personal Identity */}
          <div className="card" style={{ padding: '1rem 1.15rem' }}>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <User size={13} />
              <span>Personal Identity</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.825rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Full Name</span>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  {voter.name}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Serial Number</span>
                <div className="font-mono" style={{ fontWeight: 500, color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  #{voter.serial_no}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Gender</span>
                <div style={{ color: 'var(--text-primary)', marginTop: '0.1rem', textTransform: 'capitalize' }}>
                  {voter.gender}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Date of Birth</span>
                <div className="font-mono" style={{ color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  {voter.date_of_birth || '—'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Occupation</span>
                <div style={{ color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  {voter.occupation || '—'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Status</span>
                <div style={{ marginTop: '0.1rem' }}>
                  {getStatusBadge(voter.status)}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Parentage */}
          <div className="card" style={{ padding: '1rem 1.15rem' }}>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                marginBottom: '0.75rem',
              }}
            >
              Parent Information
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Father's Name</span>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  {voter.father_name || '—'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Mother's Name</span>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  {voter.mother_name || '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Administrative Jurisdiction */}
          <div className="card" style={{ padding: '1rem 1.15rem' }}>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                marginBottom: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <MapPin size={13} />
              <span>Electoral Jurisdiction</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', fontSize: '0.825rem' }}>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>District</span>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  {voter.district}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Upazila / Thana</span>
                <div style={{ fontWeight: 500, color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  {voter.upazila}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Union / Municipality</span>
                <div style={{ color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  {voter.union || '—'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Ward Number</span>
                <div className="font-mono" style={{ color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  Ward {voter.ward_number}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Voter Area Code</span>
                <div className="font-mono" style={{ color: 'var(--primary-green)', fontWeight: 600, marginTop: '0.1rem' }}>
                  {voter.voter_area_code || '—'}
                </div>
              </div>

              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Voter Area</span>
                <div style={{ color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  {voter.voter_area || '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Residential Address */}
          <div className="card" style={{ padding: '1rem 1.15rem' }}>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                marginBottom: '0.5rem',
              }}
            >
              Residential Address
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.45 }}>
              {voter.address || '—'}
            </div>
          </div>
        </div>

        {/* Drawer Action Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            position: 'sticky',
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                onClose();
                onViewCard(voter);
              }}
              style={{ flex: 1 }}
            >
              <IdCard size={15} />
              <span>Smart NID Card</span>
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                onClose();
                onEdit(voter);
              }}
              style={{ flex: 1 }}
            >
              <Edit2 size={14} />
              <span>Edit Voter</span>
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onToggleStatus(voter)}
              style={{ flex: 1 }}
            >
              {voter.status === 'active' ? <ToggleRight size={15} color="var(--warning)" /> : <ToggleLeft size={15} color="var(--primary-green)" />}
              <span>{voter.status === 'active' ? 'Mark Inactive' : 'Mark Active'}</span>
            </button>

            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                onClose();
                onDelete(voter);
              }}
              style={{ flex: 1 }}
            >
              <Trash2 size={14} />
              <span>Delete Record</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
