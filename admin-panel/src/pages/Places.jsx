import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Trash2,
    MapPin,
    Plus,
    Star,
    Pencil,
    Search,
    Filter,
    Clock,
    IndianRupee,
    Info,
    X,
    Image as ImageIcon
} from 'lucide-react';

const Places = () => {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
        category: '',
        entryFee: '',
        bestTime: '',
        imageUrl: '',
        contactInfo: { phone: '', email: '' }
    });

    const fetchPlaces = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/places');
            setPlaces(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/places/${id}`);
            fetchPlaces();
        } catch (err) {
            alert('Error deleting place');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedPlace) {
                await axios.put(`http://localhost:5000/api/admin/places/${selectedPlace._id}`, formData);
            } else {
                await axios.post('http://localhost:5000/api/admin/places', formData);
            }
            setIsModalOpen(false);
            fetchPlaces();
            resetForm();
        } catch (err) {
            alert('Error saving place');
        }
    };

    const resetForm = () => {
        setFormData({ name: '', location: '', description: '', category: '', entryFee: '', bestTime: '', imageUrl: '', contactInfo: { phone: '', email: '' } });
        setSelectedPlace(null);
    };

    const openEditModal = (place) => {
        setSelectedPlace(place);
        setFormData({
            ...place,
            contactInfo: place.contactInfo || { phone: '', email: '' }
        });
        setIsModalOpen(true);
    };

    const filteredPlaces = places.filter(p =>
        (p.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (p.location?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Destinations</h1>
                    <p className="text-slate-500 font-medium mt-1">Manage heritage sites and destinations</p>
                </div>
                <button
                    onClick={() => { resetForm(); setIsModalOpen(true); }}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    <Plus size={20} />
                    Add New Place
                </button>
            </header>

            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                <input
                    type="text"
                    placeholder="Search destinations by name or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-white rounded-2xl py-4 pl-12 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-800/50">
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Destination</th>
                            <th className="px-6 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {loading ? (
                            <tr><td colSpan="2" className="px-6 py-20 text-center text-slate-500 font-bold">Loading destinations...</td></tr>
                        ) : filteredPlaces.map(p => (
                            <tr key={p._id} className="group hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
                                            {p.imageUrl ? (
                                                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-600">
                                                    <ImageIcon size={24} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white text-base tracking-tight">{p.name}</p>
                                            <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                                                <MapPin size={12} className="text-indigo-400" /> {p.location}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => openEditModal(p)}
                                            className="p-2.5 text-indigo-400 border border-indigo-400/10 hover:bg-indigo-400/10 rounded-xl transition-all"
                                            title="Edit Destination"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p._id)}
                                            className="p-2.5 text-red-400 border border-red-400/10 hover:bg-red-400/10 rounded-xl transition-all"
                                            title="Delete Destination"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && filteredPlaces.length === 0 && (
                    <div className="px-6 py-20 text-center text-slate-500 font-bold">No destinations found.</div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-200">
                        <header className="sticky top-0 bg-slate-900/80 backdrop-blur-md px-10 py-8 border-b border-slate-800 flex justify-between items-center z-10">
                            <div>
                                <h2 className="text-2xl font-black text-white">{selectedPlace ? 'Edit Destination' : 'Add New Heritage Site'}</h2>
                                <p className="text-slate-500 text-sm font-medium mt-1">Configure site details and visual assets</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors">
                                <X size={24} className="text-slate-400" />
                            </button>
                        </header>

                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Site Name</label>
                                    <input
                                        required
                                        className="w-full bg-slate-800/50 border border-slate-700 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Ajanta Caves"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location / State</label>
                                    <input
                                        required
                                        className="w-full bg-slate-800/50 border border-slate-700 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        value={formData.location}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        placeholder="City, State"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                    <input
                                        className="w-full bg-slate-800/50 border border-slate-700 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        placeholder="Fort, Temple, etc."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Entry Fee (₹)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            className="w-full bg-slate-800/50 border border-slate-700 text-white py-4 pl-12 pr-5 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            value={formData.entryFee}
                                            onChange={e => setFormData({ ...formData, entryFee: e.target.value })}
                                            placeholder="0 for free"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                                <textarea
                                    required
                                    rows="4"
                                    className="w-full bg-slate-800/50 border border-slate-700 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all resize-none"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief history and significance..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Image URL</label>
                                <input
                                    className="w-full bg-slate-800/50 border border-slate-700 text-white px-5 py-4 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-8 py-3 rounded-2xl font-bold text-slate-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20"
                                >
                                    {selectedPlace ? 'Update Core' : 'Deploy Site'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Places;
