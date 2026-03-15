import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TriangleAlert, MapPin, Phone, Clock, User, CircleCheck, ShieldAlert, Navigation, History, ChevronDown, ChevronUp } from 'lucide-react';

const SOSMonitor = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedAlert, setExpandedAlert] = useState(null);

    const fetchAlerts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/sos');
            setAlerts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 5000); // Poll every 5s for live tracking
        return () => clearInterval(interval);
    }, []);

    const resolveAlert = async (id) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/sos/${id}/resolve`);
            fetchAlerts();
        } catch (err) {
            alert('Action failed');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                        <ShieldAlert className="text-red-500 animate-pulse" size={32} />
                        SOS Response Center
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Real-time emergency monitoring and dispatch</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                    <span className="text-red-400 text-xs font-black uppercase tracking-widest">Live Feed Active</span>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {loading ? (
                    <div className="p-20 text-center text-slate-500 font-bold bg-slate-900 rounded-3xl border border-slate-800">
                        Synchronizing with emergency services...
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="p-20 text-center bg-slate-900 rounded-3xl border border-slate-800">
                        <CircleCheck size={48} className="text-emerald-500 mx-auto mb-4 opacity-20" />
                        <p className="text-slate-400 font-bold">No active emergency alerts. System clear.</p>
                    </div>
                ) : alerts.map(alert => (
                    <div key={alert._id} className={`
                        bg-slate-900 border overflow-hidden rounded-3xl transition-all duration-300
                        ${alert.status === 'active' ? 'border-red-500/50 shadow-2xl shadow-red-500/10' : 'border-slate-800 opacity-60'}
                    `}>
                        <div className="p-8 flex flex-col lg:flex-row justify-between gap-8">
                            <div className="space-y-6 flex-1">
                                <div className="flex items-center gap-4">
                                    <div className={`p-4 rounded-2xl ${alert.status === 'active' ? 'bg-red-500/20 text-red-500' : 'bg-slate-800 text-slate-500'}`}>
                                        <TriangleAlert size={32} />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white">{alert.user?.name || 'Unknown Explorer'}</h3>
                                        <div className="flex flex-wrap gap-4 mt-1">
                                            <p className="text-slate-500 font-bold text-sm flex items-center gap-1 uppercase tracking-tighter">
                                                <Clock size={14} /> Alert Triggered: {new Date(alert.timestamp).toLocaleString()}
                                            </p>
                                            {alert.message && (
                                                <p className="text-amber-500 font-bold text-sm flex items-center gap-1 uppercase tracking-tighter">
                                                    <TriangleAlert size={14} /> Msg: {alert.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
                                        <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Live Coordinates</p>
                                        <div className="flex justify-between items-center">
                                            <p className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                                <Navigation size={14} className="text-indigo-400" />
                                                {alert.location.latitude.toFixed(6)}, {alert.location.longitude.toFixed(6)}
                                            </p>
                                            <a
                                                href={`https://www.google.com/maps?q=${alert.location.latitude},${alert.location.longitude}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[10px] text-indigo-400 font-black uppercase hover:underline"
                                            >
                                                View on Map
                                            </a>
                                        </div>
                                    </div>
                                    <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
                                        <p className="text-[10px] font-black text-slate-500 uppercase mb-2">Emergency Contact</p>
                                        <p className="text-sm font-bold text-slate-200 flex items-center gap-2">
                                            <Phone size={14} className="text-emerald-400" />
                                            {alert.emergencyContact?.phone || alert.user?.phone || 'Not provided'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-between items-end gap-4 min-w-[200px]">
                                <span className={`
                                    px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border
                                    ${alert.status === 'active' ? 'bg-red-500/10 border-red-500/20 text-red-500 pulse' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}
                                `}>
                                    {alert.status}
                                </span>

                                <div className="flex flex-col gap-2 w-full">
                                    {alert.status === 'active' && (
                                        <button
                                            onClick={() => resolveAlert(alert._id)}
                                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 text-sm"
                                        >
                                            <CircleCheck size={18} /> Resolve Alert
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setExpandedAlert(expandedAlert === alert._id ? null : alert._id)}
                                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2 text-sm"
                                    >
                                        <History size={18} />
                                        {expandedAlert === alert._id ? 'Hide Path' : 'Explore Path'}
                                        {expandedAlert === alert._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {expandedAlert === alert._id && (
                            <div className="px-8 pb-8 border-t border-slate-800 pt-6 animate-in slide-in-from-top-4 duration-300">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <MapPin size={14} /> Tracking History (Breadcrumbs)
                                </h4>
                                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {alert.locationHistory?.slice().reverse().map((loc, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-slate-800/30 p-3 rounded-xl border border-slate-800/50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                                <p className="text-xs font-mono text-slate-300">
                                                    {loc.latitude.toFixed(6)}, {loc.longitude.toFixed(6)}
                                                </p>
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-500">
                                                {new Date(loc.timestamp).toLocaleTimeString()}
                                            </p>
                                        </div>
                                    ))}
                                    {(!alert.locationHistory || alert.locationHistory.length === 0) && (
                                        <p className="text-xs text-slate-500 italic">No movement recorded yet.</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {alert.status === 'active' && (
                            <div className="bg-red-500/5 px-8 py-3 border-t border-red-500/10">
                                <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest animate-pulse">Critical: Dispatch immediate assistance to live location</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SOSMonitor;
