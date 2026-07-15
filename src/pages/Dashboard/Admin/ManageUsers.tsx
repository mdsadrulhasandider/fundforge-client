import React, { useState, useEffect } from 'react';
import { api } from '../../../contexts/AuthContext';
import { Users, Trash2, Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

interface UserType {
  _id: string;
  name: string;
  email: string;
  role: 'Supporter' | 'Creator' | 'Admin';
  credits: number;
  status: 'active' | 'suspended';
  photo?: string;
}

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const response = await api.put(`/admin/users/${id}/role`, { role: newRole });
      toast.success(response.data.message || 'User role updated successfully');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const response = await api.put(`/admin/users/${id}/status`, { status: nextStatus });
      toast.success(response.data.message || `Account is now ${nextStatus}`);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user account status');
    }
  };

  const handleDeleteUser = async (id: string) => {
    const confirm = window.confirm('Are you sure you want to remove this user from the server permanently?');
    if (!confirm) return;

    try {
      const response = await api.delete(`/admin/users/${id}`);
      toast.success(response.data.message || 'User removed from server.');
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to remove user');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-500" />
            Manage Users
          </h1>
          <p className="text-xs text-slate-500">Edit member authorization details, adjust roles, or suspend access.</p>
        </div>
        <button
          onClick={fetchUsers}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          title="Refresh List"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="rounded-2xl border border-slate-900 bg-slate-950/20 overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="text-xs text-slate-500">Retrieving members catalog...</span>
          </div>
        ) : users.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-500">
            No registered members found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-900 bg-slate-950/80 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="p-4">Member Name</th>
                  <th className="p-4">Authorization Role</th>
                  <th className="p-4">Credits Balance</th>
                  <th className="p-4 text-center">Security Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/60 text-slate-300">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/20 transition">
                    <td className="p-4 flex items-center gap-3">
                      {u.photo ? (
                        <img
                          src={u.photo}
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover border border-slate-800"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-850 text-slate-500 font-bold font-display">
                          {u.name[0].toUpperCase()}
                        </div>
                      )}
                      <div>
                        <span className="font-semibold text-slate-200 block">{u.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{u.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {u.role === 'Admin' ? (
                        <span className="px-2 py-0.5 rounded bg-blue-600/10 text-blue-400 border border-blue-600/20 font-bold">
                          Admin
                        </span>
                      ) : (
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 text-xs"
                        >
                          <option value="Supporter">Supporter</option>
                          <option value="Creator">Creator</option>
                          <option value="Admin">Admin</option>
                        </select>
                      )}
                    </td>
                    <td className="p-4 font-bold text-slate-300">
                      {u.role === 'Admin' ? 'Unlimited' : `${u.credits} cr`}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        u.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {u.role !== 'Admin' && (
                          <>
                            <button
                              onClick={() => handleStatusToggle(u._id, u.status)}
                              className={`px-2 py-1 rounded text-[10px] font-semibold border transition cursor-pointer ${
                                u.status === 'active'
                                  ? 'bg-amber-600/10 text-amber-400 border-amber-500/20 hover:bg-amber-600 hover:text-white'
                                  : 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-600 hover:text-white'
                              }`}
                              title={u.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                            >
                              {u.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="p-1 rounded bg-rose-950/20 border border-rose-900/35 text-rose-400 hover:bg-rose-900 hover:text-white cursor-pointer transition"
                              title="Delete User permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
