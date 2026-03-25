import { useState } from "react";
import { api } from "../api/api";
import "./EnquiryForm.css";
import logo from "../assets/logo.png";

function EnquiryForm({ onBackToMenu }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobilePhone: "",
    companyName: "",
    landPhone: "",
    companyAddress: "",
    date: "",
    seating: "",
    menuType: "",
    guests: 1,
    equipment: [],
    specialRequirement: "",
  });

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const equipmentItems = [
    "Screen",
    "Magi Board with Markers",
    "Clip-on-Mic (with an additional payment)",
    "TV/VCR",
    "Multimedia Projector (with an additional payment)",
    "P A System",
    "Flip Chart",
    "Podium with Mic",
    "Notepapers & Pencils",
    "Equipment required",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (item) => {
    setFormData((prev) => {
      const isSelected = prev.equipment.includes(item);
      if (isSelected) {
        return { ...prev, equipment: prev.equipment.filter((e) => e !== item) };
      } else {
        return { ...prev, equipment: [...prev.equipment, item] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.submitMeetingEnquiry(formData);
      setPopup({
        show: true,
        message:
          response.data?.message || "Meeting enquiry submitted successfully!",
        type: "success",
      });
      setFormData({
        name: "",
        email: "",
        mobilePhone: "",
        companyName: "",
        landPhone: "",
        companyAddress: "",
        date: "",
        seating: "",
        menuType: "",
        guests: 1,
        equipment: [],
        specialRequirement: "",
      });
    } catch (error) {
      setPopup({
        show: true,
        message:
          error.response?.data?.message || "Failed to send meeting enquiry.",
        type: "error",
      });
    }
  };

  return (
    <div className="enquiry-page">
      <header className="enquiry-topbar">
        <img src={logo} alt="Logo" className="enquiry-logo" />

        <button
          className="enquiry-menu-btn"
          onClick={onBackToMenu}
          type="button"
          aria-label="Back to menu"
        >
          &#9776;
        </button>
      </header>

      <main className="enquiry-main">
        <form className="enquiry-panel" onSubmit={handleSubmit}>
          <h1>Enquiry Form</h1>

          <div className="enquiry-grid">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Mobile Phone</label>
            <input
              type="text"
              name="mobilePhone"
              value={formData.mobilePhone}
              onChange={handleChange}
              required
            />

            <label>Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
            />

            <label>Land Phone</label>
            <input
              type="text"
              name="landPhone"
              value={formData.landPhone}
              onChange={handleChange}
            />

            <label>Company Address</label>
            <input
              type="text"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
            />

            <label>Date</label>
            <div className="row-two">
              <div className="input-with-icon">
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "10px" }}
                  required
                />
              </div>

              <div className="field-with-label">
                <span>Seating</span>
                <select
                  name="seating"
                  value={formData.seating}
                  onChange={handleChange}
                >
                  <option value="">Please choose an option</option>
                  <option value="Theatre Style">Theatre Style</option>
                  <option value="Class Room">Class Room</option>
                  <option value="Board Room">Board Room</option>
                  <option value="U-Shape">U-Shape</option>
                  <option value="Cocktail">Cocktail</option>
                </select>
              </div>
            </div>

            <label>Type of menu</label>
            <div className="row-two">
              <select
                name="menuType"
                value={formData.menuType}
                onChange={handleChange}
              >
                <option value="">Select menu type</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Dinner">Dinner</option>
                <option value="Snacks">Snacks</option>
              </select>

              <div className="field-with-label">
                <span>No. of guests</span>
                <input
                  type="number"
                  min="1"
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="equipment-grid">
            {equipmentItems.map((item, index) => (
              <label key={index} className="equipment-item">
                <input
                  type="checkbox"
                  checked={formData.equipment.includes(item)}
                  onChange={() => handleCheckboxChange(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <textarea
            className="special-requirement"
            placeholder="Special Requirement"
            name="specialRequirement"
            value={formData.specialRequirement}
            onChange={handleChange}
            rows="5"
          />

          <div className="submit-wrap">
            <button type="submit" className="submit-btn">
              SUBMIT
            </button>
          </div>
        </form>
      </main>

      <footer className="enquiry-footer">
        <div className="enquiry-footer-col enquiry-footer-brand">
          <img src={logo} alt="Logo" className="enquiry-footer-logo" />
          <ul>
            <li>Cookie Policy</li>
            <li>Privacy Policy</li>
            <li>Sitemap</li>
            <li>Powered by SLK</li>
            <li>Copyright © 2023 Renuka City Hotel</li>
          </ul>
        </div>

        <div className="enquiry-footer-col">
          <ul>
            <li>home</li>
            <li>rooms</li>
            <li>▪ super deluxe room</li>
            <li>▪ deluxe room</li>
            <li>▪ standard room</li>
            <li>dine & drink</li>
            <li>▪ Palmyrah restaurant & bar</li>
            <li>gallery</li>
          </ul>
        </div>

        <div className="enquiry-footer-col">
          <ul>
            <li>meetings</li>
            <li>special occasions</li>
            <li>facilities</li>
            <li>Colombo</li>
            <li>offers</li>
            <li>our story</li>
            <li>careers</li>
            <li>blog</li>
            <li>privacy policy</li>
            <li>contact us</li>
          </ul>
        </div>

        <div className="enquiry-footer-col">
          <ul>
            <li>328 Galle Road Colombo 3 Sri Lanka</li>
            <li>+94-112573598/602</li>
            <li>+94-112573745/8</li>
            <li>+94-112574137</li>
            <li>+94-112576183</li>
            <li>renukah@renukahotel.com</li>
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
              {popup.type === "success" ? "Thank You!" : "Oops!"}
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

export default EnquiryForm;
