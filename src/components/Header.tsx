'use client';

import React from 'react';
import { UserPlus, Download, Database, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  totalCount: number;
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCount,
  onOpenAddModal,
  onOpenBackupModal,
}) => {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(10, 14, 23, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '1rem 0',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
      }}>
        {/* Logo and Portal Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}>
            <ShieldCheck size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h1 style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '-0.01em',
              }}>
                Voter Information Management & Search Portal
              </h1>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                fontSize: '0.7rem',
                fontWeight: 600,
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                border: '1px solid rgba(16, 185, 129, 0.3)',
              }}>
                EC-NID v2.0
              </span>
            </div>
            <p style={{
              fontSize: '0.8rem',
              color: 'var(--text-muted)',
            }}>
              Bangladesh Election Commission • Digital Voter Records & Smart Search System
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenBackupModal}
            title="Data Backup & Export/Import"
          >
            <Database size={16} />
            <span>Import / Export</span>
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenAddModal}
          >
            <UserPlus size={17} />
            <span>Add New Voter</span>
          </button>
        </div>
      </div>
    </header>
  );
};
