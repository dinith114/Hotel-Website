import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import {
  FiGrid, FiCalendar, FiLayers, FiGift, FiFileText,
  FiBriefcase, FiMail, FiUsers, FiLogOut, FiMenu
} from "react-icons/fi";
import { FaHandshake } from "react-icons/fa";
import "./AdminLayout.css";
import "./AdminShared.css";

const navItems = [
  { to: "/admin", icon: <FiGrid />, label: "Dashboard", end: true },
  { section: "Management" },
  { to: "/admin/bookings", icon: <FiCalendar />, label: "Bookings" },
  { to: "/admin/rooms", icon: <FiLayers />, label: "Rooms" },
  { to: "/admin/offers", icon: <FiGift />, label: "Offers" },
  { to: "/admin/blogs", icon: <FiFileText />, label: "Blogs" },
  { to: "/admin/careers", icon: <FiBriefcase />, label: "Careers" },
  { section: "Communications" },
  { to: "/admin/inquiries", icon: <FiMail />, label: "Inquiries" },
  { to: "/admin/meeting-enquiries", icon: <FaHandshake />, label: "Meeting Enquiries" },
  { section: "Administration" },
  { to: "/admin/admins", icon: <FiUsers />, label: "Admin Users" },
];

function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const getInitials = (name) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Overlay (mobile) */}
      <div
        className={`admin-sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="admin-sidebar-brand">
          <img src={logo} alt="Hotel" />
          <div className="admin-sidebar-brand-text">
            <h2>Renuka Hotel</h2>
            <span>Admin Panel</span>
          </div>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems.map((item, idx) =>
            item.section ? (
              <div key={idx} className="nav-section">
                {item.section}
              </div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => (isActive ? "active" : "")}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="admin-sidebar-footer">
          <button onClick={handleLogout}>
            <FiLogOut /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button
              className="admin-mobile-toggle"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle sidebar"
            >
              <FiMenu />
            </button>
          </div>

          <div className="admin-topbar-right">
            <div className="admin-topbar-user">
              <div className="admin-topbar-avatar">
                {getInitials(admin?.name)}
              </div>
              <div className="admin-topbar-info">
                <span className="admin-topbar-name">{admin?.name}</span>
                <span className="admin-topbar-role">
                  {admin?.role?.replace("_", " ")}
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
