import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { syncEngine } from '../db/syncEngine';
import { TabType } from '../components/BottomNav';
import {
  RefreshCw,
  Database,
  CheckCircle2,
  BarChart3,
  Users,
  ChevronRight,
  Store,
} from 'lucide-react';

interface SyncStatusState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt?: string;
  message?: string;
}

interface SettingsViewProps {
  onNavigate?: (tab: TabType) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onNavigate }) => {
  const { currentBusiness, currentUser } = useAuth();
  const { refreshData } = useOrders();
  const [syncStatus, setSyncStatus] = useState<SyncStatusState>(syncEngine.getStatus());
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isOwner = currentUser?.role === 'owner';

  useEffect(() => {
    const unsubscribe = syncEngine.subscribe((status) => {
      setSyncStatus(status);
    });
    return () => unsubscribe();
  }, []);

  const handleForceSync = async () => {
    setIsSyncing(true);
    await syncEngine.triggerSync();
    await refreshData();
    setMessage('Synchronization completed!');
    setTimeout(() => setMessage(null), 3000);
    setIsSyncing(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-5 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="border-b border-cafe-border pb-4">
        <h2 className="text-2xl font-black text-cafe-text">Settings</h2>
        <p className="text-xs text-cafe-muted font-medium">App configuration & sync</p>
      </div>

      {/* Owner-only Quick Navigation — shown on mobile where sidebar is hidden */}
      {isOwner && (
        <div className="md:hidden bg-cafe-surface border border-cafe-border rounded-sm divide-y divide-cafe-border">
          <p className="text-[10px] font-black uppercase tracking-widest text-cafe-muted px-4 pt-3 pb-2">Owner Tools</p>

          <button
            onClick={() => onNavigate?.('reports')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-cafe-subtle/40 transition text-left"
          >
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-4 h-4 text-cafe-caramel" />
              <div>
                <p className="text-xs font-bold text-cafe-text">Sales Reports</p>
                <p className="text-[10px] text-cafe-muted">Date-wise earnings & analytics</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-cafe-muted" />
          </button>

          <button
            onClick={() => onNavigate?.('staff')}
            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-cafe-subtle/40 transition text-left"
          >
            <div className="flex items-center space-x-3">
              <Users className="w-4 h-4 text-cafe-caramel" />
              <div>
                <p className="text-xs font-bold text-cafe-text">Employees</p>
                <p className="text-[10px] text-cafe-muted">Manage accounts & passwords</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-cafe-muted" />
          </button>
        </div>
      )}

      {/* Café Details */}
      <div className="bg-cafe-surface p-4 rounded-sm border border-cafe-border flex items-center space-x-3">
        <img
          src="/logo.jpg"
          alt="Dessert Nation"
          className="w-11 h-11 object-contain rounded-sm bg-cafe-subtle p-1 border border-cafe-border"
        />
        <div>
          <div className="flex items-center space-x-2">
            <Store className="w-3.5 h-3.5 text-cafe-caramel" />
            <h3 className="font-black text-sm text-cafe-text">{currentBusiness?.name || 'Dessert Nation'}</h3>
          </div>
          <p className="text-xs text-cafe-caramel font-bold mt-0.5">{currentBusiness?.location || 'Ashta, Madhya Pradesh'}</p>
          <p className="text-[10px] text-cafe-muted mt-0.5">
            Logged in as <span className="font-bold text-cafe-text">{currentUser?.name}</span> ({currentUser?.role})
          </p>
        </div>
      </div>

      {/* Sync Engine */}
      <div className="bg-cafe-surface p-5 rounded-sm border border-cafe-border space-y-3">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-cafe-text flex items-center space-x-2">
          <Database className="w-4 h-4 text-cafe-caramel" />
          <span>Cloud Sync Status</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between bg-cafe-subtle/60 p-2.5 rounded-xs border border-cafe-border">
            <span className="text-cafe-muted font-semibold">Connection</span>
            <span className={`font-bold ${syncStatus.isOnline ? 'text-cafe-sage' : 'text-amber-700'}`}>
              {syncStatus.isOnline ? '🟢 Online' : '🔴 Offline'}
            </span>
          </div>

          <div className="flex items-center justify-between bg-cafe-subtle/60 p-2.5 rounded-xs border border-cafe-border">
            <span className="text-cafe-muted font-semibold">Pending Orders</span>
            <span className={`font-extrabold ${syncStatus.pendingCount === 0 ? 'text-cafe-sage' : 'text-cafe-caramel'}`}>
              {syncStatus.pendingCount === 0 ? 'All synced ✓' : `${syncStatus.pendingCount} waiting`}
            </span>
          </div>

          {syncStatus.lastSyncedAt && (
            <div className="flex items-center justify-between bg-cafe-subtle/60 p-2.5 rounded-xs border border-cafe-border">
              <span className="text-cafe-muted font-semibold">Last Sync</span>
              <span className="font-mono text-cafe-text font-bold">
                {new Date(syncStatus.lastSyncedAt).toLocaleTimeString()}
              </span>
            </div>
          )}
        </div>

        {message && (
          <div className="p-2.5 bg-cafe-sage/15 text-cafe-sage text-xs font-bold rounded-xs border border-cafe-sage/30 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={handleForceSync}
            disabled={isSyncing}
            className="bg-cafe-subtle hover:bg-cafe-border text-cafe-text font-bold py-2.5 px-3 rounded-xs text-xs flex items-center justify-center space-x-1.5 border border-cafe-border transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cafe-caramel' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Force Sync'}</span>
          </button>

          <button
            onClick={async () => {
              setIsSyncing(true);
              await refreshData();
              setMessage('Menu catalog reloaded!');
              setTimeout(() => setMessage(null), 3000);
              setIsSyncing(false);
            }}
            disabled={isSyncing}
            className="bg-cafe-caramel hover:bg-cafe-caramel-hover text-white font-bold py-2.5 px-3 rounded-xs text-xs flex items-center justify-center space-x-1.5 shadow-2xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
