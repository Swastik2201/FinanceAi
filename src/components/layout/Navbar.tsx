import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, Sun, Moon, LogOut, User as UserIcon, Settings as SettingsIcon, ChevronDown, Flame } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onMobileMenuToggle: () => void;
  pageTitle?: string;
  userProfile?: {
    name: string;
    email: string;
    photoURL?: string | null;
  } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onMobileMenuToggle,
  pageTitle = 'Dashboard',
  userProfile,
}) => {
  const { theme, toggleTheme, isOrangeMode, toggleOrangeMode } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
  const photoURL = userProfile?.photoURL;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-card/80 px-4 sm:px-6 backdrop-blur-md transition-colors">
      {/* Left side: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
          {pageTitle}
        </h1>
      </div>

      {/* Right side: Actions & User Dropdown */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Orange Mode Toggle Button */}
        <button
          onClick={toggleOrangeMode}
          className={`flex h-9 items-center gap-1.5 px-2.5 rounded-xl border transition-all ${
            isOrangeMode
              ? 'border-orange-500/50 bg-orange-500/10 text-orange-600 dark:text-orange-400 shadow-sm font-bold text-xs'
              : 'border-border text-muted-foreground hover:bg-muted hover:text-foreground font-medium text-xs'
          }`}
          aria-label="Toggle Orange Theme Mode"
          title={isOrangeMode ? 'Orange Theme Active' : 'Switch to Orange Theme'}
        >
          <Flame className={`h-4 w-4 ${isOrangeMode ? 'fill-orange-500 text-orange-500' : ''}`} />
          <span className="hidden md:inline">Orange</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-700" />}
        </button>

        {/* Notifications Icon Button */}
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          aria-label="View notifications"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        </button>

        {/* User Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 rounded-xl border border-border p-1.5 pr-2.5 hover:bg-muted/60 transition-colors"
            aria-expanded={dropdownOpen}
            aria-label="User menu"
          >
            {photoURL ? (
              <img
                src={photoURL}
                alt={displayName}
                className="h-7 w-7 rounded-full object-cover ring-1 ring-primary/30"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                {getInitials(displayName)}
              </div>
            )}
            <span className="hidden sm:inline-block text-xs font-semibold text-foreground max-w-[100px] truncate">
              {displayName}
            </span>
            <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card p-1.5 shadow-xl shadow-slate-900/10 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/settings');
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                <UserIcon className="h-4 w-4 text-muted-foreground" />
                Profile
              </button>
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  navigate('/settings');
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
              >
                <SettingsIcon className="h-4 w-4 text-muted-foreground" />
                Settings
              </button>

              <div className="my-1 border-t border-border" />

              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
