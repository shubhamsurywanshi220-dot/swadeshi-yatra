import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Places from './pages/Places';
import Bookings from './pages/Bookings';
import SOSMonitor from './pages/SOSMonitor';
import Verification from './pages/Verification';
import Vlogs from './pages/Vlogs';
import TravelPackages from './pages/TravelPackages';
import Login from './pages/Login';

const ProtectedLayout = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedLayout><Dashboard /></ProtectedLayout>} />
          <Route path="/users" element={<ProtectedLayout><Users /></ProtectedLayout>} />
          <Route path="/places" element={<ProtectedLayout><Places /></ProtectedLayout>} />
          <Route path="/bookings" element={<ProtectedLayout><Bookings /></ProtectedLayout>} />
          <Route path="/sos" element={<ProtectedLayout><SOSMonitor /></ProtectedLayout>} />
          <Route path="/businesses" element={<ProtectedLayout><Verification /></ProtectedLayout>} />
          <Route path="/vlogs" element={<ProtectedLayout><Vlogs /></ProtectedLayout>} />
          <Route path="/packages" element={<ProtectedLayout><TravelPackages /></ProtectedLayout>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
