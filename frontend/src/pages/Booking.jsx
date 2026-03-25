import { useState } from "react";
import axios from "axios";
import "./Booking.css";
import logo from "../assets/logo.png";

function Booking({ onBackToMenu, prefilledData }) {
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });
  const [errors, setErrors] = useState({});
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
        guests: prefilledData?.guests || 1
      }
    ]
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9+\-\s]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.checkInDate) {
      newErrors.checkInDate = "Check-in date is required";
    }

    if (!formData.checkOutDate) {
      newErrors.checkOutDate = "Check-out date is required";
    }

    if (
      formData.checkInDate &&
      formData.checkOutDate &&
      new Date(formData.checkOutDate) <= new Date(formData.checkInDate)
    ) {
      newErrors.checkOutDate = "Check-out date must be after check-in date";
    }

    if (!formData.rooms[0].roomType) {
      newErrors.roomType = "Please select a room type";
    }

    if (!formData.rooms[0].mealPlan) {
      newErrors.mealPlan = "Please select a meal plan";
    }

    if (!formData.rooms[0].guests || Number(formData.rooms[0].guests) < 1) {
      newErrors.guests = "Guests must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    const updatedRooms = [...formData.rooms];
    updatedRooms[0][name] = name === "guests" ? Number(value) : value;
    setFormData({ ...formData, rooms: updatedRooms });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/v1/bookings", formData);
      setPopup({ show: true, message: response.data?.message || "Booking successfully placed!", type: "success" });
      console.log("Success:", response.data);
    } catch (error) {
      setPopup({ show: true, message: error.response?.data?.message || "Booking failed! See console.", type: "error" });
      console.error("Error:", error);
    }
  };

  return (
    <div className="booking-page">
      <header className="booking-topbar">
        <img src={logo} alt="Logo" className="booking-logo" onClick={onBackToMenu} style={{ cursor: "pointer" }} title="Back to Menu" />
        <button className="booking-menu-btn" onClick={onBackToMenu} type="button">&#9776;</button>
      </header>

      <main className="booking-main">
        <form className="booking-panel" onSubmit={handleSubmit}>
          <h2>Contact Details</h2>

          <div className="booking-form-grid">
            <label>Name</label>
            <div className="row two">
              <div>
                <input
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {errors.firstName && <p className="error-text">{errors.firstName}</p>}
              </div>

              <div>
                <input
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {errors.lastName && <p className="error-text">{errors.lastName}</p>}
              </div>
            </div>

            <label>Mobile Phone</label>
            <div className="row one">
              <div>
                <input
                  name="phone"
                  placeholder="+country phone number"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <p className="error-text">{errors.phone}</p>}
              </div>
            </div>

            <label>Email</label>
            <div className="row one">
              <div>
                <input
                  name="email"
                  type="email"
                  placeholder="example@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="error-text">{errors.email}</p>}
              </div>
            </div>

            <label>Country</label>
            <div className="row one">
              <select name="country" value={formData.country} onChange={handleChange}>
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
              <div>
                <input
                  type="date"
                  name="checkInDate"
                  value={formData.checkInDate}
                  onChange={handleChange}
                />
                {errors.checkInDate && <p className="error-text">{errors.checkInDate}</p>}
              </div>
            </div>

            <div className="booking-box-row">
              <label>Check-out</label>
              <div>
                <input
                  type="date"
                  name="checkOutDate"
                  value={formData.checkOutDate}
                  onChange={handleChange}
                />
                {errors.checkOutDate && <p className="error-text">{errors.checkOutDate}</p>}
              </div>
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
                {errors.roomType && <p className="error-text">{errors.roomType}</p>}
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
                {errors.mealPlan && <p className="error-text">{errors.mealPlan}</p>}
              </div>
            </div>

            <div className="booking-box-row two-cols">
              <div>
                <label>Guests</label>
                <input
                  type="number"
                  name="guests"
                  min="1"
                  placeholder="1"
                  value={formData.rooms[0].guests}
                  onChange={handleRoomChange}
                />
                {errors.guests && <p className="error-text">{errors.guests}</p>}
              </div>
            </div>
          </div>

          <div className="booking-box">
            <div className="booking-box-row">
              <label>Airport Pickup</label>
              <select name="airportPickup" value={formData.airportPickup} onChange={handleChange}>
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>

            <div className="booking-box-row">
              <label>Airport Drop</label>
              <select name="airportDrop" value={formData.airportDrop} onChange={handleChange}>
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

      <footer className="booking-footer">
        <div className="booking-footer-col booking-footer-brand">
          <img src={logo} alt="Logo" className="booking-footer-logo" />
          <ul>
            <li>Copyright © 2023 Renuka City Hotel</li>
          </ul>
        </div>
      </footer>

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
            zIndex: 1000
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
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
            }}
          >
            <h2
              style={{
                color: popup.type === "success" ? "#28a745" : "#dc3545",
                marginTop: 0,
                marginBottom: "15px"
              }}
            >
              {popup.type === "success" ? "Success!" : "Oops!"}
            </h2>
            <p
              style={{
                fontSize: "16px",
                color: "#333",
                marginBottom: "25px",
                lineHeight: "1.5"
              }}
            >
              {popup.message}
            </p>
            <button
              onClick={() => {
                setPopup({ show: false, message: "", type: "success" });
                if (popup.type === "success" && onBackToMenu) onBackToMenu();
              }}
              style={{
                padding: "12px 24px",
                backgroundColor: "#00264d",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "bold"
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