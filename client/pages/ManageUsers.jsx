// ManageUsers.jsx – add-user flow + polished UI
// Leo Nguyen – 2234488

import { useEffect, useState } from "react";
import Layout   from "../components/Layout";
import Navbar   from "../components/Navbar";
import Footer   from "../components/Footer";
import { Button } from "../components/ui/Button";   // your shadcn/ui Button
import { Edit, Trash, UserCircle, Plus, X } from "lucide-react";

const API_URL = "https://cosc-4353-backend.vercel.app";

export default function ManageUsers() {
  /* state */
  const [users,        setUsers]        = useState([]);
  const [editUser,     setEditUser]     = useState(null);
  const [editRole,     setEditRole]     = useState("user");
  const [editPassword, setEditPassword] = useState("");
  const [deleteUser,   setDeleteUser]   = useState(null);

  /* add user modal */
  const [addOpen,      setAddOpen]      = useState(false);
  const [newName,      setNewName]      = useState("");
  const [newEmail,     setNewEmail]     = useState("");
  const [newRole,      setNewRole]      = useState("user");
  const [newPass,      setNewPass]      = useState("");

  /* ---------------- fetch ---------------- */
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_URL}/users`);
      if (!res.ok) throw new Error((await res.json()).message);
      setUsers(await res.json());
    } catch (e) {
      console.error("[fetchUsers]", e.message);
      alert(`Could not load users: ${e.message}`);
    }
  };
  useEffect(() => { fetchUsers(); }, []);

  /* ---------------- delete ---------------- */
  const deleteConfirmed = async () => {
    if (!deleteUser) return;
    await fetch(`${API_URL}/users/${deleteUser.id}`, { method: "DELETE" });
    setDeleteUser(null);
    fetchUsers();
  };

  /* ---------------- edit ---------------- */
  const openEdit = (u) => { setEditUser(u); setEditRole(u.role); setEditPassword(""); };

  const saveEdit = async () => {
    if (!editUser) return;
    if (editRole !== editUser.role) {
      await fetch(`${API_URL}/users/${editUser.id}/role`, {
        method:"PUT", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ role: editRole }),
      });
    }
    if (editPassword) {
      await fetch(`${API_URL}/users/${editUser.id}/password`, {
        method:"PUT", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ password: editPassword }),
      });
    }
    setEditUser(null);
    fetchUsers();
  };

  /* ---------------- add ---------------- */
  const resetAdd = () => {
    setNewName(""); setNewEmail(""); setNewRole("user"); setNewPass("");
  };

  const saveNewUser = async () => {
    if (!newName.trim() || !newEmail.trim() || !newPass.trim()) {
      alert("All fields required"); return;
    }
    try {
      /* register */
      const res = await fetch(`${API_URL}/register`, {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ fullName:newName, email:newEmail, password:newPass }),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      /* get inserted id for potential role upgrade */
      const tmp = await fetch(`${API_URL}/users?email=${encodeURIComponent(newEmail)}`);
      const [{ id }] = await tmp.json();

      if (newRole !== "user") {
        await fetch(`${API_URL}/users/${id}/role`, {
          method:"PUT", headers:{ "Content-Type":"application/json" },
          body: JSON.stringify({ role: newRole }),
        });
      }
      setAddOpen(false);
      resetAdd();
      fetchUsers();
    } catch (e) {
      console.error("[addUser]", e.message);
      alert(`Could not add user: ${e.message}`);
    }
  };

  /* badge */
  const RoleBadge = ({ role }) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize
      ${role==="admin" ? "bg-red-600/20 text-red-400" : "bg-indigo-600/20 text-indigo-400"}`}>
      {role}
    </span>
  );

  /* ---------------- render ---------------- */
  return (
      <Layout>
        <Navbar />

        <div className="min-h-screen pt-24 bg-gray-900/95 text-gray-100 px-4">
          <div className="max-w-5xl mx-auto bg-gray-800/60 border border-gray-700
                        rounded-3xl p-8 shadow-2xl backdrop-blur">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Manage Users</h1>
              <Button onClick={()=>setAddOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1">
                <Plus size={16}/> Add&nbsp;User
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-800/80">
                <tr className="text-left text-sm font-semibold">
                  <th className="p-3">User</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3 w-20" />
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 text-sm">
                {users.map(u=>(
                    <tr key={u.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="p-3 flex items-center gap-2">
                        <UserCircle className="w-5 h-5 text-gray-400 shrink-0"/>{u.name}
                      </td>
                      <td className="p-3 break-all">{u.email}</td>
                      <td className="p-3"><RoleBadge role={u.role}/></td>
                      <td className="p-3 flex gap-3 justify-end">
                        <button onClick={()=>openEdit(u)}  title="Edit"   className="hover:text-blue-400"><Edit  className="w-5 h-5"/></button>
                        <button onClick={()=>setDeleteUser(u)} title="Delete" className="hover:text-red-400"><Trash className="w-5 h-5"/></button>
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ---------------- add-user modal ---------------- */}
        {addOpen && (
            <Modal onClose={()=>{ setAddOpen(false); resetAdd(); }}>
              <h2 className="text-xl font-semibold mb-4">Add&nbsp;User</h2>

              <Input  label="Full Name" value={newName}  onChange={setNewName}/>
              <Input  label="Email"     value={newEmail} onChange={setNewEmail}/>
              <Select label="Role"      value={newRole}  onChange={setNewRole} options={["user","admin"]}/>
              <Input  label="Password"  type="password"  value={newPass} onChange={setNewPass}/>

              <div className="flex justify-end gap-2 mt-6">
                <Button onClick={()=>{ setAddOpen(false); resetAdd(); }}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-100">
                  Cancel
                </Button>
                <Button onClick={saveNewUser} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                  Create
                </Button>
              </div>
            </Modal>
        )}

        {/* ---------------- edit-user modal (unchanged) ---------------- */}
        {editUser && (
            <EditModal
                user={editUser}
                role={editRole} setRole={setEditRole}
                pw={editPassword} setPw={setEditPassword}
                onClose={()=>setEditUser(null)}
                onSave={saveEdit}
            />
        )}

        {/* ---------------- delete-user modal (unchanged) ---------------- */}
        {deleteUser && (
            <DeleteModal
                user={deleteUser}
                onClose={()=>setDeleteUser(null)}
                onDelete={deleteConfirmed}
            />
        )}

        <Footer />
      </Layout>
  );
}

/* =======================================================================
   Reusable tiny components
======================================================================= */
function Modal({ children,onClose }) {
  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur">
        <div className="bg-gray-800 rounded-xl w-96 max-w-full p-6 shadow-2xl border border-gray-700">
          <div className="flex justify-end -mt-2 -mr-2">
            <button onClick={onClose} className="hover:text-red-400"><X className="w-5 h-5"/></button>
          </div>
          {children}
        </div>
      </div>
  );
}
function Input({ label,type="text",value,onChange }) {
  return (
      <div className="mb-3">
        <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">{label}</label>
        <input type={type} value={value}
               onChange={e=>onChange(e.target.value)}
               className="w-full bg-gray-700/80 text-gray-100 p-2 rounded focus:outline-none
               focus:ring-2 focus:ring-blue-500 placeholder-gray-400"/>
      </div>
  );
}
function Select({label,value,onChange,options}) {
  return (
      <div className="mb-3">
        <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">{label}</label>
        <select value={value} onChange={e=>onChange(e.target.value)}
                className="w-full bg-gray-700/80 text-gray-100 p-2 rounded focus:outline-none
               focus:ring-2 focus:ring-blue-500">
          {options.map(o=><option key={o} value={o}>{o}</option>)}
        </select>
      </div>
  );
}

/* ---------------- separate modals for edit / delete (unchanged logic) ---- */
function EditModal({ user,role,setRole,pw,setPw,onClose,onSave }) {
  return (
      <Modal onClose={onClose}>
        <h2 className="text-xl font-semibold mb-4">Edit User</h2>

        <div className="mb-3"><label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Name</label>
          <div className="p-2 bg-gray-700/70 rounded text-sm">{user.name}</div></div>

        <div className="mb-3"><label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">Email</label>
          <div className="p-2 bg-gray-700/70 rounded text-sm break-all">{user.email}</div></div>

        <Select label="Role" value={role} onChange={setRole} options={["user","admin"]}/>
        <Input  label="New Password (leave blank to keep)" type="password" value={pw} onChange={setPw}/>

        <div className="flex justify-end gap-2 mt-6">
          <Button onClick={onClose} className="bg-gray-700 hover:bg-gray-600 text-gray-100">Cancel</Button>
          <Button onClick={onSave}  className="bg-blue-600 hover:bg-blue-500 text-white">Save</Button>
        </div>
      </Modal>
  );
}
function DeleteModal({ user,onClose,onDelete }) {
  return (
      <Modal onClose={onClose}>
        <h2 className="text-xl font-semibold text-red-400 mb-4">Delete User</h2>
        <p className="mb-6 text-sm">
          Are you sure you want to delete <span className="font-semibold">{user.name}</span>?<br/>
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}  className="bg-gray-700 hover:bg-gray-600 text-gray-100">Cancel</Button>
          <Button onClick={onDelete} className="bg-red-600 hover:bg-red-500 text-white">Delete</Button>
        </div>
      </Modal>
  );
}
