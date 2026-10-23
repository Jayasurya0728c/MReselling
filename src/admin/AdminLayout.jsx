import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Database,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import storeConfig from '../config/storeConfig';

export default function AdminLayout() {
  const { user, logout, isSupabaseConfigured, loading } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand-800 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-neutral-600">Loading Admin Portal...</p>
        </div>
      </div>
    );
  }

  // Protected route check
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-warm-100/60 flex flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden bg-white border-b border-warm-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="p-1.5 text-neutral-700 hover:bg-warm-100 rounded-lg"
            aria-label="Toggle admin menu"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <span className="font-display font-extrabold text-base text-neutral-900">
            Nammude<span className="text-brand-700">Admin</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <Link
            to="/"
            target="_blank"
            className="text-xs font-bold text-brand-800 bg-brand-50 px-2.5 py-1 rounded-full flex items-center gap-1"
          >
            <span>Store</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Sidebar (Desktop + Mobile Slideover) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-warm-200 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
          mobileNavOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Logo & Store Info */}
          <div className="p-5 border-b border-warm-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-800 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                NP
              </div>
              <div>
                <h2 className="font-display font-extrabold text-sm text-neutral-900">
                  {storeConfig.storeName}
                </h2>
                <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">
                  Admin Console
                </div>
              </div>
            </div>
            <button
              onClick={() => setMobileNavOpen(false)}
              className="md:hidden p-1 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Database Status Badge */}
          <div className="px-4 py-3 mx-4 my-3 rounded-xl border text-[11px] leading-tight space-y-1 bg-warm-50 border-warm-200">
            <div className="flex items-center gap-1.5 font-bold">
              <Database className="w-3.5 h-3.5 text-neutral-500" />
              <span>Database Status</span>
            </div>
            {isSupabaseConfigured ? (
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Supabase PostgreSQL Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Local Preview Mode (Offline)</span>
              </div>
            )}
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.end}
                  onClick={() => setMobileNavOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-800 text-white shadow-sm'
                        : 'text-neutral-700 hover:bg-warm-100 hover:text-neutral-900'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer in Sidebar */}
        <div className="p-4 border-t border-warm-200 space-y-2 bg-warm-50/50">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-neutral-700 hover:bg-white hover:text-brand-800 transition-colors border border-warm-200"
          >
            <span>View Public Store</span>
            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
          </Link>

          <div className="flex items-center justify-between pt-1">
            <div className="text-[11px] text-neutral-500 truncate max-w-[130px]">
              {user.email || 'Admin'}
            </div>
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 p-1 hover:bg-red-50 rounded"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl">
        <Outlet />
      </main>
    </div>
  );
}
