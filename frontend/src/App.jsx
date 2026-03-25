import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Rooms from "./pages/Rooms";
import Booking from "./pages/Booking";
import DineDrink from "./pages/DineDrink";
import Gallery from "./pages/Gallery";
import Meetings from "./pages/Meetings";
import SpecialOccasions from "./pages/SpecialOccasions";
import EnquiryForm from "./pages/EnquiryForm";
import Facilities from "./pages/Facilities";
import Careers from "./pages/Careers";
import ContactUs from "./pages/ContactUS";

// Admin imports
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BookingsManagement from "./pages/admin/BookingsManagement";
import InquiriesManagement from "./pages/admin/InquiriesManagement";
import MeetingEnquiriesManagement from "./pages/admin/MeetingEnquiriesManagement";
import RoomsManagement from "./pages/admin/RoomsManagement";
import OffersManagement from "./pages/admin/OffersManagement";
import BlogsManagement from "./pages/admin/BlogsManagement";
import CareersManagement from "./pages/admin/CareersManagement";
import AdminsManagement from "./pages/admin/AdminsManagement";

// Public site component (preserves existing state-based routing)
function PublicSite() {
  const [currentPage, setCurrentPage] = useState("home");
  const [bookingCache, setBookingCache] = useState(null);

  if (currentPage === "menu") {
    return (
      <Menu
        onClose={() => setCurrentPage("home")}
        onRoomsClick={() => setCurrentPage("rooms")}
        onBookingClick={() => setCurrentPage("booking")}
        onDineClick={() => setCurrentPage("dine")}
        onGalleryClick={() => setCurrentPage("gallery")}
        onMeetingsClick={() => setCurrentPage("meetings")}
        onSpecialClick={() => setCurrentPage("special")}
        onFacilitiesClick={() => setCurrentPage("facilities")}
        onCareersClick={() => setCurrentPage("careers")}
        onContactClick={() => setCurrentPage("contactus")}
      />
    );
  }

  if (currentPage === "rooms") {
    return (
      <Rooms
        onBackToMenu={() => setCurrentPage("menu")}
        onBookingClick={() => setCurrentPage("booking")}
      />
    );
  }

  if (currentPage === "special") {
    return (
      <SpecialOccasions
        onBackToMenu={() => setCurrentPage("menu")}
        onBookingClick={() => setCurrentPage("booking")}
        onEnquiryClick={() => setCurrentPage("enquiry")}
      />
    );
  }

  if (currentPage === "enquiry") {
    return <EnquiryForm onBackToMenu={() => setCurrentPage("special")} />;
  }

  if (currentPage === "facilities") {
    return (
      <Facilities
        onBackToMenu={() => setCurrentPage("menu")}
        onBookingClick={() => setCurrentPage("booking")}
      />
    );
  }

  if (currentPage === "dine") {
    return (
      <DineDrink
        onBackToMenu={() => setCurrentPage("menu")}
        onBookingClick={() => setCurrentPage("booking")}
      />
    );
  }

  if (currentPage === "gallery") {
    return (
      <Gallery
        onBackToMenu={() => setCurrentPage("menu")}
        onBookingClick={() => setCurrentPage("booking")}
      />
    );
  }

  if (currentPage === "contactus") {
    return (
      <ContactUs
        onBackToMenu={() => setCurrentPage("menu")}
        onBookingClick={() => setCurrentPage("booking")}
      />
    );
  }

  if (currentPage === "meetings") {
    return (
      <Meetings
        onBackToMenu={() => setCurrentPage("menu")}
        onBookingClick={() => setCurrentPage("booking")}
      />
    );
  }

  if (currentPage === "careers") {
    return (
      <Careers
        onBackToMenu={() => setCurrentPage("menu")}
        onBookingClick={() => setCurrentPage("booking")}
      />
    );
  }

  if (currentPage === "booking") {
    return (
      <Booking
        onBackToMenu={() => setCurrentPage("menu")}
        prefilledData={bookingCache}
      />
    );
  }

  return (
    <Home
      onOpenMenu={() => setCurrentPage("menu")}
      onBookingClick={() => setCurrentPage("booking")}
    />
  );
}

function App() {
  return (
    <Routes>
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<BookingsManagement />} />
        <Route path="inquiries" element={<InquiriesManagement />} />
        <Route path="meeting-enquiries" element={<MeetingEnquiriesManagement />} />
        <Route path="rooms" element={<RoomsManagement />} />
        <Route path="offers" element={<OffersManagement />} />
        <Route path="blogs" element={<BlogsManagement />} />
        <Route path="careers" element={<CareersManagement />} />
        <Route path="admins" element={<AdminsManagement />} />
      </Route>

      {/* Public site - existing logic preserved */}
      <Route path="*" element={<PublicSite />} />
    </Routes>
  );
}

export default App;