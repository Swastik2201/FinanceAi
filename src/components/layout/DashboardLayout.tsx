import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userProfile?: {
    name: string;
    email: string;
    photoURL?: string | null;
  } | null;
  pageTitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  userProfile,
  pageTitle = 'Dashboard',
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Sidebar Component */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        userProfile={userProfile}
      />

      {/* Main Content Area */}
      <div className="flex flex-col min-h-screen lg:pl-64 transition-all duration-300">
        <Navbar
          onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
          pageTitle={pageTitle}
          userProfile={userProfile}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
