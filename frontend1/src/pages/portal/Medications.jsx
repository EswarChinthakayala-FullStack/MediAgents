import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
    Syringe,
    Clock,
    AlertCircle,
    CheckCircle2,
    RotateCcw,
    Calendar,
    ChevronRight,
    Search,
    Stethoscope,
    HeartPulse,
    Info
} from 'lucide-react';

const Medications = () => {
    const [view, setView] = useState('active');

    const medications = [
        { id: 1, name: 'Glucosamine Sulfate', dosage: '500mg', frequency: 'Daily (Morning)', status: 'Active', instructions: 'Take with meal for joint recovery.', refillIn: '12 days' },
        { id: 2, name: 'Ibuprofen', dosage: '200mg', frequency: 'Every 8 Hours (As needed)', status: 'Active', instructions: 'For pain relief, do not exceed 3 daily.', refillIn: 'Refill ready' },
        { id: 3, name: 'Vitamin D3', dosage: '2000 IU', frequency: 'Daily', status: 'Active', instructions: 'Supports bone health and healing.', refillIn: '24 days' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between gap-6 pb-2 border-b border-border/10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group hover:scale-110 transition-transform">
                        <HeartPulse size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Medications</h1>
                        <p className="text-muted-foreground text-sm italic">Track your prescriptions and manage adherence.</p>
                    </div>
                </div>
                <Button variant="outline" className="h-11 px-6 rounded-xl border-border/50 font-bold uppercase tracking-widest text-[10px] gap-2 hover:bg-secondary/50">
                    <RotateCcw size={14} className="text-primary" />
                    Refill History
                </Button>
            </div>

            {/* Adherence Widget */}
            <Card className="bg-primary/5 border-primary/20 border-t-4 border-t-primary rounded-2xl overflow-hidden">
                <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="space-y-4 max-w-md">
                            <Badge className="bg-primary text-primary-foreground font-black text-[9px] uppercase tracking-widest px-2 py-0.5 h-5">Adherence Status: Optimal</Badge>
                            <h2 className="text-3xl font-black tracking-tight leading-none uppercase italic">Clinical Consistency: 94%</h2>
                            <p className="text-xs text-muted-foreground italic font-medium leading-relaxed leading-relaxed pt-2">
                                Great job, Sarah! Your consistency in taking Glucosamine is accelerating your knee recovery process.
                                Keep following the schedule suggested by Agent-07 Pharm-Specialist.
                            </p>
                        </div>
                        <div className="flex gap-4 md:border-l border-primary/10 md:pl-8">
                            <div className="text-center p-3">
                                <div className="text-2xl font-black text-primary">24</div>
                                <div className="text-[9px] font-black uppercase text-muted-foreground tracking-widest opacity-60">Days Streak</div>
                            </div>
                            <div className="text-center p-3">
                                <div className="text-2xl font-black text-primary">02</div>
                                <div className="text-[9px] font-black uppercase text-muted-foreground tracking-widest opacity-60">Missed (30d)</div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Medication List */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Prescription List</h3>
                    <div className="flex gap-2">
                        <div className="h-8 w-8 rounded-lg bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary cursor-pointer transition-colors"><Search size={14} /></div>
                        <div className="h-8 w-8 rounded-lg bg-secondary/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-primary cursor-pointer transition-colors"><Calendar size={14} /></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {medications.map((med) => (
                        <Card key={med.id} className="border-border/40 bg-card/60 hover:border-primary/20 hover:bg-card transition-all group overflow-hidden">
                            <CardContent className="p-0">
                                <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                            <Syringe size={20} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-lg tracking-tight">{med.name}</h4>
                                                <Badge variant="outline" className="text-[9px] font-black bg-emerald-500/5 text-emerald-500 border-none px-2 h-5 rounded-sm uppercase tracking-tighter">
                                                    {med.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-bold italic text-muted-foreground">
                                                <span>Dosage: {med.dosage}</span>
                                                <span className="opacity-20">•</span>
                                                <span className="flex items-center gap-1.5"><Clock size={12} className="text-primary" /> {med.frequency}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 md:min-w-[280px]">
                                        <div className="flex-1 p-3 rounded-xl bg-secondary/30 border border-border/10">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1 opacity-60">
                                                <Info size={10} /> Instruction
                                            </div>
                                            <p className="text-[11px] font-medium leading-relaxed italic">{med.instructions}</p>
                                        </div>
                                        <div className="text-right">
                                            <Badge variant="outline" className={`text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-lg border-2 mb-2 ${med.refillIn === 'Refill ready' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/5' : 'border-border/50 text-muted-foreground'}`}>
                                                {med.refillIn}
                                            </Badge>
                                            <Button variant="ghost" className="w-full text-[10px] font-black uppercase text-primary hover:bg-primary/5 p-0 h-6">Request Refill</Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Checklist Action */}
            <div className="bg-secondary/20 p-8 rounded-3xl border border-border/50 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <CheckCircle2 size={32} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold mb-1">Daily Medication Completed?</h4>
                        <p className="text-sm text-muted-foreground italic font-medium">Keep your adherence score high by marking your doses.</p>
                    </div>
                </div>
                <Button className="h-12 px-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold gap-3 shadow-xl shadow-emerald-500/10">
                    Mark Morning Dose as Taken
                    <ChevronRight size={18} />
                </Button>
            </div>

            <div className="pt-8 flex items-center justify-center gap-8 opacity-20">
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                    <Stethoscope size={14} /> FDA APPROVED PROTOCOLS
                </div>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                    <AlertCircle size={14} /> EMERGENCY OVERRIDE ENABLED
                </div>
            </div>
        </div>
    );
};

export default Medications;
