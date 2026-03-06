import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Car, Mail, Lock, User, Eye, EyeOff, AlertCircle, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '', email: '', phone: '', password: '', confirmPassword: '', vehicleNumber: '',
    });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
            setError('Name, email and password are required.');
            return;
        }
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            const { confirmPassword, ...payload } = form;
            const user = await register(payload);
            toast.success('Account created! Welcome to SmartPark 🎉');
            navigate('/dashboard', { replace: true });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fields = [
        { name: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'John Doe' },
        { name: 'email', label: 'Email Address', type: 'email', icon: Mail, placeholder: 'you@campus.edu' },
        { name: 'phone', label: 'Phone Number', type: 'tel', icon: Phone, placeholder: '+91 9876543210' },
        { name: 'vehicleNumber', label: 'Vehicle Number', type: 'text', icon: Car, placeholder: 'MH 12 AB 1234' },
    ];

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ background: 'radial-gradient(ellipse at top right, rgba(14,165,233,0.12) 0%, var(--dark-bg) 60%)' }}
        >
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-5" style={{ background: '#8b5cf6' }} />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-5" style={{ background: '#0ea5e9' }} />
            </div>

            <div className="w-full max-w-md relative">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: 'linear-gradient(135deg, #0ea5e9, #6366f1)' }}
                    >
                        <Car size={32} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white">Create Account</h1>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
                        Join SmartPark Campus Parking System
                    </p>
                </div>

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

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fields.map(({ name, label, type, icon: Icon, placeholder }) => (
                            <div key={name}>
                                <label className="block text-sm font-medium mb-2 text-slate-300">{label}</label>
                                <div className="relative">
                                    <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                    <input
                                        id={`register-${name}`}
                                        type={type}
                                        name={name}
                                        value={form[name]}
                                        onChange={handleChange}
                                        placeholder={placeholder}
                                        className="form-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                                    />
                                </div>
                            </div>
                        ))}

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-300">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    id="register-password"
                                    type={showPass ? 'text' : 'password'}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Min 6 characters"
                                    className="form-input w-full pl-10 pr-10 py-3 rounded-xl text-sm"
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

                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-300">Confirm Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    id="register-confirm-password"
                                    type={showPass ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter password"
                                    className="form-input w-full pl-10 pr-4 py-3 rounded-xl text-sm"
                                />
                            </div>
                        </div>

                        <button
                            id="register-submit"
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating Account...
                                </>
                            ) : 'Create Account'}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium" style={{ color: '#818cf8' }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
