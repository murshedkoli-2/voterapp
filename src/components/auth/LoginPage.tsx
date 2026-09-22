'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    const result = await login(username, password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.message || 'Login failed. Please check your credentials.');
    }
  };

  const fillDemoCredentials = () => {
    setUsername('admin');
    setPassword('admin123');
    setErrorMessage('');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
    }}>
      {/* Subtle ambient accents */}
      <div style={{
        position: 'absolute',
        top: '-12%',
        left: '10%',
        width: '520px',
        height: '520px',
        background: 'radial-gradient(circle, rgba(5, 150, 105, 0.08) 0%, rgba(248, 250, 252, 0) 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-12%',
        right: '10%',
        width: '520px',
        height: '520px',
        background: 'radial-gradient(circle, rgba(37, 99, 235, 0.06) 0%, rgba(248, 250, 252, 0) 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Branding */}
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            margin: '0 auto 1rem',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(5, 150, 105, 0.28)',
          }}>
            <ShieldCheck size={32} color="#ffffff" />
          </div>

          <span style={{
            background: 'var(--status-active-bg)',
            color: 'var(--primary-700)',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '0.2rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--status-active-border)',
            display: 'inline-block',
            marginBottom: '0.5rem',
          }}>
            Bangladesh Election Commission
          </span>

          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
          }}>
            Voter Information Management
          </h2>
          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            marginTop: '0.35rem',
          }}>
            Sign in with your administrative credentials
          </p>
        </div>

        {/* Login Card */}
        <div className="card" style={{
          padding: '1.75rem',
          boxShadow: '0 12px 32px rgba(16, 24, 40, 0.08)',
        }}>
          {errorMessage && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--status-deceased-bg)',
              border: '1px solid var(--status-deceased-border)',
              color: 'var(--status-deceased-text)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.25rem',
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <User
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    color: 'var(--text-dim)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type="text"
                  className="form-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin"
                  style={{ paddingLeft: '2.8rem', height: '46px', fontSize: '0.95rem' }}
                  autoFocus
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock
                  size={18}
                  style={{
                    position: 'absolute',
                    left: '1rem',
                    color: 'var(--text-dim)',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{
                    paddingLeft: '2.8rem',
                    paddingRight: '2.8rem',
                    height: '46px',
                    fontSize: '0.95rem',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    display: 'flex',
                  }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
              style={{
                height: '48px',
                fontSize: '1rem',
                marginTop: '0.25rem',
                width: '100%',
              }}
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{
            marginTop: '1.5rem',
            padding: '0.9rem 1rem',
            background: 'var(--bg-card-hover)',
            borderRadius: 'var(--radius-md)',
            border: '1px dashed var(--border-strong)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Demo credentials
              </span>
              <button
                type="button"
                onClick={fillDemoCredentials}
                style={{
                  background: 'var(--status-active-bg)',
                  border: '1px solid var(--status-active-border)',
                  color: 'var(--primary-700)',
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'all 0.15s ease',
                }}
              >
                Autofill
              </button>
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <div>
                Username: <code style={{ color: 'var(--primary-700)', fontWeight: 600 }}>admin</code>
              </div>
              <div>
                Password: <code style={{ color: 'var(--primary-700)', fontWeight: 600 }}>admin123</code>
              </div>
            </div>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontSize: '0.75rem',
          color: 'var(--text-dim)',
        }}>
          <Shield size={14} color="var(--primary-500)" />
          <span>Secure access • Bangladesh National Election Commission</span>
        </div>
      </div>
    </div>
  );
};