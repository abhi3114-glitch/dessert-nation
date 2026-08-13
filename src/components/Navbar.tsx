import React, { useState } from 'react';
import { SyncBadge } from './SyncBadge';
import { LogOut, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <header className="md:hidden sticky top-0 z-40 bg-cafe-surface/95 backdrop-blur border-b border-cafe-border px-4 py-2.5 shadow-xs">
      <div className="flex items-center justify-between">
        {/* Brand + User Info */}
        <div className="flex items-center space-x-2.5">
          <img
            src="/logo.jpg"
            alt="Dessert Nation"
            className="w-8 h-8 object-contain rounded-md bg-cafe-subtle p-0.5 border border-cafe-border"
          />
          <div>
            <h1 className="font-black text-xs text-cafe-text tracking-tight leading-none">DESSERT NATION</h1>
            <p className="text-[9px] font-bold text-cafe-caramel uppercase tracking-widest mt-0.5">
              {currentUser?.name} • {currentUser?.role}
            </p>
          </div>
        </div>

        {/* Sync Status + Logout */}
        <div className="flex items-center space-x-2">
          <SyncBadge />

          {/* Logout button */}
          {!confirmLogout ? (
            <button
              onClick={() => setConfirmLogout(true)}
              className="p-1.5 rounded-sm text-cafe-muted hover:text-cafe-danger hover:bg-cafe-danger/10 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center space-x-1.5 bg-cafe-danger/10 border border-cafe-danger/30 rounded-sm px-2 py-1">
              <AlertTriangle className="w-3.5 h-3.5 text-cafe-danger shrink-0" />
              <span className="text-[10px] text-cafe-danger font-bold">Sign out?</span>
              <button
                onClick={() => { logout(); setConfirmLogout(false); }}
                className="text-[10px] bg-cafe-danger text-white font-black px-1.5 py-0.5 rounded-xs"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmLogout(false)}
                className="text-[10px] text-cafe-muted font-bold px-1 py-0.5"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

