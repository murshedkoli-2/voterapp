'use client';

import React, { useRef, useState } from 'react';
import { Download, Upload, RefreshCw, FileText, Database, Check, AlertCircle, FileCode } from 'lucide-react';
import { VoterRecord } from '../../types/voter';

interface BackupViewProps {
  voters: VoterRecord[];
  onImport: (imported: VoterRecord[]) => void;
  onResetToDefault: () => void;
  onOpenImporter?: () => void;
}

export const BackupView: React.FC<BackupViewProps> = ({
  voters,
  onImport,
  onResetToDefault,
  onOpenImporter,
}) => {
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(voters, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `voter_registry_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMsg({ type: 'success', message: 'JSON backup file successfully downloaded.' });
  };

  const handleExportCSV = () => {
    const headers = [
      'serial_no', 'gender', 'name', 'voter_id', 'father_name', 'mother_name',
      'occupation', 'date_of_birth', 'address', 'district', 'upazila', 'union',
      'ward_number', 'voter_area', 'voter_area_code', 'status'
    ];
    const escapeCsv = (val: string) => `"${(val || '').replace(/"/g, '""')}"`;
    const rows = voters.map(v => headers.map(h => escapeCsv(((v as unknown) as Record<string, string>)[h] || '')).join(','));
    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `voter_registry_backup_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMsg({ type: 'success', message: 'CSV spreadsheet successfully downloaded.' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        const list = Array.isArray(parsed) ? parsed : [parsed];

        const validList: VoterRecord[] = list.map((item: Record<string, unknown>, idx: number) => ({
          serial_no: String(item.serial_no || String(idx + 1).padStart(4, '0')),
          gender: (item.gender === 'male' || item.gender === 'female' || item.gender === 'other') ? item.gender : 'female',
          name: String(item.name || 'Unknown Voter'),
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
        setStatusMsg({ type: 'success', message: `Successfully imported ${validList.length} voter records.` });
      } catch (err: unknown) {
        setStatusMsg({ type: 'error', message: err instanceof Error ? err.message : 'File is not in valid JSON format' });
      }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '840px', margin: '0 auto' }}>
      <div className="card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'var(--primary-green-light)',
            color: 'var(--primary-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Database size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Data Backup & Synchronization
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Maintain backups, export data, and manage records in the cloud database
            </p>
          </div>
        </div>

        {statusMsg && (
          <div style={{
            marginTop: '0.85rem',
            padding: '0.65rem 0.85rem',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.825rem',
            background: statusMsg.type === 'success' ? 'var(--primary-green-light)' : 'var(--danger-light)',
            border: `1px solid ${statusMsg.type === 'success' ? 'var(--status-active-border)' : '#fecaca'}`,
            color: statusMsg.type === 'success' ? 'var(--primary-green-dark)' : 'var(--danger)',
          }}>
            {statusMsg.type === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
            <span>{statusMsg.message}</span>
          </div>
        )}
      </div>

      {/* Grid of Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1rem' }}>
        {/* Export Card */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Export Voter Data
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Download currently stored {voters.length.toLocaleString()} voter records in standard formats.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExportJSON}
              style={{ justifyContent: 'center' }}
            >
              <Download size={15} />
              <span>Download JSON Backup</span>
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleExportCSV}
              style={{ justifyContent: 'center' }}
            >
              <FileText size={15} />
              <span>Download CSV Spreadsheet</span>
            </button>
          </div>
        </div>

        {/* Import Card */}
        <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Import Voter Data
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
              Upload external voter records to merge or update into the cloud database.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {onOpenImporter && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onOpenImporter}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                <Upload size={15} />
                <span>Open Smart JSON Importer</span>
              </button>
            )}
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
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <FileCode size={15} />
              <span>Direct File Select (.json)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone: Clear Registry */}
      <div className="card" style={{ padding: '1.15rem', border: '1px solid #fecaca', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--danger)' }}>
              Clear Voter Registry
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
              Completely empties all voters from database. Use with caution before importing new voter files.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              if (confirm('Are you sure you want to completely clear the voter registry? All current voters will be removed from database.')) {
                onResetToDefault();
                setStatusMsg({ type: 'success', message: 'Successfully cleared all voter records from database.' });
              }
            }}
          >
            <RefreshCw size={14} />
            <span>Clear Database</span>
          </button>
        </div>
      </div>
    </div>
  );
};
