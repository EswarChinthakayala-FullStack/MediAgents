import React from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Link } from 'react-router-dom';
import {
    PlusCircle,
    ShieldCheck,
    Zap,
    Users,
    ArrowRight,
    Stethoscope,
    Activity,
    FileSearch,
    BrainCircuit,
    Microscope,
    CalendarDays,
    ShieldAlert,
    Dna,
    HeartPulse,
    Syringe,
    ClipboardList,
    Settings
} from 'lucide-react';

const LandingPage = () => {

    const features = [
        {
            title: "Agentic Intelligence",
            description: "12 specialized AI agents working together to provide comprehensive clinical support and diagnostic assistance.",
            icon: <BrainCircuit className="h-6 w-6 text-primary" />,
            tag: "Advanced AI"
        },
        {
            title: "Enterprise Security",
            description: "HIPAA and GDPR compliant data processing ensures patient privacy is always the top priority.",
            icon: <ShieldCheck className="h-6 w-6 text-primary" />,
            tag: "Secure"
        },
        {
            title: "Real-time Monitoring",
            description: "Live patient status updates and emergency alert systems that trigger in milliseconds.",
            icon: <Activity className="h-6 w-6 text-primary" />,
            tag: "Instant"
        }
    ];

    const agents = [
        { name: "Triage Agent", roles: "Symptom Analysis", icon: <Stethoscope /> },
        { name: "Diagnostic Agent", roles: "Pathology Review", icon: <Microscope /> },
        { name: "Safety Agent", roles: "Risk Mitigation", icon: <ShieldAlert /> },
        { name: "Clinical Registry", roles: "Data Management", icon: <ClipboardList /> },
        { name: "Geneticist Agent", roles: "DNA Sequence", icon: <Dna /> },
        { name: "Vitals Agent", roles: "Heart & Pulse", icon: <HeartPulse /> },
    ];

    return (
        <div className="relative overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-20 pb-20 md:pt-32 md:pb-32">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,rgba(16,185,129,0.08)_0%,rgba(9,9,11,0)_100%)]"></div>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                        <Badge variant="outline" className="mb-6 px-3 py-1 border-primary/30 bg-primary/5 text-primary animate-fade-in group">
                            <span className="relative flex h-2 w-2 mr-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-20"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            v2.4 Clinical Intelligence Active
                        </Badge>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent leading-[1.1]">
                            The Universal OS for <br className="hidden md:block" />
                            <span className="text-primary underline decoration-primary/20 decoration-8 underline-offset-8">Clinical Excellence</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-16 max-w-2xl leading-relaxed italic">
                            A unified multi-agent framework designed to orchestrate complex clinical workflows with human-parity precision.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 animate-in slide-in-from-bottom-8 duration-1000">
                        <Link to="/login">
                            <Button size="lg" className="h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 font-bold gap-3 shadow-2xl shadow-primary/20 group">
                                Access Secure Portals
                                <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                            </Button>
                        </Link>
                        <Link to="/signup">
                            <Button size="lg" variant="outline" className="h-14 px-10 border-border/50 font-bold hover:bg-secondary/50">
                                Start Free Trial
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature Section */}
            <section id="features" className="py-24 bg-card/10 border-y border-border/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Unmatched Clinical Capabilities</h2>
                        <p className="text-muted-foreground max-w-xl mx-auto italic">
                            Built on top of a sophisticated multi-agent framework designed specifically for healthcare providers.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, idx) => (
                            <Card key={idx} className="lyra-card p-8 group">
                                <div className="mb-6 p-3 w-fit rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                                    {feature.icon}
                                </div>
                                <Badge variant="secondary" className="mb-4 bg-secondary/50">{feature.tag}</Badge>
                                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                <p className="text-muted-foreground leading-relaxed italic">
                                    {feature.description}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Agents Showcase */}
            <section id="agents" className="py-24 relative overflow-hidden">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
                        <div className="max-w-2xl text-left">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Meet the <span className="text-primary">Medical Council</span></h2>
                            <p className="text-muted-foreground italic">
                                Our platform orchestrates 12 distinct AI agents, each an expert in a specific medical domain,
                                collaborating to provide a holistic view of patient care.
                            </p>
                        </div>
                        <Link to="/agents">
                            <Button variant="link">
                                Meet all 12 Agents <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                        {agents.map((agent, i) => (
                            <div key={i} className="flex flex-col items-center p-6 rounded-2xl bg-card border border-border/40 transition-all hover:-translate-y-1 hover:border-primary/50 hover:glow-emerald">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                                    {agent.icon}
                                </div>
                                <h4 className="font-bold text-sm text-center mb-1">{agent.name}</h4>
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground text-center">{agent.roles}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 relative">
                <div className="container mx-auto px-4">
                    <div className="rounded-3xl bg-primary/90 p-8 md:p-16 text-primary-foreground flex flex-col md:flex-row items-center justify-between gap-12 relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

                        <div className="relative z-10 text-center md:text-left">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to upgrade your Clinic?</h2>
                            <p className="text-primary-foreground/80 max-w-md italic mb-8">
                                Join over 500+ modern medical facilities using ClinicAI to automate their administrative and clinical workflows.
                            </p>
                            <Link to="/signup">
                                <Button size="lg" variant="secondary">
                                    Start Pilot Program
                                </Button>
                            </Link>
                        </div>

                        <div className="relative z-10 grid grid-cols-2 gap-8 md:gap-12">
                            <div>
                                <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tighter">99.9%</div>
                                <p className="text-xs uppercase tracking-widest text-primary-foreground/70 font-bold">Uptime Reliability</p>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tighter">12/12</div>
                                <p className="text-xs uppercase tracking-widest text-primary-foreground/70 font-bold">Agents Active</p>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tighter">45ms</div>
                                <p className="text-xs uppercase tracking-widest text-primary-foreground/70 font-bold">Average Latency</p>
                            </div>
                            <div>
                                <div className="text-4xl md:text-5xl font-bold mb-2 tracking-tighter">AES-256</div>
                                <p className="text-xs uppercase tracking-widest text-primary-foreground/70 font-bold">Data Security</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Simple FAQ / Bottom Content */}
            <section className="py-24 bg-background">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12">Trusted by Clinical Experts</h2>
                    <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-40">
                        <div className="font-bold text-2xl italic tracking-tighter">HEALTH-CORP</div>
                        <div className="font-bold text-2xl italic tracking-tighter">MED-SOLUTIONS</div>
                        <div className="font-bold text-2xl italic tracking-tighter">BIO-TECH</div>
                        <div className="font-bold text-2xl italic tracking-tighter">MODERN-DOC</div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
