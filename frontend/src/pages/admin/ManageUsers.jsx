import { useEffect, useState } from "react";
import { getAllUsers, toggleUserBan, updateUserRole, deleteUser } from "../../services/authService";
import AdminTabs from "../../components/dashboard/AdminTabs";

const roles = ["visitor", "photographer", "admin"];

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data.data);
    } catch (err) {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleBan = async (userId) => {
    setBusyId(userId);
    try {
      const res = await toggleUserBan(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isBanned: res.data.data.isBanned } : u))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Could not update ban status.");
    } finally {
      setBusyId(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setBusyId(userId);
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) => prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      alert(err.response?.data?.message || "Could not update role.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm("Delete this user permanently?")) return;
    setBusyId(userId);
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete user.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-text-muted">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <AdminTabs />

      <h1 className="text-2xl font-bold">Manage Users</h1>
      <p className="mt-1 text-sm text-text-muted">{users.length} total users</p>

      {error && <p className="mt-8 text-sm text-red-500">{error}</p>}

      <div className="mt-8 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-surface text-xs text-text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u._id}>
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-text-muted">{u.email}</td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    disabled={busyId === u._id}
                    className="rounded-lg border border-border bg-bg-surface px-2 py-1 text-xs capitalize outline-none"
                  >
                    {roles.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3">
                  {u.isBanned ? (
                    <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-1 text-xs text-red-500">
                      Banned
                    </span>
                  ) : (
                    <span className="rounded-full border border-green-500/30 bg-green-500/10 px-2 py-1 text-xs text-green-500">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleBan(u._id)}
                      disabled={busyId === u._id}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-bg-surface disabled:opacity-50"
                    >
                      {u.isBanned ? "Unban" : "Ban"}
                    </button>
                    <button
                      onClick={() => handleDelete(u._id)}
                      disabled={busyId === u._id}
                      className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}