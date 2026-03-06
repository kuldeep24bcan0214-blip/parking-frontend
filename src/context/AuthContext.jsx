import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialise from localStorage on first load
    useEffect(() => {
        const stored = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (stored && token) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    }, []);

    const login = useCallback(async (email, password) => {
        const res = await authAPI.login({ email, password });
        const { token, user: userData } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    }, []);

    const register = useCallback(async (formData) => {
        const res = await authAPI.register(formData);
        const { token, user: userData } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        toast.success('Logged out successfully');
    }, []);

    const updateUser = useCallback((updated) => {
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
    }, []);

    const isAdmin = user?.role === 'admin';
    const isStaff = user?.role === 'staff';
    const isUser = user?.role === 'user';

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, isAdmin, isStaff, isUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};

export default AuthContext;
