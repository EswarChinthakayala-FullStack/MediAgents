import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
    Cpu,
    Activity,
    Zap,
    AlertTriangle,
    CheckCircle2,
    Clock,
    RefreshCw,
    Network,
    Binary,
    Database,
    Search,
    ChevronRight,
    ArrowUpRight,
    ArrowDownRight,
    Terminal,
    BarChart3
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line
} from 'recharts';

const AgentMonitor = () => {
    const [loading, setLoading] = useState(true);
    const [agents, setAgents] = useState([]);
    const [systemHealth, setSystemHealth] = useState({ cpu: 42, mem: 68, net: 120 });

    useEffect(() => {
        // Simulating GET /api/admin/agents → Orchestrator health
        const mockAgents = [
            { id: '01', name: 'Identity Engine', type: 'Core', status: 'online', uptime: '142d', latency: '42ms', errors: 0, load: 12 },
            { id: '02', name: 'Triage Oracle', type: 'Clinical', status: 'online', uptime: '48d', latency: '128ms', errors: 2, load: 45 },
            { id: '03', name: 'Vital Guardian', type: 'Clinical', status: 'online', uptime: '112d', latency: '15ms', errors: 0, load: 88 },
            { id: '04', name: 'Risk Predictor', type: 'Clinical', status: 'online', uptime: '14d', latency: '450ms', errors: 12, load: 92 },
            { id: '05', name: 'Decision Hub', type: 'Clinical', status: 'online', uptime: '92d', latency: '210ms', errors: 0, load: 34 },
            { id: '06', name: 'EHR Scribe', type: 'Operational', status: 'online', uptime: '210d', latency: '88ms', errors: 0, load: 56 },
            { id: '07', name: 'Pharmacy Node', type: 'Clinical', status: 'online', uptime: '85d', latency: '145ms', errors: 1, load: 22 },
            { id: '08', name: 'Genomic Lens', type: 'Research', status: 'standby', uptime: '0d', latency: '0ms', errors: 0, load: 0 },
            { id: '09', name: 'Data Architect', type: 'Operational', status: 'online', uptime: '45d', latency: '560ms', errors: 4, load: 78 },
            { id: '10', name: 'Orchestrator', type: 'Core', status: 'online', uptime: '210d', latency: '34ms', errors: 0, load: 15 },
            { id: '11', name: 'Audit Sentinel', type: 'Security', status: 'online', uptime: '210d', latency: '12ms', errors: 0, load: 5 },
            { id: '12', name: 'Safety Shield', type: 'Security', status: 'online', uptime: '210d', latency: '25ms', errors: 0, load: 8 },
        ];

        setTimeout(() => {
            setAgents(mockAgents);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Network className="animate-pulse text-primary" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Connecting to Federated Orchestrator...</span>
    </div>;

    const latencyData = [
        { t: '12:00', l: 120 }, { t: '12:05', l: 145 }, { t: '12:10', l: 110 },
        { t: '12:15', l: 180 }, { t: '12:20', l: 130 }, { t: '12:25', l: 115 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
                        <Cpu size={30} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Fleet Oversight</h1>
                        <p className="text-muted-foreground text-xs font-bold tracking-[0.15em] uppercase opacity-60 italic">Real-time Telemetry for 12 Autonomous Agents</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 rounded-xl font-bold bg-secondary/30 border-border/50 gap-2 px-6">
                        <RefreshCw size={18} /> Resync Fleet
                    </Button>
                    <Button className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 px-6 gap-2">
                        <Terminal size={18} /> Remote Console
                    </Button>
                </div>
            </div>

            {/* Core Health Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Compute Cluster CPU', val: systemHealth.cpu + '%', sub: 'Balanced', color: 'emerald', icon: <Cpu /> },
                    { label: 'Memory Allocation', val: systemHealth.mem + '%', sub: 'Optimized', color: 'primary', icon: <Database /> },
                    { label: 'Network Throughput', val: systemHealth.net + ' Mb/s', sub: 'High Stability', color: 'emerald', icon: <Network /> },
                ].map((stat, i) => (
                    <Card key={i} className="bg-card/40 border-border/40 p-5 flex items-center gap-4 group">
                        <div className={`h-12 w-12 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{stat.label}</p>
                            <h4 className="text-2xl font-black tracking-tightest">{stat.val}</h4>
                            <p className={`text-[9px] font-bold text-${stat.color}-500 uppercase mt-0.5`}>{stat.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Latency History */}
                <Card className="xl:col-span-1 border-border/50 bg-background/50 border-dashed rounded-2xl p-6 flex flex-col">
                    <CardHeader className="p-0 mb-6">
                        <CardTitle className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                            <BarChart3 size={14} className="text-primary" /> Aggregate Latency
                        </CardTitle>
                    </CardHeader>
                    <div className="flex-1 h-32">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={latencyData}>
                                <Area type="step" dataKey="l" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="mt-4 space-y-3">
                        <div className="flex justify-between text-[10px] font-bold">
                            <span className="opacity-60 uppercase">P99 Response</span>
                            <span className="text-destructive font-mono">560ms</span>
                        </div>
                        <div className="flex justify-between text-[10px] font-bold">
                            <span className="opacity-60 uppercase">P50 Response</span>
                            <span className="text-emerald-500 font-mono">42ms</span>
                        </div>
                    </div>
                </Card>

                {/* Agent Detail Grid */}
                <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents.map((agent) => (
                        <Card key={agent.id} className="border-border/50 bg-card hover:bg-secondary/5 transition-all group relative overflow-hidden">
                            <div className={`absolute top-0 right-0 p-3 flex flex-col items-end`}>
                                <div className={`h-1.5 w-1.5 rounded-full ${agent.status === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500'}`} />
                            </div>
                            <CardHeader className="pb-2 pt-4 px-5">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[9px] font-black font-mono text-primary/40">NODE-{agent.id}</span>
                                    <Badge variant="ghost" className="text-[8px] font-black uppercase bg-secondary px-1.5 h-4">{agent.type}</Badge>
                                </div>
                                <CardTitle className="text-xs font-bold tracking-tight text-foreground">{agent.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="px-5 pb-4 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Latency</p>
                                        <p className={`text-xs font-bold font-mono ${parseInt(agent.latency) > 300 ? 'text-destructive' : 'text-foreground'}`}>{agent.latency}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40 mb-1">Errors (24h)</p>
                                        <p className={`text-xs font-bold font-mono ${agent.errors > 0 ? 'text-amber-500' : 'text-foreground'}`}>{agent.errors}</p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-40">
                                        <span>Current Load</span>
                                        <span>{agent.load}%</span>
                                    </div>
                                    <div className="h-1 w-full bg-secondary/30 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ${agent.load > 85 ? 'bg-destructive' : 'bg-primary'}`} style={{ width: `${agent.load}%` }} />
                                    </div>
                                </div>
                            </CardContent>
                            <div className="px-5 py-2 border-t border-border/5 bg-secondary/5 flex items-center justify-between text-[9px] font-bold text-muted-foreground opacity-60">
                                <span className="flex items-center gap-1"><Clock size={10} /> Up: {agent.uptime}</span>
                                <Button variant="ghost" size="sm" className="h-5 text-[8px] font-black uppercase tracking-widest p-0 flex gap-1 hover:text-primary transition-colors">
                                    Debug <ChevronRight size={10} />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between text-[9px] font-black tracking-[0.3em] uppercase opacity-30 pt-4 border-t border-border/10">
                <span className="flex items-center gap-2">
                    <Zap className="text-primary" size={12} /> RPC Stream: CONNECTED
                </span>
                <span>FEDERATED ORCHESTRATION LAYER v4.2.1-PROD</span>
            </div>
        </div>
    );
};

export default AgentMonitor;
