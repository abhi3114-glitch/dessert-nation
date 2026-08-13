import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, UserPlus } from 'lucide-react';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ isOpen, onClose }) => {
  const { addUser } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'owner' | 'employee'>('employee');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await addUser({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role,
      });

      setName('');
      setEmail('');
      setPhone('');
      onClose();
    } catch (e) {
      console.error('Failed to add employee:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-choco-950/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-choco-900 border border-choco-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-choco-950 border-b border-choco-800">
          <div className="flex items-center space-x-2">
            <UserPlus className="w-4 h-4 text-caramel-400" />
            <h3 className="font-bold text-cream-50 text-sm">Add New Staff Member</h3>
          </div>
          <button onClick={onClose} className="p-1 text-choco-500 hover:text-cream-50">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs">
          <div>
            <label className="block font-bold text-cream-100 mb-1">Staff Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Aman Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-choco-950 border border-choco-700 rounded-xl px-3 py-2 text-cream-50 placeholder-choco-500 focus:outline-none focus:border-caramel-400"
            />
          </div>

          <div>
            <label className="block font-bold text-cream-100 mb-1">Email / Username</label>
            <input
              type="email"
              required
              placeholder="aman@dessertnation.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-choco-950 border border-choco-700 rounded-xl px-3 py-2 text-cream-50 placeholder-choco-500 focus:outline-none focus:border-caramel-400"
            />
          </div>

          <div>
            <label className="block font-bold text-cream-100 mb-1">Phone Number (Optional)</label>
            <input
              type="tel"
              placeholder="+91 98765 00000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-choco-950 border border-choco-700 rounded-xl px-3 py-2 text-cream-50 placeholder-choco-500 focus:outline-none focus:border-caramel-400"
            />
          </div>

          <div>
            <label className="block font-bold text-cream-100 mb-1">Role & Access Level</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('employee')}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  role === 'employee'
                    ? 'bg-caramel-500 text-choco-950 border-caramel-400 shadow'
                    : 'bg-choco-950 text-cream-200 border-choco-800'
                }`}
              >
                Employee (Counter POS)
              </button>
              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  role === 'owner'
                    ? 'bg-caramel-500 text-choco-950 border-caramel-400 shadow'
                    : 'bg-choco-950 text-cream-200 border-choco-800'
                }`}
              >
                Owner (Full Admin)
              </button>
            </div>
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-choco-800 hover:bg-choco-700 text-cream-100 font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-gradient-to-r from-caramel-500 to-amber-500 text-choco-950 font-black rounded-xl shadow-md"
            >
              {isSubmitting ? 'Adding...' : 'Add Staff Member'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
