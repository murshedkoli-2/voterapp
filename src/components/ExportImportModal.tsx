'use client';

import React, { useState, useRef } from 'react';
import { X, Download, Upload, RefreshCw, FileText, Check, AlertCircle } from 'lucide-react';
import { VoterRecord } from '../types/voter';
import { toBengaliDigits } from '../utils/search';

interface ExportImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  voters: VoterRecord[];
  onImport: (importedVoters: VoterRecord[]) => void;
  onResetToDefault: () => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  onClose,
  voters,
  onImport,
  onResetToDefault,
}) => {
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Export JSON
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(voters, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `voters_ec_registry_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'serial_no',
      'gender',
      'name',
      'voter_id',
      'father_name',
      'mother_name',
      'occupation',
      'date_of_birth',
      'address',
      'district',
      'upazila',
      'union',
      'ward_number',
      'voter_area',
      'voter_area_code',
      'status'
    ];

    const escapeCsv = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;

    const rows = voters.map(v => headers.map(h => escapeCsv(((v as unknown) as Record<string, string>)[h] || '')).join(','));
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `voters_ec_registry_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Import JSON File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const list = Array.isArray(parsed) ? parsed : [parsed];

        // Validate basic structure
        const validList: VoterRecord[] = list.map((item: Record<string, unknown>, idx: number) => ({
          serial_no: String(item.serial_no || String(idx + 1).padStart(4, '0')),
          gender: (item.gender === 'male' || item.gender === 'female' || item.gender === 'other') ? item.gender : 'female',
          name: String(item.name || 'অজ্ঞাত'),
          voter_id: String(item.voter_id || `VOTE${Date.now()}`),
          father_name: String(item.father_name || ''),
          mother_name: String(item.mother_name || ''),
          occupation: String(item.occupation || ''),
          date_of_birth: String(item.date_of_birth || ''),
          address: String(item.address || ''),
          district: String(item.district || ''),
          upazila: String(item.upazila || ''),
          union: String(item.union || ''),
          ward_number: String(item.ward_number || '1'),
          voter_area: String(item.voter_area || ''),
          voter_area_code: String(item.voter_area_code || ''),
          status: (item.status === 'active' || item.status === 'inactive' || item.status === 'deceased' || item.status === 'transferred') ? item.status : 'active',
        }));

        if (validList.length === 0) {
          throw new Error('No valid voter records found in the uploaded file');
        }

        onImport(validList);
        setImportStatus({
          type: 'success',
          message: `Successfully imported ${validList.length} voter records!`,
        });
      } catch (err: unknown) {
        setImportStatus({
          type: 'error',
          message: err instanceof Error ? err.message : 'File is not in valid JSON format',
        });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '560px' }}
      >
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#ffffff' }}>
              Data Backup & Import / Export
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Voter registry backup, export, and dataset management
            </p>
          </div>
          <button type="button" className="btn-icon" onClick={onClose} title="Close">
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {importStatus && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              background: importStatus.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${importStatus.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
              color: importStatus.type === 'success' ? '#34d399' : '#fb7185',
            }}>
              {importStatus.type === 'success' ? <Check size={18} /> : <AlertCircle size={18} />}
              <span>{importStatus.message}</span>
            </div>
          )}

          {/* Export Section */}
          <div style={{
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
              Export Voter Data
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              Download currently stored {voters.length} voter records
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleExportJSON}
                style={{ flex: 1 }}
              >
                <Download size={16} />
                <span>Export as JSON</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleExportCSV}
                style={{ flex: 1 }}
              >
                <FileText size={16} />
                <span>Export as CSV</span>
              </button>
            </div>
          </div>

          {/* Import Section */}
          <div style={{
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '10px',
          }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.35rem' }}>
              Quick Import JSON
            </h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
              Upload a previously exported JSON voter file to merge
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
              style={{ width: '100%', borderColor: 'var(--primary-500)', color: '#34d399' }}
            >
              <Upload size={16} />
              <span>Choose JSON File</span>
            </button>
          </div>

          {/* Clear Registry */}
          <div style={{
            padding: '1rem',
            background: 'rgba(239, 68, 68, 0.04)',
            border: '1px solid rgba(239, 68, 68, 0.15)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}>
            <div>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>
                Clear All Voter Records
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Remove all registered voter records from database
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (confirm('Are you sure you want to remove all voter records from the database?')) {
                  onResetToDefault();
                  setImportStatus({ type: 'success', message: 'All voter records cleared from database' });
                }
              }}
              style={{ color: '#ef4444' }}
            >
              <RefreshCw size={14} />
              <span>Clear Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
