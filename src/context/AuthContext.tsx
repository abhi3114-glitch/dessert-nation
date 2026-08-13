import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, Business } from '../types/pos';
import { DEFAULT_USERS, DEFAULT_BUSINESS } from '../data/defaultMenu';
import { localDB } from '../db/indexedDB';
import {
  isSupabaseConfigured,
  sbFetchUsers,
  sbUpsertUser,
  sbUpdateUserStatus,
} from '../db/supabase';

interface AuthContextType {
  currentUser: User | null;
  currentBusiness: Business;
  users: User[];
  login: (phoneOrEmail: string, password?: string) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  addUser: (userData: { name: string; email: string; role: 'owner' | 'employee'; phone?: string; password?: string }) => Promise<User>;
  toggleUserStatus: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  // Keep a ref so login() always reads the latest users without stale closure
  const usersRef = useRef<User[]>(DEFAULT_USERS);

  // Start with null — require explicit login
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('dn_pos_current_user');
      if (saved) {
        const parsed = JSON.parse(saved) as User;
        // Validate the saved user still looks like a User object
        if (parsed && parsed.id && parsed.role) return parsed;
      }
    } catch (e) {}
    return null;
  });

  const [currentBusiness] = useState<Business>(DEFAULT_BUSINESS);

  // Keep usersRef in sync whenever users state changes
  useEffect(() => {
    usersRef.current = users;
  }, [users]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // 1. Load from IndexedDB first (offline-first)
      let dbUsers = await localDB.getUsers();

      if (dbUsers.length === 0) {
        // First launch: seed DEFAULT_USERS into IndexedDB so offline login works
        for (const u of DEFAULT_USERS) {
          await localDB.saveUser(u);
        }
        dbUsers = DEFAULT_USERS;
      }

      setUsers(dbUsers);
      usersRef.current = dbUsers;

      if (currentUser) {
        const found = dbUsers.find((u) => u.id === currentUser.id);
        if (found) {
          setCurrentUser(found);
          localStorage.setItem('dn_pos_current_user', JSON.stringify(found));
        }
      }

      // 2. If Supabase is configured, fetch from cloud
      if (isSupabaseConfigured && navigator.onLine) {
        const sbUsers = await sbFetchUsers();

        if (sbUsers.length === 0) {
          // First launch on cloud: seed default users into Supabase
          for (const u of DEFAULT_USERS) {
            await sbUpsertUser(u);
          }
          setUsers(DEFAULT_USERS);
          usersRef.current = DEFAULT_USERS;
        } else {
          // Use cloud users, cache locally
          setUsers(sbUsers);
          usersRef.current = sbUsers;
          for (const u of sbUsers) await localDB.saveUser(u);

          // Update currentUser if they appear in cloud list
          if (currentUser) {
            const found = sbUsers.find((u) => u.id === currentUser.id);
            if (found) {
              setCurrentUser(found);
              localStorage.setItem('dn_pos_current_user', JSON.stringify(found));
            }
          }
        }
      }
    } catch (e) {
      console.error('Failed to load users:', e);
    }
  };

  const login = (phoneOrEmail: string, password?: string): boolean => {
    const query = phoneOrEmail.trim().toLowerCase().replace(/[\s\-\+]/g, '');

    // Always read from ref to avoid stale closure bug
    const currentUsers = usersRef.current;

    const user = currentUsers.find((u) => {
      if (!u.active) return false;
      const cleanPhone = (u.phone || '').replace(/[\s\-\+]/g, '').toLowerCase();
      const cleanEmail = (u.email || '').toLowerCase();

      const isMatch = cleanPhone === query || cleanPhone.endsWith(query) || cleanEmail === query;
      if (!isMatch) return false;

      if (password) {
        const targetPass = u.password || 'password123';
        return password === targetPass;
      }
      return true;
    });

    if (user) {
      setCurrentUser(user);
      localStorage.setItem('dn_pos_current_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('dn_pos_current_user');
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem('dn_pos_current_user', JSON.stringify(target));
    }
  };

  const addUser = async (userData: {
    name: string;
    email: string;
    role: 'owner' | 'employee';
    phone?: string;
    password?: string;
  }): Promise<User> => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      businessId: currentBusiness.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone || '',
      password: userData.password || 'password123',
      active: true,
      createdAt: new Date().toISOString(),
    };

    await localDB.saveUser(newUser);
    setUsers((prev) => [...prev, newUser]);

    if (isSupabaseConfigured) {
      sbUpsertUser(newUser).catch(console.error);
    } else {
      fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      }).catch(() => {});
    }

    return newUser;
  };

  const toggleUserStatus = async (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const updatedUser = { ...target, active: !target.active };
    await localDB.saveUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));

    if (isSupabaseConfigured) {
      sbUpdateUserStatus(userId, updatedUser.active).catch(console.error);
    } else {
      fetch(`/api/employees/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: updatedUser.active }),
      }).catch(() => {});
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentBusiness,
        users,
        login,
        logout,
        switchUser,
        addUser,
        toggleUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
