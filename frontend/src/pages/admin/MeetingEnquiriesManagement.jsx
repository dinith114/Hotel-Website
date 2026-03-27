import { useState, useEffect } from "react";
import { meetingEnquiriesApi } from "../../api/adminApi";
import { FaHandshake, FaEye, FaCheck, FaTrash } from "react-icons/fa";
import ConfirmModal from "./ConfirmModal";

function MeetingEnquiriesManagement() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [alert, setAlert] = useState(null);
  const [filter, setFilter] = useState("all");
  const [deleteTargetId, setDeleteTargetId] = useState(null);

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const normalizeMeetingEnquiries = (res) => {
    const payload = res.data?.data;
    const items = Array.isArray(payload)
      ? payload
      : payload?.data || payload?.docs || payload?.enquiries || [];
    return Array.isArray(items) ? items : [];
  };

  const fetchData = async () => {
    try {
      const res = await meetingEnquiriesApi.getAll();
      setEnquiries(normalizeMeetingEnquiries(res));
    } catch (err) {
      console.error("Failed to fetch meeting enquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await meetingEnquiriesApi.updateStatus(id, { status });
      const updated = res.data?.data;

      setEnquiries((prev) =>
        prev.map((enq) => (enq._id === id ? { ...enq, status } : enq)),
      );

      if (selected?._id === id) {
        setSelected(updated || { ...selected, status });
      }

      showAlert(`Meeting enquiry marked as ${status}`);
    } catch (err) {
      showAlert(err.response?.data?.message || "Failed to update", "error");
    }
  };

  const requestDeleteEnquiry = (id) => {
    setDeleteTargetId(id);
  };

  const handleDeleteEnquiry = async () => {
    if (!deleteTargetId) return;

    try {
      await meetingEnquiriesApi.delete(deleteTargetId);
      setEnquiries((prev) => prev.filter((enq) => enq._id !== deleteTargetId));

      if (selected?._id === deleteTargetId) {
        setSelected(null);
      }

      showAlert("Meeting enquiry deleted successfully");
    } catch (err) {
      showAlert(
        err.response?.data?.message || "Failed to delete meeting enquiry",
        "error",
      );
    } finally {
      setDeleteTargetId(null);
    }
  };

  const filtered =
    filter === "all"
      ? enquiries
      : enquiries.filter((enq) => (enq.status || "pending") === filter);

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

  return (
    <div>
      <h1 className="admin-page-title">Meeting Enquiries</h1>

      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`}>
          {alert.msg}
        </div>
      )}

      <div className="admin-tabs">
        {["all", "pending", "reviewed", "resolved"].map((f) => (
          <button
            key={f}
            className={`admin-tab ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f !== "all" && (
              <span style={{ marginLeft: 6, opacity: 0.6 }}>
                (
                {
                  enquiries.filter((enq) => (enq.status || "pending") === f)
                    .length
                }
                )
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>{filtered.length} enquiry(ies)</h3>
        </div>
        <div className="table-overflow">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Company</th>
                <th>Date</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="admin-empty-state">
                      <div className="empty-icon">
                        <FaHandshake />
                      </div>
                      <p>No meeting enquiries yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((enq) => (
                  <tr key={enq._id}>
                    <td style={{ fontWeight: 500 }}>{enq.name}</td>
                    <td>{enq.email}</td>
                    <td>{enq.companyName || "—"}</td>
                    <td>{new Date(enq.date).toLocaleDateString()}</td>
                    <td>{enq.guests || "—"}</td>
                    <td>
                      <span
                        className={`status-badge ${enq.status || "pending"}`}
                      >
                        {enq.status || "pending"}
                      </span>
                    </td>
                    <td>{new Date(enq.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-btn-icon"
                          title="View"
                          onClick={() => setSelected(enq)}
                        >
                          <FaEye />
                        </button>
                        {enq.status !== "reviewed" &&
                          enq.status !== "resolved" && (
                            <button
                              className="admin-btn-icon"
                              title="Mark as Reviewed"
                              onClick={() =>
                                handleStatusChange(enq._id, "reviewed")
                              }
                              style={{ color: "#2196F3" }}
                            >
                              <FaEye />
                            </button>
                          )}
                        {enq.status !== "resolved" && (
                          <button
                            className="admin-btn-icon"
                            title="Mark as Resolved"
                            onClick={() =>
                              handleStatusChange(enq._id, "resolved")
                            }
                            style={{ color: "#4caf50" }}
                          >
                            <FaCheck />
                          </button>
                        )}
                        {enq.status === "resolved" && (
                          <button
                            className="admin-btn-icon"
                            title="Delete Enquiry"
                            onClick={() => requestDeleteEnquiry(enq._id)}
                            style={{ color: "#f44336" }}
                          >
                            <FaTrash />
                          </button>
                        )}
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
          <div
            className="admin-modal wide"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3>Meeting Enquiry Details</h3>
              <button
                className="admin-modal-close"
                onClick={() => setSelected(null)}
              >
                ×
              </button>
            </div>
            <div className="admin-modal-body">
              <div className="admin-detail-grid">
                <div className="admin-detail-item">
                  <div className="detail-label">Name</div>
                  <div className="detail-value">{selected.name}</div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Email</div>
                  <div className="detail-value">{selected.email}</div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Mobile Phone</div>
                  <div className="detail-value">{selected.mobilePhone}</div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Land Phone</div>
                  <div className="detail-value">
                    {selected.landPhone || "N/A"}
                  </div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Company</div>
                  <div className="detail-value">
                    {selected.companyName || "N/A"}
                  </div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Company Address</div>
                  <div className="detail-value">
                    {selected.companyAddress || "N/A"}
                  </div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Meeting Date</div>
                  <div className="detail-value">
                    {new Date(selected.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Guests</div>
                  <div className="detail-value">{selected.guests || "N/A"}</div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Seating</div>
                  <div className="detail-value">
                    {selected.seating || "N/A"}
                  </div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Menu Type</div>
                  <div className="detail-value">
                    {selected.menuType || "N/A"}
                  </div>
                </div>
                {selected.equipment?.length > 0 && (
                  <div className="admin-detail-item admin-detail-full">
                    <div className="detail-label">Equipment</div>
                    <div className="detail-value">
                      {selected.equipment.join(", ")}
                    </div>
                  </div>
                )}
                <div className="admin-detail-item admin-detail-full">
                  <div className="detail-label">Special Requirements</div>
                  <div className="detail-value">
                    {selected.specialRequirement || "None"}
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              {selected.status !== "reviewed" &&
                selected.status !== "resolved" && (
                  <button
                    className="admin-btn admin-btn-secondary"
                    onClick={() => handleStatusChange(selected._id, "reviewed")}
                  >
                    Mark as Reviewed
                  </button>
                )}
              {selected.status !== "resolved" && (
                <button
                  className="admin-btn admin-btn-primary"
                  onClick={() => handleStatusChange(selected._id, "resolved")}
                >
                  Mark as Resolved
                </button>
              )}
              {selected.status === "resolved" && (
                <button
                  className="admin-btn admin-btn-danger"
                  onClick={() => requestDeleteEnquiry(selected._id)}
                >
                  Delete Enquiry
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

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Meeting Enquiry"
        message="Delete this resolved meeting enquiry? This action cannot be undone."
        onConfirm={handleDeleteEnquiry}
        onCancel={() => setDeleteTargetId(null)}
        confirmText="Delete"
        cancelText="Cancel"
        intent="danger"
      />
    </div>
  );
}

export default MeetingEnquiriesManagement;
