import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';

/* ═══════════════════════════════════════════════════════════
   DOCTOR LOGIN — two-column layout
   Left:  brand panel (clinical features)
   Right: login card
   Theme: pure Tailwind + shadcn CSS vars
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

const DoctorLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg] = useState(location.state?.message || '');
    const [showPass, setShowPass] = useState(false);

    const handleLogin = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        const useKeycloak = e?.target?.useKeycloak || false;

        setLoading(true);
        setError('');
        const result = await login(email, password, useKeycloak);
        if (result.success) {
            navigate('/clinical');
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
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
                        backgroundSize: '28px 28px',
                        opacity: 0.5,
                    }}
                />
                <div
                    className="absolute -top-24 -left-24 pointer-events-none"
                    style={{
                        width: '500px', height: '400px',
                        background: 'radial-gradient(ellipse at top left, hsl(var(--primary)/0.10) 0%, transparent 65%)',
                    }}
                />

                <div className="relative z-10 au1">
                    <Link to="/" className="no-underline inline-flex">
                        <Logo size="sm" />
                    </Link>
                </div>

                <div className="relative z-10 flex flex-col gap-10">
                    <div className="flex flex-col gap-4 au2">
                        <span className="inline-flex items-center gap-2 self-start px-3 py-1 rounded bg-primary/10 border border-primary/20 text-[10px] font-bold font-mono uppercase tracking-widest text-primary">
                            Clinical Station
                        </span>
                        <h2 className="text-4xl font-black tracking-tight text-foreground leading-tight m-0">
                            Intelligence for the<br />
                            <span className="text-primary">Medical Council.</span>
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-sm m-0">
                            Secure access for physicians, nurses, and administrative staff to the
                            ClinicAI multi-agent clinical ecosystem.
                        </p>
                    </div>

                    <div className="flex flex-col gap-5 au3">
                        <Feature
                            title="Diagnostic Optimization"
                            desc="Real-time clinical reasoning support via the Diagnostic Oracle agent and FHIR-integrated data streams."
                            icon={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                </svg>
                            }
                        />
                        <Feature
                            title="Agent Fleet Orchestration"
                            desc="Coordinate triage, genomic, and vital monitoring agents across your patient directory from a single dashboard."
                            icon={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                                </svg>
                            }
                        />
                        <Feature
                            title="HIPAA-Compliant Auditing"
                            desc="Every clinical session is end-to-end encrypted and logged for compliance with global medical data standards."
                            icon={
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                            }
                        />
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-4 au5">
                    {['CLINICAL NODE A', 'SSL SECURE', 'E2E ENCRYPTED'].map((b, i) => (
                        <span key={i} className="text-[10px] font-mono font-semibold text-muted-foreground/50 uppercase tracking-widest">{b}</span>
                    ))}
                </div>
            </div>

            {/* ════════════════ RIGHT — Login card ════════════════ */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
                <div className="lg:hidden mb-8 au1">
                    <Link to="/" className="no-underline">
                        <Logo size="md" />
                    </Link>
                </div>

                <div className="w-full max-w-sm flex flex-col gap-8">
                    <div className="flex flex-col items-center justify-center lg:items-start lg:justify-start gap-1 au1">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground m-0">
                            Professional Sign In
                        </h1>
                        <p className="text-sm text-muted-foreground m-0">
                            Access the Clinical Command Center
                        </p>
                    </div>

                    <div className="au2 rounded border border-border bg-card p-7 flex flex-col gap-6 shadow-sm">
                        {successMsg && (
                            <div className="px-4 py-2.5 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-semibold text-center">
                                {successMsg}
                            </div>
                        )}
                        {error && (
                            <div className="px-4 py-2.5 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            <Field
                                id="email"
                                label="Staff Identifier"
                                type="text"
                                placeholder="doctor@clinic.ai"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                icon={
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                        <circle cx="12" cy="7" r="4" />
                                    </svg>
                                }
                            />

                            <Field
                                id="password"
                                label="Secure PIN / Password"
                                type={showPass ? 'text' : 'password'}
                                placeholder="••••••••"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                extra={
                                    <Link to="#" className="text-xs text-primary no-underline hover:underline font-medium">
                                        Forgot PIN?
                                    </Link>
                                }
                                icon={
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                        <path d="M7 11V7a5 5 0 0110 0v4" />
                                    </svg>
                                }
                            />

                            <button
                                type="button"
                                onClick={() => setShowPass(p => !p)}
                                className="self-start flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0"
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                    <circle cx="12" cy="12" r="3" />
                                </svg>
                                {showPass ? 'Hide password' : 'Show password'}
                            </button>

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
                                {loading ? "Establishing Secure Link…" : (
                                    <>
                                        Authenticate via Clinical Node
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M5 12h14M12 5l7 7-7 7" />
                                        </svg>
                                    </>
                                )}
                            </button>

                            <div className="relative my-2">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-border" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                                    <span className="bg-card px-2 text-muted-foreground">Or SSO</span>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleLogin({ preventDefault: () => { }, target: { useKeycloak: true } })}
                                disabled={loading}
                                className="
                                    w-full h-11 rounded
                                    flex items-center justify-center gap-2
                                    text-sm font-semibold
                                    bg-background text-foreground border border-border
                                    hover:bg-accent hover:border-primary/50 transition-all duration-200
                                    disabled:opacity-60 disabled:cursor-not-allowed
                                    cursor-pointer
                                "
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3y-3.5 3.5" />
                                </svg>
                                Sign in with Keycloak
                            </button>
                        </form>
                    </div>

                    <p className="au3 text-center text-sm text-muted-foreground m-0">
                        Not registered?{' '}
                        <Link to="/register/clinical" className="text-primary font-semibold no-underline hover:underline">
                            Apply for credentials
                        </Link>
                    </p>

                    <p className="au4 text-center m-0">
                        <Link to="/login" className="text-xs text-muted-foreground/50 no-underline hover:text-primary transition-colors font-mono">
                            ← Back to portal selection
                        </Link>
                    </p>

                    <div className="au5 flex items-center justify-center gap-3 text-[11px] text-muted-foreground/30 font-mono flex-wrap">
                        <span>© {new Date().getFullYear()} ClinicAI</span>
                        <span>·</span>
                        <span>HIPAA Compliant</span>
                        <span>·</span>
                        <span>Audit Log Enabled</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorLogin;
