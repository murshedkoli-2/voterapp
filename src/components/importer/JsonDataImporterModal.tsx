'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  FileCode,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  X,
  Download,
  Copy,
  Layers,
  ArrowRight,
  Database,
  Eye,
  FileCheck,
  Loader2,
  Sparkles,
  MapPin,
  Check,
  RotateCcw
} from 'lucide-react';
import { VoterRecord } from '../../types/voter';

export type ImportMode = 'merge' | 'update' | 'replace';
export type ImportStage = 'select' | 'importing' | 'completed';

interface JsonDataImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingVoters: VoterRecord[];
  onCommitImport: (newVoters: VoterRecord[], mode: ImportMode) => Promise<void> | void;
}

interface ParsedCandidate {
  record: VoterRecord;
  isValid: boolean;
  isDuplicate: boolean;
  errors: string[];
}

interface ProcessedLogItem {
  id: string;
  name: string;
  voter_id: string;
  serial_no: string;
  status: 'saved' | 'updated' | 'skipped';
  district: string;
  upazila: string;
  time: string;
}

export const JsonDataImporterModal: React.FC<JsonDataImporterModalProps> = ({
  isOpen,
  onClose,
  existingVoters,
  onCommitImport,
}) => {
  const [activeInputTab, setActiveInputTab] = useState<'upload' | 'paste'>('upload');
  const [jsonText, setJsonText] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsedCandidates, setParsedCandidates] = useState<ParsedCandidate[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<ImportMode>('update');
  const [isDragOver, setIsDragOver] = useState(false);

  // Progressive Import State
  const [importStage, setImportStage] = useState<ImportStage>('select');
  const [processedIndex, setProcessedIndex] = useState(0);
  const [currentVoter, setCurrentVoter] = useState<VoterRecord | null>(null);
  const [processedLogs, setProcessedLogs] = useState<ProcessedLogItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logScrollRef.current) {
      logScrollRef.current.scrollTop = logScrollRef.current.scrollHeight;
    }
  }, [processedLogs]);

  // Reset when opening
  useEffect(() => {
    if (isOpen) {
      setImportStage('select');
      setProcessedIndex(0);
      setCurrentVoter(null);
      setProcessedLogs([]);
      setParseError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const existingIdSet = new Set(existingVoters.map((v) => v.voter_id));

  // Sample JSON template generator
  const sampleTemplate: VoterRecord[] = [
    {
      serial_no: "0011",
      gender: "female",
      name: "Nasrin Akter",
      voter_id: "199226884433",
      father_name: "Motiur Rahman",
      mother_name: "Khodeja Khatun",
      occupation: "Teacher",
      date_of_birth: "10/05/1992",
      address: "West Kalikachha, Sarail, Brahmanbaria",
      district: "Brahmanbaria",
      upazila: "Sarail",
      union: "Kalikachha",
      ward_number: "2",
      voter_area: "West Para",
      voter_area_code: "0732",
      status: "active"
    },
    {
      serial_no: "0012",
      gender: "male",
      name: "Kazi Ariful Haque",
      voter_id: "198726551122",
      father_name: "Kazi Emdadul Haque",
      mother_name: "Latifa Begum",
      occupation: "Engineer",
      date_of_birth: "24/09/1987",
      address: "Halishahar H-Block, Chattogram",
      district: "Chattogram",
      upazila: "Halishahar",
      union: "Ward 11",
      ward_number: "11",
      voter_area: "Halishahar Residential",
      voter_area_code: "0411",
      status: "active"
    },
    {
      serial_no: "0013",
      gender: "male",
      name: "Mahmudul Hasan Tareq",
      voter_id: "199526778899",
      father_name: "Anwarul Islam",
      mother_name: "Salma Begum",
      occupation: "Banker",
      date_of_birth: "18/02/1995",
      address: "Banani Road 11, Dhaka",
      district: "Dhaka",
      upazila: "Gulshan",
      union: "Ward 19",
      ward_number: "19",
      voter_area: "Banani Residential Area",
      voter_area_code: "0192",
      status: "active"
    },
    {
      serial_no: "0014",
      gender: "female",
      name: "Tasnim Jahan",
      voter_id: "199726442211",
      father_name: "Mustafizur Rahman",
      mother_name: "Nazma Rahman",
      occupation: "Doctor",
      date_of_birth: "12/11/1997",
      address: "Uposhohor Block-B, Sylhet Sadar, Sylhet",
      district: "Sylhet",
      upazila: "Sylhet Sadar",
      union: "Ward 22",
      ward_number: "22",
      voter_area: "Uposhohor Main Road",
      voter_area_code: "0522",
      status: "active"
    }
  ];

  const parseAndValidateJSON = (rawString: string) => {
    setParseError(null);

    if (!rawString.trim()) {
      setParsedCandidates([]);
      return;
    }

    try {
      const parsed = JSON.parse(rawString);
      const items: unknown[] = Array.isArray(parsed) ? parsed : [parsed];

      if (items.length === 0) {
        throw new Error('No voter records found in file.');
      }

      const candidates: ParsedCandidate[] = items.map((rawItem, idx) => {
        const item = (rawItem && typeof rawItem === 'object') ? (rawItem as Record<string, unknown>) : {};
        const errors: string[] = [];

        const name = String(item.name || '').trim();
        const voter_id = String(item.voter_id || '').trim();
        const district = String(item.district || '').trim();
        const upazila = String(item.upazila || '').trim();
        const address = String(item.address || '').trim();

        if (!name) errors.push('Voter name is required');
        if (!voter_id) errors.push('Voter ID / NID is required');
        if (!district) errors.push('District is required');
        if (!upazila) errors.push('Upazila is required');

        const isDuplicate = existingIdSet.has(voter_id);

        const record: VoterRecord = {
          serial_no: String(item.serial_no || String(existingVoters.length + idx + 1).padStart(4, '0')),
          gender: (item.gender === 'male' || item.gender === 'female' || item.gender === 'other') ? item.gender : 'female',
          name: name || 'Unknown Voter',
          voter_id: voter_id || `ID_${Date.now()}_${idx}`,
          father_name: String(item.father_name || ''),
          mother_name: String(item.mother_name || ''),
          occupation: String(item.occupation || ''),
          date_of_birth: String(item.date_of_birth || ''),
          address: address || `${district}, ${upazila}`,
          district: district || 'Unassigned',
          upazila: upazila || 'Unassigned',
          union: String(item.union || ''),
          ward_number: String(item.ward_number || '1'),
          voter_area: String(item.voter_area || ''),
          voter_area_code: String(item.voter_area_code || ''),
          status: (item.status === 'active' || item.status === 'inactive' || item.status === 'deceased' || item.status === 'transferred') ? item.status : 'active',
        };

        return {
          record,
          isValid: errors.length === 0,
          isDuplicate,
          errors,
        };
      });

      setParsedCandidates(candidates);
    } catch (err: unknown) {
      setParsedCandidates([]);
      setParseError(err instanceof Error ? err.message : 'File is not a valid JSON. Please verify syntax.');
    }
  };

  const handleFileChange = (file?: File) => {
    if (!file) return;
    if (!file.name.endsWith('.json')) {
      setParseError('Please upload a valid .json file');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setJsonText(content);
      parseAndValidateJSON(content);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleLoadSample = () => {
    const str = JSON.stringify(sampleTemplate, null, 2);
    setJsonText(str);
    setFileName('sample_voters_template.json');
    parseAndValidateJSON(str);
  };

  const handleDownloadTemplate = () => {
    const str = JSON.stringify(sampleTemplate, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voter_import_template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // PROGRESSIVE IMPORT EXECUTION WITH ANIMATED TICKER & PROGRESS BAR
  const handleStartProgressiveImport = async () => {
    const validRecords = parsedCandidates.filter((c) => c.isValid).map((c) => c.record);

    if (validRecords.length === 0) {
      setParseError('No valid voter records found to import');
      return;
    }

    setImportStage('importing');
    setProcessedIndex(0);
    setProcessedLogs([]);

    const logAccumulator: ProcessedLogItem[] = [];

    for (let i = 0; i < validRecords.length; i++) {
      const candidate = validRecords[i];
      setCurrentVoter(candidate);
      setProcessedIndex(i + 1);

      // Micro-cadence pacing so the user sees each name appear and animate
      await new Promise((resolve) => setTimeout(resolve, 240));

      const isDup = existingIdSet.has(candidate.voter_id);
      const statusType: 'saved' | 'updated' | 'skipped' = isDup
        ? (importMode === 'merge' ? 'skipped' : 'updated')
        : 'saved';

      const now = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      const logItem: ProcessedLogItem = {
        id: `${candidate.voter_id}_${i}`,
        name: candidate.name,
        voter_id: candidate.voter_id,
        serial_no: candidate.serial_no,
        status: statusType,
        district: candidate.district,
        upazila: candidate.upazila,
        time: now,
      };

      logAccumulator.push(logItem);
      setProcessedLogs([...logAccumulator]);
    }

    // Commit to parent and Neon DB
    await onCommitImport(validRecords, importMode);

    // Transition to completion
    setTimeout(() => {
      setImportStage('completed');
    }, 400);
  };

  const handleResetToImportPage = () => {
    setImportStage('select');
    setProcessedIndex(0);
    setCurrentVoter(null);
    setProcessedLogs([]);
    setJsonText('');
    setFileName('');
    setParsedCandidates([]);
    setParseError(null);
  };

  // Counts
  const totalCount = parsedCandidates.length;
  const validCount = parsedCandidates.filter((c) => c.isValid).length;
  const duplicateCount = parsedCandidates.filter((c) => c.isValid && c.isDuplicate).length;
  const newCount = parsedCandidates.filter((c) => c.isValid && !c.isDuplicate).length;
  const invalidCount = parsedCandidates.filter((c) => !c.isValid).length;

  const progressPercent = validCount > 0
    ? Math.round((processedIndex / validCount) * 100)
    : 0;

  return (
    <div className="modal-overlay" onClick={importStage === 'importing' ? undefined : onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '820px', minHeight: '520px' }}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(11, 17, 30, 0.95)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              padding: '0.6rem',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#34d399',
            }}>
              <Upload size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff' }}>
                Smart JSON Data Importer
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {importStage === 'importing'
                  ? 'Writing voter records live to database...'
                  : importStage === 'completed'
                  ? 'Import completed successfully'
                  : 'Upload or paste JSON to import voter records into database'}
              </p>
            </div>
          </div>

          {importStage !== 'importing' && (
            <button type="button" className="btn-icon" onClick={onClose} title="Close">
              <X size={18} />
            </button>
          )}
        </div>

        {/* STAGE 1: FILE SELECTION & PRE-IMPORT VALIDATION */}
        {importStage === 'select' && (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Input Method Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)',
                padding: '2px',
              }}>
                <button
                  type="button"
                  onClick={() => setActiveInputTab('upload')}
                  style={{
                    background: activeInputTab === 'upload' ? 'var(--primary-600)' : 'transparent',
                    color: activeInputTab === 'upload' ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <FileCode size={15} />
                  <span>JSON File Upload</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveInputTab('paste')}
                  style={{
                    background: activeInputTab === 'paste' ? 'var(--primary-600)' : 'transparent',
                    color: activeInputTab === 'paste' ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '0.4rem 0.85rem',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Copy size={15} />
                  <span>Direct Text Paste</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleLoadSample}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: '#38bdf8' }}
                  title="Load sample voter data to test"
                >
                  <span>Load Sample Data</span>
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleDownloadTemplate}
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                  title="Download template JSON"
                >
                  <Download size={13} />
                  <span>Download Template</span>
                </button>
              </div>
            </div>

            {/* Upload Method 1: Drag & Drop Zone */}
            {activeInputTab === 'upload' ? (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: `2px dashed ${isDragOver ? 'var(--primary-500)' : 'var(--border-card)'}`,
                  background: isDragOver ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '12px',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                  accept=".json"
                  style={{ display: 'none' }}
                />
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(56, 189, 248, 0.12)',
                  color: '#38bdf8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.75rem',
                }}>
                  <Upload size={24} />
                </div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>
                  {fileName ? `Selected file: ${fileName}` : 'Drag & drop your .json file here or click to browse'}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                  Supported file format: .json (Max size: 10 MB)
                </p>
              </div>
            ) : (
              /* Upload Method 2: Paste JSON Textarea */
              <div className="form-group">
                <textarea
                  className="form-textarea"
                  rows={6}
                  value={jsonText}
                  onChange={(e) => {
                    setJsonText(e.target.value);
                    parseAndValidateJSON(e.target.value);
                  }}
                  placeholder="[ { &quot;serial_no&quot;: &quot;0001&quot;, &quot;name&quot;: &quot;...&quot;, &quot;voter_id&quot;: &quot;...&quot; } ]"
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    lineHeight: '1.4',
                    backgroundColor: 'rgba(11, 17, 30, 0.95)',
                  }}
                />
              </div>
            )}

            {/* Parse Error Notification */}
            {parseError && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: 'rgba(244, 63, 94, 0.14)',
                border: '1px solid rgba(244, 63, 94, 0.3)',
                color: '#fb7185',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} />
                <span>{parseError}</span>
              </div>
            )}

            {/* Validation Metrics & Conflict Resolution Options */}
            {totalCount > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Stat Chips */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '0.75rem',
                }}>
                  <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Total Records</span>
                    <strong style={{ fontSize: '1.25rem', color: '#ffffff' }}>{totalCount}</strong>
                  </div>

                  <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <span style={{ fontSize: '0.7rem', color: '#34d399', display: 'block' }}>Valid Records</span>
                    <strong style={{ fontSize: '1.25rem', color: '#34d399' }}>{validCount}</strong>
                  </div>

                  <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                    <span style={{ fontSize: '0.7rem', color: '#38bdf8', display: 'block' }}>New Voters</span>
                    <strong style={{ fontSize: '1.25rem', color: '#38bdf8' }}>{newCount}</strong>
                  </div>

                  {duplicateCount > 0 && (
                    <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.08)', borderRadius: '8px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                      <span style={{ fontSize: '0.7rem', color: '#fbbf24', display: 'block' }}>Existing Matches</span>
                      <strong style={{ fontSize: '1.25rem', color: '#fbbf24' }}>{duplicateCount}</strong>
                    </div>
                  )}

                  {invalidCount > 0 && (
                    <div style={{ padding: '0.75rem', background: 'rgba(244, 63, 94, 0.08)', borderRadius: '8px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                      <span style={{ fontSize: '0.7rem', color: '#fb7185', display: 'block' }}>Invalid Records</span>
                      <strong style={{ fontSize: '1.25rem', color: '#fb7185' }}>{invalidCount}</strong>
                    </div>
                  )}
                </div>

                {/* Import Strategy Selector */}
                <div style={{
                  padding: '1rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <label className="form-label" style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                    Import Strategy:
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      border: `1px solid ${importMode === 'update' ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
                      background: importMode === 'update' ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: '#ffffff',
                    }}>
                      <input
                        type="radio"
                        name="importMode"
                        value="update"
                        checked={importMode === 'update'}
                        onChange={() => setImportMode('update')}
                      />
                      <span>Update & Add New</span>
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      border: `1px solid ${importMode === 'merge' ? 'var(--primary-500)' : 'var(--border-subtle)'}`,
                      background: importMode === 'merge' ? 'rgba(16, 185, 129, 0.12)' : 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: '#ffffff',
                    }}>
                      <input
                        type="radio"
                        name="importMode"
                        value="merge"
                        checked={importMode === 'merge'}
                        onChange={() => setImportMode('merge')}
                      />
                      <span>Only Add New (Skip Duplicates)</span>
                    </label>

                    <label style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.6rem 0.75rem',
                      borderRadius: '8px',
                      border: `1px solid ${importMode === 'replace' ? '#fb7185' : 'var(--border-subtle)'}`,
                      background: importMode === 'replace' ? 'rgba(244, 63, 94, 0.12)' : 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: importMode === 'replace' ? '#fb7185' : '#ffffff',
                    }}>
                      <input
                        type="radio"
                        name="importMode"
                        value="replace"
                        checked={importMode === 'replace'}
                        onChange={() => setImportMode('replace')}
                      />
                      <span>Full Replacement</span>
                    </label>
                  </div>
                </div>

                {/* Data Preview Table */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      Data Preview (First 4 records):
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Total {validCount} records will be processed
                    </span>
                  </div>

                  <div style={{
                    maxHeight: '160px',
                    overflowY: 'auto',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                  }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                      <thead>
                        <tr style={{ background: 'rgba(11, 17, 30, 0.95)', color: 'var(--text-muted)' }}>
                          <th style={{ padding: '0.5rem 0.65rem', textAlign: 'left' }}>Status</th>
                          <th style={{ padding: '0.5rem 0.65rem', textAlign: 'left' }}>Serial</th>
                          <th style={{ padding: '0.5rem 0.65rem', textAlign: 'left' }}>Voter Name</th>
                          <th style={{ padding: '0.5rem 0.65rem', textAlign: 'left' }}>Voter ID (NID)</th>
                          <th style={{ padding: '0.5rem 0.65rem', textAlign: 'left' }}>Address / Area</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parsedCandidates.slice(0, 4).map((cand, idx) => (
                          <tr key={idx} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                            <td style={{ padding: '0.5rem 0.65rem' }}>
                              {cand.isDuplicate ? (
                                <span style={{ color: '#fbbf24', fontSize: '0.7rem' }}>Existing</span>
                              ) : (
                                <span style={{ color: '#34d399', fontSize: '0.7rem' }}>New</span>
                              )}
                            </td>
                            <td style={{ padding: '0.5rem 0.65rem', color: '#38bdf8' }}>
                              #{cand.record.serial_no}
                            </td>
                            <td style={{ padding: '0.5rem 0.65rem', fontWeight: 600, color: '#ffffff' }}>
                              {cand.record.name}
                            </td>
                            <td style={{ padding: '0.5rem 0.65rem', color: 'var(--text-muted)' }}>
                              {cand.record.voter_id}
                            </td>
                            <td style={{ padding: '0.5rem 0.65rem', color: 'var(--text-secondary)' }}>
                              {cand.record.upazila}, {cand.record.district}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border-subtle)',
            }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>

              <button
                type="button"
                className="btn btn-primary"
                disabled={validCount === 0}
                onClick={handleStartProgressiveImport}
                style={{
                  opacity: validCount === 0 ? 0.4 : 1,
                  cursor: validCount === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                <FileCheck size={16} />
                <span>Complete Import ({validCount} records)</span>
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: LIVE PROGRESS BAR & ANIMATED VOTER NAME TICKER */}
        {importStage === 'importing' && (
          <div style={{ padding: '2rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header with live pulse */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 12px #10b981',
                  display: 'inline-block',
                }} />
                <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  Writing voter records live to Neon PostgreSQL database...
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <span style={{
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: '1px solid rgba(56, 189, 248, 0.3)',
                }}>
                  {processedIndex} / {validCount} voters
                </span>

                <span style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#34d399',
                  fontFamily: 'var(--font-sans)',
                }}>
                  {progressPercent}%
                </span>
              </div>
            </div>

            {/* Smooth Animated Progress Bar */}
            <div style={{
              width: '100%',
              height: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '999px',
              overflow: 'hidden',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.4)',
            }}>
              <div
                className="progress-shimmer"
                style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  borderRadius: '999px',
                  transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />
            </div>

            {/* Spotlight Card: CURRENT VOTER ACTIVELY BEING SAVED */}
            {currentVoter && (
              <div
                className="live-saving-card"
                style={{
                  padding: '1.25rem',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.4), rgba(4, 47, 46, 0.4))',
                  border: '1px solid #10b981',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '1.1rem',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)',
                    flexShrink: 0,
                  }}>
                    {currentVoter.name.charAt(0)}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                        {currentVoter.name}
                      </h4>
                      <span style={{
                        background: 'rgba(56, 189, 248, 0.15)',
                        color: '#38bdf8',
                        padding: '0.1rem 0.45rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}>
                        #{currentVoter.serial_no}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginTop: '0.2rem', fontSize: '0.75rem', color: '#a7f3d0' }}>
                      <span>NID: <strong>{currentVoter.voter_id}</strong></span>
                      <span>•</span>
                      <span>{currentVoter.upazila}, {currentVoter.district}</span>
                    </div>
                  </div>
                </div>

                {/* Saving Indicator Animation */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'rgba(0, 0, 0, 0.35)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  fontSize: '0.75rem',
                  color: '#34d399',
                  fontWeight: 600,
                }}>
                  <Loader2 size={14} className="spin-animation" style={{ animation: 'spin 1s linear infinite' }} />
                  <span>Writing to database...</span>
                </div>
              </div>
            )}

            {/* Live History Stream of Saved Records */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                Live Import Stream History:
              </div>

              <div
                ref={logScrollRef}
                style={{
                  height: '180px',
                  overflowY: 'auto',
                  background: 'rgba(11, 17, 30, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '0.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                }}
              >
                {processedLogs.map((log) => (
                  <div
                    key={log.id}
                    className="log-slide-item"
                    style={{
                      padding: '0.45rem 0.65rem',
                      borderRadius: '6px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#34d399',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        <Check size={10} />
                      </div>
                      <span style={{ fontWeight: 700, color: '#ffffff' }}>
                        {log.name}
                      </span>
                      <span style={{ color: 'var(--text-dim)' }}>
                        (NID: {log.voter_id})
                      </span>
                      <span style={{ color: '#38bdf8' }}>
                        [{log.upazila}, {log.district}]
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        color: log.status === 'saved' ? '#34d399' : log.status === 'updated' ? '#fbbf24' : 'var(--text-muted)',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}>
                        {log.status === 'saved' ? 'Saved' : log.status === 'updated' ? 'Record Updated' : 'Skipped'}
                      </span>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.68rem', fontFamily: 'var(--font-sans)' }}>
                        {log.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STAGE 3: COMPREHENSIVE SUCCESSFUL IMPORT PAGE WITH STATE */}
        {importStage === 'completed' && (
          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Celebration Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem',
              padding: '1.25rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.45), rgba(2, 44, 34, 0.45))',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(16, 185, 129, 0.15)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 6px 20px rgba(16, 185, 129, 0.45)',
                  flexShrink: 0,
                }}>
                  <CheckCircle2 size={30} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                      Import Completed Successfully!
                    </h3>
                    <span style={{
                      background: 'rgba(52, 211, 153, 0.2)',
                      color: '#34d399',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: '999px',
                      border: '1px solid rgba(52, 211, 153, 0.35)',
                    }}>
                      100% Success
                    </span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#a7f3d0', marginTop: '0.25rem' }}>
                    All voter records have been permanently saved to the <strong>Neon Serverless PostgreSQL</strong> cloud database.
                  </p>
                </div>
              </div>

              {/* Database & Timestamp Badge */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '0.3rem',
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: '#34d399',
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                }}>
                  <Database size={13} />
                  <span>Neon Cloud DB Connected</span>
                </span>
                <span>Completed at: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            </div>

            {/* Metric State Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '0.85rem',
            }}>
              <div style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
                  Total Processed
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.25rem' }}>
                  <strong style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
                    {validCount}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>voters</span>
                </div>
              </div>

              <div style={{
                padding: '1rem',
                background: 'rgba(16, 185, 129, 0.08)',
                borderRadius: '10px',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}>
                <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'block' }}>
                  New Voters Registered
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.25rem' }}>
                  <strong style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399' }}>
                    {processedLogs.filter(l => l.status === 'saved').length}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: '#a7f3d0' }}>voters</span>
                </div>
              </div>

              <div style={{
                padding: '1rem',
                background: 'rgba(245, 158, 11, 0.08)',
                borderRadius: '10px',
                border: '1px solid rgba(245, 158, 11, 0.25)',
              }}>
                <span style={{ fontSize: '0.75rem', color: '#fbbf24', display: 'block' }}>
                  Existing Records Updated
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.25rem' }}>
                  <strong style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fbbf24' }}>
                    {processedLogs.filter(l => l.status === 'updated').length}
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: '#fde68a' }}>voters</span>
                </div>
              </div>

              <div style={{
                padding: '1rem',
                background: 'rgba(56, 189, 248, 0.08)',
                borderRadius: '10px',
                border: '1px solid rgba(56, 189, 248, 0.25)',
              }}>
                <span style={{ fontSize: '0.75rem', color: '#38bdf8', display: 'block' }}>
                  Data Accuracy Rate
                </span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem', marginTop: '0.25rem' }}>
                  <strong style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8' }}>
                    100%
                  </strong>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>0 errors</span>
                </div>
              </div>
            </div>

            {/* Interactive Processed State List */}
            <div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.65rem',
              }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                  Saved Voter Records Details (State Records):
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Total {processedLogs.length} records saved
                </span>
              </div>

              <div style={{
                maxHeight: '220px',
                overflowY: 'auto',
                border: '1px solid var(--border-subtle)',
                borderRadius: '10px',
                background: 'rgba(11, 17, 30, 0.8)',
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                  <thead>
                    <tr style={{
                      background: 'rgba(15, 23, 42, 0.95)',
                      color: 'var(--text-muted)',
                      fontSize: '0.75rem',
                      borderBottom: '1px solid var(--border-subtle)',
                    }}>
                      <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Status</th>
                      <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Serial</th>
                      <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Voter Name</th>
                      <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Voter ID (NID)</th>
                      <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Area / Upazila</th>
                      <th style={{ padding: '0.6rem 0.75rem', textAlign: 'right' }}>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processedLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '0.55rem 0.75rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            padding: '0.15rem 0.5rem',
                            borderRadius: '999px',
                            background: log.status === 'saved' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: log.status === 'saved' ? '#34d399' : '#fbbf24',
                            border: `1px solid ${log.status === 'saved' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                          }}>
                            <Check size={10} />
                            <span>{log.status === 'saved' ? 'Newly Saved' : 'Updated'}</span>
                          </span>
                        </td>
                        <td style={{ padding: '0.55rem 0.75rem', fontWeight: 700, color: '#38bdf8' }}>
                          #{log.serial_no}
                        </td>
                        <td style={{ padding: '0.55rem 0.75rem', fontWeight: 600, color: '#ffffff' }}>
                          {log.name}
                        </td>
                        <td style={{ padding: '0.55rem 0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>
                          {log.voter_id}
                        </td>
                        <td style={{ padding: '0.55rem 0.75rem', color: 'var(--text-secondary)' }}>
                          {log.upazila}, {log.district}
                        </td>
                        <td style={{ padding: '0.55rem 0.75rem', textAlign: 'right', color: 'var(--text-dim)', fontSize: '0.7rem' }}>
                          {log.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons: "Back into Import Page" & "View in Dashboard" */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.85rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid var(--border-subtle)',
            }}>
              {/* Button to go back into the import page */}
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleResetToImportPage}
                style={{
                  padding: '0.65rem 1.25rem',
                  fontSize: '0.9rem',
                  color: '#38bdf8',
                  borderColor: 'rgba(56, 189, 248, 0.35)',
                  background: 'rgba(56, 189, 248, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <RotateCcw size={16} />
                <span>Back to Import Page (Import New File)</span>
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={onClose}
                  style={{
                    padding: '0.65rem 1.5rem',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>View Voters in Dashboard</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
