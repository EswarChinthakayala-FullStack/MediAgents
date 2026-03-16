import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
    Search,
    Filter,
    Clock,
    AlertCircle,
    ChevronRight,
    ArrowUpDown,
    CheckCircle2,
    Calendar,
    User,
    Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PatientQueue = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all, emergency, urgent, routine
    const [queue, setQueue] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulating Agent 02 call: GET /api/queue
        const mockQueue = [
            { id: '101', name: 'James Wilson', age: 45, gender: 'M', urgency: 'emergency', status: 'triage', waitTime: '12m', heartRate: 112, bp: '158/95', complaint: 'Chest pain, shortness of breath' },
            { id: '102', name: 'Sarah Miller', age: 28, gender: 'F', urgency: 'urgent', status: 'awaiting_md', waitTime: '24m', heartRate: 88, bp: '122/80', complaint: 'Severe abdominal pain' },
            { id: '103', name: 'Robert Chen', age: 52, gender: 'M', urgency: 'routine', status: 'records_review', waitTime: '45m', heartRate: 72, bp: '130/85', complaint: 'Follow-up hypertension' },
            { id: '104', name: 'Emily Davis', age: 34, gender: 'F', urgency: 'emergency', status: 'triage', waitTime: '4m', heartRate: 124, bp: '165/102', complaint: 'Acute allergic reaction' },
            { id: '105', name: 'Michael Brown', age: 67, gender: 'M', urgency: 'urgent', status: 'diagnostic', waitTime: '38m', heartRate: 95, bp: '142/88', complaint: 'Fractured radius' },
        ];

        setTimeout(() => {
            setQueue(mockQueue);
            setLoading(false);
        }, 800);
    }, []);

    const getUrgencyColor = (urgency) => {
        switch (urgency) {
            case 'emergency': return 'destructive';
            case 'urgent': return 'warning';
            case 'routine': return 'primary';
            default: return 'secondary';
        }
    };

    const filteredQueue = queue.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.complaint.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || p.urgency === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black tracking-tight uppercase">Clinical Triage Queue</h1>
                    <p className="text-muted-foreground text-xs font-bold tracking-widest uppercase opacity-60">Managed by Agent 02 (Triage Intelligence)</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        <Input
                            placeholder="Search patient..."
                            className="pl-9 h-9 text-xs"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-secondary/30 p-1 rounded-lg border border-border/50">
                        {['all', 'emergency', 'urgent', 'routine'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <Card className="border-border/50 bg-card/50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/10 bg-secondary/5">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Priority</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Patient</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Complaint</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Wait Time</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/5">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="px-6 py-8 h-12 bg-secondary/10"></td>
                                    </tr>
                                ))
                            ) : filteredQueue.map((patient) => (
                                <tr key={patient.id} className="group hover:bg-secondary/20 transition-all cursor-pointer" onClick={() => navigate(`/clinical/patient/${patient.id}`)}>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-1.5 h-8 rounded-full ${patient.urgency === 'emergency' ? 'bg-destructive' :
                                                    patient.urgency === 'urgent' ? 'bg-orange-500' : 'bg-primary'
                                                }`} />
                                            <Badge variant="outline" className={`
                                                uppercase text-[9px] font-black h-5
                                                ${patient.urgency === 'emergency' ? 'border-destructive/20 text-destructive bg-destructive/5' :
                                                    patient.urgency === 'urgent' ? 'border-orange-500/20 text-orange-500 bg-orange-500/5' :
                                                        'border-primary/20 text-primary bg-primary/5'}
                                            `}>
                                                {patient.urgency}
                                            </Badge>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                                                <User size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold tracking-tight">{patient.name}</p>
                                                <p className="text-[10px] text-muted-foreground font-mono">{patient.age}Y • {patient.gender} • ID: {patient.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div>
                                            <p className="text-[11px] font-semibold text-foreground italic mb-1">"{patient.complaint}"</p>
                                            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
                                                <span className="flex items-center gap-1"><Activity size={10} className="text-primary" /> HR: {patient.heartRate}</span>
                                                <span className="flex items-center gap-1"><Activity size={10} className="text-primary" /> BP: {patient.bp}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Clock size={12} className={patient.urgency === 'emergency' ? 'text-destructive animate-pulse' : 'text-muted-foreground'} />
                                            <span className={`text-[11px] font-bold ${parseInt(patient.waitTime) > 30 ? 'text-orange-500' : 'text-foreground'}`}>
                                                {patient.waitTime}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-primary/10 hover:text-primary">
                                            <ChevronRight size={18} />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="flex items-center justify-between text-[10px] font-black tracking-widest uppercase opacity-30 mt-4">
                <span className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Real-time Triage Feed Active
                </span>
                <span>Sorted by Wait-Time & Urgency Analytics</span>
            </div>
        </div>
    );
};

export default PatientQueue;
