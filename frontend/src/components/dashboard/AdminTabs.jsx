import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/admin", label: "Overview", end: true },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/photographers", label: "Photographers" },
  { to: "/admin/bookings", label: "Bookings" },
  { to: "/admin/reviews", label: "Reviews" },
];

export default function AdminTabs() {
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