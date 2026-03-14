import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import { ShieldCheck, ArrowRight, Activity } from 'lucide-react';

const DoctorLogin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate Keycloak/SSO redirection or auth
        setTimeout(() => {
            navigate('/clinical');
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4">
            <div className="mb-12 flex flex-col items-center animate-in fade-in slide-in-from-top-6 duration-1000">
                <div className="flex items-center gap-3 mb-6 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
                    <Activity size={20} className="text-primary" />
                    <span className="text-xs font-bold text-primary tracking-widest uppercase">Clinical Command Center</span>
                </div>
                <Logo size="xl" variant="full" className="mb-2" />
                <p className="text-muted-foreground text-sm italic opacity-70">For Doctors, Nurses, and Clinical Staff</p>
            </div>

            <Card className="w-full max-w-md border-[#27272a] bg-[#0c0c0e]/80 backdrop-blur-2xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] border-t-primary/30 border-t-2 animate-in slide-in-from-bottom-8 duration-700">
                <CardHeader className="text-center pb-8 border-b border-border/10">
                    <CardTitle className="text-2xl font-bold tracking-tight text-white mb-2">Professional Access</CardTitle>
                    <CardDescription className="text-[#a1a1aa]">Secure authentication via Keycloak SSO</CardDescription>
                </CardHeader>
                <CardContent className="pt-10 pb-6 text-center space-y-8">
                    <div className="flex justify-center">
                        <div className="w-20 h-20 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center relative">
                            <ShieldCheck size={40} className="text-primary" />
                            <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-20"></div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-white font-medium">Enterprise Identity Provider</h3>
                        <p className="text-xs text-[#71717a] px-8">You will be redirected to the centralized authentication server to verify your clinical credentials.</p>
                    </div>
                </CardContent>
                <CardFooter className="pb-10">
                    <Button onClick={handleLogin} className="w-full h-12 gap-3 text-base font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 group" disabled={loading}>
                        {loading ? "Connecting to Keycloak..." : "Authenticate via Clinic SSO"}
                        {!loading && <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />}
                    </Button>
                </CardFooter>
            </Card>

            <div className="mt-12 text-[#3f3f46] text-[10px] font-bold tracking-widest uppercase flex items-center gap-6 animate-pulse">
                <span>HIPAA Compliant</span>
                <span>•</span>
                <span>Audit Log Enabled</span>
                <span>•</span>
                <span>E2E Encrypted</span>
            </div>
        </div>
    );
};

export default DoctorLogin;
