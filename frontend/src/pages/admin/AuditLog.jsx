import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
    ShieldCheck,
    Search,
    Filter,
    Download,
    Clock,
    Lock,
    Eye,
    ExternalLink,
    FileCode,
    Activity,
    AlertTriangle,
    CheckCircle2,
    Calendar,
    ChevronRight,
    Terminal,
    Loader2
} from 'lucide-react';

const AuditLog = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        // Simulating GET /api/audit → Agent 11 immutable log
        const mockLogs = [
            { id: 'ev-9421', timestamp: '2024-03-16 14:22:10', actor: 'Dr. Michael Chen', action: 'EHR_ACCESS', entity: 'Patient#101', ip: '192.168.1.142', outcome: 'success', severity: 'low', hash: 'sha256:8f4a...2bc1' },
            { id: 'ev-9422', timestamp: '2024-03-16 14:18:45', actor: 'Admin Jupiter', action: 'ROLE_CHANGE', entity: 'User#u4', ip: '10.0.4.12', outcome: 'success', severity: 'medium', hash: 'sha256:d91c...90e3' },
            { id: 'ev-9423', timestamp: '2024-03-16 13:55:02', actor: 'System Process', action: 'AGENT_ROTATION', entity: 'Agent#03', ip: 'localhost', outcome: 'success', severity: 'low', hash: 'sha256:72b5...f115' },
            { id: 'ev-9424', timestamp: '2024-03-16 12:40:15', actor: 'Unauthorized Node', action: 'AUTH_FAILURE', entity: 'IAM_PORTAL', ip: '185.244.12.8', outcome: 'denied', severity: 'critical', hash: 'sha256:a442...c892' },
            { id: 'ev-9425', timestamp: '2024-03-16 12:12:30', actor: 'Emily Vance', action: 'DATA_EXPORT', entity: 'Patient_Cohort_33', ip: '192.168.1.185', outcome: 'success', severity: 'high', hash: 'sha256:ce4f...e65a' },
        ];

        setTimeout(() => {
            setLogs(mockLogs);
            setLoading(false);
        }, 1000);
    }, []);

    const filteredLogs = logs.filter(l =>
        l.actor.toLowerCase().includes(search.toLowerCase()) ||
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.entity.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
                        <Lock size={30} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Immutable Audit Trail</h1>
                        <p className="text-muted-foreground text-xs font-bold tracking-[0.15em] uppercase opacity-60 italic">Agent 11 Sentinel • Cryptographically Verified Events</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input
                            placeholder="Filter by hash, entity, or ID..."
                            className="h-11 pl-10 bg-secondary/30 border-border/50 rounded-xl text-xs font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-11 rounded-xl font-bold bg-secondary/30 border-border/50 gap-2 px-6">
                        <Download size={18} /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Verification Banner */}
            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3 text-emerald-500">
                    <ShieldCheck size={20} />
                    <span className="text-[11px] font-black uppercase tracking-widest italic">Chain Integrity Verified: 0.00% tampering detected in current shard.</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground opacity-60 font-mono">
                    Last Global Sync: 14:22:15 UTC • 2,842 Events Verified
                </div>
            </div>

            {/* Audit Logs Table */}
            <Card className="border-border/50 bg-card shadow-none rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/10 bg-secondary/5">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Timestamp / Event ID</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Actor Entity</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action / Object</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Status / Origin</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Verification Hash</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/5 font-mono">
                            {loading ? (
                                [1, 2, 3].map(i => <tr key={i} className="animate-pulse h-16"><td colSpan={5} className="bg-secondary/10"></td></tr>)
                            ) : filteredLogs.map((log) => (
                                <tr key={log.id} className="group hover:bg-secondary/10 transition-all cursor-pointer">
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[11px] font-bold text-foreground">{log.timestamp}</span>
                                            <span className="text-[9px] font-black tracking-widest text-primary/60">{log.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center text-muted-foreground">
                                                {log.actor.includes('System') ? <Terminal size={12} /> : <Activity size={12} />}
                                            </div>
                                            <span className="text-[11px] font-bold tracking-tight text-foreground">{log.actor}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Badge className={`text-[9px] font-black h-5 uppercase
                                                    ${log.severity === 'critical' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                                                        log.severity === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                                                            log.severity === 'medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-primary/10 text-primary border-primary/20'}
                                                `}>
                                                    {log.action}
                                                </Badge>
                                                {log.severity === 'critical' && <AlertTriangle size={12} className="text-destructive animate-pulse" />}
                                            </div>
                                            <span className="text-[10px] font-bold italic text-muted-foreground opacity-60">ID: {log.entity}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <div className={`h-1.5 w-1.5 rounded-full ${log.outcome === 'success' ? 'bg-emerald-500' : 'bg-destructive'}`} />
                                                <span className="text-[10px] font-black uppercase text-foreground">{log.outcome}</span>
                                            </div>
                                            <span className="text-[9px] text-muted-foreground opacity-40 font-mono">Source: {log.ip}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[10px] font-bold text-primary/40 group-hover:text-primary transition-colors cursor-help truncate max-w-[120px]" title={log.hash}>
                                                {log.hash}
                                            </span>
                                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                                <ExternalLink size={12} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="flex items-center justify-between text-[10px] font-black tracking-[0.3em] uppercase opacity-30 pt-4 border-t border-border/10">
                <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin text-primary" size={12} /> Agent 11 Polling active... next shard rotation in 14m
                </span>
                <span>CRYPTOGRAPHIC HASH-CHAINING ACTIVE</span>
            </div>
        </div>
    );
};

export default AuditLog;
