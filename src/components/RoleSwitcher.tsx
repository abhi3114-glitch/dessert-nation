import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCheck, Shield, User } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const { currentUser, users, switchUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!currentUser) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-choco-800 hover:bg-choco-700 border border-choco-700 px-3 py-1.5 rounded-lg text-xs transition"
      >
        {currentUser.role === 'owner' ? (
          <Shield className="w-3.5 h-3.5 text-caramel-400" />
        ) : (
          <User className="w-3.5 h-3.5 text-blue-400" />
        )}
        <span className="font-semibold text-cream-50">{currentUser.name}</span>
        <span className="text-[10px] bg-choco-950 text-caramel-300 px-1.5 py-0.5 rounded font-mono uppercase">
          {currentUser.role}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-choco-900 border border-choco-700 rounded-xl shadow-2xl z-50 p-2 text-xs">
          <div className="text-[10px] uppercase font-bold text-choco-500 px-2 py-1 tracking-wider">
            Switch Account / Role
          </div>
          <div className="space-y-1 mt-1">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  switchUser(user.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition ${
                  currentUser.id === user.id ? 'bg-caramel-500/20 text-caramel-300 font-bold' : 'hover:bg-choco-800 text-cream-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {user.role === 'owner' ? (
                    <Shield className="w-3.5 h-3.5 text-caramel-400" />
                  ) : (
                    <User className="w-3.5 h-3.5 text-blue-400" />
                  )}
                  <span>{user.name}</span>
                </div>
                {currentUser.id === user.id && <UserCheck className="w-3.5 h-3.5 text-caramel-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
