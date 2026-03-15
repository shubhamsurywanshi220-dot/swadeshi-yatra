import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Users as UserIcon, Star, Trash2, Ban, CircleCheck, Search } from 'lucide-react';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchData = async () => {
        try {
            const [usersRes, reviewsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/users'),
                axios.get('http://localhost:5000/api/admin/reviews')
            ]);
            setUsers(usersRes.data);
            setReviews(reviewsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleBlock = async (id, isBlocked) => {
        try {
            await axios.patch(`http://localhost:5000/api/admin/users/${id}/block`, { isBlocked: !isBlocked });
            fetchData();
        } catch (err) {
            alert('Error updating user status');
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Delete this user permanently?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
            fetchData();
        } catch (err) {
            alert('Error deleting user');
        }
    };

    const handleDeleteReview = async (id) => {
        if (!window.confirm('Remove this review?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/reviews/${id}`);
            fetchData();
        } catch (err) {
            alert('Error deleting review');
        }
    };

    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Community</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage explorers and moderate public feedback</p>
                </div>
                <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('reviews')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'reviews' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:text-white'}`}
                    >
                        Reviews
                    </button>
                </div>
            </header>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                    type="text"
                    placeholder={activeTab === 'users' ? "Search users by name or email..." : "Search in reviews..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl py-4 pl-12 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
            </div>

            {activeTab === 'users' ? (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/50">
                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Explorer</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Role</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Account Status</th>
                                <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {loading ? (
                                <tr><td colSpan="4" className="px-6 py-20 text-center text-slate-500 font-bold">Scanning database...</td></tr>
                            ) : filteredUsers.map(u => (
                                <tr key={u._id} className="group hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
                                                <UserIcon size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-white uppercase text-xs tracking-tight">{u.name}</p>
                                                <p className="text-[10px] text-slate-500 font-bold tracking-tighter">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-bold text-slate-300">
                                        <span className={`px-3 py-1 rounded-full ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {u.isBlocked ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] font-black uppercase border border-red-500/20">
                                                <Ban size={10} /> Suspended
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase border border-emerald-500/20">
                                                <CircleCheck size={10} /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleBlock(u._id, u.isBlocked)}
                                                className={`p-2 rounded-lg transition-all border ${u.isBlocked ? 'text-emerald-400 border-emerald-400/10 hover:bg-emerald-400/10' : 'text-amber-400 border-amber-400/10 hover:bg-amber-400/10'}`}
                                                title={u.isBlocked ? 'Restore Access' : 'Suspend User'}
                                            >
                                                {u.isBlocked ? <CircleCheck size={18} /> : <Ban size={18} />}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(u._id)}
                                                className="p-2 text-red-400 border border-red-400/10 hover:bg-red-400/10 rounded-lg transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading ? (
                        <div className="col-span-full py-20 text-center text-slate-500">Retrieving feedback...</div>
                    ) : reviews.map(r => (
                        <div key={r._id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl hover:border-indigo-500/50 transition-all group relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-xs font-bold">
                                        {r.user?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{r.user?.name}</p>
                                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">{r.place?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 text-amber-400 font-black text-xs">
                                    <Star size={12} fill="currentColor" /> {r.rating}.0
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">"{r.comment}"</p>
                            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                                <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{new Date(r.createdAt).toLocaleDateString()}</span>
                                <button
                                    onClick={() => handleDeleteReview(r._id)}
                                    className="p-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Users;
