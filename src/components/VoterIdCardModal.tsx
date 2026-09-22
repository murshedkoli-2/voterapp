'use client';

import React from 'react';
import { X, Printer, Shield, CheckCircle2, User } from 'lucide-react';
import { VoterRecord } from '../types/voter';
import { toBengaliDigits } from '../utils/search';

interface VoterIdCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  voter: VoterRecord | null;
}

export const VoterIdCardModal: React.FC<VoterIdCardModalProps> = ({
  isOpen,
  onClose,
  voter,
}) => {
  if (!isOpen || !voter) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px' }}
      >
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print" style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield size={18} color="var(--primary-green)" />
            <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
              Smart Voter ID Card Preview
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handlePrint}
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
            >
              <Printer size={16} />
              <span>Print Card</span>
            </button>
            <button
              type="button"
              className="btn-icon"
              onClick={onClose}
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Card Body to Print */}
        <div style={{ padding: '1.75rem 1.5rem' }}>
          {/* Smart Card Front */}
          <div
            className="printable-id-card"
            style={{
              width: '100%',
              maxWidth: '520px',
              margin: '0 auto',
              borderRadius: '16px',
              border: '2px solid #059669',
              background: 'linear-gradient(135deg, #064e3b 0%, #022c22 60%, #042f2e 100%)',
              color: '#ffffff',
              padding: '1.25rem',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5), inset 0 0 15px rgba(16, 185, 129, 0.2)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Watermark Emblem Effect */}
            <div style={{
              position: 'absolute',
              right: '-20px',
              bottom: '-20px',
              opacity: 0.08,
              pointerEvents: 'none',
              transform: 'rotate(-15deg)',
            }}>
              <Shield size={260} />
            </div>

            {/* Header: Republic of Bangladesh */}
            <div style={{
              textAlign: 'center',
              borderBottom: '1px solid rgba(16, 185, 129, 0.35)',
              paddingBottom: '0.65rem',
              marginBottom: '0.85rem',
            }}>
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#34d399',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                Government of the People&apos;s Republic of Bangladesh
              </div>
              <div style={{
                fontSize: '0.7rem',
                color: '#a7f3d0',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginTop: '0.1rem',
              }}>
                Election Commission Bangladesh
              </div>
              <div style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                color: '#fbbf24',
                marginTop: '0.2rem',
              }}>
                National ID Card
              </div>
            </div>

            {/* Middle Section: Photo + Smart Chip + Data */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              {/* Photo & Chip Column */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.65rem' }}>
                {/* Simulated Chip */}
                <div style={{
                  width: '38px',
                  height: '28px',
                  borderRadius: '5px',
                  background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                  border: '1px solid #b45309',
                  boxShadow: 'inset 0 1px 2px rgba(255, 255, 255, 0.4)',
                  position: 'relative',
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '0',
                    right: '0',
                    height: '1px',
                    background: '#78350f',
                  }} />
                  <div style={{
                    position: 'absolute',
                    left: '50%',
                    top: '0',
                    bottom: '0',
                    width: '1px',
                    background: '#78350f',
                  }} />
                </div>

                {/* Portrait Avatar */}
                <div style={{
                  width: '90px',
                  height: '110px',
                  borderRadius: '8px',
                  background: '#0f172a',
                  border: '2px solid rgba(255, 255, 255, 0.25)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                }}>
                  <User size={42} />
                  <span style={{ fontSize: '0.65rem', marginTop: '0.25rem', color: '#64748b' }}>
                    Photo
                  </span>
                </div>
              </div>

              {/* Data Fields */}
              <div style={{ flex: 1, fontSize: '0.825rem' }}>
                <div style={{ marginBottom: '0.4rem' }}>
                  <div style={{ fontSize: '0.7rem', color: '#a7f3d0' }}>Name</div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
                    {voter.name}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#a7f3d0' }}>Father&apos;s Name</div>
                    <div style={{ fontWeight: 500, color: '#e2e8f0' }}>
                      {voter.father_name || '—'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#a7f3d0' }}>Mother&apos;s Name</div>
                    <div style={{ fontWeight: 500, color: '#e2e8f0' }}>
                      {voter.mother_name || '—'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.4rem' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#a7f3d0' }}>Date of Birth</div>
                    <div style={{ fontWeight: 600, color: '#fbbf24' }}>
                      {voter.date_of_birth || '—'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#a7f3d0' }}>Gender</div>
                    <div style={{ fontWeight: 500, textTransform: 'capitalize', color: '#e2e8f0' }}>
                      {voter.gender}
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.45)',
                  padding: '0.45rem 0.75rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)',
                }}>
                  <div style={{ fontSize: '0.65rem', color: '#a7f3d0', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    National ID No (NID)
                  </div>
                  <div className="font-mono" style={{
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    letterSpacing: '0.1em',
                    color: '#34d399',
                  }}>
                    {voter.voter_id}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom: Address & Electoral Area Info */}
            <div style={{
              marginTop: '0.85rem',
              paddingTop: '0.65rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '0.75rem',
              color: '#cbd5e1',
            }}>
              <div>
                <strong style={{ color: '#a7f3d0' }}>Address: </strong>
                {voter.address}
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.5rem',
                marginTop: '0.35rem',
                fontSize: '0.7rem',
                color: '#94a3b8',
              }}>
                <span>Voter Area: {voter.voter_area || '—'} (Code: {voter.voter_area_code || '—'})</span>
                <span>Ward No: {voter.ward_number || '—'} | SL No: #{voter.serial_no}</span>
              </div>
            </div>

            {/* Simulated Barcode at bottom */}
            <div style={{
              marginTop: '0.65rem',
              background: '#ffffff',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '2px',
              height: '24px',
              overflow: 'hidden',
            }}>
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: (i % 3 === 0 ? '3px' : i % 2 === 0 ? '1px' : '2px'),
                    height: '100%',
                    backgroundColor: '#000000',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
