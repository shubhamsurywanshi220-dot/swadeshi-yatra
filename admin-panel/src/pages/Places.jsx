import React, { useEffect, useState, useRef, useCallback } from 'react';
import api from '../utils/api';
import {
    Trash2, MapPin, Plus, Star, Pencil, Search, Clock, IndianRupee, X, Image as ImageIcon, Tag, Hash, Calendar, Globe, 
    Eye, ShieldCheck, Activity, Info, History, Map as MapIcon, Navigation, Phone, Mail, ChevronRight, Layers, Layout,
    CheckCircle2, AlertTriangle, Save, ExternalLink, Cloud, Users, Hotel, Utensils, Bus, CreditCard,
    UploadCloud, Loader, RefreshCw, FileImage, Grip
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MobilePreview from '../components/MobilePreview';
import socket from '../utils/socket';

const Places = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [activeTab, setActiveTab] = useState('basic'); // Keeping for anchored nav if needed, but primarily using single scroll
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    // Image upload state
    const [isDraggingHero, setIsDraggingHero] = useState(false);
    const [isDraggingGallery, setIsDraggingGallery] = useState(false);
    const [uploadingImages, setUploadingImages] = useState({});
    const heroInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '', location: '', description: '', category: '', entryFee: '', bestTime: '', imageUrl: '', 
        city: '', state: '', rating: 4.5, isPublished: true, isFeatured: false, bookingEnabled: false,
        bookingLink: '', reviewsEnabled: true, crowdLevel: 'Medium', galleryImages: [], weatherInfo: '',
        coordinates: { latitude: 26.9855, longitude: 75.8513 }, // Default to Amber Fort coords to avoid Australia bug
        culturalVault: { stories: '', myths: '', history: '' },
        exploreSurroundings: {
            stay: [], food: [], transport: [], atm: []
        },
        detailedInfo: { introduction: '', history: '', significance: '' }
    });

    const fetchPlaces = async () => {
        try {
            const res = await api.get('/admin/places');
            setPlaces(res.data);
        } catch (err) {
            console.error('Error fetching places:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces();

        // Socket listeners for real-time sync
        socket.on('place_added', () => fetchPlaces());
        socket.on('place_updated', () => fetchPlaces());
        socket.on('place_removed', () => fetchPlaces());

        return () => {
            socket.off('place_added');
            socket.off('place_updated');
            socket.off('place_removed');
        };
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('This will permanently delete the destination from the mobile app. Confirm?')) return;
        try {
            await api.delete(`/admin/places/${id}`);
            setPlaces(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            console.error('Deletion error:', err);
        }
    };

    useEffect(() => {
        if (isModalOpen && !selectedPlace) {
            const draft = localStorage.getItem('destination_draft');
            if (draft) {
                try {
                    setFormData(JSON.parse(draft));
                    setStatusMessage({ type: 'success', text: 'Draft Registry Recovered' });
                } catch (e) {
                    console.error('Draft recovery failed', e);
                }
            }
        }
    }, [isModalOpen, selectedPlace]);

    useEffect(() => {
        if (isModalOpen && !selectedPlace) {
            const timeout = setTimeout(() => {
                localStorage.setItem('destination_draft', JSON.stringify(formData));
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [formData, isModalOpen, selectedPlace]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const endpoint = selectedPlace ? `/admin/places/${selectedPlace._id}` : '/admin/places';
            const method = selectedPlace ? 'put' : 'post';
            const res = await api[method](endpoint, formData);
            if (res.status === 200 || res.status === 201) {
                localStorage.removeItem('destination_draft');
                setIsModalOpen(false);
                fetchPlaces();
                resetForm();
            }
        } catch (err) {
            console.error('Submission error:', err);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '', location: '', description: '', category: '', entryFee: '', bestTime: '', imageUrl: '', 
            city: '', state: '', rating: 4.5, isPublished: true, isFeatured: false, bookingEnabled: false,
            bookingLink: '', reviewsEnabled: true, crowdLevel: 'Medium', galleryImages: [], weatherInfo: '',
            coordinates: { latitude: 26.9855, longitude: 75.8513 },
            culturalVault: { stories: '', myths: '', history: '' },
            exploreSurroundings: { stay: [], food: [], transport: [], atm: [] },
            detailedInfo: { introduction: '', history: '', significance: '' }
        });
        setSelectedPlace(null);
        setActiveTab('basic');
    };

    const openEditModal = (place) => {
        setSelectedPlace(place);
        setFormData({
            ...place,
            coordinates: place.coordinates || { latitude: 26.9855, longitude: 75.8513 },
            culturalVault: place.culturalVault || { stories: '', myths: '', history: '' },
            exploreSurroundings: place.exploreSurroundings || { stay: [], food: [], transport: [], atm: [] },
            galleryImages: place.galleryImages || []
        });
        setIsModalOpen(true);
    };

    const handlePreview = (place) => {
        setSelectedPlace(place);
        setIsPreviewOpen(true);
    };

    const filteredPlaces = places.filter(p =>
        (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (p.location?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const FormSection = ({ id, title, subtitle, icon: Icon, children }) => (
        <section id={id} className="bg-slate-950/30 border border-slate-800/50 p-10 rounded-[3rem] space-y-8 scroll-mt-32">
            <div className="flex items-center justify-between gap-6 border-b border-slate-800/50 pb-6 mb-2">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-inner">
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-black text-white tracking-tight uppercase tracking-wider">{title}</h3>
                        {subtitle && <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{subtitle}</p>}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {children}
            </div>
        </section>
    );

    const handleAutoDetectLocation = async () => {
        if (!formData.name) {
            setStatusMessage({ type: 'error', text: 'Enter site name first to auto-detect' });
            return;
        }
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.name + ' India')}`);
            const data = await res.json();
            if (data && data[0]) {
                setFormData(prev => ({
                    ...prev,
                    coordinates: {
                        latitude: parseFloat(data[0].lat),
                        longitude: parseFloat(data[0].lon)
                    },
                    location: data[0].display_name.split(',').slice(0, 3).join(', ')
                }));
                setStatusMessage({ type: 'success', text: 'Location coordinates locked via Satellite' });
            } else {
                setStatusMessage({ type: 'error', text: 'Could not find exact coordinates. Enter manually.' });
            }
        } catch (err) {
            console.error('Geocoding error:', err);
        }
    };

    // ============================================================
    // IMAGE UPLOAD HANDLERS
    // ============================================================

    const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_GALLERY_IMAGES = 5;

    const validateFile = (file) => {
        if (!ALLOWED_TYPES.includes(file.type)) {
            return `"${file.name}" is not a valid format. Only JPG, PNG, WEBP are allowed.`;
        }
        if (file.size > MAX_FILE_SIZE) {
            return `"${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max size is 5MB.`;
        }
        return null;
    };

    const uploadSingleFile = async (file, purpose = 'hero') => {
        const uploadId = `${purpose}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        
        setUploadingImages(prev => ({ ...prev, [uploadId]: { name: file.name, progress: 0, purpose } }));

        try {
            const formPayload = new FormData();
            formPayload.append('image', file);
            formPayload.append('destName', formData.name || 'destination');

            const res = await api.post('/upload/image', formPayload, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadingImages(prev => ({
                        ...prev,
                        [uploadId]: { ...prev[uploadId], progress: percent }
                    }));
                }
            });

            setUploadingImages(prev => {
                const next = { ...prev };
                delete next[uploadId];
                return next;
            });

            return res.data.url;
        } catch (err) {
            setUploadingImages(prev => {
                const next = { ...prev };
                delete next[uploadId];
                return next;
            });
            console.error('Upload failed:', err);
            const msg = err.response?.data?.error || 'Upload failed. Please try again.';
            setStatusMessage({ type: 'error', text: msg });
            setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
            return null;
        }
    };

    const handleHeroDrop = useCallback(async (files) => {
        if (!files || files.length === 0) return;
        const file = files[0];
        
        const error = validateFile(file);
        if (error) {
            setStatusMessage({ type: 'error', text: error });
            setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
            return;
        }

        const url = await uploadSingleFile(file, 'hero');
        if (url) {
            setFormData(prev => ({ ...prev, imageUrl: url }));
            setStatusMessage({ type: 'success', text: 'Hero image uploaded successfully!' });
            setTimeout(() => setStatusMessage({ type: '', text: '' }), 3000);
        }
    }, [formData.name]);

    const handleGalleryDrop = useCallback(async (files) => {
        if (!files || files.length === 0) return;
        
        const currentCount = formData.galleryImages.length;
        const slotsLeft = MAX_GALLERY_IMAGES - currentCount;
        
        if (slotsLeft <= 0) {
            setStatusMessage({ type: 'error', text: `Gallery is full. Maximum ${MAX_GALLERY_IMAGES} images allowed.` });
            setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
            return;
        }

        const filesToUpload = Array.from(files).slice(0, slotsLeft);
        
        for (const file of filesToUpload) {
            const error = validateFile(file);
            if (error) {
                setStatusMessage({ type: 'error', text: error });
                setTimeout(() => setStatusMessage({ type: '', text: '' }), 4000);
                return;
            }
        }

        const newUrls = [];
        for (const file of filesToUpload) {
            const url = await uploadSingleFile(file, 'gallery');
            if (url) newUrls.push(url);
        }

        if (newUrls.length > 0) {
            setFormData(prev => ({
                ...prev,
                galleryImages: [...prev.galleryImages, ...newUrls]
            }));
            setStatusMessage({ type: 'success', text: `${newUrls.length} image${newUrls.length > 1 ? 's' : ''} added to gallery!` });
            setTimeout(() => setStatusMessage({ type: '', text: '' }), 3000);
        }
    }, [formData.galleryImages, formData.name]);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleHeroDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingHero(true);
    };

    const handleHeroDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDraggingHero(false);
        }
    };

    const handleGalleryDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingGallery(true);
    };

    const handleGalleryDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsDraggingGallery(false);
        }
    };

    const handleHeroDropEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingHero(false);
        handleHeroDrop(e.dataTransfer.files);
    };

    const handleGalleryDropEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDraggingGallery(false);
        handleGalleryDrop(e.dataTransfer.files);
    };

    const removeGalleryImage = (idx) => {
        setFormData(prev => ({
            ...prev,
            galleryImages: prev.galleryImages.filter((_, i) => i !== idx)
        }));
    };

    const isUploading = Object.keys(uploadingImages).length > 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Heritage Registry</h1>
                    <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Global Positioning & Content Distribution Hub</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/30 active:scale-95 text-xs"
                >
                    <Plus size={20} /> Deploy New Frontier
                </button>
            </header>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Identify site by alias or geo-coordinates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl py-4 pl-12 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-lg text-sm"
                />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-800/50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Site Profile</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Region & Status</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Live Telemetry</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Directives</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                <tr><td colSpan="4" className="px-8 py-24 text-center text-slate-600 font-black uppercase tracking-widest animate-pulse">Synchronizing with central database...</td></tr>
                            ) : filteredPlaces.map((p, i) => (
                                <motion.tr 
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    key={p._id} 
                                    className="group hover:bg-slate-800/20 transition-colors"
                                >
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 rounded-[2rem] overflow-hidden bg-slate-800 border-2 border-slate-700 shadow-inner group-hover:scale-105 transition-transform duration-500 relative">
                                                {p.imageUrl ? (
                                                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                        <ImageIcon size={24} />
                                                    </div>
                                                )}
                                                {p.isFeatured && (
                                                    <div className="absolute top-2 right-2 bg-amber-500 text-white p-1 rounded-full shadow-lg">
                                                        <Star size={10} fill="currentColor" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-black text-white text-lg tracking-tight leading-tight">{p.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-1 uppercase tracking-wider">
                                                    <Tag size={12} className="text-indigo-500" /> {p.category || 'Monuments'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
                                                <MapPin size={12} className="text-indigo-500" /> {p.location}
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                                                p.isPublished ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                                            }`}>
                                                {p.isPublished ? 'Live on Network' : 'Dormant Protocol'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="space-y-1.5 font-black text-[10px] uppercase tracking-widest">
                                            <p className="text-sky-400 flex items-center gap-1.5">
                                                <Cloud size={12} /> {p.weatherInfo || 'Optimized'}
                                            </p>
                                            <p className="text-amber-500 flex items-center gap-1.5">
                                                <Users size={12} /> {p.crowdLevel || 'Standard'}
                                            </p>
                                            <p className="text-emerald-500 flex items-center gap-1.5">
                                                <IndianRupee size={12} /> ₹{p.entryFee}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-3 translate-x-2 group-hover:translate-x-0 transition-transform">
                                            <button
                                                onClick={() => handlePreview(p)}
                                                className="p-3 text-emerald-400 border border-emerald-400/10 hover:bg-emerald-400/20 rounded-2xl transition-all shadow-lg active:scale-95"
                                                title="Visual Uplink Preview"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => openEditModal(p)}
                                                className="p-3 text-indigo-400 border border-indigo-400/10 hover:bg-indigo-400/20 rounded-2xl transition-all shadow-lg active:scale-95"
                                                title="Recalibrate Metadata"
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(p._id)}
                                                className="p-3 text-red-500 border border-red-500/10 hover:bg-red-500 hover:text-white rounded-2xl transition-all shadow-xl active:scale-95"
                                                title="Decommission Site"
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

            {/* Editor Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-50 flex items-center justify-center p-6">
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-slate-900 border border-slate-800 w-full max-w-6xl max-h-[92vh] flex flex-col rounded-[3.5rem] shadow-[0_0_100px_rgba(79,70,229,0.15)] overflow-hidden"
                        >
                            <header className="px-12 py-8 bg-slate-800/40 border-b border-slate-800/50 flex justify-between items-center shrink-0">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
                                        <Layout className="text-indigo-500" />
                                        {selectedPlace ? 'Registry Overhaul' : 'Establish New Frontier'}
                                    </h2>
                                    <div className="flex gap-2 mt-2 bg-slate-950/50 p-1.5 rounded-2xl border border-slate-800/50">
                                        {[
                                            { id: 'basic', label: 'Identity', icon: Hash },
                                            { id: 'images', label: 'Media', icon: ImageIcon },
                                            { id: 'location', label: 'Geo', icon: MapIcon },
                                            { id: 'booking', label: 'Access', icon: IndianRupee },
                                            { id: 'cultural', label: 'Heritage', icon: History },
                                            { id: 'surroundings', label: 'Explore', icon: Navigation }
                                        ].map(tab => (
                                            <button 
                                                key={tab.id}
                                                type="button"
                                                onClick={() => {
                                                    const el = document.getElementById(`section-${tab.id}`);
                                                    el?.scrollIntoView({ behavior: 'smooth' });
                                                    setActiveTab(tab.id);
                                                }}
                                                className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.1em] transition-all px-4 py-2 rounded-xl border ${activeTab === tab.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-600/20' : 'bg-transparent border-transparent text-slate-500 hover:text-indigo-400'}`}
                                            >
                                                <tab.icon size={12} />
                                                {tab.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setIsModalOpen(false)} className="p-3 bg-slate-800 hover:bg-red-500/10 hover:text-red-500 text-slate-400 rounded-2xl transition-all active:scale-90">
                                        <X size={24} />
                                    </button>
                                </div>
                            </header>

                            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-12">
                                <div className="space-y-12 pb-24">
                                    {/* Section 1: Basic Identity */}
                                    <FormSection id="section-basic" title="Core Intelligence" subtitle="Site Identity & Deployment Profile" icon={Hash}>
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Site Alias</label>
                                                <input
                                                    required
                                                    placeholder="e.g. Amber Fort"
                                                    className="w-full bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl focus:border-indigo-500 outline-none transition-all font-black text-white"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-indigo-400 uppercase ml-2 tracking-widest">Brief Teaser (List View)</label>
                                                <input
                                                    placeholder="A majestic hilltop fortress..."
                                                    className="w-full bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold text-slate-300"
                                                    value={formData.description}
                                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Category</label>
                                                    <select 
                                                        className="w-full bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl focus:border-indigo-500 outline-none transition-all font-black text-white uppercase tracking-widest text-[10px]"
                                                        value={formData.category}
                                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                    >
                                                        <option value="">Select Category</option>
                                                        <option value="Heritage">Heritage</option>
                                                        <option value="Wildlife">Wildlife</option>
                                                        <option value="Spiritual">Spiritual</option>
                                                        <option value="Nature">Nature</option>
                                                        <option value="Modern">Modern</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">User Rating</label>
                                                    <input 
                                                        placeholder="4.5"
                                                        type="number" step="0.1" max="5"
                                                        className="w-full bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl focus:border-indigo-500 outline-none transition-all font-black text-white"
                                                        value={formData.rating}
                                                        onChange={e => setFormData({ ...formData, rating: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Weather Profile</label>
                                                    <input 
                                                        placeholder="e.g. 25° Clear"
                                                        className="bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl focus:border-indigo-500 outline-none transition-all font-black text-white"
                                                        value={formData.weatherInfo}
                                                        onChange={e => setFormData({ ...formData, weatherInfo: e.target.value })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Crowd Density</label>
                                                    <select 
                                                        className="w-full bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl focus:border-indigo-500 outline-none transition-all font-black text-white uppercase tracking-widest text-[10px]"
                                                        value={formData.crowdLevel}
                                                        onChange={e => setFormData({ ...formData, crowdLevel: e.target.value })}
                                                    >
                                                        <option value="Low">Low Density</option>
                                                        <option value="Medium">Medium Density</option>
                                                        <option value="High">High Density</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Best Temporal Window (Recommended Visit)</label>
                                                <input 
                                                    placeholder="e.g. October – March"
                                                    className="w-full bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl focus:border-indigo-500 outline-none transition-all font-black text-white"
                                                    value={formData.bestTime}
                                                    onChange={e => setFormData({ ...formData, bestTime: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-8 mt-8 border-t border-slate-800/50 pt-8">
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center px-2">
                                                    <label className="text-[10px] font-black text-indigo-400 ml-1 uppercase tracking-widest">Detailed Narrative (Chronicles)</label>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setStatusMessage({ type: 'success', text: 'AI is generating narrative based on heritage archives...' })}
                                                        className="text-[8px] font-black text-emerald-500 uppercase border border-emerald-500/20 px-3 py-1 rounded-full hover:bg-emerald-500/10 transition-all"
                                                    >
                                                        Auto-Generate Content
                                                    </button>
                                                </div>
                                                <textarea 
                                                    rows="8"
                                                    placeholder="Enter full detailed chronicles of the site..."
                                                    className="w-full bg-slate-950 border-2 border-slate-800 p-8 rounded-3xl focus:border-indigo-500 outline-none transition-all font-medium text-slate-300 resize-none leading-relaxed"
                                                    value={formData.detailedInfo.introduction}
                                                    onChange={e => setFormData({ ...formData, detailedInfo: { ...formData.detailedInfo, introduction: e.target.value } })}
                                                />
                                            </div>
                                        </div>
                                    </FormSection>

                                    {/* Section 2: Visual Assets — Drag & Drop Upload */}
                                    <FormSection id="section-images" title="Visual Network" subtitle="Drag & Drop Media Ingestion System" icon={ImageIcon}>
                                        {/* ===== HERO IMAGE DROP ZONE ===== */}
                                        <div className="md:col-span-2 space-y-6">
                                            <div className="flex justify-between items-center px-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Primary Heritage Artifact (Hero Image)</label>
                                                <div className="flex gap-2">
                                                    <button 
                                                        type="button"
                                                        onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(formData.name)}+tourism+images&tbm=isch`, '_blank')}
                                                        className="text-[8px] font-black text-sky-400 uppercase border border-sky-400/20 px-3 py-1 rounded-full hover:bg-sky-400/10 transition-all"
                                                    >
                                                        Search Web
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Hero image: show preview or drop zone */}
                                            {formData.imageUrl ? (
                                                <div className="relative group aspect-video w-full rounded-3xl overflow-hidden border-4 border-slate-800 shadow-2xl bg-slate-950">
                                                    <img src={formData.imageUrl} className="w-full h-full object-cover transition-all group-hover:scale-105 duration-700" alt="Hero Preview" />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                                    <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.2em]">Active Artifact</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => heroInputRef.current?.click()}
                                                                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600/90 hover:bg-indigo-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest backdrop-blur-sm transition-all active:scale-95 shadow-xl"
                                                            >
                                                                <RefreshCw size={12} /> Replace
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                                                                className="flex items-center gap-2 px-4 py-2.5 bg-red-600/90 hover:bg-red-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest backdrop-blur-sm transition-all active:scale-95 shadow-xl"
                                                            >
                                                                <Trash2 size={12} /> Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    onDragOver={handleDragOver}
                                                    onDragEnter={handleHeroDragEnter}
                                                    onDragLeave={handleHeroDragLeave}
                                                    onDrop={handleHeroDropEvent}
                                                    onClick={() => heroInputRef.current?.click()}
                                                    className={`relative cursor-pointer aspect-video w-full rounded-3xl border-4 border-dashed transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
                                                        isDraggingHero
                                                            ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_60px_rgba(99,102,241,0.2)] scale-[1.01]'
                                                            : 'border-slate-700 bg-slate-950/50 hover:border-indigo-500/50 hover:bg-slate-950/80'
                                                    }`}
                                                >
                                                    {uploadingImages && Object.values(uploadingImages).some(u => u.purpose === 'hero') ? (
                                                        <div className="flex flex-col items-center gap-4">
                                                            <div className="relative w-20 h-20">
                                                                <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                                                                <div 
                                                                    className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <span className="text-sm font-black text-indigo-400">
                                                                        {Object.values(uploadingImages).find(u => u.purpose === 'hero')?.progress || 0}%
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] animate-pulse">Uploading Artifact...</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-300 ${
                                                                isDraggingHero ? 'bg-indigo-500/20 text-indigo-400 scale-110' : 'bg-slate-800/50 text-slate-600'
                                                            }`}>
                                                                <UploadCloud size={36} />
                                                            </div>
                                                            <div className="text-center">
                                                                <p className="text-sm font-black text-slate-400 tracking-tight">
                                                                    {isDraggingHero ? 'Release to Upload' : 'Drag & Drop image here'}
                                                                </p>
                                                                <p className="text-[10px] text-slate-600 font-bold mt-1 uppercase tracking-widest">or click to browse • JPG, PNG, WEBP • Max 5MB</p>
                                                            </div>
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            {/* Hidden hero file input */}
                                            <input
                                                ref={heroInputRef}
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.webp"
                                                className="hidden"
                                                onChange={(e) => handleHeroDrop(e.target.files)}
                                            />

                                            {/* URL fallback input */}
                                            <div className="flex gap-2 items-center">
                                                <div className="flex-1 relative">
                                                    <input 
                                                        placeholder="Or paste image URL directly..."
                                                        className="w-full bg-slate-950/50 border-2 border-slate-800/50 p-4 pl-12 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold text-sm text-slate-400 placeholder:text-slate-700"
                                                        value={formData.imageUrl}
                                                        onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                                    />
                                                    <ExternalLink size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* ===== GALLERY IMAGES DROP ZONE ===== */}
                                        <div className="md:col-span-2 space-y-6 mt-4">
                                            <div className="flex justify-between items-center px-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Gallery Expansion Network ({formData.galleryImages.length}/{MAX_GALLERY_IMAGES})</label>
                                                {formData.galleryImages.length < MAX_GALLERY_IMAGES && (
                                                    <button
                                                        type="button"
                                                        onClick={() => galleryInputRef.current?.click()}
                                                        className="text-[8px] font-black text-indigo-400 uppercase border border-indigo-400/20 px-3 py-1.5 rounded-full hover:bg-indigo-400/10 transition-all flex items-center gap-1.5"
                                                    >
                                                        <Plus size={10} /> Add More Images
                                                    </button>
                                                )}
                                            </div>

                                            {/* Gallery thumbnails grid */}
                                            <div className="grid grid-cols-5 gap-4">
                                                {formData.galleryImages.map((img, idx) => (
                                                    <motion.div
                                                        key={img + idx}
                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.8 }}
                                                        className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-slate-800 hover:border-indigo-500/50 transition-all duration-300 shadow-lg"
                                                    >
                                                        <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={`Gallery ${idx + 1}`} />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-end p-3 gap-2">
                                                            <span className="text-[8px] font-black text-white/80 uppercase tracking-widest">#{idx + 1}</span>
                                                            <div className="flex gap-1.5">
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => {
                                                                        // Replace: set as hero
                                                                        setFormData(prev => ({ ...prev, imageUrl: img }));
                                                                        setStatusMessage({ type: 'success', text: 'Image set as Hero Artifact' });
                                                                        setTimeout(() => setStatusMessage({ type: '', text: '' }), 2000);
                                                                    }}
                                                                    className="p-1.5 bg-indigo-600/90 text-white rounded-lg hover:bg-indigo-500 transition-all active:scale-90"
                                                                    title="Set as Hero Image"
                                                                >
                                                                    <Star size={10} />
                                                                </button>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => removeGalleryImage(idx)}
                                                                    className="p-1.5 bg-red-600/90 text-white rounded-lg hover:bg-red-500 transition-all active:scale-90"
                                                                    title="Remove Image"
                                                                >
                                                                    <Trash2 size={10} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}

                                                {/* Upload progress indicators */}
                                                {Object.entries(uploadingImages)
                                                    .filter(([, u]) => u.purpose === 'gallery')
                                                    .map(([id, upload]) => (
                                                    <div key={id} className="aspect-square rounded-2xl border-2 border-indigo-500/30 bg-indigo-500/5 flex flex-col items-center justify-center gap-2 animate-pulse">
                                                        <div className="relative w-10 h-10">
                                                            <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
                                                            <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <span className="text-[8px] font-black text-indigo-400">{upload.progress}%</span>
                                                            </div>
                                                        </div>
                                                        <span className="text-[7px] font-black text-indigo-500/60 uppercase tracking-widest truncate max-w-[80%]">{upload.name}</span>
                                                    </div>
                                                ))}

                                                {/* Drop zone for adding more gallery images */}
                                                {formData.galleryImages.length < MAX_GALLERY_IMAGES && (
                                                    <div
                                                        onDragOver={handleDragOver}
                                                        onDragEnter={handleGalleryDragEnter}
                                                        onDragLeave={handleGalleryDragLeave}
                                                        onDrop={handleGalleryDropEvent}
                                                        onClick={() => galleryInputRef.current?.click()}
                                                        className={`aspect-square rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-2 ${
                                                            isDraggingGallery
                                                                ? 'border-indigo-500 bg-indigo-500/10 scale-105 shadow-[0_0_30px_rgba(99,102,241,0.15)]'
                                                                : 'border-slate-800 bg-slate-950/30 hover:border-indigo-500/40 hover:bg-slate-950/60'
                                                        }`}
                                                    >
                                                        <UploadCloud size={20} className={isDraggingGallery ? 'text-indigo-400' : 'text-slate-700'} />
                                                        <span className="text-[7px] font-black text-slate-600 uppercase tracking-widest text-center px-2">
                                                            {isDraggingGallery ? 'Drop Here' : 'Drop or Click'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Hidden gallery file input */}
                                            <input
                                                ref={galleryInputRef}
                                                type="file"
                                                accept=".jpg,.jpeg,.png,.webp"
                                                multiple
                                                className="hidden"
                                                onChange={(e) => handleGalleryDrop(e.target.files)}
                                            />

                                            {/* Gallery URL fallback */}
                                            <div className="flex gap-2">
                                                <div className="flex-1 relative">
                                                    <input 
                                                        id="gallery-url-input"
                                                        placeholder="Or paste gallery image URL and press Enter..."
                                                        className="w-full bg-slate-950/50 border-2 border-slate-800/50 p-4 pl-12 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold text-sm text-slate-400 placeholder:text-slate-700"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                if (e.target.value.trim()) {
                                                                    if (formData.galleryImages.length >= MAX_GALLERY_IMAGES) {
                                                                        setStatusMessage({ type: 'error', text: `Gallery full. Max ${MAX_GALLERY_IMAGES} images.` });
                                                                        setTimeout(() => setStatusMessage({ type: '', text: '' }), 3000);
                                                                        return;
                                                                    }
                                                                    if (formData.galleryImages.includes(e.target.value.trim())) {
                                                                        setStatusMessage({ type: 'error', text: 'Duplicate image URL detected.' });
                                                                        setTimeout(() => setStatusMessage({ type: '', text: '' }), 3000);
                                                                        return;
                                                                    }
                                                                    setFormData(prev => ({...prev, galleryImages: [...prev.galleryImages, e.target.value.trim()]}));
                                                                    e.target.value = '';
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <ExternalLink size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700" />
                                                </div>
                                            </div>

                                            {/* Format hint */}
                                            <div className="flex items-center gap-3 px-2">
                                                <div className="flex gap-1.5">
                                                    {['JPG', 'PNG', 'WEBP'].map(fmt => (
                                                        <span key={fmt} className="text-[7px] font-black text-slate-600 uppercase tracking-widest bg-slate-800/50 px-2 py-1 rounded-lg border border-slate-800">{fmt}</span>
                                                    ))}
                                                </div>
                                                <span className="text-[8px] text-slate-700 font-bold">Max 5MB per file • Up to {MAX_GALLERY_IMAGES} gallery images</span>
                                            </div>
                                        </div>
                                    </FormSection>

                                    {/* Section 3: Geographic Coordinates */}
                                    <FormSection id="section-location" title="Geographic Coordinates" subtitle="GPS Satellite Locking & Metadata" icon={MapIcon}>
                                        <div className="space-y-8">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center px-1">
                                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Latitude</label>
                                                        <button 
                                                            type="button"
                                                            onClick={handleAutoDetectLocation}
                                                            className="text-[8px] font-black text-indigo-400 uppercase flex items-center gap-1 hover:text-indigo-300"
                                                        >
                                                            <Navigation size={10} /> Auto-Detect
                                                        </button>
                                                    </div>
                                                    <input 
                                                        type="number" step="0.000001"
                                                        className="w-full bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl focus:border-indigo-500 outline-none transition-all font-black text-white"
                                                        value={formData.coordinates.latitude}
                                                        onChange={e => setFormData({ ...formData, coordinates: { ...formData.coordinates, latitude: parseFloat(e.target.value) } })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Longitude</label>
                                                    <input 
                                                        type="number" step="0.000001"
                                                        className="w-full bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl focus:border-indigo-500 outline-none transition-all font-black text-white"
                                                        value={formData.coordinates.longitude}
                                                        onChange={e => setFormData({ ...formData, coordinates: { ...formData.coordinates, longitude: parseFloat(e.target.value) } })}
                                                    />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">City Profile</label>
                                                    <input 
                                                        placeholder="City"
                                                        className="bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl focus:border-indigo-500 outline-none transition-all font-black text-white"
                                                        value={formData.city}
                                                        onChange={e => setFormData({ ...formData, city: e.target.value, location: `${e.target.value}, ${formData.state}` })}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Provincial State</label>
                                                    <input 
                                                        placeholder="State"
                                                        className="bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl focus:border-indigo-500 outline-none transition-all font-black text-white"
                                                        value={formData.state}
                                                        onChange={e => setFormData({ ...formData, state: e.target.value, location: `${formData.city}, ${e.target.value}` })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-slate-950 rounded-[2.5rem] overflow-hidden border-4 border-slate-800/50 min-h-[350px] relative shadow-inner">
                                            <iframe 
                                                title="Geo-preview"
                                                width="100%" height="100%"
                                                frameBorder="0" style={{ border: 0, opacity: 0.8 }}
                                                src={`https://www.google.com/maps?q=${formData.coordinates.latitude},${formData.coordinates.longitude}&z=15&output=embed`}
                                                allowFullScreen
                                            ></iframe>
                                            <div className="absolute top-4 left-4 right-4 bg-slate-900 shadow-2xl p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                                                <div className="flex flex-col">
                                                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest italic">{formData.name || 'Site'} Positioning</p>
                                                    <p className="text-[8px] text-slate-500 font-bold uppercase mt-0.5 tracking-tighter">Lat: {formData.coordinates.latitude} | Lon: {formData.coordinates.longitude}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                                    <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.2em]">GPS Active</span>
                                                </div>
                                            </div>
                                        </div>
                                    </FormSection>

                                    {/* Section 4: Tariff & Access */}
                                    <FormSection id="section-booking" title="Tariff & Access" subtitle="Economic Data & Reservation Protocols" icon={IndianRupee}>
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Entry Fee Requirement (INR)</label>
                                                <input 
                                                    placeholder="e.g. 550"
                                                    className="w-full bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl focus:border-indigo-500 outline-none transition-all font-black text-white"
                                                    value={formData.entryFee}
                                                    onChange={e => setFormData({ ...formData, entryFee: e.target.value })}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between bg-slate-900/50 p-8 rounded-3xl border-2 border-slate-800 shadow-xl">
                                                <div>
                                                    <p className="text-white font-black text-lg tracking-tight">Enable Reservation Engine</p>
                                                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-[0.2em] mt-1 italic">Connect to live regional booking network</p>
                                                </div>
                                                <div 
                                                    onClick={() => setFormData({ ...formData, bookingEnabled: !formData.bookingEnabled })}
                                                    className={`w-14 h-8 rounded-full p-1.5 cursor-pointer transition-all ${formData.bookingEnabled ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700'}`}
                                                >
                                                    <div className={`w-5 h-5 rounded-full shadow-lg transition-all transform ${formData.bookingEnabled ? 'translate-x-6 bg-white' : 'translate-x-0 bg-slate-600'}`}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-8">
                                            <div className="flex flex-col gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1 tracking-widest">Network Visibility Protocol</label>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <button 
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, isPublished: !formData.isPublished })}
                                                            className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${formData.isPublished ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-slate-950 border-slate-800 text-slate-600'}`}
                                                        >
                                                            <Globe size={20} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Live Channel</span>
                                                        </button>
                                                        <button 
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                                                            className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${formData.isFeatured ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-slate-950 border-slate-800 text-slate-600'}`}
                                                        >
                                                            <Star size={20} />
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Featured Feed</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FormSection>

                                    {/* Section 5: The Cultural Vault */}
                                    <FormSection id="section-cultural" title="The Cultural Vault" subtitle="Folklore, Historical Records & Myths" icon={History}>
                                        <div className="md:col-span-2 space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1 bg-indigo-500/10 px-2 py-0.5 rounded-full inline-block">Chronicled Records</label>
                                                    <textarea 
                                                        rows="12"
                                                        placeholder="Detailed timeline and historical facts verified by heritage archives..."
                                                        className="w-full bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl focus:border-indigo-500 outline-none transition-all font-medium text-slate-300 shadow-inner"
                                                        value={formData.culturalVault.history}
                                                        onChange={e => setFormData({ ...formData, culturalVault: { ...formData.culturalVault, history: e.target.value } })}
                                                    />
                                                </div>
                                                <div className="space-y-8">
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] font-black text-amber-500 uppercase tracking-widest ml-1 bg-amber-500/10 px-2 py-0.5 rounded-full inline-block">Ancient Myths & Legends</label>
                                                        <textarea 
                                                            rows="5"
                                                            placeholder="Folklore, spiritual narratives and verified legends..."
                                                            className="w-full bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl focus:border-amber-500 outline-none transition-all font-medium text-slate-300"
                                                            value={formData.culturalVault.myths}
                                                            onChange={e => setFormData({ ...formData, culturalVault: { ...formData.culturalVault, myths: e.target.value } })}
                                                        />
                                                    </div>
                                                    <div className="space-y-4">
                                                        <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest ml-1 bg-emerald-500/10 px-2 py-0.5 rounded-full inline-block">Oral Stories & Anecdotes</label>
                                                        <textarea 
                                                            rows="5"
                                                            placeholder="Contemporary accounts from locals and travelers..."
                                                            className="w-full bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl focus:border-emerald-500 outline-none transition-all font-medium text-slate-300"
                                                            value={formData.culturalVault.stories}
                                                            onChange={e => setFormData({ ...formData, culturalVault: { ...formData.culturalVault, stories: e.target.value } })}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </FormSection>

                                    {/* Section 6: Surroundings Registry */}
                                    <FormSection id="section-surroundings" title="Exploring Surroundings" subtitle="Live Proximity Network Services" icon={Navigation}>
                                        {['stay', 'food', 'transport', 'atm'].map(key => (
                                            <div key={key} className="bg-slate-900/40 p-10 rounded-[3rem] border border-slate-800/80 shadow-2xl space-y-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                        {key === 'stay' && <Hotel size={18} />}
                                                        {key === 'food' && <Utensils size={18} />}
                                                        {key === 'transport' && <Bus size={18} />}
                                                        {key === 'atm' && <CreditCard size={18} />}
                                                    </div>
                                                    <h4 className="text-sm font-black text-white uppercase tracking-[0.2em]">{key} NETWORK</h4>
                                                </div>
                                                <div className="space-y-4">
                                                    <input 
                                                        id={`input-${key}`}
                                                        placeholder={`Ingest ${key} (Name, Link)`}
                                                        className="w-full bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl focus:border-indigo-500 outline-none transition-all font-bold text-xs shadow-inner"
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                if (e.target.value.includes(',')) {
                                                                    const val = e.target.value.split(',');
                                                                    const newItem = { name: val[0].trim(), link: val[1]?.trim() || '#' };
                                                                    setFormData({
                                                                        ...formData, 
                                                                        exploreSurroundings: {
                                                                            ...formData.exploreSurroundings,
                                                                            [key]: [...(formData.exploreSurroundings[key] || []), newItem]
                                                                        }
                                                                    });
                                                                    e.target.value = '';
                                                                } else {
                                                                    setStatusMessage({ type: 'error', text: 'Use comma: Name, Link' });
                                                                }
                                                            }
                                                        }}
                                                    />
                                                    <div className="space-y-3 min-h-[60px]">
                                                        {formData.exploreSurroundings[key]?.length > 0 ? formData.exploreSurroundings[key].map((item, idx) => (
                                                            <div key={idx} className="flex justify-between items-center bg-slate-800/50 p-4 rounded-2xl border border-slate-700/50 group hover:border-indigo-500/30 transition-all">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{item.name}</span>
                                                                    <span className="text-[8px] font-bold text-slate-500 truncate max-w-[150px]">{item.link}</span>
                                                                </div>
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => setFormData({
                                                                        ...formData,
                                                                        exploreSurroundings: {
                                                                            ...formData.exploreSurroundings,
                                                                            [key]: formData.exploreSurroundings[key].filter((_, i) => i !== idx)
                                                                        }
                                                                    })}
                                                                    className="text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>
                                                        )) : (
                                                            <div className="text-center py-4 text-slate-700 text-[8px] font-black uppercase tracking-widest border border-dashed border-slate-800 rounded-2xl">
                                                                No artifacts registered
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </FormSection>
                                </div>
                            </form>

                            <footer className="px-12 py-8 bg-slate-800/40 border-t border-slate-800/50 flex justify-between items-center shrink-0">
                                <div className="flex gap-4">
                                     <button
                                        type="button"
                                        onClick={() => handlePreview(formData)}
                                        className="flex items-center gap-3 px-8 py-4 bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all text-xs"
                                    >
                                        <Eye size={18} /> Reality Mirror
                                    </button>
                                    {statusMessage.text && (
                                        <div className={`px-6 py-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-left-4 duration-300 ${statusMessage.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                                            {statusMessage.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                                            <span className="text-[10px] font-black uppercase tracking-widest">{statusMessage.text}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-8 py-4 text-slate-500 hover:text-red-400 font-black uppercase tracking-widest text-xs transition-colors"
                                    >
                                        Decline & Exit
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-indigo-600/40 active:scale-95 text-xs flex items-center gap-3 border-t border-indigo-400/30"
                                    >
                                        <Save size={20} />
                                        {selectedPlace ? 'Save Destination' : 'Finalize Registry'}
                                    </button>
                                </div>
                            </footer>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Preview Modal */}
            <AnimatePresence>
                {isPreviewOpen && (
                    <div className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[60] flex items-center justify-center p-6">
                         <div className="absolute top-10 right-10 flex gap-4">
                            <button 
                                onClick={() => setIsPreviewOpen(false)}
                                className="p-4 bg-slate-900 border border-slate-800 text-white rounded-[2rem] hover:bg-red-500 hover:border-red-500 transition-all shadow-2xl"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex flex-col items-center gap-8">
                            <div className="text-center">
                                <h2 className="text-2xl font-black text-white tracking-widest uppercase">Mobile Interface Mirror</h2>
                                <p className="text-slate-500 text-[10px] font-black tracking-[0.3em] mt-2">Reality-Sync Verification System</p>
                            </div>
                            <MobilePreview place={selectedPlace} />
                        </div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Places;
