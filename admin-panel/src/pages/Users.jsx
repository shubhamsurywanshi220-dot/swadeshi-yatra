import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { Users as UserIcon, Star, Trash2, Ban, CircleCheck, Search, Shield, ShieldCheck, Mail, Phone, Calendar, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const [usersRes, reviewsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/reviews')
            ]);
            setUsers(usersRes.data);
            setReviews(reviewsRes.data);
        } catch (err) {
            console.error('Error fetching community data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusUpdate = async (id, isBlocked) => {
        try {
            await api.put(`/admin/users/${id}/status`, { isBlocked: !isBlocked });
            setUsers(prev => prev.map(u => u._id === id ? { ...u, isBlocked: !isBlocked } : u));
        } catch (err) {
            console.error('Error updating user status:', err);
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('This action will permanently remove the explorer. Proceed?')) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(prev => prev.filter(u => u._id !== id));
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm('Remove this feedback from public view?')) return;
        try {
            await api.delete(`/admin/reviews/${id}`);
            setReviews(prev => prev.filter(r => r._id !== id));
        } catch (err) {
            console.error('Error deleting review:', err);
        }
    };

    const filteredUsers = users.filter(u => 
        (u.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const filteredReviews = reviews.filter(r => 
        (r.comment?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (r.user?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (r.place?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Community Hub</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage explorers and moderate community feedback</p>
                </div>
                <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        Explorers
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'reviews' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        Feedback
                    </button>
                </div>
            </header>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                    type="text"
                    placeholder={activeTab === 'users' ? "Search explorers by name or credentials..." : "Scan community reviews..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl py-4 pl-12 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-lg"
                />
            </div>

            {activeTab === 'users' ? (
                <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-800/50">
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Uplink Alias</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Clearance</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Contact</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Registry Status</th>
                                    <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Directives</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {loading ? (
                                    <tr><td colSpan="5" className="px-8 py-24 text-center text-slate-600 font-black uppercase tracking-widest">Synchronizing community data...</td></tr>
                                ) : filteredUsers.map((u, i) => (
                                    <motion.tr 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        key={u._id} 
                                        className="group hover:bg-slate-800/20 transition-colors"
                                    >
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black transition-transform group-hover:scale-105 ${u.role === 'admin' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                                    {u.name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-white text-base tracking-tight leading-tight">{u.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 space-y-1">
                                            <p className="text-xs text-slate-400 font-bold flex items-center gap-2 group-hover:text-white transition-colors">
                                                <Mail size={12} className="text-slate-600" /> {u.email}
                                            </p>
                                            <p className="text-xs text-slate-400 font-bold flex items-center gap-2 group-hover:text-white transition-colors">
                                                <Phone size={12} className="text-slate-600" /> {u.phone || 'N/A'}
                                            </p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <AnimatePresence mode='wait'>
                                                {u.isBlocked ? (
                                                    <motion.span 
                                                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-500/20"
                                                    >
                                                        <Ban size={12} /> Suspended
                                                    </motion.span>
                                                ) : (
                                                    <motion.span 
                                                        initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20"
                                                    >
                                                        <ShieldCheck size={12} /> Live
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <div className="flex items-center justify-end gap-3 translate-x-2 group-hover:translate-x-0 transition-transform">
                                                <button
                                                    onClick={() => handleStatusUpdate(u._id, u.isBlocked)}
                                                    className={`p-2.5 rounded-xl transition-all border ${u.isBlocked ? 'text-emerald-400 border-emerald-400/10 hover:bg-emerald-400/20' : 'text-amber-400 border-amber-400/10 hover:bg-amber-400/20'}`}
                                                    title={u.isBlocked ? 'Restore Clearance' : 'Suspend Access'}
                                                >
                                                    {u.isBlocked ? <ShieldCheck size={18} /> : <Ban size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(u._id)}
                                                    className="p-2.5 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white rounded-xl transition-all shadow-lg active:scale-95"
                                                    title="Decommission Registry"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {loading ? (
                            <div className="col-span-full py-24 text-center text-slate-600 font-bold uppercase tracking-widest">Retrieving community feedback...</div>
                        ) : filteredReviews.map((r, i) => (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.05 }}
                                key={r._id} 
                                className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] hover:border-indigo-500/40 transition-all group relative overflow-hidden shadow-xl"
                            >
                                <div className="absolute -right-4 top-0 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                    <Star size={100} fill="currentColor" className="text-amber-500" />
                                </div>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-white font-black border border-slate-700">
                                            {r.user?.name?.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-white">{r.user?.name}</p>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <MapPin size={10} className="text-indigo-500" />
                                                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest truncate max-w-[120px]">{r.place?.name}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 px-3 py-1 bg-amber-500/10 rounded-full text-amber-500 font-black text-[10px] border border-amber-500/10 tracking-widest">
                                        <Star size={12} fill="currentColor" /> {r.rating}.0
                                    </div>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6 italic tracking-tight relative z-10 group-hover:text-slate-200 transition-colors">"{r.comment}"</p>
                                <div className="flex items-center justify-between border-t border-slate-800/50 pt-5 relative z-10">
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                        <Calendar size={12} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteReview(r._id)}
                                        className="p-2 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100 shadow-xl"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default Users;
