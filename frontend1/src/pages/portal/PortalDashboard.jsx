import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import {
    Calendar,
    FileText,
    MessageSquare,
    Bell,
    User,
    Clock,
    ShieldCheck,
    ArrowRight,
    HeartPulse
} from 'lucide-react';

const PortalDashboard = () => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome, Sarah</h1>
                    <p className="text-muted-foreground italic text-sm">Your health at a glance. Manage your care journey here.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2 rounded-full border-primary/20 hover:bg-primary/5">
                        <Bell size={16} />
                        Notifications
                        <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 flex items-center justify-center">2</Badge>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2 border-border/50 bg-card/50">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-border/10 pb-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="text-primary" size={18} />
                            <CardTitle className="text-base font-bold">Upcoming Appointments</CardTitle>
                        </div>
                        <Button variant="ghost" size="sm" className="text-xs text-primary h-auto p-0 hover:bg-transparent">View schedule</Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {[1, 2].map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary/20 border border-border/50 group hover:border-primary/30 transition-all cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex flex-col items-center justify-center text-primary font-bold">
                                            <span className="text-[10px] leading-none">OCT</span>
                                            <span className="text-sm">24</span>
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Follow-up: Knee surgery recovery</p>
                                            <p className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                                <User size={10} /> Dr. Michael Chen • 10:30 AM
                                            </p>
                                        </div>
                                    </div>
                                    <Badge className="bg-emerald-500/10 text-emerald-500 border-none group-hover:bg-emerald-500 group-hover:text-white transition-colors">Confirmed</Badge>
                                </div>
                            ))}
                        </div>
                        <Button className="w-full mt-6 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-xl h-12 gap-2 text-sm font-bold transition-all group">
                            Book New Consultation
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card className="border-primary/20 bg-primary/5 shadow-inner">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-primary/70">Health Score</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2 mb-4">
                                <span className="text-4xl font-black text-primary leading-none tracking-tighter">84</span>
                                <span className="text-xs text-primary font-bold opacity-60 mb-1.5 uppercase">Stable</span>
                            </div>
                            <div className="h-2 w-full bg-primary/10 rounded-full overflow-hidden">
                                <div className="h-full bg-primary" style={{ width: '84%' }}></div>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-4 italic leading-relaxed">
                                Your vitals are looking great. Keep up the daily physical therapy sessions.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/30">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Recent Documents</CardTitle>
                        </CardHeader>
                        <CardContent className="px-0">
                            <div className="space-y-0.5">
                                {['Lab Results - Oct 10', 'Prescription - Sep 28', 'Referral Form'].map((doc, i) => (
                                    <div key={i} className="flex items-center gap-3 px-6 py-3 hover:bg-secondary/30 transition-colors cursor-pointer group">
                                        <FileText size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                                        <span className="text-xs font-medium">{doc}</span>
                                        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-6 w-6"><Clock size={12} /></Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                <div className="bg-secondary/10 p-6 rounded-2xl border border-border/50 flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0">
                        <HeartPulse size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">Medication Reminder</h3>
                        <p className="text-sm text-muted-foreground mb-4 italic">Take 1 dose of Glucosamine with your morning meal.</p>
                        <Button size="sm" className="bg-primary/80 hover:bg-primary text-xs rounded-lg px-4 font-bold">Mark as Taken</Button>
                    </div>
                </div>

                <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 flex items-start gap-4 ring-1 ring-primary/10">
                    <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0 relative">
                        <MessageSquare size={24} />
                        <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background animate-pulse"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-1">AI Health Assistant</h3>
                        <p className="text-sm text-muted-foreground mb-4 italic">Sarah, our AI is ready to answer questions about your recent surgery results.</p>
                        <Button size="sm" variant="outline" className="text-xs border-primary/30 hover:bg-primary/10 rounded-lg px-4 font-bold">Open Consultation</Button>
                    </div>
                </div>
            </div>

            <div className="pt-10 flex items-center justify-center gap-2 text-muted-foreground opacity-40">
                <ShieldCheck size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none mt-0.5">HIPAA SECURE PORTAL</span>
            </div>
        </div>
    );
};

export default PortalDashboard;
