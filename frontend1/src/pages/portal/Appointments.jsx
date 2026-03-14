import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
    Calendar,
    Clock,
    User,
    Video,
    MapPin,
    MoreHorizontal,
    XCircle,
    CalendarClock,
    ArrowRight,
    ExternalLink
} from 'lucide-react';

const Appointments = () => {
    const upcoming = [
        { id: 1, doctor: 'Dr. Michael Chen', specialty: 'Orthopedics', date: 'Oct 24, 2026', time: '10:30 AM', type: 'Clinical Visit', status: 'Confirmed', location: 'Ward A, Room 12' },
        { id: 2, doctor: 'Dr. Sarah Mitchell', specialty: 'General Practice', date: 'Oct 28, 2026', time: '02:00 PM', type: 'Video Consult', status: 'Confirmed', location: 'Telehealth Link' },
    ];

    const past = [
        { id: 3, doctor: 'Dr. James Wilson', specialty: 'Cardiology', date: 'Sep 15, 2026', time: '09:00 AM', status: 'Completed' },
        { id: 4, doctor: 'Clinician Elena', specialty: 'Physiotherapy', date: 'Aug 22, 2026', time: '11:30 AM', status: 'Completed' },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between gap-6 pb-2 border-b border-border/10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group hover:scale-110 transition-transform">
                        <CalendarClock size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">My Appointments</h1>
                        <p className="text-muted-foreground text-sm italic">Track and manage your scheduled clinical sessions.</p>
                    </div>
                </div>
                <Button className="h-11 rounded-xl font-black uppercase tracking-widest text-[10px] px-6 shadow-xl shadow-primary/10">
                    Book New Session
                </Button>
            </div>

            <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground px-2 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    Upcoming Care
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcoming.map((apt) => (
                        <Card key={apt.id} className="border-border/50 bg-card/60 hover:bg-card hover:border-primary/20 transition-all group overflow-hidden shadow-sm">
                            <CardContent className="p-0">
                                <div className="p-6 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <div className="h-12 w-12 rounded-xl bg-secondary/50 flex flex-col items-center justify-center text-primary font-bold">
                                                <span className="text-[10px] leading-none uppercase tracking-tighter">OCT</span>
                                                <span className="text-lg leading-none mt-1">24</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-base tracking-tight">{apt.doctor}</h4>
                                                <p className="text-[11px] font-medium text-muted-foreground opacity-70 italic">{apt.specialty}</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-emerald-500/10 text-emerald-500 border-none rounded-lg px-2 h-6 text-[9px] font-black uppercase tracking-widest">{apt.status}</Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block opacity-50">Time & Duration</span>
                                            <div className="flex items-center gap-1.5 text-xs font-bold italic">
                                                <Clock size={12} className="text-primary" />
                                                {apt.time} (20m)
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest block opacity-50">Logistics</span>
                                            <div className="flex items-center gap-1.5 text-xs font-bold italic truncate">
                                                {apt.type === 'Video Consult' ? <Video size={12} className="text-primary" /> : <MapPin size={12} className="text-primary" />}
                                                {apt.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-secondary/20 border-t border-border/10 p-3 flex gap-2">
                                    <Button variant="ghost" className="flex-1 h-9 rounded-lg text-xs font-bold gap-2 hover:bg-primary/5 hover:text-primary transition-all">
                                        {apt.type === 'Video Consult' ? 'Enter Waiting Room' : 'View Directions'}
                                        <ExternalLink size={14} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-destructive/5 hover:text-destructive">
                                        <XCircle size={16} />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground px-2">Clinical History</h3>
                <Card className="border-border/40 bg-card/40 shadow-none overflow-hidden rounded-2xl">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-border/10 bg-secondary/5">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Provider</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Date & Session</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Specialty</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Outcome</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Records</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/5 text-xs">
                                    {past.map((apt) => (
                                        <tr key={apt.id} className="hover:bg-secondary/10 transition-colors group">
                                            <td className="px-6 py-4 font-bold tracking-tight">{apt.doctor}</td>
                                            <td className="px-6 py-4 text-muted-foreground italic font-medium">{apt.date} at {apt.time}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant="ghost" className="bg-secondary px-2 h-5 rounded-md text-[9px] font-bold text-muted-foreground uppercase">{apt.specialty}</Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5 text-emerald-500 font-bold">
                                                    <Badge className="bg-emerald-500 h-1.5 w-1.5 p-0 rounded-full animate-none" />
                                                    {apt.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-primary opacity-40 group-hover:opacity-100 transition-all">
                                                    <ArrowRight size={16} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="pt-8 flex items-center justify-center gap-6 opacity-30">
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                    <Calendar size={14} /> ICS SYNC ENABLED
                </div>
                <div className="h-4 w-px bg-border"></div>
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                    <Video size={14} /> HIPAA COMPLIANT VIDEO
                </div>
            </div>
        </div>
    );
};

export default Appointments;
