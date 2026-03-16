import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
    Users,
    Search,
    Filter,
    UserPlus,
    MoreVertical,
    ShieldCheck,
    ShieldAlert,
    Mail,
    Calendar,
    Settings2,
    Lock,
    Unlock,
    Trash2,
    CheckCircle2,
    ChevronRight,
    Loader2
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "../../components/ui/dropdown-menu";

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        // Simulating GET /api/admin/users
        const mockUsers = [
            { id: 'u1', name: 'Dr. Michael Chen', email: 'm.chen@clinic.ai', role: 'doctor', status: 'active', lastLogin: '2h ago', securityLevel: 4 },
            { id: 'u2', name: 'Sarah Wilson', email: 's.wilson@patient.me', role: 'patient', status: 'active', lastLogin: '1d ago', securityLevel: 1 },
            { id: 'u3', name: 'Admin Jupiter', email: 'jupiter@system.ai', role: 'admin', status: 'active', lastLogin: '5m ago', securityLevel: 5 },
            { id: 'u4', name: 'James Rodger', email: 'j.rodger@clinic.ai', role: 'nurse', status: 'suspended', lastLogin: '12d ago', securityLevel: 2 },
            { id: 'u5', name: 'Emily Vance', email: 'e.vance@clinic.ai', role: 'doctor', status: 'active', lastLogin: '10h ago', securityLevel: 4 },
        ];

        setTimeout(() => {
            setUsers(mockUsers);
            setLoading(false);
        }, 800);
    }, []);

    const toggleStatus = (id) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
    };

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin': return <Badge className="bg-destructive/10 text-destructive border-destructive/20 rounded-md text-[9px] font-black uppercase">Administrator</Badge>;
            case 'doctor': return <Badge className="bg-primary/10 text-primary border-primary/20 rounded-md text-[9px] font-black uppercase">Medical Doctor</Badge>;
            case 'nurse': return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 rounded-md text-[9px] font-black uppercase">Clinical Staff</Badge>;
            case 'patient': return <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 rounded-md text-[9px] font-black uppercase">Patient Node</Badge>;
            default: return <Badge variant="secondary">{role}</Badge>;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
                        <Users size={30} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter uppercase mb-0.5">Directory Authorization</h1>
                        <p className="text-muted-foreground text-xs font-bold tracking-[0.15em] uppercase opacity-60 italic">Platform IAM Controller • Keycloak Provisioning</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input
                            placeholder="Find directory object..."
                            className="h-11 pl-10 bg-secondary/30 border-border/50 rounded-xl text-xs font-medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button className="h-11 rounded-xl font-bold bg-primary hover:bg-primary/90 px-6 gap-2">
                        <UserPlus size={18} /> Provision User
                    </Button>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex bg-secondary/20 p-1.5 rounded-xl border border-border/40 w-fit">
                {['all', 'admin', 'doctor', 'nurse', 'patient'].map((r) => (
                    <button
                        key={r}
                        onClick={() => setRoleFilter(r)}
                        className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${roleFilter === r ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        {r}
                    </button>
                ))}
            </div>

            {/* Users Table */}
            <Card className="border-border/50 bg-card shadow-none rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border/10 bg-secondary/5">
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Identity Entity</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Authorization</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Security Level</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">Last Auth</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/5 font-sans">
                            {loading ? (
                                [1, 2, 3].map(i => <tr key={i} className="animate-pulse h-16"><td colSpan={5} className="bg-secondary/10"></td></tr>)
                            ) : filteredUsers.map((user) => (
                                <tr key={user.id} className="group hover:bg-secondary/10 transition-all cursor-pointer">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground border border-border/20 group-hover:border-primary/30 transition-all">
                                                <Users size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold tracking-tight mb-0.5">{user.name}</p>
                                                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground opacity-60 font-mono">
                                                    <Mail size={10} /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col gap-1.5">
                                            {getRoleBadge(user.role)}
                                            <div className="flex items-center gap-1.5">
                                                <div className={`h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-destructive'}`} />
                                                <span className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">{user.status}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((lvl) => (
                                                <div
                                                    key={lvl}
                                                    className={`h-1.5 w-4 rounded-full transition-all ${lvl <= user.securityLevel ? 'bg-primary' : 'bg-border/30'}`}
                                                />
                                            ))}
                                            <span className="ml-2 text-[10px] font-black font-mono text-primary">SC-0{user.securityLevel}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/60 font-mono capitalize">
                                            <Calendar size={12} /> {user.lastLogin}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground hover:bg-secondary">
                                                    <MoreVertical size={16} />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-56 bg-card border-border shadow-2xl p-1 z-[100]">
                                                <div className="px-2 py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 border-b border-border/10 mb-1">Authorization Controls</div>
                                                <DropdownMenuItem className="gap-2.5 px-3 py-2.5 text-xs font-bold transition-all hover:bg-secondary cursor-pointer">
                                                    <Settings2 size={14} className="text-primary" /> Edit IAM Profiles
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="gap-2.5 px-3 py-2.5 text-xs font-bold transition-all hover:bg-secondary cursor-pointer">
                                                    <ShieldCheck size={14} className="text-emerald-500" /> Security Audit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator className="bg-border/10" />
                                                <DropdownMenuItem
                                                    onClick={() => toggleStatus(user.id)}
                                                    className={`gap-2.5 px-3 py-2.5 text-xs font-bold transition-all hover:bg-secondary cursor-pointer ${user.status === 'active' ? 'text-destructive' : 'text-emerald-500'}`}
                                                >
                                                    {user.status === 'active' ? <Lock size={14} /> : <Unlock size={14} />}
                                                    {user.status === 'active' ? 'Suspend Access' : 'Reactivate Entity'}
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="flex items-center justify-between text-[10px] font-black tracking-[0.3em] uppercase opacity-30 pt-4 border-t border-border/10">
                <span className="flex items-center gap-2">
                    <Loader2 className="animate-spin text-primary" size={12} /> Syncing with Keycloak Master Hub
                </span>
                <span>ISO 27001 IDENTITY GOVERNANCE ACTIVE</span>
            </div>
        </div>
    );
};

export default UserManagement;
