import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';

/* ═══════════════════════════════════════════════════════════
   SIGNUP GATEWAY
   - Matches LoginGateway visual style
   - Two main registration paths: Patient & Clinical
   ═══════════════════════════════════════════════════════════ */

const registrationPaths = [
    {
        id: 'patient',
        label: 'Standard Access',
        title: 'Patient Account',
        desc: 'Access your health records, schedule visits, and consult with our medical agents 24/7.',
        to: '/register/patient',
        featured: true,
        featuredTag: 'Recommended',
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
    {
        id: 'clinical',
        label: 'Professional Role',
        title: 'Clinical Staff',
        desc: 'Advanced workstation access for Doctors, Nurses, and Specialists. Hospital credentials required.',
        to: '/register/clinical',
        featured: false,
        icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="M12 8v4" /><path d="M12 16h.01" />
            </svg>
        ),
    },
];

const PathCard = ({ path }) => {
    const [hov, setHov] = useState(false);
    return (
        <div
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            className={`
        relative flex flex-col gap-5 p-6 rounded
        border transition-all duration-200 text-left
        ${path.featured
                    ? 'border-primary/35 bg-primary/[0.04] hover:border-primary/55 hover:bg-primary/[0.07] dark:bg-primary/[0.06] dark:hover:bg-primary/[0.10]'
                    : 'border-border bg-card hover:border-border/80 hover:bg-accent/30 dark:hover:bg-accent/20'
                }
      `}
        >
            {path.featured && (
                <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary">
                    {path.featuredTag}
                </span>
            )}

            <div className="flex items-start justify-between">
                <div className={`w-10 h-10 rounded flex items-center justify-center border transition-all duration-200 ${path.featured ? 'bg-primary/10 border-primary/25 text-primary' : 'bg-muted border-border text-muted-foreground'}`}>
                    {path.icon}
                </div>
                <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    className={`transition-all duration-200 ${path.featured ? 'text-primary' : 'text-muted-foreground'}`}
                    style={{ opacity: hov ? 1 : 0, transform: hov ? 'translate(2px,-2px)' : 'translate(0,0)' }}
                >
                    <path d="M2 12L12 2M12 2H5M12 2v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>

            <div className="flex flex-col gap-1.5 font-sans">
                <span className={`text-[10px] font-bold font-mono uppercase tracking-[0.1em] ${path.featured ? 'text-primary' : 'text-muted-foreground/60'}`}>
                    {path.label}
                </span>
                <h3 className="text-base font-semibold text-foreground leading-tight m-0">{path.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed m-0 italic">{path.desc}</p>
            </div>

            <Link to={path.to} className="mt-auto no-underline">
                <button className={`w-full py-2.5 px-4 rounded text-[13px] font-semibold border transition-all duration-200 cursor-pointer ${path.featured ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90' : 'bg-background text-foreground border-border hover:bg-accent'}`}>
                    {path.id === 'patient' ? 'Create Account' : 'Apply for Access'}
                </button>
            </Link>
        </div>
    );
};

const SignupGateway = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden bg-background text-foreground">
            <div className="gw-grid-bg" />
            <div className="gw-glow" />

            <div className="relative z-10 flex flex-col items-center w-full max-w-2xl gap-10">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Link to="/" className="no-underline"><Logo size="md" /></Link>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded bg-primary/8 border border-primary/20 text-[11px] font-mono text-primary uppercase tracking-widest">
                        Registration Gateway
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-foreground m-0 mb-1.5">Join the network</h1>
                        <p className="text-sm text-muted-foreground m-0">Establish your presence within the clinical ecosystem</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                    {registrationPaths.map(p => <PathCard key={p.id} path={p} />)}
                </div>

                <div className="flex flex-wrap items-center justify-center gap-6 text-[12px] font-medium">
                    <p className="text-muted-foreground m-0">
                        Already part of the network? <Link to="/login" className="text-primary font-bold no-underline hover:underline ml-1">Sign into Gateway</Link>
                    </p>
                    <Link to="/" className="text-muted-foreground/50 no-underline hover:text-primary transition-colors">← Return home</Link>
                </div>

                <p className="text-[11px] font-mono text-muted-foreground/30 m-0 mt-4">
                    © {new Date().getFullYear()} ClinicAI · HIPAA Compliant · E2E Encrypted
                </p>
            </div>
        </div>
    );
};

export default SignupGateway;
