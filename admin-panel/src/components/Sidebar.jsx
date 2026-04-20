import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    MapPin,
    Users,
    Building,
    LogOut,
    Ticket,
    TriangleAlert,
    ShieldCheck,
    ChevronRight,
    Video,
    Package
} from 'lucide-react';

const Sidebar = () => {
    const { logout, user } = useAuth();
    const location = useLocation();

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/places', label: 'Destinations', icon: MapPin },
        { path: '/bookings', label: 'Bookings', icon: Ticket },
        { path: '/businesses', label: 'Verification', icon: ShieldCheck },
        { path: '/users', label: 'Users', icon: Users },
        { path: '/sos', label: 'SOS Alert', icon: TriangleAlert },
        { path: '/vlogs', label: 'Travel Vlogs', icon: Video },
        { path: '/packages', label: 'Travel Packages', icon: Package },
    ];

    return (
        <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col min-h-screen sticky top-0">
            <div className="p-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                        <MapPin className="text-white w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Swadeshi Yatra</h2>
                </div>
                <p className="text-xs text-slate-500 font-medium ml-1">Admin Panel</p>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-4">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all
                                ${isActive
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <Icon size={20} />
                                <span className="text-sm font-medium">{item.label}</span>
                            </div>
                            {isActive && <ChevronRight size={14} />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 mt-auto">
                <div className="bg-slate-800 rounded-2xl p-4 mb-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white font-bold">
                            {user?.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{user?.name}</p>
                            <p className="text-xs text-slate-400">Administrator</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-white bg-slate-700 hover:bg-red-600 transition-colors text-xs font-bold"
                    >
                        <LogOut size={14} />
                        Logout
                    </button>
                </div>
                <p className="text-[10px] text-slate-600 font-bold text-center uppercase tracking-widest leading-none">Swadeshi Yatra v1.0</p>
            </div>
        </aside>
    );
};

export default Sidebar;
