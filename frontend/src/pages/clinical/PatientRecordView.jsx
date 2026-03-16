import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
    Activity,
    FileText,
    FlaskConical,
    Pill,
    AlertTriangle,
    ArrowLeft,
    ChevronRight,
    History,
    Calendar,
    Stethoscope,
    Wind,
    Thermometer,
    HeartPulse
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

const PatientRecordView = () => {
    const { id } = useParams();
    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);

    const vitalData = [
        { time: '08:00', hr: 72, bp: 120, temp: 36.6, spo2: 98 },
        { time: '10:00', hr: 75, bp: 122, temp: 36.7, spo2: 99 },
        { time: '12:00', hr: 82, bp: 128, temp: 36.9, spo2: 97 },
        { time: '14:00', hr: 88, bp: 135, temp: 37.2, spo2: 96 },
        { time: '16:00', hr: 85, bp: 132, temp: 37.0, spo2: 97 },
        { time: '18:00', hr: 78, bp: 125, temp: 36.8, spo2: 98 },
    ];

    useEffect(() => {
        // Simulating Agent 06 call: GET /api/ehr/{id}
        setTimeout(() => {
            setPatient({
                id: id,
                name: 'James Wilson',
                age: 45,
                gender: 'Male',
                dob: '1978-05-12',
                bloodType: 'O+',
                allergies: ['Penicillin', 'Peanuts'],
                status: 'Stable / Monitoring',
                medications: [
                    { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', start: '2023-11-01' },
                    { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', start: '2024-01-15' }
                ],
                labResults: [
                    { test: 'Complete Blood Count', date: '2024-03-10', status: 'Normal' },
                    { test: 'Lipid Panel', date: '2024-03-10', status: 'Attention: High LDL' },
                    { test: 'HbA1c', date: '2024-02-28', status: '7.2% (Controlled)' }
                ],
                history: [
                    { date: '2024-03-12', event: 'ER Admission', detail: 'Primary complaint of periodic chest tightness.' },
                    { date: '2024-01-15', event: 'GP Consultation', detail: 'Routine diabetes management check-up.' },
                    { date: '2023-11-01', event: 'Diagnostic Scan', detail: 'Chest X-Ray: No significant abnormalities detected.' }
                ]
            });
            setLoading(false);
        }, 600);
    }, [id]);

    if (loading) return <div className="h-96 flex items-center justify-center">
        <Activity className="animate-pulse text-primary mr-2" />
        <span className="text-xs font-black uppercase tracking-widest opacity-40">Syncing EHR Core...</span>
    </div>;

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header: Patient Bio */}
            <div className="flex flex-col xl:flex-row gap-6">
                <Card className="flex-1 border-border/50 bg-card/60 overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-6 pointer-events-none">
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 uppercase text-[9px] font-black tracking-widest rounded-sm">
                            {patient.status}
                        </Badge>
                    </div>
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                            <Link to="/clinical/queue" className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                                <ArrowLeft size={16} />
                            </Link>
                            <div>
                                <h1 className="text-2xl font-black tracking-tight mb-0.5 uppercase">{patient.name}</h1>
                                <p className="text-[10px] text-muted-foreground font-bold tracking-[0.2em] uppercase">EHR RECORD: {patient.id} • DOB: {patient.dob}</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-2">
                        {[
                            { label: 'Age / Gender', val: `${patient.age}Y • ${patient.gender}` },
                            { label: 'Blood Type', val: patient.bloodType },
                            { label: 'Height / Weight', val: '178cm • 82kg' },
                            { label: 'Primary Physician', val: 'Dr. Sarah Vance' },
                        ].map((item, i) => (
                            <div key={i} className="space-y-1">
                                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-60 font-mono">{item.label}</p>
                                <p className="text-sm font-bold tracking-tight">{item.val}</p>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="w-full xl:w-72 border-destructive/20 bg-destructive/5 flex items-center p-6 gap-4">
                    <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive border border-destructive/20">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-destructive mb-1">Critical Allergies</p>
                        <div className="flex flex-wrap gap-1.5">
                            {patient.allergies.map(a => (
                                <Badge key={a} variant="destructive" className="text-[10px] font-bold rounded-sm h-5 bg-destructive text-white">{a}</Badge>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Tabs System */}
            <Tabs defaultValue="vitals" className="w-full">
                <TabsList className="bg-secondary/30 h-11 p-1 gap-1 border border-border/50">
                    <TabsTrigger value="vitals" className="text-[10px] font-black uppercase tracking-widest h-9 border border-transparent data-[state=active]:border-border/50 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                        <Activity className="mr-2" size={14} /> Vitals
                    </TabsTrigger>
                    <TabsTrigger value="medications" className="text-[10px] font-black uppercase tracking-widest h-9 border border-transparent data-[state=active]:border-border/50 data-[state=active]:bg-background">
                        <Pill className="mr-2" size={14} /> Meds
                    </TabsTrigger>
                    <TabsTrigger value="labs" className="text-[10px] font-black uppercase tracking-widest h-9 border border-transparent data-[state=active]:border-border/50 data-[state=active]:bg-background">
                        <FlaskConical className="mr-2" size={14} /> Labs
                    </TabsTrigger>
                    <TabsTrigger value="history" className="text-[10px] font-black uppercase tracking-widest h-9 border border-transparent data-[state=active]:border-border/50 data-[state=active]:bg-background">
                        <History className="mr-2" size={14} /> Timeline
                    </TabsTrigger>
                </TabsList>

                {/* Vitals Content */}
                <TabsContent value="vitals" className="pt-4 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <Card className="lg:col-span-2 border-border/40 bg-card/40">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                    <HeartPulse className="text-primary" size={14} /> 24h Vital Telemetry
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={vitalData}>
                                            <defs>
                                                <linearGradient id="colorHr" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />
                                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: 'hsl(var(--muted-foreground))' }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '12px', border: '1px solid hsl(var(--border))', fontSize: '12px' }}
                                                itemStyle={{ fontWeight: 700 }}
                                            />
                                            <Area type="monotone" dataKey="hr" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorHr)" strokeWidth={3} />
                                            <Area type="monotone" dataKey="bp" stroke="hsl(var(--destructive))" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            {[
                                { label: 'Heart Rate', val: '78 bpm', icon: <HeartPulse />, color: 'emerald' },
                                { label: 'Blood Pressure', val: '120/80', icon: <Activity />, color: 'primary' },
                                { label: 'SpO2 Saturation', val: '98%', icon: <Wind />, color: 'blue' },
                                { label: 'Body Temp', val: '36.8°C', icon: <Thermometer />, color: 'orange' },
                            ].map((stat, i) => (
                                <Card key={i} className="border-border/40 bg-card/20 p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-9 h-9 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500 border border-${stat.color}-500/20`}>
                                                {stat.icon}
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/60">{stat.label}</p>
                                                <p className="text-lg font-black tracking-tighter">{stat.val}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className="text-[9px] font-bold h-5 border-emerald-500/20 text-emerald-500 bg-emerald-500/5">NORMAL</Badge>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                {/* Medications Content */}
                <TabsContent value="medications" className="pt-4">
                    <Card className="border-border/40 bg-card/60">
                        <CardHeader>
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Pill className="text-primary" size={14} /> Active Pharmaceutical Course
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <table className="w-full text-left">
                                <thead className="bg-secondary/5 border-y border-border/10">
                                    <tr>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Medication</th>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Dosage</th>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Frequency</th>
                                        <th className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Start Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/5">
                                    {patient.medications.map((med, i) => (
                                        <tr key={i} className="hover:bg-secondary/5 transition-colors">
                                            <td className="px-6 py-4 font-bold tracking-tight text-sm text-primary">{med.name}</td>
                                            <td className="px-6 py-4 text-[13px] font-medium">{med.dosage}</td>
                                            <td className="px-6 py-4 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">{med.frequency}</td>
                                            <td className="px-6 py-4 text-right font-mono text-xs text-muted-foreground/60">{med.start}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* History Content */}
                <TabsContent value="history" className="pt-4">
                    <Card className="border-border/40 bg-card/40">
                        <CardHeader>
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <History className="text-primary" size={14} /> EHR Longitudinal Timeline
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="px-6 pb-8">
                            <div className="relative space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/30">
                                {patient.history.map((event, i) => (
                                    <div key={i} className="relative pl-10">
                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full bg-background border-2 border-primary z-10" />
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black font-mono text-muted-foreground/60 bg-secondary/50 px-2 py-0.5 rounded border border-border/50 uppercase">{event.date}</span>
                                                <span className="text-sm font-bold tracking-tight uppercase text-foreground">{event.event}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground leading-relaxed italic max-w-2xl">{event.detail}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* Quick Actions Footer */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-border/20">
                <Button className="h-11 rounded-xl bg-primary hover:bg-primary/90 font-bold px-6 gap-2" asChild>
                    <Link to={`/clinical/decision/${id}`}>
                        <BrainCircuit size={18} />
                        Open Decision Support
                    </Link>
                </Button>
                <Button variant="outline" className="h-11 rounded-xl font-bold px-6 gap-2 border-border/50 hover:bg-secondary/40" asChild>
                    <Link to={`/clinical/notes/${id}`}>
                        <FileText size={18} />
                        Transcribe Note
                    </Link>
                </Button>
                <Button variant="outline" className="h-11 rounded-xl font-bold px-6 gap-2 border-border/50 hover:bg-secondary/40" asChild>
                    <Link to={`/clinical/vitals/${id}`}>
                        <Activity size={18} />
                        Live Monitor
                    </Link>
                </Button>
            </div>

            <div className="text-[9px] font-black tracking-[0.3em] uppercase opacity-30 flex items-center gap-2">
                <Stethoscope size={10} /> Clinical ID: {id} • Agent 06 Synchronized • EHR Integrity: Verified
            </div>
        </div>
    );
};

// Supporting Components for icons not imported from Lucide
const BrainCircuit = ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a3 3 0 0 0-3 3v7" /><path d="M9 18a3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3v2" /><path d="M3 13a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3" /><line x1="12" y1="17" x2="12" y2="22" />
    </svg>
);

export default PatientRecordView;
