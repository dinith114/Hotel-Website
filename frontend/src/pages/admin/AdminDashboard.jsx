import { useState, useEffect } from "react";
import {
  bookingsApi,
  inquiriesApi,
  meetingEnquiriesApi,
  roomsApi,
  offersApi,
  blogsApi,
  careersApi,
} from "../../api/adminApi";
import {
  FiCalendar, FiClock, FiMail, FiLayers,
  FiGift, FiFileText, FiBriefcase
} from "react-icons/fi";
import { FaHandshake } from "react-icons/fa";

function AdminDashboard() {
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
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ height: "50vh", background: "transparent" }}>
        <div className="admin-spinner" />
      </div>
    );
  }

  const statCards = [
    { icon: <FiCalendar />, value: stats.bookings, label: "Total Bookings" },
    { icon: <FiClock />, value: stats.pendingBookings, label: "Pending Bookings" },
    { icon: <FiMail />, value: stats.inquiries, label: "Inquiries" },
    { icon: <FaHandshake />, value: stats.meetingEnquiries, label: "Meeting Enquiries" },
    { icon: <FiLayers />, value: stats.rooms, label: "Room Types" },
    { icon: <FiGift />, value: stats.offers, label: "Active Offers" },
    { icon: <FiFileText />, value: stats.blogs, label: "Blog Posts" },
    { icon: <FiBriefcase />, value: stats.careers, label: "Active Positions" },
  ];

  return (
    <div>
      <h1 className="admin-page-title">Dashboard</h1>

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
                  <td colSpan="5" style={{ textAlign: "center", color: "#999" }}>
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
    </div>
  );
}

export default AdminDashboard;
