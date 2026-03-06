import { useState, useEffect } from 'react';
import { bookingsAPI } from '../services/api';
import { DollarSign, Clock, Car, CheckCircle, Download } from 'lucide-react';

const mockBilling = [
    { _id: 'b1', slot: { slotNumber: 'A-01' }, startTime: new Date(Date.now() - 7200000).toISOString(), endTime: new Date(Date.now() - 3600000).toISOString(), duration: 2, pricePerHour: 20, totalAmount: 40, status: 'paid', vehicleNumber: 'MH 01 AB 1234' },
    { _id: 'b2', slot: { slotNumber: 'B-02' }, startTime: new Date(Date.now() - 86400000).toISOString(), endTime: new Date(Date.now() - 79200000).toISOString(), duration: 3, pricePerHour: 15, totalAmount: 45, status: 'paid', vehicleNumber: 'MH 01 AB 1234' },
    { _id: 'b3', slot: { slotNumber: 'C-01' }, startTime: new Date(Date.now() - 172800000).toISOString(), endTime: new Date(Date.now() - 165600000).toISOString(), duration: 4, pricePerHour: 25, totalAmount: 100, status: 'pending', vehicleNumber: 'MH 01 AB 1234' },
];

const BillingPage = () => {
    const [bills, setBills] = useState([]);
    const [loading, setLoading] = useState(true);
    const totalPaid = bills.filter((b) => b.status === 'paid').reduce((s, b) => s + (b.totalAmount || 0), 0);
    const totalPending = bills.filter((b) => b.status === 'pending').reduce((s, b) => s + (b.totalAmount || 0), 0);

    useEffect(() => {
        bookingsAPI.getMyBookings()
            .then((res) => setBills(res.data?.bookings || res.data || []))
            .catch(() => setBills(mockBilling))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Billing Details</h1>
                <button className="btn-secondary px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                    <Download size={16} /> Export
                </button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Total Paid', value: `₹${totalPaid}`, icon: CheckCircle, color: '#22c55e' },
                    { label: 'Pending', value: `₹${totalPending}`, icon: Clock, color: '#fbbf24' },
                    { label: 'Total Sessions', value: bills.length, icon: Car, color: '#818cf8' },
                ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="stat-card p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                                <Icon size={20} style={{ color }} />
                            </div>
                            <div>
                                <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                                <p className="text-xl font-bold text-white">{value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bills table */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <h2 className="font-semibold text-white">Transaction History</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Slot</th>
                                <th>Vehicle</th>
                                <th>Date</th>
                                <th>Duration</th>
                                <th>Rate</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((b) => (
                                <tr key={b._id}>
                                    <td className="font-medium">{b.slot?.slotNumber || '—'}</td>
                                    <td>{b.vehicleNumber}</td>
                                    <td>{new Date(b.startTime).toLocaleDateString('en-IN')}</td>
                                    <td>{b.duration || '—'}h</td>
                                    <td>₹{b.pricePerHour}/hr</td>
                                    <td className="font-bold text-white">₹{b.totalAmount}</td>
                                    <td><span className={`badge badge-${b.status}`}>{b.status}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
