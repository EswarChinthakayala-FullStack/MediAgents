import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
    FileText,
    Download,
    Plus,
    Calendar,
    Filter,
    BarChart3,
    Zap,
    Search,
    ChevronDown,
    Clock,
    FileImage,
    CheckCircle2,
    Database,
    Table as TableIcon,
    PieChart as PieIcon,
    Loader2,
    Sparkles
} from 'lucide-react';

const Reports = () => {
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, []);

    const handleGenerate = () => {
        setGenerating(true);
        // Simulating POST /api/reports → Agent 09
        setTimeout(() => {
            setGenerating(false);
            alert("Intelligent Clinical Report synthesized and ready for export.");
        }, 2000);
    };

    const recentReports = [
        { id: 'rep-442', title: 'Monthly Clinical Efficacy', type: 'Clinical', date: '2024-03-01', size: '2.4 MB', format: 'PDF' },
        { id: 'rep-441', title: 'Agent Performance Audit', type: 'Ops', date: '2024-02-28', size: '1.2 MB', format: 'EXCEL' },
        { id: 'rep-440', title: 'Population Health: Q1 Delta', type: 'Research', date: '2024-02-15', size: '840 KB', format: 'PDF' },
    ];

    if (loading) return <div className="h-96 flex flex-col items-center justify-center gap-4 text-center">
        <FileText className="animate-pulse text-primary" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Scanning Global Knowledge Corpus...</span>
    </div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
                        <FileText size={30} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Clinical intelligence Hub</h1>
                        <p className="text-muted-foreground text-xs font-bold tracking-[0.15em] uppercase opacity-60 italic">Agent 09 Report Synthesis • Multi-Source Aggregation</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 rounded-xl font-bold bg-secondary/30 border-border/50 gap-2 px-6">
                        <Calendar size={18} /> Scheduling
                    </Button>
                    <Button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 px-6 gap-2 shadow-xl shadow-primary/20"
                    >
                        {generating ? <Sparkles className="animate-spin" size={18} /> : <Plus size={18} />}
                        {generating ? "Synthesizing Intel..." : "Generate New Insight"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Report Builder */}
                <Card className="xl:col-span-2 border-border/50 bg-card shadow-none rounded-2xl overflow-hidden flex flex-col">
                    <CardHeader className="bg-secondary/10 border-b border-border/10 py-5">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <Zap className="text-primary" size={16} /> Intelligent Report Architect
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Select Analytics Domain</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: 'Patient Out.', icon: <CheckCircle2 size={14} />, active: true },
                                        { label: 'Agent Perf.', icon: <Zap size={14} />, active: false },
                                        { label: 'Revenue/Ops', icon: <Database size={14} />, active: false },
                                        { label: 'Compliance', icon: <TableIcon size={14} />, active: false },
                                    ].map((dom, i) => (
                                        <button key={i} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${dom.active ? 'bg-primary/10 border-primary text-primary shadow-lg shadow-primary/5' : 'bg-background border-border/40 text-muted-foreground hover:bg-secondary'}`}>
                                            {dom.icon}
                                            <span className="text-[10px] font-black uppercase">{dom.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Visual Layering</label>
                                <div className="space-y-3">
                                    {[
                                        { label: 'Include Heatmaps', icon: <FileImage size={14} />, enabled: true },
                                        { label: 'Include Demographic Pie', icon: <PieIcon size={14} />, enabled: true },
                                        { label: 'Raw Data Tables (Appendix)', icon: <TableIcon size={14} />, enabled: false },
                                    ].map((opt, i) => (
                                        <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/20 bg-background/50">
                                            <span className="flex items-center gap-2 text-xs font-bold text-foreground opacity-80">{opt.icon} {opt.label}</span>
                                            <div className={`h-4 w-7 rounded-full relative transition-colors ${opt.enabled ? 'bg-primary' : 'bg-border/30'}`}>
                                                <div className={`absolute top-0.5 h-3 w-3 bg-white rounded-full transition-all ${opt.enabled ? 'right-0.5' : 'left-0.5'}`} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-4">
                            <Sparkles className="text-primary mt-1 shrink-0" size={18} />
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-widest text-primary mb-1">Agent 09 Recommendation</p>
                                <p className="text-xs text-muted-foreground italic font-medium">"Based on recent telemetry spikes in the West Wing, I recommend including the 'Resource Bottleneck' sub-layer in this report."</p>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-secondary/5 border-t border-border/10 p-6 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        <span>ESTIMATED SYNTHESIS TIME: 14s</span>
                        <div className="flex gap-4">
                            <span>FORMAT: PDF/A</span>
                            <span>ENCRYPTION: AES-256</span>
                        </div>
                    </CardFooter>
                </Card>

                {/* Recent Reports List */}
                <div className="space-y-6">
                    <Card className="border-border/50 bg-background/50 border-dashed rounded-2xl p-6">
                        <CardHeader className="p-0 mb-6">
                            <CardTitle className="text-[11px] font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                                <Clock size={14} className="text-primary" /> Forensic Intel History
                            </CardTitle>
                        </CardHeader>
                        <div className="space-y-4">
                            {recentReports.map((report) => (
                                <div key={report.id} className="p-4 rounded-xl bg-card border border-border/40 flex flex-col gap-2 group hover:border-primary/40 transition-all cursor-pointer">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className="text-[8px] font-black uppercase bg-secondary px-1.5 h-4 border-none">{report.type}</Badge>
                                            <span className="text-[9px] font-black font-mono text-muted-foreground/40">{report.id}</span>
                                        </div>
                                        <Download size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <h4 className="text-xs font-bold tracking-tight text-foreground truncate">{report.title}</h4>
                                    <div className="flex items-center justify-between mt-1 text-[9px] font-bold text-muted-foreground opacity-60 uppercase">
                                        <span>{report.date}</span>
                                        <span>{report.size} · {report.format}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button variant="ghost" className="w-full mt-6 text-[10px] font-black uppercase tracking-widest gap-2 bg-secondary/30 hover:bg-secondary">
                            View Archive <ChevronDown size={14} />
                        </Button>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5 rounded-2xl p-6 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                            <BarChart3 size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary">Insight Coverage</p>
                            <p className="text-2xl font-black tracking-tightest">94.2%</p>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="flex items-center justify-between text-[9px] font-black tracking-[0.3em] uppercase opacity-30 pt-4 border-t border-border/10">
                <span>AGENT 09 AGGREGATION KERNEL active</span>
                <span className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-emerald-500" /> MULTI-CORPUS SYNC SUCCESSFUL
                </span>
                <span>DATA INTEGRITY: VERIFIED</span>
            </div>
        </div>
    );
};

export default Reports;
