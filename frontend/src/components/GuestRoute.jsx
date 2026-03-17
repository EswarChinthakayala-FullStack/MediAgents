import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const GuestRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-xs font-black uppercase tracking-widest opacity-40">Loading Swarm Intelligence...</p>
            </div>
        );
    }

    if (user) {
        // Redirect to their respective dashboard
        const target = user.role === 'admin' ? '/admin' :
            ['doctor', 'nurse', 'dentist'].includes(user.role) ? '/clinical' :
                '/portal';
        return <Navigate to={target} replace />;
    }

    return children;
};

export default GuestRoute;
