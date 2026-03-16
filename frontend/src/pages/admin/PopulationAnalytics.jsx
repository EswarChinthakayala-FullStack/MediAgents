import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    Activity,
    Globe,
    Filter,
    Download,
    Calendar,
    Search,
    ChevronDown,
    Map,
    ArrowUpRight,
    ArrowDownRight,
    SearchCode,
    PieChart as PieIcon
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
    Cell,
    PieChart,
    Pie
} from 'recharts';

const PopulationAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);

    useEffect(() => {
        // Simulating GET /api/analytics/population → Agent 09
        setTimeout(() => {
            setData({
                incidence: [
                    { name: 'Cardio', value: 400 },
                    { name: 'Endo', value: 300 },
                    { name: 'Resp', value: 200 },
                    { name: 'Neuro', value: 278 },
                    { name: 'Ortho', value: 189 },
                ],
                trends: [
                    { time: 'Jan', count: 120 }, { time: 'Feb', count: 210 }, { time: 'Mar', count: 180 },
                    { time: 'Apr', count: 280 }, { time: 'May', count: 240 }, { time: 'Jun', count: 320 }
                ],
                ageGroups: [
                    { name: '0-18', value: 15 },
                    { name: '19-35', value: 25 },
                    { name: '36-60', value: 40 },
                    { name: '60+', value: 20 }
                ],
                resourceLoad: [
                    { clinic: 'Main Hospital', load: 88 },
                    { clinic: 'West Wing', load: 42 },
                    { clinic: 'Community Hub', load: 65 },
                    { clinic: 'Urgent Care', load: 92 }
                ]
            });
            setLoading(false);
        }, 1000);
    }, []);

    const COLORS = ['hsl(var(--primary))', 'hsl(var(--emerald-500))', 'hsl(var(--amber-500))', 'hsl(var(--destructive))', 'hsl(var(--blue-500))'];

    if (loading) return <div className="h-96 flex items-center justify-center opacity-40">
        <Globe className="animate-spin text-primary mr-3" size={32} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Mapping Population Health Geospatial Data...</span>
    </div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Population intelligence</h1>
                    <p className="text-muted-foreground text-xs font-bold tracking-[0.15em] uppercase opacity-60 italic">Agent 09 Ecosystem Analytics • Multi-Region Aggregate</p>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="h-11 rounded-xl font-bold bg-secondary/30 border-border/50 gap-2 px-6">
                        <Filter size={18} /> Global Filters
                    </Button>
                    <Button className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 px-6 gap-2">
                        <Download size={18} /> intelligence Export
                    </Button>
                </div>
            </div>

            {/* Metric Overview Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Patient Base', val: '24,812', trend: '+1.4%', color: 'emerald', icon: <Users /> },
                    { label: 'Disease Prevalence', val: '14.2%', trend: '-0.2%', color: 'emerald', icon: <Activity /> },
                    { label: 'Resource Load', val: '72.4%', trend: '+4.5%', color: 'amber', icon: <BarChart3 /> },
                    { label: 'Outcome Index', val: '9.4', trend: 'Optimal', color: 'emerald', icon: <TrendingUp /> },
                ].map((stat, i) => (
                    <Card key={i} className="border-border/40 bg-card/60 overflow-hidden group">
                        <CardHeader className="pb-2 pt-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                                <span className={`text-${stat.color}-500`}>{stat.icon}</span> {stat.label}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <div className="text-3xl font-black tracking-tighter mb-1">{stat.val}</div>
                            <div className={`text-[10px] font-bold uppercase tracking-widest text-${stat.color}-500/80`}>{stat.trend} from prev. Month</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Disease Incidence Area Chart */}
                <Card className="xl:col-span-2 border-border/50 bg-card shadow-none rounded-2xl overflow-hidden">
                    <CardHeader className="bg-secondary/10 border-b border-border/10 py-5">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <Map className="text-primary" size={16} /> Regional incidence Trend
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="h-80 pt-8">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.trends}>
                                <defs>
                                    <linearGradient id="colorC" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} />
                                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '11px' }} />
                                <Area type="monotone" dataKey="count" name="Case Count" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorC)" strokeWidth={4} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Resource Utilization Column */}
                <Card className="border-border/50 bg-background/50 border-dashed rounded-2xl">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            <Activity className="text-primary" size={18} /> Node Load Distribution
                        </CardTitle>
                        <CardDescription className="text-[10px] uppercase font-bold tracking-tight opacity-50">Operational capacity per clinical cluster</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2">
                        {data.resourceLoad.map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between items-center text-[11px] font-bold">
                                    <span className="text-foreground">{item.clinic}</span>
                                    <span className={item.load > 85 ? 'text-destructive' : 'text-primary'}>{item.load}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-secondary/40 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${item.load > 85 ? 'bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'bg-primary'}`}
                                        style={{ width: `${item.load}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button variant="ghost" className="w-full h-10 border border-border/50 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-secondary">View Regional Map</Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Categorical Breakdown */}
                <Card className="border-border/50 bg-card/40">
                    <CardHeader>
                        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            <PieIcon className="text-primary" size={16} /> Demographic Stratification
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-around h-64">
                        <div className="h-full w-1/2">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.ageGroups}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {data.ageGroups.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-3">
                            {data.ageGroups.map((group, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">{group.name}</span>
                                    <span className="text-xs font-bold font-mono">{group.value}%</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* High Risk Cohort Alerts */}
                <Card className="border-border/50 bg-background/30 border-dashed rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-destructive">
                            <SearchCode size={16} /> Anomalous Risk Outliers
                        </CardTitle>
                        <CardDescription className="text-[10px] uppercase font-bold tracking-tight opacity-50">Identified by Agent 04 Ensemble Predictor</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { cohort: 'Geri-Cardio (North)', risk: 88, status: 'rising' },
                            { cohort: 'Diabetic Type-II (East)', risk: 64, status: 'stable' },
                            { cohort: 'Post-Op Observation', risk: 42, status: 'decreasing' },
                        ].map((item, i) => (
                            <div key={i} className="p-4 rounded-xl bg-background border border-border/40 flex items-center justify-between group hover:border-primary/40 transition-all">
                                <div>
                                    <h4 className="text-xs font-bold tracking-tight text-foreground">{item.cohort}</h4>
                                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">Aggregate Risk: {item.risk}%</p>
                                </div>
                                <div className="text-right">
                                    {item.status === 'rising' ? <ArrowUpRight className="text-destructive" size={18} /> :
                                        item.status === 'decreasing' ? <ArrowDownRight className="text-emerald-500" size={18} /> :
                                            <Activity className="text-primary" size={18} />}
                                    <p className={`text-[9px] font-bold uppercase tracking-widest mt-1 ${item.status === 'rising' ? 'text-destructive' : 'text-primary'}`}>{item.status}</p>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-between text-[9px] font-black tracking-[0.3em] uppercase opacity-30 pt-4 border-t border-border/10">
                <span>AGENT 09 AGGREGATION KERNEL</span>
                <span className="flex items-center gap-2">
                    <Globe size={10} /> MULTI-CORPUS DATA RECONCILIATION ACTIVE
                </span>
                <span>ISO 27701 PRIVACY COMPLIANT</span>
            </div>
        </div>
    );
};

export default PopulationAnalytics;
