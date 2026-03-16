import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';

/* ═══════════════════════════════════════════════════════════
   PATIENT REGISTER
   Left  → animated timeline flow that REACTS to form progress
   Right → same clean form as before (unchanged structure)
═══════════════════════════════════════════════════════════ */

/* ── Password strength ── */
const PasswordStrength = ({ password }) => {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score  = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-destructive', 'bg-yellow-500', 'bg-blue-500', 'bg-primary'];
  const txtCls = ['', 'text-destructive', 'text-yellow-500', 'text-blue-500', 'text-primary'];
  if (!password) return null;
  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="flex gap-1">
        {[1,2,3,4].map(i => (
          <div key={i} className={`h-1 flex-1 rounded transition-all duration-300 ${i <= score ? colors[score] : 'bg-border'}`}/>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground m-0">
        Strength: <span className={`font-semibold ${txtCls[score]}`}>{labels[score]}</span>
      </p>
    </div>
  );
};

/* ── Reusable input field (unchanged) ── */
const Field = ({ id, label, type = 'text', placeholder, value, onChange, icon }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
    <div className="relative">
      {icon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
          {icon}
        </span>
      )}
      <input
        id={id} type={type} placeholder={placeholder}
        value={value} onChange={onChange} required
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

/* ══════════════════════════════════════════
   LEFT PANEL TIMELINE STEPS DEFINITION
   Each step knows which form fields it tracks
══════════════════════════════════════════ */
const TIMELINE = [
  {
    key: 'identity',
    num: '01',
    title: 'Your Identity',
    desc: 'Enter your first and last name',
    fields: ['first_name', 'last_name'],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="7.5" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M2 13c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'contact',
    num: '02',
    title: 'Contact Info',
    desc: 'Your email address',
    fields: ['email'],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="3" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M1 5.5l6.5 4 6.5-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'password',
    num: '03',
    title: 'Secure Password',
    desc: 'Create a strong password',
    fields: ['password'],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="2" y="6" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
        <path d="M4.5 6V4.5a3 3 0 016 0V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="7.5" cy="10" r="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    key: 'confirm',
    num: '04',
    title: 'Confirm & Join',
    desc: 'Verify password and submit',
    fields: ['confirm_password'],
    icon: (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M2.5 7.5l3.5 3.5 6.5-6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

/* ── Timeline node on the left panel ── */
const TimelineNode = ({ step, done, active, isLast, formData, passwordsMatch }) => {
  /* Compute sub-detail text shown when active */
  const getActiveDetail = () => {
    if (step.key === 'identity') {
      const fn = formData.first_name.trim();
      const ln = formData.last_name.trim();
      if (fn && ln) return `${fn} ${ln}`;
      if (fn) return fn;
      return null;
    }
    if (step.key === 'contact') {
      return formData.email.trim() || null;
    }
    if (step.key === 'password') {
      if (!formData.password) return null;
      const checks = [
        formData.password.length >= 8,
        /[A-Z]/.test(formData.password),
        /[0-9]/.test(formData.password),
        /[^A-Za-z0-9]/.test(formData.password),
      ];
      const score = checks.filter(Boolean).length;
      return ['', 'Weak', 'Fair', 'Good', 'Strong'][score] + ' password';
    }
    if (step.key === 'confirm') {
      if (!formData.confirm_password) return null;
      return passwordsMatch ? 'Passwords match ✓' : 'Passwords do not match';
    }
    return null;
  };

  const detail = getActiveDetail();

  return (
    <div className="flex gap-4">
      {/* Left: dot + vertical line */}
      <div className="flex flex-col items-center w-8 shrink-0">
        {/* Dot */}
        <div className={[
          'relative w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-400',
          done
            ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.4)]'
            : active
              ? 'bg-primary/10 border-primary text-primary'
              : 'bg-background border-border text-muted-foreground',
        ].join(' ')}>
          {/* Ping ring when active */}
          {active && !done && (
            <span className="absolute inset-0 rounded-full border-2 border-primary"
              style={{ animation: 'tl-ring 1.6s ease-in-out infinite' }}/>
          )}
          {done
            ? <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            : step.icon
          }
        </div>

        {/* Vertical connector */}
        {!isLast && (
          <div className="w-0.5 flex-1 mt-1 bg-border rounded-full overflow-hidden relative" style={{ minHeight: '32px' }}>
            <div
              className="absolute top-0 left-0 w-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ height: done ? '100%' : '0%' }}
            />
          </div>
        )}
      </div>

      {/* Right: text content */}
      <div className={`flex-1 pb-7 ${isLast ? 'pb-0' : ''}`}>
        <div className="flex items-center gap-2 pt-1">
          <span className={[
            'text-[10px] font-black font-mono uppercase tracking-widest',
            done ? 'text-primary' : active ? 'text-foreground' : 'text-muted-foreground/40',
          ].join(' ')}>
            Step {step.num}
          </span>
          {done && (
            <span className="text-[9px] font-bold font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">
              Done
            </span>
          )}
          {active && !done && (
            <span className="text-[9px] font-bold font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted border border-border text-muted-foreground">
              In progress
            </span>
          )}
        </div>

        <p className={[
          'text-sm font-semibold m-0 mt-0.5 transition-colors duration-300',
          done ? 'text-foreground' : active ? 'text-foreground' : 'text-muted-foreground/50',
        ].join(' ')}>
          {step.title}
        </p>

        <p className={[
          'text-xs m-0 mt-0.5 transition-colors duration-300',
          done || active ? 'text-muted-foreground' : 'text-muted-foreground/30',
        ].join(' ')}>
          {step.desc}
        </p>

        {/* Live field preview */}
        {detail && (
          <div className={[
            'mt-2 text-[11px] font-medium px-2.5 py-1.5 rounded border inline-flex items-center gap-1.5',
            'transition-all duration-300',
            done
              ? 'bg-primary/8 border-primary/20 text-primary'
              : 'bg-muted border-border text-muted-foreground',
          ].join(' ')}>
            {done && (
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5l3 3 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
            <span className="truncate max-w-[180px]">{detail}</span>
          </div>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
const PatientRegister = () => {
  const navigate = useNavigate();
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', password: '', confirm_password: '',
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  /* Compute done/active per step */
  const stepState = TIMELINE.map(step => ({
    ...step,
    done: step.fields.every(f => formData[f]?.trim().length > 0),
  }));

  /* "Active" = first incomplete step */
  const firstIncompleteIdx = stepState.findIndex(s => !s.done);
  const activeKey = firstIncompleteIdx === -1 ? null : stepState[firstIncompleteIdx].key;

  const passwordsMatch = formData.password === formData.confirm_password && formData.confirm_password.length > 0;

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    try {
      const res  = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.first_name,
          last_name:  formData.last_name,
          email:      formData.email,
          password:   formData.password,
          role:       'patient',
        }),
      });
      const data = await res.json();
      if (res.ok) {
        navigate('/login/patient', { state: { message: 'Account created! Please sign in.' } });
      } else {
        setError(data.error || 'Registration failed.');
        setLoading(false);
      }
    } catch {
      setError('Connection error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden">
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes tl-ring {
          0%,100% { transform:scale(1);   opacity:0.6; }
          50%      { transform:scale(1.5); opacity:0; }
        }
        @keyframes ping-dot {
          0%,100% { transform:scale(1);   opacity:0.65; }
          50%      { transform:scale(2.2); opacity:0; }
        }
        .au1{animation:fadeUp 0.5s ease 0.05s both;}
        .au2{animation:fadeUp 0.5s ease 0.15s both;}
        .au3{animation:fadeUp 0.5s ease 0.25s both;}
        .au4{animation:fadeUp 0.5s ease 0.35s both;}
        .au5{animation:fadeUp 0.5s ease 0.45s both;}
      `}</style>

       <div className="gw-grid-bg" />
      <div className="gw-glow" />

      {/* ══════════════ LEFT — Live timeline panel ══════════════ */}
      <div className="hidden lg:flex flex-col justify-between w-[50%] min-h-screen px-12 py-10 border-r border-border bg-card relative overflow-hidden">

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
            backgroundSize: '28px 28px', opacity: 0.5,
          }}/>

        {/* Green glow top-left */}
        <div className="absolute -top-32 -left-32 pointer-events-none"
          style={{
            width: '560px', height: '480px',
            background: 'radial-gradient(ellipse at top left, hsl(var(--primary)/0.12) 0%, transparent 60%)',
          }}/>

        {/* Accent glow bottom-right */}
        <div className="absolute bottom-0 right-0 pointer-events-none"
          style={{
            width: '380px', height: '380px',
            background: 'radial-gradient(ellipse at bottom right, hsl(var(--primary)/0.06) 0%, transparent 65%)',
          }}/>

        {/* Logo */}
        <div className="relative z-10 au1">
          <Link to="/" className="no-underline inline-flex"><Logo size="sm"/></Link>
        </div>

        {/* Centre */}
        <div className="relative z-10 flex flex-col gap-10">

          {/* Headline */}
          <div className="flex flex-col gap-3 au2">
            <span className="inline-flex items-center gap-2 self-start px-3 py-1 rounded bg-primary/10 border border-primary/20 text-[10px] font-bold font-mono uppercase tracking-widest text-primary">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inset-0 rounded-full bg-primary opacity-70"
                  style={{ animation: 'ping-dot 1.6s ease-in-out infinite' }}/>
                <span className="relative block w-1.5 h-1.5 rounded-full bg-primary"/>
              </span>
              New Patient Registration
            </span>
            <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight m-0">
              Join the future<br/>
              <span className="text-primary">of your health.</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs m-0">
              Complete each step on the right — watch your progress light up here in real time.
            </p>
          </div>

          {/* ── LIVE TIMELINE ── */}
          <div className="au3 flex flex-col">
            {TIMELINE.map((step, idx) => (
              <TimelineNode
                key={step.key}
                step={step}
                done={stepState[idx].done}
                active={activeKey === step.key}
                isLast={idx === TIMELINE.length - 1}
                formData={formData}
                passwordsMatch={passwordsMatch}
              />
            ))}
          </div>

          {/* Progress summary bar */}
          <div className="au4 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-muted-foreground/60 uppercase tracking-widest">Overall Progress</span>
              <span className="font-bold text-primary">
                {stepState.filter(s => s.done).length} / {TIMELINE.length} steps
              </span>
            </div>
            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(stepState.filter(s => s.done).length / TIMELINE.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Bottom compliance */}
        <div className="relative z-10 flex items-center gap-5 au5">
          {['HIPAA', 'GDPR', 'SOC 2', 'ISO 27001'].map(b => (
            <span key={b} className="text-[10px] font-mono font-semibold text-muted-foreground/45 uppercase tracking-widest">{b}</span>
          ))}
        </div>
      </div>

      {/* ══════════════ RIGHT — Register form (unchanged) ══════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8 au1">
          <Link to="/" className="no-underline"><Logo size="md"/></Link>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-8">

          {/* Heading */}
          <div className="flex flex-col items-center justify-center lg:items-start lg:justify-start gap-1 au1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground m-0">
              Create your account
            </h1>
            <p className="text-sm text-muted-foreground m-0">
              Register for your Patient Portal
            </p>
          </div>

          {/* Card */}
          <div className="au2 rounded border border-border bg-card p-7 flex flex-col gap-5 shadow-sm">

            {/* Error */}
            {error && (
              <div className="px-4 py-2.5 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="flex flex-col gap-4">

              {/* Name row */}
              <div className="grid grid-cols-2 gap-3">
                <Field id="first_name" label="First Name" placeholder="John"
                  value={formData.first_name} onChange={handleChange}/>
                <Field id="last_name" label="Last Name" placeholder="Doe"
                  value={formData.last_name} onChange={handleChange}/>
              </div>

              {/* Email */}
              <Field id="email" label="Email Address" type="email" placeholder="name@example.com"
                value={formData.email} onChange={handleChange}
                icon={
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                    <rect x="1" y="3" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M1 5l6.5 4.5L14 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                }
              />

              {/* Password */}
              <div className="flex flex-col gap-1">
                <Field id="password" label="Password" type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters"
                  value={formData.password} onChange={handleChange}
                  icon={
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <rect x="2" y="6" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M4.5 6V4.5a3 3 0 016 0V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <circle cx="7.5" cy="10" r="1" fill="currentColor"/>
                    </svg>
                  }
                />
                <PasswordStrength password={formData.password}/>
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-1">
                <Field id="confirm_password" label="Confirm Password" type={showPass ? 'text' : 'password'} placeholder="Re-enter password"
                  value={formData.confirm_password} onChange={handleChange}
                  icon={
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <rect x="2" y="6" width="11" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3"/>
                      <path d="M4.5 6V4.5a3 3 0 016 0V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                      <path d="M5 10l2 2 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  }
                />
                {formData.confirm_password && (
                  <p className={`text-[11px] m-0 mt-1 font-semibold ${passwordsMatch ? 'text-primary' : 'text-destructive'}`}>
                    {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              {/* Show password toggle */}
              <button type="button" onClick={() => setShowPass(p => !p)}
                className="self-start flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  {showPass
                    ? <><path d="M1 6.5C2.5 3.5 4.5 2 6.5 2s4 1.5 5.5 4.5c-1.5 3-3.5 4.5-5.5 4.5S2.5 9.5 1 6.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 2l9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></>
                    : <><path d="M1 6.5C2.5 3.5 4.5 2 6.5 2s4 1.5 5.5 4.5c-1.5 3-3.5 4.5-5.5 4.5S2.5 9.5 1 6.5z" stroke="currentColor" strokeWidth="1.2"/><circle cx="6.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.2"/></>
                  }
                </svg>
                {showPass ? 'Hide passwords' : 'Show passwords'}
              </button>

              {/* Terms notice */}
              <p className="text-[11px] text-muted-foreground/60 leading-relaxed m-0">
                By registering you agree to our{' '}
                <Link to="/terms" className="text-primary no-underline hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary no-underline hover:underline">Privacy Policy</Link>.
              </p>

              {/* Submit */}
              <button type="submit" disabled={loading}
                className="w-full h-11 rounded flex items-center justify-center gap-2 text-sm font-semibold bg-primary text-primary-foreground border border-primary hover:bg-primary/90 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.2)] cursor-pointer">
                {loading ? (
                  <>
                    <svg className="animate-spin" width="15" height="15" viewBox="0 0 15 15" fill="none">
                      <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.5" strokeDasharray="28" strokeDashoffset="10"/>
                    </svg>
                    Creating Account…
                  </>
                ) : (
                  <>
                    Create Account
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Sign in link */}
          <p className="au3 text-center text-sm text-muted-foreground m-0">
            Already have an account?{' '}
            <Link to="/login/patient" className="text-primary font-semibold no-underline hover:underline">Sign in here</Link>
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

export default PatientRegister;