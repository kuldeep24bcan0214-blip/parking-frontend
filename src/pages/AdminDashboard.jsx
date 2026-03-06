import { useState, useEffect } from 'react';
import { usersAPI, slotsAPI, revenueAPI } from '../services/api';
import {
    Users, Car, DollarSign, TrendingUp, BarChart3, Shield,
    Plus, Edit2, Trash2, MoreVertical, CheckCircle, AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const mockStats = { totalUsers: 128, totalSlots: 48, availableSlots: 22, totalRevenue: 84500, todayRevenue: 3200, totalBookings: 452 };
const mockUsers = [
    { _id: 'u1', name: 'Rahul Sharma', email: 'rahul@campus.edu', role: 'user', vehicleNumber: 'MH 01 AB 1234', createdAt: new Date(Date.now() - 86400000 * 7).toISOString() },
    { _id: 'u2', name: 'Priya Patel', email: 'priya@campus.edu', role: 'staff', vehicleNumber: 'GJ 05 CD 5678', createdAt: new Date(Date.now() - 86400000 * 14).toISOString() },
    { _id: 'u3', name: 'Arjun Singh', email: 'arjun@campus.edu', role: 'admin', vehicleNumber: 'DL 10 EF 9012', createdAt: new Date(Date.now() - 86400000 * 30).toISOString() },
    { _id: 'u4', name: 'Niti Kumar', email: 'niti@campus.edu', role: 'user', vehicleNumber: 'MH 12 GH 3456', createdAt: new Date(Date.now() - 86400000 * 3).toISOString() },
];

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
    <div className="stat-card p-5">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
                {sub && <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={22} style={{ color }} />
            </div>
        </div>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(mockStats);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [roleLoading, setRoleLoading] = useState(null);

    useEffect(() => {
        Promise.all([
            usersAPI.getAll().catch(() => ({ data: mockUsers })),
            revenueAPI.getSummary().catch(() => ({ data: mockStats })),
        ]).then(([usersRes, statsRes]) => {
            setUsers(usersRes.data?.users || usersRes.data || mockUsers);
            if (statsRes.data && typeof statsRes.data === 'object') setStats({ ...mockStats, ...statsRes.data });
        }).finally(() => setLoading(false));
    }, []);

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this user?')) return;
        try {
            await usersAPI.delete(id);
            setUsers((u) => u.filter((x) => x._id !== id));
            toast.success('User deleted');
        } catch {
            setUsers((u) => u.filter((x) => x._id !== id));
            toast.success('User deleted (demo)');
        }
    };

    const handleRoleChange = async (id, role) => {
        setRoleLoading(id);
        try {
            await usersAPI.changeRole(id, role);
            setUsers((u) => u.map((x) => x._id === id ? { ...x, role } : x));
            toast.success('Role updated');
        } catch {
            setUsers((u) => u.map((x) => x._id === id ? { ...x, role } : x));
            toast.success('Role updated (demo)');
        } finally {
            setRoleLoading(null);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Manage the entire campus parking system
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="#818cf8" />
                <StatCard label="Total Slots" value={stats.totalSlots} icon={Car} color="#0ea5e9" />
                <StatCard label="Available" value={stats.availableSlots} icon={CheckCircle} color="#22c55e" />
                <StatCard label="Bookings" value={stats.totalBookings} icon={BarChart3} color="#fbbf24" />
                <StatCard label="Today's Revenue" value={`₹${stats.todayRevenue?.toLocaleString()}`} icon={TrendingUp} color="#f97316" />
                <StatCard label="Total Revenue" value={`₹${(stats.totalRevenue / 1000).toFixed(1)}K`} icon={DollarSign} color="#a78bfa" />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { to: '/admin/slots', label: 'Manage Slots', icon: Car, color: '#6366f1' },
                    { to: '/admin/users', label: 'All Users', icon: Users, color: '#0ea5e9' },
                    { to: '/admin/staff', label: 'Staff Accounts', icon: Shield, color: '#8b5cf6' },
                    { to: '/admin/revenue', label: 'Revenue Report', icon: BarChart3, color: '#22c55e' },
                ].map(({ to, label, icon: Icon, color }) => (
                    <Link key={to} to={to} className="glow-card rounded-xl p-4 flex flex-col items-center text-center gap-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                            <Icon size={20} style={{ color }} />
                        </div>
                        <span className="text-sm font-medium text-white">{label}</span>
                    </Link>
                ))}
            </div>

            {/* User table */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <h2 className="font-semibold text-white">Recent Users</h2>
                    <Link to="/admin/users" className="text-sm" style={{ color: '#818cf8' }}>View all →</Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr><th>User</th><th>Vehicle</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                                            >
                                                {u.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-white">{u.name}</p>
                                                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td>{u.vehicleNumber || '—'}</td>
                                    <td>
                                        <select
                                            value={u.role}
                                            disabled={roleLoading === u._id}
                                            onChange={(e) => handleRoleChange(u._id, e.target.value)}
                                            className="text-xs px-2 py-1 rounded-lg font-semibold"
                                            style={{ background: 'var(--dark-bg)', border: '1px solid var(--card-border)', color: u.role === 'admin' ? '#f87171' : u.role === 'staff' ? '#38bdf8' : '#818cf8' }}
                                        >
                                            <option value="user">User</option>
                                            <option value="staff">Staff</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteUser(u._id)}
                                            className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                                            style={{ color: '#f87171' }}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
