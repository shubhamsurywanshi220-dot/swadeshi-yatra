import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Users, MapPin, Building, Ticket, AlertTriangle, TrendingUp, Activity, Clock, ShieldCheck } from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import socket from '../utils/socket';

const Dashboard = () => {
    const [stats, setStats] = useState({ users: 0, places: 0, businesses: 0, bookings: 0, activeSOS: 0 });
    const [chartData, setChartData] = useState({ dailyUsers: [], dailyBookings: [], topDestinations: [] });
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        try {
            const [statsRes, chartRes, activityRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/charts'),
                api.get('/admin/activities')
            ]);
            setStats(statsRes.data);
            setChartData(chartRes.data);
            setActivities(activityRes.data);
            setError(null);
        } catch (err) {
            console.error('Dashboard Fetch Error:', err);
            setError('Failed to connect to the backend monitoring systems. Ensure all services are operational.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        // Socket listeners for real-time updates
        socket.on('user_registered', (data) => {
            setStats(prev => ({ ...prev, users: prev.users + 1 }));
            addActivity({ type: 'user_registered', message: `New user registered: ${data.name}`, createdAt: new Date() });
            fetchData(); 
        });

        socket.on('booking_created', (data) => {
            setStats(prev => ({ ...prev, bookings: prev.bookings + 1 }));
            addActivity({ type: 'booking_created', message: `New booking for ${data.placeName}`, createdAt: new Date() });
            fetchData();
        });

        socket.on('sos_alert', (data) => {
            setStats(prev => ({ ...prev, activeSOS: prev.activeSOS + 1 }));
            addActivity({ type: 'sos_alert', message: `🚨 SOS Alert triggered by ${data.name}`, createdAt: new Date() });
        });

        socket.on('sos_resolved', () => {
            setStats(prev => ({ ...prev, activeSOS: Math.max(0, prev.activeSOS - 1) }));
        });

        // Destination sync listeners
        socket.on('place_added', () => {
            fetchData();
        });

        socket.on('place_updated', () => {
            fetchData();
        });

        socket.on('place_removed', () => {
            fetchData();
        });

        return () => {
            socket.off('user_registered');
            socket.off('booking_created');
            socket.off('sos_alert');
            socket.off('sos_resolved');
            socket.off('place_added');
            socket.off('place_updated');
            socket.off('place_removed');
        };
    }, []);

    const addActivity = (activity) => {
        setActivities(prev => [activity, ...prev].slice(0, 20));
    };

    const cards = [
        { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { label: 'Total Places', value: stats.places, icon: MapPin, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        { label: 'Total Bookings', value: stats.bookings, icon: Ticket, color: 'text-amber-500', bg: 'bg-amber-500/10' },
        { label: 'Active SOS', value: stats.activeSOS, icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    ];

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
                <div className="p-6 bg-red-500/10 text-red-500 rounded-3xl border border-red-500/20 max-w-md text-center shadow-2xl">
                    <AlertTriangle className="mx-auto mb-4" size={48} />
                    <h2 className="text-xl font-black mb-2 uppercase">Connectivity Error</h2>
                    <p className="text-sm font-medium opacity-80">{error}</p>
                </div>
                <button 
                    onClick={() => { setLoading(true); fetchData(); }}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/30 active:scale-95 text-xs"
                >
                    Establish Recon
                </button>
            </div>
        );
    }

    const combinedChartData = chartData.dailyUsers.map(userDay => {
        const bookingDay = chartData.dailyBookings.find(b => b._id === userDay._id);
        return {
            date: userDay._id,
            users: userDay.count,
            bookings: bookingDay ? bookingDay.count : 0
        };
    });

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-end">
                <div>
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-black text-white tracking-tight"
                    >
                        Dashboard
                    </motion.h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time system overview and performance</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-xs font-black text-emerald-500 uppercase tracking-wider">Live System</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className="bg-slate-900 p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/50 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-500">
                            <card.icon size={100} />
                        </div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`p-3 rounded-2xl ${card.bg}`}>
                                <card.icon className={card.color} size={24} />
                            </div>
                            <span className="text-[10px] font-black bg-slate-800 text-slate-400 px-2 py-1 rounded-lg uppercase">Live</span>
                        </div>
                        <h3 className="text-4xl font-black text-white mb-1 relative z-10">
                            {loading ? '...' : card.value.toLocaleString()}
                        </h3>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-wider relative z-10">{card.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl"
                >
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <TrendingUp size={20} className="text-indigo-400" />
                                Growth Trends
                            </h3>
                            <p className="text-xs text-slate-500 font-bold uppercase mt-1 tracking-widest">Users & Bookings (Last 7 Days)</p>
                        </div>
                    </div>
                    
                    <div className="h-[300px] w-full">
                        {loading ? (
                            <div className="w-full h-full bg-slate-800/20 animate-pulse rounded-2xl flex items-center justify-center">
                                <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Synchronizing Visuals...</span>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={combinedChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis 
                                        dataKey="date" 
                                        stroke="#64748b" 
                                        fontSize={10} 
                                        fontWeight="bold"
                                        tickFormatter={(str) => str.split('-').slice(1).join('/')}
                                    />
                                    <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                        itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                                    />
                                    <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 8 }} />
                                    <Line type="monotone" dataKey="bookings" stroke="#f59e0b" strokeWidth={4} dot={{ r: 4, fill: '#f59e0b' }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl"
                >
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <MapPin size={20} className="text-emerald-400" />
                        Top Destinations
                    </h3>
                    <div className="space-y-4">
                        {chartData.topDestinations.length > 0 ? chartData.topDestinations.map((dest, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-black text-slate-400 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
                                    {i + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-bold text-white truncate max-w-[150px]">{dest._id}</span>
                                        <span className="text-xs font-black text-indigo-400">{dest.count}</span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden shadow-inner">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(dest.count / Math.max(...chartData.topDestinations.map(d=>d.count))) * 100}%` }}
                                            className="bg-indigo-500 h-full rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="flex flex-col items-center justify-center py-12 text-slate-600">
                                <MapPin size={40} className="mb-2 opacity-20" />
                                <p className="text-xs font-black uppercase tracking-widest">No Sector Data</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Activity size={20} className="text-amber-400" />
                            Recent Activity
                        </h3>
                        <span className="text-[10px] font-black bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full uppercase tracking-[0.2em]">Real-time Satellite Feed</span>
                    </div>
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence initial={false}>
                            {activities.length > 0 ? activities.map((activity, i) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={activity._id || i} 
                                    className="flex items-center gap-4 p-4 hover:bg-slate-800/50 rounded-2xl transition-all group border border-transparent hover:border-slate-800 shadow-lg hover:shadow-indigo-500/5"
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-6 group-hover:scale-110 ${
                                        activity.type === 'sos_alert' ? 'bg-red-500/20 text-red-500 shadow-lg shadow-red-500/10' :
                                        activity.type === 'booking_created' ? 'bg-amber-500/20 text-amber-500' :
                                        'bg-blue-500/20 text-blue-500'
                                    }`}>
                                        {activity.type === 'sos_alert' ? <AlertTriangle size={20}/> : 
                                         activity.type === 'booking_created' ? <Ticket size={20}/> : 
                                         <Users size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white leading-tight">{activity.message}</p>
                                        <div className="flex items-center gap-1.5 mt-1 text-slate-500">
                                            <Clock size={12} />
                                            <p className="text-[10px] font-black uppercase tracking-widest">
                                                {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="text-center py-12 text-slate-700">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Standby: Monitoring Feed</p>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl shadow-indigo-600/30">
                        <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <ShieldCheck size={160} />
                        </div>
                        <div className="relative z-10">
                            <h3 className="text-3xl font-black mb-3 tracking-tight">Encryption Hub</h3>
                            <p className="text-indigo-100 text-sm mb-10 font-medium leading-relaxed max-w-sm">Monitoring end-to-end encrypted user sessions and secure payment gateways. Integrity verified across all channels.</p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-xl border border-white/10 shadow-lg">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Quantum Data Sync Active</span>
                                </div>
                                <div className="flex items-center gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-xl border border-white/10 shadow-lg">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">SSL/TLS Layer Secured</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
