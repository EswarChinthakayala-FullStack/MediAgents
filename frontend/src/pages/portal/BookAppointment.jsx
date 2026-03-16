import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
    Calendar,
    Clock,
    User,
    ChevronRight,
    MapPin,
    Stethoscope,
    Search,
    CheckCircle2,
    CalendarCheck,
    Video
} from 'lucide-react';

const BookAppointment = () => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [step, setStep] = useState(1);

    const doctors = [
        { id: 1, name: 'Dr. Sarah Mitchell', specialty: 'General Practice', rating: '4.9', availability: 'Next: Today 2pm', image: 'GA' },
        { id: 2, name: 'Dr. James Wilson', specialty: 'Cardiology', rating: '4.8', availability: 'Next: Tomorrow 10am', image: 'JW' },
        { id: 3, name: 'Dr. Elena Rodriguez', specialty: 'Orthopedics', rating: '5.0', availability: 'Next: Wed 3pm', image: 'ER' },
        { id: 4, name: 'Dr. Michael Chen', specialty: 'Dermatology', rating: '4.7', availability: 'Next: Today 4pm', image: 'MC' },
    ];

    const slots = [
        '09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
                        <CalendarCheck size={30} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Book Consultation</h1>
                        <p className="text-muted-foreground text-xs font-bold tracking-[0.15em] uppercase opacity-60 italic">Managed by Scheduler Agent-02</p>
                    </div>
                </div>

                <div className="flex bg-secondary/30 p-1 rounded-xl border border-border/50">
                    <div className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${step === 1 ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>1. Select Professional</div>
                    <div className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${step === 2 ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground'}`}>2. Choose Slot</div>
                    <div className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all ${step === 3 ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground'}`}>3. Confirmation</div>
                </div>
            </div>

            {step === 1 && (
                <div className="space-y-6">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={20} />
                        <input
                            placeholder="Search by specialty, name, or health concern..."
                            className="h-14 w-full bg-card border border-border/50 rounded-2xl pl-12 pr-6 text-sm font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                        {doctors.map((doc) => (
                            <Card
                                key={doc.id}
                                onClick={() => { setSelectedDoctor(doc); setStep(2); }}
                                className="border-border/40 hover:border-primary/40 bg-card/60 cursor-pointer group hover:-translate-y-1 transition-all overflow-hidden"
                            >
                                <CardContent className="p-0">
                                    <div className="h-32 bg-secondary/30 relative flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xl group-hover:scale-110 transition-transform">
                                            {doc.image}
                                        </div>
                                    </div>
                                    <div className="p-5 space-y-3">
                                        <div>
                                            <h4 className="font-bold text-sm tracking-tight">{doc.name}</h4>
                                            <p className="text-[10px] font-medium text-muted-foreground opacity-70 italic">{doc.specialty}</p>
                                        </div>
                                        <div className="flex items-center justify-between pt-1">
                                            <Badge variant="ghost" className="bg-primary/5 text-primary text-[9px] font-black border-none uppercase h-5">{doc.rating} ★</Badge>
                                            <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter italic">{doc.availability}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            {step === 2 && selectedDoctor && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-8 duration-700">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-border/50 bg-card">
                            <CardHeader className="border-b border-border/10 pb-6 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-bold">Select Appointment Date</CardTitle>
                                    <CardDescription>Click a date to see available time slots.</CardDescription>
                                </div>
                                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                                    <MapPin size={14} className="text-primary" />
                                    Main Medical Plaza v4
                                </div>
                            </CardHeader>
                            <CardContent className="pt-8">
                                <div className="grid grid-cols-7 gap-2">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                        <div key={d} className="text-center text-[10px] font-black text-muted-foreground mb-2">{d}</div>
                                    ))}
                                    {Array.from({ length: 31 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-12 flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${i === 12 ? 'bg-primary text-primary-foreground shadow-lg ring-4 ring-primary/20' : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'}`}
                                        >
                                            {i + 1}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground px-2">Available Time Slots</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {slots.map((slot, i) => (
                                    <Button
                                        key={slot}
                                        variant="outline"
                                        onClick={() => setStep(3)}
                                        className={`h-14 rounded-2xl font-bold border-border/50 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center relative overflow-hidden group ${i === 2 ? 'ring-1 ring-primary' : ''}`}
                                    >
                                        <span className="text-xs">{slot}</span>
                                        <span className="text-[8px] font-black uppercase text-muted-foreground opacity-40 group-hover:opacity-100 italic">Limited Slot</span>
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-primary/20 bg-primary/5 border-t-4 border-t-primary shadow-2xl">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-xs font-black uppercase tracking-widest text-primary/70">Selected Professional</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-16 w-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary font-black text-2xl shrink-0">
                                        {selectedDoctor.image}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-lg text-foreground tracking-tighter leading-tight">{selectedDoctor.name}</h4>
                                        <p className="text-xs text-muted-foreground font-bold italic">{selectedDoctor.specialty}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-2">
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground italic">
                                        <Video size={14} className="text-primary" />
                                        Video Consultation Enable
                                    </div>
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground italic">
                                        <Clock size={14} className="text-primary" />
                                        Standard Length: 20 Minutes
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">Patient Information</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-muted-foreground italic">Name:</span>
                                    <span className="font-black">Sarah Johnson</span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-muted-foreground italic">Coverage:</span>
                                    <span className="font-black text-emerald-500">Active (Standard-A)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <Card className="border-emerald-500/20 bg-emerald-500/5 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-700">
                    <CardContent className="py-24 flex flex-col items-center justify-center text-center space-y-8">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-white relative z-10">
                                <CheckCircle2 size={48} />
                            </div>
                            <div className="absolute inset-0 rounded-full border border-emerald-500/40 animate-ping opacity-20"></div>
                        </div>
                        <div className="space-y-4 max-w-md">
                            <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Appointment Confirmed!</h2>
                            <p className="text-muted-foreground italic text-sm">
                                Your session with <span className="text-foreground font-bold">{selectedDoctor.name}</span> is set for
                                <span className="text-foreground font-bold"> Oct 14th at 01:00 PM</span>.
                                A secure calendar link and link to the telehealth platform have been sent to your email.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button onClick={() => setStep(1)} className="rounded-xl px-10 h-12 font-black uppercase tracking-widest text-xs">Manage Schedule</Button>
                            <Button variant="ghost" className="rounded-xl px-10 h-12 font-black uppercase tracking-widest text-xs border border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10 transition-all">Go to Dashboard</Button>
                        </div>
                    </CardContent>

                    <div className="bg-emerald-500/10 py-4 px-6 border-t border-emerald-500/10 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                            <Clock size={12} /> Syncing with Patient EHR
                        </div>
                        <span className="text-[10px] font-black italic opacity-40">REF: AP-X9002-L</span>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default BookAppointment;
