'use client';

import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle, User, MapPin, Users, Hash } from 'lucide-react';
import { VoterRecord, Gender, VoterStatus } from '../types/voter';

interface VoterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (voter: VoterRecord) => void;
  initialData?: VoterRecord | null;
  nextSerial?: string;
}

const DEFAULT_RECORD: VoterRecord = {
  serial_no: '',
  gender: 'female',
  name: '',
  voter_id: '',
  father_name: '',
  mother_name: '',
  occupation: '',
  date_of_birth: '',
  address: '',
  district: '',
  upazila: '',
  union: '',
  ward_number: '1',
  voter_area: '',
  voter_area_code: '',
  status: 'active',
};

export const VoterModal: React.FC<VoterModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  nextSerial = '0001',
}) => {
  const [formData, setFormData] = useState<VoterRecord>(DEFAULT_RECORD);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        ...DEFAULT_RECORD,
        serial_no: nextSerial,
      });
    }
    setErrors({});
  }, [initialData, nextSerial, isOpen]);

  if (!isOpen) return null;

  const isEdit = !!initialData;

  const handleChange = (field: keyof VoterRecord, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Voter name is required';
    if (!formData.voter_id.trim()) errs.voter_id = 'Voter ID / NID is required';
    if (!formData.district.trim()) errs.district = 'District is required';
    if (!formData.upazila.trim()) errs.upazila = 'Upazila is required';
    if (!formData.address.trim()) errs.address = 'Full address is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-surface)',
        }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {isEdit ? 'Edit Voter Record' : 'Register New Citizen Voter'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
              Provide accurate citizen electoral information in the form fields below
            </p>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          {/* Section 1: System Identifiers */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#34d399',
              marginBottom: '0.75rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.35rem',
            }}>
              <Hash size={16} />
              <span>Registry Identifiers & Status</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Serial No (SL) *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.serial_no}
                  onChange={(e) => handleChange('serial_no', e.target.value)}
                  placeholder="e.g. 0001"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Voter Status *</label>
                <select
                  className="form-select"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value as VoterStatus)}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="deceased">Deceased</option>
                  <option value="transferred">Transferred</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Gender *</label>
                <select
                  className="form-select"
                  value={formData.gender}
                  onChange={(e) => handleChange('gender', e.target.value as Gender)}
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 2: Personal Information */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#38bdf8',
              marginBottom: '0.75rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.35rem',
            }}>
              <User size={16} />
              <span>Personal Information</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: 'span 1' }}>
                <label className="form-label">Voter Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g. মোছাঃ দিলোয়ারা বেগম or Dilwara Begum"
                  style={{ borderColor: errors.name ? '#fb7185' : undefined }}
                />
                {errors.name && (
                  <span style={{ fontSize: '0.75rem', color: '#fb7185' }}>{errors.name}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Voter ID / NID *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.voter_id}
                  onChange={(e) => handleChange('voter_id', e.target.value)}
                  placeholder="e.g. 120734267301"
                  style={{ borderColor: errors.voter_id ? '#fb7185' : undefined }}
                />
                {errors.voter_id && (
                  <span style={{ fontSize: '0.75rem', color: '#fb7185' }}>{errors.voter_id}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Occupation</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.occupation}
                  onChange={(e) => handleChange('occupation', e.target.value)}
                  placeholder="e.g. Teacher, Engineer, Housewife..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Birth (DD/MM/YYYY)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.date_of_birth}
                  onChange={(e) => handleChange('date_of_birth', e.target.value)}
                  placeholder="DD/MM/YYYY (e.g. 12/08/1961)"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Family Information */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#c084fc',
              marginBottom: '0.75rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.35rem',
            }}>
              <Users size={16} />
              <span>Parents & Lineage</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Father&apos;s Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.father_name}
                  onChange={(e) => handleChange('father_name', e.target.value)}
                  placeholder="e.g. Mali Miah"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mother&apos;s Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.mother_name}
                  onChange={(e) => handleChange('mother_name', e.target.value)}
                  placeholder="e.g. Hasena Begum"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Address & Electoral Area Information */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              color: '#fbbf24',
              marginBottom: '0.75rem',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '0.35rem',
            }}>
              <MapPin size={16} />
              <span>Address & Electoral Area Information</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Full Address *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="e.g. Chaksar, Purba Para, Sarail, Brahmanbaria"
                  style={{ borderColor: errors.address ? '#fb7185' : undefined }}
                />
                {errors.address && (
                  <span style={{ fontSize: '0.75rem', color: '#fb7185' }}>{errors.address}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">District *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.district}
                  onChange={(e) => handleChange('district', e.target.value)}
                  placeholder="e.g. Brahmanbaria"
                  style={{ borderColor: errors.district ? '#fb7185' : undefined }}
                />
                {errors.district && (
                  <span style={{ fontSize: '0.75rem', color: '#fb7185' }}>{errors.district}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Upazila / Thana *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.upazila}
                  onChange={(e) => handleChange('upazila', e.target.value)}
                  placeholder="e.g. Sarail"
                  style={{ borderColor: errors.upazila ? '#fb7185' : undefined }}
                />
                {errors.upazila && (
                  <span style={{ fontSize: '0.75rem', color: '#fb7185' }}>{errors.upazila}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Union / Ward</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.union}
                  onChange={(e) => handleChange('union', e.target.value)}
                  placeholder="e.g. Kalikachha"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ward Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.ward_number}
                  onChange={(e) => handleChange('ward_number', e.target.value)}
                  placeholder="e.g. 3"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Voter Area</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.voter_area}
                  onChange={(e) => handleChange('voter_area', e.target.value)}
                  placeholder="e.g. Chaksar"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Voter Area Code</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.voter_area_code}
                  onChange={(e) => handleChange('voter_area_code', e.target.value)}
                  placeholder="e.g. 0734"
                />
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem',
            paddingTop: '1rem',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn btn-primary"
            >
              <Save size={16} />
              <span>{isEdit ? 'Update Voter Record' : 'Save Voter Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
