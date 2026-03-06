import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard, Car, CalendarCheck, History, CreditCard,
    Users, Settings, BarChart3, DollarSign, Shield, LogOut,
    ClipboardList, CheckSquare, X,
} from 'lucide-react';

const navItems = {
    user: [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/booking', icon: Car, label: 'Book a Slot' },
        { to: '/my-bookings', icon: CalendarCheck, label: 'My Bookings' },
        { to: '/history', icon: History, label: 'Booking History' },
        { to: '/billing', icon: CreditCard, label: 'Billing' },
    ],
    staff: [
        { to: '/staff', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/staff/bookings', icon: ClipboardList, label: 'Booked Slots' },
        { to: '/staff/checkin', icon: CheckSquare, label: 'Check-In / Out' },
        { to: '/staff/slots', icon: Car, label: 'Slot Status' },
        { to: '/staff/logs', icon: History, label: 'Parking Logs' },
    ],
    admin: [
        { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/users', icon: Users, label: 'Users' },
        { to: '/admin/staff', icon: Shield, label: 'Staff Accounts' },
        { to: '/admin/slots', icon: Car, label: 'Slot Management' },
        { to: '/admin/pricing', icon: DollarSign, label: 'Pricing' },
        { to: '/admin/revenue', icon: BarChart3, label: 'Revenue' },
        { to: '/admin/analytics', icon: Settings, label: 'Analytics' },
    ],
};

const Sidebar = ({ open, onClose }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const items = navItems[user.role] || [];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <>
            {/* Backdrop */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar panel */}
            <aside
                className="fixed top-0 left-0 h-full z-50 flex flex-col"
                style={{
                    width: '256px',
                    background: 'rgba(15, 23, 42, 0.97)',
                    borderRight: '1px solid var(--card-border)',
                    backdropFilter: 'blur(20px)',
                    transform: open ? 'translateX(0)' : 'translateX(-100%)',
                    transition: 'transform 0.3s ease',
                }}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-5"
                    style={{ borderBottom: '1px solid var(--card-border)' }}
                >
                    <div className="flex items-center gap-3">
                        <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                        >
                            <Car size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-white text-sm">SmartPark</p>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Campus Parking</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        <X size={16} className="text-slate-400" />
                    </button>
                </div>

                {/* User info */}
                <div className="px-4 py-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.1)' }}>
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                        >
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                            <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
                    <p
                        className="text-xs font-semibold uppercase tracking-wider px-3 mb-3"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        {user.role === 'admin' ? 'Administration' : user.role === 'staff' ? 'Staff Panel' : 'My Parking'}
                    </p>
                    {items.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={to === '/dashboard' || to === '/staff' || to === '/admin'}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `sidebar-link flex items-center gap-3 px-3 py-2.5 text-sm font-medium ${isActive ? 'active' : ''}`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4" style={{ borderTop: '1px solid var(--card-border)' }}>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-red-500/10"
                        style={{ color: '#f87171' }}
                    >
                        <LogOut size={18} />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
