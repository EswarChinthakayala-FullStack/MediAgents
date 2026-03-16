import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';

/* ═══════════════════════════════════════════════════════════
   PATIENT LOGIN  — two-column layout
   Left:  brand panel (features + trust signals)
   Right: login card
   Theme: pure Tailwind + shadcn CSS vars, no hardcoded hex
═══════════════════════════════════════════════════════════ */

/* ── Tiny input wrapper ── */
const Field = ({ id, label, type = 'text', placeholder, value, onChange, icon, extra }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
      {extra}
    </div>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {icon}
        </span>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className={[
          'w-full h-11 text-sm bg-background text-foreground',
          'border border-border rounded',
          'placeholder:text-muted-foreground/50',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60',
          'transition-all duration-150',
          icon ? 'pl-10 pr-4' : 'px-4',
        ].join(' ')}
      />
    </div>
  </div>
);

/* ── Left panel feature item ── */
const Feature = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4">
    <div className="w-9 h-9 rounded flex items-center justify-center bg-primary/10 border border-primary/20 text-primary shrink-0 mt-0.5">
      {icon}
    </div>
    <div>
      <p className="text-sm font-semibold text-foreground m-0 leading-tight">{title}</p>
      <p className="text-xs text-muted-foreground m-0 mt-1 leading-relaxed">{desc}</p>
    </div>
  </div>
);

