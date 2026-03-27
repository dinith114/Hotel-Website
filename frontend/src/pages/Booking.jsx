import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api/api";
import "./Booking.css";
import logo from "../assets/logo.png";
import Footer from "../components/Footer";
import PageBackground from "../components/PageBackground";

function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledData = location.state || {};

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [guestPopupOpen, setGuestPopupOpen] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  const getTomorrow = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    country: "Sri Lanka",
    checkInDate: prefilledData?.checkIn || "",
    checkOutDate: prefilledData?.checkOut || "",
    arrivalTime: "",
    specialRemarks: "",
    airportPickup: "No",
    airportDrop: "No",
    rooms: [
      {
        roomType: prefilledData?.roomType || "Standard",
        mealPlan: "Bed and Breakfast",
        adults: prefilledData?.adults || Number(prefilledData?.guests) || 1,
        children: prefilledData?.children || 0,
        roomCount: prefilledData?.roomCount || 1,
      },
    ],
  });

  const guestSummary = `${formData.rooms[0].adults} adult${formData.rooms[0].adults > 1 ? "s" : ""} · ${formData.rooms[0].children} children · ${formData.rooms[0].roomCount} room${formData.rooms[0].roomCount > 1 ? "s" : ""}`;

  const updateGuestField = (field, delta) => {
    setFormData((prev) => {
      const updatedRooms = [...prev.rooms];
      const currentValue = updatedRooms[0][field];

      let minValue = 0;
      if (field === "adults" || field === "roomCount") minValue = 1;

      updatedRooms[0][field] = Math.max(minValue, currentValue + delta);

      return {
        ...prev,
        rooms: updatedRooms,
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "checkInDate") {
      setFormData((prev) => {
        const updated = { ...prev, checkInDate: value };
        if (updated.checkOutDate && updated.checkOutDate <= value) {
          updated.checkOutDate = "";
        }
        return updated;
      });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    const updatedRooms = [...formData.rooms];
    updatedRooms[0][name] =
      name === "adults" || name === "children" || name === "roomCount"
        ? Number(value)
        : value;
    setFormData({ ...formData, rooms: updatedRooms });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.checkInDate || !formData.checkOutDate) {
      setPopup({
        show: true,
        message: "Please select both check-in and check-out dates.",
        type: "error",
      });
      return;
    }

    if (formData.checkOutDate <= formData.checkInDate) {
      setPopup({
        show: true,
        message: "Check-out date must be after check-in date.",
        type: "error",
      });
      return;
    }

    try {
      const response = await api.createBooking(formData);
      setPopup({
        show: true,
        message: response.data?.message || "Booking successfully placed!",
        type: "success",
      });
      console.log("Success:", response.data);
    } catch (error) {
      setPopup({
        show: true,
        message:
          error.response?.data?.message || "Booking failed! See console.",
        type: "error",
      });
      console.error("Error:", error);
    }
  };

  return (
    <div className="booking-page">
      <header className="booking-topbar">
        <img
          src={logo}
          alt="Logo"
          className="booking-logo"
          onClick={() => navigate("/menu")}
          style={{ cursor: "pointer" }}
          title="Back to Menu"
        />
        <button
          className="booking-menu-btn"
          onClick={() => navigate("/menu")}
          type="button"
        >
          &#9776;
        </button>
      </header>

      <PageBackground overlayOpacity={0.22}>
        <main className="booking-main">
          <form className="booking-panel" onSubmit={handleSubmit}>
            <h2>Contact Details</h2>

            <div className="booking-form-grid">
              <label>Name</label>
              <div className="row two">
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <label>Mobile Phone</label>
              <div className="row one">
                <input
                  name="phone"
                  placeholder="+country phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <label>Email</label>
              <div className="row one">
                <input
                  name="email"
                  type="email"
                  placeholder="example@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <label>Country</label>
              <div className="row one">
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option>Sri Lanka</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>Other</option>
                </select>
              </div>

              <label>Arrival Time (e.g. 02:30 PM)</label>
              <div className="row one arrival-row">
                <input
                  name="arrivalTime"
                  placeholder="02:30 PM"
                  value={formData.arrivalTime}
                  onChange={handleChange}
                />
              </div>

              <label>Special Remarks</label>
              <div className="row one">
                <textarea
                  name="specialRemarks"
                  rows="4"
                  value={formData.specialRemarks}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>

            <h2>Booking Details</h2>

            <div className="booking-box">
              <div className="booking-box-row">
                <label>Check-in</label>
                <input
                  type="date"
                  name="checkInDate"
                  min={today}
                  value={formData.checkInDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="booking-box-row">
                <label>Check-out</label>
                <input
                  type="date"
                  name="checkOutDate"
                  min={
                    formData.checkInDate
                      ? getTomorrow(formData.checkInDate)
                      : today
                  }
                  value={formData.checkOutDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="booking-box">
              <p className="box-title">Select Preferred Room & Meal</p>

              <div className="booking-box-row two-cols">
                <div>
                  <label>Rooms</label>
                  <select
                    name="roomType"
                    value={formData.rooms[0].roomType}
                    onChange={handleRoomChange}
                  >
                    <option value="Super Deluxe">Super Deluxe Room</option>
                    <option value="Deluxe">Deluxe Room</option>
                    <option value="Standard">Standard Room</option>
                  </select>
                </div>
                <div>
                  <label>Meal Plan</label>
                  <select
                    name="mealPlan"
                    value={formData.rooms[0].mealPlan}
                    onChange={handleRoomChange}
                  >
                    <option value="Bed and Breakfast">Breakfast</option>
                    <option value="Half Board">Half Board</option>
                    <option value="Full Board">Full Board</option>
                    <option value="Room Only">Room Only</option>
                  </select>
                </div>
              </div>

              <div className="booking-box-row">
                <label>Guests & Rooms</label>
                <div className="guest-selector-wrapper">
                  <button
                    type="button"
                    className="guest-selector-trigger"
                    onClick={() => setGuestPopupOpen((prev) => !prev)}
                  >
                    {guestSummary}
                  </button>

                  {guestPopupOpen && (
                    <div className="guest-selector-popup">
                      <div className="guest-row">
                        <span>Adults</span>
                        <div className="guest-counter">
                          <button type="button" onClick={() => updateGuestField("adults", -1)}>-</button>
                          <span>{formData.rooms[0].adults}</span>
                          <button type="button" onClick={() => updateGuestField("adults", 1)}>+</button>
                        </div>
                      </div>

                      <div className="guest-row">
                        <span>Children</span>
                        <div className="guest-counter">
                          <button type="button" onClick={() => updateGuestField("children", -1)}>-</button>
                          <span>{formData.rooms[0].children}</span>
                          <button type="button" onClick={() => updateGuestField("children", 1)}>+</button>
                        </div>
                      </div>

                      <div className="guest-row">
                        <span>Rooms</span>
                        <div className="guest-counter">
                          <button type="button" onClick={() => updateGuestField("roomCount", -1)}>-</button>
                          <span>{formData.rooms[0].roomCount}</span>
                          <button type="button" onClick={() => updateGuestField("roomCount", 1)}>+</button>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="guest-done-btn"
                        onClick={() => setGuestPopupOpen(false)}
                      >
                        Done
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="booking-box">
              <div className="booking-box-row">
                <label>Airport Pickup</label>
                <select
                  name="airportPickup"
                  value={formData.airportPickup}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>

              <div className="booking-box-row">
                <label>Airport Drop</label>
                <select
                  name="airportDrop"
                  value={formData.airportDrop}
                  onChange={handleChange}
                >
                  <option>No</option>
                  <option>Yes</option>
                </select>
              </div>
            </div>

            <div className="submit-wrap">
              <button className="submit-booking-btn" type="submit">
                SUBMIT YOUR RESERVATION
              </button>
            </div>
          </form>
        </main>
      </PageBackground>

      <Footer />

      {popup.show && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "40px",
              borderRadius: "12px",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
          >
            <h2
              style={{
                color: popup.type === "success" ? "#28a745" : "#dc3545",
                marginTop: 0,
                marginBottom: "15px",
              }}
            >
              {popup.type === "success" ? "Success!" : "Oops!"}
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#333",
                marginBottom: "25px",
                lineHeight: "1.5",
              }}
            >
              {popup.message}
            </p>
            <button
              onClick={() => {
                setPopup({ show: false, message: "", type: "success" });
                if (popup.type === "success") navigate("/");
              }}
              style={{
                padding: "12px 24px",
                backgroundColor: "#00264d",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "bold",
              }}
            >
              {popup.type === "success" ? "Back to Home" : "Close Details"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Booking;