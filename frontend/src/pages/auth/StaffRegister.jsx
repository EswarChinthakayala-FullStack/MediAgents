import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";

/* ═══════════════════════════════════════════════════════════
   STAFF REGISTER
   Left  → animated timeline flow that REACTS to form progress
   Right → registration form
   ═══════════════════════════════════════════════════════════ */

/* ── Password strength ── */
const PasswordStrength = ({ password }) => {
    const checks = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password),
    ];
    const score = checks.filter(Boolean).length;
    const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['', 'bg-destructive', 'bg-yellow-500', 'bg-blue-500', 'bg-primary'];
    const txtCls = ['', 'text-destructive', 'text-yellow-500', 'text-blue-500', 'text-primary'];
    if (!password) return null;
    return (
        <div className="flex flex-col gap-1 mt-1">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded transition-all duration-300 ${i <= score ? colors[score] : 'bg-border'}`} />
                ))}
            </div>
            <p className="text-[11px] text-muted-foreground m-0">
                Strength: <span className={`font-semibold ${txtCls[score]}`}>{labels[score]}</span>
            </p>
        </div>
    );
};

/* ── Reusable input field ── */
const Field = ({ id, label, type = 'text', placeholder, value, onChange, icon, children }) => (
    <div className="flex flex-col gap-1.5 text-left">
        <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
        <div className="relative">
            {icon && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                    {icon}
                </span>
            )}
            {children ? children : (
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
            )}
        </div>
    </div>
);

const TIMELINE = [
    {
        key: 'identity',
        num: '01',
        title: 'Professional Identity',
        desc: 'Your legal medical name',
        fields: ['first_name', 'last_name'],
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
    {
        key: 'credentials',
        num: '02',
        title: 'Work Credentials',
        desc: 'Email and clinical role',
        fields: ['email', 'role'],
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
        ),
    },
    {
        key: 'password',
        num: '03',
        title: 'Security Key',
        desc: 'Establish a root login',
        fields: ['password'],
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
        ),
    },
    {
        key: 'confirm',
        num: '04',
        title: 'Finalize Auth',
        desc: 'Submit for station access',
        fields: ['confirm_password'],
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
        ),
    },
];

const TimelineNode = ({ step, done, active, isLast, formData, passwordsMatch }) => {
    const getActiveDetail = () => {
        if (step.key === 'identity') {
            const fn = formData.first_name.trim();
            const ln = formData.last_name.trim();
            if (fn && ln) return `${fn} ${ln}`;
            return fn || null;
        }
        if (step.key === 'credentials') {
            return formData.email.trim() ? `${formData.email} (${formData.role})` : null;
        }
        if (step.key === 'password') {
            if (!formData.password) return null;
            const score = [formData.password.length >= 8, /[A-Z]/.test(formData.password), /[0-9]/.test(formData.password), /[^A-Za-z0-9]/.test(formData.password)].filter(Boolean).length;
            return ['', 'Weak', 'Fair', 'Good', 'Strong'][score] + ' security';
        }
        if (step.key === 'confirm') {
            return formData.confirm_password ? (passwordsMatch ? 'Keys match ✓' : 'Keys mismatch') : null;
        }
        return null;
    };

    const detail = getActiveDetail();

    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center w-8 shrink-0">
                <div className={[
                    'relative w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-400',
                    done ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_12px_hsl(var(--primary)/0.4)]' : active ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border text-muted-foreground',
                ].join(' ')}>
                    {active && !done && (
                        <span className="absolute inset-0 rounded-full border-2 border-primary" style={{ animation: 'tl-ring 1.6s ease-in-out infinite' }} />
                    )}
                    {done ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> : step.icon}
                </div>
                {!isLast && (
                    <div className="w-0.5 flex-1 mt-1 bg-border rounded-full overflow-hidden relative" style={{ minHeight: '32px' }}>
                        <div className="absolute top-0 left-0 w-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ height: done ? '100%' : '0%' }} />
                    </div>
                )}
            </div>
            <div className={`flex-1 pb-7 ${isLast ? 'pb-0' : ''}`}>
                <div className="flex items-center gap-2 pt-1">
                    <span className={['text-[10px] font-black font-mono uppercase tracking-widest', done ? 'text-primary' : active ? 'text-foreground' : 'text-muted-foreground/40'].join(' ')}>
                        Step {step.num}
                    </span>
                    {done && <span className="text-[9px] font-bold font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">Done</span>}
                </div>
                <p className={['text-sm font-semibold m-0 mt-0.5 transition-colors duration-300', done || active ? 'text-foreground' : 'text-muted-foreground/50'].join(' ')}>{step.title}</p>
                <p className={['text-xs m-0 mt-0.5 transition-colors duration-300', done || active ? 'text-muted-foreground' : 'text-muted-foreground/30'].join(' ')}>{step.desc}</p>
                {detail && <div className={['mt-2 text-[11px] font-medium px-2.5 py-1.5 rounded border inline-flex items-center gap-1.5 transition-all duration-300', done ? 'bg-primary/8 border-primary/20 text-primary' : 'bg-muted border-border text-muted-foreground'].join(' ')}>{detail}</div>}
            </div>
        </div>
    );
};

const StaffRegister = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '', last_name: '', email: '', password: '', confirm_password: '', role: 'doctor'
    });

    const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

    const stepState = TIMELINE.map(step => ({
        ...step,
        done: step.fields.every(f => formData[f]?.trim().length > 0),
    }));

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
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                navigate('/login/clinical', { state: { message: 'Staff registration successful!' } });
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
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes tl-ring { 0%,100% { transform:scale(1); opacity:0.6; } 50% { transform:scale(1.5); opacity:0; } }
        @keyframes ping-dot { 0%,100% { transform:scale(1); opacity:0.65; } 50% { transform:scale(2.2); opacity:0; } }
        .au1{animation:fadeUp 0.5s ease 0.05s both;}
        .au2{animation:fadeUp 0.5s ease 0.15s both;}
        .au3{animation:fadeUp 0.5s ease 0.25s both;}
        .au4{animation:fadeUp 0.5s ease 0.35s both;}
        .au5{animation:fadeUp 0.5s ease 0.45s both;}
      `}</style>
            <div className="gw-grid-bg" />
            <div className="gw-glow" />

            {/* ══════════════ LEFT — Timeline ══════════════ */}
            <div className="hidden lg:flex flex-col justify-between w-[50%] min-h-screen px-12 py-10 border-r border-border bg-card relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)', backgroundSize: '28px 28px', opacity: 0.5 }} />
                <div className="absolute -top-32 -left-32 pointer-events-none" style={{ width: '560px', height: '480px', background: 'radial-gradient(ellipse at top left, hsl(var(--primary)/0.12) 0%, transparent 60%)' }} />

                <div className="relative z-10 au1">
                    <Link to="/" className="no-underline inline-flex"><Logo size="sm" /></Link>
                </div>

                <div className="relative z-10 flex flex-col gap-10">
                    <div className="flex flex-col gap-3 au2 text-left">
                        <span className="inline-flex items-center gap-2 self-start px-3 py-1 rounded bg-primary/10 border border-primary/20 text-[10px] font-bold font-mono uppercase tracking-widest text-primary">
                            <span className="relative flex w-1.5 h-1.5">
                                <span className="absolute inset-0 rounded-full bg-primary opacity-70" style={{ animation: 'ping-dot 1.6s ease-in-out infinite' }} />
                                <span className="relative block w-1.5 h-1.5 rounded-full bg-primary" />
                            </span>
                            Clinical Staff Onboarding
                        </span>
                        <h2 className="text-3xl font-black tracking-tight text-foreground leading-tight m-0">
                            Onboard to the<br /><span className="text-primary">Medical Network.</span>
                        </h2>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-xs m-0">
                            Establish your professional identity. Access AI-assisted diagnostics and patient orchestration.
                        </p>
                    </div>

                    <div className="au3 flex flex-col text-left">
                        {TIMELINE.map((step, idx) => (
                            <TimelineNode key={step.key} step={step} done={stepState[idx].done} active={activeKey === step.key} isLast={idx === TIMELINE.length - 1} formData={formData} passwordsMatch={passwordsMatch} />
                        ))}
                    </div>

                    <div className="au4 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-muted-foreground/60 uppercase tracking-widest">Verification Status</span>
                            <span className="font-bold text-primary">{stepState.filter(s => f => formData[f]?.trim().length > 0).length} / {TIMELINE.length} Verified</span>
                        </div>
                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-500 ease-out" style={{ width: `${(stepState.filter(s => s.done).length / TIMELINE.length) * 100}%` }} />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 flex items-center gap-5 au5">
                    {['HIPAA COMPLIANT', 'E2E ENCRYPTED', 'AES-256'].map(b => (
                        <span key={b} className="text-[10px] font-mono font-semibold text-muted-foreground/45 uppercase tracking-widest">{b}</span>
                    ))}
                </div>
            </div>

            {/* ══════════════ RIGHT — Form ══════════════ */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
                <div className="lg:hidden mb-8 au1"><Link to="/" className="no-underline"><Logo size="md" /></Link></div>

                <div className="w-full max-w-sm flex flex-col gap-8">
                    <div className="flex flex-col items-center justify-center lg:items-start lg:justify-start gap-1 au1 text-left">
                        <h1 className="text-2xl font-bold tracking-tight text-foreground m-0">Staff Credentialing</h1>
                        <p className="text-sm text-muted-foreground m-0">Define your identity for the clinical station</p>
                    </div>

                    <div className="au2 rounded border border-border bg-card p-7 flex flex-col gap-5 shadow-sm">
                        {error && <div className="px-4 py-2.5 rounded bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold text-center">{error}</div>}

                        <form onSubmit={handleRegister} className="flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-3">
                                <Field id="first_name" label="First Name" placeholder="John" value={formData.first_name} onChange={handleChange} />
                                <Field id="last_name" label="Last Name" placeholder="Doe" value={formData.last_name} onChange={handleChange} />
                            </div>

                            <Field id="email" label="Clinical Email" type="email" placeholder="doctor@clinic.ai" value={formData.email} onChange={handleChange}
                                icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>}
                            />

                            <Field id="role" label="Clinical Role">
                                <Select
                                    value={formData.role}
                                    onValueChange={(val) => setFormData({ ...formData, role: val })}
                                >
                                    <SelectTrigger className="w-full h-11 text-sm bg-background border-border rounded px-4 focus:ring-primary/30 focus:border-primary/60 transition-all [&_svg]:size-4">
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-popover border-border">
                                        <SelectItem value="doctor">Medical Doctor</SelectItem>
                                        <SelectItem value="nurse">Nursing Staff</SelectItem>
                                        <SelectItem value="dentist">Dental Specialist</SelectItem>
                                        <SelectItem value="radiologist">Radiology Specialist</SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>

                            <div className="flex flex-col gap-1">
                                <Field id="password" label="Security Key" type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" value={formData.password} onChange={handleChange}
                                    icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>}
                                />
                                <PasswordStrength password={formData.password} />
                            </div>

                            <div className="flex flex-col gap-1">
                                <Field id="confirm_password" label="Confirm Key" type={showPass ? 'text' : 'password'} placeholder="Re-enter key" value={formData.confirm_password} onChange={handleChange}
                                    icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>}
                                />
                                {formData.confirm_password && <p className={`text-[11px] m-0 mt-1 font-semibold ${passwordsMatch ? 'text-primary' : 'text-destructive'}`}>{passwordsMatch ? '✓ Keys match' : '✗ Keys do not match'}</p>}
                            </div>

                            <button type="button" onClick={() => setShowPass(p => !p)} className="self-start flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{showPass ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /><line x1="1" y1="1" x2="23" y2="23" /></> : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>}</svg>
                                {showPass ? 'Hide keys' : 'Show keys'}
                            </button>

                            <button type="submit" disabled={loading} className="w-full h-11 rounded flex items-center justify-center gap-2 text-sm font-semibold bg-primary text-primary-foreground border border-primary hover:bg-primary/90 transition-all duration-200 hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.2)] cursor-pointer">
                                {loading ? "Authorizing Identity…" : <>Authorize Staff Account <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg></>}
                            </button>
                        </form>
                    </div>

                    <p className="au3 text-center text-sm text-muted-foreground m-0">Already registered? <Link to="/login/clinical" className="text-primary font-semibold no-underline hover:underline">Sign in here</Link></p>
                    <p className="au4 text-center m-0"><Link to="/login" className="text-xs text-muted-foreground/50 no-underline hover:text-primary transition-colors font-mono">← Back to gateway</Link></p>
                </div>
            </div>
        </div>
    );
};

export default StaffRegister;
