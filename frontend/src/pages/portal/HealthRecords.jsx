import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
    FileText,
    Search,
    Filter,
    Download,
    Eye,
    Lock,
    ShieldCheck,
    Dna,
    Microscope,
    Activity,
    LineChart,
    ChevronRight,
    ArrowUpRight
} from 'lucide-react';

const HealthRecords = () => {
    const [view, setView] = useState('list'); // list | timeline

    const records = [
        { id: 1, title: 'Post-Op Surgical Report', date: 'Oct 10, 2026', category: 'Surgery', doctor: 'Dr. Michael Chen', type: 'PDF' },
        { id: 2, title: 'Complete Blood Count (CBC)', date: 'Oct 05, 2026', category: 'Lab Result', doctor: 'Central Labs', type: 'Data' },
        { id: 3, title: 'MRI Left Knee - Axial', date: 'Sep 28, 2026', category: 'Imaging', doctor: 'Radiology Dept', type: 'DICOM' },
        { id: 4, title: 'Primary Consultation Note', date: 'Sep 15, 2026', category: 'Clinical', doctor: 'Dr. Sarah Mitchell', type: 'Note' },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-border/10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group hover:scale-110 transition-transform">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Health Records</h1>
                        <p className="text-muted-foreground text-sm italic">Access your immutable clinical history and lab results.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="h-11 px-4 rounded-xl border-border/50 font-bold uppercase tracking-widest text-[10px] gap-2 hover:bg-secondary/50">
                        <LineChart size={14} className="text-primary" />
                        Trends Analysis
                    </Button>
                    <Button className="h-11 rounded-xl font-black uppercase tracking-widest text-[10px] px-6 shadow-xl shadow-primary/10 gap-2">
                        <Download size={14} />
                        Export All (PDF)
                    </Button>
                </div>
            </div>

            {/* Quick Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'EHR Integrity', value: 'Verified', icon: <ShieldCheck size={18} />, color: 'emerald' },
                    { label: 'DNA Profile', value: 'Sequenced', icon: <Dna size={18} />, color: 'primary' },
                    { label: 'Lab Accuracy', value: '99.9%', icon: <Microscope size={18} />, color: 'amber' },
                ].map((stat, i) => (
                    <Card key={i} className="bg-card/40 border-border/50 relative overflow-hidden group hover:border-primary/20 transition-all">
                        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform text-${stat.color}-500`}>
                            {stat.icon}
                        </div>
                        <CardContent className="p-6">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1">{stat.label}</div>
                            <div className="text-xl font-black tracking-tight">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={18} />
                    <input
                        placeholder="Search records, doctors, or keywords..."
                        className="h-12 w-full bg-card border border-border/50 rounded-xl pl-12 pr-6 text-sm font-medium focus:ring-1 focus:ring-primary/40 focus:border-primary/40 transition-all outline-none"
                    />
                </div>
                <div className="flex bg-secondary/30 p-1 rounded-xl border border-border/50">
                    <Button
                        variant={view === 'list' ? 'default' : 'ghost'}
                        onClick={() => setView('list')}
                        className="h-10 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest"
                    >
                        List View
                    </Button>
                    <Button
                        variant={view === 'timeline' ? 'default' : 'ghost'}
                        onClick={() => setView('timeline')}
                        className="h-10 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest"
                    >
                        Timeline
                    </Button>
                </div>
            </div>

            {/* Records List / Timeline */}
            <div className="space-y-6">
                {view === 'list' ? (
                    <div className="space-y-4">
                        {records.map((record) => (
                            <Card key={record.id} className="border-border/40 bg-card/60 hover:bg-card hover:shadow-xl transition-all group overflow-hidden border-l-4 border-l-transparent hover:border-l-primary">
                                <CardContent className="p-0">
                                    <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex items-center gap-5">
                                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${record.type === 'PDF' ? 'bg-rose-500/10 text-rose-500' : record.type === 'Data' ? 'bg-emerald-500/10 text-emerald-500' : record.type === 'DICOM' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h4 className="font-bold text-base tracking-tight">{record.title}</h4>
                                                    <Badge variant="ghost" className="h-4 px-1.5 text-[8px] font-black uppercase bg-secondary text-muted-foreground border-none rounded">
                                                        {record.type}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium italic">
                                                    <span className="flex items-center gap-1.5"><Activity size={10} className="text-primary" /> {record.category}</span>
                                                    <span className="opacity-20">•</span>
                                                    <span>Issuing: {record.doctor}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between md:justify-end gap-6 md:min-w-[200px]">
                                            <div className="text-right flex flex-col items-end">
                                                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-tighter opacity-60">Record Date</span>
                                                <span className="text-xs font-bold whitespace-nowrap">{record.date}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                                                    <Eye size={18} />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                                                    <Download size={18} />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="relative pl-8 border-l border-border/50 ml-4 space-y-12 py-4">
                        {records.map((record, i) => (
                            <div key={record.id} className="relative">
                                <div className="absolute -left-[41px] top-0 h-4 w-4 rounded-full bg-background border-4 border-primary shadow-[0_0_10px_rgba(62,207,142,0.5)]"></div>
                                <div className="space-y-4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">{record.date}</span>
                                        <h3 className="text-lg font-bold tracking-tight">{record.title}</h3>
                                    </div>
                                    <Card className="max-w-xl border-border/40 bg-card/40 hover:bg-card transition-all">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-secondary/50 flex items-center justify-center text-muted-foreground">
                                                    <FileText size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold">{record.doctor}</span>
                                                    <span className="text-[9px] text-muted-foreground italic">{record.category}</span>
                                                </div>
                                            </div>
                                            <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest group">
                                                View Document
                                                <ArrowUpRight size={12} className="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Legend */}
            <div className="pt-10 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 opacity-40">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <Lock size={14} className="text-primary" /> AES-256 VAULT STORAGE
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <Activity size={14} className="text-primary" /> REAL-TIME EHR SYNC
                </div>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                    <ChevronRight size={14} className="text-primary" /> HL7 FHIR COMPLIANT
                </div>
            </div>
        </div>
    );
};

export default HealthRecords;
