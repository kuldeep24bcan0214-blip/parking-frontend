import { useState, useEffect } from 'react';
import { bookingsAPI, slotsAPI, logsAPI } from '../services/api';
import { Car, Clock, CheckCircle, AlertTriangle, LogIn, LogOut, Eye, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const mockBookings = [
    { _id: 'b1', slot: { slotNumber: 'A-01', zone: 'A' }, user: { name: 'Rahul Sharma', email: 'rahul@campus.edu' }, vehicleNumber: 'MH 01 AB 1234', startTime: new Date(Date.now() - 3600000).toISOString(), status: 'active' },
    { _id: 'b2', slot: { slotNumber: 'B-02', zone: 'B' }, user: { name: 'Priya Patel', email: 'priya@campus.edu' }, vehicleNumber: 'GJ 05 CD 5678', startTime: new Date(Date.now() - 7200000).toISOString(), status: 'checked_in' },
    { _id: 'b3', slot: { slotNumber: 'C-01', zone: 'C' }, user: { name: 'Arjun Singh', email: 'arjun@campus.edu' }, vehicleNumber: 'DL 10 EF 9012', startTime: new Date(Date.now() - 1800000).toISOString(), status: 'active' },
];
const mockLogs = [
    { _id: 'l1', slot: { slotNumber: 'A-03' }, user: { name: 'Niti Kumar' }, vehicleNumber: 'MH 12 GH 3456', action: 'check_out', timestamp: new Date(Date.now() - 900000).toISOString(), duration: 3, amount: 60 },
    { _id: 'l2', slot: { slotNumber: 'D-01' }, user: { name: 'Sneha Roy' }, vehicleNumber: 'WB 02 IJ 7890', action: 'check_in', timestamp: new Date(Date.now() - 3600000).toISOString(), duration: null, amount: null },
];

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="stat-card p-5">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                <p className="text-3xl font-bold text-white">{value}</p>
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={22} style={{ color }} />
            </div>
        </div>
    </div>
);

const StaffDashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [activeTab, setActiveTab] = useState('bookings');

    useEffect(() => {
        Promise.all([
            bookingsAPI.getAll().catch(() => ({ data: mockBookings })),
            logsAPI.getAll().catch(() => ({ data: mockLogs })),
        ]).then(([bkRes, lgRes]) => {
            setBookings(bkRes.data?.bookings || bkRes.data || mockBookings);
            setLogs(lgRes.data?.logs || lgRes.data || mockLogs);
        }).finally(() => setLoading(false));
    }, []);

    const handleCheckIn = async (id) => {
        setActionLoading(id + 'in');
        try {
            await bookingsAPI.checkIn(id);
            setBookings((b) => b.map((x) => x._id === id ? { ...x, status: 'checked_in' } : x));
            toast.success('Vehicle checked in ✅');
        } catch {
            setBookings((b) => b.map((x) => x._id === id ? { ...x, status: 'checked_in' } : x));
            toast.success('Check-in recorded (demo)');
        } finally {
            setActionLoading(null);
        }
    };

    const handleCheckOut = async (id) => {
        setActionLoading(id + 'out');
        try {
            await bookingsAPI.checkOut(id);
            setBookings((b) => b.map((x) => x._id === id ? { ...x, status: 'completed' } : x));
            toast.success('Vehicle checked out 🚗');
        } catch {
            setBookings((b) => b.map((x) => x._id === id ? { ...x, status: 'completed' } : x));
            toast.success('Check-out recorded (demo)');
        } finally {
            setActionLoading(null);
        }
    };

    const active = bookings.filter((b) => b.status === 'active').length;
    const checkedIn = bookings.filter((b) => b.status === 'checked_in').length;
    const completed = bookings.filter((b) => b.status === 'completed').length;

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Staff Dashboard</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Manage vehicle check-ins and check-outs
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Active Bookings" value={active} icon={Clock} color="#fbbf24" />
                <StatCard label="Checked In" value={checkedIn} icon={CheckCircle} color="#22c55e" />
                <StatCard label="Completed Today" value={completed} icon={Car} color="#818cf8" />
                <StatCard label="Total Logs" value={logs.length} icon={Eye} color="#0ea5e9" />
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: 'rgba(30,41,59,0.8)', border: '1px solid var(--card-border)' }}>
                {[['bookings', 'Booked Slots'], ['checkin', 'Check-In/Out'], ['logs', 'Parking Logs']].map(([key, label]) => (
                    <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === key ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            {/* Bookings table */}
            {activeTab === 'bookings' && (
                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr><th>Slot</th><th>User</th><th>Vehicle</th><th>Since</th><th>Status</th><th>Action</th></tr>
                            </thead>
                            <tbody>
                                {bookings.map((b) => (
                                    <tr key={b._id}>
                                        <td className="font-bold">{b.slot?.slotNumber}</td>
                                        <td>
                                            <p className="font-medium text-white">{b.user?.name}</p>
                                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{b.user?.email}</p>
                                        </td>
                                        <td>{b.vehicleNumber}</td>
                                        <td>{new Date(b.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                                        <td><span className={`badge badge-${b.status === 'checked_in' ? 'occupied' : b.status === 'completed' ? 'available' : 'booked'}`}>{b.status}</span></td>
                                        <td>
                                            {b.status === 'active' && (
                                                <button onClick={() => handleCheckIn(b._id)} disabled={actionLoading === b._id + 'in'} className="btn-success px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
                                                    <LogIn size={13} /> Check In
                                                </button>
                                            )}
                                            {b.status === 'checked_in' && (
                                                <button onClick={() => handleCheckOut(b._id)} disabled={actionLoading === b._id + 'out'} className="btn-danger px-3 py-1.5 rounded-lg text-xs flex items-center gap-1">
                                                    <LogOut size={13} /> Check Out
                                                </button>
                                            )}
                                            {b.status === 'completed' && <span className="text-xs" style={{ color: '#22c55e' }}>Done ✓</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Check-in / Check-out panel */}
            {activeTab === 'checkin' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bookings.filter((b) => ['active', 'checked_in'].includes(b.status)).map((b) => (
                        <div key={b._id} className="glow-card rounded-2xl p-5">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-bold text-white text-lg">Slot {b.slot?.slotNumber}</h3>
                                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{b.user?.name} · {b.vehicleNumber}</p>
                                </div>
                                <span className={`badge badge-${b.status === 'checked_in' ? 'occupied' : 'booked'}`}>{b.status}</span>
                            </div>
                            <p className="text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                                Booked at: {new Date(b.startTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                            </p>
                            <div className="flex gap-3">
                                {b.status === 'active' && (
                                    <button onClick={() => handleCheckIn(b._id)} className="btn-success flex-1 py-2 rounded-xl text-sm flex items-center justify-center gap-2">
                                        <LogIn size={16} /> Check In
                                    </button>
                                )}
                                {b.status === 'checked_in' && (
                                    <button onClick={() => handleCheckOut(b._id)} className="btn-danger flex-1 py-2 rounded-xl text-sm flex items-center justify-center gap-2">
                                        <LogOut size={16} /> Check Out
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Logs */}
            {activeTab === 'logs' && (
                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr><th>Slot</th><th>User</th><th>Vehicle</th><th>Action</th><th>Time</th><th>Duration</th><th>Amount</th></tr>
                            </thead>
                            <tbody>
                                {logs.map((l) => (
                                    <tr key={l._id}>
                                        <td className="font-bold">{l.slot?.slotNumber}</td>
                                        <td>{l.user?.name}</td>
                                        <td>{l.vehicleNumber}</td>
                                        <td>
                                            <span className={`badge ${l.action === 'check_in' ? 'badge-booked' : 'badge-available'}`}>
                                                {l.action === 'check_in' ? '↗ Check In' : '↙ Check Out'}
                                            </span>
                                        </td>
                                        <td>{new Date(l.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                                        <td>{l.duration ? `${l.duration}h` : '—'}</td>
                                        <td>{l.amount ? `₹${l.amount}` : '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffDashboard;
