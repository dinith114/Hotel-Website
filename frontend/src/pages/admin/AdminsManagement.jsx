import { useState, useEffect } from "react";
import { authApi } from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";
import { FiLock, FiCheck, FiX, FiTrash2, FiKey } from "react-icons/fi";

const emptyAdmin = { name: "", email: "", password: "", role: "admin" };

function AdminsManagement() {
  const { admin: currentAdmin } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...emptyAdmin });
  const [resetTarget, setResetTarget] = useState(null);
  const [resetPassword, setResetPassword] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [alert, setAlert] = useState(null);

  const fetchAdmins = async () => {
    try {
      const res = await authApi.getAllAdmins();
      setAdmins(res.data.data?.admins || []);
    } catch (err) {
      console.error("Failed to fetch admins:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const showMsg = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await authApi.registerAdmin(form);
      showMsg("Admin registered successfully");
      setShowForm(false);
      setForm({ ...emptyAdmin });
      fetchAdmins();
    } catch (err) {
      showMsg(err.response?.data?.message || "Registration failed", "error");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      await authApi.updateAdminStatus(id, { isActive: !currentStatus });
      showMsg(`Admin ${!currentStatus ? "activated" : "deactivated"}`);
      fetchAdmins();
    } catch (err) {
      showMsg(err.response?.data?.message || "Failed to update", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this admin?")) return;
    try {
      await authApi.deleteAdmin(id);
      showMsg("Admin deleted");
      fetchAdmins();
    } catch (err) {
      showMsg(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  const openResetModal = (admin) => {
    setResetTarget(admin);
    setResetPassword("");
  };

  const closeResetModal = () => {
    setResetTarget(null);
    setResetPassword("");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetTarget?._id) {
      return;
    }

    setIsResetting(true);
    try {
      await authApi.resetAdminPassword(resetTarget._id, {
        newPassword: resetPassword,
      });
      showMsg(`Password reset for ${resetTarget.name}`);
      closeResetModal();
    } catch (err) {
      showMsg(
        err.response?.data?.message || "Failed to reset password",
        "error",
      );
    } finally {
      setIsResetting(false);
    }
  };

  const isSuperAdmin = currentAdmin?.role === "super_admin";

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

  if (!isSuperAdmin) {
    return (
      <div>
        <h1 className="admin-page-title">Admin Users</h1>
        <div className="admin-empty-state">
          <div className="empty-icon">
            <FiLock />
          </div>
          <p>Only Super Admins can manage admin users.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page-title">Admin Users</h1>
      {alert && (
        <div className={`admin-alert admin-alert-${alert.type}`}>
          {alert.msg}
        </div>
      )}

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>{admins.length} admin(s)</h3>
          <button
            className="admin-btn admin-btn-primary"
            onClick={() => {
              setForm({ ...emptyAdmin });
              setShowForm(true);
            }}
          >
            + Register Admin
          </button>
        </div>
        <div className="table-overflow">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a._id}>
                  <td style={{ fontWeight: 500 }}>{a.name}</td>
                  <td>{a.email}</td>
                  <td>
                    <span
                      className={`status-badge ${a.role === "super_admin" ? "confirmed" : "draft"}`}
                    >
                      {a.role?.replace("_", " ")}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${a.isActive ? "active" : "inactive"}`}
                    >
                      {a.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td>
                    {a.lastLogin
                      ? new Date(a.lastLogin).toLocaleString()
                      : "Never"}
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button
                        className="admin-btn-icon"
                        title={a.isActive ? "Deactivate" : "Activate"}
                        onClick={() => handleToggleStatus(a._id, a.isActive)}
                        disabled={a._id === currentAdmin?.id}
                      >
                        {a.isActive ? <FiX /> : <FiCheck />}
                      </button>
                      {a._id !== currentAdmin?.id && (
                        <>
                          <button
                            className="admin-btn-icon"
                            title="Reset Password"
                            onClick={() => openResetModal(a)}
                          >
                            <FiKey />
                          </button>
                          <button
                            className="admin-btn-icon"
                            title="Delete"
                            onClick={() => handleDelete(a._id)}
                          >
                            <FiTrash2 />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Register New Admin</h3>
              <button
                className="admin-modal-close"
                onClick={() => setShowForm(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleRegister}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Full Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="admin-form-group">
                  <label>Password (min 8 chars, upper+lower+number)</label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    minLength={8}
                  />
                </div>
                <div className="admin-form-group">
                  <label>Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {resetTarget && (
        <div className="admin-modal-overlay" onClick={closeResetModal}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>Reset Admin Password</h3>
              <button className="admin-modal-close" onClick={closeResetModal}>
                ×
              </button>
            </div>
            <form onSubmit={handleResetPassword}>
              <div className="admin-modal-body">
                <p style={{ marginTop: 0, color: "#666" }}>
                  Set a new password for <strong>{resetTarget.name}</strong>.
                </p>
                <div className="admin-form-group">
                  <label>New Password (min 8 chars, upper+lower+number)</label>
                  <input
                    type="password"
                    value={resetPassword}
                    onChange={(e) => setResetPassword(e.target.value)}
                    minLength={8}
                    required
                  />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-btn admin-btn-secondary"
                  onClick={closeResetModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={isResetting}
                >
                  {isResetting ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminsManagement;
