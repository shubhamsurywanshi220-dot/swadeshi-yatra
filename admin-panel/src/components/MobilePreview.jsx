import React from 'react';
import { 
    MapPin, Star, IndianRupee, Clock, Cloud, Users, Info, 
    History, Map, Navigation, Phone, Mail, Globe, 
    ChevronRight, ArrowLeft, Heart, Share2, Ticket,
    CheckCircle2, Hotel, Utensils, Bus, CreditCard
} from 'lucide-react';
import { motion } from 'framer-motion';

const MobilePreview = ({ place }) => {
    if (!place) return null;

    const sections = [
        { id: 'about', label: 'About' },
        { id: 'vault', label: 'Cultural Vault' },
        { id: 'surroundings', label: 'Explore' },
        { id: 'reviews', label: 'Reviews' }
    ];

    return (
        <div className="w-[375px] h-[700px] bg-slate-950 rounded-[3rem] overflow-hidden border-[8px] border-slate-900 shadow-2xl relative flex flex-col font-sans select-none">
            {/* Status Bar */}
            <div className="h-10 bg-black/20 backdrop-blur-md flex items-center justify-between px-8 z-20">
                <span className="text-[10px] font-bold text-white">9:41</span>
                <div className="flex gap-1.5 items-center">
                    <div className="w-4 h-2 bg-white/40 rounded-sm"></div>
                    <div className="w-1.5 h-1.5 bg-white/40 rounded-full"></div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
                {/* Hero Header */}
                <div className="h-80 relative overflow-hidden">
                    <img 
                        src={place.imageUrl || 'https://images.unsplash.com/photo-1524492459423-5c2c446d3ad7'} 
                        className="w-full h-full object-cover"
                        alt="Hero"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/40"></div>
                    
                    {/* Floating Actions */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between">
                        <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                            <ArrowLeft size={18} />
                        </div>
                        <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                                <Share2 size={18} />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white border border-white/10">
                                <Heart size={18} />
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Overlay */}
                    <div className="absolute bottom-6 left-6 right-6">
                        <span className="px-3 py-1 rounded-full bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-600/20">
                            {place.category || 'Heritage'}
                        </span>
                        <h1 className="text-3xl font-black text-white mt-2 tracking-tight">{place.name || 'Site Name'}</h1>
                        <div className="flex items-center gap-2 text-slate-300 mt-1">
                            <MapPin size={12} className="text-indigo-400" />
                            <span className="text-xs font-bold">{place.location || 'Location'}</span>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="p-6 space-y-8">
                    {/* Entry Info Card */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl group transition-all hover:border-indigo-500/30">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <IndianRupee size={12} className="text-emerald-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Entry Fee</span>
                            </div>
                            <p className="text-lg font-black text-white">₹{place.entryFee || '0'}</p>
                            <p className="text-[8px] font-bold text-slate-500 uppercase mt-1">Taxes Incl.</p>
                        </div>
                        <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl group transition-all hover:border-amber-500/30">
                            <div className="flex items-center gap-2 text-slate-500 mb-1">
                                <Star size={12} className="text-amber-500" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Rating</span>
                            </div>
                            <p className="text-lg font-black text-white">{place.rating || '4.8'}</p>
                            <div className="flex gap-0.5 mt-1">
                                {[1,2,3,4,5].map(s => <Star key={s} size={8} className="text-amber-500" fill="currentColor" />)}
                            </div>
                        </div>
                    </div>

                    {/* Smart Info Icons */}
                    <div className="flex justify-between items-center bg-indigo-600/5 rounded-3xl p-4 border border-indigo-500/10">
                        <div className="flex flex-col items-center gap-2">
                            <Clock size={16} className="text-indigo-400" />
                            <span className="text-[8px] font-black uppercase text-slate-400">Best Time</span>
                            <span className="text-[10px] font-bold text-white leading-none">{place.bestTime || 'Nov - Mar'}</span>
                        </div>
                        <div className="w-px h-8 bg-slate-800"></div>
                        <div className="flex flex-col items-center gap-2">
                            <Cloud size={16} className="text-sky-400" />
                            <span className="text-[8px] font-black uppercase text-slate-400">Weather</span>
                            <span className="text-[10px] font-bold text-white leading-none">{place.weatherInfo || '24° Clear'}</span>
                        </div>
                        <div className="w-px h-8 bg-slate-800"></div>
                        <div className="flex flex-col items-center gap-2">
                            <Users size={16} className="text-emerald-400" />
                            <span className="text-[8px] font-black uppercase text-slate-400">Crowd</span>
                            <span className="text-[10px] font-bold text-white leading-none">{place.crowdLevel || 'Moderate'}</span>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                            About this Heritage
                        </h3>
                        <p className="text-xs text-slate-400 leading-relaxed font-medium line-clamp-4">
                            {place.description || 'Experience the regal history and architectural marvel of this sanctuary...'}
                        </p>
                        <button className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300">Read More</button>
                    </div>

                    {/* Mini Gallery */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Gallery Preview</h3>
                        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                            {[1,2,3].map(i => (
                                <div key={i} className="w-32 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex-shrink-0 overflow-hidden">
                                     <img src={place.galleryImages?.[i-1] || 'https://images.unsplash.com/photo-1548013146-72479768bada'} className="w-full h-full object-cover" alt="Gallery" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cultural Vault Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 p-6 rounded-[2rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
                            <History size={100} />
                        </div>
                        <h3 className="text-base font-black text-white mb-2 tracking-tight">Cultural Vault</h3>
                        <p className="text-xs text-indigo-100 font-medium mb-4 opacity-80 leading-relaxed">
                            Discover the myths, chronicles, and legends woven into these walls.
                        </p>
                        <button className="w-full py-3 bg-white/10 backdrop-blur-md rounded-xl text-[10px] font-black uppercase tracking-widest text-white border border-white/20 hover:bg-white/20 transition-all">
                            Explore Archives
                        </button>
                    </div>

                    {/* Map Snippet */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Satellite Location</h3>
                        <div className="h-40 rounded-[2rem] bg-indigo-900/10 border border-indigo-500/20 relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <MapPin size={32} className="text-indigo-500 animate-bounce" />
                            </div>
                            <div className="absolute bottom-4 left-4 right-4 bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/10">
                                <div className="flex justify-between items-center text-[10px] font-bold text-white tracking-widest uppercase">
                                    <span>Navigation Path</span>
                                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-600 rounded-full text-[8px]">
                                        <Navigation size={8} /> LIVE
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Surroundings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Surroundings</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { icon: Hotel, label: 'Stay', color: 'bg-blue-500/10 text-blue-400' },
                                { icon: Utensils, label: 'Food', color: 'bg-orange-500/10 text-orange-400' },
                            ].map(item => (
                                <div key={item.label} className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center`}>
                                        <item.icon size={14} />
                                    </div>
                                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Sticky Action */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-slate-950/80 backdrop-blur-xl border-t border-slate-900 flex items-center gap-4 z-20">
                <div className="flex-1">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">Starting From</p>
                    <p className="text-xl font-black text-white leading-none tracking-tight">₹{place.entryFee || '550'}</p>
                </div>
                <button className="px-8 py-3 bg-indigo-600 rounded-2xl text-xs font-black text-white uppercase tracking-widest shadow-lg shadow-indigo-600/30 active:scale-95 transition-all">
                    Book Entry
                </button>
            </div>
            
            {/* Notch Area */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-slate-900 rounded-2xl z-30"></div>
        </div>
    );
};

export default MobilePreview;
