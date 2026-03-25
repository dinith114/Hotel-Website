import { useState } from "react";
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
import Colombo from "./pages/Colombo"

function App() {
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
        onColomboClick={()=> setCurrentPage("colombo")}
        
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

  if (currentPage === "colombo") {
    return (
      <Colombo
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
if (currentPage === "facilities") {
  return (
    <Facilities
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

export default App;