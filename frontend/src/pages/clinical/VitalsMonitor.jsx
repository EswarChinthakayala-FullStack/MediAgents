import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
    Activity,
    ArrowLeft,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    AlertCircle,
    HeartPulse,
    Wind,
    Thermometer,
    Settings,
    BellOff,
    Maximize2
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const VitalsMonitor = () => {
    const { id } = useParams();
    const [isLive, setIsLive] = useState(true);
    const [data, setData] = useState([]);
    const [alerts, setAlerts] = useState([]);

    // Simulating real-time data stream
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isLive) return;

            const now = new Date();
            const timeStr = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0') + ':' + now.getSeconds().toString().padStart(2, '0');

            const newDataPoint = {
                time: timeStr,
                hr: 75 + Math.floor(Math.random() * 10),
                spo2: 97 + Math.floor(Math.random() * 3),
                resp: 16 + Math.floor(Math.random() * 4),
            };

            setData(prev => {
                const updated = [...prev, newDataPoint];
                if (updated.length > 20) return updated.slice(1);
                return updated;
            });

            // Random anomaly simulation
            if (Math.random() > 0.95) {
                setAlerts(prev => [{
                    id: Date.now(),
                    time: timeStr,
                    type: 'arrhythmia',
                    msg: 'Premature Ventricular Contraction detected by Agent 03'
                }, ...prev].slice(0, 5));
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [isLive]);

    const latest = data[data.length - 1] || { hr: '--', spo2: '--', resp: '--' };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Control Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link to={`/clinical/patient/${id}`} className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-black tracking-tight uppercase">Real-Time Telemetry</h1>
                            <div className="flex items-center gap-2 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Live Link: Secure</span>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase opacity-60">Synchronized with Agent 03 (Vital Guardian) • Bed 04A • ID: {id}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-10 bg-secondary/30 border-border/50 gap-2 font-bold uppercase text-[10px] tracking-widest">
                        <BellOff size={14} /> Mute Alarms
                    </Button>
                    <Button variant="outline" size="sm" className="h-10 bg-secondary/30 border-border/50 font-bold uppercase text-[10px] tracking-widest">
                        <Settings size={14} />
                    </Button>
                </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Heart Rate', val: latest.hr, unit: 'BPM', icon: <HeartPulse className="text-emerald-500" />, trend: 'up', color: 'emerald' },
                    { label: 'O2 Saturation', val: latest.spo2, unit: '%', icon: <Wind className="text-blue-500" />, trend: 'down', color: 'blue' },
                    { label: 'Respiratory', val: latest.resp, unit: '/min', icon: <Activity className="text-primary" />, trend: 'up', color: 'primary' },
                    { label: 'Body Temp', val: 36.8, unit: '°C', icon: <Thermometer className="text-orange-500" />, trend: 'stable', color: 'orange' },
                ].map((v, i) => (
                    <Card key={i} className={`bg-card/40 border-border/40 relative overflow-hidden group`}>
                        <div className={`absolute top-0 right-0 p-3 flex flex-col items-end`}>
                            {v.trend === 'up' && <ArrowUpRight size={14} className="text-emerald-500" />}
                            {v.trend === 'down' && <ArrowDownRight size={14} className="text-destructive" />}
                        </div>
                        <CardHeader className="pt-4 pb-0 px-5">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
                                {v.icon} {v.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-1 pb-4 px-5">
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black tracking-tighter">{v.val}</span>
                                <span className="text-[10px] font-bold text-muted-foreground/60">{v.unit}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Waveform Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <Card className="xl:col-span-2 border-border/40 bg-card/60">
                    <CardHeader className="border-b border-border/10 py-4 px-6">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Zap className="text-primary" size={14} /> Neural-Enhanced Waveform (InfluxDB Stream)
                            </CardTitle>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                <Maximize2 size={16} />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.2} />
                                    <XAxis dataKey="time" hide />
                                    <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                                    <Line
                                        type="monotone"
                                        dataKey="hr"
                                        stroke="hsl(var(--primary))"
                                        strokeWidth={4}
                                        dot={false}
                                        isAnimationActive={false}
                                        animationDuration={0}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Live Anomaly Feed */}
                <Card className="border-border/50 bg-background/50 border-dashed">
                    <CardHeader className="py-4">
                        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            <AlertCircle className="text-destructive animate-pulse" size={14} /> Anomaly Analytics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {alerts.length === 0 ? (
                            <div className="h-64 flex flex-col items-center justify-center text-center p-6 gap-3">
                                <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-500">
                                    <Activity size={32} />
                                </div>
                                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground italic">Continuous Vital Surveillance Active. No anomalies detected.</p>
                            </div>
                        ) : alerts.map(alert => (
                            <div key={alert.id} className="p-4 rounded-xl bg-destructive/5 border border-destructive/20 animate-in slide-in-from-right duration-300">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-destructive">Anomaly Triggered</span>
                                    <span className="text-[9px] font-bold font-mono text-muted-foreground/60">{alert.time}</span>
                                </div>
                                <p className="text-xs font-bold text-foreground mb-1 capitalize">{alert.type}</p>
                                <p className="text-[10px] text-muted-foreground italic leading-relaxed">{alert.msg}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-between text-[9px] font-black tracking-[0.3em] uppercase opacity-30 mt-4 h-10 border-t border-border/10">
                <span>WS /ws/vitals/{id} ENABLED</span>
                <span className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Agent 03: Pulse Synced
                </span>
                <span>LOW-LATENCY INFLUXDB KERNEL</span>
            </div>
        </div>
    );
};

export default VitalsMonitor;
