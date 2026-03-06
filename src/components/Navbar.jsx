import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Car, Bell, User, LogOut, Menu, X, ChevronDown,
} from 'lucide-react';

const Navbar = ({ onMenuClick }) => {
    const { user, logout, isAdmin, isStaff } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const roleBadgeColor = isAdmin
        ? 'badge-admin'
        : isStaff
            ? 'badge-staff'
            : 'badge-user';

    return (
        <nav
            className="glass sticky top-0 z-50"
            style={{ borderBottom: '1px solid var(--card-border)', borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}
        >
            <div className="flex items-center justify-between px-4 py-3">
                {/* Left: Hamburger + Logo */}
                <div className="flex items-center gap-3">
                    {user && (
                        <button
                            onClick={onMenuClick}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
                            aria-label="Toggle sidebar"
                        >
                            <Menu size={20} className="text-slate-300" />
                        </button>
                    )}
                    <Link to="/" className="flex items-center gap-2">
                        <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                        >
                            <Car size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-white text-lg hidden sm:block">
                            Smart<span style={{ color: '#818cf8' }}>Park</span>
                        </span>
                    </Link>
                </div>

                {/* Right: user menu */}
                {user ? (
                    <div className="flex items-center gap-3">
                        <button className="p-2 rounded-lg hover:bg-white/10 transition-colors relative" aria-label="Notifications">
                            <Bell size={18} className="text-slate-400" />
                            <span
                                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                                style={{ background: '#ef4444' }}
                            />
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-all"
                            >
                                <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                                >
                                    {user.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
                                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                                        <span className={`badge ${roleBadgeColor}`}>{user.role}</span>
                                    </p>
                                </div>
                                <ChevronDown size={14} className="text-slate-400" />
                            </button>

                            {dropdownOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden shadow-2xl"
                                    style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', zIndex: 100 }}
                                >
                                    <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--card-border)' }}>
                                        <p className="text-sm font-semibold text-white">{user.name}</p>
                                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                                    </div>
                                    <button
                                        onClick={() => { setDropdownOpen(false); handleLogout(); }}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-red-500/10 transition-colors"
                                        style={{ color: '#f87171' }}
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link to="/login" className="btn-secondary px-4 py-2 rounded-lg text-sm">Login</Link>
                        <Link
                            to="/register"
                            className="btn-primary px-4 py-2 rounded-lg text-sm"
                        >
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
