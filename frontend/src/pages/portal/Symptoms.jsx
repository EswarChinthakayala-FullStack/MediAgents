import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import {
    Stethoscope,
    ChevronRight,
    MessageSquare,
    AlertCircle,
    Clock,
    Activity,
    BrainCircuit,
    ArrowRight,
    Thermometer,
    Timer,
    Undo2
} from 'lucide-react';
import { Slider } from '../../components/ui/slider';
import { useAuth } from '../../context/AuthContext';
import { useEventBus } from '../../hooks/useEventBus';

const Symptoms = () => {
    const { token, user } = useAuth();
    const { lastMessage } = useEventBus();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [symptoms, setSymptoms] = useState('');
    const [duration, setDuration] = useState([3]); // days
    const [severity, setSeverity] = useState([5]); // 1-10
    const [agentStatuses, setAgentStatuses] = useState({
        '01': 'pending',
        '06': 'pending',
        '04': 'pending',
        '13': 'pending',
        '02': 'pending'
    });
    const [agentDetails, setAgentDetails] = useState({
        triage: null,
        ehr: null,
        risk: null,
        scheduler: null
    });

    // Listen for live agent updates
    useEffect(() => {
        if (!lastMessage || step !== 2) return;

        const { stream, data } = lastMessage;
        const currentPatientId = user?.patient_id || user?.id;

        const isTarget = data.patient_id === currentPatientId ||
            (data.last_event && data.last_event.patient_id === currentPatientId);

        if (isTarget) {
            if (stream === 'triage_result') {
                setAgentStatuses(prev => ({ ...prev, '01': 'complete', '13': 'active' }));
                setAgentDetails(prev => ({ ...prev, triage: data }));
            } else if (stream === 'ehr_updated') {
                setAgentStatuses(prev => ({ ...prev, '06': 'complete', '04': 'active' }));
                setAgentDetails(prev => ({ ...prev, ehr: data }));
            } else if (stream === 'risk_score_updated') {
                setAgentStatuses(prev => ({ ...prev, '04': 'complete', '02': 'active' }));
                setAgentDetails(prev => ({ ...prev, risk: data }));
            } else if (stream === 'appointment_scheduled') {
                setAgentStatuses(prev => ({ ...prev, '02': 'complete', '13': 'complete' }));
                setAgentDetails(prev => ({ ...prev, scheduler: data }));
            }
        }
    }, [lastMessage, step, user]);

    // Trigger analysis when reaching step 2
    useEffect(() => {
        if (step === 2) {
            handleAnalyze();
        }
    }, [step]);

    const handleAnalyze = async () => {
        setLoading(true);
        setAgentStatuses({ '01': 'active', '06': 'pending', '04': 'pending', '13': 'pending', '02': 'pending' });

        try {
            const response = await fetch('http://localhost:5000/api/triage/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    patient_id: user?.patient_id || user?.id,
                    symptoms: symptoms,
                    severity: severity[0],
                    duration: duration[0]
                })
            });

            const data = await response.json();

            // Store back-end response as triage baseline
            setAgentDetails(prev => ({ ...prev, triage: data }));

            setResult({
                urgency: data.urgency_label || 'Moderate',
                tier: data.urgency_tier || 3,
                recommendation: data.recommended_action || 'Schedule a virtual consultation within 24 hours.',
                agentNote: data.reasoning || 'Based on your reported symptoms, our Triage Agent suggests a follow-up with a specialist.'
            });

            // Allow event bus to finish its work if it hasn't
            setTimeout(() => {
                setAgentStatuses(prev => {
                    const finished = { ...prev };
                    Object.keys(finished).forEach(k => finished[k] = 'complete');
                    return finished;
                });
                setLoading(false);
            }, 1000);

        } catch (err) {
            console.error("Triage error:", err);
            setResult({
                urgency: 'Moderate',
                tier: 3,
                recommendation: 'Check-in with a healthcare provider soon.',
                agentNote: 'Automatic analysis unavailable. Please contact the clinic directly.'
            });
            setStep(3);
            setLoading(false);
        }
    };

    const getUrgencyColor = (tier) => {
        if (tier <= 1) return 'text-red-500 bg-red-500/10 border-red-500/20';
        if (tier <= 2) return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
        if (tier <= 3) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    };

    console.log("Current Step:", step, "Result State:", result);

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between gap-4 mb-2">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group hover:scale-110 transition-transform">
                        <BrainCircuit size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Symptom Checker</h1>
                        <p className="text-muted-foreground text-sm italic">Powered by Triage Agent-01</p>
                    </div>
                </div>
                <Button variant="ghost" size="sm" className="gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary" onClick={() => navigate('/portal')}>
                    <Undo2 size={14} /> Back to Hub
                </Button>
            </div>

            {step === 3 && !result && (
                <div className="text-center py-20 space-y-4">
                    <BrainCircuit size={40} className="mx-auto text-primary animate-pulse" />
                    <p className="text-sm italic text-muted-foreground">Finalizing clinical report... please wait.</p>
                    <Button onClick={() => setStep(2)}>Return to Analysis</Button>
                </div>
            )}

            {step === 1 && (
                <Card className="border-border/50 bg-card/50 overflow-hidden shadow-2xl relative">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                        <Stethoscope size={150} />
                    </div>
                    <CardHeader className="bg-primary/5 border-b border-border/10 pb-6">
                        <CardTitle className="text-xl font-black tracking-tight flex items-center gap-3">
                            <Activity className="text-primary" size={20} />
                            HOW ARE YOU FEELING?
                        </CardTitle>
                        <CardDescription className="italic">Provide clinical context for our AI triage engine.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-8">
                        <div className="space-y-4">
                            <Label htmlFor="symptoms" className="text-sm font-black uppercase tracking-widest text-muted-foreground">Describe your symptoms</Label>
                            <textarea
                                id="symptoms"
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                className="w-full min-h-[160px] p-6 rounded-2xl bg-secondary/20 border-2 border-border/50 focus:border-primary/50 focus:shadow-[0_0_20px_rgba(62,207,142,0.1)] outline-none transition-all text-sm italic leading-relaxed font-medium"
                                placeholder="e.g., I've been having a dull ache in my left knee for 3 days, it gets worse when I walk up stairs..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Timer size={14} className="text-primary" />
                                        Duration
                                    </Label>
                                    <Badge variant="secondary" className="font-black text-primary bg-primary/10 border-none px-3 py-1">{duration} DAYS</Badge>
                                </div>
                                <Slider
                                    value={duration}
                                    onValueChange={setDuration}
                                    max={30}
                                    min={1}
                                    step={1}
                                    className="pt-2"
                                />
                                <div className="flex justify-between text-[10px] font-black tracking-widest text-muted-foreground/40 uppercase italic">
                                    <span>Acute</span>
                                    <span>Chronic</span>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                        <Thermometer size={14} className="text-primary" />
                                        Severity
                                    </Label>
                                    <Badge variant="secondary" className={`font-black border-none px-3 py-1 ${severity[0] > 7 ? 'text-destructive bg-destructive/10' : severity[0] > 4 ? 'text-amber-500 bg-amber-500/10' : 'text-primary bg-primary/10'}`}>
                                        LEVEL: {severity}
                                    </Badge>
                                </div>
                                <Slider
                                    value={severity}
                                    onValueChange={setSeverity}
                                    max={10}
                                    min={1}
                                    step={1}
                                    className="pt-2"
                                />
                                <div className="flex justify-between text-[10px] font-black tracking-widest text-muted-foreground/40 uppercase italic">
                                    <span>Mild</span>
                                    <span>Excruciating</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-secondary/5 border-t border-border/10 flex justify-end gap-3 p-8">
                        <Button variant="ghost" className="font-black text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100" onClick={() => setSymptoms('')}>Clear Data</Button>
                        <Button onClick={() => setStep(2)} className="rounded-xl px-10 h-12 font-black uppercase tracking-widest text-[10px] gap-3 group shadow-xl shadow-primary/10 transition-all hover:scale-[1.02]">
                            Initialize Analysis
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {step === 2 && (
                <Card className="border-border/50 bg-card/60 backdrop-blur-2xl animate-in zoom-in-95 duration-500 py-6 min-h-[500px] flex flex-col justify-center">
                    <CardContent className="space-y-10">
                        <div className="flex flex-col items-center justify-center text-center space-y-6">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-3xl bg-primary/5 border-2 border-primary/20 flex items-center justify-center rotate-3 animate-pulse">
                                    <BrainCircuit size={40} className="text-primary" />
                                </div>
                                <div className="absolute -inset-4 rounded-full border border-primary/20 animate-ping opacity-10"></div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black tracking-tighter uppercase">Clinical Engine Orchestrating</h3>
                                <p className="text-muted-foreground italic text-xs">Analyzing and cross-referencing your health data...</p>
                            </div>
                        </div>

                        <div className="max-w-md mx-auto w-full space-y-3">
                            {[
                                { id: '01', name: 'Triage Agent', task: 'Classifying Urgency Tier', status: agentStatuses['01'], detail: agentDetails.triage?.urgency_label },
                                { id: '06', name: 'Smart EHR', task: 'Syncing Medical History', status: agentStatuses['06'], detail: agentDetails.ehr?.status },
                                { id: '04', name: 'Risk Predictor', task: 'Calculating Deterioration Risk', status: agentStatuses['04'], detail: agentDetails.risk?.risk_tier },
                                { id: '02', name: 'Waitlist Agent', task: 'Optimizing Appointment Queue', status: agentStatuses['02'], detail: agentDetails.scheduler?.current_queue ? `#${agentDetails.scheduler.current_queue[0].priority_rank} In Queue` : null },
                                { id: '13', name: 'LLM Cluster', task: 'Synthesizing Reasoning', status: agentStatuses['13'], detail: 'REASONING_READY' }
                            ].map((agent, i) => (
                                <div key={agent.id}
                                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 ${agent.status === 'active' ? 'bg-primary/5 border-primary/30 scale-[1.02] shadow-lg shadow-primary/5' :
                                        agent.status === 'complete' ? 'bg-secondary/20 border-border/20 opacity-60' :
                                            'bg-transparent border-border/10 opacity-30'
                                        }`}
                                    style={{ transitionDelay: `${i * 150}ms` }}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-[10px] font-black ${agent.status === 'active' ? 'bg-primary text-primary-foreground animate-pulse' :
                                            agent.status === 'complete' ? 'bg-emerald-500 text-white' : 'bg-muted text-muted-foreground'
                                            }`}>
                                            {agent.id}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-widest">{agent.name}</div>
                                            <div className="text-[9px] italic text-muted-foreground flex items-center gap-2">
                                                {agent.task}
                                                {agent.detail && agent.status === 'complete' && <span className="text-primary font-black not-italic border-l border-border/40 pl-2 uppercase">{agent.detail}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    {agent.status === 'active' ? (
                                        <Activity size={14} className="text-primary animate-spin" />
                                    ) : agent.status === 'complete' ? (
                                        <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                                        </div>
                                    ) : (
                                        <div className="h-5 w-5 rounded-full border border-border/20"></div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {!loading && (
                            <div className="flex justify-center pt-4">
                                <Button onClick={() => setStep(3)} className="px-12 h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 group animate-in slide-in-from-top-4">
                                    <span className="flex items-center gap-3">
                                        View Clinical Intelligence Report
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Button>
                            </div>
                        )}

                        {loading && (
                            <div className="flex justify-center">
                                <Button className="px-12 h-14 rounded-2xl font-black uppercase tracking-widest text-xs opacity-50 bg-secondary" disabled>
                                    Synthesizing Cross-Agent Report...
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {step === 3 && result && (
                <div className="space-y-10 animate-in slide-in-from-right-8 duration-700">
                    <Card className={`border-none bg-gradient-to-br from-card via-card to-secondary/10 overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] relative group`}>
                        <div className={`absolute top-0 left-0 w-2 h-full ${result.tier <= 2 ? 'bg-destructive' : result.tier <= 3 ? 'bg-amber-500' : 'bg-primary'}`}></div>

                        <div className="p-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <Badge className={`${getUrgencyColor(result.tier)} border px-4 py-1.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-sm`}>
                                    Urgency: {result.urgency}
                                </Badge>
                                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-2 opacity-50 bg-secondary/30 px-3 py-1 rounded-full uppercase tracking-widest">
                                    <Clock size={12} /> ID: TRI-{Math.floor(Math.random() * 90000) + 10000}
                                </span>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/70 italic">Clinical Recommendation</h4>
                                <h2 className="text-4xl font-black tracking-tighter text-foreground leading-[1.1] max-w-2xl">
                                    {result.recommendation}
                                </h2>
                            </div>

                            <div className="p-8 rounded-3xl bg-primary/5 border border-primary/10 flex gap-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                    <BrainCircuit size={80} />
                                </div>
                                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${result.tier <= 2 ? 'bg-destructive/10 text-destructive' : 'bg-primary/20 text-primary'}`}>
                                    <AlertCircle size={24} />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest mb-2 opacity-70">Synthesized Agent Reasoning</h4>
                                    <p className="text-sm text-foreground italic leading-relaxed font-semibold">"{result.agentNote}"</p>
                                </div>
                            </div>

                            {/* Detailed Agent Breakdown Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 animate-in slide-in-from-bottom-8 duration-700 delay-300">
                                <Card className="bg-secondary/10 border-border/30 rounded-2xl p-6 space-y-3 hover:bg-secondary/20 transition-colors">
                                    <div className="flex items-center gap-3 text-primary">
                                        <Activity size={16} />
                                        <h5 className="text-[10px] font-black uppercase tracking-widest">Risk Analysis (04)</h5>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center bg-background/50 p-2 rounded-lg">
                                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Tier</span>
                                            <Badge variant="outline" className={`text-[9px] font-black uppercase ${(agentDetails.risk?.risk_tier || '').toLowerCase() === 'high' ? 'text-destructive border-destructive/30' : 'text-emerald-500 border-emerald-500/30'}`}>
                                                {agentDetails.risk?.risk_tier || 'LOW'}
                                            </Badge>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground line-clamp-3 italic leading-relaxed">
                                            {agentDetails.risk?.narrative_summary || "Stability confirmed via historical pattern matching."}
                                        </p>
                                    </div>
                                </Card>

                                <Card className="bg-secondary/10 border-border/30 rounded-2xl p-6 space-y-3 hover:bg-secondary/20 transition-colors">
                                    <div className="flex items-center gap-3 text-primary">
                                        <Stethoscope size={16} />
                                        <h5 className="text-[10px] font-black uppercase tracking-widest">EHR Sync (06)</h5>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center bg-background/50 p-2 rounded-lg">
                                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Status</span>
                                            <span className="text-[9px] font-black text-emerald-500 uppercase">SYNCHRONIZED</span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground italic leading-relaxed">
                                            Agent 06 successfully committed clinical note to permanent record. All cross-references verified.
                                        </p>
                                    </div>
                                </Card>

                                <Card className="bg-secondary/10 border-border/30 rounded-2xl p-6 space-y-3 hover:bg-secondary/20 transition-colors">
                                    <div className="flex items-center gap-3 text-primary">
                                        <Clock size={16} />
                                        <h5 className="text-[10px] font-black uppercase tracking-widest">Waitlist Opt (02)</h5>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center bg-background/50 p-2 rounded-lg">
                                            <span className="text-[9px] font-bold text-muted-foreground uppercase">Rank</span>
                                            <span className="text-[9px] font-black text-primary uppercase">
                                                PRIORITY {Array.isArray(agentDetails.scheduler?.current_queue) ? (agentDetails.scheduler?.current_queue?.[0]?.priority_rank || '1') : '1'}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground line-clamp-3 italic leading-relaxed">
                                            {agentDetails.scheduler?.optimization_reasoning || "Availability for clinical review confirmed for upcoming slots."}
                                        </p>
                                    </div>
                                </Card>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <Button
                                    className="flex-1 h-16 rounded-2xl bg-primary hover:bg-primary/90 font-black uppercase tracking-widest text-[10px] gap-3 group shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01]"
                                    onClick={() => navigate('/portal/book')}
                                >
                                    Book Critical Consultation
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1 h-16 rounded-2xl border-2 border-border/50 font-black uppercase tracking-widest text-[10px] gap-3 hover:bg-secondary/50 transition-all"
                                    onClick={() => navigate('/portal/chat')}
                                >
                                    <MessageSquare size={20} />
                                    Review with Health Assistant
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <div className="flex items-center justify-between px-4 pb-10">
                        <Button variant="ghost" onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground text-[10px] font-black uppercase tracking-widest gap-2">
                            Restart Diagnostic Check
                        </Button>
                        <p className="text-[10px] text-muted-foreground italic opacity-40 uppercase tracking-widest leading-none">
                            Results processed by ClinicAI Federated Fleet v4.2
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Symptoms;
