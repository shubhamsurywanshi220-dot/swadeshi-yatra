import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { ShieldCheck, User, Building2, MapPin, CheckCircle2, XCircle, Search, Filter, Mail, Phone, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Verification = () => {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchPartners = async () => {
        try {
            const res = await api.get('/admin/businesses');
            setPartners(res.data);
        } catch (err) {
            console.error('Error fetching partners:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const toggleVerification = async (id, currentStatus) => {
        try {
            await api.put(`/admin/businesses/${id}/verify`, { isVerified: !currentStatus });
            setPartners(prev => prev.map(p => p._id === id ? { ...p, isVerified: !currentStatus } : p));
        } catch (err) {
            console.error('Verification toggle error:', err);
        }
    };

    const filteredPartners = partners.filter(p => {
        const matchesSearch = (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                            (p.ownerName?.toLowerCase() || '').includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || 
                            (filterStatus === 'verified' && p.isVerified) ||
                            (filterStatus === 'unverified' && !p.isVerified);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-4">
                        <ShieldCheck className="text-indigo-500" size={40} />
                        Trust & Safety
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">Audit and verify regional partner registrations</p>
                </div>
                <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
                    {['all', 'verified', 'unverified'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === status ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </header>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Search partners by business alias or proprietor name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl py-4 pl-12 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-lg text-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence>
                    {loading ? (
                        <div className="col-span-full py-24 text-center text-slate-600 font-black uppercase tracking-[0.3em]">Accessing Partner Registries...</div>
                    ) : filteredPartners.map((p, i) => (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            key={p._id} 
                            className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 hover:border-indigo-500/40 transition-all group relative overflow-hidden shadow-2xl"
                        >
                            <div className="absolute -right-6 -top-6 opacity-5 group-hover:scale-110 transition-transform duration-500">
                                <Building2 size={120} />
                            </div>
                            
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/10">
                                    <Building2 className="text-indigo-400" size={24} />
                                </div>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                    p.isVerified ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                                }`}>
                                    {p.isVerified ? 'Verified Partner' : 'Awaiting Audit'}
                                </span>
                            </div>

                            <div className="mb-8 relative z-10">
                                <h3 className="text-2xl font-black text-white tracking-tight leading-tight mb-2 group-hover:text-indigo-400 transition-colors">{p.name}</h3>
                                <div className="flex items-center gap-2 text-slate-500">
                                    <User size={14} className="text-indigo-500" />
                                    <p className="text-sm font-bold">{p.ownerName}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10 relative z-10 bg-slate-950/30 p-5 rounded-2xl border border-slate-800/50">
                                <div className="flex items-center gap-3 text-slate-400 text-xs">
                                    <Mail size={14} className="text-slate-600" />
                                    <span className="font-medium truncate">{p.email || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 text-xs">
                                    <Phone size={14} className="text-slate-600" />
                                    <span className="font-medium">{p.phone || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-400 text-xs">
                                    <MapPin size={14} className="text-emerald-500" />
                                    <span className="font-black uppercase tracking-wide">{p.location || 'Unknown Sector'}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-800/50 pt-8 relative z-10">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Calendar size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Registered: {new Date(p.createdAt).toLocaleDateString()}</span>
                                </div>
                                <button
                                    onClick={() => toggleVerification(p._id, p.isVerified)}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl ${
                                        p.isVerified 
                                        ? 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white' 
                                        : 'bg-indigo-600 text-white shadow-indigo-600/30 hover:bg-indigo-500'
                                    }`}
                                >
                                    {p.isVerified ? 'Revoke Status' : 'Approve Partner'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Verification;
