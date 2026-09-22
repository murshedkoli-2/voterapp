'use client';

import React from 'react';
import { Users, UserCheck, MapPin, Activity, Database } from 'lucide-react';
import { VoterRecord } from '../types/voter';

interface StatsCardsProps {
  voters: VoterRecord[];
  filteredCount: number;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ voters, filteredCount }) => {
  const total = voters.length;
  const activeCount = voters.filter((v) => v.status === 'active').length;
  const femaleCount = voters.filter((v) => v.gender === 'female').length;
  const maleCount = voters.filter((v) => v.gender === 'male').length;
  const otherCount = voters.filter((v) => v.gender === 'other').length;

  const femalePct = total > 0 ? Math.round((femaleCount / total) * 100) : 0;
  const malePct = total > 0 ? Math.round((maleCount / total) * 100) : 0;

  // Distinct administrative units
  const uniqueDistricts = new Set(voters.map((v) => v.district).filter(Boolean)).size;
  const uniqueUpazilas = new Set(voters.map((v) => `${v.district}-${v.upazila}`).filter(Boolean)).size;
  const uniqueWards = new Set(voters.map((v) => `${v.district}-${v.upazila}-${v.ward_number}`).filter(Boolean)).size;

  const activePercent = total > 0 ? Math.round((activeCount / total) * 100) : 0;

  return (
    <div className="stats-grid">
      {/* 1. Total Registered Voters */}
      <div className="card card-hover" style={{ padding: '1.35rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Voters
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.65rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  background: 'var(--status-active-bg)',
                  color: 'var(--status-active-text)',
                  border: '1px solid var(--status-active-border)',
                  fontWeight: 600,
                }}
              >
                LIVE
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginTop: '0.4rem' }}>
              <h2 className="font-mono" style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1 }}>
                {total}
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                citizens
              </span>
            </div>
          </div>

          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--status-active-bg)',
              color: 'var(--primary-600)',
              border: '1px solid var(--status-active-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Users size={22} />
          </div>
        </div>

        <div
          style={{
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Database size={12} color="var(--accent-blue)" />
            <span>Neon Cloud Storage</span>
          </div>
          <span
            className="font-mono"
            style={{
              color: filteredCount !== total ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontWeight: 600,
            }}
          >
            {filteredCount}/{total} visible
          </span>
        </div>
      </div>

      {/* 2. Active Voter Rate */}
      <div className="card card-hover" style={{ padding: '1.35rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Verification
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.65rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  background: 'var(--status-active-bg)',
                  color: 'var(--status-active-text)',
                  border: '1px solid var(--status-active-border)',
                  fontWeight: 600,
                }}
              >
                {activeCount} active
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginTop: '0.4rem' }}>
              <h2 className="font-mono" style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--primary-600)', lineHeight: 1 }}>
                {activePercent}%
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                valid roster
              </span>
            </div>
          </div>

          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--status-active-bg)',
              color: 'var(--primary-600)',
              border: '1px solid var(--status-active-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <UserCheck size={22} />
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: 'var(--status-active-bg)',
              borderRadius: '999px',
              overflow: 'hidden',
              marginBottom: '0.35rem',
            }}
          >
            <div
              style={{
                width: `${activePercent}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #047857 0%, #059669 100%)',
                borderRadius: '999px',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>Eligible for ballot</span>
            <span className="font-mono">{total - activeCount} inactive/pending</span>
          </div>
        </div>
      </div>

      {/* 3. Gender Distribution */}
      <div className="card card-hover" style={{ padding: '1.35rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Gender Demographics
            </span>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.45rem', flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: '0.68rem', color: 'var(--accent-rose)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>Female</span>
                  <span className="font-mono">({femalePct}%)</span>
                </div>
                <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  {femaleCount}
                </div>
              </div>

              <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '0.75rem' }}>
                <div style={{ fontSize: '0.68rem', color: 'var(--accent-blue)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span>Male</span>
                  <span className="font-mono">({malePct}%)</span>
                </div>
                <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                  {maleCount}
                </div>
              </div>

              {otherCount > 0 && (
                <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '0.75rem' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--accent-purple)', fontWeight: 600 }}>Other</div>
                  <div className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.1rem' }}>
                    {otherCount}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#f5f3ff',
              color: 'var(--accent-purple)',
              border: '1px solid #ddd6fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Activity size={22} />
          </div>
        </div>

        {/* Dual gender ratio bar */}
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', height: '6px', borderRadius: '999px', overflow: 'hidden', backgroundColor: '#f1f5f9' }}>
            <div style={{ width: `${femalePct}%`, background: '#ec4899' }} title={`Female: ${femaleCount}`} />
            <div style={{ width: `${malePct}%`, background: '#3b82f6' }} title={`Male: ${maleCount}`} />
            {otherCount > 0 && (
              <div style={{ width: `${100 - femalePct - malePct}%`, background: '#8b5cf6' }} title={`Other: ${otherCount}`} />
            )}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            <span>Balanced electorate</span>
            <span className="font-mono">Ratio {total > 0 ? (maleCount / (femaleCount || 1)).toFixed(2) : 0} : 1</span>
          </div>
        </div>
      </div>

      {/* 4. Geographic Coverage */}
      <div className="card card-hover bento-glow-cyan" style={{ padding: '1.35rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Area Coverage
              </span>
              <span
                className="font-mono"
                style={{
                  fontSize: '0.65rem',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  border: '1px solid #bfdbfe',
                  fontWeight: 600,
                }}
              >
                {uniqueDistricts} Districts
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', marginTop: '0.4rem' }}>
              <h2 className="font-mono" style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--accent-blue)', lineHeight: 1 }}>
                {uniqueUpazilas}
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Upazilas ({uniqueWards} Wards)
              </span>
            </div>
          </div>

          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <MapPin size={22} />
          </div>
        </div>

        <div
          style={{
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>Electoral Boundaries</span>
          <span className="font-mono" style={{ color: '#1d4ed8', fontWeight: 600 }}>
            Active Registry Roll
          </span>
        </div>
      </div>
    </div>
  );
};