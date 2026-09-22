'use client';

import React from 'react';
import {
  Menu,
  UserPlus,
  LogOut,
  Upload,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AdminTab } from './Sidebar';

interface AdminHeaderProps {
  currentTab: AdminTab;
  onToggleSidebar: () => void;
  onOpenAddModal: () => void;
  onOpenJsonImporter: () => void;
  totalVoters: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentTab,
  onToggleSidebar,
  onOpenAddModal,
  onOpenJsonImporter,
  totalVoters,
}) => {
  const { logout } = useAuth();

  const getBreadcrumbLabel = (tab: AdminTab) => {
    switch (tab) {
      case 'overview':
        return 'Overview';
      case 'voters':
        return 'Voters';
      case 'analytics':
        return 'Demographics';
      case 'backup':
        return 'Data & Backup';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="admin-header">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          type="button"
          className="btn-icon mobile-menu-btn"
          onClick={onToggleSidebar}
          title="Toggle Navigation"
        >
          <Menu size={18} />
        </button>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
          }}
        >
          <span>Portal</span>
          <ChevronRight size={13} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
            {getBreadcrumbLabel(currentTab)}
          </span>
        </div>
      </div>

      {/* Right Side: Database Pill, Actions & Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Connected Status Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.3rem 0.65rem',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--bg-subtle)',
            border: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)',
          }}
          className="header-db-pill"
          title="Database Connected"
        >
          <span className="status-dot status-dot-active" />
          <span className="header-db-pill-text">Database Connected</span>
        </div>

        {/* Import JSON Button */}
        <button
          type="button"
          className="btn btn-secondary header-action-btn"
          onClick={onOpenJsonImporter}
          title="Import JSON Voter Records"
          style={{ height: '36px', padding: '0 0.85rem' }}
        >
          <Upload size={14} />
          <span className="header-btn-text">Import JSON</span>
        </button>

        {/* Register Voter Button */}
        <button
          type="button"
          className="btn btn-primary header-action-btn"
          onClick={onOpenAddModal}
          title="Register New Voter"
          style={{ height: '36px', padding: '0 0.95rem' }}
        >
          <UserPlus size={15} />
          <span className="header-btn-text">Register Voter</span>
        </button>

        {/* Logout Button */}
        <button
          type="button"
          className="btn-icon"
          onClick={() => logout()}
          title="Sign Out"
          style={{ width: '36px', height: '36px' }}
        >
          <LogOut size={15} />
        </button>
      </div>
    </header>
  );
};