import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsAPI, slotsAPI } from '../services/api';
import SlotCard from '../components/SlotCard';
import {
    Car, Clock, CheckCircle, DollarSign, TrendingUp, Calendar,
    ArrowRight, AlertCircle, XCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ─── Mock data for demo when API is unavailable ──────────────
const mockSlots = [
    { _id: '1', slotNumber: 'A-01', zone: 'A', floor: 1, status: 'available', pricePerHour: 20, vehicleType: '4-wheeler' },
    { _id: '2', slotNumber: 'A-02', zone: 'A', floor: 1, status: 'booked', pricePerHour: 20, vehicleType: '4-wheeler' },
    { _id: '3', slotNumber: 'B-01', zone: 'B', floor: 2, status: 'available', pricePerHour: 15, vehicleType: '2-wheeler' },
    { _id: '4', slotNumber: 'B-02', zone: 'B', floor: 2, status: 'occupied', pricePerHour: 15, vehicleType: '2-wheeler' },
    { _id: '5', slotNumber: 'C-01', zone: 'C', floor: 3, status: 'available', pricePerHour: 25, vehicleType: '4-wheeler' },
    { _id: '6', slotNumber: 'C-02', zone: 'C', floor: 3, status: 'maintenance', pricePerHour: 25, vehicleType: '4-wheeler' },
];

const mockActiveBooking = {
    _id: 'bk001',
    slot: { slotNumber: 'A-01', zone: 'A', pricePerHour: 20 },
    startTime: new Date(Date.now() - 3600000).toISOString(),
    status: 'active',
    vehicleNumber: 'MH 01 AB 1234',
};

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
    <div className="stat-card p-5">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
                {sub && <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{sub}</p>}
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={22} style={{ color }} />
            </div>
        </div>
    </div>
);

const UserDashboard = () => {
    const { user } = useAuth();
    const [slots, setSlots] = useState([]);
    const [activeBooking, setActiveBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [useMock, setUseMock] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [slotsRes, activeRes] = await Promise.all([
                    slotsAPI.getAvailable(),
                    bookingsAPI.getActiveBooking(),
                ]);
                setSlots(slotsRes.data?.slots || slotsRes.data || []);
                setActiveBooking(activeRes.data?.booking || activeRes.data || null);
            } catch {
                // Use mock data when API unavailable
                setUseMock(true);
                setSlots(mockSlots);
                setActiveBooking(mockActiveBooking);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleCancel = async () => {
        if (!activeBooking) return;
        setCancelLoading(true);
        try {
            if (!useMock) await bookingsAPI.cancel(activeBooking._id);
            setActiveBooking(null);
            toast.success('Booking cancelled successfully');
        } catch {
            toast.error('Failed to cancel booking');
        } finally {
            setCancelLoading(false);
        }
    };

    const availableCount = slots.filter((s) => s.status === 'available').length;
    const occupiedCount = slots.filter((s) => s.status === 'occupied').length;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">
                        Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
                        <span style={{ color: '#818cf8' }}>{user?.name?.split(' ')[0]} 👋</span>
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                {useMock && (
                    <div
                        className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
                        style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', color: '#fbbf24' }}
                    >
                        <AlertCircle size={14} />
                        Demo mode – API not connected
                    </div>
                )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={Car} label="Available Slots" value={availableCount} color="#22c55e" sub="Right now" />
                <StatCard icon={Clock} label="Occupied Slots" value={occupiedCount} color="#fb923c" sub="Currently in use" />
                <StatCard icon={CheckCircle} label="Your Bookings" value={activeBooking ? 1 : 0} color="#818cf8" sub="Active today" />
                <StatCard icon={DollarSign} label="Total Spent" value="₹240" color="#0ea5e9" sub="This month" />
            </div>

            {/* Active Booking Banner */}
            {activeBooking ? (
                <div
                    className="rounded-2xl p-6"
                    style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.1))', border: '1px solid rgba(99,102,241,0.3)' }}
                >
                    <div className="flex items-start justify-between flex-wrap gap-4">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#22c55e' }} />
                                <span className="text-sm font-semibold" style={{ color: '#22c55e' }}>Active Booking</span>
                            </div>
                            <h3 className="text-xl font-bold text-white">Slot {activeBooking.slot?.slotNumber}</h3>
                            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                                Zone {activeBooking.slot?.zone} · Vehicle: {activeBooking.vehicleNumber}
                            </p>
                            <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                                Started: {new Date(activeBooking.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                        <button
                            onClick={handleCancel}
                            disabled={cancelLoading}
                            className="btn-danger px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
                        >
                            {cancelLoading ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : <XCircle size={16} />}
                            Cancel Booking
                        </button>
                    </div>
                </div>
            ) : (
                <div
                    className="rounded-2xl p-6 text-center"
                    style={{ background: 'var(--card-bg)', border: '1px dashed var(--card-border)' }}
                >
                    <Car size={40} className="mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
                    <p className="font-semibold text-white">No Active Booking</p>
                    <p className="text-sm mt-1 mb-4" style={{ color: 'var(--text-secondary)' }}>
                        Book a parking slot to get started
                    </p>
                    <Link to="/booking" className="btn-primary px-6 py-2.5 rounded-xl text-sm inline-flex items-center gap-2">
                        <Car size={16} /> Book a Slot
                    </Link>
                </div>
            )}

            {/* Available Slots Grid */}
            <div>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-bold text-white">Available Parking Slots</h2>
                    <Link to="/booking" className="text-sm flex items-center gap-1" style={{ color: '#818cf8' }}>
                        View all slots <ArrowRight size={14} />
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {slots.slice(0, 8).map((slot) => (
                        <SlotCard
                            key={slot._id}
                            slot={slot}
                            onBook={(s) => window.location.href = `/booking?slot=${s._id}`}
                            showActions={true}
                        />
                    ))}
                </div>
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { to: '/booking', label: 'Book Slot', icon: Car, color: '#6366f1' },
                    { to: '/my-bookings', label: 'My Bookings', icon: Calendar, color: '#0ea5e9' },
                    { to: '/history', label: 'History', icon: Clock, color: '#8b5cf6' },
                    { to: '/billing', label: 'Billing', icon: DollarSign, color: '#22c55e' },
                ].map(({ to, label, icon: Icon, color }) => (
                    <Link
                        key={to}
                        to={to}
                        className="glow-card rounded-xl p-4 flex flex-col items-center text-center gap-2"
                    >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                            <Icon size={20} style={{ color }} />
                        </div>
                        <span className="text-sm font-medium text-white">{label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default UserDashboard;
