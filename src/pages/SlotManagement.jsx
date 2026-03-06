import { useState, useEffect } from 'react';
import { slotsAPI, pricingAPI } from '../services/api';
import { Plus, Edit2, Trash2, X, Car, DollarSign, CheckCircle, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const mockSlots = [
    { _id: '1', slotNumber: 'A-01', zone: 'A', floor: 1, status: 'available', pricePerHour: 20, vehicleType: '4-wheeler' },
    { _id: '2', slotNumber: 'A-02', zone: 'A', floor: 1, status: 'booked', pricePerHour: 20, vehicleType: '4-wheeler' },
    { _id: '3', slotNumber: 'B-01', zone: 'B', floor: 2, status: 'available', pricePerHour: 15, vehicleType: '2-wheeler' },
    { _id: '4', slotNumber: 'B-02', zone: 'B', floor: 2, status: 'occupied', pricePerHour: 15, vehicleType: '2-wheeler' },
    { _id: '5', slotNumber: 'C-01', zone: 'C', floor: 3, status: 'maintenance', pricePerHour: 25, vehicleType: '4-wheeler' },
];
const emptyForm = { slotNumber: '', zone: 'A', floor: 1, vehicleType: '4-wheeler', pricePerHour: 20, status: 'available' };

const SlotModal = ({ slot, onSave, onClose, saving }) => {
    const [form, setForm] = useState(slot || emptyForm);
    const isEdit = !!slot?._id;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">{isEdit ? 'Edit Slot' : 'Add New Slot'}</h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
                </div>
                <div className="space-y-4">
                    {[
                        { name: 'slotNumber', label: 'Slot Number', type: 'text', placeholder: 'A-01' },
                    ].map(({ name, label, type, placeholder }) => (
                        <div key={name}>
                            <label className="block text-sm font-medium mb-2 text-slate-300">{label}</label>
                            <input
                                type={type}
                                value={form[name]}
                                onChange={(e) => setForm((p) => ({ ...p, [name]: e.target.value }))}
                                placeholder={placeholder}
                                className="form-input w-full px-4 py-3 rounded-xl text-sm"
                            />
                        </div>
                    ))}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-300">Zone</label>
                            <select value={form.zone} onChange={(e) => setForm((p) => ({ ...p, zone: e.target.value }))}
                                className="form-input w-full px-4 py-3 rounded-xl text-sm">
                                {['A', 'B', 'C', 'D', 'E'].map((z) => <option key={z}>{z}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-300">Floor</label>
                            <input type="number" min={1} max={10} value={form.floor}
                                onChange={(e) => setForm((p) => ({ ...p, floor: +e.target.value }))}
                                className="form-input w-full px-4 py-3 rounded-xl text-sm" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-300">Vehicle Type</label>
                            <select value={form.vehicleType} onChange={(e) => setForm((p) => ({ ...p, vehicleType: e.target.value }))}
                                className="form-input w-full px-4 py-3 rounded-xl text-sm">
                                <option value="4-wheeler">4-Wheeler</option>
                                <option value="2-wheeler">2-Wheeler</option>
                                <option value="EV">EV</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-slate-300">Price/Hour (₹)</label>
                            <input type="number" min={0} value={form.pricePerHour}
                                onChange={(e) => setForm((p) => ({ ...p, pricePerHour: +e.target.value }))}
                                className="form-input w-full px-4 py-3 rounded-xl text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-300">Status</label>
                        <select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                            className="form-input w-full px-4 py-3 rounded-xl text-sm">
                            <option value="available">Available</option>
                            <option value="maintenance">Maintenance</option>
                        </select>
                    </div>
                </div>
                <div className="flex gap-3 mt-6">
                    <button onClick={onClose} className="btn-secondary flex-1 py-3 rounded-xl text-sm">Cancel</button>
                    <button
                        onClick={() => onSave(form)}
                        disabled={saving || !form.slotNumber}
                        className="btn-primary flex-1 py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                    >
                        {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                        {isEdit ? 'Save Changes' : 'Add Slot'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const SlotManagement = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editSlot, setEditSlot] = useState(null);
    const [pricing, setPricing] = useState({ twoWheeler: 10, fourWheeler: 20, ev: 15 });
    const [priceSaving, setPriceSaving] = useState(false);

    useEffect(() => {
        Promise.all([
            slotsAPI.getAll().catch(() => ({ data: mockSlots })),
            pricingAPI.get().catch(() => ({ data: { twoWheeler: 10, fourWheeler: 20, ev: 15 } })),
        ]).then(([sRes, pRes]) => {
            setSlots(sRes.data?.slots || sRes.data || mockSlots);
            if (pRes.data) setPricing(pRes.data);
        }).finally(() => setLoading(false));
    }, []);

    const handleSave = async (form) => {
        setSaving(true);
        try {
            if (editSlot?._id) {
                await slotsAPI.update(editSlot._id, form);
                setSlots((s) => s.map((x) => x._id === editSlot._id ? { ...x, ...form } : x));
                toast.success('Slot updated');
            } else {
                const res = await slotsAPI.create(form);
                setSlots((s) => [...s, res.data?.slot || res.data || { ...form, _id: Date.now().toString() }]);
                toast.success('Slot created');
            }
        } catch {
            if (editSlot?._id) {
                setSlots((s) => s.map((x) => x._id === editSlot._id ? { ...x, ...form } : x));
            } else {
                setSlots((s) => [...s, { ...form, _id: Date.now().toString() }]);
            }
            toast.success(`Slot ${editSlot ? 'updated' : 'added'} (demo)`);
        } finally {
            setSaving(false);
            setShowModal(false);
            setEditSlot(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this slot?')) return;
        try {
            await slotsAPI.delete(id);
        } catch { /* demo */ }
        setSlots((s) => s.filter((x) => x._id !== id));
        toast.success('Slot deleted');
    };

    const handleStatusChange = async (id, status) => {
        try {
            await slotsAPI.updateStatus(id, status);
        } catch { /* demo */ }
        setSlots((s) => s.map((x) => x._id === id ? { ...x, status } : x));
    };

    const handlePriceSave = async () => {
        setPriceSaving(true);
        try {
            await pricingAPI.update(pricing);
            toast.success('Pricing updated');
        } catch {
            toast.success('Pricing updated (demo)');
        } finally {
            setPriceSaving(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Slot Management</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Add, edit, and manage parking slots</p>
                </div>
                <button
                    onClick={() => { setEditSlot(null); setShowModal(true); }}
                    className="btn-primary px-4 py-2.5 rounded-xl text-sm flex items-center gap-2"
                >
                    <Plus size={16} /> Add Slot
                </button>
            </div>

            {/* Pricing Card */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <DollarSign size={18} style={{ color: '#818cf8' }} /> Parking Price Settings
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    {[
                        { key: 'twoWheeler', label: '2-Wheeler Rate (₹/hr)' },
                        { key: 'fourWheeler', label: '4-Wheeler Rate (₹/hr)' },
                        { key: 'ev', label: 'EV Rate (₹/hr)' },
                    ].map(({ key, label }) => (
                        <div key={key}>
                            <label className="block text-sm font-medium mb-2 text-slate-300">{label}</label>
                            <input
                                type="number"
                                min={0}
                                value={pricing[key]}
                                onChange={(e) => setPricing((p) => ({ ...p, [key]: +e.target.value }))}
                                className="form-input w-full px-4 py-3 rounded-xl text-sm"
                            />
                        </div>
                    ))}
                </div>
                <button
                    onClick={handlePriceSave}
                    disabled={priceSaving}
                    className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center gap-2"
                >
                    {priceSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save size={16} />}
                    Save Pricing
                </button>
            </div>

            {/* Slots Table */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr><th>Slot #</th><th>Zone</th><th>Floor</th><th>Type</th><th>Price/Hr</th><th>Status</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {slots.map((s) => (
                                <tr key={s._id}>
                                    <td className="font-bold">{s.slotNumber}</td>
                                    <td>Zone {s.zone}</td>
                                    <td>Floor {s.floor}</td>
                                    <td>{s.vehicleType}</td>
                                    <td>₹{s.pricePerHour}</td>
                                    <td>
                                        <select
                                            value={s.status}
                                            onChange={(e) => handleStatusChange(s._id, e.target.value)}
                                            className="text-xs px-2 py-1 rounded-lg"
                                            style={{ background: 'var(--dark-bg)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}
                                        >
                                            <option value="available">Available</option>
                                            <option value="maintenance">Maintenance</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => { setEditSlot(s); setShowModal(true); }}
                                                className="p-1.5 rounded-lg hover:bg-indigo-500/20 transition-colors"
                                                style={{ color: '#818cf8' }}
                                            >
                                                <Edit2 size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(s._id)}
                                                className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                                                style={{ color: '#f87171' }}
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <SlotModal
                    slot={editSlot}
                    onSave={handleSave}
                    onClose={() => { setShowModal(false); setEditSlot(null); }}
                    saving={saving}
                />
            )}
        </div>
    );
};

export default SlotManagement;
