import { useEffect, useState } from "react";
import { Users, Camera, Image as ImageIcon, Calendar } from "lucide-react";
import { getAdminDashboard } from "../../services/dashboardService";
import StatCard from "../../components/dashboard/StatCard";
import AdminTabs from "../../components/dashboard/AdminTabs";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getAdminDashboard();
        setData(res.data.data);
      } catch (err) {
        setError("Could not load admin dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-text-muted">Loading...</p>;
  }

  if (error) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-red-500">{error}</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <AdminTabs />

      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-text-muted">Platform-wide overview.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Users} label="Total Users" value={data.users.total} />
        <StatCard icon={Camera} label="Photographers" value={data.photographers.total} />
        <StatCard icon={ImageIcon} label="Total Albums" value={data.albums.total} />
        <StatCard icon={Calendar} label="Total Bookings" value={data.bookings.total} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="mb-4 text-sm font-semibold">Users by Role</h2>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Visitors</span>
              <span className="font-medium">{data.users.visitors}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Photographers</span>
              <span className="font-medium">{data.users.photographers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Admins</span>
              <span className="font-medium">{data.users.admins}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3">
              <span className="text-text-muted">Banned</span>
              <span className="font-medium text-red-500">{data.users.banned}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="mb-4 text-sm font-semibold">Photographer Verification</h2>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Verified</span>
              <span className="font-medium">{data.photographers.verified}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Pending</span>
              <span className="font-medium">{data.photographers.pendingVerification}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="mb-4 text-sm font-semibold">Bookings by Status</h2>
          <div className="flex flex-col gap-3 text-sm">
            {Object.entries(data.bookings.byStatus || {}).map(([status, count]) => (
              <div key={status} className="flex justify-between capitalize">
                <span className="text-text-muted">{status}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
            {Object.keys(data.bookings.byStatus || {}).length === 0 && (
              <p className="text-text-muted">No bookings yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}