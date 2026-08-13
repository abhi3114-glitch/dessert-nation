import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav, TabType } from './components/BottomNav';
import { DashboardView } from './views/DashboardView';
import { PosView } from './views/PosView';
import { OrdersView } from './views/OrdersView';
import { ProductsView } from './views/ProductsView';
import { ReportsView } from './views/ReportsView';
import { StaffView } from './views/StaffView';
import { SettingsView } from './views/SettingsView';
import { LoginView } from './views/LoginView';

const AppContent: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  if (!isLoggedIn) {
    return <LoginView onSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="min-h-screen bg-cafedark-950 text-cafedark-50 font-sans flex flex-col md:flex-row antialiased">
      {/* Desktop Left Sidebar (Section 7 & 36) */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header (Section 7) */}
        <Navbar />

        {/* Dynamic View Area */}
        <main className="flex-1">
          {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
          {activeTab === 'pos' && <PosView />}
          {activeTab === 'orders' && <OrdersView />}
          {activeTab === 'products' && <ProductsView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'staff' && <StaffView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Section 7) */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <AppContent />
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;
