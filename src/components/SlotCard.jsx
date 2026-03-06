import { MapPin, Clock, DollarSign, CheckCircle, XCircle, Wrench } from 'lucide-react';

const statusConfig = {
    available: {
        label: 'Available',
        className: 'slot-available',
        badgeClass: 'badge-available',
        icon: CheckCircle,
        iconColor: '#22c55e',
    },
    booked: {
        label: 'Booked',
        className: 'slot-booked',
        badgeClass: 'badge-booked',
        icon: Clock,
        iconColor: '#818cf8',
    },
    occupied: {
        label: 'Occupied',
        className: 'slot-occupied',
        badgeClass: 'badge-occupied',
        icon: XCircle,
        iconColor: '#fb923c',
    },
    maintenance: {
        label: 'Maintenance',
        className: '',
        badgeClass: 'badge-maintenance',
        icon: Wrench,
        iconColor: '#f87171',
    },
};

const SlotCard = ({ slot, onBook, onSelect, selected, showActions = true }) => {
    const config = statusConfig[slot.status] || statusConfig.available;
    const Icon = config.icon;
    const isAvailable = slot.status === 'available';

    return (
        <div
            className={`glow-card rounded-2xl p-5 cursor-pointer relative overflow-hidden ${config.className} ${selected ? 'ring-2 ring-indigo-500' : ''}`}
            onClick={() => onSelect && onSelect(slot)}
            style={{ minWidth: 0 }}
        >
            {/* Decorative circle */}
            <div
                className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10"
                style={{ background: config.iconColor }}
            />

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>
                        Zone {slot.zone || 'A'}
                    </p>
                    <h3 className="text-2xl font-bold text-white">{slot.slotNumber || slot.slot_number}</h3>
                </div>
                <Icon size={24} style={{ color: config.iconColor }} />
            </div>

            {/* Details */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <MapPin size={13} style={{ color: 'var(--text-secondary)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {slot.location || slot.floor ? `Floor ${slot.floor}` : 'Ground Level'}
                    </span>
                </div>
                {slot.pricePerHour != null && (
                    <div className="flex items-center gap-2">
                        <DollarSign size={13} style={{ color: 'var(--text-secondary)' }} />
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            ₹{slot.pricePerHour}/hr
                        </span>
                    </div>
                )}
                {slot.vehicleType && (
                    <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                            🚗 {slot.vehicleType}
                        </span>
                    </div>
                )}
            </div>

            {/* Status + Action */}
            <div className="mt-4 flex items-center justify-between">
                <span className={`badge ${config.badgeClass}`}>{config.label}</span>
                {showActions && isAvailable && onBook && (
                    <button
                        className="btn-primary px-3 py-1.5 rounded-lg text-xs"
                        onClick={(e) => { e.stopPropagation(); onBook(slot); }}
                    >
                        Book Now
                    </button>
                )}
            </div>
        </div>
    );
};

export default SlotCard;
