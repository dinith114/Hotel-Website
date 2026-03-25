import { useState, useEffect } from "react";
import { inquiriesApi } from "../../api/adminApi";
import { FiMail, FiEye, FiCheck } from "react-icons/fi";

function InquiriesManagement() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [alert, setAlert] = useState(null);
  const [filter, setFilter] = useState("all");

  const fetchInquiries = async () => {
    try {
      const res = await inquiriesApi.getAll();
      setInquiries(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInquiries(); }, []);

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleStatusChange = async (id, status) => {
    try {
      await inquiriesApi.updateStatus(id, { status });
      showAlert(`Inquiry marked as ${status}`);
      if (selected?._id === id) {
          setSelected(prev => ({ ...prev, status }));
      }
      fetchInquiries();
    } catch (err) {
      showAlert(err.response?.data?.message || "Failed to update", "error");
    }
  };

  const filtered = filter === "all" ? inquiries : inquiries.filter((inq) => inq.status === filter);

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ height: "50vh", background: "transparent" }}>
        <div className="admin-spinner" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page-title">Contact Inquiries</h1>
      
      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`}>
          {alert.msg}
        </div>
      )}

      {/* Filter Tabs */}
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
                ({inquiries.filter((inq) => (f === "all" ? true : inq.status === f)).length})
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>{filtered.length} inquiry(ies)</h3>
        </div>
        <div className="table-overflow">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="admin-empty-state">
                      <div className="empty-icon"><FiMail /></div>
                      <p>No inquiries found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((inq) => (
                  <tr key={inq._id}>
                    <td style={{ fontWeight: 500 }}>{inq.name}</td>
                    <td>{inq.email}</td>
                    <td>{inq.phone || "—"}</td>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {inq.message}
                    </td>
                    <td>
                      <span className={`status-badge ${inq.status || "pending"}`}>
                        {inq.status || "pending"}
                      </span>
                    </td>
                    <td>{new Date(inq.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="admin-btn-icon"
                          title="View Details"
                          onClick={() => setSelected(inq)}
                        >
                          <FiEye />
                        </button>
                        {inq.status !== "resolved" && (
                          <button
                            className="admin-btn-icon"
                            title="Mark as Resolved"
                            onClick={() => handleStatusChange(inq._id, "resolved")}
                            style={{ color: "#4caf50" }}
                          >
                            <FiCheck />
                          </button>
                        )}
                        {inq.status === "pending" && (
                          <button
                            className="admin-btn-icon"
                            title="Mark as Reviewed"
                            onClick={() => handleStatusChange(inq._id, "reviewed")}
                            style={{ color: "#2196F3" }}
                          >
                            <FiEye />
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
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Inquiry Details</h3>
              <button className="admin-modal-close" onClick={() => setSelected(null)}>×</button>
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
                  <div className="detail-label">Phone</div>
                  <div className="detail-value">{selected.phone || "N/A"}</div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Date</div>
                  <div className="detail-value">
                    {new Date(selected.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="admin-detail-item admin-detail-full">
                  <div className="detail-label">Message</div>
                  <div className="detail-value" style={{ whiteSpace: "pre-wrap" }}>
                    {selected.message}
                  </div>
                </div>
              </div>
            </div>
            <div className="admin-modal-footer">
              {selected.status === "pending" && (
                  <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => handleStatusChange(selected._id, "reviewed")}
                    style={{ background: "#2196F3", borderColor: "#2196F3" }}
                  >
                    Mark Reviewed
                  </button>
                )}
                {selected.status !== "resolved" && (
                  <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => handleStatusChange(selected._id, "resolved")}
                  >
                    Mark Resolved
                  </button>
                )}
              <button className="admin-btn admin-btn-secondary" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InquiriesManagement;
