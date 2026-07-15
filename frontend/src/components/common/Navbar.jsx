import { Link, useNavigate } from "react-router-dom";
import { Camera, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="glass sticky top-0 z-50">
      <div className="mx-auto flex max-w-8xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <motion.span
            whileHover={{ rotate: -8, scale: 1.05 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-gradient-3 shadow-lg shadow-accent/30"
          >
            <Camera size={18} className="text-white" />
          </motion.span>
          Pixora
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-text-muted lg:flex">
          <Link to="/" className="transition hover:text-text">Home</Link>
          <Link to="/photographers" className="transition hover:text-text">Photographers</Link>
          <Link to="/about" className="transition hover:text-text">About</Link>
          <Link to="/contact" className="transition hover:text-text">Contact</Link>
          {user?.role === "photographer" && (
            <Link to="/dashboard" className="transition hover:text-text">Dashboard</Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="transition hover:text-text">Admin</Link>
          )}
          {user && <Link to="/my-bookings" className="transition hover:text-text">My Bookings</Link>}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="glass rounded-xl p-2.5 text-text-muted transition hover:text-text"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user ? (
            <button
              onClick={handleLogout}
              className="glass rounded-xl px-4 py-2.5 text-sm font-medium transition hover:border-accent/40"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-xl bg-accent-gradient-3 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-accent/25 transition hover:shadow-xl hover:shadow-accent/40"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;