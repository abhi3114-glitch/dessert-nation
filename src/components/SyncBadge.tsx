import React, { useState, useEffect } from 'react';
import { syncEngine } from '../db/syncEngine';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface SyncStatusState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt?: string;
  message?: string;
}

export const SyncBadge: React.FC = () => {
  const [syncStatus, setSyncStatus] = useState<SyncStatusState>(syncEngine.getStatus());

  useEffect(() => {
    const unsubscribe = syncEngine.subscribe((status) => {
      setSyncStatus(status);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex items-center space-x-2 text-xs font-semibold">
      {syncStatus.isSyncing ? (
        <div className="flex items-center space-x-1.5 bg-cafe-gold/20 text-amber-800 border border-cafe-gold/40 px-2.5 py-0.5 rounded-sm animate-pulse">
          <RefreshCw className="w-3 h-3 animate-spin text-cafe-caramel" />
          <span className="text-[11px]">Syncing...</span>
        </div>
      ) : syncStatus.isOnline ? (
        <div className="flex items-center space-x-1.5 bg-cafe-sage/15 text-cafe-sage border border-cafe-sage/30 px-2.5 py-0.5 rounded-sm">
          <span className="w-2 h-2 rounded-full bg-cafe-sage" />
          <span className="text-[11px] font-bold">Online</span>
        </div>
      ) : (
        <div className="flex items-center space-x-1.5 bg-cafe-subtle text-cafe-muted border border-cafe-border px-2.5 py-0.5 rounded-sm">
          <WifiOff className="w-3 h-3 text-cafe-muted" />
          <span className="text-[11px] font-medium">Offline</span>
        </div>
      )}

      {syncStatus.pendingCount > 0 && (
        <div className="bg-cafe-caramel text-white font-bold px-2 py-0.5 rounded-sm text-[10px]">
          {syncStatus.pendingCount} Pending Sync
        </div>
      )}
    </div>
  );
};
