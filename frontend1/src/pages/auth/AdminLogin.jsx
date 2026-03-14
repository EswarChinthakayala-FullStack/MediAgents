import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import { Settings, ArrowRight, ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate Keycloak/SSO redirection or auth
        setTimeout(() => {
            navigate('/admin');
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="mb-10 flex flex-col items-center animate-in fade-in zoom-in duration-1000">
                <div className="flex items-center gap-2 mb-4 bg-muted/10 px-3 py-1 rounded border border-white/5">
                    <Settings size={14} className="text-muted-foreground animate-spin-slow" />
                    <span className="text-[10px] font-bold text-muted-foreground tracking-[0.2em] uppercase">System Administration</span>
                </div>
                <Logo size="lg" className="mb-2 grayscale contrast-125" />
                <h1 className="text-2xl font-black text-white tracking-tighter">ADMIN PANEL</h1>
            </div>

            <Card className="w-full max-w-sm border-white/5 bg-black/40 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-destructive to-transparent opacity-50 group-hover:via-primary transition-all duration-1000"></div>

                <CardHeader className="text-center pt-8 pb-4">
                    <CardTitle className="text-lg font-bold text-white tracking-tight">Privileged Access Only</CardTitle>
                    <CardDescription className="text-slate-500 text-xs">Administrative SSO via Secure Keycloak Identity</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 pb-2 text-center">
                    <div className="inline-flex p-4 rounded-xl bg-destructive/5 border border-destructive/10 mb-6 transition-colors group-hover:bg-primary/5 group-hover:border-primary/10">
                        <ShieldAlert size={32} className="text-destructive transition-colors group-hover:text-primary" />
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed px-4 italic">
                        All administrative actions are logged and subject to continuous security auditing.
                        Unauthorized access attempts will be intercepted and reported.
                    </p>
                </CardContent>
                <CardFooter className="pt-6 pb-10 flex flex-col gap-4">
                    <Button onClick={handleLogin} className="w-full h-11 gap-3 text-sm font-bold bg-white text-black hover:bg-slate-200 transition-all rounded-sm group" disabled={loading}>
                        {loading ? "Initializing Secure Session..." : "ADMIN PORTAL SIGN IN"}
                        {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                    </Button>
                    <a href="/" className="text-[10px] text-slate-600 hover:text-slate-400 decoration-dotted hover:underline transition-colors uppercase tracking-widest text-center">Return to Gateway</a>
                </CardFooter>
            </Card>

            <style>{`
                .animate-spin-slow {
                    animation: spin 8s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
