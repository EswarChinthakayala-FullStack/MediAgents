import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
    Activity,
    Users,
    ShieldCheck,
    Zap,
    Server,
    AlertCircle,
    TrendingUp,
    Clock,
    Database,
    Binary,
    BrainCircuit,
    Cpu,
    ArrowUpRight,
    Search
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating GET /api/admin/health
        setTimeout(() => {
            setStats({
                agents: [
                    { id: '01', name: 'Identity Engine', status: 'online', latency: '42ms' },
                    { id: '02', name: 'Triage Oracle', status: 'online', latency: '128ms' },
                    { id: '03', name: 'Vital Guardian', status: 'online', latency: '15ms' },
                    { id: '04', name: 'Risk Predictor', status: 'online', latency: '450ms' },
                    { id: '05', name: 'Decision Hub', status: 'online', latency: '210ms' },
                    { id: '06', name: 'EHR Scribe', status: 'online', latency: '88ms' },
                    { id: '07', name: 'Pharmacy Node', status: 'online', latency: '145ms' },
                    { id: '08', name: 'Genomic Lens', status: 'standby', latency: '0ms' },
                    { id: '09', name: 'Data Architect', status: 'online', latency: '560ms' },
                    { id: '10', name: 'Orchestrator', status: 'online', latency: '34ms' },
                    { id: '11', name: 'Audit Sentinel', status: 'online', latency: '12ms' },
                    { id: '12', name: 'Safety Shield', status: 'online', latency: '25ms' },
                ],
                metrics: {
                    activePatients: 142,
                    systemLoad: 64,
                    securityIncidents: 0,
                    avgWaitTime: '12.4m'
                }
            });
            setLoading(false);
        }, 800);
    }, []);

    if (loading) return <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Cpu className="animate-spin text-primary" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Polling Core Infrastructure...</span>
    </div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
                        <Binary size={30} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Ops Command Center</h1>
                        <p className="text-muted-foreground text-xs font-bold tracking-[0.15em] uppercase opacity-60 italic">Platform Authority: Admin Cluster Alpha</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="relative group flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                            placeholder="Global Search (⌘K)"
                            className="h-11 w-full md:w-64 bg-secondary/30 border border-border/50 rounded-xl pl-10 pr-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:bg-background transition-all"
                        />
                    </div>
                    <Button variant="outline" className="h-11 gap-2 rounded-xl font-bold px-6 border-border/50 bg-card hover:bg-secondary">
                        <Server size={18} />
                        System Logs
                    </Button>
                </div>
            </div>

            {/* Platform Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Network Load', val: stats.metrics.systemLoad + '%', trend: '+2.4%', color: 'emerald', icon: <Cpu /> },
                    { label: 'Active Sessions', val: stats.metrics.activePatients, trend: '+12%', color: 'primary', icon: <Users /> },
                    { label: 'Security Score', val: '99.8', trend: 'Optimal', color: 'emerald', icon: <ShieldCheck /> },
                    { label: 'API Latency', val: '45ms', trend: '-8ms', color: 'emerald', icon: <Zap /> },
                ].map((stat, i) => (
                    <Card key={i} className="border-border/40 bg-card/60 relative overflow-hidden group">
                        <CardHeader className="pb-2 pt-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <span className={`text-${stat.color}-500`}>{stat.icon}</span> {stat.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <div className="text-3xl font-black tracking-tighter mb-1">{stat.val}</div>
                            <div className={`text-[10px] font-bold uppercase tracking-widest text-${stat.color}-500/80 underline decoration-${stat.color}-500/20 underline-offset-4`}>{stat.trend}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Agent Fleet Grid */}
                <Card className="xl:col-span-2 border-border/50 bg-card shadow-none rounded-2xl overflow-hidden">
                    <CardHeader className="bg-secondary/10 border-b border-border/10 py-5">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <BrainCircuit className="text-primary" size={16} />
                                Orchestration Fleet (12/12 Online)
                            </CardTitle>
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none rounded-sm">All Nodes Healthy</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {stats.agents.map((agent) => (
                                <div key={agent.id} className="p-4 rounded-xl border border-border/40 bg-background/40 hover:bg-secondary/20 transition-all group cursor-pointer relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2">
                                        <div className={`h-1.5 w-1.5 rounded-full ${agent.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                                    </div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Agent {agent.id}</p>
                                    <h4 className="text-xs font-bold tracking-tight text-foreground truncate">{agent.name}</h4>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-[10px] font-mono text-muted-foreground italic">{agent.latency}</span>
                                        <ArrowUpRight size={12} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Analytics */}
                <div className="space-y-8">
                    <Card className="border-border/50 bg-background/50 border-dashed rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Activity className="text-primary" size={14} /> Throughput Analytics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="h-48 pt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={[
                                    { t: '08:00', v: 40 }, { t: '10:00', v: 65 }, { t: '12:00', v: 82 },
                                    { t: '14:00', v: 55 }, { t: '16:00', v: 90 }, { t: '18:00', v: 72 }
                                ]}>
                                    <defs>
                                        <linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.2} />
                                    <XAxis dataKey="t" hide />
                                    <Area type="monotone" dataKey="v" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorV)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                        <div className="p-6 pt-0 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            <span>08:00 AM</span>
                            <span>PEAK LOAD AT 16:00</span>
                            <span>06:00 PM</span>
                        </div>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5 rounded-2xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <Database size={20} />
                            </div>
                            <div>
                                <h4 className="text-[11px] font-black uppercase tracking-widest">Federated Storage</h4>
                                <p className="text-lg font-black tracking-tighter">1.84 TB <span className="text-[10px] font-bold text-muted-foreground opacity-60">/ 5.0 TB</span></p>
                            </div>
                        </div>
                        <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(var(--primary),0.5)]" style={{ width: '36.8%' }} />
                        </div>
                        <p className="mt-3 text-[10px] text-muted-foreground italic font-medium">Automatic expansion scheduled at 85% utilization.</p>
                    </Card>
                </div>
            </div>

            <div className="flex items-center justify-between text-[9px] font-black tracking-[0.3em] uppercase opacity-30 pt-4">
                <span>CLUSTER: ALPHA-REGION-01</span>
                <span className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    IMMUTABLE AUDIT TRAIL ENABLED
                </span>
                <span>KERNEL VERSION: 2.14.0-STABLE</span>
            </div>
        </div>
    );
};

export default AdminDashboard;
