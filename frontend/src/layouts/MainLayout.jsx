import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetHeader,
    SheetTitle,
} from '../components/ui/sheet';
import { Menu, ArrowRight } from 'lucide-react';

import { useTheme } from '../components/theme-provider';

/* ═══════════════════════════════════════════════════════════════
   THEME CONTEXT (Adapts global useTheme to MainLayout's tokens)
   ═══════════════════════════════════════════════════════════════ */
const ThemeCtx = createContext({ isDark: true, tk: {}, toggleTheme: () => { } });

const DARK = {
    bg: '#0f0f0f',
    bgHeader: 'rgba(15,15,15,0.90)',
    surface: '#141414',
    surfaceCard: '#1a1a1a',
    surfaceHover: '#222222',
    border: '#262626',
    borderHover: '#3a3a3a',
    accent: '#3ECF8E',
    accentHover: '#2aa372',
    accentDim: 'rgba(62,207,142,0.12)',
    accentBorder: 'rgba(62,207,142,0.22)',
    text1: '#ffffff',
    text2: '#888888',
    text3: '#444444',
    dotColor: '#1f1f1f',
    glowOpacity: '0.07',
    selection: 'rgba(62,207,142,0.25)',
    selectionText: '#fff',
    btnPrimaryText: '#0a0a0a',
    shadow: '0 1px 3px rgba(0,0,0,0.6)',
    sheetBg: '#111111',
    sheetOverlay: 'rgba(0,0,0,0.75)',
};

const LIGHT = {
    bg: '#f5f9f7',
    bgHeader: 'rgba(245,249,247,0.93)',
    surface: '#ffffff',
    surfaceCard: '#f0f7f4',
    surfaceHover: '#e8f4ef',
    border: '#dce9e3',
    borderHover: '#b5cfc5',
    accent: '#1a9e6a',
    accentHover: '#148055',
    accentDim: 'rgba(26,158,106,0.10)',
    accentBorder: 'rgba(26,158,106,0.25)',
    text1: '#0d1f18',
    text2: '#4a6358',
    text3: '#8aaa9a',
    dotColor: '#c8dbd4',
    glowOpacity: '0.12',
    selection: 'rgba(26,158,106,0.18)',
    selectionText: '#0d1f18',
    btnPrimaryText: '#ffffff',
    shadow: '0 1px 3px rgba(0,0,0,0.08)',
    sheetBg: '#ffffff',
    sheetOverlay: 'rgba(0,0,0,0.35)',
};


/* ═══════════════════════════════════════════════════════════════
   SHARED COMPONENTS
═══════════════════════════════════════════════════════════════ */

/** Primary / Ghost / Outline button */
const Btn = ({ variant = 'primary', children, style, onClick, type = 'button', fullWidth = false }) => {
    const { tk } = useContext(ThemeCtx);
    const [hov, setHov] = useState(false);

    const base = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '7px',
        padding: '9px 18px',
        borderRadius: '4px',
        fontSize: '13.5px',
        fontWeight: '600',
        fontFamily: 'inherit',
        cursor: 'pointer',
        transition: 'all 0.17s ease',
        border: '1px solid transparent',
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        outline: 'none',
        boxShadow: tk.shadow,
        width: fullWidth ? '100%' : 'auto',
    };

    const map = {
        primary: {
            n: { background: tk.accent, color: tk.btnPrimaryText, borderColor: tk.accent },
            h: {
                background: tk.accentHover, borderColor: tk.accentHover,
                boxShadow: `0 0 0 3px ${tk.accentDim}`
            },
        },
        ghost: {
            n: { background: 'transparent', color: tk.text2, borderColor: tk.border },
            h: { background: tk.surfaceHover, color: tk.text1, borderColor: tk.borderHover },
        },
        outline: {
            n: { background: 'transparent', color: tk.text1, borderColor: tk.border },
            h: { background: tk.surfaceHover, borderColor: tk.borderHover },
        },
    };

    const v = map[variant];
    return (
        <button
            type={type} onClick={onClick}
            style={{ ...base, ...v.n, ...(hov ? v.h : {}), ...style }}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
        >
            {children}
        </button>
    );
};

/** Desktop nav link */
const NavLink = ({ to, children, onClick }) => {
    const { tk } = useContext(ThemeCtx);
    const location = useLocation();
    const isHash = to.startsWith('#');
    const isActive = !isHash && location.pathname === to;
    const [hov, setHov] = useState(false);

    const style = {
        color: hov || isActive ? tk.accent : tk.text2,
        fontSize: '14px',
        fontWeight: '500',
        textDecoration: 'none',
        transition: 'color 0.15s ease',
        letterSpacing: '0.01em',
        position: 'relative',
    };

    if (isHash) {
        return (
            <a href={to} style={style}
                onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
                {children}
            </a>
        );
    }
    return (
        <Link to={to} style={style} onClick={onClick}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            {children}
        </Link>
    );
};

