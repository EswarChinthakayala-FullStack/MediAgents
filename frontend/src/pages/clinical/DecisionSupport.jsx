import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import {
    BrainCircuit,
    AlertTriangle,
    CheckCircle2,
    ExternalLink,
    ChevronRight,
    ArrowLeft,
    Lightbulb,
    Search,
    Dna,
    ShieldAlert,
    BookOpen,
    Loader2,
    Activity
} from 'lucide-react';

const DecisionSupport = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [decisionData, setDecisionData] = useState(null);

    useEffect(() => {
        // Simulating Agent 05 call: GET /api/decision/{id} with WebSocket push
        setTimeout(() => {
            setDecisionData({
                primaryImpression: 'Possible Acute Coronary Syndrome',
                confidence: 84,
                differentials: [
                    { condition: 'Unstable Angina', probability: 78, reasoning: 'Strong correlation with chest pain and rising troponin markers.', evidenceCount: 12 },
                    { condition: 'Gastroesophageal Reflux (GERD)', probability: 22, reasoning: 'Symptom similarity noted, but vital anomalies suggest cardiac origin.', evidenceCount: 4 },
                    { condition: 'Pulmonary Embolism', probability: 12, reasoning: 'Low probability based on current d-dimer and respiratory data.', evidenceCount: 3 }
                ],
                alerts: [
                    { type: 'critical', title: 'High Cardiovascular Risk', desc: 'Predictive model (Agent 04) indicates 45% risk increase for major adverse event within 48h.' },
                    { type: 'warning', title: 'Drug Interaction', desc: 'Patient current Lisinopril may interact with planned Ibuprofen therapy. Recommend Naproxen alternative.' }
                ],
                checklist: [
                    { item: 'Immediate 12-lead ECG', completed: true },
                    { item: 'Serial Troponin mapping (T+2h, T+4h)', completed: false },
                    { item: 'Diagnostic Echocardiogram', completed: false },
                    { item: 'Verify Anticoagulant Status', completed: true }
                ],
                evidence: [
                    { source: 'Lancet Digital Health (2023)', title: 'AI in Cardiac Triage' },
                    { source: 'AHA Guidelines', title: 'Management of Acute Chest Pain' },
                    { source: 'Internal Knowledge Base', title: 'Similar Patient Cohort #412' }
                ]
            });
            setLoading(false);
        }, 1200);
    }, [id]);

    if (loading) return (
        <div className="h-[70vh] flex flex-col items-center justify-center gap-6">
            <div className="relative">
                <BrainCircuit className="text-primary animate-pulse" size={48} />
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
            </div>
            <div className="text-center">
                <p className="text-sm font-black uppercase tracking-[0.2em] mb-2 text-foreground">Querying Diagnostic Oracle</p>
                <p className="text-[10px] text-muted-foreground italic font-medium max-w-xs px-10">Agent 05 is orchestrating multi-agent analysis including genomic, longitudinal EHR, and real-time vital telemetry streams...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header / Primary Impression */}
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between border-b border-border/10 pb-6">
                <div className="flex items-center gap-4">
                    <Link to={`/clinical/patient/${id}`} className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-black tracking-tight uppercase">AI CLINICAL INSIGHTS</h1>
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black tracking-wider uppercase rounded-sm h-5">Agent 05: Active</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase opacity-60">Cross-referencing global clinical knowledge nodes for ID: {id}</p>
                    </div>
                </div>

                <Card className="w-full md:w-80 bg-primary/5 border-primary/20 shadow-none overflow-hidden group">
                    <div className="p-4 flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Primary Prediction</span>
                            <span className="text-[10px] font-black font-mono text-primary">{decisionData.confidence}% CL</span>
                        </div>
                        <h2 className="text-lg font-black tracking-tight text-foreground leading-tight italic">"{decisionData.primaryImpression}"</h2>
                        <Progress value={decisionData.confidence} className="h-1 bg-primary/10" indicatorClassName="bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Differential Diagnosis Column */}
                <div className="xl:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <Lightbulb className="text-amber-500" size={16} />
                            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">Weighted Differentials</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {decisionData.differentials.map((diff, i) => (
                                <Card key={i} className="bg-card/40 border-border/40 hover:bg-card/60 hover:border-border/80 transition-all group overflow-hidden">
                                    <div className={`h-1 w-full bg-primary/${Math.max(10, diff.probability)}`} />
                                    <CardHeader className="py-4 px-5">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-base font-bold tracking-tight text-foreground">{diff.condition}</CardTitle>
                                            <span className="text-xs font-black font-mono text-primary">{diff.probability}%</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="px-5 pb-5">
                                        <p className="text-[11px] text-muted-foreground italic leading-relaxed mb-4">"{diff.reasoning}"</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                                                <BookOpen size={10} />
                                                {diff.evidenceCount} Citations
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-7 text-[9px] font-bold uppercase tracking-widest gap-1 hover:text-primary">
                                                Review Data <ChevronRight size={10} />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                            <ShieldAlert className="text-destructive" size={16} />
                            <h3 className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">Safety Alerts & Intervention Suggestions</h3>
                        </div>
                        <div className="space-y-3">
                            {decisionData.alerts.map((alert, i) => (
                                <div key={i} className={`flex items-start gap-4 p-5 rounded-xl border ${alert.type === 'critical' ? 'bg-destructive/10 border-destructive/20' : 'bg-amber-500/10 border-amber-500/20'
                                    }`}>
                                    <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${alert.type === 'critical' ? 'bg-destructive/20 text-destructive' : 'bg-amber-500/20 text-amber-500'
                                        }`}>
                                        <AlertTriangle size={16} />
                                    </div>
                                    <div>
                                        <h4 className={`text-[11px] font-black uppercase tracking-widest mb-1 ${alert.type === 'critical' ? 'text-destructive' : 'text-amber-500'
                                            }`}>{alert.title}</h4>
                                        <p className="text-xs text-muted-foreground italic leading-relaxed">{alert.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Checklist & Evidence Column */}
                <div className="space-y-8">
                    <Card className="border-border/50 bg-secondary/10 shadow-none">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <CheckCircle2 className="text-emerald-500" size={14} /> Recommended Actions
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold tracking-tight opacity-50">Validation required by attending MD</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {decisionData.checklist.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/20 group">
                                    <span className={`text-[11px] font-medium ${item.completed ? 'text-emerald-500 italic' : 'text-foreground'}`}>
                                        {item.item}
                                    </span>
                                    {item.completed ? (
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                    ) : (
                                        <div className="h-4 w-4 rounded border-2 border-border/50 group-hover:border-primary/50 cursor-pointer" />
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-background/30 shadow-none border-dashed">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Search className="text-primary" size={14} /> Evidence Artifacts
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {decisionData.evidence.map((ev, i) => (
                                <div key={i} className="p-3 rounded-lg border border-border/10 bg-secondary/5 flex flex-col gap-1 hover:border-primary/30 transition-all cursor-pointer group">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-primary/60">{ev.source}</span>
                                    <p className="text-[11px] font-bold tracking-tight text-foreground flex items-center justify-between">
                                        {ev.title}
                                        <ExternalLink size={10} className="opacity-0 group-hover:opacity-60 transition-opacity" />
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-black tracking-[0.3em] uppercase opacity-30 mt-6 pt-4 border-t border-border/10">
                <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin text-primary" size={12} /> Live Optimization Cycle: 2s
                </span>
                <span>FEDERATED CLINICAL INTELLIGENCE LAYER</span>
            </div>
        </div>
    );
};

export default DecisionSupport;
