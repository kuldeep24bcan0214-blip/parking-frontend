import { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import { History, Car, Clock, Search } from 'lucide-react';

const mockHistory = [
    { _id: 'h1', slot: { slotNumber: 'A-01', zone: 'A' }, startTime: new Date(Date.now() - 86400000 * 2).toISOString(), endTime: new Date(Date.now() - 86400000 * 2 + 7200000).toISOString(), status: 'completed', vehicleNumber: 'MH 01 AB 1234', totalAmount: 40, duration: 2 },
    { _id: 'h2', slot: { slotNumber: 'C-02', zone: 'C' }, startTime: new Date(Date.now() - 86400000 * 5).toISOString(), endTime: new Date(Date.now() - 86400000 * 5 + 10800000).toISOString(), status: 'completed', vehicleNumber: 'MH 01 AB 1234', totalAmount: 75, duration: 3 },
    { _id: 'h3', slot: { slotNumber: 'B-01', zone: 'B' }, startTime: new Date(Date.now() - 86400000 * 8).toISOString(), endTime: null, status: 'cancelled', vehicleNumber: 'MH 01 AB 1234', totalAmount: 0, duration: 0 },
    { _id: 'h4', slot: { slotNumber: 'D-01', zone: 'D' }, startTime: new Date(Date.now() - 86400000 * 15).toISOString(), endTime: new Date(Date.now() - 86400000 * 15 + 14400000).toISOString(), status: 'completed', vehicleNumber: 'MH 01 AB 1234', totalAmount: 60, duration: 4 },
];

const BookingHistory = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        bookingsAPI.getMyBookings()
            .then((res) => setHistory(res.data?.bookings || res.data || []))
            .catch(() => setHistory(mockHistory))
            .finally(() => setLoading(false));
    }, []);

    const filtered = history.filter((h) =>
        h.slot?.slotNumber?.toLowerCase().includes(search.toLowerCase()) ||
        h.vehicleNumber?.toLowerCase().includes(search.toLowerCase())
    );

    const totalSpent = history.filter((h) => h.status === 'completed').reduce((s, h) => s + (h.totalAmount || 0), 0);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Booking History</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                        Total spent: <span className="font-bold" style={{ color: '#22c55e' }}>₹{totalSpent}</span>
                    </p>
                </div>
                <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search slot..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-input pl-10 pr-4 py-2.5 rounded-xl text-sm w-56"
                    />
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-16">
                    <History size={48} className="mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
                    <p className="font-semibold text-white">No history found</p>
                </div>
            ) : (
                <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr><th>Slot</th><th>Zone</th><th>Date</th><th>Duration</th><th>Amount</th><th>Status</th></tr>
                            </thead>
                            <tbody>
                                {filtered.map((h) => (
                                    <tr key={h._id}>
                                        <td className="font-bold">{h.slot?.slotNumber}</td>
                                        <td>Zone {h.slot?.zone}</td>
                                        <td>{new Date(h.startTime).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</td>
                                        <td>{h.duration ? `${h.duration}h` : '—'}</td>
                                        <td className="font-bold text-white">{h.totalAmount ? `₹${h.totalAmount}` : '—'}</td>
                                        <td><span className={`badge badge-${h.status}`}>{h.status}</span></td>
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

export default BookingHistory;