/** Mobile drawer nav link */
const MobileNavLink = ({ to, children, onClick }) => {
    const { tk } = useContext(ThemeCtx);
    const [hov, setHov] = useState(false);

    const base = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 0',
        color: hov ? tk.accent : tk.text1,
        fontSize: '16px',
        fontWeight: '600',
        textDecoration: 'none',
        transition: 'color 0.15s ease',
        borderBottom: `1px solid ${tk.border}`,
        letterSpacing: '-0.01em',
    };

    const chevron = (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5"
            style={{ opacity: hov ? 1 : 0.3, transition: 'opacity 0.15s ease' }}>
            <path d="M9 18l6-6-6-6" />
        </svg>
    );

    if (to.startsWith('#')) {
        return (
            <a href={to} style={base} onClick={onClick}
                onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
                {children}{chevron}
            </a>
        );
    }
    return (
        <Link to={to} style={base} onClick={onClick}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            {children}{chevron}
        </Link>
    );
};

/** Footer link */
const FooterLink = ({ to, children }) => {
    const { tk } = useContext(ThemeCtx);
    const [hov, setHov] = useState(false);
    return (
        <Link to={to}
            style={{
                color: hov ? tk.accent : tk.text2, fontSize: '13px',
                textDecoration: 'none', transition: 'color 0.15s ease'
            }}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
            {children}
        </Link>
    );
};

/** Footer heading */
const FooterHeading = ({ children }) => {
    const { tk } = useContext(ThemeCtx);
    return (
        <h4 style={{
            fontSize: '11px', fontWeight: '600', letterSpacing: '0.1em',
            textTransform: 'uppercase', color: tk.text3, margin: 0
        }}>
            {children}
        </h4>
    );
};

/** Theme toggle button */
const ThemeToggle = () => {
    const { isDark, tk, toggleTheme } = useContext(ThemeCtx);
    const [hov, setHov] = useState(false);
    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                width: '36px',
                height: '36px',
                borderRadius: '4px',
                border: `1px solid ${hov ? tk.borderHover : tk.border}`,
                background: hov ? tk.surfaceHover : 'transparent',
                color: hov ? tk.text1 : tk.text2,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.17s ease',
                flexShrink: 0,
            }}
        >
            {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="5" />
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
            ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" />
                </svg>
            )}
        </button>
    );
};

