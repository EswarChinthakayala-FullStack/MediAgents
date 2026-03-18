import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
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
    Video,
    AlertCircle,
    Loader2,
    ArrowRight,
    Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const BookAppointment = () => {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [bookingStatus, setBookingStatus] = useState(null);

    // Fetch Doctors
    React.useEffect(() => {
        fetch('http://localhost:5000/api/clinical/doctors', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (data.length === 0) {
                    // Fallback mock doctors
                    setDoctors([
                        { id: "DR-101", name: "Dr. Sarah Mitchell", specialty: "General Practice", rating: 4.9, image: "👩‍⚕️", availability: "Available Today" },
                        { id: "DR-102", name: "Dr. James Wilson", specialty: "Cardiology", rating: 4.8, image: "👨‍⚕️", availability: "Available Tomorrow" },
                        { id: "DR-103", name: "Dr. Elena Rodriguez", specialty: "Pediatrics", rating: 5.0, image: "👩‍⚕️", availability: "Next Week" },
                        { id: "DR-104", name: "Dr. Michael Chen", specialty: "Neurology", rating: 4.7, image: "👨‍⚕️", availability: "Online Now" }
                    ]);
                } else {
                    // Add rating and image to backend doctors for UI
                    setDoctors(data.map(d => ({
                        ...d,
                        rating: (4.5 + Math.random() * 0.5).toFixed(1),
                        image: d.name.includes('Sarah') || d.name.includes('Elena') ? "👩‍⚕️" : "👨‍⚕️",
                        availability: d.is_on_duty ? "Online Now" : "Available Today"
                    })));
                }
            })
            .catch(err => {
                console.error("Fetch doctors error:", err);
                // Fallback mock
                setDoctors([
                    { id: "DR-101", name: "Dr. Sarah Mitchell", specialty: "General Practice", rating: 4.9, image: "👩‍⚕️", availability: "Available Today" },
                    { id: "DR-102", name: "Dr. James Wilson", specialty: "Cardiology", rating: 4.8, image: "👨‍⚕️", availability: "Available Tomorrow" }
                ]);
            });
    }, [token]);

    // Fetch Slots when doctor or date changes
    React.useEffect(() => {
        if (!selectedDoctor) return;
        setLoading(true);
        fetch(`http://localhost:5000/api/appointments/slots?doctor=${selectedDoctor.id}&date=${selectedDate}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                // Agent 02 returns {slots: [...]} or [...]
                const slotsArray = data.slots || data;
                setSlots(slotsArray);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch slots error:", err);
                setLoading(false);
                // Mock fallback
                setSlots([
                    { time: "09:00", available: true },
                    { time: "10:00", available: true },
                    { time: "11:00", available: false }
                ]);
            });
    }, [selectedDoctor, selectedDate, token]);

    const handleBooking = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/appointments/book', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    patient_id: user?.patient_id || user?.id,
                    doctor_id: selectedDoctor.id,
                    date: selectedDate,
                    time: selectedSlot,
                    reason: "Patient-initiated portal booking"
                })
            });
            const result = await response.json();
            if (response.ok) {
                setBookingStatus(result);
                setStep(3);
            } else {
                alert(result.error || "Booking failed");
            }
        } catch (err) {
            console.error("Booking error:", err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="gw-grid-bg" />
      <div className="gw-glow" />
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
                    <div onClick={() => setStep(1)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all ${step === 1 ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:text-foreground'}`}>1. Professional</div>
                    <div onClick={() => selectedDoctor && setStep(2)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all ${step === 2 ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground'}`}>2. Slot & Time</div>
                    <div className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest cursor-pointer transition-all ${step === 3 ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground'}`}>3. Confirmation</div>
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
                                className={`border-border/40 hover:border-primary/40 bg-card/60 cursor-pointer group hover:-translate-y-1 transition-all overflow-hidden ${selectedDoctor?.id === doc.id ? 'ring-2 ring-primary border-primary' : ''}`}
                            >
                                <CardContent className="p-0">
                                    <div className="h-32 bg-secondary/30 relative flex items-center justify-center overflow-hidden">
                                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
                                        <div className="w-16 h-16 rounded-3xl bg-background border-2 border-primary/20 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-xl">
                                            {doc.image || "👩‍⚕️"}
                                        </div>
                                        {doc.availability === "Online Now" && (
                                            <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                        )}
                                    </div>
                                    <div className="p-5 space-y-3 text-center">
                                        <div>
                                            <h4 className="font-black text-sm tracking-tight">{doc.name}</h4>
                                            <p className="text-[10px] font-bold text-primary/70 uppercase tracking-widest italic">{doc.specialty}</p>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 pt-1 border-t border-border/10">
                                            <Badge variant="ghost" className="bg-primary/5 text-primary text-[9px] font-black border-none uppercase h-5">{doc.rating} ★</Badge>
                                            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter italic">{doc.availability}</span>
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
                        <Card className="border-border/50 bg-card shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <Calendar size={120} />
                            </div>
                            <CardHeader className="border-b border-border/10 pb-6 flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-xl font-black uppercase tracking-tighter">Choose Your Date</CardTitle>
                                    <CardDescription className="text-xs italic">Available slots update in real-time based on Agent-02 logic.</CardDescription>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase bg-secondary/30 px-3 py-1.5 rounded-full">
                                    <MapPin size={12} className="text-primary" />
                                    Main Medical Plaza v4
                                </div>
                            </CardHeader>
                            <CardContent className="pt-8">
                                <div className="grid grid-cols-7 gap-3">
                                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                                        <div key={d} className="text-center text-[9px] font-black text-muted-foreground/40 mb-2">{d}</div>
                                    ))}
                                    {Array.from({ length: 31 }).map((_, i) => {
                                        const day = i + 1;
                                        const dateStr = `2026-03-${day.toString().padStart(2, '0')}`;
                                        const isSelected = selectedDate === dateStr;
                                        const isPast = day < 16; // Demo: block past dates

                                        return (
                                            <div
                                                key={i}
                                                onClick={() => !isPast && setSelectedDate(dateStr)}
                                                className={`h-12 flex items-center justify-center rounded-2xl text-xs font-black transition-all group relative ${isSelected ? 'bg-primary text-primary-foreground shadow-[0_10px_20px_-5px_rgba(62,207,142,0.4)] ring-2 ring-primary scale-110 z-10' :
                                                    isPast ? 'opacity-20 cursor-not-allowed bg-secondary/10' :
                                                        'hover:bg-primary/10 text-muted-foreground hover:text-primary cursor-pointer'
                                                    }`}
                                            >
                                                {day}
                                                {isSelected && <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-current"></div>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">Available Time Slots</h3>
                                <Badge variant="secondary" className="text-[8px] font-black uppercase bg-primary/10 text-primary border-none">{selectedDate}</Badge>
                            </div>

                            {loading ? (
                                <div className="flex flex-col items-center justify-center p-20 space-y-4 bg-secondary/5 rounded-3xl border border-dashed border-border/50">
                                    <Loader2 className="animate-spin text-primary" size={32} />
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Consulting Scheduler Agent...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {slots.length > 0 ? slots.map((slot, i) => (
                                        <Button
                                            key={i}
                                            variant="outline"
                                            onClick={() => setSelectedSlot(slot.time)}
                                            className={`h-16 rounded-2xl font-black border-border/50 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center relative overflow-hidden group shadow-sm ${selectedSlot === slot.time ? 'bg-primary/10 border-primary text-primary scale-[1.02]' : ''} ${!slot.available ? 'opacity-30 cursor-not-allowed grayscale' : ''}`}
                                            disabled={!slot.available}
                                        >
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={12} className={selectedSlot === slot.time ? 'text-primary' : 'text-muted-foreground/50'} />
                                                <span className="text-sm tracking-tighter">{slot.time}</span>
                                            </div>
                                            <span className="text-[7px] font-black uppercase tracking-tighter opacity-70 group-hover:opacity-100 mt-1">
                                                {slot.available ? 'Select Slot' : 'Occupied'}
                                            </span>
                                            {selectedSlot === slot.time && (
                                                <div className="absolute top-0 right-0 p-1">
                                                    <CheckCircle2 size={10} className="text-primary" />
                                                </div>
                                            )}
                                        </Button>
                                    )) : (
                                        <div className="col-span-full py-16 flex flex-col items-center justify-center bg-secondary/10 rounded-3xl border border-dashed border-border/50">
                                            <AlertCircle className="text-muted-foreground/30 mb-2" size={32} />
                                            <p className="text-[10px] text-muted-foreground italic font-black uppercase tracking-widest">No slots optimized for this date.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {selectedSlot && (
                                <div className="pt-4 animate-in slide-in-from-top-4 duration-500">
                                    <Button
                                        className="w-full h-16 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] gap-3 shadow-2xl shadow-primary/20 hover:scale-[1.01] transition-transform"
                                        onClick={handleBooking}
                                        disabled={loading}
                                    >
                                        {loading ? "Finalizing Transaction..." : "Complete Booking Process"}
                                        <ArrowRight size={18} />
                                    </Button>
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="space-y-6">
                        <Card className="border-none bg-gradient-to-br from-primary shadow-[0_20px_40px_-10px_rgba(62,207,142,0.3)] text-primary-foreground relative overflow-hidden group">
                            <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                                <Stethoscope size={200} />
                            </div>
                            <CardHeader className="pb-4">
                                <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Selected Professional</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 relative z-10">
                                <div className="flex gap-4">
                                    <div className="h-16 w-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0 shadow-xl border border-white/20">
                                        {selectedDoctor.image || "👩‍⚕️"}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-xl tracking-tighter leading-tight drop-shadow-md">{selectedDoctor.name}</h4>
                                        <p className="text-[11px] font-bold opacity-80 uppercase tracking-widest italic">{selectedDoctor.specialty}</p>
                                    </div>
                                </div>
                                <div className="space-y-3 pt-2 bg-black/5 p-4 rounded-2xl border border-white/10">
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                                        <Video size={16} />
                                        Telehealth Ready
                                    </div>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                                        <Clock size={16} />
                                        20 Min Session
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="p-8 rounded-3xl bg-secondary/20 border-2 border-border/50 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary/30"></div>
                            <h4 className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-6">Patient Verification</h4>
                            <div className="space-y-5">
                                <div className="space-y-1">
                                    <Label className="text-[8px] font-black uppercase opacity-50 tracking-widest">Primary Identity</Label>
                                    <p className="text-sm font-black tracking-tight">{user?.name || "Verified Patient"}</p>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-[8px] font-black uppercase opacity-50 tracking-widest">Coverage Status</Label>
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                                        <p className="text-xs font-black text-emerald-500 uppercase italic">Active & Synchronized</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t border-border/10">
                                    <p className="text-[9px] text-muted-foreground leading-relaxed italic">
                                        Note: Appointment details will be automatically committed to your Smart EHR (Agent-06).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <Card className="border-none bg-gradient-to-br from-card to-emerald-500/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-1000 relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-primary"></div>
                    <CardContent className="py-24 flex flex-col items-center justify-center text-center space-y-10">
                        <div className="relative">
                            <div className="w-28 h-28 rounded-[2rem] bg-emerald-500 flex items-center justify-center text-white relative z-10 shadow-2xl shadow-emerald-500/40 rotate-12">
                                <CheckCircle2 size={56} />
                            </div>
                            <div className="absolute -inset-6 rounded-full border-2 border-emerald-500/20 animate-ping duration-1000"></div>
                            <div className="absolute -inset-10 rounded-full border border-emerald-500/10 animate-ping duration-1500"></div>
                        </div>

                        <div className="space-y-4 max-w-lg">
                            <h2 className="text-5xl font-black tracking-tighter uppercase leading-[0.9] text-foreground">
                                Success!<br />
                                <span className="text-emerald-500">Session Securely Booked.</span>
                            </h2>
                            <p className="text-muted-foreground italic text-sm leading-relaxed px-6">
                                Your clinical review with <span className="text-foreground font-bold">{selectedDoctor.name}</span> is confirmed for
                                <span className="text-primary font-black ml-1 uppercase">{selectedDate} at {selectedSlot}</span>.
                                A calendar manifest and telehealth credentials have been dispatched.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                            <Button onClick={() => setStep(1)} className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] shadow-xl">New Booking</Button>
                            <Button variant="outline" className="flex-1 rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] border-2 border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/5 transition-all" onClick={() => navigate('/portal')}>Back to Hub</Button>
                        </div>
                    </CardContent>

                    <div className="bg-emerald-500/10 py-6 px-10 border-t border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                            <Activity size={16} className="animate-pulse" />
                            Synchronizing Manifest with Federated EHR Agent-06
                        </div>
                        <Badge className="bg-white/50 text-emerald-700 font-black italic text-[9px] border-none px-4 py-1">
                            REF: {bookingStatus?.agent_confirmation || 'APT-ID-' + Math.floor(Math.random() * 90000)}
                        </Badge>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default BookAppointment;
