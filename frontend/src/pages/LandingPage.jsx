import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════
   AGENTS DATA
═══════════════════════════════════════════════════════════ */
const AGENTS = [
    {
        id: 'triage',
        name: 'Triage Sentinel',
        role: 'Symptom Analysis & Prioritization',
        icon: (
            <svg viewBox="0 0 40 40" fill="none" width="28" height="28">
                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" />
                <path d="M20 12v16M12 20h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="20" cy="20" r="3.5" fill="currentColor" />
            </svg>
        ),
        detail: `The Triage Sentinel monitors every incoming patient signal — from vitals to chief complaints — and assigns a dynamic severity score in under 200ms. It cross-references age, comorbidities, symptom onset speed, and vital trend vectors to automatically route patients to the correct care tier. No waiting. No manual sorting. Just precision intake at scale.`,
        stats: [{ v: '200ms', l: 'Sort Time' }, { v: '99.1%', l: 'Accuracy' }, { v: '24/7', l: 'Uptime' }],
    },
    {
        id: 'diagnostic',
        name: 'Diagnostic Oracle',
        role: 'Differential Diagnosis Review',
        icon: (
            <svg viewBox="0 0 40 40" fill="none" width="28" height="28">
                <circle cx="18" cy="18" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M25 25l8 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M14 18h8M18 14v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        detail: `Drawing from 4.2 million anonymized clinical cases, 12,000+ peer-reviewed studies, and live WHO databases, the Diagnostic Oracle generates ranked differential diagnoses with confidence intervals. It surfaces rare conditions human clinicians might miss, flags evolving symptom clusters, and continuously updates its reasoning as new lab results arrive.`,
        stats: [{ v: '99.4%', l: 'DX Accuracy' }, { v: '4.2M', l: 'Case Refs' }, { v: '<2s', l: 'Response' }],
    },
    {
        id: 'biosafety',
        name: 'Bio-Safety Agent',
        role: 'Risk Mitigation & Contraindications',
        icon: (
            <svg viewBox="0 0 40 40" fill="none" width="28" height="28">
                <path d="M20 4l14 7v10c0 8-6 14-14 17C12 35 6 29 6 21V11L20 4z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 20l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        detail: `Before any prescription is finalized, the Bio-Safety Agent verifies against the patient's full medication history, known allergens, renal/hepatic scores, and 110,000+ documented drug-drug interaction pairs. It can halt a dangerous order in under 50ms and push an alternative protocol to the physician's dashboard instantly.`,
        stats: [{ v: '110K+', l: 'Drug Pairs' }, { v: '50ms', l: 'Block Time' }, { v: '0', l: 'Errors Missed' }],
    },
    {
        id: 'registry',
        name: 'Registry Clerk',
        role: 'EMR & FHIR Orchestration',
        icon: (
            <svg viewBox="0 0 40 40" fill="none" width="28" height="28">
                <rect x="6" y="8" width="28" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <rect x="6" y="17" width="28" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <rect x="6" y="26" width="28" height="6" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="31" cy="11" r="2" fill="currentColor" />
            </svg>
        ),
        detail: `The Registry Clerk speaks every dialect — HL7 v2, HL7 v3, FHIR R4, CDA, and proprietary formats — translating records bidirectionally in real-time. It maintains a single patient truth record across 40+ data sources, ensures version consistency, and automates HIPAA-mandated data retention audits.`,
        stats: [{ v: '40+', l: 'Data Sources' }, { v: 'FHIR R4', l: 'Standard' }, { v: '0%', l: 'Data Loss' }],
    },
    {
        id: 'geneticist',
        name: 'Geneticist AI',
        role: 'Genomic Analysis & Oncology',
        icon: (
            <svg viewBox="0 0 40 40" fill="none" width="28" height="28">
                <path d="M14 4c0 8 12 6 12 14s-12 6-12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M26 4c0 8-12 6-12 14s12 6 12 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="11" y1="13" x2="29" y2="13" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="11" y1="20" x2="29" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
                <line x1="11" y1="27" x2="29" y2="27" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
            </svg>
        ),
        detail: `The Geneticist AI processes whole-genome and targeted gene-panel sequencing data to identify clinically significant variants. It cross-references ClinVar, OMIM, and TCGA to stratify hereditary cancer risk and pharmacogenomic profiles. Oncology regimens are auto-personalized based on tumor mutation burden and microsatellite instability scores.`,
        stats: [{ v: '6B', l: 'Base Pairs' }, { v: 'BRCA+', l: 'Panels' }, { v: '98.7%', l: 'Variant Recall' }],
    },
    {
        id: 'vitals',
        name: 'Vitals Guardian',
        role: 'Continuous Physiological Monitoring',
        icon: (
            <svg viewBox="0 0 40 40" fill="none" width="28" height="28">
                <path d="M4 22h6l4-10 6 18 4-14 3 6h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        detail: `Integrated with bedside IoT telemetry and wearables, the Vitals Guardian processes 1,000+ physiological data points per second. Its predictive model, trained on 800,000 ICU patient-days, detects hemodynamic signatures of sepsis, cardiac decompensation, and respiratory failure up to 4 hours before clinical presentation.`,
        stats: [{ v: '4hrs', l: 'Early Warning' }, { v: '1K/s', l: 'Data Points' }, { v: '800K', l: 'ICU Days' }],
    },
    {
        id: 'lab',
        name: 'Lab Analyst',
        role: 'Pathology & Blood Chemistry',
        icon: (
            <svg viewBox="0 0 40 40" fill="none" width="28" height="28">
                <path d="M15 8v14l-6 10h22l-6-10V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="12" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
                <circle cx="18" cy="26" r="2" fill="currentColor" opacity="0.6" />
                <circle cx="24" cy="29" r="1.5" fill="currentColor" opacity="0.4" />
            </svg>
        ),
        detail: `The Lab Analyst combines reference-range interpretation with deep pattern analysis. For digital pathology, a computer vision model trained on 2.3M annotated cell slides classifies cellular morphology, detects blast crises, and quantifies fibrosis staging — delivering a structured report in 15 seconds.`,
        stats: [{ v: '2.3M', l: 'Slide Training' }, { v: '97.8%', l: 'Cell Class.' }, { v: '15s', l: 'Report Time' }],
    },
    {
        id: 'radiology',
        name: 'Precision Radiologist',
        role: 'Medical Imaging & Tumor Detection',
        icon: (
            <svg viewBox="0 0 40 40" fill="none" width="28" height="28">
                <rect x="6" y="6" width="28" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="20" cy="20" r="7" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="20" cy="20" r="2" fill="currentColor" />
                <path d="M20 6v5M20 29v5M6 20h5M29 20h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
        ),
        detail: `Trained on 11 million labeled DICOM studies across 47 anatomical regions, the Precision Radiologist identifies micro-fractures, early-stage nodules, and vascular anomalies below the detection threshold of fatigued human readers. It annotates findings with bounding overlays and auto-populates a structured radiology report for physician sign-off.`,
        stats: [{ v: '97.3%', l: 'Sensitivity' }, { v: '11M', l: 'DICOM Studies' }, { v: '<1mm', l: 'Detection' }],
    },
    {
        id: 'ethics',
        name: 'Ethics Warden',
        role: 'Compliance, HIPAA & GDPR Audit',
        icon: (
            <svg viewBox="0 0 40 40" fill="none" width="28" height="28">
                <path d="M8 14l12-8 12 8v10c0 6-5 10-12 12C13 34 8 30 8 24V14z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M15 20l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        detail: `The Ethics Warden operates as a constitutional layer over the entire swarm. Every recommendation, data access event, and model inference is logged immutably and assessed against HIPAA, GDPR, and ethical constraints. It enforces patient consent, detects bias patterns, and generates real-time compliance reports for hospital governance boards.`,
        stats: [{ v: '100%', l: 'Coverage' }, { v: 'HIPAA+', l: 'GDPR' }, { v: 'Immutable', l: 'Audit Log' }],
    },
    {
        id: 'pharma',
        name: 'Pharma Strategist',
        role: 'Prescription & Inventory Optimization',
        icon: (
            <svg viewBox="0 0 40 40" fill="none" width="28" height="28">
                <rect x="8" y="14" width="24" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                <path d="M14 14V10a6 6 0 0112 0v4" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="20" cy="23" r="3" stroke="currentColor" strokeWidth="1.5" />
            </svg>
        ),
        detail: `The Pharma Strategist combines patient-level clinical data with hospital-wide inventory telemetry to optimize prescribing patterns and prevent stockouts. It applies therapeutic substitution logic, tracks generic availability, enforces formulary compliance, and projects 90-day medication demand curves — saving systems up to 22% on pharmacy spend.`,
        stats: [{ v: '22%', l: 'Cost Reduction' }, { v: '90-day', l: 'Forecast' }, { v: '0', l: 'Formulary Breaks' }],
    },
    {
        id: 'coordinator',
        name: 'Care Coordinator',
        role: 'Post-Visit Recovery & Chronic Care',
        icon: (
            <svg viewBox="0 0 40 40" fill="none" width="28" height="28">
                <circle cx="20" cy="14" r="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 34c0-7 5.4-12 12-12s12 5 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M28 20l2 2 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        detail: `After discharge, the Care Coordinator enrolls patients in condition-specific recovery programs, sends personalized follow-up messages via SMS or voice, escalates concerning check-ins to on-call nurses, and manages post-acute scheduling. Clinical trials show a 41% reduction in 30-day readmission rates for participating facilities.`,
        stats: [{ v: '41%', l: 'Readmission Drop' }, { v: '24/7', l: 'Patient Contact' }, { v: 'Omni', l: 'Channel' }],
    },
    {
        id: 'sysadmin',
        name: 'Systems Admin',
        role: 'Neural Infrastructure Governance',
        icon: (
            <svg viewBox="0 0 40 40" fill="none" width="28" height="28">
                <circle cx="20" cy="20" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M20 4v4M20 32v4M4 20h4M32 20h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8.1 8.1l2.8 2.8M29.1 29.1l2.8 2.8M29.1 8.1l-2.8 2.8M8.1 29.1l2.8 2.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="20" cy="20" r="11" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            </svg>
        ),
        detail: `The Systems Admin monitors GPU cluster health, orchestrates rolling model updates with zero-downtime deployments, and manages horizontal auto-scaling in response to patient census fluctuations. When an agent misbehaves, it can isolate and hot-swap it within 800ms — the clinical equivalent of an uninterruptible power supply.`,
        stats: [{ v: '99.99%', l: 'Uptime SLA' }, { v: '800ms', l: 'Failover' }, { v: '0-dt', l: 'Zero Downtime' }],
    },
];

/* ═══════════════════════════════════════════════════════════
   ANIMATED BACKGROUND COMPONENTS (Framer Motion)
   ═══════════════════════════════════════════════════════════ */

/** Floating data nodes that simulate a neural medical network */
const NeuralFlow = () => {
    const nodes = useMemo(() => Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 2,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * -20,
        type: i % 3 === 0 ? 'pulse' : 'static'
    })), []);

    const beams = useMemo(() => Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x1: Math.random() * 100,
        y1: Math.random() * 100,
        x2: Math.random() * 100,
        y2: Math.random() * 100,
        duration: Math.random() * 5 + 8,
        delay: Math.random() * -10
    })), []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 dark:opacity-40">
            {/* Pulsing connections */}
            <svg className="absolute inset-0 w-full h-full">
                {beams.map((beam) => (
                    <motion.line
                        key={beam.id}
                        x1={`${beam.x1}%`}
                        y1={`${beam.y1}%`}
                        x2={`${beam.x2}%`}
                        y2={`${beam.y2}%`}
                        className="stroke-primary/30"
                        strokeWidth="1"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: [0, 1, 0], opacity: [0, 0.4, 0] }}
                        transition={{
                            duration: beam.duration,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: beam.delay,
                        }}
                    />
                ))}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => (
                <motion.div
                    key={node.id}
                    className={`absolute rounded-full ${node.type === 'pulse' ? 'bg-primary' : 'bg-primary/40'} shadow-primary/40`}
                    style={{
                        width: node.size,
                        height: node.size,
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        boxShadow: `0 0 ${node.type === 'pulse' ? '15px' : '8px'} var(--primary)`,
                    }}
                    animate={{
                        x: [0, 40, 0],
                        y: [0, -40, 0],
                        scale: node.type === 'pulse' ? [1, 1.8, 1] : [1, 1.2, 1],
                        opacity: node.type === 'pulse' ? [0.3, 0.9, 0.3] : [0.4, 0.6, 0.4],
                    }}
                    transition={{
                        duration: node.duration,
                        repeat: Infinity,
                        ease: "linear",
                        delay: node.delay,
                    }}
                />
            ))}

            {/* Scanning line */}
            <motion.div
                className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};

