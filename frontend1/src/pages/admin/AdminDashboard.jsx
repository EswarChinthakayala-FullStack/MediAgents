import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
    ShieldCheck,
    Settings,
    Database,
    Lock,
    Activity,
    Globe,
    Cpu,
    Server,
    Key,
    UserCircle,
    HardDrive
} from 'lucide-react';

const AdminDashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
            {/* Admin Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/10 pb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors uppercase text-[9px] font-black tracking-widest px-2 py-0">SuperAdmin</Badge>
                        <span className="text-[10px] text-muted-foreground font-bold tracking-widest uppercase opacity-40">System Node: US-EAST-1</span>
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase leading-none">Management Console</h1>
                    <p className="text-muted-foreground text-xs mt-2 italic font-medium">Control center for ClinicAI infrastructure, identity, and clinical data governance.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-border/50 h-10 px-4 rounded-md text-xs font-bold gap-2 hover:bg-secondary/50">
                        <HardDrive size={14} />
                        Instance Logs
                    </Button>
                    <Button className="h-10 px-4 rounded-md text-xs font-bold gap-2 shadow-lg shadow-primary/10">
                        <Settings size={14} />
                        Global Config
                    </Button>
                </div>
            </div>

            {/* Infrastructure Health */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Users', value: '14,282', icon: <UserCircle size={18} />, status: 'Online' },
                    { label: 'Storage Used', value: '2.4 TB', icon: < HardDrive size={18} />, status: 'Healthy' },
                    { label: 'Active Clusters', value: '12/12', icon: <Cpu size={18} />, status: 'Scaling' },
                    { label: 'Security Score', value: '99.9%', icon: <ShieldCheck size={18} />, status: 'Optimal' },
                ].map((stat, i) => (
                    <Card key={i} className="bg-card/40 border-border/50 hover:border-primary/20 transition-all cursor-crosshair">
                        <CardContent className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 rounded-lg bg-secondary/50 text-muted-foreground group-hover:text-primary transition-colors">
                                    {stat.icon}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[9px] font-black uppercase text-emerald-500/70 tracking-tighter">{stat.status}</span>
                                </div>
                            </div>
                            <div className="text-xl font-black tracking-tighter leading-none mb-1">{stat.value}</div>
                            <div className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-50">{stat.label}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Admin Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Identity & Access Management */}
                <Card className="bg-card border-border/50 shadow-none rounded-sm overflow-hidden border-t-4 border-t-primary">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <Key className="text-primary" size={20} />
                            <CardTitle className="text-sm font-black uppercase tracking-[0.1em]">Identity & IAM (Keycloak)</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4">
                        <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/50">
                            <div className="flex items-center gap-3">
                                <Activity className="text-emerald-500" size={16} />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-tight">Clinical Realm</span>
                                    <span className="text-[10px] text-muted-foreground font-medium">8,200 active ڈاکٹر sessions</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-[10px] font-black text-primary hover:bg-primary/5 uppercase">Manage Realm</Button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/50">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="text-primary" size={16} />
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold uppercase tracking-tight">Patient Portal Auth</span>
                                    <span className="text-[10px] text-muted-foreground font-medium">JWT / OAuth2 flow active</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-[10px] font-black text-primary hover:bg-primary/5 uppercase">Audits</Button>
                        </div>

                        <div className="pt-4 space-y-2">
                            <div className="flex justify-between text-[10px] font-bold text-muted-foreground px-1 uppercase tracking-widest">
                                <span>Recent Access Violations</span>
                                <span className="text-destructive">None Detected (24h)</span>
                            </div>
                            <div className="h-1 w-full bg-secondary/30">
                                <div className="h-full bg-primary/20 w-full animate-pulse"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* System Monitoring */}
                <Card className="bg-card border-border/50 shadow-none rounded-sm overflow-hidden border-r-4 border-r-slate-800">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <Server className="text-muted-foreground" size={20} />
                            <CardTitle className="text-sm font-black uppercase tracking-[0.1em]">Database & Core Health</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            {[
                                { name: 'Main Clinical DB (Postgres)', health: '99%', load: '12%', status: 'Primary' },
                                { name: 'Audit Log Storage (Elastic)', health: '100%', load: '45%', status: 'Indexing' },
                                { name: 'Edge Functions (V8)', health: '98%', load: '08%', status: 'Global' },
                            ].map((repo, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-[11px] font-bold px-1 uppercase tracking-tight">
                                        <span>{repo.name}</span>
                                        <Badge variant="ghost" className="text-[9px] font-black bg-secondary px-2 h-5 rounded-md text-muted-foreground">{repo.status}</Badge>
                                    </div>
                                    <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden flex">
                                        <div className="h-full bg-primary" style={{ width: repo.load }}></div>
                                    </div>
                                    <div className="flex justify-between text-[8px] text-muted-foreground font-black tracking-widest uppercase px-1">
                                        <span>Load: {repo.load}</span>
                                        <span className="text-primary italic">Health: {repo.health}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full h-11 bg-white text-black hover:bg-slate-200 mt-8 text-xs font-black uppercase tracking-[0.2em] rounded-sm transition-all shadow-xl shadow-black/10">Full Ops Console</Button>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center gap-4 pt-10 px-2 opacity-20">
                <Globe size={18} />
                <div className="h-[1px] flex-1 bg-gradient-to-r from-muted-foreground to-transparent"></div>
                <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                    <span>MediAgents v2.4.0-Admin</span>
                    <span>•</span>
                    <span>Build 0392-XPA</span>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
