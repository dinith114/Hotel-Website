import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1",
});

export const api = {
  createBooking: (payload) => apiClient.post("/bookings", payload),
  checkRoomAvailability: (payload) =>
    apiClient.post("/bookings/availability", payload),
  submitInquiry: (payload) => apiClient.post("/inquiries", payload),
  submitMeetingEnquiry: (payload) =>
    apiClient.post("/meeting-enquiries", payload),
  getCareers: () => apiClient.get("/careers"),
  applyToCareer: (careerId, payload) =>
    apiClient.post(`/careers/${careerId}/apply`, payload),
};

export default apiClient;
