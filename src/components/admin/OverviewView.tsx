'use client';

import React from 'react';
import {
  MapPin,
  ArrowUpRight,
  IdCard,
} from 'lucide-react';
import { VoterRecord } from '../../types/voter';
import { StatsCards } from '../StatsCards';

interface OverviewViewProps {
  voters: VoterRecord[];
  onGoToVoters: () => void;
  onViewCard: (voter: VoterRecord) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  voters,
  onGoToVoters,
  onViewCard,
}) => {
  const total = voters.length;

  // Status breakdown
  const activeCount = voters.filter((v) => v.status === 'active').length;
  const inactiveCount = voters.filter((v) => v.status === 'inactive').length;
  const deceasedCount = voters.filter((v) => v.status === 'deceased').length;
  const transferredCount = voters.filter((v) => v.status === 'transferred').length;

  // District distribution
  const districtMap: Record<string, number> = {};
  voters.forEach((v) => {
    const d = v.district || 'Unassigned';
    districtMap[d] = (districtMap[d] || 0) + 1;
  });

  const districtsSorted = Object.entries(districtMap).sort((a, b) => b[1] - a[1]);

  // Recent voters (take up to 6 newest)
  const recentVoters = voters.slice(0, 6);

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
      case 'transferred':
        return (
          <span className="badge badge-transferred" style={{ height: '22px' }}>
            Transferred
          </span>
        );
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
      {/* 1. Top 4 KPI Metric Cards */}
      <StatsCards voters={voters} filteredCount={voters.length} />

      {/* 2. Analytics Row: Status Distribution & District Density */}
      <div className="analytics-grid">
        {/* Status Distribution Tile */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Voter Roll Integrity & Status
            </h3>
            <span
              className="font-mono"
              style={{
                fontSize: '0.7rem',
                color: 'var(--primary-green-dark)',
                background: 'var(--primary-green-light)',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                fontWeight: 500,
              }}
            >
              Real-time
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Inclusion, validation, and operational status of all registered citizens
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {/* Active */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="status-dot status-dot-active" />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Active Registered</span>
                </div>
                <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <strong>{activeCount}</strong> ({total ? Math.round((activeCount / total) * 100) : 0}%)
                </div>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${total ? (activeCount / total) * 100 : 0}%`, height: '100%', background: 'var(--primary-green)', borderRadius: '999px' }} />
              </div>
            </div>

            {/* Inactive */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="status-dot status-dot-inactive" />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Inactive / Pending</span>
                </div>
                <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <strong>{inactiveCount}</strong> ({total ? Math.round((inactiveCount / total) * 100) : 0}%)
                </div>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${total ? (inactiveCount / total) * 100 : 0}%`, height: '100%', background: 'var(--warning)', borderRadius: '999px' }} />
              </div>
            </div>

            {/* Deceased */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span className="status-dot status-dot-danger" />
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Deceased Records</span>
                </div>
                <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <strong>{deceasedCount}</strong> ({total ? Math.round((deceasedCount / total) * 100) : 0}%)
                </div>
              </div>
              <div style={{ height: '6px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ width: `${total ? (deceasedCount / total) * 100 : 0}%`, height: '100%', background: 'var(--danger)', borderRadius: '999px' }} />
              </div>
            </div>
          </div>
        </div>

        {/* District Density Tile */}
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Regional Voter Distribution
            </h3>
            <span
              className="font-mono"
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                background: 'var(--bg-subtle)',
                padding: '0.15rem 0.5rem',
                borderRadius: '999px',
                fontWeight: 500,
              }}
            >
              Top Regions
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Administrative density across top districts and metropolitan areas
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {districtsSorted.slice(0, 5).map(([dist, count]) => {
              const pct = total ? Math.round((count / total) * 100) : 0;
              return (
                <div key={dist}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '0.825rem', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={12} color="var(--primary-green)" />
                      <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{dist}</span>
                    </div>
                    <div className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                      <strong>{count}</strong> ({pct}%)
                    </div>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bg-subtle)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: 'var(--primary-green)', borderRadius: '999px' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Recent Citizens Registered Feed */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Recently Registered Citizens
              </h3>
              <span
                className="font-mono"
                style={{
                  background: 'var(--bg-subtle)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px',
                }}
              >
                Latest {recentVoters.length}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Citizen profiles directly synchronized with Neon Serverless Cloud
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onGoToVoters}
            style={{
              height: '32px',
              padding: '0 0.75rem',
              fontSize: '0.8rem',
            }}
          >
            <span>Open Registry Table</span>
            <ArrowUpRight size={13} />
          </button>
        </div>

        {/* Desktop Presentation: Clean Light Data Grid */}
        <div className="recent-voters-desktop">
          <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
            <table className="voter-data-table">
              <thead>
                <tr>
                  <th style={{ width: '70px' }}>Serial</th>
                  <th>Citizen Name & NID</th>
                  <th>Gender & Occupation</th>
                  <th>Constituency Address</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right', width: '120px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentVoters.map((voter) => (
                  <tr key={voter.voter_id || voter.serial_no}>
                    {/* Serial */}
                    <td className="font-mono" style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                      #{voter.serial_no}
                    </td>

                    {/* Name & NID */}
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                          {voter.name}
                        </div>
                        <div className="nid-link-mono" style={{ marginTop: '0.15rem' }}>
                          NID: {voter.voter_id}
                        </div>
                      </div>
                    </td>

                    {/* Gender & Occupation */}
                    <td>
                      <div style={{ color: 'var(--text-primary)', fontSize: '0.825rem' }}>
                        {voter.occupation || '—'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize', marginTop: '0.1rem' }}>
                        {voter.gender} • DOB {voter.date_of_birth}
                      </div>
                    </td>

                    {/* Address */}
                    <td>
                      <div style={{ color: 'var(--text-primary)', fontSize: '0.825rem' }}>
                        {voter.address || voter.union}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                        {voter.upazila}, {voter.district} (Ward {voter.ward_number})
                      </div>
                    </td>

                    {/* Status */}
                    <td>{getStatusBadge(voter.status)}</td>

                    {/* Action */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => onViewCard(voter)}
                        style={{
                          height: '28px',
                          padding: '0 0.6rem',
                          fontSize: '0.75rem',
                        }}
                        title="View Official Smart NID Card"
                      >
                        <IdCard size={13} color="var(--primary-green)" />
                        <span>Card</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Presentation: Clean Cards Feed */}
        <div className="recent-voters-mobile">
          {recentVoters.map((voter) => (
            <div
              key={voter.voter_id || voter.serial_no}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '0.85rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                    {voter.name}
                  </div>
                  <div className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    #{voter.serial_no} · NID: {voter.voter_id}
                  </div>
                </div>

                {getStatusBadge(voter.status)}
              </div>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                {voter.upazila}, {voter.district} (Ward {voter.ward_number})
              </div>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => onViewCard(voter)}
                style={{
                  width: '100%',
                  height: '32px',
                  fontSize: '0.78rem',
                }}
              >
                <IdCard size={13} color="var(--primary-green)" />
                <span>View Smart NID Card</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};