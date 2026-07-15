import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye, Image as ImageIcon, Calendar, TrendingUp } from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import { getPhotographerDashboard } from "../../services/dashboardService";
import StatCard from "../../components/dashboard/StatCard";
import DashboardTabs from "../../components/dashboard/DashboardTabs";

const COLORS = {
  pending: "#EAB308",
  confirmed: "#3B82F6",
  completed: "#22C55E",
  cancelled: "#EF4444",
};

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getPhotographerDashboard();
        setData(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load dashboard.");
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

  const chartData = [
    { name: "Pending", value: data.bookingStats.pending, color: COLORS.pending },
    { name: "Confirmed", value: data.bookingStats.confirmed, color: COLORS.confirmed },
    { name: "Completed", value: data.bookingStats.completed, color: COLORS.completed },
    { name: "Cancelled", value: data.bookingStats.cancelled, color: COLORS.cancelled },
  ].filter((d) => d.value > 0);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <DashboardTabs />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="mt-1 text-sm text-text-muted">Your performance at a glance.</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/dashboard/albums"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-bg-surface"
          >
            Manage Albums
          </Link>
          <Link
            to="/dashboard/bookings"
            className="rounded-lg bg-accent-gradient px-4 py-2 text-sm font-medium text-white"
          >
            View Bookings
          </Link>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={Eye} label="Profile Views" value={data.profileViews} />
        <StatCard icon={ImageIcon} label="Total Albums" value={data.totalAlbums} />
        <StatCard icon={Calendar} label="Total Bookings" value={data.bookingStats.total} />
        <StatCard icon={TrendingUp} label="Conversion Rate" value={`${data.bookingStats.conversionRatePercent}%`} />
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="mb-4 text-sm font-semibold">Booking Status Breakdown</h2>
          {chartData.length === 0 ? (
            <p className="py-10 text-center text-sm text-text-muted">No bookings yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80}>
                  {chartData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <h2 className="mb-4 text-sm font-semibold">Top Albums by Views</h2>
          {data.topAlbums.length === 0 ? (
            <p className="py-10 text-center text-sm text-text-muted">No albums yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {data.topAlbums.map((album, i) => (
                <div key={album.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                      {i + 1}
                    </span>
                    {album.title}
                  </div>
                  <span className="text-text-muted">{album.views} views</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}