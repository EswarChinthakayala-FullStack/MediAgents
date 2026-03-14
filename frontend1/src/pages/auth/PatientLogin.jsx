import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../components/Logo';
import { User, Lock, ArrowRight } from 'lucide-react';

const PatientLogin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate auth
        setTimeout(() => {
            navigate('/portal');
            setLoading(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="mb-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Logo size="lg" className="mb-4" />
                <h1 className="text-2xl font-bold text-foreground">Patient Portal</h1>
                <p className="text-muted-foreground text-sm italic">Securely access your health records and appointments</p>
            </div>

            <Card className="w-full max-w-md border-border bg-card/60 backdrop-blur-xl shadow-2xl animate-in zoom-in-95 duration-500">
                <CardHeader>
                    <CardTitle className="text-xl">Welcome Back</CardTitle>
                    <CardDescription>Enter your credentials to access your portal</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email or Health ID</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input id="email" type="text" placeholder="name@example.com" className="pl-10 h-11" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link to="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                                <Input id="password" type="password" placeholder="••••••••" className="pl-10 h-11" required />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button type="submit" className="w-full h-11 gap-2 text-base font-semibold group" disabled={loading}>
                            {loading ? "Authenticating..." : "Sign In to Portal"}
                            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            Don't have an account? <Link to="#" className="text-primary font-medium hover:underline">Register here</Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>

            <div className="mt-8 flex gap-4 text-xs text-muted-foreground animate-in fade-in duration-1000">
                <span>© 2026 ClinicAI</span>
                <span>•</span>
                <span>Privacy Policy</span>
                <span>•</span>
                <span>Terms of Service</span>
            </div>
        </div>
    );
};

export default PatientLogin;
