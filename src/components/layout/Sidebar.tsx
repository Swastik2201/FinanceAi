import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  CreditCard,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Wallet,
  X,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  userProfile?: {
    name: string;
    email: string;
    photoURL?: string | null;
  } | null;
}

export const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Expenses', path: '/expenses', icon: Receipt },
  { name: 'Subscriptions', path: '/subscriptions', icon: CreditCard },
  { name: 'Bill Split', path: '/bill-split', icon: Users },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen, userProfile }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  const location = useLocation();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = userProfile?.name || 'User';
  const displayEmail = userProfile?.email || 'user@example.com';
  const photoURL = userProfile?.photoURL;

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col justify-between border-r border-border bg-card transition-all duration-300 ease-in-out
          ${collapsed ? 'w-20' : 'w-64'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header / Brand */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md shadow-primary/25">
              <Wallet className="h-5 w-5" />
            </div>
            {!collapsed && (
              <span className="font-extrabold text-lg tracking-tight text-foreground whitespace-nowrap">
                Finance<span className="text-primary">Ai</span>
              </span>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted lg:hidden"
            aria-label="Close Mobile Sidebar"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Desktop Collapse toggle button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `
                  group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200
                  ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }
                `}
                title={collapsed ? item.name : undefined}
              >
                <Icon className={`h-5 w-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-primary-foreground' : ''}`} />
                {!collapsed && <span className="truncate">{item.name}</span>}

                {/* Collapsed Floating Tooltip */}
                {collapsed && (
                  <div className="absolute left-full ml-3 hidden rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white shadow-lg group-hover:block z-50 whitespace-nowrap dark:bg-slate-100 dark:text-slate-900">
                    {item.name}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile Section at Bottom */}
        <div className="border-t border-border p-3">
          <div
            className={`flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/60 ${
              collapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {photoURL ? (
                <img
                  src={photoURL}
                  alt={displayName}
                  className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-primary/20"
                />
              ) : (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs ring-2 ring-primary/20">
                  {getInitials(displayName)}
                </div>
              )}

              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-foreground">{displayName}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{displayEmail}</p>
                </div>
              )}
            </div>

            {!collapsed && (
              <button
                onClick={() => logout()}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                title="Logout"
                aria-label="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
