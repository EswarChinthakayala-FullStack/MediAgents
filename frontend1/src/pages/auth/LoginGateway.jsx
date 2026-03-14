import React from 'react';
import { Link } from 'react-router-dom';

const LoginGateway = () => {
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }} className="gw-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500&family=DM+Sans:wght@400;500;600&display=swap');

        body { background: #0a0a0a; }

        .gw-root {
          min-height: 100vh;
          background: #0a0a0a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
          position: relative;
          overflow: hidden;
        }

        .gw-grid-bg {
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }

        .gw-glow {
          position: fixed;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 350px;
          background: radial-gradient(ellipse, rgba(62,207,142,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .gw-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 860px;
        }

        .gw-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .gw-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 24px;
        }

        .gw-logo-text {
          font-family: 'Geist Mono', monospace;
          font-size: 18px;
          font-weight: 500;
          color: #fff;
          letter-spacing: -0.3px;
        }

        .gw-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(62,207,142,0.08);
          border: 0.5px solid rgba(62,207,142,0.25);
          border-radius: 100px;
          padding: 4px 12px;
          font-size: 12px;
          color: #3ecf8e;
          margin-bottom: 16px;
          font-family: 'Geist Mono', monospace;
        }

        .gw-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3ecf8e;
        }

        .gw-title {
          font-size: 28px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 8px;
          letter-spacing: -0.5px;
        }

        .gw-subtitle {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .gw-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          width: 100%;
          max-width: 780px;
        }

        @media (max-width: 640px) {
          .gw-grid { grid-template-columns: 1fr; }
        }

        .gw-card {
          background: #111;
          border: 0.5px solid #1f1f1f;
          border-radius: 10px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.15s, background 0.15s;
          text-decoration: none;
        }

        .gw-card:hover {
          border-color: #2a2a2a;
          background: #161616;
        }

        .gw-card.featured {
          border-color: rgba(62,207,142,0.3);
          background: rgba(62,207,142,0.04);
        }

        .gw-card.featured:hover {
          border-color: rgba(62,207,142,0.5);
          background: rgba(62,207,142,0.07);
        }

        .gw-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .gw-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: #1a1a1a;
          border: 0.5px solid #2a2a2a;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gw-icon-wrap.green {
          background: rgba(62,207,142,0.1);
          border-color: rgba(62,207,142,0.2);
        }

        .gw-arrow {
          opacity: 0;
          transition: opacity 0.15s, transform 0.15s;
          color: #444;
          font-size: 14px;
        }

        .gw-card:hover .gw-arrow { opacity: 1; transform: translate(2px, -2px); }

        .gw-card-label {
          font-size: 10px;
          font-family: 'Geist Mono', monospace;
          color: #444;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 6px;
        }

        .gw-card-label.green { color: #3ecf8e; }

        .gw-card-title {
          font-size: 15px;
          font-weight: 500;
          color: #e5e5e5;
          margin: 0 0 6px;
        }

        .gw-card-desc {
          font-size: 13px;
          color: #555;
          margin: 0;
          line-height: 1.6;
        }

        .gw-btn {
          width: 100%;
          padding: 9px 16px;
          border-radius: 7px;
          font-size: 13px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          border: 0.5px solid #2a2a2a;
          background: #1a1a1a;
          color: #ccc;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }

        .gw-btn:hover { background: #222; color: #fff; border-color: #333; }

        .gw-btn.primary {
          background: #3ecf8e;
          border-color: #3ecf8e;
          color: #0a2d1f;
          font-weight: 600;
        }

        .gw-btn.primary:hover { background: #4fd9a0; border-color: #4fd9a0; }

        .gw-featured-pill {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(62,207,142,0.12);
          border: 0.5px solid rgba(62,207,142,0.2);
          border-radius: 100px;
          padding: 2px 8px;
          font-size: 10px;
          font-family: 'Geist Mono', monospace;
          color: #3ecf8e;
        }

        .gw-footer {
          margin-top: 32px;
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .gw-footer-item {
          font-size: 11px;
          font-family: 'Geist Mono', monospace;
          color: #333;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .gw-footer-link {
          font-size: 11px;
          font-family: 'Geist Mono', monospace;
          color: #333;
          text-decoration: none;
          transition: color 0.15s;
        }

        .gw-footer-link:hover { color: #3ecf8e; }

        .gw-divider { width: 1px; height: 12px; background: #222; }
      `}</style>

      <div className="gw-grid-bg" />
      <div className="gw-glow" />

      <div className="gw-content">
        {/* Header */}
        <div className="gw-header">
          <div className="gw-logo">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#111" stroke="#2a2a2a" strokeWidth="0.5"/>
              <path d="M9 20L16 8L23 20H9Z" fill="none" stroke="#3ecf8e" strokeWidth="1.5" strokeLinejoin="round"/>
              <circle cx="16" cy="20" r="3" fill="#3ecf8e" opacity="0.6"/>
            </svg>
            <span className="gw-logo-text">MedCore</span>
          </div>
          <div className="gw-badge">
            <div className="gw-badge-dot" />
            All systems operational
          </div>
          <h1 className="gw-title">Welcome back</h1>
          <p className="gw-subtitle">Choose your portal to continue</p>
        </div>

        {/* Cards */}
        <div className="gw-grid">

          {/* Patient */}
          <div className="gw-card">
            <div className="gw-card-top">
              <div className="gw-icon-wrap">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="2.5" stroke="#666" strokeWidth="1.2"/>
                  <path d="M3 13c0-2.8 2.2-5 5-5s5 2.2 5 5" stroke="#666" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="gw-arrow">↗</span>
            </div>
            <div>
              <div className="gw-card-label">Portal</div>
              <h3 className="gw-card-title">Patient</h3>
              <p className="gw-card-desc">View records, book appointments, and message your care team.</p>
            </div>
            <Link to="/login/patient">
              <button className="gw-btn">Sign in</button>
            </Link>
          </div>

          {/* Clinical */}
          <div className="gw-card featured">
            <div className="gw-featured-pill">Clinical</div>
            <div className="gw-card-top">
              <div className="gw-icon-wrap green">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="7" y="2" width="2" height="12" rx="1" fill="#3ecf8e"/>
                  <rect x="2" y="7" width="12" height="2" rx="1" fill="#3ecf8e"/>
                </svg>
              </div>
              <span className="gw-arrow" style={{ color: '#3ecf8e' }}>↗</span>
            </div>
            <div>
              <div className="gw-card-label green">SSO Enabled</div>
              <h3 className="gw-card-title">Clinical Station</h3>
              <p className="gw-card-desc">Diagnostic hub for doctors and nursing staff. Keycloak SSO.</p>
            </div>
            <Link to="/login/clinical">
              <button className="gw-btn primary">Sign in</button>
            </Link>
          </div>

          {/* Admin */}
          <div className="gw-card">
            <div className="gw-card-top">
              <div className="gw-icon-wrap">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="5" width="10" height="8" rx="1.5" stroke="#666" strokeWidth="1.2"/>
                  <path d="M5.5 5V4a2.5 2.5 0 015 0v1" stroke="#666" strokeWidth="1.2" strokeLinecap="round"/>
                  <circle cx="8" cy="9.5" r="1" fill="#666"/>
                </svg>
              </div>
              <span className="gw-arrow">↗</span>
            </div>
            <div>
              <div className="gw-card-label">Restricted</div>
              <h3 className="gw-card-title">Systems Admin</h3>
              <p className="gw-card-desc">Infrastructure, IAM realm management, and database governance.</p>
            </div>
            <Link to="/login/admin">
              <button className="gw-btn">Sign in</button>
            </Link>
          </div>

        </div>

        {/* Footer */}
        <div className="gw-footer">
          <div className="gw-footer-item">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1L1 3.5V6.5L5 9L9 6.5V3.5L5 1Z" stroke="#333" strokeWidth="1"/>
            </svg>
            HIPAA compliant
          </div>
          <div className="gw-divider" />
          <div className="gw-footer-item">CLINIC-HQ-GATEWAY-A</div>
          <div className="gw-divider" />
          <Link to="/" className="gw-footer-link">← Return home</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginGateway;