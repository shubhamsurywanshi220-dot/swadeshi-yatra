import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import socket from '../utils/socket';
import {
    Package, Plus, Edit2, Trash2, X, Save, Eye, EyeOff,
    Clock, MapPin, Star, TrendingUp, DollarSign, Calendar,
    ChevronDown, ChevronUp, Users, Mountain, Loader2
} from 'lucide-react';

const TAG_OPTIONS = ['', 'Best Seller', 'Trending', 'New', 'Limited Offer', 'Premium'];
const CATEGORY_OPTIONS = ['Pilgrimage', 'Adventure', 'Nature', 'Beach', 'Heritage', 'Honeymoon', 'Family', 'Weekend'];
const DIFFICULTY_OPTIONS = ['Easy', 'Moderate', 'Challenging'];

const emptyPackage = {
    title: '',
    description: '',
    shortDescription: '',
    duration: { nights: 1, days: 2 },
    price: { original: '', discounted: '', currency: '₹', perPerson: true },
    imageUrl: '',
    locations: [],
    tag: '',
    category: 'Nature',
    itinerary: [],
    inclusions: [],
    exclusions: [],
    highlights: [],
    startingFrom: '',
    difficulty: 'Easy',
    bestSeason: '',
    maxGroupSize: 20,
    isPublished: true,
    isFeatured: false,
    rating: 4.5,
    sortOrder: 0,
};

