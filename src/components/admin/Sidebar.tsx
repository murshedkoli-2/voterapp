'use client';

import React from 'react';
import {
  LayoutDashboard,
  Users,
  Map,
  Database,
  ShieldCheck,
  LogOut,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export type AdminTab = 'overview' | 'voters' | 'analytics' | 'backup';

interface SidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOpen: boolean;
  onClose: () => void;
  totalVoters: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  totalVoters,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    {
      id: 'overview' as AdminTab,
      label: 'Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'voters' as AdminTab,
      label: 'Voter Directory',
      icon: Users,
      badge: totalVoters > 0 ? totalVoters.toLocaleString() : undefined,
    },
    {
      id: 'analytics' as AdminTab,
      label: 'Demographics',
      icon: Map,
    },
    {
      id: 'backup' as AdminTab,
      label: 'Data & Backup',
      icon: Database,
    },
  ];

  return (
    <>
      {isOpen && (
        <div
          className="sidebar-backdrop"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(17, 24, 39, 0.3)',
            zIndex: 998,
          }}
        />
      )}

      <aside
        className={`admin-sidebar ${isOpen ? 'open' : ''}`}
        style={{
          width: '240px',
          background: '#ffffff',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 999,
          transition: 'transform 0.2s ease',
        }}
      >
        <div>
          {/* Top Brand Header */}
          <div
            style={{
              padding: '1.1rem 1.15rem',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              height: '60px',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'var(--primary-green)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={18} />
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    color: 'var(--text-primary)',
                    lineHeight: 1.2,
                  }}
                >
                  Election Commission
                </div>
                <div
                  style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 400,
                    marginTop: '0.05rem',
                  }}
                >
                  Admin Console
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-icon mobile-only-close"
              onClick={onClose}
              style={{ width: '28px', height: '28px', border: 'none' }}
              title="Close Menu"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation */}
          <nav style={{ padding: '1rem 0.65rem' }}>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: 'var(--text-muted)',
                padding: '0 0.5rem 0.5rem',
              }}
            >
              Management
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectTab(item.id);
                      onClose();
                    }}
                    style={{
                      width: '100%',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 0.75rem',
                      borderRadius: '6px',
                      background: isActive ? 'var(--primary-green-light)' : 'transparent',
                      border: 'none',
                      color: isActive ? 'var(--primary-green-dark)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease, color 0.15s ease',
                      textAlign: 'left',
                      position: 'relative',
                    }}
                  >
                    {isActive && (
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '20%',
                          bottom: '20%',
                          width: '3px',
                          borderRadius: '0 2px 2px 0',
                          background: 'var(--primary-green)',
                        }}
                      />
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <Icon
                        size={16}
                        color={isActive ? 'var(--primary-green)' : 'currentColor'}
                        style={{ opacity: isActive ? 1 : 0.8 }}
                      />
                      <span
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: isActive ? 600 : 400,
                        }}
                      >
                        {item.label}
                      </span>
                    </div>

                    {item.badge && (
                      <span
                        className="font-mono"
                        style={{
                          fontSize: '0.72rem',
                          color: isActive ? 'var(--primary-green-dark)' : 'var(--text-muted)',
                          fontWeight: 500,
                        }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* Simplified Sidebar Footer */}
        <div
          style={{
            padding: '0.85rem',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
          }}
        >
          {/* Database Status */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.45rem 0.65rem',
              borderRadius: '6px',
              background: 'var(--bg-main)',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span className="status-dot status-dot-active" />
              <span>Database</span>
            </div>
            <span style={{ fontSize: '0.7rem', color: 'var(--primary-green-dark)', fontWeight: 500 }}>
              Connected
            </span>
          </div>

          {/* User Profile */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.35rem 0.45rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '6px',
                  background: 'var(--primary-green-light)',
                  color: 'var(--primary-green-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  flexShrink: 0,
                }}
              >
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'EC'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div
                  style={{
                    fontWeight: 500,
                    fontSize: '0.8rem',
                    color: 'var(--text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {user?.name || 'Administrator'}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  Super Admin
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-icon"
              onClick={() => logout()}
              title="Log Out"
              style={{ width: '28px', height: '28px', border: 'none' }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};