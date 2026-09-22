'use client';

import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { VoterRecord } from '../types/voter';
import { toBengaliDigits } from '../utils/search';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  voter: VoterRecord | null;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  voter,
}) => {
  if (!isOpen || !voter) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '460px' }}
      >
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fb7185' }}>
            <AlertTriangle size={20} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>
              Confirm Delete Voter Record
            </h3>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          <p>Are you sure you want to permanently delete this citizen voter record from the database?</p>
          
          <div style={{
            marginTop: '1rem',
            padding: '0.85rem 1rem',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '8px',
          }}>
            <div style={{ fontWeight: 700, color: '#ffffff', fontSize: '1rem' }}>
              {voter.name}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              SL: #{voter.serial_no} | NID: {voter.voter_id}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
              Area: {voter.voter_area || '—'}, {voter.upazila}, {voter.district}
            </div>
          </div>

          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#fb7185' }}>
            * Warning: This action cannot be undone once deleted from the cloud database.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '0.75rem',
          padding: '1rem 1.5rem',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(11, 17, 30, 0.5)',
        }}>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            <Trash2 size={16} />
            <span>Yes, Delete Record</span>
          </button>
        </div>
      </div>
    </div>
  );
};
