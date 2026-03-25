import axios from "axios";

const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
});

// Attach token to every request
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("adminToken");
      window.location.href = "/admin/login";
    }
    return Promise.reject(error);
  },
);

// ─── Auth ────────────────────────────────────────
export const authApi = {
  login: (data) => adminApi.post("/auth/login", data),
  getMe: () => adminApi.get("/auth/me"),
  updateProfile: (data) => adminApi.put("/auth/update-profile", data),
  changePassword: (data) => adminApi.put("/auth/change-password", data),
  registerAdmin: (data) => adminApi.post("/auth/register", data),
  getAllAdmins: () => adminApi.get("/auth/admins"),
  updateAdminStatus: (id, data) =>
    adminApi.put(`/auth/admins/${id}/status`, data),
  resetAdminPassword: (id, data) =>
    adminApi.put(`/auth/admins/${id}/reset-password`, data),
  deleteAdmin: (id) => adminApi.delete(`/auth/admins/${id}`),
};

// ─── Bookings ────────────────────────────────────
export const bookingsApi = {
  getAll: () => adminApi.get("/bookings"),
  getById: (id) => adminApi.get(`/bookings/${id}`),
  update: (id, data) => adminApi.put(`/bookings/${id}`, data),
  delete: (id) => adminApi.delete(`/bookings/${id}`),
};

// ─── Inquiries ───────────────────────────────────
export const inquiriesApi = {
  getAll: () => adminApi.get("/inquiries"),
  updateStatus: (id, data) => adminApi.put(`/inquiries/${id}/status`, data),
};

// ─── Meeting Enquiries ───────────────────────────
export const meetingEnquiriesApi = {
  getAll: () => adminApi.get("/meeting-enquiries"),
};

// ─── Rooms ───────────────────────────────────────
export const roomsApi = {
  getAll: () => adminApi.get("/rooms"),
  create: (data) => adminApi.post("/rooms", data),
  update: (id, data) => adminApi.put(`/rooms/${id}`, data),
  delete: (id) => adminApi.delete(`/rooms/${id}`),
};

// ─── Offers ──────────────────────────────────────
export const offersApi = {
  getAll: () => adminApi.get("/offers"),
  getById: (id) => adminApi.get(`/offers/${id}`),
  getStats: () => adminApi.get("/offers/stats/overview"),
  create: (data) => adminApi.post("/offers", data),
  update: (id, data) => adminApi.put(`/offers/${id}`, data),
  delete: (id) => adminApi.delete(`/offers/${id}`),
};

// ─── Blogs ───────────────────────────────────────
export const blogsApi = {
  getAll: () => adminApi.get("/blogs"),
  getById: (id) => adminApi.get(`/blogs/${id}`),
  getStats: () => adminApi.get("/blogs/stats/overview"),
  create: (data) => adminApi.post("/blogs", data),
  update: (id, data) => adminApi.put(`/blogs/${id}`, data),
  delete: (id) => adminApi.delete(`/blogs/${id}`),
  getCategories: () => adminApi.get("/blogs/categories/all"),
  createCategory: (data) => adminApi.post("/blogs/categories", data),
  updateCategory: (id, data) => adminApi.put(`/blogs/categories/${id}`, data),
  deleteCategory: (id) => adminApi.delete(`/blogs/categories/${id}`),
};

// ─── Careers ─────────────────────────────────────
export const careersApi = {
  getAll: () => adminApi.get("/careers"),
  getById: (id) => adminApi.get(`/careers/${id}`),
  getStats: () => adminApi.get("/careers/stats/overview"),
  create: (data) => adminApi.post("/careers", data),
  update: (id, data) => adminApi.put(`/careers/${id}`, data),
  delete: (id) => adminApi.delete(`/careers/${id}`),
  // Job Applications
  getApplications: () => adminApi.get("/careers/applications/all"),
  getApplicationById: (id) => adminApi.get(`/careers/applications/${id}`),
  getApplicationStats: () =>
    adminApi.get("/careers/applications/stats/overview"),
  updateApplicationStatus: (id, data) =>
    adminApi.put(`/careers/applications/${id}/status`, data),
  deleteApplication: (id) => adminApi.delete(`/careers/applications/${id}`),
};

export default adminApi;
