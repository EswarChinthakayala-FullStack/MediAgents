import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
    Activity,
    ArrowLeft,
    ShieldAlert,
    Zap,
    Target,
    TrendingUp,
    TrendingDown,
    ArrowRight,
    Search,
    BrainCircuit,
    Info,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

const RiskScore = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [riskData, setRiskData] = useState(null);

    useEffect(() => {
        // Simulating Agent 04 call: GET /api/risk/{id}
        setTimeout(() => {
            setRiskData({
                primaryScore: 68.4,
                level: 'High Risk',
                riskType: '30-Day Readmission / Acute Event',
                lastUpdated: '2m ago',
                shapleyFactors: [
                    { feature: 'Elevated Troponin', impact: 12.5, type: 'increase' },
                    { feature: 'Heart Rate Variability', impact: 8.2, type: 'increase' },
                    { feature: 'Age (45)', impact: 4.1, type: 'increase' },
                    { feature: 'Ejection Fraction (Normal)', impact: -6.4, type: 'decrease' },
                    { feature: 'Medication Adherence', impact: -3.2, type: 'decrease' }
                ],
                interventions: [
                    { id: 1, title: 'Intensified Cardiac Monitoring', desc: 'Continuous 12-lead ECG and serial biomarker checks every 4h.', difficulty: 'moderate', impact: 'high' },
                    { id: 2, title: 'Cardiology Consultation', desc: 'Request sub-specialty review for percutaneous coronary intervention (PCI) readiness.', difficulty: 'high', impact: 'critical' },
                    { id: 3, title: 'Beta-Blocker Titration', desc: 'Optimize dosage based on real-time heart rate variability thresholds.', difficulty: 'low', impact: 'medium' }
                ]
            });
            setLoading(false);
        }, 1000);
    }, [id]);

    if (loading) return <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Activity className="animate-pulse text-primary" size={32} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Calculating Predictive Mortality...</span>
    </div>;

    const chartData = riskData.shapleyFactors.map(f => ({
        name: f.feature,
        value: f.impact,
        color: f.type === 'increase' ? 'hsl(var(--destructive))' : 'hsl(var(--emerald-500))'
    })).sort((a, b) => b.value - a.value);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header: Global Risk Level */}
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                <div className="flex items-center gap-4">
                    <Link to={`/clinical/patient/${id}`} className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-black tracking-tight uppercase">Predictive Risk Engine</h1>
                            <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-[9px] font-black tracking-wider uppercase rounded-sm h-5">Agent 04: Active</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase opacity-60">SHAP-based Feature Attribution for ID: {id}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground opacity-60 italic">
                    <Activity size={12} className="text-primary" /> Last calculated: {riskData.lastUpdated}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Main Risk Gauge */}
                <Card className="xl:col-span-1 border-border/50 bg-card/60 flex flex-col items-center justify-center p-8 relative overflow-hidden">
                    <div className="absolute top-0 inset-x-0 h-1.5 bg-destructive font-bold text-[8px] flex items-center justify-center text-white tracking-widest">{riskData.level}</div>

                    <div className="relative w-48 h-48 flex flex-col items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-secondary/30" />
                            <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={552} strokeDashoffset={552 - (552 * riskData.primaryScore) / 100} className="text-destructive shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all duration-1000 ease-out" strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-4xl font-black tracking-tighter">{riskData.primaryScore}%</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">Aggregated Score</span>
                        </div>
                    </div>

                    <div className="mt-8 text-center space-y-2">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">{riskData.riskType}</p>
                        <p className="text-[10px] text-muted-foreground italic leading-relaxed">Agent 04 has identified a cluster of biometric anomalies that align with the high-risk cohort.</p>
                    </div>
                </Card>

                {/* SHAP Waterfall Chart */}
                <Card className="xl:col-span-3 border-border/50 bg-card/40">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Target className="text-primary" size={14} /> Feature Attribution (SHAP Explainer)
                            </CardTitle>
                            <Info size={14} className="text-muted-foreground cursor-pointer" />
                        </div>
                        <CardDescription className="text-[10px] uppercase font-bold tracking-tight opacity-50">Quantitative impact of individual biometric features on risk prediction</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64 pt-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" opacity={0.2} />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--foreground))' }} width={140} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '10px' }}
                                />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                    <CardFooter className="bg-secondary/10 border-t border-border/10 py-3 px-6 flex justify-between">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-destructive"><TrendingUp size={10} /> Increase Risk</span>
                            <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-500"><TrendingDown size={10} /> Protective Factor</span>
                        </div>
                        <Button variant="ghost" className="h-7 text-[9px] font-bold uppercase tracking-widest gap-2">Explainer PDF <ArrowRight size={10} /></Button>
                    </CardFooter>
                </Card>
            </div>

            {/* Targeted Interventions */}
            <div className="space-y-4">
                <div className="flex items-center gap-2 px-2">
                    <Zap className="text-primary" size={16} />
                    <h3 className="text-xs font-black uppercase tracking-[0.15em] text-muted-foreground">Neural Intervention Roadmaps</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {riskData.interventions.map((task, i) => (
                        <Card key={i} className="bg-card/40 border-border/40 hover:bg-card/60 transition-all group cursor-pointer relative overflow-hidden">
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="outline" className={`text-[9px] font-black h-5 border-${task.impact === 'critical' || task.impact === 'high' ? 'destructive' : 'primary'}/20 text-${task.impact === 'critical' || task.impact === 'high' ? 'destructive' : 'primary'} uppercase tracking-widest`}>
                                        {task.impact} IMPACT
                                    </Badge>
                                    <span className="text-[9px] font-bold text-muted-foreground/40 uppercase font-mono">ID: {task.id}</span>
                                </div>
                                <CardTitle className="text-base font-bold tracking-tight text-foreground leading-tight">{task.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <p className="text-[11px] text-muted-foreground italic leading-relaxed">"{task.desc}"</p>
                            </CardContent>
                            <CardFooter className="pt-0 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 flex items-center gap-1.5">
                                    Difficulty: <span className="text-foreground">{task.difficulty}</span>
                                </span>
                                <Button className="h-8 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all">
                                    <ArrowRight size={14} />
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between text-[10px] font-black tracking-[0.3em] uppercase opacity-30 mt-6 pt-4 border-t border-border/10">
                <span className="flex items-center gap-2">
                    <BrainCircuit className="text-primary" size={12} /> Model: Ensemble XGBoost v4.2
                </span>
                <span>FEDERATED CLINICAL PREDICTION LAYER active</span>
            </div>
        </div>
    );
};

export default RiskScore;
