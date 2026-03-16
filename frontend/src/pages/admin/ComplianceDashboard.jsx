import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Progress } from '../../components/ui/progress';
import {
    ShieldCheck,
    Lock,
    HandMetal,
    FileText,
    CheckCircle2,
    AlertCircle,
    Zap,
    Search,
    Globe,
    Cpu,
    ExternalLink,
    ChevronRight,
    Loader2,
    ShieldAlert
} from 'lucide-react';

const ComplianceDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [complianceData, setComplianceData] = useState(null);

    useEffect(() => {
        // Simulating GET /api/compliance → Agent 11
        setTimeout(() => {
            setComplianceData({
                overallScore: 98.4,
                categories: [
                    { name: 'HIPAA Technical Safeguards', score: 100, status: 'compliant', items: 12 },
                    { name: 'GDPR Data Processing', score: 94, status: 'caution', items: 8 },
                    { name: 'ISO/IEC 27001 Identity', score: 99, status: 'compliant', items: 15 },
                    { name: 'SOC2 Availability', score: 100, status: 'compliant', items: 10 }
                ],
                recentAudits: [
                    { name: 'Quarterly Pen-Test', date: '2024-03-01', result: 'Pass', color: 'emerald' },
                    { name: 'IAM Review', date: '2024-03-12', result: 'Pass', color: 'emerald' },
                    { name: 'BfDI Privacy Audit', date: '2024-02-15', result: 'Remediation', color: 'amber' }
                ],
                gdprStats: {
                    activeConsents: '94,221',
                    revokedConsents: '842',
                    dsarRequests: 3
                }
            });
            setLoading(false);
        }, 800);
    }, []);

    if (loading) return <div className="h-96 flex flex-col items-center justify-center gap-4">
        <ShieldCheck className="animate-pulse text-emerald-500" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Running Compliance Regression...</span>
    </div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
                        <ShieldCheck size={30} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Trust & Compliance</h1>
                        <p className="text-muted-foreground text-xs font-bold tracking-[0.15em] uppercase opacity-60 italic">Managed by Agent 11 (Audit Sentinel) • Real-time Monitoring</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" className="h-11 rounded-xl font-bold bg-secondary/30 border-border/50 gap-2 px-6">
                        <FileText size={18} /> Compliance Report
                    </Button>
                    <Button className="h-11 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-6 gap-2">
                        <Zap size={18} /> Run Manual Audit
                    </Button>
                </div>
            </div>

            {/* Overall Score */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-1 border-emerald-500/20 bg-emerald-500/5 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Lock size={120} />
                    </div>
                    <div className="relative z-10 space-y-4">
                        <div className="text-6xl font-black tracking-tightest text-emerald-500">{complianceData.overallScore}%</div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-foreground">Security Posture Score</p>
                            <p className="text-[10px] text-muted-foreground font-bold mt-1 opacity-60">Calculated via multi-vector risk analysis</p>
                        </div>
                        <Progress value={complianceData.overallScore} className="h-2 bg-emerald-500/20" indicatorClassName="bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        <div className="flex items-center justify-center gap-2 mt-4">
                            <Badge className="bg-emerald-500/20 text-emerald-600 border-none rounded-sm text-[9px] font-black uppercase tracking-widest">A+ Rating</Badge>
                            <Badge className="bg-primary/10 text-primary border-none rounded-sm text-[9px] font-black uppercase tracking-widest">Enterprise Grad</Badge>
                        </div>
                    </div>
                </Card>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {complianceData.categories.map((cat, i) => (
                        <Card key={i} className="border-border/50 bg-card/60 overflow-hidden hover:bg-card transition-all cursor-pointer group">
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start mb-2">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-foreground group-hover:text-primary transition-colors">
                                        {cat.name}
                                    </CardTitle>
                                    <Badge variant="outline" className={`text-[9px] font-black uppercase ${cat.status === 'compliant' ? 'border-emerald-500/20 text-emerald-500' : 'border-amber-500/20 text-amber-500'}`}>
                                        {cat.status}
                                    </Badge>
                                </div>
                                <div className="flex items-end gap-2">
                                    <span className="text-3xl font-black tracking-tighter">{cat.score}%</span>
                                    <span className="text-[10px] font-bold text-muted-foreground opacity-40 pb-1">{cat.items} controls active</span>
                                </div>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <div className="h-1.5 w-full bg-secondary/30 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${cat.status === 'compliant' ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${cat.score}%` }} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* HIPAA & GDPR Tracker */}
                <Card className="border-border/50 bg-background/50 border-dashed rounded-2xl">
                    <CardHeader>
                        <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                            <Globe className="text-primary" size={16} /> Data Sovereignty (GDPR)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-3 gap-4">
                        {[
                            { label: 'Active Consents', val: complianceData.gdprStats.activeConsents, icon: <CheckCircle2 className="text-emerald-500" /> },
                            { label: 'Revoked Consents', val: complianceData.gdprStats.revokedConsents, icon: <AlertCircle className="text-amber-500" /> },
                            { label: 'DSAR Requests', val: complianceData.gdprStats.dsarRequests, icon: <FileText className="text-primary" /> },
                        ].map((s, i) => (
                            <div key={i} className="p-4 rounded-xl bg-card border border-border/20 text-center space-y-2 group hover:border-primary/40 transition-all">
                                <div className="flex justify-center">{s.icon}</div>
                                <p className="text-lg font-black tracking-tighter">{s.val}</p>
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{s.label}</p>
                            </div>
                        ))}
                    </CardContent>
                    <CardFooter className="pt-0">
                        <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest gap-2 bg-secondary/30 hover:bg-secondary">
                            View Data processing inventory <ChevronRight size={14} />
                        </Button>
                    </CardFooter>
                </Card>

                {/* Audit History */}
                <Card className="border-border/50 bg-card rounded-2xl overflow-hidden">
                    <CardHeader className="bg-secondary/10 border-b border-border/10 py-5">
                        <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                            <ShieldAlert className="text-primary" size={16} /> Forensic Audit Registry
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border/5">
                            {complianceData.recentAudits.map((audit, i) => (
                                <div key={i} className="flex items-center justify-between p-5 hover:bg-secondary/5 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="h-9 w-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                                            <FileText size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold tracking-tight text-foreground">{audit.name}</p>
                                            <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-0.5 opacity-60">{audit.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Badge variant="outline" className={`text-[9px] font-black uppercase tracking-widest border-${audit.color}-500/20 text-${audit.color}-500`}>
                                            {audit.result}
                                        </Badge>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <ExternalLink size={14} className="text-muted-foreground" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-between text-[9px] font-black tracking-[0.3em] uppercase opacity-30 pt-4 border-t border-border/10">
                <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin text-primary" size={12} /> Agent 11 Integrity Hash Check: VALID
                </span>
                <span>BAA signed - HIPAA COMPLIANT ARCHITECTURE</span>
            </div>
        </div>
    );
};

export default ComplianceDashboard;
