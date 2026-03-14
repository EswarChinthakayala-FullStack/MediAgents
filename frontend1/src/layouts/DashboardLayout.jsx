import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import {
    BarChart3,
    Users,
    Settings,
    Bell,
    Search,
    LayoutDashboard,
    Calendar,
    ShieldCheck,
    LogOut,
    MessageSquare,
    Menu,
    ChevronDown,
    Activity,
    Database,
    Lock,
    Box,
    Globe,
    Zap,
    FileText,
    PanelLeftClose,
    PanelLeft
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { ModeToggle } from '../components/mode-toggle';
import { Sheet, SheetContent, SheetTrigger } from '../components/ui/sheet';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const DashboardLayout = ({ portalType = 'clinical' }) => {
    const [sidebarMode, setSidebarMode] = useState('expanded'); // 'expanded' | 'collapsed' | 'hover'
    const [isHovered, setIsHovered] = useState(false);
    const location = useLocation();

    // Derived state for visual collapse
    const isActuallyCollapsed = sidebarMode === 'collapsed' || (sidebarMode === 'hover' && !isHovered);

    const getMenuGroups = () => {
        if (portalType === 'patient') {
            return [
                {
                    label: 'My Care',
                    items: [
                        { icon: <LayoutDashboard size={14} />, label: 'Overview', path: '/portal' },
                        { icon: <Activity size={14} />, label: 'Symptom Checker', path: '/portal/symptoms' },
                        { icon: <Calendar size={14} />, label: 'Appointments', path: '/portal/appointments' },
                        { icon: <MessageSquare size={14} />, label: 'AI Assistant', path: '/portal/chat' },
                    ]
                },
                {
                    label: 'Clinical Intel',
                    items: [
                        { icon: <FileText size={14} />, label: 'Health Records', path: '/portal/records' },
                        { icon: <Database size={14} />, label: 'Medications', path: '/portal/medications' },
                        { icon: <Bell size={14} />, label: 'Notifications', path: '/portal/notifications' },
                    ]
                },
                {
                    label: 'Support',
                    items: [
                        { icon: <Users size={14} />, label: 'Profile Settings', path: '/portal/profile' },
                        { icon: <LayoutDashboard size={14} />, label: 'Book Session', path: '/portal/book' },
                    ]
                }
            ];
        }

        if (portalType === 'admin') {
            return [
                {
                    label: 'System Admin',
                    items: [
                        { icon: <LayoutDashboard size={14} />, label: 'Ops Console', path: '/admin' },
                        { icon: <Users size={14} />, label: 'User Management', path: '/admin/users' },
                        { icon: <Globe size={14} />, label: 'Regional Clusters', path: '/admin/clusters' },
                    ]
                },
                {
                    label: 'Infrastructure',
                    items: [
                        { icon: <Database size={14} />, label: 'Clinical DBs', path: '/admin/db' },
                        { icon: <ShieldCheck size={14} />, label: 'Security Audits', path: '/admin/security' },
                        { icon: <Activity size={14} />, label: 'Keycloak IAM', path: '/admin/iam' },
                    ]
                }
            ];
        }

        // Default: clinical
        return [
            {
                label: 'General',
                items: [
                    { icon: <LayoutDashboard size={14} />, label: 'Dashboard', path: '/clinical' },
                    { icon: <Users size={14} />, label: 'Patient Directory', path: '/clinical/patients' },
                    { icon: <Calendar size={14} />, label: 'Appointments', path: '/clinical/appointments' },
                    { icon: <MessageSquare size={14} />, label: 'AI Consultations', path: '/clinical/chat' },
                ]
            },
            {
                label: 'MediAgents Fleet',
                items: [
                    { icon: <Activity size={14} />, label: 'System Health', path: '/clinical/health' },
                    { icon: <Zap size={14} />, label: 'Triage Engine', path: '/clinical/agents/triage' },
                    { icon: <ShieldCheck size={14} />, label: 'Safety Monitor', path: '/clinical/safety' },
                    { icon: <BarChart3 size={14} />, label: 'Agent Analytics', path: '/clinical/analytics' },
                ]
            },
            {
                label: 'Clinical Intel',
                items: [
                    { icon: <FileText size={14} />, label: 'Medical Records', path: '/clinical/records' },
                    { icon: <Database size={14} />, label: 'Diagnostic Hub', path: '/clinical/diagnostic' },
                    { icon: <Lock size={14} />, label: 'HIPAA Vault', path: '/clinical/vault' },
                ]
            }
        ];
    };

    const menuGroups = getMenuGroups();

    const SidebarContent = ({ isMobile = false }) => (
        <div className="flex flex-col h-full bg-card text-muted-foreground border-r border-border ring-offset-background relative overflow-hidden">
            {/* Header: Logo & Toggle */}
            <div className="pt-6 px-4 flex flex-col gap-4">
                <div className="flex items-center justify-between min-h-[40px]">
                    <Link to="/" className="flex items-center gap-2.5 px-1 py-1 min-w-0 transition-all">
                        <Logo variant="icon" size="xs" />
                        {(!isActuallyCollapsed || isMobile) && (
                            <span className="text-foreground font-bold tracking-tight text-base truncate animate-in fade-in duration-300">ClinicAI</span>
                        )}
                    </Link>

                    {!isMobile && (
                        <button
                            onClick={() => setSidebarMode('collapsed')}
                            className={`p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200 ${isActuallyCollapsed ? 'hidden' : 'block'}`}
                            title="Close Sidebar"
                        >
                            <PanelLeftClose size={16} />
                        </button>
                    )}
                </div>

                {(!isActuallyCollapsed || isMobile) && (
                    <div className="flex items-center justify-between px-3 py-2 rounded-md bg-secondary/40 border border-border text-[12px] text-foreground font-medium hover:bg-secondary transition-colors cursor-pointer group mb-2 animate-in slide-in-from-left-2 duration-300">
                        <div className="flex items-center gap-2.5 overflow-hidden">
                            <div className="w-4 h-4 rounded bg-primary/20 flex items-center justify-center text-primary">
                                <Activity size={10} />
                            </div>
                            <span className="truncate">MediAgents Lab</span>
                        </div>
                        <ChevronDown size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                )}
            </div>

            {/* Navigation Groups */}
            <div className="flex-1 py-6 overflow-y-auto custom-scroll-container space-y-8">
                {menuGroups.map((group) => (
                    <div key={group.label} className="px-3">
                        {(!isActuallyCollapsed || isMobile) && (
                            <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60 mb-3 animate-in fade-in">
                                {group.label}
                            </h3>
                        )}
                        <div className="space-y-0.5">
                            {group.items.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-[13px] font-medium transition-all duration-150 group relative ${isActive
                                            ? 'bg-secondary text-foreground shadow-sm'
                                            : 'hover:text-foreground hover:bg-secondary/40'
                                            } ${isActuallyCollapsed && !isMobile ? 'justify-center' : ''}`}
                                    >
                                        <span className={`transition-transform duration-200 ${isActive ? 'text-primary' : 'group-hover:text-primary group-hover:scale-110'}`}>
                                            {item.icon}
                                        </span>
                                        {(!isActuallyCollapsed || isMobile) && (
                                            <span className="truncate animate-in fade-in slide-in-from-left-1">{item.label}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Section */}
            <div className="p-3 border-t border-border space-y-1 mt-auto bg-card z-10">
                <Link
                    to="/dashboard/settings"
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium hover:text-foreground hover:bg-secondary/40 transition-all duration-150 group ${isActuallyCollapsed && !isMobile ? 'justify-center' : ''}`}
                >
                    <Settings size={14} className="group-hover:rotate-45 transition-transform duration-500" />
                    {(!isActuallyCollapsed || isMobile) && <span className="animate-in fade-in">Project Settings</span>}
                </Link>

                {(!isActuallyCollapsed || isMobile) && (
                    <div className="mt-4 px-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-between h-9 px-3 text-[12px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent hover:border-border/50 transition-all group"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                        <span>Sidebar View</span>
                                    </div>
                                    <ChevronDown size={14} className="opacity-50 group-hover:opacity-100 transition-opacity" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-[180px] bg-card border-border shadow-xl p-1 z-[100]">
                                <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider border-b border-border/50 mb-1">
                                    Display Mode
                                </div>
                                {[
                                    { id: 'expanded', label: 'Expanded', icon: <PanelLeft size={14} /> },
                                    { id: 'collapsed', label: 'Collapsed', icon: <PanelLeftClose size={14} /> },
                                    { id: 'hover', label: 'Expand on Hover', icon: <Activity size={14} /> }
                                ].map((mode) => (
                                    <DropdownMenuItem
                                        key={mode.id}
                                        onClick={() => setSidebarMode(mode.id)}
                                        className={`flex items-center gap-2.5 px-2 py-2 text-[12px] cursor-pointer transition-colors ${sidebarMode === mode.id ? 'bg-secondary text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        <span className={sidebarMode === mode.id ? 'text-primary' : 'opacity-50'}>
                                            {mode.icon}
                                        </span>
                                        {mode.label}
                                        {sidebarMode === mode.id && <div className="ml-auto w-1 h-1 rounded-full bg-primary" />}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
            {/* Single Sidebar */}
            <aside
                onMouseEnter={() => sidebarMode === 'hover' && setIsHovered(true)}
                onMouseLeave={() => sidebarMode === 'hover' && setIsHovered(false)}
                className={`hidden md:flex relative flex-col border-r border-border bg-card transition-all duration-300 ease-in-out z-40 ${isActuallyCollapsed ? 'w-16' : 'w-64'
                    }`}
            >
                <SidebarContent />

                {/* Visual indicator for collapsed state toggle */}
                {isActuallyCollapsed && (
                    <button
                        onClick={() => setSidebarMode('expanded')}
                        className="absolute right-3 top-6 z-50 h-8 w-8 flex items-center justify-center rounded-md border border-border bg-card text-muted-foreground shadow-sm hover:text-primary transition-all hover:scale-110"
                        title="Open Sidebar"
                    >
                        <PanelLeft size={16} />
                    </button>
                )}
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
                {/* Top Header */}
                <header className="h-[52px] flex items-center justify-between px-4 md:px-6 border-b border-border bg-background/90 backdrop-blur-md z-30">
                    <div className="flex items-center gap-4 flex-1">
                        {/* Mobile Menu Trigger */}
                        <div className="md:hidden">
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                        <Menu size={18} />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="p-0 w-72 border-r border-border bg-card">
                                    <SidebarContent isMobile />
                                </SheetContent>
                            </Sheet>
                        </div>

                        {/* Breadcrumbs Placeholder */}
                        <div className="flex items-center gap-2.5 text-[12px] font-medium text-muted-foreground overflow-hidden whitespace-nowrap">
                            <span className="hover:text-foreground cursor-pointer transition-colors">MediAgents</span>
                            <span className="opacity-30 text-border">/</span>
                            <span className="text-foreground font-semibold">Project Overview</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-2 py-0.5 rounded-md border border-primary/20 bg-primary/5">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Production</span>
                        </div>

                        <div className="h-4 w-px bg-border"></div>

                        <ModeToggle />

                        <div className="flex items-center gap-3">
                            <Button variant="outline" size="sm" className="h-8 px-3 text-[11px] text-muted-foreground hover:text-foreground">
                                Feedback
                            </Button>
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="h-8 w-48 bg-secondary/50 border border-border rounded-md pl-8 pr-2 text-[11px] focus:w-64 focus:border-primary/50 transition-all outline-none"
                                />
                                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground/60 font-mono border border-border px-1 rounded">⌘K</span>
                            </div>
                        </div>

                        <Link to="/logout">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                <LogOut size={16} />
                            </Button>
                        </Link>
                    </div>
                </header>

                {/* Dashboard Page Content */}
                <main className="flex-1 overflow-y-auto scroll-thin bg-background">
                    <div className="max-w-[1500px] mx-auto p-4 md:p-10">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;