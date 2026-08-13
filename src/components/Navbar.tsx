import React from 'react';
import { SyncBadge } from './SyncBadge';
import { RoleSwitcher } from './RoleSwitcher';

export const Navbar: React.FC = () => {
  return (
    <header className="md:hidden sticky top-0 z-40 bg-cafe-surface/95 backdrop-blur border-b border-cafe-border px-4 py-2.5 shadow-xs">
      <div className="flex items-center justify-between">
        {/* Brand Header */}
        <div className="flex items-center space-x-2.5">
          <img
            src="/logo.jpg"
            alt="Dessert Nation"
            className="w-8 h-8 object-contain rounded-md bg-cafe-subtle p-0.5 border border-cafe-border"
          />
          <div>
            <h1 className="font-black text-xs text-cafe-text tracking-tight leading-none">DESSERT NATION</h1>
            <p className="text-[9px] font-bold text-cafe-caramel uppercase tracking-widest mt-0.5">Ashta • POS</p>
          </div>
        </div>

        {/* Sync Status & Role Switcher */}
        <div className="flex items-center space-x-2">
          <SyncBadge />
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
};
