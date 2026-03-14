import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
    Stethoscope,
    ChevronRight,
    MessageSquare,
    AlertCircle,
    Clock,
    Activity,
    BrainCircuit,
    ArrowRight
} from 'lucide-react';

const Symptoms = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleAnalyze = () => {
        setLoading(true);
        // Simulate Agent 01 (Triage Agent) call
        setTimeout(() => {
            setResult({
                urgency: 'Urgencia Moderada',
                tier: 3,
                recommendation: 'Schedule a virtual consultation within 24 hours.',
                agentNote: 'Based on your reported symptoms of joint pain and mild swelling, our Triage Agent suggests a follow-up with a specialist.'
            });
            setLoading(false);
            setStep(3);
        }, 2000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center gap-4 mb-2">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group hover:scale-110 transition-transform">
                    <BrainCircuit size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Symptom Checker</h1>
                    <p className="text-muted-foreground text-sm italic">Powered by Triage Agent-01</p>
                </div>
            </div>

            {step === 1 && (
                <Card className="border-border/50 bg-card/50 overflow-hidden shadow-xl">
                    <CardHeader className="bg-primary/5 border-b border-border/10 pb-6">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Activity className="text-primary" size={18} />
                            How are you feeling?
                        </CardTitle>
                        <CardDescription>Tell us about your symptoms in plain language.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-6">
                        <div className="space-y-4">
                            <Label htmlFor="symptoms" className="text-base font-bold">Describe your symptoms</Label>
                            <textarea
                                id="symptoms"
                                className="w-full min-h-[150px] p-4 rounded-xl bg-secondary/20 border border-border/50 focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all text-sm italic leading-relaxed"
                                placeholder="e.g., I've been having a dull ache in my left knee for 3 days, it gets worse when I walk up stairs..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Duration</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['< 1 day', '1-3 days', '3+ days'].map((d) => (
                                        <Button key={d} variant="outline" size="sm" className="text-[10px] font-bold rounded-lg border-border/50 hover:border-primary/50">{d}</Button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Severity</Label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Mild', 'Moderate', 'Severe'].map((s) => (
                                        <Button key={s} variant="outline" size="sm" className="text-[10px] font-bold rounded-lg border-border/50 hover:border-primary/50">{s}</Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-secondary/5 border-t border-border/10 flex justify-end gap-3 p-6">
                        <Button variant="ghost" className="font-bold text-xs uppercase tracking-widest">Clear</Button>
                        <Button onClick={() => setStep(2)} className="rounded-xl px-8 font-bold gap-2 group">
                            Next Stage
                            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {step === 2 && (
                <Card className="border-border/50 bg-card/60 backdrop-blur-xl animate-in zoom-in-95 duration-500">
                    <CardContent className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-2 border-primary/20 flex items-center justify-center">
                                <Stethoscope size={40} className="text-primary animate-pulse" />
                            </div>
                            <div className="absolute inset-0 rounded-full border border-primary/40 animate-ping opacity-20"></div>
                        </div>
                        <div>
                            <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Triage Agent-01 is Analyzing</h3>
                            <p className="text-muted-foreground italic text-sm px-10">Cross-referencing your symptoms with clinical databases and historical patterns...</p>
                        </div>
                        <Button onClick={handleAnalyze} disabled={loading} className="px-10 h-12 rounded-full font-bold shadow-xl shadow-primary/20">
                            {loading ? "Processing Clinical Data..." : "Run AI Analysis"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            {step === 3 && result && (
                <div className="space-y-6 animate-in slide-in-from-right-8 duration-700">
                    <Card className={`border-${result.tier === 3 ? 'amber' : 'primary'}-500/30 bg-card overflow-hidden shadow-2xl skew-x-[-1deg]`}>
                        <div className="p-8 space-y-6 skew-x-[1deg]">
                            <div className="flex items-center justify-between">
                                <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">
                                    Urgency: {result.urgency}
                                </Badge>
                                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 opacity-60">
                                    <Clock size={12} /> ID: TRI-88902-A
                                </span>
                            </div>

                            <div>
                                <h2 className="text-3xl font-black tracking-tighter text-foreground mb-4">Recommended Action</h2>
                                <p className="text-lg font-medium text-foreground leading-relaxed">{result.recommendation}</p>
                            </div>

                            <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50 flex gap-4">
                                <AlertCircle className="text-amber-500 shrink-0 mt-1" size={20} />
                                <div>
                                    <h4 className="text-sm font-bold uppercase tracking-tight mb-1">Clinical Insight</h4>
                                    <p className="text-xs text-muted-foreground italic leading-relaxed">{result.agentNote}</p>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/10">
                                <Button className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold gap-2 group shadow-lg shadow-primary/20">
                                    Book Quick Consultation
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Button>
                                <Button variant="outline" className="flex-1 h-12 rounded-xl border-border/50 font-bold gap-2 hover:bg-secondary/50 transition-all">
                                    <MessageSquare size={18} />
                                    Talk to Health Assistant
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Button variant="ghost" onClick={() => setStep(1)} className="text-muted-foreground hover:text-foreground text-xs font-bold uppercase tracking-widest">
                        Restart Symptom Check
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Symptoms;
