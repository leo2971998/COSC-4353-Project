import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/Button";

export default function AdminPage() {
  const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3000";
  const [users, setUsers] = useState([]);
  const [changes, setChanges] = useState({});

  const fetchUsers = async () => {
    const res = await fetch(`${API_URL}/users`);
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRole = (id, role) => {
    setChanges((p) => ({ ...p, [id]: { ...(p[id] || {}), role } }));
  };

  const handlePassword = (id, password) => {
    setChanges((p) => ({ ...p, [id]: { ...(p[id] || {}), password } }));
  };

  const save = async (id) => {
    const change = changes[id];
    if (!change) return;
    if (change.role) {
      await fetch(`${API_URL}/users/${id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: change.role }),
      });
    }
    if (change.password) {
      await fetch(`${API_URL}/users/${id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: change.password }),
      });
    }
    setChanges((p) => ({ ...p, [id]: {} }));
    fetchUsers();
  };

  return (
    <Layout>
      <Navbar />
      <div className="pt-24 px-4">
        <a href="/admin/volunteer-dashboard" className="text-blue-300 underline">
          Volunteer Dashboard
        </a>
        <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Change Role</th>
              <th className="p-2">New Password</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gray-700">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  <select
                    className="text-black"
                    value={changes[u.id]?.role || u.role}
                    onChange={(e) => handleRole(u.id, e.target.value)}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="p-2">
                  <input
                    type="password"
                    className="border p-1 text-black"
                    value={changes[u.id]?.password || ""}
                    onChange={(e) => handlePassword(u.id, e.target.value)}
                  />
                </td>
                <td className="p-2">
                  <Button onClick={() => save(u.id)}>Save</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </Layout>
  );
}