/* ═══════════════════════════════════════════════════════════════
   MOBILE SHEET DRAWER  (custom, no shadcn dep for the overlay)
═══════════════════════════════════════════════════════════════ */
const MobileDrawer = ({ open, onClose }) => {
    const { tk, isDark } = useContext(ThemeCtx);

    /* Trap scroll when open */
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    const close = useCallback(() => onClose(), [onClose]);

    const navItems = [
        { to: '#features', label: 'Features' },
        { to: '#agents', label: 'The 12 Agents' },
        { to: '#pricing', label: 'Pricing' },
        { to: '#faq', label: 'FAQ' },
    ];

    return (
        <>
            {/* Overlay */}
            <div
                onClick={close}
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99,
                    background: tk.sheetOverlay,
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? 'all' : 'none',
                    transition: 'opacity 0.25s ease',
                    backdropFilter: 'blur(2px)',
                }}
            />

            {/* Drawer panel */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 100,
                    width: 'min(340px, 88vw)',
                    background: tk.sheetBg,
                    borderLeft: `1px solid ${tk.border}`,
                    transform: open ? 'translateX(0)' : 'translateX(100%)',
                    transition: 'transform 0.3s cubic-bezier(0.32,0.72,0,1)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflowY: 'auto',
                    boxShadow: isDark
                        ? '-24px 0 64px rgba(0,0,0,0.6)'
                        : '-24px 0 64px rgba(0,0,0,0.12)',
                }}
            >
                {/* Drawer header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 24px',
                    borderBottom: `1px solid ${tk.border}`,
                    position: 'sticky',
                    top: 0,
                    background: tk.sheetBg,
                    zIndex: 1,
                }}>
                    <Link to="/" onClick={close} style={{ textDecoration: 'none' }}>
                        <Logo size="sm" />
                    </Link>
                    {/* Close button */}
                    <button
                        onClick={close}
                        aria-label="Close menu"
                        style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '4px',
                            border: `1px solid ${tk.border}`,
                            background: 'transparent',
                            color: tk.text2,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>



                {/* CTA section */}
                <div style={{
                    padding: '24px',
                    borderTop: `1px solid ${tk.border}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                }}>
                    <Link to="/login" onClick={close} style={{ textDecoration: 'none' }}>
                        <Btn variant="outline" fullWidth style={{ height: '46px', fontSize: '14px' }}>
                            Log in
                        </Btn>
                    </Link>
                    <Link to="/signup" onClick={close} style={{ textDecoration: 'none' }}>
                        <Btn variant="primary" fullWidth style={{ height: '46px', fontSize: '14px' }}>
                            Launch Enterprise
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Btn>
                    </Link>

                    {/* Theme toggle row */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '8px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)',
                        border: `1px solid ${tk.border}`,
                    }}>
                        <span style={{ fontSize: '13px', color: tk.text2 }}>
                            {isDark ? '🌙 Dark mode' : '☀️ Light mode'}
                        </span>
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </>
    );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN LAYOUT
═══════════════════════════════════════════════════════════════ */
const LG_BREAKPOINT = 1024; // px — must match the CSS lg: breakpoint

const MainLayout = () => {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const isDark = resolvedTheme === "dark";
    const tk = isDark ? DARK : LIGHT;

    const toggleTheme = useCallback(() => {
        setTheme(isDark ? "light" : "dark");
    }, [isDark, setTheme]);

    const themeValue = { isDark, tk, toggleTheme };
    const [drawerOpen, setDrawerOpen] = useState(false);

    /* ── Auto-close drawer when viewport reaches desktop width ── */
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= LG_BREAKPOINT) {
                setDrawerOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    /* ── Close drawer on route change ── */
    const location = useLocation();
    useEffect(() => {
        setDrawerOpen(false);
    }, [location.pathname]);

    const navItems = [
        { to: '#features', label: 'Features' },
        { to: '#agents', label: 'The 12 Agents' },
        { to: '#pricing', label: 'Pricing' },
        { to: '#faq', label: 'FAQ' },
    ];

    return (
        <ThemeCtx.Provider value={themeValue}>
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: tk.bg,
                color: tk.text1,
                fontFamily: "'Geist', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
                position: 'relative',
                transition: 'background 0.25s ease, color 0.25s ease',
            }}>

                {/* ── Global styles ── */}
                <style>{`
                    *, *::before, *::after { box-sizing: border-box; }
                    ::selection { background: ${tk.selection}; color: ${tk.selectionText}; }

                    @keyframes ping {
                        0%,100% { transform: scale(1);   opacity: 0.7; }
                        50%     { transform: scale(2.2); opacity: 0; }
                    }
                    @keyframes layoutFadeIn {
                        from { opacity: 0; transform: translateY(-4px); }
                        to   { opacity: 1; transform: translateY(0); }
                    }

                    /* Responsive nav hide/show */
                    .desktop-nav  { display: flex; }
                    .desktop-ctas { display: flex; }
                    .mobile-menu-btn { display: none; }

                    @media (max-width: 1023px) {
                        .desktop-nav  { display: none !important; }
                        .desktop-ctas { display: none !important; }
                        .mobile-menu-btn { display: flex !important; }
                    }
                    @media (max-width: 639px) {
                        .header-login-btn { display: none !important; }
                    }
                `}</style>

                {/* ── Fixed background decorations ── */}
                <div style={{
                    position: 'fixed', inset: 0,
                    pointerEvents: 'none', zIndex: 0, overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', inset: 0,
                        backgroundImage: isDark
                            ? `radial-gradient(circle, ${tk.dotColor} 1px, transparent 1px)`
                            : `radial-gradient(circle, ${tk.dotColor} 1.2px, transparent 1.2px)`,
                        backgroundSize: '24px 24px',
                        opacity: isDark ? 0.7 : 0.4,
                        transition: 'opacity 0.3s ease',
                    }} />
                    <div style={{
                        position: 'absolute', top: '-15%', left: '50%',
                        transform: 'translateX(-50%)',
                        width: '900px', height: '600px',
                        background: `radial-gradient(ellipse at center, rgba(62,207,142,${tk.glowOpacity}) 0%, transparent 68%)`,
                        transition: 'background 0.3s ease',
                    }} />
                </div>

                {/* ════════════════════ HEADER ════════════════════ */}
                <header style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 50,
                    width: '100%',
                    borderBottom: `1px solid ${tk.border}`,
                    background: tk.bgHeader,
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    animation: 'layoutFadeIn 0.3s ease forwards',
                    transition: 'background 0.25s ease, border-color 0.25s ease',
                }}>
                    <div style={{
                        maxWidth: '1280px',
                        margin: '0 auto',
                        padding: '0 24px',
                        height: '64px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                    }}>

                        {/* Logo */}
                        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
                            <Logo size="sm" />
                        </Link>



                        {/* Desktop CTAs */}
                        <div className="desktop-ctas" style={{ alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                            <ThemeToggle />
                            <Link to="/login" style={{ textDecoration: 'none' }} className="header-login-btn">
                                <Btn variant="ghost">Log in</Btn>
                            </Link>
                            <Link to="/signup" style={{ textDecoration: 'none' }}>
                                <Btn variant="primary">
                                    Launch Enterprise
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2.5">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </Btn>
                            </Link>
                        </div>

                        {/* Mobile: theme toggle + hamburger */}
                        <div className="mobile-menu-btn" style={{ alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                            <ThemeToggle />
                            <button
                                onClick={() => setDrawerOpen(true)}
                                aria-label="Open menu"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '4px',
                                    border: `1px solid ${tk.border}`,
                                    background: 'transparent',
                                    color: tk.text1,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.17s ease',
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                    stroke="currentColor" strokeWidth="2">
                                    <line x1="3" y1="6" x2="21" y2="6" />
                                    <line x1="3" y1="12" x2="21" y2="12" />
                                    <line x1="3" y1="18" x2="21" y2="18" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* ════════════════════ MOBILE DRAWER ════════════════════ */}
                <MobileDrawer
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                />

                {/* ════════════════════ MAIN ════════════════════ */}
                <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                    <Outlet />
                </main>

                {/* ════════════════════ FOOTER ════════════════════ */}
                <footer style={{
                    borderTop: `1px solid ${tk.border}`,
                    background: tk.surface,
                    padding: '52px 0 32px',
                    position: 'relative',
                    zIndex: 1,
                    transition: 'background 0.25s ease, border-color 0.25s ease',
                }}>
                    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>

                        {/* Footer grid */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                            gap: '40px',
                            marginBottom: '44px',
                        }}>
                            {/* Brand */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <Logo size="sm" />
                                <p style={{
                                    fontSize: '13px', color: tk.text2,
                                    lineHeight: '1.75', maxWidth: '220px', margin: 0,
                                }}>
                                    Revolutionizing healthcare with multi-agent clinical intelligence.
                                    HIPAA &amp; GDPR compliant AI solutions.
                                </p>
                            </div>

                            {/* Product */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <FooterHeading>Product</FooterHeading>
                                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <FooterLink to="#features">Platform</FooterLink>
                                    <FooterLink to="#agents">Agents System</FooterLink>
                                    <FooterLink to="#security">Security</FooterLink>
                                </nav>
                            </div>

                            {/* Company */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <FooterHeading>Company</FooterHeading>
                                <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <FooterLink to="/about">About Us</FooterLink>
                                    <FooterLink to="/contact">Contact</FooterLink>
                                    <FooterLink to="/privacy">Privacy Policy</FooterLink>
                                </nav>
                            </div>

                            {/* Status */}
                            <div style={{
                                display: 'flex', flexDirection: 'column',
                                gap: '14px', alignItems: 'flex-end',
                            }}>
                                <FooterHeading>Status</FooterHeading>

                                {/* Status pill */}
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center',
                                    gap: '8px', padding: '6px 13px', borderRadius: '4px',
                                    background: tk.accentDim, border: `1px solid ${tk.accentBorder}`,
                                    fontSize: '12px', fontWeight: '500', color: tk.accent,
                                    transition: 'background 0.25s ease',
                                }}>
                                    <span style={{ position: 'relative', display: 'flex', width: '8px', height: '8px' }}>
                                        <span style={{
                                            position: 'absolute', inset: 0, borderRadius: '50%',
                                            background: tk.accent, opacity: 0.65,
                                            animation: 'ping 1.6s ease-in-out infinite',
                                        }} />
                                        <span style={{
                                            position: 'relative', display: 'block',
                                            width: '8px', height: '8px',
                                            borderRadius: '50%', background: tk.accent,
                                        }} />
                                    </span>
                                    All Systems Operational
                                </div>

                                {/* Theme badge */}
                                <div style={{
                                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                                    padding: '4px 10px', borderRadius: '4px',
                                    background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
                                    border: `1px solid ${tk.border}`,
                                    fontSize: '11px', color: tk.text3, userSelect: 'none',
                                }}>
                                    {isDark ? '🌙 Dark mode' : '☀️ Light mode'}
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div style={{
                            height: '1px', background: tk.border, marginBottom: '24px',
                            transition: 'background 0.25s ease',
                        }} />

                        {/* Bottom bar */}
                        <div style={{
                            display: 'flex', alignItems: 'center',
                            justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
                        }}>
                            <p style={{ fontSize: '13px', color: tk.text3, margin: 0 }}>
                                © {new Date().getFullYear()}{' '}
                                <span style={{ color: tk.text2, fontWeight: '500' }}>ClinicAI</span>.
                                {' '}Built for the future of Medicine.
                            </p>
                            <div style={{ display: 'flex', gap: '24px' }}>
                                <FooterLink to="/privacy">Privacy</FooterLink>
                                <FooterLink to="/terms">Terms</FooterLink>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </ThemeCtx.Provider>
    );
};

export default MainLayout;