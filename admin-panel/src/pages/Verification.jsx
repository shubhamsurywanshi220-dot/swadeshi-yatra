import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldCheck, ShieldAlert, CircleCheck, CircleX, Search, Mail, Phone, ExternalLink, Building, Users } from 'lucide-react';

const Verification = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchBusinesses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/businesses');
            setBusinesses(res.data);
        } catch (err) {
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const toggleVerify = async (id, currentStatus) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/businesses/${id}/verify`, { isVerified: !currentStatus });
            fetchBusinesses();
        } catch (err) {
            alert('Verification failed');
        }
    };

    const filtered = businesses.filter(b => (b.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-4xl font-black text-white tracking-tight">Trust & Safety</h1>
                <p className="text-slate-500 font-medium mt-1">Verify vendors, guides, and local businesses</p>
            </header>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Search by business name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl py-4 pl-12 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-800/50">
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Provider</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Contact Details</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Identity Status</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-500 font-bold">Checking registry...</td></tr>
                        ) : filtered.map(b => (
                            <tr key={b._id} className="group hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${b.isVerified ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
                                            {b.category === 'Guide' ? <Users size={20} /> : <Building size={20} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white flex items-center gap-2">
                                                {b.name}
                                                {b.isVerified && <ShieldCheck size={14} className="text-emerald-400" />}
                                            </p>
                                            <span className="text-[10px] font-black uppercase tracking-tighter text-slate-500">{b.category} • {b.location}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 space-y-1">
                                    <p className="text-xs text-slate-300 font-medium flex items-center gap-2"><Mail size={12} className="text-slate-500" /> {b.contactInfo?.email || 'N/A'}</p>
                                    <p className="text-xs text-slate-300 font-medium flex items-center gap-2"><Phone size={12} className="text-slate-500" /> {b.contactInfo?.phone || b.contactNumber || 'N/A'}</p>
                                </td>
                                <td className="px-6 py-4">
                                    {b.isVerified ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-bold ring-4 ring-emerald-400/5">
                                            <CircleCheck size={12} /> Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold">
                                            <ShieldAlert size={12} /> Pending Review
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button
                                        onClick={() => toggleVerify(b._id, b.isVerified)}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${b.isVerified ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20' : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20'}`}
                                    >
                                        {b.isVerified ? 'Revoke Status' : 'Approve Verify'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && filtered.length === 0 && (
                    <div className="px-6 py-20 text-center text-slate-500 font-bold">No businesses found.</div>
                )}
            </div>
        </div>
    );
};

export default Verification;
