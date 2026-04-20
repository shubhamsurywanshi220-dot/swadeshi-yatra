import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Ticket as TicketIcon, User, MapPin, Calendar, Clock, Search, Filter, CheckCircle2, XCircle, MoreVertical, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBookings = async () => {
        try {
            const res = await api.get('/admin/bookings');
            setBookings(res.data);
        } catch (err) {
            console.error('Error fetching bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await api.put(`/admin/bookings/${id}/status`, { status });
            setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
        } catch (err) {
            console.error('Status update error:', err);
        }
    };

    const filteredBookings = bookings.filter(b => 
        (b.placeName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (b.userId?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (b.bookingId?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Booking Engine</h1>
                    <p className="text-slate-500 font-medium mt-1">Monitor and manage regional traveler registries</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <TicketIcon size={16} className="text-indigo-400" />
                        <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">{bookings.length} Total</span>
                    </div>
                </div>
            </header>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Search by ID, explorer name, or destination..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl py-4 pl-12 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-lg"
                />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Passport ID</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Explorer Details</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Destination / Schedule</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Registry Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Directives</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                <tr><td colSpan="5" className="px-8 py-24 text-center text-slate-600 font-black uppercase tracking-widest">Accessing booking database...</td></tr>
                            ) : filteredBookings.map((b, i) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    key={b._id} 
                                    className="group hover:bg-slate-800/20 transition-colors"
                                >
                                    <td className="px-8 py-5">
                                        <p className="text-xs font-black text-indigo-400 tracking-widest uppercase">#{b.bookingId || b._id.slice(-6).toUpperCase()}</p>
                                        <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">Registered: {format(new Date(b.createdAt), 'MMM dd, yyyy')}</p>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-black text-white border border-slate-700">
                                                {b.userId?.name?.charAt(0) || <User size={14}/>}
                                            </div>
                                            <div>
                                                <p className="font-bold text-white text-sm leading-tight">{b.userId?.name || 'Unknown Explorer'}</p>
                                                <p className="text-[10px] text-slate-500 font-medium lowercase tracking-tight">{b.userId?.email || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <p className="font-black text-white text-sm flex items-center gap-2">
                                            <MapPin size={12} className="text-indigo-500" /> {b.placeName}
                                        </p>
                                        <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                            <span className="flex items-center gap-1"><Calendar size={10}/> {b.date}</span>
                                            <span className="flex items-center gap-1"><IndianRupee size={10}/> {b.totalAmount}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
                                            b.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]' :
                                            b.status === 'pending' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                            'bg-red-500/10 text-red-500 border-red-500/20'
                                        }`}>
                                            {b.status === 'confirmed' ? <CheckCircle2 size={12} /> : 
                                             b.status === 'pending' ? <Clock size={12} /> : 
                                             <XCircle size={12} />}
                                            {b.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0">
                                            <button 
                                                onClick={() => updateStatus(b._id, 'confirmed')}
                                                className="p-2 text-emerald-500 hover:bg-emerald-500/20 rounded-lg transition-all" title="Confirm Admission">
                                                <CheckCircle2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => updateStatus(b._id, 'cancelled')}
                                                className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-all" title="Void Passport">
                                                <XCircle size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Bookings;
