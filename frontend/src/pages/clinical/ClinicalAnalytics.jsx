import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Clock,
    Users,
    Activity,
    ShieldCheck,
    Globe,
    Zap,
    Download,
    Calendar,
    ChevronDown
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
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const ClinicalAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        // Simulating Agent 09 call: GET /api/analytics/doctor/{id}
        setTimeout(() => {
            setData({
                outcomes: [
                    { month: 'Oct', successful: 85, readmit: 5 },
                    { month: 'Nov', successful: 88, readmit: 4 },
                    { month: 'Dec', successful: 92, readmit: 3 },
                    { month: 'Jan', successful: 90, readmit: 6 },
                    { month: 'Feb', successful: 95, readmit: 2 },
                    { month: 'Mar', successful: 98, readmit: 1 }
                ],
                waitTimesByPriority: [
                    { priority: 'Emergency', time: 4 },
                    { priority: 'Urgent', time: 18 },
                    { priority: 'Routine', time: 55 }
                ],
                conditionPrevalence: [
                    { name: 'Cardiovascular', value: 35 },
                    { name: 'Respiratory', value: 25 },
                    { name: 'Neurological', value: 20 },
                    { name: 'Endocrine', value: 20 }
                ]
            });
            setLoading(false);
        }, 800);
    }, []);

    const COLORS = ['hsl(var(--primary))', 'hsl(var(--emerald-500))', 'hsl(var(--amber-500))', 'hsl(var(--destructive))'];

    if (loading) return <div className="h-96 flex items-center justify-center opacity-40">
        <BarChart3 className="animate-pulse text-primary mr-3" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Aggregating Population Health Nodes...</span>
    </div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="text-3xl font-black tracking-tighter uppercase">Clinical Intelligence Overview</h1>
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black tracking-wider uppercase rounded-sm h-5">Agent 09: Operational</Badge>
                    </div>
                    <p className="text-muted-foreground text-xs font-bold tracking-[0.15em] uppercase opacity-60 italic">Managed by Agent 09 (Data Architect) • Quarterly Performance Review</p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="h-11 rounded-xl font-bold bg-secondary/30 border-border/50 gap-2 px-6">
                        <Calendar size={18} /> Last 90 Days <ChevronDown size={14} />
                    </Button>
                    <Button className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 px-6 gap-2 shadow-xl shadow-primary/20">
                        <Download size={18} /> Export Intel Report
                    </Button>
                </div>
            </div>

            {/* Top Metrics Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Patient Outcomes (Success)', val: '98.2%', trend: '+4.5%', color: 'emerald', icon: <ShieldCheck /> },
                    { label: 'Avg Emergency Wait', val: '4.2m', trend: '-1.2m', color: 'primary', icon: <Clock /> },
                    { label: 'Readmission Rate', val: '0.8%', trend: '-2.1%', color: 'blue', icon: <Activity /> },
                    { label: 'Clinical Agent Uptime', val: '99.99%', trend: 'Stable', color: 'orange', icon: <Zap /> },
                ].map((stat, i) => (
                    <Card key={i} className="border-border/40 bg-card/60 relative overflow-hidden group">
                        <CardHeader className="pb-2 pt-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <span className={`text-${stat.color}-500`}>{stat.icon}</span> {stat.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <div className="text-3xl font-black tracking-tighter mb-1">{stat.val}</div>
                            <div className={`text-[10px] font-bold uppercase tracking-widest text-${stat.color}-500/80`}>{stat.trend} from prev. period</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Analytics Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Population Outcomes (AreaChart) */}
                <Card className="xl:col-span-2 border-border/50 bg-card shadow-none rounded-2xl overflow-hidden">
                    <CardHeader className="bg-secondary/10 border-b border-border/10 py-5">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <Activity className="text-primary" size={14} /> Longitudinal Patient Outcomes
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-80 pt-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.outcomes}>
                                <defs>
                                    <linearGradient id="colorSuccessful" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '11px' }}
                                />
                                <Area type="monotone" dataKey="successful" name="Optimal Recovery" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSuccessful)" strokeWidth={4} />
                                <Area type="monotone" dataKey="readmit" name="Unexpected Readmission" stroke="hsl(var(--destructive))" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Efficiency Stats (BarChart) */}
                <Card className="border-border/50 bg-background/50 border-dashed rounded-2xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <Clock className="text-primary" size={18} /> Efficiency Index
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.waitTimesByPriority} margin={{ left: -20 }}>
                                    <XAxis dataKey="priority" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} />
                                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', fontSize: '10px' }} />
                                    <Bar dataKey="time" name="Avg Minutes" radius={[4, 4, 0, 0]} barSize={40}>
                                        {data.waitTimesByPriority.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-4 pt-2">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Clinical Prevalence Distribution</h4>
                            <div className="flex items-center justify-between gap-2 h-8 w-full rounded-full overflow-hidden bg-secondary/20">
                                {data.conditionPrevalence.map((item, i) => (
                                    <div
                                        key={item.name}
                                        style={{ width: `${item.value}%`, backgroundColor: COLORS[i % COLORS.length] }}
                                        className="h-full group relative cursor-pointer"
                                    >
                                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-popover border border-border p-2 rounded-lg text-[10px] font-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xl">
                                            {item.name}: {item.value}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {data.conditionPrevalence.map((item, i) => (
                                    <div key={item.name} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                                        <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-between text-[9px] font-black tracking-[0.3em] uppercase opacity-30 pt-4">
                <span>FEDERATED LEARNING NODE: 09-ANALYTICS</span>
                <span className="flex items-center gap-2">
                    <Globe size={10} /> GLOBAL CLINICAL BENCHMARKING ACTIVE
                </span>
                <span>DATA INTEGRITY: VERIFIED (SHA-256)</span>
            </div>
        </div>
    );
};

export default ClinicalAnalytics;
