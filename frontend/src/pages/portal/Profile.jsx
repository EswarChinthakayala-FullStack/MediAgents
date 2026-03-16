import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
    User,
    Lock,
    Bell,
    ShieldCheck,
    Globe,
    Smartphone,
    Mail,
    Phone,
    Edit3,
    LogOut,
    CheckCircle2,
    Activity,
    CreditCard
} from 'lucide-react';

const Profile = () => {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border/10">
                <div className="flex items-center gap-6">
                    <div className="h-20 w-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-3xl shadow-xl shadow-primary/5 relative group cursor-pointer">
                        SJ
                        <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit3 size={20} className="text-white" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-4xl font-black tracking-tighter uppercase leading-none">Sarah Johnson</h1>
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-none rounded-md px-2 h-5 text-[9px] font-black uppercase tracking-widest">Verified EH-ID</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm italic flex items-center gap-2">
                            <Mail size={14} /> sarah.j@example.com
                            <span className="opacity-20">•</span>
                            <span className="font-bold text-foreground">Member since Jan 2026</span>
                        </p>
                    </div>
                </div>
                <Button variant="ghost" className="h-10 px-4 rounded-xl font-black uppercase tracking-widest text-[10px] gap-2 text-destructive hover:bg-destructive/10 transition-all">
                    <LogOut size={16} />
                    Sign Out Account
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-8">
                    <Card className="border-border/50 bg-card/60 shadow-none overflow-hidden rounded-2xl">
                        <CardHeader className="border-b border-border/10 pb-6">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <User className="text-primary" size={20} />
                                Personal Information
                            </CardTitle>
                            <CardDescription className="italic">Maintain your clinical record identity.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Full Legal Name</Label>
                                    <Input defaultValue="Sarah Johnson" className="h-11 rounded-xl bg-secondary/20 border-border/50 font-medium italic" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Contact Phone</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground opacity-50" size={16} />
                                        <Input defaultValue="+1 (555) 000-1234" className="h-11 rounded-xl bg-secondary/20 border-border/50 pl-10 font-medium italic" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Date of Birth</Label>
                                    <Input type="date" defaultValue="1992-05-15" className="h-11 rounded-xl bg-secondary/20 border-border/50 font-medium italic" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Blood Type</Label>
                                    <div className="flex gap-2">
                                        {['O+', 'A+', 'B+', 'AB+'].map(t => (
                                            <Button key={t} variant={t === 'O+' ? 'default' : 'outline'} className={`flex-1 rounded-xl h-11 font-black ${t === 'O+' ? 'shadow-lg shadow-primary/20' : 'border-border/50'}`}>{t}</Button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="bg-secondary/5 border-t border-border/10 p-6 flex justify-end">
                            <Button onClick={handleSave} disabled={isSaving} className="rounded-xl px-10 h-11 font-bold gap-2 group transition-all">
                                {isSaving ? 'Syncing...' : 'Save Changes'}
                                {!isSaving && <CheckCircle2 size={18} className="group-hover:scale-110 transition-transform" />}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-border/50 bg-card/60 shadow-none overflow-hidden rounded-2xl">
                        <CardHeader className="border-b border-border/10 pb-6">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Bell className="text-primary" size={20} />
                                Notification Preferences
                            </CardTitle>
                            <CardDescription className="italic">Choose how we keep you informed about your care.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            {[
                                { title: 'Health Record Updates', desc: 'Alert when Agent-06 processes new clinical documents.', default: true },
                                { title: 'Appointment Reminders', desc: 'Secure alerts via SMS and email for upcoming slots.', default: true },
                                { title: 'Medication Adherence', desc: 'Gentle nudges from Agent-07 if you miss a dose.', default: false }
                            ].map((pref, i) => (
                                <div key={i} className="flex items-center justify-between group">
                                    <div className="space-y-0.5">
                                        <h5 className="font-bold text-sm tracking-tight">{pref.title}</h5>
                                        <p className="text-[11px] text-muted-foreground italic">{pref.desc}</p>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${pref.default ? 'bg-primary' : 'bg-secondary'}`}>
                                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${pref.default ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/60 shadow-none overflow-hidden rounded-2xl">
                        <CardHeader className="border-b border-border/10 pb-6">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Globe className="text-primary" size={20} />
                                Regional & Language
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Primary Language</Label>
                                <select className="w-full h-11 rounded-xl bg-secondary/20 border-border/50 px-4 text-sm font-medium italic outline-none focus:ring-1 focus:ring-primary/40">
                                    <option>English (United States)</option>
                                    <option>Spanish (ES)</option>
                                    <option>French (FR)</option>
                                    <option>German (DE)</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-border/50 bg-card/60 shadow-none overflow-hidden rounded-2xl">
                        <CardHeader className="border-b border-border/10 pb-6">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Lock className="text-primary" size={20} />
                                Security & Privacy
                            </CardTitle>
                            <CardDescription className="italic">Manage your authentication and data vault access.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm">Two-Factor Authentication</h4>
                                    <p className="text-xs text-muted-foreground italic">Add an extra layer of security to your clinical records.</p>
                                </div>
                                <Badge className="bg-emerald-500 text-white border-none rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest">Enabled</Badge>
                            </div>
                            <div className="h-px bg-border/50"></div>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-bold text-sm">Vault Biometrics</h4>
                                    <p className="text-xs text-muted-foreground italic">Use FaceID or TouchID for rapid folder decryption.</p>
                                </div>
                                <Button variant="outline" className="h-9 rounded-lg px-4 font-black uppercase tracking-widest text-[10px] border-border/50">Disable</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Side Panels */}
                <div className="space-y-8">
                    <Card className="bg-primary/5 border-primary/20 border-t-4 border-t-primary rounded-2xl">
                        <CardHeader className="pb-2 text-center pt-8">
                            <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4 text-primary">
                                <ShieldCheck size={32} />
                            </div>
                            <CardTitle className="text-lg font-black tracking-tight uppercase">Health Plan: Elite</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center pb-8 space-y-6">
                            <p className="text-[11px] text-muted-foreground font-medium italic px-4">
                                You have active clinical coverage with 12-Agent orchestration enabled for all diagnostics.
                            </p>
                            <div className="flex flex-col gap-2 px-4 pt-2">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-primary/70">
                                    <span>Plan Status</span>
                                    <span className="text-emerald-500">Active</span>
                                </div>
                                <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary" style={{ width: '100%' }}></div>
                                </div>
                            </div>
                            <Button className="w-full h-11 font-bold text-xs uppercase tracking-widest rounded-xl bg-primary shadow-xl shadow-primary/20">Manage Billing</Button>
                        </CardContent>
                    </Card>

                    <div className="p-6 rounded-2xl bg-secondary/20 border border-border/50 space-y-6">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Connected Devices</h4>
                        {[
                            { name: 'iPhone 15 Pro', icon: <Smartphone size={16} />, status: 'Last sync: now' },
                            { name: 'Apple Watch v9', icon: <Activity size={16} />, status: 'Heart monitor active' },
                            { name: 'Safari on macOS', icon: <Globe size={16} />, status: 'Active session' },
                        ].map((dev, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="h-10 w-10 rounded-xl bg-card border border-border/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                    {dev.icon}
                                </div>
                                <div className="flex-1">
                                    <h5 className="text-[13px] font-bold group-hover:text-foreground transition-colors">{dev.name}</h5>
                                    <p className="text-[10px] text-muted-foreground italic">{dev.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="pt-10 flex items-center justify-center gap-6 text-[9px] font-black tracking-[0.3em] uppercase opacity-20 text-center">
                <span>GDPR DATA PORTABILITY COMPLIANT</span>
                <span>•</span>
                <span>CCPA PRIVACY PROTECTED</span>
            </div>
        </div>
    );
};

export default Profile;
