import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/dashboard", label: "Overview", end: true },
  { to: "/dashboard/albums", label: "Albums" },
  { to: "/dashboard/bookings", label: "Bookings" },
  { to: "/dashboard/payments", label: "Payments" },
  { to: "/dashboard/profile", label: "Profile Settings" },
];

export default function DashboardTabs() {
  return (
    <div className="mb-8 flex gap-1 overflow-x-auto border-b border-border">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium ${
              isActive
                ? "border-accent text-accent"
                : "border-transparent text-text-muted hover:text-text"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}