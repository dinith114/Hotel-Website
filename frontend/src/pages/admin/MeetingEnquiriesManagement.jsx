import { useState, useEffect } from "react";
import { meetingEnquiriesApi } from "../../api/adminApi";
import { FaHandshake, FaEye } from "react-icons/fa";

function MeetingEnquiriesManagement() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await meetingEnquiriesApi.getAll();
        const data = res.data.data;
        setEnquiries(Array.isArray(data) ? data : data?.docs || data?.enquiries || []);
      } catch (err) {
        console.error("Failed to fetch meeting enquiries:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ height: "50vh", background: "transparent" }}>
        <div className="admin-spinner" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page-title">Meeting Enquiries</h1>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>{enquiries.length} enquiry(ies)</h3>
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
              {enquiries.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="admin-empty-state">
                      <div className="empty-icon"><FaHandshake /></div>
                      <p>No meeting enquiries yet</p>
                    </div>
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq._id}>
                    <td style={{ fontWeight: 500 }}>{enq.name}</td>
                    <td>{enq.email}</td>
                    <td>{enq.companyName || "—"}</td>
                    <td>{new Date(enq.date).toLocaleDateString()}</td>
                    <td>{enq.guests || "—"}</td>
                    <td>
                      <span className={`status-badge ${enq.status || "pending"}`}>
                        {enq.status || "pending"}
                      </span>
                    </td>
                    <td>{new Date(enq.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="admin-btn-icon"
                        title="View"
                        onClick={() => setSelected(enq)}
                      >
                        <FaEye />
                      </button>
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
              <h3>Meeting Enquiry Details</h3>
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
                  <div className="detail-label">Mobile Phone</div>
                  <div className="detail-value">{selected.mobilePhone}</div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Land Phone</div>
                  <div className="detail-value">{selected.landPhone || "N/A"}</div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Company</div>
                  <div className="detail-value">{selected.companyName || "N/A"}</div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Company Address</div>
                  <div className="detail-value">{selected.companyAddress || "N/A"}</div>
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
                  <div className="detail-value">{selected.seating || "N/A"}</div>
                </div>
                <div className="admin-detail-item">
                  <div className="detail-label">Menu Type</div>
                  <div className="detail-value">{selected.menuType || "N/A"}</div>
                </div>
                {selected.equipment?.length > 0 && (
                  <div className="admin-detail-item admin-detail-full">
                    <div className="detail-label">Equipment</div>
                    <div className="detail-value">{selected.equipment.join(", ")}</div>
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

export default MeetingEnquiriesManagement;
