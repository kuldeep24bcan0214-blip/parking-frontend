import { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import { Calendar, Car, Clock, XCircle, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const mockBookings = [
    { _id: 'b1', slot: { slotNumber: 'A-01', zone: 'A' }, startTime: new Date(Date.now() - 7200000).toISOString(), endTime: new Date(Date.now() + 3600000).toISOString(), status: 'active', vehicleNumber: 'MH 01 AB 1234', totalAmount: 40 },
    { _id: 'b2', slot: { slotNumber: 'B-02', zone: 'B' }, startTime: new Date(Date.now() - 86400000).toISOString(), endTime: new Date(Date.now() - 79200000).toISOString(), status: 'completed', vehicleNumber: 'MH 01 AB 1234', totalAmount: 30 },
    { _id: 'b3', slot: { slotNumber: 'C-01', zone: 'C' }, startTime: new Date(Date.now() - 172800000).toISOString(), endTime: null, status: 'cancelled', vehicleNumber: 'MH 01 AB 1234', totalAmount: 0 },
];

const StatusIcon = ({ status }) => {
    const map = {
        active: <CheckCircle size={16} style={{ color: '#22c55e' }} />,
        completed: <CheckCircle size={16} style={{ color: '#818cf8' }} />,
        cancelled: <XCircle size={16} style={{ color: '#f87171' }} />,
    };
    return map[status] || null;
};

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelId, setCancelId] = useState(null);

    useEffect(() => {
        bookingsAPI.getMyBookings()
            .then((res) => setBookings(res.data?.bookings || res.data || []))
            .catch(() => setBookings(mockBookings))
            .finally(() => setLoading(false));
    }, []);

    const handleCancel = async (id) => {
        setCancelId(id);
        try {
            await bookingsAPI.cancel(id);
            setBookings((b) => b.map((x) => x._id === id ? { ...x, status: 'cancelled' } : x));
            toast.success('Booking cancelled');
        } catch {
            // mock mode
            setBookings((b) => b.map((x) => x._id === id ? { ...x, status: 'cancelled' } : x));
            toast.success('Booking cancelled (demo)');
        } finally {
            setCancelId(null);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">My Bookings</h1>
            {bookings.length === 0 ? (
                <div className="text-center py-16">
                    <Calendar size={48} className="mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
                    <p className="font-semibold text-white">No bookings yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((b) => (
                        <div key={b._id} className="glow-card rounded-2xl p-5">
                            <div className="flex items-start justify-between flex-wrap gap-4">
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                        style={{ background: 'rgba(99,102,241,0.15)' }}
                                    >
                                        <Car size={22} style={{ color: '#818cf8' }} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold text-white">Slot {b.slot?.slotNumber}</h3>
                                            <StatusIcon status={b.status} />
                                        </div>
                                        <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                                            Zone {b.slot?.zone} · Vehicle: {b.vehicleNumber}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                                            <span className="flex items-center gap-1">
                                                <Clock size={12} />
                                                {new Date(b.startTime).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                                            </span>
                                            {b.endTime && (
                                                <span>→ {new Date(b.endTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {b.totalAmount > 0 && (
                                        <span className="text-sm font-bold text-white">₹{b.totalAmount}</span>
                                    )}
                                    <span className={`badge badge-${b.status}`}>{b.status}</span>
                                    {b.status === 'active' && (
                                        <button
                                            onClick={() => handleCancel(b._id)}
                                            disabled={cancelId === b._id}
                                            className="btn-danger px-3 py-1.5 rounded-lg text-xs flex items-center gap-1"
                                        >
                                            {cancelId === b._id ? (
                                                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                                            ) : <XCircle size={12} />}
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
