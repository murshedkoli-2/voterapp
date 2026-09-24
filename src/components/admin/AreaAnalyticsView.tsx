'use client';

import React, { useState } from 'react';
import { Building2, Search, Filter } from 'lucide-react';
import { VoterRecord } from '../../types/voter';

interface AreaAnalyticsViewProps {
  voters: VoterRecord[];
  onSelectArea: (district: string, upazila: string) => void;
}

export const AreaAnalyticsView: React.FC<AreaAnalyticsViewProps> = ({
  voters,
  onSelectArea,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Group by District -> Upazila -> Voters
  const areaTree = React.useMemo(() => {
    const map: Record<string, Record<string, VoterRecord[]>> = {};

    voters.forEach((v) => {
      const dist = v.district || 'Unassigned District';
      const upa = v.upazila || 'Unassigned Upazila';

      if (!map[dist]) map[dist] = {};
      if (!map[dist][upa]) map[dist][upa] = [];

      map[dist][upa].push(v);
    });

    return map;
  }, [voters]);

  const totalVoters = voters.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Top Header Card */}
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Electoral Area & Ward Demographics
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Detailed voter breakdown by district, upazila, ward number, and area code
            </p>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter area or upazila..."
              style={{ paddingLeft: '2.4rem', height: '36px', fontSize: '0.85rem' }}
            />
          </div>
        </div>
      </div>

      {/* District & Upazila Accordion/Cards */}
      {Object.keys(areaTree).length === 0 ? (
        <div className="card" style={{ padding: '3.5rem 1.5rem', textAlign: 'center', background: 'var(--bg-surface)' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--bg-subtle)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 0.85rem',
          }}>
            <Building2 size={22} />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            No area demographics yet
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
            Import your voter datasets to view electoral breakdown across districts, upazilas, and wards.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1rem' }}>
          {Object.entries(areaTree).map(([district, upazilas]) => {
            const districtTotal = Object.values(upazilas).reduce((acc, list) => acc + list.length, 0);
            const districtPct = totalVoters > 0 ? Math.round((districtTotal / totalVoters) * 100) : 0;

            return (
              <div key={district} className="card" style={{ padding: '1.25rem' }}>
              {/* District Title */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-subtle)',
                marginBottom: '0.85rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    background: 'var(--primary-green-light)',
                    color: 'var(--primary-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Building2 size={16} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      District: {district}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {Object.keys(upazilas).length} Upazilas included
                    </span>
                  </div>
                </div>

                <span style={{
                  background: 'var(--primary-green-light)',
                  color: 'var(--primary-green-dark)',
                  fontWeight: 600,
                  fontSize: '0.78rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                }}>
                  {districtTotal} voters ({districtPct}%)
                </span>
              </div>

              {/* Upazilas List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {Object.entries(upazilas).map(([upazila, list]) => {
                  const matchingVoters = searchTerm
                    ? list.filter(v => v.address.includes(searchTerm) || v.upazila.includes(searchTerm) || v.voter_area.includes(searchTerm))
                    : list;

                  if (searchTerm && matchingVoters.length === 0 && !upazila.includes(searchTerm) && !district.includes(searchTerm)) {
                    return null;
                  }

                  const activeInUpazila = list.filter(v => v.status === 'active').length;
                  const uniqueWards = Array.from(new Set(list.map(v => v.ward_number))).filter(Boolean);

                  return (
                    <div
                      key={upazila}
                      style={{
                        padding: '0.85rem',
                        background: 'var(--bg-subtle)',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.45rem' }}>
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                            Upazila: {upazila}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                            Wards: {uniqueWards.join(', ') || '—'}
                          </div>
                        </div>

                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => onSelectArea(district, upazila)}
                          style={{ padding: '0.2rem 0.55rem', height: '28px', fontSize: '0.72rem', gap: '0.25rem' }}
                        >
                          <Filter size={11} />
                          <span>Filter List</span>
                        </button>
                      </div>

                      {/* Area Codes Chips */}
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        {Array.from(new Set(list.map(v => v.voter_area_code))).filter(Boolean).map(code => (
                          <span
                            key={code}
                            className="font-mono"
                            style={{
                              background: 'var(--bg-surface)',
                              color: 'var(--text-secondary)',
                              border: '1px solid var(--border-subtle)',
                              fontSize: '0.7rem',
                              padding: '0.15rem 0.45rem',
                              borderRadius: '4px',
                            }}
                          >
                            Area: {code}
                          </span>
                        ))}
                        <span style={{
                          fontSize: '0.7rem',
                          color: 'var(--primary-green-dark)',
                          padding: '0.15rem 0.45rem',
                          fontWeight: 500,
                        }}>
                          Active: {activeInUpazila} / {list.length}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
};
