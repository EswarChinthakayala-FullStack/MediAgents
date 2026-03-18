import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Slider } from '../../components/ui/slider';
import { useAuth } from '../../context/AuthContext';
import { useEventBus } from '../../hooks/useEventBus';
import Logo from '../../components/Logo';
import { Button } from '../../components/ui/button'

/* ═══════════════════════════════════════════════════════════
   SYMPTOMS / TRIAGE PAGE
   - Step 1: Symptom input form
   - Step 2: Live agent processing timeline (line-by-line logs)
   - Step 3: Parsed, structured clinical report
   Rules: only `rounded` (no rounded-xl/2xl/lg etc.)
          Tailwind + shadcn CSS vars only, no hardcoded hex
═══════════════════════════════════════════════════════════ */

/* ── Urgency config ── */
const URGENCY = {
  1: { label: 'CRITICAL', cls: 'text-red-500 bg-red-500/10 border-red-500/30', bar: 'bg-red-500' },
  2: { label: 'URGENT', cls: 'text-orange-500 bg-orange-500/10 border-orange-500/30', bar: 'bg-orange-500' },
  3: { label: 'ROUTINE', cls: 'text-amber-500 bg-amber-500/10 border-amber-500/30', bar: 'bg-amber-500' },
  4: { label: 'LOW', cls: 'text-primary bg-primary/10 border-primary/30', bar: 'bg-primary' },
};

/* ── Agent definitions ── */
const AGENTS = [
  { id: '01', name: 'Triage Agent', task: 'Classifying urgency tier', stream: 'triage_result' },
  { id: '06', name: 'Smart EHR', task: 'Syncing medical history to record', stream: 'ehr_updated' },
  { id: '04', name: 'Risk Predictor', task: 'Calculating deterioration risk', stream: 'risk_score_updated' },
  { id: '02', name: 'Waitlist Agent', task: 'Optimising appointment queue', stream: 'appointment_scheduled' },
  { id: '13', name: 'LLM Synthesiser', task: 'Synthesising cross-agent reasoning', stream: null },
];

