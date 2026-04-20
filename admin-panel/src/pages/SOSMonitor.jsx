import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { AlertTriangle, MapPin, User, Phone, Clock, ShieldCheck, Navigation, Activity, ChevronRight, CheckCircle2, History, Radio, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import socket from '../utils/socket';

const SOSMonitor = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAlert, setSelectedAlert] = useState(null);

    const fetchAlerts = async () => {
        try {
            const res = await api.get('/admin/sos');
            setAlerts(res.data);
        } catch (err) {
            console.error('SOS Fetch Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();

        // Real-time SOS listeners
        socket.on('sos_alert', (newAlert) => {
            setAlerts(prev => [newAlert, ...prev]);
        });

        socket.on('sos_update', (updatedAlert) => {
            setAlerts(prev => prev.map(a => a._id === updatedAlert._id ? updatedAlert : a));
            if (selectedAlert?._id === updatedAlert._id) {
                setSelectedAlert(updatedAlert);
            }
        });

        socket.on('sos_resolved', (id) => {
            setAlerts(prev => prev.map(a => a._id === id ? { ...a, status: 'resolved' } : a));
            if (selectedAlert?._id === id) {
                setSelectedAlert(prev => ({ ...prev, status: 'resolved' }));
            }
        });

        return () => {
            socket.off('sos_alert');
            socket.off('sos_update');
            socket.off('sos_resolved');
        };
    }, [selectedAlert]);

    const resolveAlert = async (id) => {
        try {
            await api.put(`/admin/sos/${id}/resolve`);
            setAlerts(prev => prev.map(a => a._id === id ? { ...a, status: 'resolved' } : a));
            if (selectedAlert?._id === id) setSelectedAlert(prev => ({ ...prev, status: 'resolved' }));
        } catch (err) {
            console.error('Resolve SOS Error:', err);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 p-8 rounded-[2.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Radio size={120} className="text-red-500 animate-pulse" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]"></div>
                        <h1 className="text-4xl font-black text-white tracking-tight">Mission Control</h1>
                    </div>
                    <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-[10px] ml-6">Live Emergency Response & Satellite Tracking Network</p>
                </div>
                <div className="flex gap-4 relative z-10">
                    <div className="bg-slate-800/50 backdrop-blur-xl px-6 py-3 rounded-2xl border border-slate-700 text-center min-w-[120px]">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Active Alerts</p>
                        <p className="text-2xl font-black text-red-500">{alerts.filter(a => a.status === 'active').length}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-12">
                    <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-800/50">
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Signal Origin</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Telemetry</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Timestamp</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Response</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {loading ? (
                                        <tr><td colSpan="5" className="px-8 py-24 text-center text-slate-600 font-black uppercase tracking-widest animate-pulse">Scanning Satellite Channels...</td></tr>
                                    ) : alerts.map((alert, i) => (
                                        <motion.tr 
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05 }}
                                            key={alert._id} 
                                            className={`group hover:bg-slate-800/20 transition-all cursor-pointer ${selectedAlert?._id === alert._id ? 'bg-indigo-500/5 border-l-4 border-l-indigo-500' : ''}`}
                                            onClick={() => setSelectedAlert(alert)}
                                        >
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${alert.status === 'active' ? 'bg-red-500/10 text-red-500 shadow-lg shadow-red-500/10' : 'bg-slate-800 text-slate-500'}`}>
                                                        <User size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white text-base tracking-tight leading-tight">{alert.user?.name || 'Unknown Subject'}</p>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{alert.user?.phone || 'NO COMMS'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="space-y-1.5">
                                                    <p className="text-xs font-black text-slate-300 flex items-center gap-2">
                                                        <Navigation size={12} className="text-indigo-400" /> 
                                                        {alert.currentLocation?.latitude.toFixed(4)}, {alert.currentLocation?.longitude.toFixed(4)}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter italic">Accuracy Profile: {alert.locationAccuracy || 'Standard'}m</p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <Clock size={14} />
                                                    <span className="text-xs font-bold">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${
                                                    alert.status === 'active' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'bg-slate-800 text-slate-500 border-slate-700'
                                                }`}>
                                                    {alert.status === 'active' ? <Activity size={12} className="animate-pulse" /> : <ShieldCheck size={12} />}
                                                    {alert.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                                    {alert.status === 'active' && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); resolveAlert(alert._id); }}
                                                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95"
                                                        >
                                                            Resolve
                                                        </button>
                                                    )}
                                                    <ChevronRight size={20} className="text-slate-600" />
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {selectedAlert && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8"
                        >
                            <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
                                <header className="flex justify-between items-start mb-8 relative z-10">
                                    <div>
                                        <h3 className="text-2xl font-black text-white tracking-tight flex items-center gap-3">
                                            <Navigation className="text-indigo-500" />
                                            Live Coordinate Path
                                        </h3>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Tracing Breadcrumb Telemetry</p>
                                    </div>
                                    <button onClick={() => setSelectedAlert(null)} className="text-slate-600 hover:text-white transition-colors"><XCircle size={24}/></button>
                                </header>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                                    {selectedAlert.locationHistory?.slice(-6).reverse().map((loc, idx) => (
                                        <div key={idx} className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl hover:border-indigo-500/30 transition-all shadow-xl group">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-[10px] font-black">{idx === 0 ? 'LIVE' : `T-${idx}`}</div>
                                                <span className="text-[10px] font-bold text-slate-600">{new Date(loc.timestamp).toLocaleTimeString()}</span>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-white">{loc.latitude.toFixed(6)}</p>
                                                <p className="text-xs font-black text-white">{loc.longitude.toFixed(6)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-600/20 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-2xl font-black mb-6 tracking-tight">Subject Intelligence</h3>
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                                <User />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Full Name</p>
                                                <p className="text-lg font-black">{selectedAlert.user?.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                                                <Phone />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Primary Comms</p>
                                                <p className="text-lg font-black">{selectedAlert.user?.phone || 'DISCONNECTED'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] mt-10 hover:bg-slate-100 transition-all shadow-xl active:scale-95">
                                    Establish Voice Uplink
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SOSMonitor;
