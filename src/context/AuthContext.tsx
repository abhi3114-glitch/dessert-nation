import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, Business } from '../types/pos';
import { DEFAULT_USERS, DEFAULT_BUSINESS } from '../data/defaultMenu';
import { localDB } from '../db/indexedDB';
import { createPasswordHash, verifyPassword } from '../db/crypto';
import {
  isSupabaseConfigured,
  sbFetchUsers,
  sbUpsertUser,
  sbUpdateUserStatus,
  sbDeleteUser,
} from '../db/supabase';

interface AuthContextType {
  currentUser: User | null;
  currentBusiness: Business;
  users: User[];
  login: (phoneOrEmail: string, password?: string) => Promise<boolean>;
  logout: () => void;
  switchUser: (userId: string) => void;
  addUser: (userData: { name: string; email: string; role: 'owner' | 'employee'; phone?: string; password?: string }) => Promise<User>;
  toggleUserStatus: (userId: string) => Promise<void>;
  updateUser: (userId: string, updates: { name?: string; phone?: string; password?: string }) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(DEFAULT_USERS);
  const usersRef = useRef<User[]>(DEFAULT_USERS);

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('dn_pos_current_user');
      if (saved) {
        const parsed = JSON.parse(saved) as User;
        if (parsed && parsed.id && parsed.role) return parsed;
      }
    } catch (e) {}
    return null;
  });

  const [currentBusiness] = useState<Business>(DEFAULT_BUSINESS);

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

      // Only keep users that have real credentials (hash or legacy plain text)
      dbUsers = dbUsers.filter((u) => u.phone && (u.passwordHash || u.password));

      if (dbUsers.length > 0) {
        // Migrate any legacy plain-text passwords to hashes
        dbUsers = await migratePasswordsToHash(dbUsers);
        setUsers(dbUsers);
        usersRef.current = dbUsers;

        if (currentUser) {
          const found = dbUsers.find((u) => u.id === currentUser.id);
          if (!found || !found.active) {
            setCurrentUser(null);
            localStorage.removeItem('dn_pos_current_user');
          } else {
            setCurrentUser(found);
            localStorage.setItem('dn_pos_current_user', JSON.stringify(found));
          }
        }
      }

      // 2. If Supabase online, fetch cloud users as source of truth
      if (isSupabaseConfigured && navigator.onLine) {
        const sbUsers = await sbFetchUsers();
        const realSbUsers = sbUsers.filter((u) => u.phone && (u.passwordHash || u.password));

        if (realSbUsers.length > 0) {
          // Migrate any cloud users that still have plain-text passwords
          const migratedSbUsers = await migratePasswordsToHash(realSbUsers);

          setUsers(migratedSbUsers);
          usersRef.current = migratedSbUsers;
          for (const u of migratedSbUsers) {
            await localDB.saveUser(u);
            // Push migrated hash back to Supabase if it changed
            if (!u.passwordHash || u.password) {
              sbUpsertUser(u).catch(console.error);
            }
          }

          if (currentUser) {
            const found = migratedSbUsers.find((u) => u.id === currentUser.id);
            if (!found || !found.active) {
              setCurrentUser(null);
              localStorage.removeItem('dn_pos_current_user');
            } else {
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

  /**
   * Migrate any users still storing plain-text passwords to SHA-256 hashes.
   * After migration, `password` field is cleared — only hash+salt remain.
   */
  const migratePasswordsToHash = async (userList: User[]): Promise<User[]> => {
    const migrated: User[] = [];
    for (const u of userList) {
      if (!u.passwordHash && u.password) {
        // Hash the plain text password
        const { passwordHash, passwordSalt } = await createPasswordHash(u.password);
        const upgraded: User = { ...u, passwordHash, passwordSalt, password: undefined };
        await localDB.saveUser(upgraded);
        migrated.push(upgraded);
      } else {
        migrated.push(u);
      }
    }
    return migrated;
  };

  /**
   * Login — works offline (compares against cached hash in IndexedDB).
   * Uses SHA-256 hash comparison, never plain text.
   */
  const login = async (phoneOrEmail: string, password?: string): Promise<boolean> => {
    const query = phoneOrEmail.trim().toLowerCase().replace(/[\s\-\+]/g, '');
    const currentUsers = usersRef.current;

    for (const u of currentUsers) {
      if (!u.active) continue;

      const cleanPhone = (u.phone || '').replace(/[\s\-\+]/g, '').toLowerCase();
      const cleanEmail = (u.email || '').toLowerCase();
      const isMatch = cleanPhone === query || cleanPhone.endsWith(query) || cleanEmail === query;
      if (!isMatch) continue;

      if (password) {
        let passwordOk = false;

        if (u.passwordHash && u.passwordSalt) {
          // Secure: compare against stored hash
          passwordOk = await verifyPassword(password, u.passwordHash, u.passwordSalt);
        } else if (u.password) {
          // Legacy fallback (will be migrated on next loadUsers)
          passwordOk = password === u.password;
        }

        if (!passwordOk) return false;
      }

      setCurrentUser(u);
      localStorage.setItem('dn_pos_current_user', JSON.stringify(u));
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
    // Hash the password before storing — never save plain text
    const rawPassword = userData.password || 'changeme123';
    const { passwordHash, passwordSalt } = await createPasswordHash(rawPassword);

    const newUser: User = {
      id: `user_${Date.now()}`,
      businessId: currentBusiness.id,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      phone: userData.phone || '',
      passwordHash,
      passwordSalt,
      password: undefined, // never store plain text
      active: true,
      createdAt: new Date().toISOString(),
    };

    await localDB.saveUser(newUser);
    setUsers((prev) => [...prev, newUser]);
    usersRef.current = [...usersRef.current, newUser];

    if (isSupabaseConfigured) {
      sbUpsertUser(newUser).catch(console.error);
    }

    return newUser;
  };

  const toggleUserStatus = async (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    const updatedUser = { ...target, active: !target.active };
    await localDB.saveUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
    usersRef.current = usersRef.current.map((u) => (u.id === userId ? updatedUser : u));

    if (isSupabaseConfigured) {
      sbUpdateUserStatus(userId, updatedUser.active).catch(console.error);
    }
  };

  const updateUser = async (
    userId: string,
    updates: { name?: string; phone?: string; password?: string }
  ) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;

    let updatedUser: User = { ...target };
    if (updates.name !== undefined) updatedUser.name = updates.name;
    if (updates.phone !== undefined) updatedUser.phone = updates.phone;

    // If password is being changed, hash it — never store plain text
    if (updates.password) {
      const { passwordHash, passwordSalt } = await createPasswordHash(updates.password);
      updatedUser = { ...updatedUser, passwordHash, passwordSalt, password: undefined };
    }

    await localDB.saveUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
    usersRef.current = usersRef.current.map((u) => (u.id === userId ? updatedUser : u));

    if (currentUser?.id === userId) {
      setCurrentUser(updatedUser);
      localStorage.setItem('dn_pos_current_user', JSON.stringify(updatedUser));
    }

    if (isSupabaseConfigured) {
      sbUpsertUser(updatedUser).catch(console.error);
    }
  };

  const deleteUser = async (userId: string) => {
    await localDB.deleteUser(userId);
    const remaining = users.filter((u) => u.id !== userId);
    setUsers(remaining);
    usersRef.current = remaining;

    if (isSupabaseConfigured) {
      sbDeleteUser(userId).catch(console.error);
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
        updateUser,
        deleteUser,
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
