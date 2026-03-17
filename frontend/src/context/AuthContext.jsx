import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('clinic_ai_token'));
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('clinic_ai_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });
    const [loading, setLoading] = useState(!user && !!token);

    useEffect(() => {
        const validateToken = async () => {
            if (token) {
                try {
                    const base64Url = token.split('.')[1];
                    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                    }).join(''));

                    const decoded = JSON.parse(jsonPayload);

                    // Check expiry
                    if (decoded.exp * 1000 < Date.now()) {
                        logout();
                    } else if (!user) {
                        // If user is not set but token is valid (this shouldn't happen much with our new init)
                        const userData = {
                            id: decoded.user_id,
                            role: decoded.role,
                            email: decoded.email
                        };
                        setUser(userData);
                        localStorage.setItem('clinic_ai_user', JSON.stringify(userData));
                    }
                } catch (e) {
                    console.error("Invalid token", e);
                    logout();
                }
            }
            setLoading(false);
        };

        validateToken();
    }, [token]);

    const login = async (email, password, useKeycloak = false) => {
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, use_keycloak: useKeycloak })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('clinic_ai_token', data.token);
                localStorage.setItem('clinic_ai_user', JSON.stringify(data.user));
                setToken(data.token);
                setUser(data.user);
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Login failed' };
            }
        } catch (err) {
            return { success: false, error: 'Connection error' };
        }
    };

    const logout = () => {
        localStorage.removeItem('clinic_ai_token');
        localStorage.removeItem('clinic_ai_user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
