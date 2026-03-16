import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
    Calendar,
    Clock,
    Users,
    Home,
    ChevronLeft,
    ChevronRight,
    Plus,
    Filter,
    Activity,
    Zap,
    MoreVertical,
    Coffee,
    Stethoscope,
    DoorOpen
} from 'lucide-react';

const Scheduling = () => {
    const [view, setView] = useState('calendar');
    const [loading, setLoading] = useState(true);

    const timeSlots = Array.from({ length: 10 }, (_, i) => `${i + 8}:00`);
    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    useEffect(() => {
        setTimeout(() => setLoading(false), 600);
    }, []);

    const appointments = [
        { id: 1, doctor: 'Dr. Michael Chen', patient: 'James Wilson', type: 'Cardio', time: '09:00', duration: '45m', room: 'A-201', priority: 'high' },
        { id: 2, doctor: 'Emily Vance', patient: 'Sarah Miller', type: 'Follow-up', time: '10:00', duration: '30m', room: 'B-105', priority: 'routine' },
        { id: 3, doctor: 'Michael Chen', patient: 'Lucy H.', type: 'General', time: '11:30', duration: '15m', room: 'A-201', priority: 'urgent' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
                        <Calendar size={30} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Clinical Logistical Flow</h1>
                        <p className="text-muted-foreground text-xs font-bold tracking-[0.15em] uppercase opacity-60 italic">Managed by Agent 02 (Resource Optimizer) • Real-time Allocation</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-secondary/30 p-1.5 rounded-xl border border-border/40">
                        {['calendar', 'rooms', 'physicians'].map((v) => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${view === v ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                    <Button className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 px-6 gap-2">
                        <Plus size={18} /> Schedule Session
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Main Schedule Area */}
                <Card className="xl:col-span-3 border-border/50 bg-card shadow-none rounded-2xl overflow-hidden flex flex-col">
                    <CardHeader className="bg-secondary/10 border-b border-border/10 py-5 flex flex-row items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background"><ChevronLeft size={16} /></Button>
                            <CardTitle className="text-sm font-black uppercase tracking-widest">March 16 - 22, 2024</CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background"><ChevronRight size={16} /></Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-[10px] font-black tracking-widest uppercase border-primary/20 text-primary">Week View</Badge>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Filter size={14} /></Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-x-auto">
                        <div className="min-w-[800px]">
                            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-border/10 h-12">
                                <div className="border-r border-border/10 bg-secondary/5" />
                                {weekDays.map(day => (
                                    <div key={day} className="flex items-center justify-center border-r border-border/10 last:border-r-0 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="relative">
                                {timeSlots.map(time => (
                                    <div key={time} className="grid grid-cols-[80px_repeat(7,1fr)] h-20 border-b border-border/5 group">
                                        <div className="border-r border-border/10 flex items-start justify-center pt-2 text-[10px] font-mono font-bold text-muted-foreground/40 bg-secondary/5">
                                            {time}
                                        </div>
                                        {weekDays.map(day => (
                                            <div key={day} className="relative border-r border-border/5 last:border-r-0 group-hover:bg-primary/5 transition-colors" />
                                        ))}
                                    </div>
                                ))}

                                {/* Absolute positioned appointments */}
                                <div className="absolute top-[80px] left-[200px] w-48 h-18 py-1 px-1">
                                    <div className="h-full w-full bg-primary/10 border-l-4 border-primary rounded-r p-2 shadow-sm cursor-pointer hover:bg-primary/20 transition-all overflow-hidden group">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <p className="text-[9px] font-black uppercase tracking-wider text-primary">Dr. Michael Chen</p>
                                            <span className="text-[8px] font-mono text-muted-foreground">09:00</span>
                                        </div>
                                        <p className="text-[11px] font-bold truncate">James Wilson · Cardio</p>
                                    </div>
                                </div>

                                <div className="absolute top-[240px] left-[350px] w-40 h-16 py-1 px-1">
                                    <div className="h-full w-full bg-emerald-500/10 border-l-4 border-emerald-500 rounded-r p-2 shadow-sm cursor-pointer hover:bg-emerald-500/20 transition-all overflow-hidden">
                                        <div className="flex justify-between items-start mb-0.5">
                                            <p className="text-[9px] font-black uppercase tracking-wider text-emerald-600">Emily Vance</p>
                                            <span className="text-[8px] font-mono text-muted-foreground">11:00</span>
                                        </div>
                                        <p className="text-[11px] font-bold truncate">Sarah Miller · Follow</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar Analytics/Capacity */}
                <div className="space-y-6">
                    <Card className="border-border/50 bg-secondary/10 shadow-none rounded-2xl p-6">
                        <CardHeader className="p-0 mb-6">
                            <CardTitle className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <Zap size={14} /> Agent 02 Suggestions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-4">
                            <div className="p-4 rounded-xl bg-background border border-border/40 flex flex-col gap-2 group hover:border-primary/40 transition-all">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-destructive">
                                    <Activity size={12} /> Bottleneck Detected
                                </div>
                                <p className="text-xs font-bold leading-tight">Patient influx higher than physician availability in West Wing (14:00-16:00).</p>
                                <Button size="sm" className="h-7 text-[9px] font-bold uppercase tracking-widest mt-1 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all">Enable Overflow Routing</Button>
                            </div>

                            <div className="p-4 rounded-xl bg-background border border-border/40 flex flex-col gap-2 group hover:border-emerald-500/40 transition-all">
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                                    <CheckCircle2 size={12} /> Optimization Ready
                                </div>
                                <p className="text-xs font-bold leading-tight">Agent 02 has mapped 4 appointments to contiguous blocks for Dr. Vance.</p>
                                <Button size="sm" className="h-7 text-[9px] font-bold uppercase tracking-widest mt-1 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all">Apply Block Schedule</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-background/50 border-dashed rounded-2xl p-6">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-2 border-b border-border/10 pb-2">
                                <Home size={12} /> Institutional Load
                            </h4>
                            {[
                                { label: 'Consultation Rooms', val: 14, total: 18, color: 'primary', icon: <DoorOpen /> },
                                { label: 'Active Physicians', val: 9, total: 12, color: 'emerald', icon: <Stethoscope /> },
                                { label: 'Staff Break Index', val: 3, total: 12, color: 'amber', icon: <Coffee /> },
                            ].map((item, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                        <span className="flex items-center gap-1.5 opacity-60">{item.icon} {item.label}</span>
                                        <span className="text-foreground">{item.val}/{item.total}</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                                        <div className={`h-full bg-${item.color}-500 rounded-full`} style={{ width: `${(item.val / item.total) * 100}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { title: 'Appointments Today', val: 42, sub: '+12% from avg', icon: <Calendar /> },
                    { title: 'Avg Session Duration', val: '24m', sub: '-3m from peak', icon: <Clock /> },
                    { title: 'Patient No-Show Rate', val: '4.2%', sub: 'Stable', icon: <Users /> },
                ].map((stat, i) => (
                    <Card key={i} className="bg-card/40 border-border/40 p-5 flex items-center gap-4 group hover:bg-secondary/10 cursor-pointer transition-all">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.title}</p>
                            <h4 className="text-xl font-black tracking-tightest">{stat.val}</h4>
                            <p className="text-[9px] font-bold text-emerald-500 uppercase mt-0.5">{stat.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="flex items-center justify-between text-[9px] font-black tracking-[0.3em] uppercase opacity-30 pt-4 border-t border-border/10">
                <span>AGENT 02 SCHEDULING KERNEL</span>
                <span className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    REAL-TIME RESOURCE CALIBRATION ACTIVE
                </span>
                <span>SYNC: WS://SCHEDULE.CLINIC.AI</span>
            </div>
        </div>
    );
};

export default Scheduling;
