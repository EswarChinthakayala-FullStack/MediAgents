import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
    Bell,
    Calendar,
    MessageSquare,
    ShieldCheck,
    Check,
    Trash2,
    Circle,
    CheckCircle2,
    Clock,
    Activity,
    AlertTriangle,
    Mail
} from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Appointment Confirmed', desc: 'Your session with Dr. Michael Chen is set for Oct 24th.', time: '2h ago', category: 'Calendar', priority: 'Medium', isRead: false },
        { id: 2, title: 'New Lab Results', desc: 'Your Complete Blood Count (CBC) results are available for review.', time: '5h ago', category: 'Health', priority: 'High', isRead: false },
        { id: 3, title: 'AI Assistant Alert', desc: 'Sarah, the Triage Agent has updated your recovery profile.', time: '1d ago', category: 'System', priority: 'Medium', isRead: true },
        { id: 4, title: 'Medication Refill Reminder', desc: 'Glucosamine Sulfate refill required in 3 days.', time: '2d ago', category: 'Pharmacy', priority: 'Low', isRead: true },
    ]);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex items-center justify-between gap-6 pb-2 border-b border-border/10">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group hover:scale-110 transition-transform relative">
                        <Bell size={24} />
                        <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-destructive border-2 border-background"></div>
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Notifications</h1>
                        <p className="text-muted-foreground text-sm italic">Stay updated on clinical activity and care team messages.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" onClick={markAllRead} className="h-10 px-4 rounded-xl font-bold uppercase tracking-widest text-[9px] gap-2 hover:bg-primary/5 hover:text-primary transition-all">
                        <CheckCircle2 size={14} />
                        Mark all as read
                    </Button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {notifications.map((notif) => (
                    <Card key={notif.id} className={`border-border/40 hover:border-primary/20 transition-all group overflow-hidden ${!notif.isRead ? 'bg-primary/5 border-primary/20 shadow-lg' : 'bg-card/40 opacity-70 hover:opacity-100'}`}>
                        <CardContent className="p-0">
                            <div className="p-5 flex gap-4">
                                <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${notif.category === 'Calendar' ? 'bg-blue-500/10 text-blue-500' : notif.category === 'Health' ? 'bg-emerald-500/10 text-emerald-500' : notif.category === 'System' ? 'bg-primary/10 text-primary' : 'bg-amber-500/10 text-amber-500'}`}>
                                    {notif.category === 'Calendar' && <Calendar size={18} />}
                                    {notif.category === 'Health' && <Activity size={18} />}
                                    {notif.category === 'System' && <ShieldCheck size={18} />}
                                    {notif.category === 'Pharmacy' && <AlertTriangle size={18} />}
                                </div>
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {!notif.isRead && <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>}
                                            <h4 className={`font-bold text-base tracking-tight ${!notif.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>{notif.title}</h4>
                                        </div>
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">{notif.time}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground italic font-medium leading-relaxed max-w-lg">{notif.desc}</p>
                                    <div className="flex items-center gap-4 pt-4">
                                        <Badge variant="ghost" className="h-5 px-2 text-[9px] font-black uppercase bg-secondary/50 text-muted-foreground border-none rounded-md">
                                            {notif.category}
                                        </Badge>
                                        <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary rounded-lg transition-colors">
                                                <Check size={16} />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-lg transition-colors">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State / Bottom Content */}
            <div className="pt-10 flex flex-col items-center gap-4 text-center">
                <div className="inline-flex items-center justify-center p-4 bg-secondary/20 rounded-2xl border border-border/50 text-muted-foreground opacity-30">
                    <Mail size={32} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-30">All clinical alerts are synced with your primary email.</p>
            </div>
        </div>
    );
};

export default Notifications;
