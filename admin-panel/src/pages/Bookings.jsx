import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Ticket, Calendar, User, MapPin, CircleCheck, CircleX, Clock, Search, QrCode } from 'lucide-react';

const Bookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/bookings');
            setBookings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const filteredBookings = bookings.filter(b =>
        (b.user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (b.place?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (b._id?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
            default: return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-4xl font-black text-white tracking-tight">Booking Engine</h1>
                <p className="text-slate-500 font-medium mt-1">Manage ticket reservations and digital passes</p>
            </header>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Search by ID, user or destination..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl py-4 pl-12 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-800/50">
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Booking ID</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Explorer</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Destination</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-500 font-bold">Scanning reservations...</td></tr>
                        ) : filteredBookings.map(b => (
                            <tr key={b._id} className="group hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4 font-mono text-xs text-indigo-400 font-bold tracking-wider">{b._id?.slice(-8).toUpperCase()}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold ring-2 ring-slate-800">
                                            {b.user?.name?.charAt(0)}
                                        </div>
                                        <p className="font-bold text-white text-sm">{b.user?.name}</p>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-slate-300 text-sm flex items-center gap-2">
                                        <MapPin size={14} className="text-slate-500" /> {b.place?.name}
                                    </p>
                                </td>
                                <td className="px-6 py-4 text-xs font-bold text-slate-500">
                                    {new Date(b.bookingDate || b.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusStyle(b.status)}`}>
                                        {b.status === 'confirmed' ? <CircleCheck size={12} /> : <Clock size={12} />}
                                        {b.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && filteredBookings.length === 0 && (
                    <div className="px-6 py-20 text-center text-slate-500 font-bold">No bookings found.</div>
                )}
            </div>
        </div>
    );
};

export default Bookings;