/* ── Stat chip ── */
const Stat = ({ val, lab }) => (
  <div className="flex flex-col items-center px-4 py-3 rounded border border-border bg-background/50">
    <span className="text-xl font-black text-primary leading-none tracking-tight">{val}</span>
    <span className="text-[10px] font-semibold text-muted-foreground mt-1 uppercase tracking-wide">{lab}</span>
  </div>
);

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
const PatientLogin = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login } = useAuth();

  const [loading,    setLoading]    = useState(false);
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [error,      setError]      = useState('');
  const [successMsg]                = useState(location.state?.message || '');
  const [showPass,   setShowPass]   = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.success) {
      navigate('/portal');
    } else {
      setError(result.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .au1 { animation: fadeUp 0.5s ease 0.05s both; }
        .au2 { animation: fadeUp 0.5s ease 0.15s both; }
        .au3 { animation: fadeUp 0.5s ease 0.25s both; }
        .au4 { animation: fadeUp 0.5s ease 0.35s both; }
        .au5 { animation: fadeUp 0.5s ease 0.45s both; }
        .au6 { animation: fadeUp 0.5s ease 0.55s both; }

        @keyframes ping-dot {
          0%,100% { transform: scale(1);   opacity: 0.65; }
          50%      { transform: scale(2.2); opacity: 0;    }
        }
      `}</style>
      <div className="gw-grid-bg" />
      <div className="gw-glow" />
      {/* ════════════════ LEFT — Brand panel ════════════════ */}
      <div className="
        hidden lg:flex flex-col justify-between
        w-[52%] min-h-screen
        px-14 py-12
        border-r border-border
        bg-card
        relative overflow-hidden
      ">
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.5,
          }}
        />
        {/* Green top glow */}
        <div
          className="absolute -top-24 -left-24 pointer-events-none"
          style={{
            width: '500px', height: '400px',
            background: 'radial-gradient(ellipse at top left, hsl(var(--primary)/0.10) 0%, transparent 65%)',
          }}
        />

        {/* Top: Logo */}
        <div className="relative z-10 au1">
          <Link to="/" className="no-underline inline-flex">
            <Logo size="sm" />
          </Link>
        </div>

        {/* Middle: Hero copy */}
        <div className="relative z-10 flex flex-col gap-10">
          <div className="flex flex-col gap-4 au2">
            <span className="inline-flex items-center gap-2 self-start px-3 py-1 rounded bg-primary/10 border border-primary/20 text-[10px] font-bold font-mono uppercase tracking-widest text-primary">
              Patient Portal
            </span>
            <h2 className="text-4xl font-black tracking-tight text-foreground leading-tight m-0">
              Your health,<br/>
              <span className="text-primary">always in reach.</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm m-0">
              Access your complete medical records, upcoming appointments, lab results,
              and direct messaging with your care team — all in one secure place.
            </p>
          </div>

          {/* Feature list */}
          <div className="flex flex-col gap-5 au3">
            <Feature
              title="Real-time Health Records"
              desc="View diagnoses, prescriptions, vitals history, and lab results updated instantly by your care team."
              icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="1" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M5 5h6M5 8h6M5 11h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              }
            />
            <Feature
              title="Smart Appointment Booking"
              desc="Schedule, reschedule, or cancel appointments with any specialist in your network in seconds."
              icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="3" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  <circle cx="8" cy="11" r="1" fill="currentColor"/>
                </svg>
              }
            />
            <Feature
              title="Secure Messaging"
              desc="Send and receive end-to-end encrypted messages directly with your doctors and nursing staff."
              icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 3h12v8H9l-3 2V11H2V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
                  <path d="M5 7h6M5 5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                </svg>
              }
            />
            <Feature
              title="AI-Powered Insights"
              desc="12 specialized agents continuously analyze your data to surface early warnings and personalised care tips."
              icon={
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3"/>
                  <path d="M5 9l2-4 2 3 1.5-2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            />
          </div>

         
        </div>

        {/* Bottom: compliance strip */}
        <div className="relative z-10 flex items-center gap-4 au5">
          {['HIPAA', 'GDPR', 'SOC 2', 'ISO 27001'].map((b, i) => (
            <span key={i} className="text-[10px] font-mono font-semibold text-muted-foreground/50 uppercase tracking-widest">{b}</span>
          ))}
        </div>
      </div>

      {/* ════════════════ RIGHT — Login card ════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 au1">
          <Link to="/" className="no-underline">
            <Logo size="md" />
          </Link>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-8">

          {/* Heading */}
          <div className="flex flex-col items-center justify-center lg:items-start lg:justify-start gap-1 au1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground m-0">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground m-0">
              Sign in to your Patient Portal
            </p>
          </div>

          {/* Card */}
          <div className="au2 rounded border border-border bg-card p-7 flex flex-col gap-6 shadow-sm">

            {/* Success message */}
            {successMsg && (
              <div className="px-4 py-2.5 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-semibold text-center">
                {successMsg}
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="px-4 py-2.5 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold text-center">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <Field
                id="email"
                label="Email or Health ID"
                type="text"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M2 13c0-3 2.4-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                }
              />

              <Field
                id="password"
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                extra={
                  <Link to="#" className="text-xs text-primary no-underline hover:underline font-medium">
                    Forgot password?
                  </Link>
                }
                icon={
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <rect x="2" y="6" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M4.5 6V4.5a3 3 0 016 0V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                    <circle cx="7.5" cy="10" r="1" fill="currentColor"/>
                  </svg>
                }
              />

              {/* Show password toggle */}
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                className="self-start flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  {showPass
                    ? <><path d="M1 6.5C2.5 3.5 4.5 2 6.5 2s4 1.5 5.5 4.5c-1.5 3-3.5 4.5-5.5 4.5S2.5 9.5 1 6.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 2l9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></>
                    : <><path d="M1 6.5C2.5 3.5 4.5 2 6.5 2s4 1.5 5.5 4.5c-1.5 3-3.5 4.5-5.5 4.5S2.5 9.5 1 6.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/></>
                  }
                </svg>
                {showPass ? 'Hide password' : 'Show password'}
              </button>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  mt-1 w-full h-11 rounded
                  flex items-center justify-center gap-2
                  text-sm font-semibold
                  bg-primary text-primary-foreground border border-primary
                  hover:bg-primary/90 transition-all duration-200
                  disabled:opacity-60 disabled:cursor-not-allowed
                  hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]
                  cursor-pointer
                "
              >
                {loading ? (
                  <>
                    <svg className="animate-spin" width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10"/>
                    </svg>
                    Authenticating…
                  </>
                ) : (
                  <>
                    Sign In to Portal
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Register link */}
          <p className="au3 text-center text-sm text-muted-foreground m-0">
            Don't have an account?{' '}
            <Link to="/register/patient" className="text-primary font-semibold no-underline hover:underline">
              Register here
            </Link>
          </p>

          {/* Back to gateway */}
          <p className="au4 text-center m-0">
            <Link to="/login" className="text-xs text-muted-foreground/50 no-underline hover:text-primary transition-colors font-mono">
              ← Back to portal selection
            </Link>
          </p>

          {/* Copyright */}
          <div className="au5 flex items-center justify-center gap-3 text-[11px] text-muted-foreground/30 font-mono flex-wrap">
            <span>© {new Date().getFullYear()} ClinicAI</span>
            <span>·</span>
            <Link to="/privacy" className="no-underline text-muted-foreground/30 hover:text-primary transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link to="/terms" className="no-underline text-muted-foreground/30 hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;