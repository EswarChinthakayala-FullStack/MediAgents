import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../components/Logo';

/* ═══════════════════════════════════════════════════════════
   LOGIN GATEWAY
   - Uses shadcn CSS variables (bg-background, text-foreground…)
   - dark: classes for dark mode — no inline token objects
   - ClinicAI Logo + branding
═══════════════════════════════════════════════════════════ */

const portals = [
  {
    id: 'patient',
    label: 'Portal',
    title: 'Patient',
    desc: 'View records, book appointments, and message your care team securely.',
    to: '/login/patient',
    featured: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M3 16c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'clinical',
    label: 'SSO Enabled',
    title: 'Clinical Station',
    desc: 'Diagnostic hub for doctors and nursing staff. Keycloak SSO integrated.',
    to: '/login/clinical',
    featured: true,
    featuredTag: 'Clinical',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="8" y="2" width="2" height="14" rx="1" fill="currentColor"/>
        <rect x="2" y="8" width="14" height="2" rx="1" fill="currentColor"/>
      </svg>
    ),
  },
  {
    id: 'admin',
    label: 'Restricted',
    title: 'Systems Admin',
    desc: 'Infrastructure, IAM realm management, and database governance.',
    to: '/login/admin',
    featured: false,
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="3" y="7" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M6 7V5.5a3 3 0 016 0V7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="9" cy="12" r="1.2" fill="currentColor"/>
      </svg>
    ),
  },
];

/* ── Portal card ── */
const PortalCard = ({ portal }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={`
        relative flex flex-col gap-5 p-6 rounded
        border transition-all duration-200
        ${portal.featured
          ? 'border-primary/35 bg-primary/[0.04] hover:border-primary/55 hover:bg-primary/[0.07] dark:bg-primary/[0.06] dark:hover:bg-primary/[0.10]'
          : 'border-border bg-card hover:border-border/80 hover:bg-accent/30 dark:hover:bg-accent/20'
        }
      `}
    >
      {/* Featured tag */}
      {portal.featured && (
        <span className="
          absolute top-3 right-3
          px-2.5 py-0.5 rounded
          text-[10px] font-bold font-mono uppercase tracking-wider
          bg-primary/10 border border-primary/20 text-primary
        ">
          {portal.featuredTag}
        </span>
      )}

      {/* Top row: icon + arrow */}
      <div className="flex items-start justify-between">
        <div className={`
          w-10 h-10 rounded flex items-center justify-center
          border transition-all duration-200
          ${portal.featured
            ? 'bg-primary/10 border-primary/25 text-primary'
            : 'bg-muted border-border text-muted-foreground group-hover:text-foreground'
          }
        `}>
          {portal.icon}
        </div>
        {/* Arrow */}
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          className={`transition-all duration-200 ${portal.featured ? 'text-primary' : 'text-muted-foreground'}`}
          style={{
            opacity: hov ? 1 : 0,
            transform: hov ? 'translate(2px,-2px)' : 'translate(0,0)',
          }}
        >
          <path d="M2 12L12 2M12 2H5M12 2v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col gap-1.5">
        <span className={`
          text-[10px] font-bold font-mono uppercase tracking-[0.1em]
          ${portal.featured ? 'text-primary' : 'text-muted-foreground/60'}
        `}>
          {portal.label}
        </span>
        <h3 className="text-base font-semibold text-foreground leading-tight m-0">
          {portal.title}
        </h3>
        <p className="text-[13px] text-muted-foreground leading-relaxed m-0">
          {portal.desc}
        </p>
      </div>

      {/* CTA button */}
      <Link to={portal.to} className="mt-auto">
        <button className={`
          w-full py-2.5 px-4 rounded text-[13px] font-semibold
          border transition-all duration-200 cursor-pointer
          ${portal.featured
            ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]'
            : 'bg-background text-foreground border-border hover:bg-accent hover:border-border/80'
          }
        `}>
          Sign in
        </button>
      </Link>
    </div>
  );
};

/* ── Footer item ── */
const FooterItem = ({ children }) => (
  <span className="text-[11px] font-mono text-muted-foreground/50 flex items-center gap-1.5">
    {children}
  </span>
);

const FooterDivider = () => (
  <span className="w-px h-3 bg-border block"/>
);

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
const LoginGateway = () => {
  return (
    <div className="
      min-h-screen flex flex-col items-center justify-center
      px-6 py-16 relative overflow-hidden
      bg-background text-foreground
    ">
     
      <div className="gw-grid-bg" />
      <div className="gw-glow" />

     

      {/* ── Main content ── */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-3xl gap-10">

        {/* ── Header ── */}
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Logo */}
          <Link to="/" className="no-underline">
            <Logo size="md" />
          </Link>

          {/* Status badge */}
          <div className="
            inline-flex items-center gap-2
            px-3.5 py-1.5 rounded
            bg-primary/8 border border-primary/20
            text-[11px] font-mono text-primary
          ">
            <span className="relative flex w-1.5 h-1.5">
              <span className="absolute inset-0 rounded bg-primary opacity-70"
                style={{ animation: 'ping-dot 1.6s ease-in-out infinite' }}/>
              <span className="relative block w-1.5 h-1.5 rounded bg-primary"/>
            </span>
            All systems operational
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground m-0 mb-1.5">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground m-0">
              Choose your portal to continue
            </p>
          </div>
        </div>

        {/* ── Portal cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          {portals.map(p => <PortalCard key={p.id} portal={p}/>)}
        </div>

        {/* ── Compliance / footer bar ── */}
        <div className="
          flex flex-wrap items-center justify-center gap-3
          px-5 py-3 rounded
          border border-border bg-card/60
          backdrop-blur-sm
        ">
          {/* HIPAA */}
          <FooterItem>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M5 1L1 3.5V6.5L5 9L9 6.5V3.5L5 1Z" stroke="currentColor" strokeWidth="1"/>
            </svg>
            HIPAA Compliant
          </FooterItem>
          <FooterDivider/>

          {/* GDPR */}
          <FooterItem>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1"/>
              <path d="M3 5h4M5 3v4" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            GDPR Ready
          </FooterItem>
          <FooterDivider/>

          {/* Node ID */}
          <FooterItem>CLINIC-HQ-GATEWAY-A</FooterItem>
          <FooterDivider/>

          {/* Create account */}
          <Link to="/signup"
            className="text-[11px] font-mono font-bold text-primary no-underline hover:opacity-80 transition-opacity">
            Create new account
          </Link>
          <FooterDivider/>

          {/* Return home */}
          <Link to="/"
            className="text-[11px] font-mono text-muted-foreground/50 no-underline hover:text-primary transition-colors">
            ← Return home
          </Link>
        </div>

        {/* ── Copyright ── */}
        <p className="text-[11px] font-mono text-muted-foreground/30 m-0">
          © {new Date().getFullYear()} ClinicAI · AES-256 encrypted · All sessions audited
        </p>
      </div>
    </div>
  );
};

export default LoginGateway;