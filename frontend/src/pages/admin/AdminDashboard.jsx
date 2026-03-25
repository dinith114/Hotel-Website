import { useState, useEffect } from "react";
import {
  authApi,
  bookingsApi,
  inquiriesApi,
  meetingEnquiriesApi,
  roomsApi,
  offersApi,
  blogsApi,
  careersApi,
} from "../../api/adminApi";
import {
  FiCalendar,
  FiClock,
  FiMail,
  FiLayers,
  FiGift,
  FiFileText,
  FiBriefcase,
} from "react-icons/fi";
import { FaHandshake } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
  const { admin, setAdmin } = useAuth();
  const [stats, setStats] = useState({
    bookings: 0,
    pendingBookings: 0,
    inquiries: 0,
    meetingEnquiries: 0,
    rooms: 0,
    offers: 0,
    blogs: 0,
    careers: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [alert, setAlert] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [loading, setLoading] = useState(true);

  const showMsg = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  useEffect(() => {
    setProfileForm({
      name: admin?.name || "",
      email: admin?.email || "",
    });
  }, [admin]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          bookingsRes,
          inquiriesRes,
          meetingRes,
          roomsRes,
          offersRes,
          blogsRes,
          careersRes,
        ] = await Promise.allSettled([
          bookingsApi.getAll(),
          inquiriesApi.getAll(),
          meetingEnquiriesApi.getAll(),
          roomsApi.getAll(),
          offersApi.getAll(),
          blogsApi.getAll(),
          careersApi.getAll(),
        ]);

        const bookings =
          bookingsRes.status === "fulfilled" ? bookingsRes.value.data.data : [];
        const inquiries =
          inquiriesRes.status === "fulfilled"
            ? inquiriesRes.value.data.data
            : [];
        const meetings =
          meetingRes.status === "fulfilled" ? meetingRes.value.data.data : [];
        const rooms =
          roomsRes.status === "fulfilled" ? roomsRes.value.data.data : [];
        const offers =
          offersRes.status === "fulfilled" ? offersRes.value.data.data : [];
        const blogs =
          blogsRes.status === "fulfilled"
            ? blogsRes.value.data.data?.docs || blogsRes.value.data.data
            : [];
        const careers =
          careersRes.status === "fulfilled"
            ? careersRes.value.data.data?.docs || careersRes.value.data.data
            : [];

        setStats({
          bookings: Array.isArray(bookings) ? bookings.length : 0,
          pendingBookings: Array.isArray(bookings)
            ? bookings.filter((b) => b.status === "pending").length
            : 0,
          inquiries: Array.isArray(inquiries) ? inquiries.length : 0,
          meetingEnquiries: Array.isArray(meetings) ? meetings.length : 0,
          rooms: Array.isArray(rooms) ? rooms.length : 0,
          offers: Array.isArray(offers)
            ? offers.filter((o) => o.status === "active").length
            : 0,
          blogs: Array.isArray(blogs) ? blogs.length : 0,
          careers: Array.isArray(careers)
            ? careers.filter((c) => c.status === "active").length
            : 0,
        });

        if (Array.isArray(bookings)) {
          setRecentBookings(bookings.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await authApi.updateProfile(profileForm);
      const updatedAdmin = res.data?.data?.admin;
      if (updatedAdmin) {
        setAdmin((prev) => ({ ...prev, ...updatedAdmin }));
      }
      showMsg("Profile updated successfully");
    } catch (err) {
      showMsg(
        err.response?.data?.message || "Failed to update profile",
        "error",
      );
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showMsg("New password and confirm password do not match", "error");
      return;
    }

    setSavingPassword(true);
    try {
      await authApi.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showMsg("Password changed successfully");
    } catch (err) {
      showMsg(
        err.response?.data?.message || "Failed to change password",
        "error",
      );
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div
        className="admin-loading-screen"
        style={{ height: "50vh", background: "transparent" }}
      >
        <div className="admin-spinner" />
      </div>
    );
  }

  const statCards = [
    { icon: <FiCalendar />, value: stats.bookings, label: "Total Bookings" },
    {
      icon: <FiClock />,
      value: stats.pendingBookings,
      label: "Pending Bookings",
    },
    { icon: <FiMail />, value: stats.inquiries, label: "Inquiries" },
    {
      icon: <FaHandshake />,
      value: stats.meetingEnquiries,
      label: "Meeting Enquiries",
    },
    { icon: <FiLayers />, value: stats.rooms, label: "Room Types" },
    { icon: <FiGift />, value: stats.offers, label: "Active Offers" },
    { icon: <FiFileText />, value: stats.blogs, label: "Blog Posts" },
    { icon: <FiBriefcase />, value: stats.careers, label: "Active Positions" },
  ];

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>
      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`}>
          {alert.msg}
        </div>
      )}

      <div className="admin-stats-grid">
        {statCards.map((card, idx) => (
          <div className="admin-stat-card" key={idx}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-value">{card.value}</div>
            <div className="stat-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>Recent Bookings</h3>
        </div>
        <div className="table-overflow">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    style={{ textAlign: "center", color: "#999" }}
                  >
                    No bookings yet
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b._id}>
                    <td>
                      {b.firstName} {b.lastName}
                    </td>
                    <td>{new Date(b.checkInDate).toLocaleDateString()}</td>
                    <td>{new Date(b.checkOutDate).toLocaleDateString()}</td>
                    <td>
                      <span className={`status-badge ${b.status}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="admin-detail-grid" style={{ marginTop: 24 }}>
        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h3>My Profile</h3>
          </div>
          <form onSubmit={handleProfileSubmit} style={{ padding: 24 }}>
            <div className="admin-form-group">
              <label>Full Name</label>
              <input
                value={profileForm.name}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Email</label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) =>
                  setProfileForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={savingProfile}
            >
              {savingProfile ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>

        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h3>Change Password</h3>
          </div>
          <form onSubmit={handlePasswordSubmit} style={{ padding: 24 }}>
            <div className="admin-form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                required
              />
            </div>
            <div className="admin-form-group">
              <label>New Password</label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                minLength={8}
                required
              />
            </div>
            <div className="admin-form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                minLength={8}
                required
              />
            </div>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={savingPassword}
            >
              {savingPassword ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
