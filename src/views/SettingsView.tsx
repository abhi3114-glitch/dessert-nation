import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { syncEngine } from '../db/syncEngine';
import { Coffee, RefreshCw, Smartphone, Download, Database, ShieldCheck, CheckCircle2, Wifi, Globe, Signal } from 'lucide-react';

interface SyncStatusState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt?: string;
  message?: string;
}

export const SettingsView: React.FC = () => {
  const { currentBusiness, currentUser } = useAuth();
  const { refreshData } = useOrders();
  const [syncStatus, setSyncStatus] = useState<SyncStatusState>(syncEngine.getStatus());
  const [isSyncing, setIsSyncing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const localHostUrl = window.location.href;

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
    setMessage('Synchronization completed successfully!');
    setTimeout(() => setMessage(null), 3000);
    setIsSyncing(false);
  };

  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 max-w-3xl mx-auto">
      {/* Header */}
      <div className="border-b border-cafe-border pb-4">
        <h2 className="text-2xl font-black text-cafe-text">Settings & Mobile Setup</h2>
        <p className="text-xs text-cafe-muted font-medium">Mobile network setup, PWA installation & sync engine</p>
      </div>

      {/* Café Details */}
      <div className="bg-cafe-surface p-5 rounded-sm border border-cafe-border space-y-3">
        <div className="flex items-center space-x-3">
          <img
            src="/logo.jpg"
            alt="Dessert Nation"
            className="w-12 h-12 object-contain rounded-sm bg-cafe-subtle p-1 border border-cafe-border"
          />
          <div>
            <h3 className="font-black text-base text-cafe-text">{currentBusiness?.name || 'Dessert Nation'}</h3>
            <p className="text-xs text-cafe-caramel font-bold">{currentBusiness?.location || 'Ashta, Madhya Pradesh'}</p>
          </div>
        </div>
      </div>

      {/* Mobile Network (4G/5G Data) & Hotspot Setup Guide */}
      <div className="bg-cafe-surface p-5 rounded-sm border border-cafe-border space-y-4">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-cafe-text flex items-center space-x-2">
          <Signal className="w-4 h-4 text-cafe-caramel" />
          <span>MOBILE NETWORK SETUP (FOR PHONES WITHOUT WI-FI ROUTER)</span>
        </h3>

        <p className="text-xs text-cafe-muted leading-relaxed">
          If your café does not have a Wi-Fi router, you can connect phones using either of these two simple options:
        </p>

        {/* Option 1: Mobile Hotspot */}
        <div className="bg-cafe-subtle p-3.5 rounded-xs border border-cafe-border space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-cafe-caramel font-bold">
            <Wifi className="w-4 h-4 shrink-0" />
            <span>OPTION 1: MOBILE HOTSPOT (NO WI-FI ROUTER NEEDED)</span>
          </div>
          <p className="text-cafe-text leading-relaxed">
            1. Turn ON <strong>Personal Hotspot</strong> on one phone (e.g. Owner's phone).<br />
            2. Connect other employee phones to that hotspot.<br />
            3. Open the app link on employee phones: <strong className="text-cafe-caramel font-mono">{localHostUrl}</strong>
          </p>
        </div>

        {/* Option 2: Live Public Web Link */}
        <div className="bg-cafe-subtle p-3.5 rounded-xs border border-cafe-border space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-cafe-caramel font-bold">
            <Globe className="w-4 h-4 shrink-0" />
            <span>OPTION 2: LIVE PUBLIC WEB LINK (WORKS OVER 4G/5G CELLULAR DATA ANYWHERE)</span>
          </div>
          <p className="text-cafe-text leading-relaxed">
            Run a public tunnel or host on Vercel / Render so employees can open the app directly on Jio / Airtel 4G / 5G mobile data from anywhere in Ashta.
          </p>
          <div className="font-mono text-[11px] bg-white p-2 rounded-xs border border-cafe-border text-cafe-text">
            npx localtunnel --port 5173
          </div>
        </div>

        {/* PWA Home Screen Installation Steps */}
        <div className="bg-cafe-subtle/40 p-3.5 rounded-xs border border-cafe-border space-y-2 text-xs text-cafe-text">
          <span className="text-[10px] font-black uppercase text-cafe-caramel tracking-wider block">HOW TO INSTALL AS A PHONE APP:</span>
          <p><strong>1. Android (Chrome):</strong> Open URL → tap menu (⋮) → select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.</p>
          <p><strong>2. iPhone (Safari):</strong> Open URL → tap Share icon (⎋) → select <strong>"Add to Home Screen"</strong>.</p>
          <p className="text-[11px] text-cafe-muted pt-1">The app will launch full-screen like a native Android/iOS mobile application with offline-first local storage!</p>
        </div>
      </div>

      {/* Offline Storage & Sync Engine */}
      <div className="bg-cafe-surface p-5 rounded-sm border border-cafe-border space-y-3">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-cafe-text flex items-center space-x-2">
          <Database className="w-4 h-4 text-cafe-caramel" />
          <span>OFFLINE STORAGE & CLOUD SYNC ENGINE</span>
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between bg-cafe-subtle/60 p-2.5 rounded-xs border border-cafe-border">
            <span className="text-cafe-muted font-semibold">Network Connection</span>
            <span
              className={`font-bold ${
                syncStatus.isOnline ? 'text-cafe-sage' : 'text-amber-800'
              }`}
            >
              {syncStatus.isOnline ? 'Online · All systems active' : 'Offline · Orders saved on this phone'}
            </span>
          </div>

          <div className="flex items-center justify-between bg-cafe-subtle/60 p-2.5 rounded-xs border border-cafe-border">
            <span className="text-cafe-muted font-semibold">Sync Status</span>
            <span className="font-extrabold text-cafe-caramel">
              {syncStatus.pendingCount === 0 ? 'All orders synced ✓' : `${syncStatus.pendingCount} Saved · Waiting to sync`}
            </span>
          </div>

          {syncStatus.lastSyncedAt && (
            <div className="flex items-center justify-between bg-cafe-subtle/60 p-2.5 rounded-xs border border-cafe-border">
              <span className="text-cafe-muted font-semibold">Last Cloud Sync</span>
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
            <span>{isSyncing ? 'Syncing...' : 'Force Sync Orders'}</span>
          </button>

          <button
            onClick={async () => {
              setIsSyncing(true);
              await refreshData();
              setMessage('Full 60+ Menu Catalog reloaded!');
              setTimeout(() => setMessage(null), 3000);
              setIsSyncing(false);
            }}
            disabled={isSyncing}
            className="bg-cafe-caramel hover:bg-cafe-caramel-hover text-white font-bold py-2.5 px-3 rounded-xs text-xs flex items-center justify-center space-x-1.5 shadow-2xs transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Menu Catalog</span>
          </button>
        </div>
      </div>
    </div>
  );
};
