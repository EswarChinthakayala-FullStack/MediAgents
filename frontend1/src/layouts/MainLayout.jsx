import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import { ModeToggle } from '../components/mode-toggle';

const MainLayout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-primary-foreground relative">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute inset-0 grid-background"></div>
                <div className="absolute inset-0 mesh-gradient"></div>
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-20 items-center justify-between mx-auto px-4">
                    <Link to="/" className="flex items-center space-x-2 transition-opacity hover:opacity-90">
                        <Logo size="md" />
                    </Link>

                    <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                        <Link to="#features" className="text-muted-foreground transition-colors hover:text-primary">Features</Link>
                        <Link to="#agents" className="text-muted-foreground transition-colors hover:text-primary">The 12 Agents</Link>
                        <Link to="#pricing" className="text-muted-foreground transition-colors hover:text-primary">Pricing</Link>
                        <Link to="#faq" className="text-muted-foreground transition-colors hover:text-primary">FAQ</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <Link to="/login" className="hidden sm:block">
                            <Button variant="ghost">
                                Log in
                            </Button>
                        </Link>
                        <Link to="/dashboard">
                            <Button>
                                Launch App
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-card/30 py-12">
                <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="flex flex-col gap-4">
                            <Logo size="sm" />
                            <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px]">
                                Revolutionizing healthcare with multi-agent clinical intelligence.
                                Securing patient data with HIPAA & GDPR compliant AI solutions.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Product</h4>
                            <nav className="flex flex-col gap-2">
                                <Link to="#features" className="text-sm hover:text-primary transition-colors font-medium">Platform</Link>
                                <Link to="#agents" className="text-sm hover:text-primary transition-colors font-medium">Agents System</Link>
                                <Link to="#security" className="text-sm hover:text-primary transition-colors font-medium">Security</Link>
                            </nav>
                        </div>

                        <div className="flex flex-col gap-3">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Company</h4>
                            <nav className="flex flex-col gap-2">
                                <Link to="/about" className="text-sm hover:text-primary transition-colors font-medium">About Us</Link>
                                <Link to="/contact" className="text-sm hover:text-primary transition-colors font-medium">Contact</Link>
                                <Link to="/privacy" className="text-sm hover:text-primary transition-colors font-medium">Privacy Policy</Link>
                            </nav>
                        </div>

                        <div className="flex flex-col gap-3 text-right items-end">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Status</h4>
                            <div className="flex items-center gap-2 text-xs font-medium text-success">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
                                </span>
                                All Systems Operational
                            </div>
                            <p className="text-xs text-muted-foreground mt-4">
                                © {new Date().getFullYear()} ClinicAI. Built for the future of Medicine.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;