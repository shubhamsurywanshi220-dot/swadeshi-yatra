import React, { useState, useEffect, useCallback } from 'react';
import {
    Play, Trash2, CheckCircle, XCircle, Clock,
    Flag, RefreshCw, Video, Eye, Heart, MapPin,
    User, AlertTriangle, X
} from 'lucide-react';
import api from '../utils/api';

const STATUS_CONFIG = {
    approved: { label: 'Approved', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', icon: CheckCircle },
    pending:  { label: 'Pending',  color: 'text-amber-400',   bg: 'bg-amber-400/10',   border: 'border-amber-400/30',   icon: Clock },
    rejected: { label: 'Rejected', color: 'text-red-400',     bg: 'bg-red-400/10',     border: 'border-red-400/30',     icon: XCircle },
};

const formatCount = (n) => {
    if (!n) return '0';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return String(n);
};

// ── Video Preview Modal
function VideoPreviewModal({ vlog, onClose }) {
    if (!vlog) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4" onClick={onClose}>
            <div
                className="bg-slate-900 rounded-2xl overflow-hidden w-full max-w-2xl shadow-2xl border border-slate-700"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
                    <div>
                        <h3 className="text-white font-bold text-lg leading-tight">{vlog.title}</h3>
                        <p className="text-slate-400 text-sm mt-0.5">{vlog.location} · by {vlog.user}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1">
                        <X size={22} />
                    </button>
                </div>
                {vlog.video_url ? (
                    <video
                        src={vlog.video_url}
                        controls
                        autoPlay
                        className="w-full max-h-[420px] bg-black"
                        poster={vlog.thumbnail}
                    >
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div className="h-64 flex flex-col items-center justify-center gap-3 text-slate-500">
                        <Video size={48} />
                        <p className="text-sm">No video URL available</p>
                    </div>
                )}
                <div className="px-5 py-4">
                    <p className="text-slate-400 text-sm">{vlog.description || 'No description provided.'}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Eye size={12} /> {formatCount(vlog.views)} views</span>
                        <span className="flex items-center gap-1"><Heart size={12} /> {formatCount(vlog.likes)} likes</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {vlog.duration || 'N/A'}</span>
                        <span className="capitalize px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">{vlog.category}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ── Flag/Reject Modal
function FlagModal({ vlog, onConfirm, onClose }) {
    const [reason, setReason] = useState('');
    const REASONS = ['Fake content', 'Inappropriate', 'Spam', 'Copyright violation', 'Other'];

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-slate-900 rounded-2xl w-full max-w-md border border-slate-700 shadow-2xl">
                <div className="px-6 py-5 border-b border-slate-700 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                        <Flag size={18} className="text-red-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold">Flag & Reject Vlog</h3>
                        <p className="text-slate-400 text-xs mt-0.5 truncate max-w-xs">{vlog?.title}</p>
                    </div>
                </div>
                <div className="px-6 py-5 space-y-3">
                    <p className="text-slate-300 text-sm font-medium">Select a reason:</p>
                    {REASONS.map(r => (
                        <label key={r} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="reason"
                                value={r}
                                checked={reason === r}
                                onChange={() => setReason(r)}
                                className="accent-red-500"
                            />
                            <span className={`text-sm transition-colors ${reason === r ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{r}</span>
                        </label>
                    ))}
                </div>
                <div className="px-6 py-4 border-t border-slate-700 flex gap-3 justify-end">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">Cancel</button>
                    <button
                        onClick={() => reason && onConfirm(reason)}
                        disabled={!reason}
                        className="px-5 py-2 text-sm font-bold bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white rounded-lg transition-colors"
                    >
                        Reject & Flag
                    </button>
                </div>
            </div>
        </div>
    );
}

// ── Main Vlogs Page
export default function Vlogs() {
    const [vlogs, setVlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [previewVlog, setPreviewVlog] = useState(null);
    const [flaggingVlog, setFlaggingVlog] = useState(null);
    const [actionLoading, setActionLoading] = useState({});
    const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, rejected: 0 });

    const fetchVlogs = useCallback(async () => {
        setLoading(true);
        try {
            const params = activeFilter !== 'all' ? `?status=${activeFilter}` : '';
            const res = await api.get(`/vlogs/admin/all${params}`);
            const data = res.data.vlogs || [];
            setVlogs(data);

            // Calculate stats
            const all = res.data.total || data.length;
            const approved = data.filter(v => v.status === 'approved').length;
            const pending   = data.filter(v => v.status === 'pending').length;
            const rejected  = data.filter(v => v.status === 'rejected').length;
            setStats({ total: all, approved, pending, rejected });
        } catch (err) {
            console.error('Failed to fetch vlogs:', err);
        } finally {
            setLoading(false);
        }
    }, [activeFilter]);

    useEffect(() => { fetchVlogs(); }, [fetchVlogs]);

    const setLoaderFor = (id, state) =>
        setActionLoading(prev => ({ ...prev, [id]: state }));

    const handleStatusChange = async (id, status, flaggedReason = null) => {
        setLoaderFor(id, true);
        try {
            await api.patch(`/vlogs/admin/${id}/status`, { status, ...(flaggedReason && { flaggedReason }) });
            setVlogs(prev => prev.map(v => v._id === id ? { ...v, status, flaggedReason } : v));
            setFlaggingVlog(null);
        } catch (err) {
            console.error('Status update failed:', err);
        } finally {
            setLoaderFor(id, false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Permanently delete this vlog? This cannot be undone.')) return;
        setLoaderFor(id, true);
        try {
            await api.delete(`/vlogs/admin/${id}`);
            setVlogs(prev => prev.filter(v => v._id !== id));
        } catch (err) {
            console.error('Delete failed:', err);
        } finally {
            setLoaderFor(id, false);
        }
    };

    const FILTERS = ['all', 'pending', 'approved', 'rejected'];

    return (
        <div className="space-y-8">
            {/* ── Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Travel Vlogs</h1>
                    <p className="text-slate-400 mt-1 text-sm">Moderate user-submitted travel vlogs — approve, reject, or remove content.</p>
                </div>
                <button
                    onClick={fetchVlogs}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-colors border border-slate-700"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* ── Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Vlogs',  value: stats.total,    color: 'indigo', icon: Video },
                    { label: 'Approved',     value: stats.approved, color: 'emerald', icon: CheckCircle },
                    { label: 'Pending Review', value: stats.pending, color: 'amber',  icon: Clock },
                    { label: 'Rejected',     value: stats.rejected, color: 'red',    icon: Flag },
                ].map(({ label, value, color, icon: Icon }) => (
                    <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                        <div className="flex items-center gap-3 mb-3">
                            <div className={`w-9 h-9 rounded-xl bg-${color}-500/10 flex items-center justify-center`}>
                                <Icon size={16} className={`text-${color}-400`} />
                            </div>
                            <span className="text-slate-400 text-sm">{label}</span>
                        </div>
                        <p className="text-3xl font-bold text-white">{value}</p>
                    </div>
                ))}
            </div>

            {/* ── Filter Tabs */}
            <div className="flex gap-2">
                {FILTERS.map(f => (
                    <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all border ${
                            activeFilter === f
                                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
                        }`}
                    >
                        {f === 'all' ? 'All Vlogs' : f}
                    </button>
                ))}
            </div>

            {/* ── Vlogs Table */}
            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : vlogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-500 bg-slate-900 rounded-2xl border border-slate-800">
                    <Video size={48} className="mb-3 opacity-40" />
                    <p className="font-semibold text-slate-400">No vlogs found</p>
                    <p className="text-sm mt-1">
                        {activeFilter !== 'all' ? `No ${activeFilter} vlogs yet.` : 'Seed the database or wait for user uploads.'}
                    </p>
                </div>
            ) : (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-800">
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Video</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Stats</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {vlogs.map(vlog => {
                                    const sc = STATUS_CONFIG[vlog.status] || STATUS_CONFIG.pending;
                                    const StatusIcon = sc.icon;
                                    const isLoading = actionLoading[vlog._id];

                                    return (
                                        <tr key={vlog._id} className="hover:bg-slate-800/40 transition-colors group">
                                            {/* Thumbnail */}
                                            <td className="px-6 py-4">
                                                <div className="relative w-28 h-16 rounded-xl overflow-hidden bg-slate-800 flex-shrink-0 cursor-pointer" onClick={() => setPreviewVlog(vlog)}>
                                                    {vlog.thumbnail ? (
                                                        <img src={vlog.thumbnail} alt={vlog.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Video size={20} className="text-slate-600" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Play size={20} className="text-white" fill="white" />
                                                    </div>
                                                    {vlog.duration && (
                                                        <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                                            {vlog.duration}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Details */}
                                            <td className="px-6 py-4 max-w-xs">
                                                <p className="text-white font-semibold text-sm leading-snug line-clamp-2 mb-1">{vlog.title}</p>
                                                <div className="flex items-center gap-1 text-slate-400 text-xs mb-1">
                                                    <MapPin size={10} />
                                                    <span>{vlog.location}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-slate-500 text-xs">
                                                    <User size={10} />
                                                    <span>{vlog.user}</span>
                                                    {vlog.flaggedReason && (
                                                        <span className="ml-2 flex items-center gap-1 text-red-400">
                                                            <Flag size={10} /> {vlog.flaggedReason}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="inline-block mt-1.5 px-2 py-0.5 bg-slate-700 text-slate-300 text-[10px] font-semibold rounded-full capitalize">
                                                    {vlog.category}
                                                </span>
                                            </td>

                                            {/* Stats */}
                                            <td className="px-6 py-4">
                                                <div className="space-y-1 text-sm">
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Eye size={12} className="text-indigo-400" />
                                                        <span>{formatCount(vlog.views)}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-slate-400">
                                                        <Heart size={12} className="text-red-400" />
                                                        <span>{formatCount(vlog.likes)}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${sc.color} ${sc.bg} ${sc.border}`}>
                                                    <StatusIcon size={11} />
                                                    {sc.label}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 justify-end">
                                                    {/* Play Preview */}
                                                    <button
                                                        onClick={() => setPreviewVlog(vlog)}
                                                        title="Preview"
                                                        className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white transition-all"
                                                    >
                                                        <Play size={14} />
                                                    </button>

                                                    {/* Approve (if not already approved) */}
                                                    {vlog.status !== 'approved' && (
                                                        <button
                                                            onClick={() => handleStatusChange(vlog._id, 'approved')}
                                                            disabled={isLoading}
                                                            title="Approve"
                                                            className="p-2 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-400 hover:text-white transition-all disabled:opacity-40"
                                                        >
                                                            <CheckCircle size={14} />
                                                        </button>
                                                    )}

                                                    {/* Reject/Flag (if not already rejected) */}
                                                    {vlog.status !== 'rejected' && (
                                                        <button
                                                            onClick={() => setFlaggingVlog(vlog)}
                                                            disabled={isLoading}
                                                            title="Reject & Flag"
                                                            className="p-2 rounded-lg bg-slate-800 hover:bg-amber-600 text-slate-400 hover:text-white transition-all disabled:opacity-40"
                                                        >
                                                            <AlertTriangle size={14} />
                                                        </button>
                                                    )}

                                                    {/* Permanently Delete */}
                                                    <button
                                                        onClick={() => handleDelete(vlog._id)}
                                                        disabled={isLoading}
                                                        title="Delete permanently"
                                                        className="p-2 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-400 hover:text-white transition-all disabled:opacity-40"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modals */}
            {previewVlog && <VideoPreviewModal vlog={previewVlog} onClose={() => setPreviewVlog(null)} />}
            {flaggingVlog && (
                <FlagModal
                    vlog={flaggingVlog}
                    onClose={() => setFlaggingVlog(null)}
                    onConfirm={(reason) => handleStatusChange(flaggingVlog._id, 'rejected', reason)}
                />
            )}
        </div>
    );
}
