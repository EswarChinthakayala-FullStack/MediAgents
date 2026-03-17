import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
    Settings,
    Save,
    ShieldCheck,
    Key,
    Zap,
    Bell,
    Globe,
    Smartphone,
    Database,
    Cpu,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    Loader2,
    Binary,
    Activity
} from 'lucide-react';
import { Switch } from "../../components/ui/switch";

const AdminSettings = () => {
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showApiKey, setShowApiKey] = useState(false);

    useEffect(() => {
        setTimeout(() => setLoading(false), 600);
    }, []);

    const handleSave = () => {
        setIsSaving(true);
        // Simulating PUT /api/admin/settings
        setTimeout(() => {
            setIsSaving(false);
            alert("Platform Configuration updated successfully.");
        }, 1200);
    };

    if (loading) return <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Settings className="animate-spin text-primary" size={40} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Loading Core Configuration...</span>
    </div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
                        <Binary size={30} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Platform Kernel Settings</h1>
                        <p className="text-muted-foreground text-xs font-bold tracking-[0.15em] uppercase opacity-60 italic">Core Systems Configuration • MediAgents v4.2</p>
                    </div>
                </div>

                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 px-8 gap-2 shadow-xl shadow-primary/20"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isSaving ? "Finalizing Sync..." : "Save Alterations"}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: General & Integration */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Institutional Profile */}
                    <Card className="border-border/50 bg-card rounded-2xl overflow-hidden shadow-none">
                        <CardHeader className="bg-secondary/10 border-b border-border/10 py-5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Globe className="text-primary" size={16} /> Institutional Topology
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Institute Name</label>
                                    <Input defaultValue="ClinicAI Global Research Center" className="h-11 bg-secondary/30 border-border/50 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Regional Domain</label>
                                    <Input defaultValue="us-east-cluster.clinic.ai" className="h-11 bg-secondary/30 border-border/50 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Contact Node (Email)</label>
                                    <Input defaultValue="ops@clinic.ai" className="h-11 bg-secondary/30 border-border/50 rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">EHR Provider Hook</label>
                                    <Input defaultValue="Epic System FHIR v4" className="h-11 bg-secondary/30 border-border/50 rounded-xl" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* API & Keys */}
                    <Card className="border-border/50 bg-card rounded-2xl overflow-hidden shadow-none">
                        <CardHeader className="bg-secondary/10 border-b border-border/10 py-5">
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Key className="text-primary" size={16} /> Secure API Manifest
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col gap-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Master Orchestration Key</p>
                                        <p className="text-xs text-muted-foreground font-bold font-mono mt-1 italic">Used for cross-agent authentication</p>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setShowApiKey(!showApiKey)} className="h-8 w-8 text-primary">
                                        {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </Button>
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        type={showApiKey ? 'text' : 'password'}
                                        readOnly
                                        value="ma_live_72b5f115ce4f90e3d91ca442c892ce4f"
                                        className="h-11 font-mono text-xs bg-background border-border/50 rounded-xl flex-1"
                                    />
                                    <Button variant="outline" className="h-11 px-4 border-border/50 bg-background hover:bg-secondary">
                                        <Save size={16} />
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { label: 'Webhook Endpoint', val: 'https://core.clinic.ai/v1/webhook' },
                                    { label: 'Integration Client ID', val: 'clinic-ai-enterprise-442' }
                                ].map((int, i) => (
                                    <div key={i} className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{int.label}</label>
                                        <Input defaultValue={int.val} className="h-11 bg-secondary/30 border-border/50 rounded-xl" />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Preferences & Features */}
                <div className="space-y-8">
                    {/* Feature Toggles */}
                    <Card className="border-border/50 bg-background/50 border-dashed rounded-2xl overflow-hidden shadow-none">
                        <CardHeader>
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Zap className="text-primary" size={16} /> Functional Modules
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {[
                                { label: 'Federated Training', desc: 'Allow model weight updates via edge nodes', active: true },
                                { label: 'Predictive Triage', desc: 'Enable Agent 02 autonomous scheduling', active: true },
                                { label: 'Audit Sentinel', desc: 'Enable real-time event hash-chaining', active: true },
                                { label: 'External API Access', desc: 'Allow third-party JWT-signed requests', active: false },
                            ].map((f, i) => (
                                <div key={i} className="flex items-start justify-between gap-4">
                                    <div className="space-y-1">
                                        <p className="text-xs font-black uppercase tracking-tight text-foreground">{f.label}</p>
                                        <p className="text-[10px] text-muted-foreground font-medium italic leading-relaxed">{f.desc}</p>
                                    </div>
                                    <Switch checked={f.active} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Notifications */}
                    <Card className="border-border/50 bg-card rounded-2xl overflow-hidden shadow-none">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Bell className="text-orange-500" size={14} /> System Alerts Config
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="p-4 rounded-xl bg-orange-500/5 border border-orange-500/10 flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-orange-500">
                                        <Smartphone size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Global SMS Gateway</span>
                                    </div>
                                    <Switch checked={true} />
                                </div>
                                <Input defaultValue="+1 (555) 000-AGENT" className="h-10 bg-background border-border/50 rounded-lg text-xs" />
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Button variant="ghost" className="w-full h-11 border border-border/10 text-[10px] font-black uppercase tracking-widest gap-2 bg-secondary/30 hover:bg-secondary">
                                <Activity size={14} className="text-primary" /> Test Notification pipeline
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Security Hardening */}
                    <Card className="border-emerald-500/20 bg-emerald-500/5 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4 text-emerald-500">
                            <ShieldCheck size={20} />
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Hardened Security active</h4>
                        </div>
                        <p className="text-[11px] text-muted-foreground font-medium italic leading-relaxed opacity-80 mb-4">
                            MFA is enforced globally for all admin entities. IP whitelisting is active for the orchestration subnet.
                        </p>
                        <Button className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20">
                            Configure Subnet ACLs
                        </Button>
                    </Card>
                </div>
            </div>

            <div className="flex items-center justify-between text-[9px] font-black tracking-[0.3em] uppercase opacity-30 pt-4 border-t border-border/10">
                <span>IDENTITY: MASTER-ADMIN-01</span>
                <span className="flex items-center gap-2">
                    <Binary size={10} /> ENCRYPTED KERNEL SYNC ENABLED
                </span>
                <span>SYSTEM UPTIME: 214d 14h 22m</span>
            </div>
        </div>
    );
};

export default AdminSettings;
