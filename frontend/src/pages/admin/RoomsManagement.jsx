import { useState, useEffect } from "react";
import { roomsApi } from "../../api/adminApi";
import { FiLayers, FiEdit2, FiTrash2 } from "react-icons/fi";

const emptyRoom = { roomType: "", totalInventory: 10, pricePerNight: 0, description: "", isActive: true };

function RoomsManagement() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyRoom });
  const [alert, setAlert] = useState(null);

  const fetchRooms = async () => {
    try {
      const res = await roomsApi.getAll();
      setRooms(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRooms(); }, []);

  const showAlertMsg = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const openCreate = () => {
    setForm({ ...emptyRoom });
    setEditId(null);
    setShowForm(true);
  };

  const openEdit = (room) => {
    setForm({
      roomType: room.roomType,
      totalInventory: room.totalInventory,
      pricePerNight: room.pricePerNight || 0,
      description: room.description || "",
      isActive: room.isActive !== false,
    });
    setEditId(room._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await roomsApi.update(editId, form);
        showAlertMsg("Room updated successfully");
      } else {
        await roomsApi.create(form);
        showAlertMsg("Room created successfully");
      }
      setShowForm(false);
      fetchRooms();
    } catch (err) {
      showAlertMsg(err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room type?")) return;
    try {
      await roomsApi.delete(id);
      showAlertMsg("Room deleted");
      fetchRooms();
    } catch (err) {
      showAlertMsg(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  if (loading) {
    return (
      <div className="admin-loading-screen" style={{ height: "50vh", background: "transparent" }}>
        <div className="admin-spinner" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page-title">Rooms</h1>

      {alert && <div className={`admin-alert admin-alert-${alert.type}`}>{alert.msg}</div>}

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>{rooms.length} room type(s)</h3>
          <button className="admin-btn admin-btn-primary" onClick={openCreate}>
            + Add Room Type
          </button>
        </div>
        <div className="table-overflow">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Room Type</th>
                <th>Inventory</th>
                <th>Price/Night</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="admin-empty-state">
                      <div className="empty-icon"><FiLayers /></div>
                      <p>No room types configured</p>
                    </div>
                  </td>
                </tr>
              ) : (
                rooms.map((r) => (
                  <tr key={r._id}>
                    <td style={{ fontWeight: 500 }}>{r.roomType}</td>
                    <td>{r.totalInventory}</td>
                    <td>${r.pricePerNight || 0}</td>
                    <td>
                      <span className={`status-badge ${r.isActive !== false ? "active" : "inactive"}`}>
                        {r.isActive !== false ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button className="admin-btn-icon" title="Edit" onClick={() => openEdit(r)}><FiEdit2 /></button>
                        <button className="admin-btn-icon" title="Delete" onClick={() => handleDelete(r._id)}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editId ? "Edit Room Type" : "Add Room Type"}</h3>
              <button className="admin-modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Room Type Name</label>
                  <input
                    value={form.roomType}
                    onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                    placeholder="e.g. Executive Suite"
                    required
                  />
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Total Inventory</label>
                    <input
                      type="number"
                      min="1"
                      value={form.totalInventory}
                      onChange={(e) => setForm({ ...form, totalInventory: parseInt(e.target.value) || 0 })}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>Price Per Night ($)</label>
                    <input
                      type="number"
                      min="0"
                      value={form.pricePerNight}
                      onChange={(e) => setForm({ ...form, pricePerNight: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Room description..."
                  />
                </div>
                <div className="admin-form-group">
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      style={{ width: "auto" }}
                    />
                    Active
                  </label>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn admin-btn-primary">
                  {editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomsManagement;
