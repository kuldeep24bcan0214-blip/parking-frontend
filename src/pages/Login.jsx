import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) {
            setError('Please fill in all fields.');
            return;
        }
        setLoading(true);
        try {
            const user = await login(form.email, form.password);
            toast.success(`Welcome back, ${user.name}!`);
            const dashMap = { admin: '/admin', staff: '/staff', user: '/dashboard' };
            navigate(dashMap[user.role] || '/dashboard', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ background: 'radial-gradient(ellipse at top left, rgba(99,102,241,0.15) 0%, var(--dark-bg) 60%)' }}
        >
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-5" style={{ background: '#6366f1' }} />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-5" style={{ background: '#0ea5e9' }} />
            </div>

            <div className="w-full max-w-md relative">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                    >
                        <Car size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Sign in to SmartPark Campus System
                    </p>
                </div>

                {/* Card */}
                <div
                    className="rounded-2xl p-8"
                    style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
                >
                    {error && (
                        <div
                            className="flex items-center gap-3 rounded-xl px-4 py-3 mb-6 text-sm"
                            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
                        >
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Demo credentials */}
                        <div
                            className="rounded-xl p-3 text-xs space-y-1"
                            style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}
                        >
                            <p className="font-semibold" style={{ color: '#818cf8' }}>Demo Credentials</p>
                            <p style={{ color: 'var(--text-secondary)' }}>Admin: admin@campus.edu</p>
                            <p style={{ color: 'var(--text-secondary)' }}>Staff: staff@campus.edu</p>
                            <p style={{ color: 'var(--text-secondary)' }}>User: user@campus.edu</p>
                            <p style={{ color: 'var(--text-secondary)' }}>Password: password123</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-300">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    id="login-email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@campus.edu"
                                    className="form-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                                    autoComplete="email"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-300">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    id="login-password"
                                    type={showPass ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="form-input w-full pl-10 pr-10 py-3 rounded-xl text-sm"
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Signing in...
                                </>
                            ) : 'Sign In'}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium" style={{ color: '#818cf8' }}>
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