/* ── Small reusable pill/badge ── */
const Pill = ({ children, className = '' }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded border text-[10px] font-bold font-mono uppercase tracking-wider ${className}`}>
    {children}
  </span>
);

/* ── Section heading ── */
const SectionLabel = ({ children }) => (
  <p className="text-[10px] font-black font-mono uppercase tracking-[0.15em] text-muted-foreground/50 m-0 mb-3">{children}</p>
);

/* ── Risk bar ── */
const RiskBar = ({ label, value, colorClass }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between text-xs">
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="font-bold text-foreground font-mono">{Math.round(value * 100)}%</span>
    </div>
    <div className="h-1.5 w-full bg-border rounded overflow-hidden">
      <div className={`h-full rounded transition-all duration-700 ${colorClass}`}
        style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  </div>
);

/* ══════════════════════════════════════════
   STEP 1 — Input form
══════════════════════════════════════════ */
const StepInput = ({ symptoms, setSymptoms, duration, setDuration, severity, setSeverity, onSubmit }) => (
  <div className="flex flex-col gap-6">

    {/* Page header */}
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded flex items-center justify-center bg-primary/10 border border-primary/20 text-primary">
          <Logo variant='icon' />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-foreground m-0">Symptom Checker</h1>
          <p className="text-xs text-muted-foreground m-0 mt-0.5 font-mono">Powered by Triage Agent · 01</p>
        </div>
      </div>
    </div>

    {/* Form card */}
    <div className="rounded border border-border bg-card p-7 flex flex-col gap-7 shadow-sm">

      {/* Symptom textarea */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-foreground">Describe your symptoms</label>
        <textarea
          value={symptoms}
          onChange={e => setSymptoms(e.target.value)}
          rows={5}
          placeholder="e.g., I've been having a dull ache in my left knee for 3 days. It gets worse when I walk up stairs and feels stiff in the morning..."
          className="w-full p-4 rounded border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 transition-all duration-150 resize-none leading-relaxed"
        />
      </div>

      {/* Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Duration */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-primary">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M7 4v3l2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              Duration
            </label>
            <Pill className="text-primary bg-primary/10 border-primary/20">
              {duration[0]} {duration[0] === 1 ? 'day' : 'days'}
            </Pill>
          </div>
          <Slider id="slider-duration" value={duration} onValueChange={setDuration} min={1} max={30} step={1} />
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground/40 uppercase tracking-wider">
            <span>Acute · 1d</span><span>Chronic · 30d</span>
          </div>
        </div>

        {/* Severity */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-primary">
                <path d="M7 2v10M4 8l3 4 3-4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Severity
            </label>
            <Pill className={
              severity[0] >= 8 ? 'text-red-500 bg-red-500/10 border-red-500/20'
                : severity[0] >= 5 ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                  : 'text-primary bg-primary/10 border-primary/20'
            }>
              Level {severity[0]} / 10
            </Pill>
          </div>
          <Slider id="slider-severity" value={severity} onValueChange={setSeverity} min={1} max={10} step={1} />
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground/40 uppercase tracking-wider">
            <span>Mild · 1</span><span>Severe · 10</span>
          </div>
        </div>
      </div>
    </div>

    {/* Actions */}
    <div className="flex items-center justify-between gap-4">
      <button
        type="button"
        onClick={() => { setSymptoms(''); setDuration([3]); setSeverity([5]); }}
        className="px-5 h-10 rounded border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150 cursor-pointer bg-transparent"
      >
        Clear
      </button>
      <button
        type="button"
        disabled={!symptoms.trim()}
        onClick={onSubmit}
        className={[
          'flex items-center gap-2 px-8 h-11 rounded border text-sm font-semibold transition-all duration-200 cursor-pointer',
          symptoms.trim()
            ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.2)]'
            : 'bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50',
        ].join(' ')}
      >
        Initialise Analysis
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   STEP 2 — Live agent processing timeline
══════════════════════════════════════════ */
const StepProcessing = ({ agentStatuses, agentLogs, loading, onViewReport }) => (
  <div className="flex flex-col gap-6">

    {/* Header */}
    <div className="flex items-center gap-4">
      <Logo variant="icon" className='animate-spin' />
      <div>
        <h2 className="text-xl font-black tracking-tight text-foreground m-0">Clinical Engine Orchestrating</h2>
        <p className="text-xs text-muted-foreground m-0 font-mono">Agents processing in sequence — results stream live</p>
      </div>
    </div>

    {/* Agent timeline */}
    <div className="flex flex-col gap-0 rounded border border-border bg-card overflow-hidden">
      {AGENTS.map((agent, idx) => {
        const status = agentStatuses[agent.id];
        const logs = agentLogs[agent.id] || [];
        const isLast = idx === AGENTS.length - 1;

        return (
          <div key={agent.id} className={`relative flex gap-0 ${!isLast ? 'border-b border-border' : ''}`}>

            {/* Left column: dot + vertical connector line */}
            <div className="flex flex-col items-center shrink-0 pt-5 pb-0" style={{ width: '64px' }}>
              {/* Status dot */}
              <div className={[
                'w-9 h-9 rounded border-2 flex items-center justify-center transition-all duration-300 shrink-0',
                status === 'complete'
                  ? 'bg-primary border-primary text-primary-foreground shadow-[0_0_10px_hsl(var(--primary)/0.3)]'
                  : status === 'active'
                    ? 'bg-primary/10 border-primary text-primary'
                    : 'bg-muted border-border text-muted-foreground/40',
              ].join(' ')}>
                {status === 'complete' ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : status === 'active' ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                    style={{ animation: 'spin-slow 1.2s linear infinite' }}>
                    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" strokeDasharray="20 6" />
                  </svg>
                ) : (
                  <span className="text-[10px] font-black font-mono">{agent.id}</span>
                )}
              </div>

              {/* Vertical connector below dot — fills when done */}
              {!isLast && (
                <div className="flex-1 w-0.5 mt-2 bg-border rounded-full overflow-hidden" style={{ minHeight: '24px' }}>
                  <div
                    className="w-full bg-primary rounded-full transition-all duration-500"
                    style={{ height: status === 'complete' ? '100%' : '0%' }}
                  />
                </div>
              )}
            </div>

            {/* Right column: content */}
            <div className="flex-1 min-w-0 py-5 pr-5">
              {/* Agent name + id + status badge */}
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-sm font-bold ${status === 'pending' ? 'text-muted-foreground/35' : 'text-foreground'}`}>
                  {agent.name}
                </span>
                <span className="text-[10px] font-mono text-muted-foreground/35">· {agent.id}</span>
                {status === 'active' && (
                  <Pill className="text-primary bg-primary/10 border-primary/20 animate-pulse">Processing</Pill>
                )}
                {status === 'complete' && (
                  <Pill className="text-primary bg-primary/10 border-primary/20">Complete</Pill>
                )}
                {status === 'pending' && (
                  <Pill className="text-muted-foreground/30 bg-muted/50 border-border/50">Waiting</Pill>
                )}
              </div>

              {/* Task description */}
              <p className={`text-xs m-0 ${(status === 'active' || status === 'complete') ? 'mb-3 text-muted-foreground' : 'text-muted-foreground/30'}`}>
                {agent.task}
              </p>

              {/* Live log lines */}
              {(status === 'active' || status === 'complete') && logs.length > 0 && (
                <div className="rounded border border-border bg-background/70 p-3 flex flex-col gap-1">
                  {logs.map((line, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-primary/50 shrink-0 mt-px font-mono text-xs">›</span>
                      <span className={`text-[11px] font-mono leading-relaxed break-words min-w-0 ${i === logs.length - 1 && status === 'active' ? 'text-foreground' : 'text-muted-foreground/70'
                        }`}>
                        {line}
                      </span>
                    </div>
                  ))}
                  {/* Blinking cursor while active */}
                  {status === 'active' && (
                    <div className="flex items-center gap-2">
                      <span className="text-primary/50 font-mono text-xs">›</span>
                      <span className="inline-block w-1.5 h-3.5 bg-primary rounded"
                        style={{ animation: 'blink 1s step-end infinite' }} />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>

    {/* View report button — disabled until all done */}
    <div className="flex justify-end">
      <button
        onClick={onViewReport}
        disabled={loading}
        className={[
          'flex items-center gap-2 px-8 h-11 rounded border text-sm font-semibold transition-all duration-200',
          !loading
            ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.2)] cursor-pointer'
            : 'bg-muted text-muted-foreground border-border cursor-not-allowed opacity-50',
        ].join(' ')}
      >
        {loading ? (
          <>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
              style={{ animation: 'spin-slow 1.2s linear infinite' }}>
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.3" strokeDasharray="20 6" />
            </svg>
            Agents working…
          </>
        ) : (
          <>
            View Clinical Report
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   STEP 3 — Parsed results
══════════════════════════════════════════ */
const StepResults = ({ result, agentDetails, user, onRestart, navigate }) => {
  const tier = result?.tier || 3;
  const urgConf = URGENCY[tier] || URGENCY[3];
  const risk = agentDetails?.risk;
  const sched = agentDetails?.scheduler;
  const appt = sched?.current_queue?.[0];

  return (
    <div className="flex flex-col gap-6">

      {/* ── Urgency header card ── */}
      <div className="rounded border bg-card overflow-hidden"
        style={{ borderColor: tier <= 2 ? 'hsl(var(--destructive)/0.4)' : 'hsl(var(--border))' }}>
        {/* Colour accent bar */}
        <div className={`h-1.5 w-full ${urgConf.bar}`} />

        <div className="p-6 flex flex-col gap-5">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Pill className={urgConf.cls}>Urgency · {urgConf.label}</Pill>
                <span className="text-[10px] font-mono font-bold text-muted-foreground/40 uppercase tracking-widest">
                  Patient: {user?.first_name || 'Valued Patient'}
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight text-foreground m-0 leading-tight">
                {result.recommendation}
              </h2>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/40 bg-muted border border-border px-3 py-1 rounded">
              {new Date().toLocaleTimeString()} · Tier {tier}
            </span>
          </div>

          {/* Agent reasoning block */}
          <div className="rounded border border-primary/15 bg-primary/[0.04] p-4 flex gap-4">
            <div className="w-8 h-8 rounded bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                <circle cx="7.5" cy="7.5" r="6" stroke="currentColor" strokeWidth="1.3" />
                <path d="M7.5 4v3.5l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-black font-mono uppercase tracking-widest text-primary/70 m-0 mb-1">
                Synthesised Agent Reasoning
              </p>
              <p className="text-sm text-foreground leading-relaxed m-0">
                {Array.isArray(result.agentNote) ? result.agentNote[0] : result.agentNote}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── RAG context ── */}
      {Array.isArray(result.agentNote) && result.agentNote.length > 1 && (
        <div className="rounded border border-border bg-card p-5 flex flex-col gap-3">
          <SectionLabel>RAG Clinical Context Used</SectionLabel>
          <div className="flex flex-col gap-2">
            {result.agentNote.slice(1).map((line, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground font-mono">
                <span className="text-primary shrink-0">›</span>
                <span className="leading-relaxed">{line.replace('RAG Context used: ', '')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Risk analysis ── */}
      {risk && (
        <div className="rounded border border-border bg-card p-6 flex flex-col gap-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <SectionLabel>Risk Analysis · Agent 04</SectionLabel>
            <Pill className={
              risk.risk_tier?.toLowerCase() === 'high'
                ? 'text-red-500 bg-red-500/10 border-red-500/20'
                : risk.risk_tier?.toLowerCase() === 'medium'
                  ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                  : 'text-primary bg-primary/10 border-primary/20'
            }>
              {risk.risk_tier || 'Low'} Risk
            </Pill>
          </div>

          {/* SBAR narrative */}
          <p className="text-sm text-muted-foreground leading-relaxed m-0">
            {risk.narrative_summary}
          </p>

          {/* Risk bars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <RiskBar label="Deterioration" value={risk.deterioration_risk || 0}
              colorClass={risk.deterioration_risk > 0.5 ? 'bg-red-500' : risk.deterioration_risk > 0.25 ? 'bg-amber-500' : 'bg-primary'} />
            <RiskBar label="Readmission" value={risk.readmission_risk || 0}
              colorClass={risk.readmission_risk > 0.5 ? 'bg-red-500' : risk.readmission_risk > 0.25 ? 'bg-amber-500' : 'bg-primary'} />
            <RiskBar label="Complication" value={risk.complication_risk || 0}
              colorClass={risk.complication_risk > 0.5 ? 'bg-red-500' : risk.complication_risk > 0.25 ? 'bg-amber-500' : 'bg-primary'} />
          </div>

          {/* Interventions */}
          {risk.recommended_interventions?.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground/50">
                Recommended Interventions
              </p>
              <div className="flex flex-col gap-1">
                {risk.recommended_interventions.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Appointment / Scheduler ── */}
      {appt && (
        <div className="rounded border border-border bg-card p-6 flex flex-col gap-4">
          <SectionLabel>Appointment · Agent 02 · Waitlist Optimised</SectionLabel>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { l: 'Doctor', v: appt.doctor_name || 'DR-101' },
              { l: 'Priority', v: `#${appt.priority_rank} in queue` },
              { l: 'Est. Wait', v: `${appt.estimated_wait_time} min` },
              { l: 'Slot', v: new Date(appt.slot).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) },
            ].map(({ l, v }) => (
              <div key={l} className="rounded border border-border bg-background/60 p-3 flex flex-col gap-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/50">{l}</span>
                <span className="text-sm font-semibold text-foreground">{v}</span>
              </div>
            ))}
          </div>

          {sched?.optimization_reasoning && (
            <div className="rounded border border-border bg-muted/30 p-3">
              <p className="text-[10px] font-bold font-mono uppercase tracking-widest text-muted-foreground/50 m-0 mb-1">
                Scheduling Reasoning
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed m-0">
                {sched.optimization_reasoning.slice(0, 280)}{sched.optimization_reasoning.length > 280 ? '…' : ''}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── ICD-10 hints ── */}
      {result.icd10Hints?.length > 0 && (
        <div className="rounded border border-border bg-card p-5 flex flex-col gap-3">
          <SectionLabel>ICD-10 Hints</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {result.icd10Hints.map((hint, i) => (
              <Pill key={i} className="text-foreground bg-muted border-border lowercase first-letter:uppercase">
                {typeof hint === 'object' ? `${hint.code}: ${hint.description}` : hint}
              </Pill>
            ))}
          </div>
        </div>
      )}

      {/* ── Drug alerts ── */}
      {result.drugAlerts?.length > 0 && (
        <div className="rounded border border-red-500/20 bg-red-500/5 p-5 flex flex-col gap-3">
          <SectionLabel>Drug Alerts · Agent 01</SectionLabel>
          <div className="flex flex-col gap-1.5">
            {result.drugAlerts.map((a, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-red-500 font-medium">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M6 1L11 10H1L6 1z" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M6 5v2M6 8.5v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                {a}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA buttons ── */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button
          onClick={() => navigate('/portal/book')}
          className=" rounded border border-primary bg-primary text-primary-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all hover:shadow-[0_0_0_3px_hsl(var(--primary)/0.2)] cursor-pointer"
        >
          Book Consultation
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Button>
        <Button
          onClick={() => navigate('/portal/chat')}
          className=" rounded border border-border bg-background text-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:bg-accent transition-all cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 3h10v7H8l-3 2V10H2V3z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
          </svg>
          Chat with Health Assistant
        </Button>
      </div>

      {/* Restart */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onRestart}
          className="text-xs font-mono text-muted-foreground/50 hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center gap-1.5"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M10 6A4 4 0 1 1 6 2M6 2l-2 2 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Restart diagnostic check
        </button>
        <span className="text-[10px] font-mono text-muted-foreground/25 uppercase tracking-widest">
          ClinicAI Fleet v4.2
        </span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
const Symptoms = () => {
  const { token, user } = useAuth();
  const { lastMessage } = useEventBus();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState([3]);
  const [severity, setSeverity] = useState([5]);

  const [agentStatuses, setAgentStatuses] = useState({
    '01': 'pending', '06': 'pending', '04': 'pending', '13': 'pending', '02': 'pending',
  });
  const [agentLogs, setAgentLogs] = useState({
    '01': [], '06': [], '04': [], '13': [], '02': [],
  });
  const [agentDetails, setAgentDetails] = useState({
    triage: null, ehr: null, risk: null, scheduler: null,
  });

  /* ── Helper: append a log line to an agent (if not duplicate) ── */
  const addLog = (agentId, line) =>
    setAgentLogs(prev => {
      const logs = prev[agentId] || [];
      if (logs[logs.length - 1] === line) return prev;
      return { ...prev, [agentId]: [...logs, line] };
    });

  /* ── Listen to event-bus for live agent updates ── */
  useEffect(() => {
    if (!lastMessage || step !== 2) return;
    const { stream, data } = lastMessage;
    const pid = user?.patient_id || user?.id;

    const isTarget = data.patient_id === pid ||
      (data.last_event && data.last_event.patient_id === pid);
    if (!isTarget) return;

    if (stream === 'triage_result') {
      setAgentStatuses(prev => ({ ...prev, '01': 'complete', '06': (prev['06'] === 'complete' ? 'complete' : 'active'), '13': (prev['13'] === 'complete' ? 'complete' : 'active') }));
      setAgentDetails(prev => ({ ...prev, triage: data }));
      addLog('01', `Urgency tier: ${data.urgency_tier} — ${data.urgency_label}`);
      addLog('01', `Summary: ${(data.triage_summary || '').slice(0, 120)}…`);
      addLog('01', `Action: ${data.recommended_action}`);
      addLog('06', 'Received triage result — committing to EHR…');
      addLog('13', 'Triage reasoning received — cross-referencing RAG context…');
    }

    if (stream === 'ehr_updated') {
      setAgentStatuses(prev => ({ ...prev, '06': 'complete', '04': (prev['04'] === 'complete' ? 'complete' : 'active') }));
      setAgentDetails(prev => ({ ...prev, ehr: data }));
      addLog('06', `EHR sync status: ${data.status}`);
      addLog('06', `Last event committed: ${data.last_event?.urgency_label || 'appointment_scheduled'}`);
      addLog('04', 'EHR synchronised — calculating patient risk scores…');
    }

    if (stream === 'risk_score_updated') {
      setAgentStatuses(prev => ({ ...prev, '04': 'complete', '02': (prev['02'] === 'complete' ? 'complete' : 'active') }));
      setAgentDetails(prev => ({ ...prev, risk: data }));
      addLog('04', `Risk tier: ${data.risk_tier}`);
      const metrics = `Deterioration: ${Math.round((data.deterioration_risk || 0) * 100)}% Readmission: ${Math.round((data.readmission_risk || 0) * 100)}% Complication: ${Math.round((data.complication_risk || 0) * 100)}%`;
      addLog('04', metrics);
      // Replace ID with Name in narrative
      const pName = user?.name || user?.first_name || 'Patient';
      const narrative = (data.narrative_summary || '').replaceAll(pid, pName).replace(`Patient ${pName}`, pName);
      addLog('04', narrative.slice(0, 120) || '');
      if (agentStatuses['02'] !== 'complete') {
        addLog('02', 'Risk score received — optimising appointment queue…');
      }
    }

    if (stream === 'appointment_scheduled') {
      setAgentStatuses(prev => ({ ...prev, '02': 'complete', '13': 'complete' }));
      setAgentDetails(prev => ({ ...prev, scheduler: data }));
      const appt = data.current_queue?.[0];
      if (appt) {
        addLog('02', `Assigned: ${appt.doctor_name || 'Clinical Lead'}`);
        addLog('02', `Slot: ${new Date(appt.slot).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}`);
        addLog('02', `Priority rank: #${appt.priority_rank} · Est. wait: ${appt.estimated_wait_time} min`);
      }
      addLog('13', 'All agent outputs received — synthesis complete.');
      setLoading(false);
    }
  }, [lastMessage, step, user]);

  /* ── Trigger analysis on step 2 ── */
  useEffect(() => {
    if (step === 2) runAnalysis();
  }, [step]);

  const runAnalysis = async () => {
    setLoading(true);
    setAgentStatuses({ '01': 'active', '06': 'pending', '04': 'pending', '13': 'pending', '02': 'pending' });
    setAgentLogs({ '01': [], '06': [], '04': [], '13': [], '02': [] });
    addLog('01', `Symptoms received — analysing "${symptoms.slice(0, 60)}…"`);
    addLog('01', `Duration: ${duration[0]} day(s) · Severity: ${severity[0]}/10`);

    try {
      const res = await fetch('http://localhost:5000/api/triage/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          patient_id: user?.patient_id || user?.id,
          symptoms, severity: severity[0], duration: duration[0],
        }),
      });
      const data = await res.json();
      setAgentDetails(prev => ({ ...prev, triage: data }));
      setResult({
        urgency: data.urgency_label || 'ROUTINE',
        tier: data.urgency_tier || 3,
        recommendation: data.recommended_action || 'Seek medical evaluation.',
        agentNote: data.reasoning || [],
        icd10Hints: data.icd10_hints || [],
        drugAlerts: data.drug_alerts || [],
        requiresAlert: data.requires_alert || false,
        timestamp: data.timestamp,
        triageId: data.triage_id,
      });

      /* Fallback: if event bus doesn't fire, mark all complete after 12s */
      setTimeout(() => {
        setAgentStatuses(prev => {
          const allDone = { ...prev };
          Object.keys(allDone).forEach(k => { allDone[k] = 'complete'; });
          return allDone;
        });
        setLoading(false);
      }, 12000);

    } catch (err) {
      console.error('Triage error', err);
      setResult({
        urgency: 'ROUTINE', tier: 3,
        recommendation: 'Check in with a healthcare provider soon.',
        agentNote: ['Automatic analysis unavailable. Please contact the clinic directly.'],
        icd10Hints: [], drugAlerts: [], requiresAlert: false,
      });
      addLog('01', 'Connection error — using fallback result.');
      setAgentStatuses({ '01': 'complete', '06': 'pending', '04': 'pending', '13': 'pending', '02': 'pending' });
      setLoading(false);
    }
  };

  const allAgentsDone = Object.values(agentStatuses).every(s => s === 'complete');

  return (
    <div className="w-full max-w-6xl mx-auto pb-16">
      <style>{`
        @keyframes spin-slow { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0;} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px);} to{opacity:1;transform:translateY(0);} }
        .au { animation: fadeUp 0.5s ease both; }
      `}</style>
      <div className="gw-grid-bg" />
      <div className="gw-glow" />

      {/* Back nav */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground/50">
          <span>Portal</span>
          <span>›</span>
          <span className="text-foreground font-semibold">Symptom Checker</span>
        </div>
        <button
          onClick={() => navigate('/portal')}
          className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground/50 hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M10 6H2M6 2l-4 4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Hub
        </button>
      </div>

      {/* Steps */}
      <div className="au">
        {step === 1 && (
          <StepInput
            symptoms={symptoms} setSymptoms={setSymptoms}
            duration={duration} setDuration={setDuration}
            severity={severity} setSeverity={setSeverity}
            onSubmit={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepProcessing
            agentStatuses={agentStatuses}
            agentLogs={agentLogs}
            loading={loading || !allAgentsDone}
            onViewReport={() => result && setStep(3)}
          />
        )}

        {step === 3 && result && (
          <StepResults
            result={result}
            agentDetails={agentDetails}
            user={user}
            onRestart={() => {
              setStep(1); setResult(null);
              setSymptoms(''); setDuration([3]); setSeverity([5]);
              setAgentStatuses({ '01': 'pending', '06': 'pending', '04': 'pending', '13': 'pending', '02': 'pending' });
              setAgentLogs({ '01': [], '06': [], '04': [], '13': [], '02': [] });
              setAgentDetails({ triage: null, ehr: null, risk: null, scheduler: null });
            }}
            navigate={navigate}
          />
        )}

        {step === 3 && !result && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" className="text-primary"
              style={{ animation: 'spin-slow 2s linear infinite' }}>
              <circle cx="18" cy="18" r="15" stroke="currentColor" strokeWidth="2" strokeDasharray="50 20" />
            </svg>
            <p className="text-sm text-muted-foreground font-mono">Finalising clinical report…</p>
            <button onClick={() => setStep(2)}
              className="text-xs font-mono text-muted-foreground/50 hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0">
              ← Return to analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Symptoms;