/** Ambient glow orbs that move subtly in the background */
const GlowOrbs = () => (
    <div className="absolute inset-0 pointer-events-none overflow-hidden blur-[120px] opacity-40 dark:opacity-30">
        <motion.div
            animate={{
                x: [0, 200, 0],
                y: [0, 100, 0],
                scale: [1, 1.2, 1],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-primary/25 mix-blend-screen"
        />
        <motion.div
            animate={{
                x: [0, -150, 0],
                y: [0, 150, 0],
                scale: [1, 1.3, 1],
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/15 mix-blend-screen"
        />
    </div>
);

/* ═══════════════════════════════════════════════════════════
   SMALL REUSABLE COMPONENTS
═══════════════════════════════════════════════════════════ */

/** Green accent pill badge */
const Pill = ({ children }) => (
    <span className="
    inline-flex items-center gap-1.5 px-3 py-1 rounded
    text-[10px] font-bold uppercase tracking-[0.12em]
    bg-primary/10 text-primary border border-primary/20
  ">
        {children}
    </span>
);

/** Stat chip used inside agent cards */
const StatChip = ({ v, l }) => (
    <div className="
    flex flex-col items-center px-4 py-3 rounded
    bg-primary/8 border border-primary/15
    min-w-[76px]
  ">
        <span className="text-lg font-extrabold text-primary leading-none tracking-tight">{v}</span>
        <span className="text-[10px] font-semibold text-muted-foreground mt-1 tracking-wide uppercase">{l}</span>
    </div>
);

/** Primary / Outline button */
const Btn = ({ variant = 'primary', children, to, className = '', ...props }) => {
    const base = 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded text-sm font-semibold transition-all duration-200 outline-none border cursor-pointer no-underline whitespace-nowrap';
    const variants = {
        primary: 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]',
        outline: 'bg-transparent text-foreground border-border hover:bg-accent/50 hover:border-primary/40',
        ghost: 'bg-transparent text-muted-foreground border-transparent hover:bg-accent/50 hover:text-foreground',
    };
    if (to) return <Link to={to} className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</Link>;
    return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>;
};

/* ═══════════════════════════════════════════════════════════
   AGENT DETAIL CARD
═══════════════════════════════════════════════════════════ */
const AgentDetailCard = ({ agent, idx }) => {
    const isEven = idx % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="
      group grid grid-cols-1 md:grid-cols-2 rounded overflow-hidden
      border border-border
      bg-card
      transition-all duration-300
      hover:border-primary/30 hover:shadow-[0_0_40px_-12px_hsl(var(--primary)/0.15)]
    ">
            {/* Visual panel */}
            <div className={`
        relative flex flex-col items-center justify-center gap-7 p-10
        bg-primary/[0.04] border-border
        ${isEven ? 'md:border-r order-1 md:order-1' : 'md:border-l order-1 md:order-2'}
      `}>
                {/* Watermark number */}
                <span className="
          absolute top-4 right-5 text-6xl font-black
          text-primary/[0.07] leading-none select-none tabular-nums
        ">
                    {String(idx + 1).padStart(2, '0')}
                </span>

                {/* Icon container */}
                <div className="
          w-20 h-20 rounded flex items-center justify-center
          bg-primary/10 border border-primary/20 text-primary
          transition-all duration-300
          group-hover:bg-primary/15 group-hover:scale-105
          group-hover:shadow-[0_8px_24px_-8px_hsl(var(--primary)/0.35)]
        ">
                    {React.cloneElement(agent.icon, { width: 36, height: 36 })}
                </div>

                {/* Stats row */}
                <div className="flex gap-2.5 flex-wrap justify-center">
                    {agent.stats.map((s, i) => <StatChip key={i} v={s.v} l={s.l} />)}
                </div>
            </div>

            {/* Text panel */}
            <div className={`
        flex flex-col justify-center gap-4 p-10
        ${isEven ? 'order-2 md:order-2' : 'order-2 md:order-1'}
      `}>
                <Pill>{agent.role}</Pill>
                <h3 className="text-2xl font-extrabold tracking-tight text-foreground leading-tight m-0">
                    {agent.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed m-0">
                    {agent.detail}
                </p>
            </div>
        </motion.div>
    );
};

/* ═══════════════════════════════════════════════════════════
   AGENT THUMBNAIL (overview grid)
═══════════════════════════════════════════════════════════ */
const AgentThumb = ({ agent, idx }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, scale: 0.9 },
            show: { opacity: 1, scale: 1 }
        }}
        className="
    group flex flex-col gap-3 p-4 rounded cursor-default
    border border-border bg-background
    transition-all duration-200
    hover:border-primary/40 hover:bg-primary/[0.04]
  ">
        <div className="
      w-10 h-10 rounded flex items-center justify-center
      bg-primary/10 border border-primary/20 text-primary
      transition-transform duration-200 group-hover:scale-110
    ">
            {React.cloneElement(agent.icon, { width: 22, height: 22 })}
        </div>
        <div>
            <p className="text-xs font-bold text-foreground leading-tight m-0">{agent.name}</p>
            <p className="text-[10px] text-primary font-semibold tracking-wide mt-0.5 m-0 leading-tight">
                {agent.role.split(' ').slice(0, 2).join(' ')}
            </p>
        </div>
    </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   FEATURE CARD
═══════════════════════════════════════════════════════════ */
const FeatureCard = ({ icon, tag, title, desc }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="
    group flex flex-col gap-5 p-8 rounded
    border border-border bg-card
    transition-all duration-300
    hover:border-primary/30 hover:shadow-[0_0_32px_-8px_hsl(var(--primary)/0.12)]
  ">
        <div className="
      w-12 h-12 rounded flex items-center justify-center
      bg-primary/10 border border-primary/20 text-primary
      transition-all duration-300 group-hover:rotate-6 group-hover:scale-110
    ">
            {icon}
        </div>
        <Pill>{tag}</Pill>
        <h3 className="text-xl font-bold tracking-tight text-foreground m-0">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed m-0">{desc}</p>
    </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   METRIC BLOCK
═══════════════════════════════════════════════════════════ */
const MetricBlock = ({ val, lab }) => (
    <div className="flex flex-col items-center gap-2">
        <span className="text-5xl md:text-6xl font-black tracking-tighter text-foreground leading-none tabular-nums">
            {val}
        </span>
        <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-primary">{lab}</span>
    </div>
);

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
const LandingPage = () => {
    const { scrollY } = useScroll();
    const bgOpacity = useTransform(scrollY, [0, 500], [1, 0]);
    const bgScale = useTransform(scrollY, [0, 500], [1, 1.1]);

    return (
        <div className="overflow-x-hidden bg-background text-foreground">
       

      <div className="gw-grid-bg" />
      <div className="gw-glow" />

            {/* ══════════════════ HERO ══════════════════ */}
            <section className="
        relative pt-28 pb-32 md:pt-40 md:pb-48
        bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,color-mix(in_oklch,var(--primary),transparent_88%),transparent)]
        dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,color-mix(in_oklch,var(--primary),transparent_92%),transparent)]
        overflow-hidden
      ">
                <div className="absolute inset-0 grid-bg opacity-[0.15] dark:opacity-[0.1] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000,transparent)] pointer-events-none"></div>

                {/* Background Animations */}
                <motion.div style={{ opacity: bgOpacity, scale: bgScale }} className="absolute inset-0 z-0">
                    <NeuralFlow />
                    <GlowOrbs />
                </motion.div>

                <div className="relative z-10 max-w-7xl mx-auto px-6">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto gap-7">

                        {/* Badge */}
                        <div className="anim-1">
                            <Pill>Enterprise Clinical Intelligence v2.5</Pill>
                        </div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                            className="anim-2 m-0 text-5xl md:text-7xl font-black tracking-tighter leading-[1.0] text-foreground"
                        >
                            The Neural OS for<br />
                            <span className="text-primary">Modern Medicine</span>
                        </motion.h1>

                        {/* Sub */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
                            className="anim-3 m-0 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
                        >
                            Orchestrating the world's first multi-agent clinical swarm to automate
                            complex workflows with 100% data integrity and human-parity precision.
                        </motion.p>

                        {/* CTAs */}
                        <div className="anim-4 flex flex-wrap gap-3 justify-center">
                            <Btn to="/login" variant="primary" className="h-12 px-8 text-sm">
                                Access Clinical Nodes
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </Btn>
                            <Btn to="/signup" variant="outline" className="h-12 px-8 text-sm">
                                Establish New Facility
                            </Btn>
                        </div>

                        {/* Trust strip */}
                        <div className="anim-5 flex flex-wrap items-center justify-center gap-5 mt-2">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                Trusted by
                            </span>
                            {['HEALTH-CORP', 'MED-SOLUTIONS', 'BIO-TECH', 'MODERN-DOC'].map(b => (
                                <span key={b} className="text-xs font-black italic tracking-tight text-muted-foreground/40">{b}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>



            {/* ══════════════════ CORE FEATURES ══════════════════ */}
            <section id="features" className="relative py-24 px-6 bg-background overflow-hidden">
                <div className="absolute inset-0 dot-bg opacity-[0.3] dark:opacity-[0.15] pointer-events-none"></div>
                <div className="relative z-10 max-w-6xl mx-auto">
                    {/* Section header */}
                    <div className="text-center mb-14">
                        <Pill>Core Engine</Pill>
                        <h2 className="mt-4 mb-3 text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                            Platform Capabilities
                        </h2>
                        <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
                            Three pillars that make ClinicAI the world's most reliable clinical intelligence platform.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <FeatureCard
                            tag="Core Engine"
                            title="Multi-Agent Orchestration"
                            desc="A proprietary swarm intelligence layer synchronizing 12 specialized agents for error-free clinical decision support at facility scale."
                            icon={
                                <svg viewBox="0 0 28 28" fill="none" width="22" height="22">
                                    <circle cx="14" cy="14" r="3.5" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="5" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="23" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="5" cy="21" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                                    <circle cx="23" cy="21" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M7.5 8.5l5 4M20.5 8.5l-5 4M7.5 19.5l5-4M20.5 19.5l-5-4" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            }
                        />
                        <FeatureCard
                            tag="Security"
                            title="Zero-Knowledge Security"
                            desc="End-to-end encryption with biometric gating ensures patient data remains inaccessible even during high-velocity AI processing pipelines."
                            icon={
                                <svg viewBox="0 0 28 28" fill="none" width="22" height="22">
                                    <path d="M14 3l9 4.5v7c0 5-3.5 8.5-9 10C5 23 5 17.5 5 14.5V7.5L14 3z" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M10 14l2.5 2.5 5.5-5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            }
                        />
                        <FeatureCard
                            tag="Intelligence"
                            title="Predictive Vitals"
                            desc="Detect physiological anomalies up to 4 hours before clinical presentation using sub-millisecond telemetry analysis and ICU-trained models."
                            icon={
                                <svg viewBox="0 0 28 28" fill="none" width="22" height="22">
                                    <path d="M3 15h4l3-7 4 12 3-9 2 4h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            }
                        />
                    </div>
                </div>
            </section>

            {/* ══════════════════ AGENTS OVERVIEW GRID ══════════════════ */}
            <section className="py-24 px-6 bg-card border-y border-border">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12">
                        <Pill>The Medical Swarm</Pill>
                        <h2 className="mt-4 mb-3 text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                            Meet the <span className="text-primary">Medical Council</span>
                        </h2>
                        <p className="text-muted-foreground text-base max-w-lg leading-relaxed">
                            12 specialized AI agents, each a domain expert, communicating over a
                            high-velocity neural fabric for holistic, error-free care.
                        </p>
                    </div>

                    {/* Thumbnail grid */}
                    <motion.div
                        variants={{
                            hidden: { opacity: 0 },
                            show: {
                                opacity: 1,
                                transition: { staggerChildren: 0.05 }
                            }
                        }}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3"
                    >
                        {AGENTS.map((a, i) => <AgentThumb key={i} agent={a} idx={i} />)}
                    </motion.div>
                </div>
            </section>

            {/* ══════════════════ AGENTS DETAIL ══════════════════ */}
            <section id="agents" className="py-24 px-6 bg-background">
                <div className="max-w-5xl mx-auto">
                    {/* Section header */}
                    <div className="text-center mb-16">
                        <Pill>Deep Dive</Pill>
                        <h2 className="mt-4 mb-3 text-4xl md:text-5xl font-black tracking-tighter text-foreground">
                            Every Agent, Explained
                        </h2>
                        <p className="text-muted-foreground text-base max-w-md mx-auto leading-relaxed">
                            Each agent is an independent specialist trained on millions of
                            domain-specific clinical records.
                        </p>
                    </div>

                    <div className="flex flex-col gap-5">
                        {AGENTS.map((agent, idx) => (
                            <AgentDetailCard key={agent.id} agent={agent} idx={idx} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════ STATUS STRIP ══════════════════ */}
            <section className="py-16 px-6 bg-card border-y border-border">
                <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                    {/* Status pill */}
                    <div className="flex items-center gap-3">
                        <span className="relative flex w-2.5 h-2.5">
                            <span className="absolute inset-0 rounded bg-primary opacity-70"
                                style={{ animation: 'ping-dot 1.6s ease-in-out infinite' }} />
                            <span className="relative block w-2.5 h-2.5 rounded bg-primary" />
                        </span>
                        <span className="text-sm font-semibold text-primary">All Systems Operational</span>
                    </div>
                    <div className="flex flex-wrap gap-6 justify-center">
                        {['HIPAA Compliant', 'GDPR Compliant', 'SOC 2 Type II', 'ISO 27001'].map(b => (
                            <span key={b} className="
                text-[10px] font-bold uppercase tracking-widest
                px-3 py-1.5 rounded
                border border-border text-muted-foreground
              ">{b}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════ CTA ══════════════════ */}
            <section className="
        relative py-32 px-6 text-center overflow-hidden bg-background
        before:absolute before:inset-0
        before:bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,hsl(var(--primary)/0.07),transparent)]
        before:pointer-events-none
      ">
                <div className="relative z-10 max-w-2xl mx-auto">
                    <Pill>Get Started</Pill>
                    <h2 className="mt-5 mb-4 text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-tight">
                        Join the{' '}
                        <span className="text-primary">Future of Care</span>
                    </h2>
                    <p className="text-muted-foreground text-lg leading-relaxed mb-10 max-w-xl mx-auto">
                        Request a formal assessment and clinical simulation of our multi-agent
                        network for your hospital today.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Btn to="/signup" variant="primary" className="h-13 px-10 text-sm rounded">
                            Start Enterprise Pilot
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Btn>
                        <Btn variant="ghost" className="h-13 px-10 text-sm rounded">
                            Request Documentation
                        </Btn>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;