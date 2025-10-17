import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Heart,
  User,
  MessageCircle,
  Users,
  Crown,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import "./Navbar.css";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = [
    { path: "/dashboard", icon: Heart, label: "Dashboard" },
    { path: "/feed", icon: Heart, label: "Discover" },
    { path: "/connections", icon: Users, label: "Connections" },
    { path: "/chat", icon: MessageCircle, label: "Chat" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <Heart className="brand-icon" />
          <span className="brand-text">PeerFusion</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="navbar-menu desktop-menu">
          {navItems.map(({ path, icon: IconComponent, label }) => (
            <li key={path}>
              <Link
                to={path}
                className={`nav-link ${isActive(path) ? "active" : ""}`}
              >
                <IconComponent size={20} />
                <span>{label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-actions">
          {user?.isPremium && (
            <div className="premium-badge">
              <Crown size={16} />
              <span>Premium</span>
            </div>
          )}

          {!user?.isPremium && (
            <Link to="/premium" className="btn btn-outline btn-sm">
              <Crown size={16} />
              Upgrade
            </Link>
          )}

          <div className="user-menu">
            <div className="user-avatar">
              <img
                src={user?.photoUrl || "https://via.placeholder.com/40"}
                alt={user?.firstName}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/40";
                }}
              />
            </div>
            <div className="user-info">
              <span className="user-name">{user?.firstName}</span>
              <button
                onClick={handleLogout}
                className="logout-btn"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <ul className="mobile-nav-list">
            {navItems.map(({ path, icon: IconComponent, label }) => (
              <li key={path}>
                <Link
                  to={path}
                  className={`mobile-nav-link ${
                    isActive(path) ? "active" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <IconComponent size={20} />
                  <span>{label}</span>
                </Link>
              </li>
            ))}
            <li className="mobile-menu-divider"></li>
            {!user?.isPremium && (
              <li>
                <Link
                  to="/premium"
                  className="mobile-nav-link premium-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Crown size={20} />
                  <span>Upgrade to Premium</span>
                </Link>
              </li>
            )}
            <li>
              <button
                onClick={handleLogout}
                className="mobile-nav-link logout-link"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
