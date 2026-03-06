import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { slotsAPI, bookingsAPI } from '../services/api';
import SlotCard from '../components/SlotCard';
import { useAuth } from '../context/AuthContext';
import { Car, Clock, DollarSign, X, CheckCircle, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const mockSlots = [
    { _id: '1', slotNumber: 'A-01', zone: 'A', floor: 1, status: 'available', pricePerHour: 20, vehicleType: '4-wheeler' },
    { _id: '2', slotNumber: 'A-02', zone: 'A', floor: 1, status: 'booked', pricePerHour: 20, vehicleType: '4-wheeler' },
    { _id: '3', slotNumber: 'B-01', zone: 'B', floor: 2, status: 'available', pricePerHour: 15, vehicleType: '2-wheeler' },
    { _id: '4', slotNumber: 'B-02', zone: 'B', floor: 2, status: 'occupied', pricePerHour: 15, vehicleType: '2-wheeler' },
    { _id: '5', slotNumber: 'C-01', zone: 'C', floor: 3, status: 'available', pricePerHour: 25, vehicleType: '4-wheeler' },
    { _id: '6', slotNumber: 'C-02', zone: 'C', floor: 3, status: 'maintenance', pricePerHour: 25, vehicleType: '4-wheeler' },
    { _id: '7', slotNumber: 'D-01', zone: 'D', floor: 1, status: 'available', pricePerHour: 10, vehicleType: '2-wheeler' },
    { _id: '8', slotNumber: 'D-02', zone: 'D', floor: 1, status: 'available', pricePerHour: 10, vehicleType: '2-wheeler' },
];

// ─── Booking Confirmation Modal ──────────────────────────────
const BookingModal = ({ slot, onConfirm, onClose, loading }) => {
    const { user } = useAuth();
    const [vehicleNum, setVehicleNum] = useState(user?.vehicleNumber || '');
    const [duration, setDuration] = useState(2);

    if (!slot) return null;
    const estimatedCost = (slot.pricePerHour || 0) * duration;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Confirm Booking</h3>
                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>

                {/* Slot summary */}
                <div
                    className="rounded-xl p-4 mb-5 slot-available"
                    style={{ border: '1px solid rgba(34,197,94,0.3)' }}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'rgba(34,197,94,0.2)' }}>
                            <Car size={24} style={{ color: '#22c55e' }} />
                        </div>
                        <div>
                            <p className="font-bold text-white text-lg">Slot {slot.slotNumber}</p>
                            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                                Zone {slot.zone} · Floor {slot.floor} · {slot.vehicleType}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vehicle input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-slate-300">Vehicle Number</label>
                    <input
                        id="booking-vehicle-number"
                        type="text"
                        value={vehicleNum}
                        onChange={(e) => setVehicleNum(e.target.value.toUpperCase())}
                        placeholder="MH 12 AB 1234"
                        className="form-input w-full px-4 py-3 rounded-xl text-sm"
                    />
                </div>

                {/* Duration */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-slate-300">Estimated Duration (hours)</label>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setDuration((d) => Math.max(1, d - 1))}
                            className="w-10 h-10 rounded-xl border flex items-center justify-center text-white font-bold"
                            style={{ borderColor: 'var(--card-border)', background: 'rgba(255,255,255,0.05)' }}
                        >−</button>
                        <span className="flex-1 text-center text-2xl font-bold text-white">{duration}h</span>
                        <button
                            onClick={() => setDuration((d) => Math.min(24, d + 1))}
                            className="w-10 h-10 rounded-xl border flex items-center justify-center text-white font-bold"
                            style={{ borderColor: 'var(--card-border)', background: 'rgba(255,255,255,0.05)' }}
                        >+</button>
                    </div>
                </div>

                {/* Cost summary */}
                <div
                    className="rounded-xl p-4 mb-6"
                    style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
                >
                    <div className="flex justify-between text-sm mb-2">
                        <span style={{ color: 'var(--text-secondary)' }}>Rate</span>
                        <span className="text-white">₹{slot.pricePerHour}/hr</span>
                    </div>
                    <div className="flex justify-between text-sm mb-2">
                        <span style={{ color: 'var(--text-secondary)' }}>Duration</span>
                        <span className="text-white">{duration} hours</span>
                    </div>
                    <div
                        className="flex justify-between font-bold text-base mt-3 pt-3"
                        style={{ borderTop: '1px solid rgba(99,102,241,0.3)' }}
                    >
                        <span style={{ color: '#818cf8' }}>Estimated Total</span>
                        <span className="text-white">₹{estimatedCost}</span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button onClick={onClose} className="btn-secondary flex-1 py-3 rounded-xl text-sm">Cancel</button>
                    <button
                        id="confirm-booking-btn"
                        onClick={() => onConfirm({ vehicleNumber: vehicleNum, duration, slotId: slot._id })}
                        disabled={loading || !vehicleNum}
                        className="btn-primary flex-1 py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : <CheckCircle size={16} />}
                        Confirm Booking
                    </button>
                </div>
            </div>
        </div>
    );
};

