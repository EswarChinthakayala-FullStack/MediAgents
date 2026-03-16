import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
    Bell,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Activity,
    Zap,
    MessageSquare,
    ShieldAlert,
    Filter,
    Check
} from 'lucide-react';

const AlertsFeed = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        // Simulating Agent 10 call: GET /api/alerts/doctor/{id}
        const mockAlerts = [
            { id: 1, type: 'critical', title: 'Critical Arrhythmia', patient: 'James Wilson', bed: '04A', time: '1m ago', detail: 'Agent 03 detected sustain ventricular tachycardia. Immediate assessment required.', status: 'pending', deadline: 120 },
            { id: 2, type: 'warning', title: 'Lab Result Abnormal', patient: 'Sarah Miller', bed: '09C', time: '14m ago', detail: 'Agent 05 reports Potassium 2.9 mEq/L. Recommend replacement protocol.', status: 'pending', deadline: 240 },
            { id: 3, type: 'info', title: 'Triage Recommendation', patient: 'Emily Davis', bed: 'Waiting Room', time: '22m ago', detail: 'Agent 02 suggests immediate escalation due to secondary anaphylaxis indicators.', status: 'pending', deadline: null },
            { id: 4, type: 'critical', title: 'SpO2 Drop', patient: 'Robert Chen', bed: 'ICU-2', time: '41m ago', detail: 'Oxygen saturation fell below 88% threshold for >3 minutes.', status: 'acknowledged', deadline: null },
        ];

        setTimeout(() => {
            setAlerts(mockAlerts);
            setLoading(false);
        }, 700);
    }, []);

    const handleAcknowledge = (id) => {
        // Simulating Agent 10 call: PUT /api/alerts/{id}/ack
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'acknowledged' } : a));
    };

    const filteredAlerts = alerts.filter(a => filter === 'all' || a.type === filter);

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight uppercase">Emergency Command Feed</h1>
                    <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase opacity-60">Synchronized via Agent 10 (Clinical Orchestrator)</p>
                </div>

                <div className="flex bg-secondary/30 p-1 rounded-lg border border-border/50">
                    {['all', 'critical', 'warning', 'info'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Alerts List */}
                <div className="lg:col-span-2 space-y-4">
                    {loading ? (
                        [1, 2, 3].map(i => <div key={i} className="h-32 rounded-2xl bg-secondary/20 animate-pulse border border-border/10" />)
                    ) : filteredAlerts.length === 0 ? (
                        <Card className="border-border/50 bg-card/40 flex flex-col items-center justify-center p-12 text-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                <CheckCircle2 size={32} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase tracking-tight">System All-Clear</h3>
                                <p className="text-xs text-muted-foreground font-medium italic">No active alerts meeting the current filter criteria.</p>
                            </div>
                        </Card>
                    ) : filteredAlerts.map(alert => (
                        <Card key={alert.id} className={`border-border/50 bg-card shadow-none rounded-2xl overflow-hidden group transition-all relative ${alert.status === 'acknowledged' ? 'opacity-50 grayscale' : ''
                            }`}>
                            <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${alert.type === 'critical' ? 'bg-destructive shadow-[4px_0_12px_rgba(239,68,68,0.2)]' :
                                    alert.type === 'warning' ? 'bg-amber-500' : 'bg-primary'
                                }`} />

                            <CardContent className="p-0">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className={`
                                                uppercase text-[10px] font-black tracking-widest h-6 rounded-md
                                                ${alert.type === 'critical' ? 'border-destructive/20 text-destructive bg-destructive/5' :
                                                    alert.type === 'warning' ? 'border-amber-500/20 text-amber-500 bg-amber-500/5' :
                                                        'border-primary/20 text-primary bg-primary/5'}
                                            `}>
                                                {alert.type}
                                            </Badge>
                                            <div className="flex items-center gap-2 text-xs font-bold font-mono text-muted-foreground/60">
                                                <Clock size={12} /> {alert.time}
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-xs font-black uppercase tracking-widest text-foreground">{alert.patient}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground font-mono">Location: {alert.bed}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <h3 className="text-base font-black tracking-tight text-foreground">{alert.title}</h3>
                                        <p className="text-sm text-muted-foreground italic leading-relaxed font-medium">"{alert.detail}"</p>
                                    </div>

                                    <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <Button variant="ghost" className="h-9 text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-secondary">
                                                <Zap size={14} className="text-primary" /> Multi-Agent reasoning
                                            </Button>
                                            <Button variant="ghost" className="h-9 text-[10px] font-black uppercase tracking-widest gap-2 hover:bg-secondary">
                                                <Activity size={14} /> View Telemetry
                                            </Button>
                                        </div>

                                        {alert.status === 'pending' ? (
                                            <Button
                                                onClick={() => handleAcknowledge(alert.id)}
                                                className={`h-10 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest gap-2 shadow-xl ${alert.type === 'critical'
                                                        ? 'bg-destructive hover:bg-destructive/90 text-white shadow-destructive/20'
                                                        : 'bg-primary hover:bg-primary/90 text-white shadow-primary/20'
                                                    }`}
                                            >
                                                <Check size={16} /> Mark Acknowledged
                                                {alert.deadline && (
                                                    <span className="ml-2 pl-2 border-l border-white/20 font-mono animate-pulse">01:{alert.deadline % 60}</span>
                                                )}
                                            </Button>
                                        ) : (
                                            <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.2em]">
                                                <CheckCircle2 size={16} /> Acknowledged by Dr. Chen
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Feed Stats & Settings */}
                <div className="space-y-6">
                    <Card className="border-border/50 bg-secondary/10 shadow-none rounded-2xl overflow-hidden">
                        <CardHeader className="bg-destructive/5 py-4">
                            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-destructive flex items-center gap-2">
                                <AlertTriangle size={14} /> Critical Escalations
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div className="text-center">
                                    <p className="text-2xl font-black tracking-tighter text-destructive">
                                        {alerts.filter(a => a.type === 'critical' && a.status === 'pending').length}
                                    </p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Pending</p>
                                </div>
                                <div className="h-8 w-px bg-border/20" />
                                <div className="text-center">
                                    <p className="text-2xl font-black tracking-tighter text-foreground">
                                        {alerts.filter(a => a.type === 'critical' && a.status === 'acknowledged').length}
                                    </p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Resolved</p>
                                </div>
                                <div className="h-8 w-px bg-border/20" />
                                <div className="text-center">
                                    <p className="text-2xl font-black tracking-tighter text-emerald-500">14m</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Avg Ack Time</p>
                                </div>
                            </div>
                            <Button className="w-full h-11 bg-background border border-border/50 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-secondary">Download Audit Log</Button>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-background/30 shadow-none border-dashed rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                                <ShieldAlert size={14} className="text-primary" /> Active Sentinel Nodes
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {[
                                { agent: '02', name: 'Triage Monitor', status: 'optimal' },
                                { agent: '03', name: 'Vital Anomaly Engine', status: 'optimal' },
                                { agent: '10', name: 'Clinical Dispatcher', status: 'active' },
                            ].map(agent => (
                                <div key={agent.agent} className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 border border-border/10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-[10px] font-black">{agent.agent}</div>
                                        <span className="text-[10px] font-bold uppercase tracking-tight">{agent.name}</span>
                                    </div>
                                    <Badge variant="ghost" className="text-[8px] font-black text-emerald-500 bg-emerald-500/10 uppercase">{agent.status}</Badge>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex items-center justify-between text-[9px] font-black tracking-[0.3em] uppercase opacity-30 mt-6 pt-4 border-t border-border/10">
                <span className="flex items-center gap-2">
                    <Zap className="text-primary" size={12} /> WebSocket Stream via Agent 10
                </span>
                <span>ISO 27001 COMPLIANT LOGGING ACTIVE</span>
            </div>
        </div>
    );
};

export default AlertsFeed;
