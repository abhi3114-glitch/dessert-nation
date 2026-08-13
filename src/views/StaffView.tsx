import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { AddEmployeeModal } from '../components/Modals/AddEmployeeModal';
import { Users, Plus, ShieldCheck, UserCheck, CheckCircle2, XCircle } from 'lucide-react';

export const StaffView: React.FC = () => {
  const { users, toggleUserStatus, currentUser } = useAuth();
  const { orders = [] } = useOrders();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const isOwner = currentUser?.role === 'owner';
  const todayStr = new Date().toISOString().split('T')[0];
  const safeOrders = (orders || []).filter((o) => o && typeof o === 'object');

  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cafe-border pb-4">
        <div>
          <h2 className="text-2xl font-black text-cafe-text">Employees</h2>
          <p className="text-xs text-cafe-muted font-medium">Team accounts, roles & daily order metrics</p>
        </div>

        {isOwner && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1.5 bg-cafe-caramel hover:bg-cafe-caramel-hover text-white font-extrabold px-3.5 py-2 rounded-sm text-xs shadow-2xs transition"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Employee</span>
          </button>
        )}
      </div>

      {/* Employee List Cards */}
      <div className="space-y-3">
        {users.map((user) => {
          const userOrdersToday = safeOrders.filter((o) => {
            const created = String(o?.createdAt || o?.updatedAt || '');
            return o.createdByUserId === user.id && created.startsWith(todayStr);
          });
          const salesGeneratedToday = userOrdersToday.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

          return (
            <div
              key={user.id}
              className={`bg-cafe-surface border p-4 rounded-sm flex items-center justify-between transition ${
                !user.active ? 'opacity-60 border-cafe-border' : 'border-cafe-border hover:border-cafe-caramel/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-sm bg-cafe-subtle border border-cafe-border flex items-center justify-center font-black text-cafe-caramel text-sm">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="font-bold text-xs text-cafe-text">{user.name}</h4>
                    <span className="text-[9px] uppercase font-bold text-cafe-caramel px-1.5 py-0.2 rounded-xs bg-cafe-subtle border border-cafe-border">
                      {user.role}
                    </span>
                  </div>
                  <p className="text-[11px] text-cafe-muted mt-0.5">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-right text-xs">
                <div>
                  <span className="text-[10px] text-cafe-muted block uppercase font-bold">Orders Today</span>
                  <span className="font-black text-cafe-text">{userOrdersToday.length}</span>
                </div>

                <div>
                  <span className="text-[10px] text-cafe-muted block uppercase font-bold">Sales Today</span>
                  <span className="font-black text-cafe-caramel">₹{salesGeneratedToday}</span>
                </div>

                {isOwner && user.id !== currentUser?.id && (
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    className={`px-2.5 py-1 rounded-xs font-bold text-xs border transition ${
                      user.active
                        ? 'bg-cafe-sage/15 text-cafe-sage border-cafe-sage/30 hover:bg-cafe-sage/20'
                        : 'bg-cafe-danger/15 text-cafe-danger border-cafe-danger/30 hover:bg-cafe-danger/20'
                    }`}
                  >
                    {user.active ? 'Active' : 'Disabled'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AddEmployeeModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
