import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
    Settings2,
    Bell,
    Zap,
    ArrowRight,
    Save,
    Plus,
    Activity,
    ShieldAlert,
    Clock,
    HeartPulse,
    Wind,
    Thermometer,
    Trash2,
    CheckCircle2,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { Slider } from "../../components/ui/slider";
import { Switch } from "../../components/ui/switch";

const AlertConfiguration = () => {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [thresholds, setThresholds] = useState({
        hr: { eMin: 40, eMax: 160, uMin: 50, uMax: 140, enabled: true },
        spo2: { eMin: 85, eMax: 100, uMin: 92, uMax: 98, enabled: true },
        resp: { eMin: 8, eMax: 30, uMin: 12, uMax: 22, enabled: true },
        temp: { eMin: 34.5, eMax: 40.5, uMin: 36.1, uMax: 37.8, enabled: true }
    });

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        // Simulating PUT /api/alerts/config → Agent 10
        setTimeout(() => {
            setIsSaving(false);
            alert("Global Thresholds Synchronized across MediAgents fleet.");
        }, 1500);
    };

    if (loading) return <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Bell className="animate-bounce text-primary" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Polling Threshold Registry...</span>
    </div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-orange-500 flex items-center justify-center text-white shadow-2xl shadow-orange-500/20">
                        <Settings2 size={30} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Threshold Intelligence</h1>
                        <p className="text-muted-foreground text-xs font-bold tracking-[0.15em] uppercase opacity-60 italic">Agent 10 Escalation Logic • Global Clinical Standards</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 rounded-xl font-bold bg-secondary/30 border-border/50 gap-2 px-6">
                        <ArrowRight size={18} /> Reset Defaults
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 px-6 gap-2 shadow-xl shadow-primary/20"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {isSaving ? "Synchronizing..." : "Apply Global Config"}
                    </Button>
                </div>
            </div>

            {/* Vital Thresholds Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {[
                    { id: 'hr', label: 'Heart Rate', unit: 'BPM', icon: <HeartPulse className="text-emerald-500" />, min: 30, max: 220 },
                    { id: 'spo2', label: 'Peripheral Oxygenation', unit: '% SpO2', icon: <Wind className="text-blue-500" />, min: 50, max: 100 },
                    { id: 'resp', label: 'Respiratory Rate', unit: '/min', icon: <Activity className="text-primary" />, min: 0, max: 60 },
                    { id: 'temp', label: 'Core Body Temperature', unit: '°C', icon: <Thermometer className="text-orange-500" />, min: 30, max: 45 },
                ].map((vital) => (
                    <Card key={vital.id} className="border-border/50 bg-card overflow-hidden rounded-2xl">
                        <CardHeader className="bg-secondary/10 border-b border-border/10 py-5">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                    {vital.icon} {vital.label}
                                </CardTitle>
                                <Switch
                                    checked={thresholds[vital.id].enabled}
                                    onCheckedChange={(val) => setThresholds({ ...thresholds, [vital.id]: { ...thresholds[vital.id], enabled: val } })}
                                />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-10">
                            {/* Emergency Thresholds */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-destructive">Level 1: Emergency (Critical)</p>
                                        <p className="text-xs font-bold text-muted-foreground opacity-60">Immediate agent escalation & bedside alarm</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-base font-black font-mono">{thresholds[vital.id].eMin} - {thresholds[vital.id].eMax}</span>
                                        <span className="ml-1 text-[9px] font-bold text-muted-foreground opacity-40 uppercase">{vital.unit}</span>
                                    </div>
                                </div>
                                <Slider
                                    defaultValue={[thresholds[vital.id].eMin, thresholds[vital.id].eMax]}
                                    max={vital.max}
                                    min={vital.min}
                                    step={vital.id === 'temp' ? 0.1 : 1}
                                    className="pt-2"
                                />
                            </div>

                            {/* Urgent Thresholds */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-500">Level 2: Urgent (Warning)</p>
                                        <p className="text-xs font-bold text-muted-foreground opacity-60">Notification push to attending nurse agent</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-base font-black font-mono">{thresholds[vital.id].uMin} - {thresholds[vital.id].uMax}</span>
                                        <span className="ml-1 text-[9px] font-bold text-muted-foreground opacity-40 uppercase">{vital.unit}</span>
                                    </div>
                                </div>
                                <Slider
                                    defaultValue={[thresholds[vital.id].uMin, thresholds[vital.id].uMax]}
                                    max={vital.max}
                                    min={vital.min}
                                    step={vital.id === 'temp' ? 0.1 : 1}
                                    className="pt-2"
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Global Rules Section */}
            <Card className="border-border/50 bg-background/50 border-dashed rounded-2xl overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                        <Zap className="text-primary" size={16} /> Orchestrator Escalation Rules
                    </CardTitle>
                    <CardDescription className="text-[10px] uppercase font-bold tracking-tight opacity-50">Conditional logic for cross-agent signaling</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        { rule: 'If SpO2 < 90% for > 120s', action: 'Trigger ICU Triage Escalation (Agent 02)', status: 'Active' },
                        { rule: 'If HR > 140 and Temp > 38.5°C', action: 'Flag Potential Sepsis Risk (Agent 04)', status: 'Active' },
                        { rule: 'If BP Drops 20% in 5m', action: 'Initiate Emergency Fluid Alert (Agent 03)', status: 'Active' },
                    ].map((rule, i) => (
                        <div key={i} className="p-4 rounded-xl bg-card border border-border/20 flex items-center justify-between group hover:border-primary/40 transition-all border-l-4 border-l-primary">
                            <div>
                                <h4 className="text-xs font-bold tracking-tight text-foreground">{rule.rule}</h4>
                                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1 opacity-60">Action: {rule.action}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-emerald-500/20 text-emerald-500 bg-emerald-500/5">
                                    {rule.status}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Trash2 size={14} />
                                </Button>
                            </div>
                        </div>
                    ))}
                    <Button variant="ghost" className="w-full h-12 dashed border-border/20 text-[10px] font-black uppercase tracking-widest gap-2 bg-secondary/10 hover:bg-secondary">
                        <Plus size={14} /> append New Escalation node
                    </Button>
                </CardContent>
            </Card>

            <div className="flex items-center justify-between text-[9px] font-black tracking-[0.3em] uppercase opacity-30 pt-4 border-t border-border/10">
                <span className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-emerald-500" /> KERNEL LEVEL PROPAGATION ENABLED
                </span>
                <span>ISO 13485 CERTIFIED ESCALATION MATRIX</span>
            </div>
        </div>
    );
};

export default AlertConfiguration;
