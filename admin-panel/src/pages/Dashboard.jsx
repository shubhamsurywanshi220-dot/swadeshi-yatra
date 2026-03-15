import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, MapPin, Building, Ticket, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({ users: 0, places: 0, businesses: 0, bookings: 0, activeSOS: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Total Places', value: stats.places, icon: MapPin, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Total Bookings', value: stats.bookings, icon: Ticket, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Active SOS', value: stats.activeSOS, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-4xl font-black text-white tracking-tight">Dashboard</h1>
                <p className="text-slate-500 font-medium mt-1">System overview and key metrics</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <div key={i} className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl ${card.bg}`}>
                                <card.icon className={card.color} size={24} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1">
                            {loading ? '...' : card.value}
                        </h3>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">{card.label}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800">
                    <h3 className="text-xl font-bold text-white mb-6">Recent Activity</h3>
                    <div className="space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-800/50 rounded-2xl transition-colors group">
                                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                                    <Users size={20} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-white">New user registered</p>
                                    <p className="text-xs text-slate-500 mt-0.5">2 minutes ago</p>
                                </div>
                                <span className="text-xs font-black text-indigo-400 bg-indigo-400/10 px-3 py-1 rounded-full uppercase">Update</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        <Building size={120} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-bold mb-2">System Status</h3>
                        <p className="text-indigo-100 text-sm mb-8">All services are running normally. Security protocols are active across all regions.</p>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                <span className="text-xs font-bold uppercase tracking-wider">Database Online</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl backdrop-blur-sm border border-white/10">
                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                <span className="text-xs font-bold uppercase tracking-wider">API Gateways Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
