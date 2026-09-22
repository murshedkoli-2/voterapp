'use client';

import React from 'react';
import { VoterRecord } from '../../types/voter';

interface VoterDirectoryHeaderProps {
  voters: VoterRecord[];
}

export const VoterDirectoryHeader: React.FC<VoterDirectoryHeaderProps> = ({ voters }) => {
  const total = voters.length;
  const activeCount = voters.filter((v) => v.status === 'active').length;
  const inactiveCount = voters.filter((v) => v.status === 'inactive').length;
  const deceasedCount = voters.filter((v) => v.status === 'deceased').length;

  const stats = [
    {
      label: 'Total Voters',
      value: total.toLocaleString(),
      dotColor: 'var(--primary-green)',
    },
    {
      label: 'Active',
      value: activeCount.toLocaleString(),
      dotColor: 'var(--primary-green)',
    },
    {
      label: 'Inactive',
      value: inactiveCount.toLocaleString(),
      dotColor: 'var(--warning)',
    },
    {
      label: 'Deceased',
      value: deceasedCount.toLocaleString(),
      dotColor: 'var(--danger)',
    },
  ];

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      {/* Title & Subtitle */}
      <div style={{ marginBottom: '1.15rem' }}>
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            lineHeight: 1.25,
          }}
        >
          Voter Directory
        </h1>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginTop: '0.2rem',
          }}
        >
          Manage, search and maintain voter registration records.
        </p>
      </div>

      {/* 4 Compact Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
          gap: '0.85rem',
        }}
        className="voter-directory-stats-grid"
      >
        {stats.map((item) => (
          <div
            key={item.label}
            className="card"
            style={{
              padding: '0.9rem 1.15rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                fontWeight: 500,
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: item.dotColor,
                }}
              />
              <span>{item.label}</span>
            </div>

            <div
              className="font-mono"
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                lineHeight: 1.2,
                marginTop: '0.15rem',
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .voter-directory-stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
        }
      `}</style>
    </div>
  );
};
