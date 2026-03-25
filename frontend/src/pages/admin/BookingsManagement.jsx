import { useState, useEffect } from "react";
import { bookingsApi } from "../../api/adminApi";
import { FiCalendar, FiEye, FiCheck, FiX, FiTrash2 } from "react-icons/fi";

function BookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [alert, setAlert] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await bookingsApi.getAll();
      setBookings(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await bookingsApi.update(id, { status });
      showAlert(`Booking ${status} successfully`);
      fetchBookings();
    } catch (err) {
      showAlert(err.response?.data?.message || "Failed to update", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await bookingsApi.delete(id);
      showAlert("Booking deleted");
      setSelected(null);
      fetchBookings();
    } catch (err) {
      showAlert(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  const filtered =
    filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ height: "50vh", background: "transparent" }}>
        <div className="admin-spinner" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page-title">Bookings</h1>

      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`}>
          {alert.msg}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="admin-tabs">
        {["all", "pending", "confirmed", "cancelled"].map((f) => (
          <button
            key={f}
            className={`admin-tab ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "all" && (
              <span style={{ marginLeft: 6, opacity: 0.6 }}>
                ({bookings.filter((b) => (f === "all" ? true : b.status === f)).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>{filtered.length} booking(s)</h3>
        </div>
        <div className="table-overflow">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Guest</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Rooms</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="admin-empty-state">
                      <div className="empty-icon"><FiCalendar /></div>
                      <p>No bookings found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 500 }}>
                      {b.firstName} {b.lastName}
                    </td>
                    <td>{b.email}</td>
                    <td>{b.phone}</td>
                    <td>{new Date(b.checkInDate).toLocaleDateString()}</td>
                    <td>{new Date(b.checkOutDate).toLocaleDateString()}</td>
                    <td>{b.rooms?.length || 0}</td>
                    <td>
                      <span className={`status-badge ${b.status}`}>
                        {b.status}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-btn-icon"
                          title="View details"
                          onClick={() => setSelected(b)}
                        >
                          <FiEye />
                        </button>
                        {b.status === "pending" && (
                          <button
                            className="admin-btn-icon"
                            title="Confirm"
                            onClick={() => handleStatusChange(b._id, "confirmed")}
                          >
                            <FiCheck />
                          </button>
                        )}
                        {b.status !== "cancelled" && (
                          <button
                            className="admin-btn-icon"
                            title="Cancel"
                            onClick={() => handleStatusChange(b._id, "cancelled")}
                          >
                            <FiX />
                          </button>
                        )}
                        <button
                          className="admin-btn-icon"
                          title="Delete"
                          onClick={() => handleDelete(b._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="admin-modal-overlay" onClick={() => setSelected(null)}>
          <div className="admin-modal wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Booking Details</h3>
              <button className="admin-modal-close" onClick={() => setSelected(null)}>
                ×
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-detail-grid">
                <div className="admin-detail-item">
                  <div className="detail-label">Guest Name</div>
                  <div className="detail-value">
                    {selected.firstName} {selected.lastName}
                  </div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Email</div>
                  <div className="detail-value">{selected.email}</div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Phone</div>
                  <div className="detail-value">{selected.phone}</div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Country</div>
                  <div className="detail-value">{selected.country}</div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Check-in</div>
                  <div className="detail-value">
                    {new Date(selected.checkInDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Check-out</div>
                  <div className="detail-value">
                    {new Date(selected.checkOutDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Status</div>
                  <div className="detail-value">
                    <span className={`status-badge ${selected.status}`}>
                      {selected.status}
                    </span>
                  </div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Arrival Time</div>
                  <div className="detail-value">
                    {selected.arrivalTime || "Not specified"}
                  </div>
                </div>
                {selected.rooms?.length > 0 && (
                  <div className="admin-detail-item admin-detail-full">
                    <div className="detail-label">Rooms</div>
                    <div className="detail-value">
                      {selected.rooms.map((r, i) => (
                        <div key={i} style={{ marginBottom: 4 }}>
                          {r.roomType} — {r.mealPlan} ({r.guests} guest
                          {r.guests > 1 ? "s" : ""})
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="admin-detail-item admin-detail-full">
                  <div className="detail-label">Special Remarks</div>
                  <div className="detail-value">
                    {selected.specialRemarks || "None"}
                  </div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Airport Pickup</div>
                  <div className="detail-value">
                    {selected.airportPickup || "No"}
                  </div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Airport Drop</div>
                  <div className="detail-value">
                    {selected.airportDrop || "No"}
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              {selected.status === "pending" && (
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => {
                    handleStatusChange(selected._id, "confirmed");
                    setSelected(null);
                  }}
                >
                  <FiCheck /> Confirm
                </button>
              )}
              <button
                className="admin-btn admin-btn-secondary"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingsManagement;
