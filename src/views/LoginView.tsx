import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Lock, Phone, ArrowRight, ShieldCheck, UserCheck, Smartphone } from 'lucide-react';

interface LoginViewProps {
  onSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const { users, login, switchUser } = useAuth();
  const [phoneOrEmail, setPhoneOrEmail] = useState('9876543210');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = login(phoneOrEmail, password);
    if (success) {
      onSuccess();
    } else {
      setErrorMsg('Invalid phone number/password or inactive account');
    }
  };

  const handleQuickDemoSwitch = (userId: string) => {
    switchUser(userId);
    onSuccess();
  };

  return (
    <div className="min-h-screen bg-cafe-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-cafe-surface border border-cafe-border rounded-md p-6 shadow-sm space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <img
            src="/logo.jpg"
            alt="Dessert Nation"
            className="w-14 h-14 object-contain rounded-sm mx-auto bg-cafe-subtle p-1 border border-cafe-border"
          />
          <div>
            <h1 className="text-xl font-black text-cafe-text tracking-tight">DESSERT NATION</h1>
            <p className="text-[10px] text-cafe-caramel font-bold uppercase tracking-widest mt-0.5">Ashta • Mobile Café POS</p>
          </div>
          <p className="text-xs text-cafe-muted pt-1 font-medium">Sign in with phone number & password</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMsg && (
            <div className="p-2.5 bg-cafe-danger/10 border border-cafe-danger/30 text-cafe-danger font-bold rounded-xs text-center">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-cafe-text font-bold mb-1">Mobile Phone / Email</label>
            <div className="relative">
              <input
                type="text"
                required
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full bg-cafe-subtle border border-cafe-border rounded-xs pl-9 pr-3 py-2.5 text-cafe-text font-bold placeholder-cafe-muted focus:border-cafe-caramel"
              />
              <Phone className="w-4 h-4 text-cafe-muted absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-cafe-text font-bold mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-cafe-subtle border border-cafe-border rounded-xs pl-9 pr-3 py-2.5 text-cafe-text font-bold placeholder-cafe-muted focus:border-cafe-caramel"
              />
              <Lock className="w-4 h-4 text-cafe-muted absolute left-3 top-3" />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 text-cafe-muted cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-cafe-caramel rounded"
              />
              <span>Remember session on this phone</span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-cafe-caramel hover:bg-cafe-caramel-hover text-white font-black py-3 px-4 rounded-xs text-sm flex items-center justify-center space-x-2 shadow-2xs transition active:scale-98"
          >
            <span>Sign In to Café Account</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </form>

        {/* Quick Account Switcher for Mobile Demo */}
        <div className="pt-2 border-t border-cafe-border space-y-2">
          <p className="text-[9px] font-bold uppercase text-cafe-muted text-center tracking-widest">
            ONE-TAP QUICK LOGIN (DEMO ACCOUNTS)
          </p>
          <div className="space-y-1.5">
            {users.map((u) => (
              <button
                key={u.id}
                onClick={() => handleQuickDemoSwitch(u.id)}
                className="w-full flex items-center justify-between p-2 rounded-xs bg-cafe-subtle/60 border border-cafe-border hover:border-cafe-caramel/50 text-xs transition"
              >
                <div className="flex items-center space-x-2 text-left">
                  {u.role === 'owner' ? (
                    <ShieldCheck className="w-4 h-4 text-cafe-caramel shrink-0" />
                  ) : (
                    <UserCheck className="w-4 h-4 text-cafe-sage shrink-0" />
                  )}
                  <div>
                    <p className="font-bold text-cafe-text">{u.name}</p>
                    <p className="text-[10px] text-cafe-muted">Phone: <strong className="text-cafe-text">{u.phone}</strong> • Pass: password123</p>
                  </div>
                </div>
                <span className="text-[9px] uppercase font-bold text-cafe-caramel px-2 py-0.5 rounded-xs bg-cafe-surface border border-cafe-border">
                  {u.role}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
