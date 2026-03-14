import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
    Users,
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock,
    BrainCircuit,
    Plus,
    Search,
    Stethoscope
} from 'lucide-react';

const ClinicalDashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
            {/* Clinical Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
                        <Stethoscope size={30} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Clinical Station</h1>
                        <p className="text-muted-foreground text-xs font-bold tracking-[0.15em] uppercase opacity-60 italic">Attending: Dr. Michael Chen (Gen. Surgical)</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <div className="relative group flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={16} />
                        <input
                            placeholder="Find Patient or Record (⌘K)"
                            className="h-11 w-full md:w-64 bg-secondary/30 border border-border/50 rounded-xl pl-10 pr-4 text-xs font-medium focus:ring-1 focus:ring-primary focus:bg-background transition-all"
                        />
                    </div>
                    <Button className="h-11 gap-2 rounded-xl bg-primary hover:bg-primary/90 font-bold px-6 shadow-xl shadow-primary/10">
                        <Plus size={18} />
                        New Admission
                    </Button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Ward Occupancy', value: '42/50', icon: <Users size={16} />, trend: '84%', color: 'primary' },
                    { label: 'Critical Alerts', value: '03', icon: <AlertTriangle size={16} />, trend: 'Priority', color: 'destructive' },
                    { label: 'Pending Reviews', value: '14', icon: <Clock size={16} />, trend: '-2 hr', color: 'amber' },
                    { label: 'Avg. Discharge', value: '3.2 d', icon: <CheckCircle2 size={16} />, trend: '+0.4', color: 'emerald' },
                ].map((stat, i) => (
                    <Card key={i} className="border-border/40 bg-card/60 relative overflow-hidden group">
                        <div className={`absolute top-0 right-0 p-3 opacity-[0.05] group-hover:scale-110 transition-transform`}>
                            {React.cloneElement(stat.icon, { size: 48 })}
                        </div>
                        <CardHeader className="pb-2 pt-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</CardTitle>
                        </CardHeader>
                        <CardContent className="pb-4">
                            <div className="text-2xl font-black tracking-tighter mb-1">{stat.value}</div>
                            <div className={`text-[9px] font-bold uppercase tracking-widest text-${stat.color}-500/80`}>{stat.trend}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Main Clinical Content */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Active Patient List */}
                <Card className="xl:col-span-2 border-border/50 bg-card shadow-none rounded-2xl overflow-hidden">
                    <CardHeader className="bg-secondary/10 border-b border-border/10 py-5">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Activity className="text-primary" size={14} />
                                Active Admissions
                            </CardTitle>
                            <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 rounded-md">12 Patients Stable</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border/5 bg-secondary/5">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Patient Name</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Bed ID</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Vitals Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">AI Observation</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/5 text-xs">
                                    {[
                                        { name: 'Smith, Robert', bed: 'ICU-04', status: 'Stable', observation: 'Mild tachycardia noted', color: 'emerald' },
                                        { name: 'Johnson, Elena', bed: 'GEN-22', status: 'Improving', observation: 'Recovery ahead of schedule', color: 'primary' },
                                        { name: 'Wilson, David', bed: 'EMR-01', status: 'Critical', observation: 'High vigilance required', color: 'destructive' },
                                        { name: 'Patterson, Mia', bed: 'GEN-18', status: 'Stable', observation: 'Post-op pain managed', color: 'emerald' },
                                    ].map((patient, i) => (
                                        <tr key={i} className="hover:bg-secondary/10 transition-colors group cursor-pointer">
                                            <td className="px-6 py-4 font-bold tracking-tight">{patient.name}</td>
                                            <td className="px-6 py-4 text-muted-foreground font-mono">{patient.bed}</td>
                                            <td className="px-6 py-4">
                                                <Badge className={`bg-${patient.color}-500/10 text-${patient.color}-500 border-none rounded-sm px-2 py-0 h-5`}>{patient.status}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground italic truncate max-w-[180px]">{patient.observation}</td>
                                            <td className="px-6 py-4">
                                                <Button size="sm" variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-widest p-0 px-3 hover:bg-primary/10 hover:text-primary rounded-md">Select</Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* AI Triage Feed */}
                <Card className="border-border/50 bg-background/50 shadow-none border-dashed rounded-2xl">
                    <CardHeader className="pb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <BrainCircuit className="text-primary animate-pulse" size={20} />
                            <CardTitle className="text-sm font-black uppercase tracking-widest underline decoration-primary decoration-4 underline-offset-8">Neural Triage</CardTitle>
                        </div>
                        <p className="text-[10px] text-muted-foreground italic font-medium leading-relaxed opacity-60 pt-4">MediAgent fleet providing real-time clinical decision support.</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {[
                            { title: 'Infection Risk High', time: '2m ago', desc: 'Patient in ICU-04 showing early markers of sepsis per LLM analysis.', type: 'alert' },
                            { title: 'Dosage Recommendation', time: '14m ago', desc: 'Pharmacology Agent suggests adjusting Heparin infusion for P-882.', type: 'info' },
                            { title: 'Imaging Analysis Complete', time: '1h ago', desc: 'Chest CT for GEN-22 processed. No pneumothorax detected.', type: 'success' },
                        ].map((item, i) => (
                            <div key={i} className={`p-4 rounded-xl border-l-4 ${item.type === 'alert' ? 'bg-destructive/10 border-destructive' : item.type === 'info' ? 'bg-primary/10 border-primary' : 'bg-emerald-500/10 border-emerald-500'} group hover:scale-[1.02] transition-all`}>
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="text-[11px] font-black uppercase tracking-tight">{item.title}</h4>
                                    <span className="text-[9px] text-muted-foreground font-bold">{item.time}</span>
                                </div>
                                <p className="text-[10px] text-muted-foreground leading-relaxed italic">{item.desc}</p>
                            </div>
                        ))}
                        <Button className="w-full h-10 bg-secondary/50 hover:bg-secondary text-[10px] font-black uppercase tracking-[0.2em] rounded-lg mt-4 opacity-60 hover:opacity-100 transition-all border border-border/50">Open System Logs</Button>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-between text-[9px] font-black tracking-[0.3em] uppercase opacity-30 pt-4">
                <span>EHR INTEGRATED</span>
                <span className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    KEYCLOAK SSO SECURE SESSION
                </span>
                <span>FEDERATED LEARNING ACTIVE</span>
            </div>
        </div>
    );
};

export default ClinicalDashboard;