const TravelPackages = () => {
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPkg, setEditingPkg] = useState(null);
    const [form, setForm] = useState({ ...emptyPackage });
    const [saving, setSaving] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Temp string fields for comma-separated lists
    const [locationsStr, setLocationsStr] = useState('');
    const [inclusionsStr, setInclusionsStr] = useState('');
    const [exclusionsStr, setExclusionsStr] = useState('');
    const [highlightsStr, setHighlightsStr] = useState('');

    useEffect(() => {
        fetchPackages();

        socket.on('package_added', () => fetchPackages());
        socket.on('package_updated', () => fetchPackages());
        socket.on('package_removed', () => fetchPackages());

        return () => {
            socket.off('package_added');
            socket.off('package_updated');
            socket.off('package_removed');
        };
    }, []);

    const fetchPackages = async () => {
        setLoading(true);
        try {
            const res = await api.get('/admin/packages');
            setPackages(res.data);
        } catch (err) {
            console.error('Failed to fetch packages:', err);
        } finally {
            setLoading(false);
        }
    };

    const openCreate = () => {
        setEditingPkg(null);
        setForm({ ...emptyPackage });
        setLocationsStr('');
        setInclusionsStr('');
        setExclusionsStr('');
        setHighlightsStr('');
        setShowModal(true);
    };

    const openEdit = (pkg) => {
        setEditingPkg(pkg);
        setForm({
            ...pkg,
            price: pkg.price || { original: '', discounted: '', currency: '₹', perPerson: true },
            duration: pkg.duration || { nights: 1, days: 2 },
        });
        setLocationsStr((pkg.locations || []).join(', '));
        setInclusionsStr((pkg.inclusions || []).join(', '));
        setExclusionsStr((pkg.exclusions || []).join(', '));
        setHighlightsStr((pkg.highlights || []).join(', '));
        setShowModal(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const payload = {
                ...form,
                locations: locationsStr.split(',').map(s => s.trim()).filter(Boolean),
                inclusions: inclusionsStr.split(',').map(s => s.trim()).filter(Boolean),
                exclusions: exclusionsStr.split(',').map(s => s.trim()).filter(Boolean),
                highlights: highlightsStr.split(',').map(s => s.trim()).filter(Boolean),
                price: {
                    ...form.price,
                    original: Number(form.price.original) || 0,
                    discounted: Number(form.price.discounted) || 0,
                },
                duration: {
                    nights: Number(form.duration.nights) || 1,
                    days: Number(form.duration.days) || 2,
                },
            };

            if (editingPkg) {
                await api.put(`/admin/packages/${editingPkg._id}`, payload);
            } else {
                await api.post('/admin/packages', payload);
            }

            setShowModal(false);
            fetchPackages();
        } catch (err) {
            console.error('Error saving package:', err);
            alert('Error saving package: ' + (err.response?.data?.error || err.message));
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/admin/packages/${id}`);
            setDeleteConfirm(null);
            fetchPackages();
        } catch (err) {
            console.error('Error deleting package:', err);
        }
    };

    const togglePublish = async (pkg) => {
        try {
            await api.put(`/admin/packages/${pkg._id}`, { isPublished: !pkg.isPublished });
            fetchPackages();
        } catch (err) {
            console.error('Error toggling publish:', err);
        }
    };

    const getTagColor = (tag) => {
        const colors = {
            'Best Seller': 'bg-orange-500',
            'Trending': 'bg-pink-500',
            'New': 'bg-emerald-500',
            'Limited Offer': 'bg-red-500',
            'Premium': 'bg-purple-500',
        };
        return colors[tag] || 'bg-slate-600';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center">
                            <Package className="w-5 h-5 text-white" />
                        </div>
                        Travel Packages
                    </h1>
                    <p className="text-slate-400 mt-1 text-sm">Manage curated travel packages & experiences</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20"
                >
                    <Plus size={18} />
                    Add Package
                </button>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-4 gap-4">
                {[
                    { label: 'Total Packages', value: packages.length, icon: Package, color: 'from-indigo-500 to-blue-600' },
                    { label: 'Published', value: packages.filter(p => p.isPublished).length, icon: Eye, color: 'from-emerald-500 to-teal-600' },
                    { label: 'Featured', value: packages.filter(p => p.isFeatured).length, icon: Star, color: 'from-amber-500 to-orange-600' },
                    { label: 'Categories', value: [...new Set(packages.map(p => p.category))].length, icon: Mountain, color: 'from-purple-500 to-pink-600' },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-xs font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                            </div>
                            <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                <stat.icon className="w-5 h-5 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Package List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
            ) : packages.length === 0 ? (
                <div className="text-center py-20 bg-slate-900 rounded-2xl border border-slate-800">
                    <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400 text-lg font-medium">No packages yet</p>
                    <p className="text-slate-500 text-sm mt-1">Click "Add Package" to create your first travel package</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {packages.map((pkg) => (
                        <div key={pkg._id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all hover:border-slate-700">
                            <div className="flex items-center p-4 gap-4">
                                {/* Image */}
                                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800">
                                    {pkg.imageUrl ? (
                                        <img src={pkg.imageUrl} alt={pkg.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package className="w-8 h-8 text-slate-600" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-white font-bold text-base truncate">{pkg.title}</h3>
                                        {pkg.tag && (
                                            <span className={`${getTagColor(pkg.tag)} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
                                                {pkg.tag}
                                            </span>
                                        )}
                                        {!pkg.isPublished && (
                                            <span className="bg-slate-700 text-slate-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                DRAFT
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-400">
                                        <span className="flex items-center gap-1">
                                            <Clock size={13} />
                                            {pkg.duration?.nights}N / {pkg.duration?.days}D
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <DollarSign size={13} />
                                            ₹{pkg.price?.discounted || pkg.price?.original || 0}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MapPin size={13} />
                                            {(pkg.locations || []).length} places
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Star size={13} className="text-amber-400" />
                                            {pkg.rating || '0'}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => togglePublish(pkg)}
                                        className={`p-2 rounded-lg transition-colors ${pkg.isPublished ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                                        title={pkg.isPublished ? 'Unpublish' : 'Publish'}
                                    >
                                        {pkg.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                                    </button>
                                    <button
                                        onClick={() => openEdit(pkg)}
                                        className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(pkg._id)}
                                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                    <button
                                        onClick={() => setExpandedId(expandedId === pkg._id ? null : pkg._id)}
                                        className="p-2 rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 transition-colors"
                                    >
                                        {expandedId === pkg._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedId === pkg._id && (
                                <div className="px-4 pb-4 border-t border-slate-800 pt-4">
                                    <p className="text-slate-400 text-sm mb-3">{pkg.description}</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        {pkg.locations?.length > 0 && (
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Locations</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {pkg.locations.map((loc, i) => (
                                                        <span key={i} className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-lg">{loc}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {pkg.inclusions?.length > 0 && (
                                            <div>
                                                <p className="text-xs font-bold text-slate-500 uppercase mb-1">Inclusions</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {pkg.inclusions.map((inc, i) => (
                                                        <span key={i} className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-1 rounded-lg">{inc}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-xs font-bold text-slate-500 uppercase mb-1">Details</p>
                                            <div className="space-y-1 text-xs text-slate-400">
                                                <p>Category: <span className="text-slate-300">{pkg.category}</span></p>
                                                <p>Difficulty: <span className="text-slate-300">{pkg.difficulty}</span></p>
                                                <p>Best Season: <span className="text-slate-300">{pkg.bestSeason || 'N/A'}</span></p>
                                                <p>Max Group: <span className="text-slate-300">{pkg.maxGroupSize}</span></p>
                                                <p>Starting From: <span className="text-slate-300">{pkg.startingFrom || 'N/A'}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Delete Confirmation */}
                            {deleteConfirm === pkg._id && (
                                <div className="px-4 pb-4 flex items-center gap-3 border-t border-red-500/20 pt-3 bg-red-500/5">
                                    <p className="text-red-400 text-sm flex-1">Are you sure you want to delete "{pkg.title}"?</p>
                                    <button
                                        onClick={() => handleDelete(pkg._id)}
                                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(null)}
                                        className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* ===== CREATE / EDIT MODAL ===== */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-8 pb-8 overflow-y-auto">
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-800">
                            <h2 className="text-lg font-bold text-white">
                                {editingPkg ? 'Edit Package' : 'Create New Package'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                            {/* Title & Short Description */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Package Title *</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                        placeholder="e.g., Char Dham Yatra"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Short Description</label>
                                    <input
                                        type="text"
                                        value={form.shortDescription}
                                        onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                        placeholder="One-liner for card display"
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">Full Description *</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition h-24 resize-none"
                                    placeholder="Detailed description of the package..."
                                />
                            </div>

                            {/* Image URL */}
                            <div>
                                <label className="block text-xs font-bold text-slate-400 mb-1.5">Image URL *</label>
                                <input
                                    type="text"
                                    value={form.imageUrl}
                                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                    placeholder="https://images.unsplash.com/..."
                                />
                            </div>

                            {/* Duration, Price, Tag, Category */}
                            <div className="grid grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Nights</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.duration.nights}
                                        onChange={(e) => setForm({ ...form, duration: { ...form.duration, nights: e.target.value } })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Days</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={form.duration.days}
                                        onChange={(e) => setForm({ ...form, duration: { ...form.duration, days: e.target.value } })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Original Price (₹)</label>
                                    <input
                                        type="number"
                                        value={form.price.original}
                                        onChange={(e) => setForm({ ...form, price: { ...form.price, original: e.target.value } })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                        placeholder="MRP"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Discounted Price (₹)</label>
                                    <input
                                        type="number"
                                        value={form.price.discounted}
                                        onChange={(e) => setForm({ ...form, price: { ...form.price, discounted: e.target.value } })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                        placeholder="Selling Price"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Tag</label>
                                    <select
                                        value={form.tag}
                                        onChange={(e) => setForm({ ...form, tag: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                    >
                                        {TAG_OPTIONS.map(t => <option key={t} value={t}>{t || '— None —'}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Category</label>
                                    <select
                                        value={form.category}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                    >
                                        {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Difficulty</label>
                                    <select
                                        value={form.difficulty}
                                        onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                    >
                                        {DIFFICULTY_OPTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* More Info */}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Starting From</label>
                                    <input
                                        type="text"
                                        value={form.startingFrom}
                                        onChange={(e) => setForm({ ...form, startingFrom: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                        placeholder="e.g., Delhi"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Best Season</label>
                                    <input
                                        type="text"
                                        value={form.bestSeason}
                                        onChange={(e) => setForm({ ...form, bestSeason: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                        placeholder="e.g., Oct - Mar"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Max Group Size</label>
                                    <input
                                        type="number"
                                        value={form.maxGroupSize}
                                        onChange={(e) => setForm({ ...form, maxGroupSize: e.target.value })}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                    />
                                </div>
                            </div>

                            {/* Comma-separated lists */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Locations (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={locationsStr}
                                        onChange={(e) => setLocationsStr(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                        placeholder="Manali, Solang Valley, Old Manali"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Highlights (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={highlightsStr}
                                        onChange={(e) => setHighlightsStr(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                        placeholder="Mountain Views, Temple Visit, River Rafting"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Inclusions (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={inclusionsStr}
                                        onChange={(e) => setInclusionsStr(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                        placeholder="Hotel Stay, Meals, Transport"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-400 mb-1.5">Exclusions (comma-separated)</label>
                                    <input
                                        type="text"
                                        value={exclusionsStr}
                                        onChange={(e) => setExclusionsStr(e.target.value)}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:border-indigo-500 outline-none transition"
                                        placeholder="Flights, Personal Expenses"
                                    />
                                </div>
                            </div>

                            {/* Toggles */}
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.isPublished}
                                        onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                                        className="w-4 h-4 rounded accent-indigo-500"
                                    />
                                    <span className="text-sm text-slate-300">Published</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={form.isFeatured}
                                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                                        className="w-4 h-4 rounded accent-amber-500"
                                    />
                                    <span className="text-sm text-slate-300">Featured</span>
                                </label>
                                <div className="flex items-center gap-2">
                                    <label className="text-sm text-slate-400">Sort Order:</label>
                                    <input
                                        type="number"
                                        value={form.sortOrder}
                                        onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                                        className="w-20 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white text-sm outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-5 py-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-sm font-semibold transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !form.title || !form.description || !form.imageUrl}
                                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-all"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {editingPkg ? 'Update Package' : 'Create Package'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TravelPackages;
