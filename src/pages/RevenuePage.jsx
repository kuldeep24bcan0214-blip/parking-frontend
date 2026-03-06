import { useState, useEffect } from 'react';
import { revenueAPI } from '../services/api';
import { DollarSign, TrendingUp, Calendar, BarChart3 } from 'lucide-react';
import {
    Chart as ChartJS, CategoryScale, LinearScale, BarElement,
    LineElement, PointElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler);

const mockMonthly = {
    labels: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    revenue: [42000, 55000, 48000, 61000, 70000, 65000, 84500],
    bookings: [180, 230, 200, 260, 290, 275, 352],
};
const mockDaily = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    revenue: [4200, 3800, 5100, 4600, 6200, 7800, 3500],
};

const StatCard = ({ label, value, icon: Icon, color, change }) => (
    <div className="stat-card p-5">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>{label}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
                {change !== undefined && (
                    <p className="text-xs mt-1" style={{ color: change >= 0 ? '#22c55e' : '#f87171' }}>
                        {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% this month
                    </p>
                )}
            </div>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={22} style={{ color }} />
            </div>
        </div>
    </div>
);

const chartOptions = (title) => ({
    responsive: true,
    plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: {
            backgroundColor: '#1e293b',
            borderColor: '#334155',
            borderWidth: 1,
            titleColor: '#f1f5f9',
            bodyColor: '#94a3b8',
        },
    },
    scales: {
        x: { grid: { color: 'rgba(51,65,85,0.5)' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
        y: { grid: { color: 'rgba(51,65,85,0.5)' }, ticks: { color: '#94a3b8', font: { size: 11 } } },
    },
});

const RevenuePage = () => {
    const [monthly, setMonthly] = useState(mockMonthly);
    const [daily, setDaily] = useState(mockDaily);
    const [loading, setLoading] = useState(false);

    const totalRevenue = monthly.revenue.reduce((s, v) => s + v, 0);
    const thisMonth = monthly.revenue[monthly.revenue.length - 1];
    const lastMonth = monthly.revenue[monthly.revenue.length - 2];
    const change = Math.round(((thisMonth - lastMonth) / lastMonth) * 100);

    const barData = {
        labels: monthly.labels,
        datasets: [{
            label: 'Revenue (₹)',
            data: monthly.revenue,
            backgroundColor: 'rgba(99,102,241,0.7)',
            borderRadius: 8,
            borderSkipped: false,
        }],
    };

    const lineData = {
        labels: daily.labels,
        datasets: [{
            label: 'Daily Revenue (₹)',
            data: daily.revenue,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#22c55e',
            pointRadius: 4,
        }],
    };

    const bookingsData = {
        labels: monthly.labels,
        datasets: [{
            label: 'Bookings',
            data: monthly.bookings,
            backgroundColor: 'rgba(14,165,233,0.7)',
            borderRadius: 8,
            borderSkipped: false,
        }],
    };

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Revenue & Analytics</h1>
                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                    Financial overview and system analytics
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Revenue" value={`₹${(totalRevenue / 1000).toFixed(1)}K`} icon={DollarSign} color="#6366f1" change={change} />
                <StatCard label="This Month" value={`₹${thisMonth.toLocaleString()}`} icon={Calendar} color="#22c55e" />
                <StatCard label="Total Bookings" value={monthly.bookings.reduce((s, v) => s + v, 0)} icon={BarChart3} color="#0ea5e9" />
                <StatCard label="Avg/Day" value={`₹${Math.round(daily.revenue.reduce((s, v) => s + v, 0) / daily.revenue.length)}`} icon={TrendingUp} color="#f97316" />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-2xl p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                    <h2 className="font-semibold text-white mb-4">Monthly Revenue</h2>
                    <Bar data={barData} options={chartOptions('Monthly Revenue')} />
                </div>
                <div className="rounded-2xl p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                    <h2 className="font-semibold text-white mb-4">This Week (Daily)</h2>
                    <Line data={lineData} options={chartOptions('Daily Revenue')} />
                </div>
            </div>

            {/* Bookings chart */}
            <div className="rounded-2xl p-6" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <h2 className="font-semibold text-white mb-4">Monthly Bookings</h2>
                <Bar data={bookingsData} options={chartOptions('Bookings')} />
            </div>

            {/* Revenue breakdown table */}
            <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
                <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--card-border)' }}>
                    <h2 className="font-semibold text-white">Monthly Breakdown</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="data-table">
                        <thead>
                            <tr><th>Month</th><th>Bookings</th><th>Revenue</th><th>Avg/Booking</th><th>Growth</th></tr>
                        </thead>
                        <tbody>
                            {monthly.labels.map((label, i) => {
                                const rev = monthly.revenue[i];
                                const bk = monthly.bookings[i];
                                const prev = monthly.revenue[i - 1];
                                const growth = prev ? Math.round(((rev - prev) / prev) * 100) : null;
                                return (
                                    <tr key={label}>
                                        <td className="font-medium text-white">{label} 2025</td>
                                        <td>{bk}</td>
                                        <td className="font-bold text-white">₹{rev.toLocaleString()}</td>
                                        <td>₹{Math.round(rev / bk)}</td>
                                        <td>
                                            {growth !== null && (
                                                <span style={{ color: growth >= 0 ? '#22c55e' : '#f87171' }}>
                                                    {growth >= 0 ? '↑' : '↓'} {Math.abs(growth)}%
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RevenuePage;
