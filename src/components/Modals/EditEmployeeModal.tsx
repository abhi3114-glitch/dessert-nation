import React, { useState } from 'react';
import { User } from '../../types/pos';
import { X, Save, Trash2, Eye, EyeOff, AlertTriangle } from 'lucide-react';

interface EditEmployeeModalProps {
  user: User;
  isOpen: boolean;
  isSelf: boolean;
  onClose: () => void;
  onSave: (updates: { name?: string; phone?: string; password?: string }) => void;
  onDelete: () => void;
}

export const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({
  user,
  isOpen,
  isSelf,
  onClose,
  onSave,
  onDelete,
}) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    setError('');
    if (!name.trim()) { setError('Name cannot be empty.'); return; }
    if (newPassword && newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (newPassword && newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }

    const updates: { name?: string; phone?: string; password?: string } = {};
    if (name.trim() !== user.name) updates.name = name.trim();
    if (phone.trim() !== (user.phone || '')) updates.phone = phone.trim();
    if (newPassword) updates.password = newPassword;

    onSave(updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-cafe-surface border border-cafe-border rounded-md w-full max-w-sm shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cafe-border">
          <div>
            <h3 className="font-black text-cafe-text text-sm">Edit Account</h3>
            <p className="text-[11px] text-cafe-muted">{isSelf ? 'Your account' : user.name}</p>
          </div>
          <button onClick={onClose} className="text-cafe-muted hover:text-cafe-text transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 text-xs">
          {error && (
            <div className="p-2 bg-cafe-danger/10 border border-cafe-danger/30 text-cafe-danger font-bold rounded-xs text-center">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-cafe-text font-bold mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-cafe-subtle border border-cafe-border rounded-xs px-3 py-2 text-cafe-text font-bold placeholder-cafe-muted focus:border-cafe-caramel outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-cafe-text font-bold mb-1">Mobile Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="10-digit number"
              className="w-full bg-cafe-subtle border border-cafe-border rounded-xs px-3 py-2 text-cafe-text font-bold placeholder-cafe-muted focus:border-cafe-caramel outline-none"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-cafe-text font-bold mb-1">New Password <span className="text-cafe-muted font-normal">(leave blank to keep current)</span></label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full bg-cafe-subtle border border-cafe-border rounded-xs pl-3 pr-9 py-2 text-cafe-text font-bold placeholder-cafe-muted focus:border-cafe-caramel outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2.5 top-2 text-cafe-muted hover:text-cafe-text"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          {newPassword && (
            <div>
              <label className="block text-cafe-text font-bold mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full bg-cafe-subtle border border-cafe-border rounded-xs pl-3 pr-9 py-2 text-cafe-text font-bold placeholder-cafe-muted focus:border-cafe-caramel outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-2.5 top-2 text-cafe-muted hover:text-cafe-text"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cafe-border space-y-2">
          <button
            onClick={handleSave}
            className="w-full bg-cafe-caramel hover:bg-cafe-caramel-hover text-white font-black py-2.5 rounded-xs text-xs flex items-center justify-center space-x-2 transition"
          >
            <Save className="w-4 h-4" />
            <span>Save Changes</span>
          </button>

          {/* Delete — not allowed if editing own account or if only 1 user */}
          {!isSelf && (
            <>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full border border-cafe-danger/40 text-cafe-danger hover:bg-cafe-danger/10 font-bold py-2.5 rounded-xs text-xs flex items-center justify-center space-x-2 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
              ) : (
                <div className="p-3 bg-cafe-danger/10 border border-cafe-danger/30 rounded-xs space-y-2">
                  <div className="flex items-center space-x-2 text-cafe-danger font-bold">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Delete {user.name}? This cannot be undone.</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 border border-cafe-border text-cafe-muted font-bold py-1.5 rounded-xs text-xs transition hover:bg-cafe-subtle"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => { onDelete(); onClose(); }}
                      className="flex-1 bg-cafe-danger text-white font-black py-1.5 rounded-xs text-xs transition hover:opacity-90"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
