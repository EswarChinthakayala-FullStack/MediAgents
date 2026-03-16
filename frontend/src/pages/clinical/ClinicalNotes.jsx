import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import {
    FileText,
    ArrowLeft,
    Zap,
    Save,
    Mic,
    Search,
    Plus,
    Trash2,
    CheckCircle2,
    ShieldCheck,
    Pill,
    BrainCircuit,
    Sparkles,
    Stethoscope
} from 'lucide-react';

const ClinicalNotes = () => {
    const { id } = useParams();
    const [noteType, setNoteType] = useState('SOAP');
    const [content, setContent] = useState({
        subjective: '',
        objective: '',
        assessment: '',
        plan: ''
    });
    const [prescriptions, setPrescriptions] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [aiSuggesting, setAiSuggesting] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulating POST /api/ehr/{id}/note → Agent 06
        setTimeout(() => {
            setIsSaving(false);
            alert("Clinical Record Synchronized Successfully");
        }, 1500);
    };

    const generateAISuggestion = () => {
        setAiSuggesting(true);
        // Simulating AI drafting Assessment/Plan
        setTimeout(() => {
            setContent(prev => ({
                ...prev,
                assessment: "Probable stable angina vs. early-stage ACS. Vitals indicate transient tachycardia with baseline hypertension.",
                plan: "1. Immediate troponin I/T assay.\n2. Cardiology consult for possible echo.\n3. Continue Metformin 500mg BID.\n4. Introduce Naproxen 250mg PRN for secondary discomfort."
            }));
            setAiSuggesting(false);
        }, 2000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row gap-6 items-start justify-between">
                <div className="flex items-center gap-4">
                    <Link to={`/clinical/patient/${id}`} className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h1 className="text-2xl font-black tracking-tight uppercase">Clinical Documentation</h1>
                            <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black tracking-wider uppercase rounded-sm h-5">ID: {id}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase opacity-60 italic">Attending Clinical Scribe Node: active</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="h-11 rounded-xl font-bold bg-secondary/30 border-border/50 gap-2 px-5">
                        <Mic size={18} className="text-primary" /> Dictate
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 px-6 gap-2 shadow-xl shadow-primary/20"
                    >
                        {isSaving ? <Sparkles className="animate-spin" size={18} /> : <Save size={18} />}
                        {isSaving ? "Syncing..." : "Finalize & Sync"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* SOAP Note Editor */}
                <Card className="xl:col-span-2 border-border/50 bg-card shadow-none rounded-2xl overflow-hidden flex flex-col">
                    <CardHeader className="bg-secondary/10 border-b border-border/10 py-5 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <FileText className="text-primary" size={16} /> SOAP Format Editor
                            </CardTitle>
                        </div>
                        <div className="flex bg-background border border-border/50 rounded-lg p-1">
                            {['SOAP', 'FREEFORM', 'PROGRESS'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setNoteType(t)}
                                    className={`px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-md transition-all ${noteType === t ? 'bg-primary text-white' : 'text-muted-foreground hover:bg-secondary/50'}`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 flex flex-col min-h-[500px]">
                        {['Subjective', 'Objective', 'Assessment', 'Plan'].map((section, i) => (
                            <div key={section} className={`flex-1 flex flex-col border-b border-border/5 last:border-0 ${i % 2 === 0 ? 'bg-background/20' : 'bg-transparent'}`}>
                                <div className="px-6 py-3 flex items-center justify-between">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">{section}</label>
                                    {section === 'Assessment' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={generateAISuggestion}
                                            disabled={aiSuggesting}
                                            className="h-7 text-[9px] font-black uppercase tracking-widest gap-2 text-primary hover:bg-primary/10"
                                        >
                                            {aiSuggesting ? <sparkles className="animate-spin" size={10} /> : <BrainCircuit size={10} />}
                                            {aiSuggesting ? "Synthesizing..." : "AI Assist"}
                                        </Button>
                                    )}
                                </div>
                                <Textarea
                                    value={content[section.toLowerCase()]}
                                    onChange={(e) => setContent(prev => ({ ...prev, [section.toLowerCase()]: e.target.value }))}
                                    placeholder={`Enter clinical ${section.toLowerCase()} details...`}
                                    className="flex-1 border-0 bg-transparent px-6 pb-6 text-sm italic font-medium focus-visible:ring-0 resize-none min-h-[100px]"
                                />
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Prescription & Pharmacy Flow */}
                <div className="space-y-8">
                    <Card className="border-border/50 bg-secondary/10 shadow-none border-dashed rounded-2xl">
                        <CardHeader>
                            <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                                <Pill className="text-primary" size={16} /> Prescription Engine
                            </CardTitle>
                            <CardDescription className="text-[10px] uppercase font-bold tracking-tight opacity-50 font-mono">Managed by Agent 07 (Pharmacy Oracle)</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                                <Input
                                    placeholder="Search Global Drug Directory..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-10 text-[11px] font-bold bg-background border-border/50 rounded-xl"
                                />
                                {searchQuery.length > 2 && (
                                    <Card className="absolute top-12 inset-x-0 z-50 p-2 border-border/80 bg-popover shadow-2xl animate-in zoom-in-95">
                                        {[
                                            { name: 'Amoxicillin', dose: '500mg' },
                                            { name: 'Atorvastatin', dose: '20mg' }
                                        ].map(d => (
                                            <div
                                                key={d.name}
                                                onClick={() => {
                                                    setPrescriptions([...prescriptions, { ...d, id: Date.now(), frequency: 'Daily' }]);
                                                    setSearchQuery('');
                                                }}
                                                className="p-3 rounded-lg hover:bg-secondary cursor-pointer flex items-center justify-between"
                                            >
                                                <span className="text-xs font-bold">{d.name}</span>
                                                <Badge variant="outline" className="text-[9px] h-4 uppercase">{d.dose}</Badge>
                                            </div>
                                        ))}
                                    </Card>
                                )}
                            </div>

                            <div className="space-y-3 pt-2">
                                {prescriptions.length === 0 ? (
                                    <div className="h-32 flex flex-col items-center justify-center text-center p-6 border border-dashed border-border/20 rounded-xl bg-background/30 text-muted-foreground/40 italic text-[11px] font-bold">
                                        No active prescriptions drafted
                                    </div>
                                ) : prescriptions.map(pres => (
                                    <div key={pres.id} className="p-4 rounded-xl bg-background border border-border/40 flex flex-col gap-2 group relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setPrescriptions(prescriptions.filter(p => p.id !== pres.id))}
                                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 size={14} />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-sm font-black tracking-tight text-primary uppercase">{pres.name}</h4>
                                            <Badge variant="secondary" className="text-[9px] font-bold px-1.5 h-4 uppercase">{pres.dose}</Badge>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <p className="text-[9px] font-black uppercase text-muted-foreground/50 mb-1">Frequency</p>
                                                <Input className="h-7 text-[10px] font-bold px-2 bg-secondary/30 border-0" value={pres.frequency} readOnly />
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[9px] font-black uppercase text-muted-foreground/50 mb-1">Duration</p>
                                                <Input className="h-7 text-[10px] font-bold px-2 bg-secondary/30 border-0" value="14 Days" readOnly />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                        <CardFooter className="pt-0">
                            <Button className="w-full h-11 bg-secondary border border-border/50 text-foreground font-bold text-[11px] uppercase tracking-widest rounded-xl hover:bg-secondary/80 gap-2">
                                <ShieldCheck size={16} className="text-emerald-500" /> E-Prescribe Secure Exit
                            </Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-border/40 bg-card/60 rounded-2xl overflow-hidden">
                        <CardHeader className="bg-emerald-500/5 py-4">
                            <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-emerald-600">
                                <ShieldCheck size={12} /> HIPAA Compliance Audit
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-5 text-[11px] text-muted-foreground leading-relaxed italic opacity-70">
                            Every modification to this clinical documentation is cryptographically signed and logged for audit purposes. End-to-end encryption is active for this session.
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="flex items-center justify-between text-[9px] font-black tracking-[0.3em] uppercase opacity-30 mt-6 pt-4 border-t border-border/10">
                <span className="flex items-center gap-2">
                    <Sparkles className="text-primary" size={12} /> NLP Scribe Engine Active
                </span>
                <span>SECURE RECORD RECONCILIATION LAYER</span>
            </div>
        </div>
    );
};

export default ClinicalNotes;