// ─── Booking Page ─────────────────────────────────────────────
const BookingPage = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bookLoading, setBookLoading] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [useMock, setUseMock] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const res = await slotsAPI.getAll();
                setSlots(res.data?.slots || res.data || []);
            } catch {
                setUseMock(true);
                setSlots(mockSlots);
            } finally {
                setLoading(false);
            }
        };
        fetchSlots();
    }, []);

    // Pre-select slot from query param
    useEffect(() => {
        const slotId = searchParams.get('slot');
        if (slotId && slots.length > 0) {
            const s = slots.find((x) => x._id === slotId);
            if (s && s.status === 'available') setSelectedSlot(s);
        }
    }, [searchParams, slots]);

    const handleConfirmBooking = async ({ vehicleNumber, duration, slotId }) => {
        if (!vehicleNumber) { toast.error('Please enter your vehicle number'); return; }
        setBookLoading(true);
        try {
            if (!useMock) {
                await bookingsAPI.create({ slotId, vehicleNumber, duration });
            }
            toast.success('🎉 Parking slot booked successfully!');
            setSelectedSlot(null);
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Booking failed. Try again.');
        } finally {
            setBookLoading(false);
        }
    };

    const filtered = slots.filter((s) => {
        const matchFilter = filter === 'all' || s.status === filter;
        const matchSearch = s.slotNumber?.toLowerCase().includes(search.toLowerCase()) ||
            s.zone?.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    const counts = {
        all: slots.length,
        available: slots.filter((s) => s.status === 'available').length,
        booked: slots.filter((s) => s.status === 'booked').length,
        occupied: slots.filter((s) => s.status === 'occupied').length,
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">Book a Parking Slot</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Select an available slot to book your parking space
                </p>
            </div>

            {/* Status legend + search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search slot or zone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="form-input w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {Object.entries(counts).map(([key, count]) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === key
                                    ? 'bg-indigo-600 text-white'
                                    : 'text-slate-400 hover:text-white border'
                                }`}
                            style={filter !== key ? { borderColor: 'var(--card-border)', background: 'transparent' } : {}}
                        >
                            {key.charAt(0).toUpperCase() + key.slice(1)} ({count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Slots Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="rounded-2xl h-44 loading-shimmer" />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16">
                    <Car size={48} className="mx-auto mb-3" style={{ color: 'var(--text-secondary)' }} />
                    <p className="font-semibold text-white">No slots found</p>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((slot) => (
                        <SlotCard
                            key={slot._id}
                            slot={slot}
                            selected={selectedSlot?._id === slot._id}
                            onSelect={(s) => s.status === 'available' && setSelectedSlot(s)}
                            onBook={(s) => setSelectedSlot(s)}
                            showActions={true}
                        />
                    ))}
                </div>
            )}

            {/* Booking Modal */}
            {selectedSlot && (
                <BookingModal
                    slot={selectedSlot}
                    onConfirm={handleConfirmBooking}
                    onClose={() => setSelectedSlot(null)}
                    loading={bookLoading}
                />
            )}
        </div>
    );
};

export default BookingPage;
