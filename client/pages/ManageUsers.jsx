import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/Button";
import { Edit, Trash } from "lucide-react";

export default function ManageUsers() {
  const API_URL = "https://cosc-4353-backend.vercel.app";
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editRole, setEditRole] = useState("user");
  const [editPassword, setEditPassword] = useState("");
  const [deleteUser, setDeleteUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      if (!res.ok) {
        const { message } = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error(message);
      }
      setUsers(await res.json());
    } catch (err) {
      console.error("fetchUsers error:", err.message);
      alert(`Could not load users: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const confirmDelete = (u) => {
    setDeleteUser(u);
  };

  const deleteConfirmed = async () => {
    if (!deleteUser) return;
    await fetch(`${API_URL}/users/${deleteUser.id}`, { method: "DELETE" });
    setDeleteUser(null);
    fetchUsers();
  };

  const openEdit = (u) => {
    setEditUser(u);
    setEditRole(u.role);
    setEditPassword("");
  };

  const saveEdit = async () => {
    if (!editUser) return;
    if (editRole !== editUser.role) {
      await fetch(`${API_URL}/users/${editUser.id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: editRole }),
      });
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

  return (
    <Layout>
      <Navbar />
      <div className="min-h-screen pt-24 bg-gray-800 px-4 text-white">
        <div className="max-w-5xl mx-auto bg-gray-900 border border-gray-700 rounded-3xl p-6 shadow-2xl">
          <h1 className="text-2xl font-bold mb-6 text-center">Manage Users</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th className="p-3 font-semibold">Name</th>
                  <th className="p-3 font-semibold">Email</th>
                  <th className="p-3 font-semibold">Role</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-800/50">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3 break-all">{u.email}</td>
                    <td className="p-3 capitalize">{u.role}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={() => openEdit(u)} aria-label="Edit" className="hover:text-blue-500">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => confirmDelete(u)} aria-label="Delete" className="hover:text-red-500">
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
      {editUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <div className="mb-2">
              <label className="block text-sm mb-1">Name</label>
              <div className="p-2 bg-gray-700 rounded">{editUser.name}</div>
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">Email</label>
              <div className="p-2 bg-gray-700 rounded break-all">{editUser.email}</div>
            </div>
            <div className="mb-2">
              <label className="block text-sm mb-1">Role</label>
              <select
                className="text-black"
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm mb-1">New Password</label>
              <input
                type="password"
                className="border p-1 text-black w-full"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setEditUser(null)} className="bg-gray-700 text-white">
                Cancel
              </Button>
              <Button onClick={saveEdit} className="bg-blue-600 text-white">
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
      {deleteUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-80">
            <h2 className="text-xl font-semibold mb-4">Delete User</h2>
            <p className="mb-4">Are you sure you want to delete {deleteUser.name}? This action cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setDeleteUser(null)} className="bg-gray-700 text-white">Cancel</Button>
              <Button onClick={deleteConfirmed} className="bg-red-600 text-white">Delete</Button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </Layout>
  );
}
