import { useState, useEffect } from "react";
import { blogsApi } from "../../api/adminApi";
import { useAuth } from "../../context/AuthContext";
import { FiFileText, FiFolder, FiEdit2, FiTrash2 } from "react-icons/fi";

const emptyBlog = {
  title: "", excerpt: "", content: "", category: "", tags: "",
  status: "draft", featuredImageUrl: "", isFeatured: false,
};

function BlogsManagement() {
  const { admin } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("blogs");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ ...emptyBlog });
  const [catForm, setCatForm] = useState({ name: "", description: "" });
  const [showCatForm, setShowCatForm] = useState(false);
  const [editCatId, setEditCatId] = useState(null);
  const [alert, setAlert] = useState(null);

  const fetchData = async () => {
    try {
      const [blogsRes, catsRes] = await Promise.allSettled([
        blogsApi.getAll(),
        blogsApi.getCategories(),
      ]);
      const blogsData = blogsRes.status === "fulfilled" ? blogsRes.value.data.data : [];
      setBlogs(Array.isArray(blogsData) ? blogsData : blogsData?.docs || []);
      setCategories(catsRes.status === "fulfilled" ? catsRes.value.data.data || [] : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const showAlertMsg = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  // Blog CRUD
  const openCreateBlog = () => {
    setForm({ ...emptyBlog });
    setEditId(null);
    setShowForm(true);
  };

  const openEditBlog = (blog) => {
    setForm({
      title: blog.title || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      category: blog.category?._id || blog.category || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
      status: blog.status || "draft",
      featuredImageUrl: blog.featuredImageUrl || "",
      isFeatured: blog.isFeatured || false,
    });
    setEditId(blog._id);
    setShowForm(true);
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
      author: admin?.id,
    };
    try {
      if (editId) {
        await blogsApi.update(editId, payload);
        showAlertMsg("Blog updated");
      } else {
        await blogsApi.create(payload);
        showAlertMsg("Blog created");
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      showAlertMsg(err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Delete this blog post?")) return;
    try {
      await blogsApi.delete(id);
      showAlertMsg("Blog deleted");
      fetchData();
    } catch (err) {
      showAlertMsg(err.response?.data?.message || "Failed to delete", "error");
    }
  };

  // Category CRUD
  const openCreateCat = () => {
    setCatForm({ name: "", description: "" });
    setEditCatId(null);
    setShowCatForm(true);
  };

  const openEditCat = (cat) => {
    setCatForm({ name: cat.name, description: cat.description || "" });
    setEditCatId(cat._id);
    setShowCatForm(true);
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCatId) {
        await blogsApi.updateCategory(editCatId, catForm);
        showAlertMsg("Category updated");
      } else {
        await blogsApi.createCategory(catForm);
        showAlertMsg("Category created");
      }
      setShowCatForm(false);
      fetchData();
    } catch (err) {
      showAlertMsg(err.response?.data?.message || "Operation failed", "error");
    }
  };

  const handleDeleteCat = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await blogsApi.deleteCategory(id);
      showAlertMsg("Category deleted");
      fetchData();
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
      <h1 className="admin-page-title">Blog Management</h1>
      {alert && <div className={`admin-alert admin-alert-${alert.type}`}>{alert.msg}</div>}

      <div className="admin-tabs">
        <button className={`admin-tab ${activeTab === "blogs" ? "active" : ""}`} onClick={() => setActiveTab("blogs")}>
          Blog Posts ({blogs.length})
        </button>
        <button className={`admin-tab ${activeTab === "categories" ? "active" : ""}`} onClick={() => setActiveTab("categories")}>
          Categories ({categories.length})
        </button>
      </div>

      {activeTab === "blogs" && (
        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h3>{blogs.length} post(s)</h3>
            <button className="admin-btn admin-btn-primary" onClick={openCreateBlog}>+ New Post</button>
          </div>
          <div className="table-overflow">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Views</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.length === 0 ? (
                  <tr><td colSpan="6"><div className="admin-empty-state"><div className="empty-icon"><FiFileText /></div><p>No blog posts yet</p></div></td></tr>
                ) : (
                  blogs.map((b) => (
                    <tr key={b._id}>
                      <td style={{ fontWeight: 500 }}>
                        {b.title}
                        {b.isFeatured && <span style={{ marginLeft: 6, fontSize: "0.7rem", background: "#cda92f", color: "#111", padding: "2px 6px", borderRadius: 4 }}>Featured</span>}
                      </td>
                      <td>{b.category?.name || "—"}</td>
                      <td><span className={`status-badge ${b.status}`}>{b.status}</span></td>
                      <td>{b.viewsCount || 0}</td>
                      <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-btn-icon" title="Edit" onClick={() => openEditBlog(b)}><FiEdit2 /></button>
                          <button className="admin-btn-icon" title="Delete" onClick={() => handleDeleteBlog(b._id)}><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "categories" && (
        <div className="admin-table-wrapper">
          <div className="admin-table-header">
            <h3>{categories.length} category(ies)</h3>
            <button className="admin-btn admin-btn-primary" onClick={openCreateCat}>+ Add Category</button>
          </div>
          <div className="table-overflow">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr><td colSpan="5"><div className="admin-empty-state"><div className="empty-icon"><FiFolder /></div><p>No categories yet</p></div></td></tr>
                ) : (
                  categories.map((c) => (
                    <tr key={c._id}>
                      <td style={{ fontWeight: 500 }}>{c.name}</td>
                      <td>{c.slug}</td>
                      <td>{c.description || "—"}</td>
                      <td><span className={`status-badge ${c.isActive !== false ? "active" : "inactive"}`}>{c.isActive !== false ? "Active" : "Inactive"}</span></td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-btn-icon" title="Edit" onClick={() => openEditCat(c)}><FiEdit2 /></button>
                          <button className="admin-btn-icon" title="Delete" onClick={() => handleDeleteCat(c._id)}><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Blog Form Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editId ? "Edit Blog Post" : "Create Blog Post"}</h3>
              <button className="admin-modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form onSubmit={handleBlogSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Title</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required maxLength={200} />
                </div>
                <div className="admin-form-group">
                  <label>Excerpt</label>
                  <textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} required maxLength={500} style={{ minHeight: 60 }} />
                </div>
                <div className="admin-form-group">
                  <label>Content</label>
                  <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required style={{ minHeight: 200 }} />
                </div>
                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                      <option value="">Select category</option>
                      {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Status</label>
                    <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label>Tags (comma separated)</label>
                  <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="hotel, travel, luxury" />
                </div>
                <div className="admin-form-group">
                  <label>Featured Image URL</label>
                  <input value={form.featuredImageUrl} onChange={(e) => setForm({ ...form, featuredImageUrl: e.target.value })} placeholder="https://..." />
                </div>
                <div className="admin-form-group">
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                    <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} style={{ width: "auto" }} />
                    Featured Post
                  </label>
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">{editId ? "Update" : "Publish"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {showCatForm && (
        <div className="admin-modal-overlay" onClick={() => setShowCatForm(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{editCatId ? "Edit Category" : "Add Category"}</h3>
              <button className="admin-modal-close" onClick={() => setShowCatForm(false)}>×</button>
            </div>
            <form onSubmit={handleCatSubmit}>
              <div className="admin-modal-body">
                <div className="admin-form-group">
                  <label>Category Name</label>
                  <input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} required />
                </div>
                <div className="admin-form-group">
                  <label>Description</label>
                  <textarea value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} />
                </div>
              </div>
              <div className="admin-modal-footer">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowCatForm(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn-primary">{editCatId ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogsManagement;
