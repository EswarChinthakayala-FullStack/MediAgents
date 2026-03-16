import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requiredRole }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-xs font-black uppercase tracking-widest opacity-40">Verifying Identity...</p>
            </div>
        );
    }

    if (!user) {
        // Redirect to login but save the current location
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        if (!roles.includes(user.role)) {
            // User is logged in but doesn't have the right role
            const target = user.role === 'admin' ? '/admin' :
                ['doctor', 'nurse', 'dentist'].includes(user.role) ? '/clinical' :
                    '/portal';
            return <Navigate to={target} replace />;
        }
    }

    return children;
};

export default ProtectedRoute;
