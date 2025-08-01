// ManageUsers.jsx – polished UI
// Leo Nguyen – 2234488 – role badge + avatar + dark-mode modal revamp

import { useEffect, useState } from "react";
import Layout   from "../components/Layout";
import Navbar   from "../components/Navbar";
import Footer   from "../components/Footer";
import { Button } from "../components/ui/Button";
import { Edit, Trash, UserCircle, X } from "lucide-react";

export default function ManageUsers() {
  const API_URL = "https://cosc-4353-backend.vercel.app";

  const [users,        setUsers]        = useState([]);
  const [editUser,     setEditUser]     = useState(null);
  const [editRole,     setEditRole]     = useState("user");
  const [editPassword, setEditPassword] = useState("");
  const [deleteUser,   setDeleteUser]   = useState(null);

  /* ─────────────────────────────── loaders ─────────────────────────────── */
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(message);
      }
      setUsers(await res.json());
    } catch (err) {
      console.error("[fetchUsers]", err.message);
      alert(`Could not load users: ${err.message}`);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  /* ────────────────────────────── mutators ─────────────────────────────── */
  const confirmDelete   = (u) => setDeleteUser(u);
  const openEdit        = (u) => { setEditUser(u); setEditRole(u.role); setEditPassword(""); };
  const deleteConfirmed = async () => {
    if (!deleteUser) return;
    await fetch(`${API_URL}/users/${deleteUser.id}`, { method: "DELETE" });
    setDeleteUser(null);
    fetchUsers();
  };
  const saveEdit = async () => {
    if (!editUser) return;
    if (editRole !== editUser.role) {
      const res = await fetch(`${API_URL}/users/${editUser.id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editRole }),
      });
      if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: res.statusText }));
        alert(`Could not update role: ${message}`);
        return;
      }
    }
    if (editPassword) {
      await fetch(`${API_URL}/users/${editUser.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: editPassword }),
      });
    }
    setEditUser(null);
    fetchUsers();
  };

  /* ────────────────────────────── helpers ──────────────────────────────── */
  const RoleBadge = ({ role }) => (
      <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize
        ${role === "admin"
              ? "bg-red-600/20 text-red-400"
              : "bg-indigo-600/20 text-indigo-400"}`}
      >
      {role}
    </span>
  );

  /* ─────────────────────────────── render ──────────────────────────────── */
  return (
      <Layout>
        <Navbar />

        {/* Main container */}
        <div className="min-h-screen pt-24 bg-gray-900/95 text-gray-100 px-4">
          <div className="max-w-5xl mx-auto bg-gray-800/60 border border-gray-700
                        rounded-3xl p-8 shadow-2xl backdrop-blur">
            <h1 className="text-3xl font-bold mb-6 text-center tracking-tight">Manage Users</h1>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/80">
                <tr className="text-left text-sm font-semibold">
                  <th className="p-3">User</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3 w-20" />
                </tr>
                </thead>

                <tbody className="divide-y divide-gray-700 text-sm">
                {users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-800/40 transition-colors">
                      {/* Avatar + name */}
                      <td className="p-3 flex items-center gap-2">
                        <UserCircle className="w-5 h-5 text-gray-400 shrink-0" />
                        {u.name}
                      </td>

                      {/* Email */}
                      <td className="p-3 break-all">{u.email}</td>

                      {/* Role badge */}
                      <td className="p-3">
                        <RoleBadge role={u.role} />
                      </td>

                      {/* Actions */}
                      <td className="p-3 flex gap-3 justify-end">
                        <button
                            onClick={() => openEdit(u)}
                            title="Edit"
                            className="hover:text-blue-400 transition-colors"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => confirmDelete(u)}
                            title="Delete"
                            className="hover:text-red-400 transition-colors"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ────────────────────────────── Edit modal ───────────────────────────── */}
        {editUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
              <div className="bg-gray-800 rounded-xl w-96 max-w-full p-6 shadow-2xl border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Edit&nbsp;User</h2>
                  <button onClick={() => setEditUser(null)} className="hover:text-red-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Name (read-only) */}
                <div className="mb-3">
                  <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Name</label>
                  <div className="p-2 bg-gray-700/70 rounded text-sm">{editUser.name}</div>
                </div>

                {/* Email (read-only) */}
                <div className="mb-3">
                  <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Email</label>
                  <div className="p-2 bg-gray-700/70 rounded break-all text-sm">{editUser.email}</div>
                </div>

                {/* Role select */}
                <div className="mb-3">
                  <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Role</label>
                  <select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      className="w-full bg-gray-700/80 text-gray-100 p-2 rounded focus:outline-none
                           focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* New password */}
                <div className="mb-6">
                  <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
                    New&nbsp;Password&nbsp;(leave blank to keep)
                  </label>
                  <input
                      type="password"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      className="w-full bg-gray-700/80 text-gray-100 p-2 rounded focus:outline-none
                           focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                      placeholder="••••••••"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button onClick={() => setEditUser(null)} className="bg-gray-700 hover:bg-gray-600 text-gray-100">
                    Cancel
                  </Button>
                  <Button onClick={saveEdit} className="bg-blue-600 hover:bg-blue-500 text-white">
                    Save
                  </Button>
                </div>
              </div>
            </div>
        )}

        {/* ───────────────────────────── Delete modal ──────────────────────────── */}
        {deleteUser && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
              <div className="bg-gray-800 rounded-xl w-96 max-w-full p-6 shadow-2xl border border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-red-400">Delete&nbsp;User</h2>
                  <button onClick={() => setDeleteUser(null)} className="hover:text-red-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="mb-6 text-sm">
                  Are you sure you want to delete&nbsp;
                  <span className="font-semibold">{deleteUser.name}</span>?<br />
                  This action cannot be undone.
                </p>

                <div className="flex justify-end gap-2">
                  <Button onClick={() => setDeleteUser(null)} className="bg-gray-700 hover:bg-gray-600 text-gray-100">
                    Cancel
                  </Button>
                  <Button onClick={deleteConfirmed} className="bg-red-600 hover:bg-red-500 text-white">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
        )}

        <Footer />
      </Layout>
  );
}
