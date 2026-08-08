import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { setupApiInterceptors } from './services/api';

import { DashboardPage } from './pages/DashboardPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { SubscriptionsPage } from './pages/SubscriptionsPage';
import { BillSplitPage } from './pages/BillSplitPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

const AppRoutes: React.FC = () => {
  const { getIdToken, logout } = useAuth();

  useEffect(() => {
    setupApiInterceptors(getIdToken, () => {
      logout();
    });
  }, [getIdToken, logout]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/expenses" element={<ExpensesPage />} />
      <Route path="/subscriptions" element={<SubscriptionsPage />} />
      <Route path="/bill-split" element={<BillSplitPage />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
