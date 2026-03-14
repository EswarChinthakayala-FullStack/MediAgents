import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
    Users,
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock,
    TrendingUp,
    BrainCircuit,
    ShieldCheck,
    Zap,
    ArrowUpRight,
    Plus
} from 'lucide-react';

const Dashboard = () => {
    const stats = [
        { label: 'Active Patients', value: '1,284', change: '+12%', icon: <Users className="text-blue-500" /> },
        { label: 'Agent Uptime', value: '99.98%', change: '+0.02%', icon: <Zap className="text-emerald-500" /> },
        { label: 'Critical Tasks', value: '14', change: '-4', icon: <AlertTriangle className="text-amber-500" /> },
        { label: 'Completed Reviews', value: '450', change: '+84', icon: <CheckCircle2 className="text-primary" /> },
    ];

    const recentIncidents = [
        { patient: 'M. Scott', id: 'PT-9021', status: 'Emergency', time: '2m ago', severity: 'emergency' },
        { patient: 'P. Beesly', id: 'PT-9034', status: 'Urgent', time: '15m ago', severity: 'urgent' },
        { patient: 'J. Halpert', id: 'PT-9012', status: 'Self-Care', time: '1h ago', severity: 'selfcare' },
    ];

    const agentStates = [
        { name: 'Triage Engine', status: 'Processing', load: '14%', system: 'LLM-v4' },
        { name: 'Diagnostic Hub', status: 'Standby', load: '0%', system: 'Medi-Base' },
        { name: 'Safety Monitor', status: 'Global Vigilance', load: '8%', system: 'Sentinel' },
        { name: 'Pharmacy Agent', status: 'Syncing', load: '100%', system: 'Rx-DB' },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Clinical Dashboard</h1>
                    <p className="text-muted-foreground italic text-sm">Welcome back, Dr. Archer. Here's what's happening today.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm">Generate Report</Button>
                    <Button size="sm" className="gap-2">
                        <Plus size={16} />
                        Add Patient
                    </Button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="bg-card border-border shadow-none relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
                            {React.cloneElement(stat.icon, { size: 64 })}
                        </div>

                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                {stat.label}
                            </CardTitle>
                            <div className="p-1.5 rounded bg-secondary/50 group-hover:bg-secondary transition-colors">
                                {React.cloneElement(stat.icon, { size: 14 })}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold tracking-tight mb-1 text-foreground">{stat.value}</div>
                            <div className={`text-[10px] font-semibold flex items-center gap-1 ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                                <TrendingUp size={10} className={stat.change.startsWith('-') ? 'rotate-180' : ''} />
                                {stat.change} <span className="text-muted-foreground font-normal ml-1">vs last month</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Agents Status */}
                <Card className="lg:col-span-2 bg-card border-border shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-6">
                        <div>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <BrainCircuit className="text-primary h-4 w-4" />
                                Multi-Agent Network
                            </CardTitle>
                            <CardDescription className="text-muted-foreground text-xs">Real-time status of active AI coordinators</CardDescription>
                        </div>
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 rounded">12 Active</Badge>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            {agentStates.map((agent, i) => (
                                <div key={i} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center px-1">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-foreground">{agent.name}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">{agent.system}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${agent.status === 'Processing' ? 'bg-blue-500/10 text-blue-500' :
                                                agent.status === 'Standby' ? 'bg-secondary text-muted-foreground' :
                                                    agent.status === 'Syncing' ? 'bg-amber-500/10 text-amber-500 animate-pulse' :
                                                        'bg-emerald-500/10 text-emerald-500'
                                                }`}>
                                                {agent.status}
                                            </span>
                                            <span className="text-xs font-mono font-bold w-8 text-right text-foreground opacity-60">{agent.load}</span>
                                        </div>
                                    </div>
                                    <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-1000 ease-out ${parseInt(agent.load) > 80 ? 'bg-destructive' : 'bg-primary'
                                                }`}
                                            style={{ width: agent.load }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 p-4 rounded bg-secondary/20 border border-border flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-8 w-8 flex items-center justify-center rounded bg-primary/10 text-primary">
                                    <ShieldCheck size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs font-bold text-foreground">HIPAA Shield Active</span>
                                    <span className="text-[10px] text-muted-foreground">Clinical data is encrypted and secure.</span>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="text-primary hover:text-foreground hover:bg-transparent h-auto p-0 text-[11px] gap-1">
                                View Log
                                <ArrowUpRight size={12} />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Rapid Alert Feed */}
                <Card className="bg-card border-border shadow-none">
                    <CardHeader className="border-b border-border/50 pb-6">
                        <CardTitle className="flex items-center gap-2 text-foreground">
                            <AlertTriangle className="text-amber-500 h-4 w-4" />
                            Live Feed
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-xs">Priority patient events</CardDescription>
                    </CardHeader>
                    <CardContent className="px-0 pt-0">
                        <div className="flex flex-col divide-y divide-border/50">
                            {recentIncidents.map((incident, i) => (
                                <div key={i} className="px-6 py-4 flex gap-4 items-start hover:bg-secondary/30 transition-colors group">
                                    <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${incident.severity === 'emergency' ? 'bg-destructive animate-pulse' :
                                        incident.severity === 'urgent' ? 'bg-amber-500' :
                                            'bg-emerald-500'
                                        }`} />
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <span className="text-xs font-bold text-foreground">{incident.patient}</span>
                                            <span className="text-[10px] text-muted-foreground">{incident.time}</span>
                                        </div>
                                        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest mb-2">{incident.id}</span>
                                        <div className="flex gap-2">
                                            <Badge variant="outline" className={`text-[9px] px-1.5 py-0 capitalize rounded ${incident.severity === 'emergency' ? 'border-destructive/30 text-destructive bg-destructive/10' :
                                                incident.severity === 'urgent' ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' :
                                                    'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'
                                                }`}>
                                                {incident.status}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4">
                            <Button variant="outline" className="w-full text-[11px] h-8 text-muted-foreground hover:text-foreground">
                                Full Activity Log
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
