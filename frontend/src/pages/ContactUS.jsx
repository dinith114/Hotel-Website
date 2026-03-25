import { useState } from "react";
import { api } from "../api/api";
import "./ContactUs.css";
import logo from "../assets/logo.png";

function ContactUs({ onBackToMenu }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.submitInquiry(formData);
      setPopup({
        show: true,
        message: response.data?.message || "Message successfully sent!",
        type: "success",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      setPopup({
        show: true,
        message:
          error.response?.data?.message ||
          "Failed to send message. Please try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="contactus-page">
      <header className="contactus-topbar">
        <img
          src={logo}
          alt="Logo"
          className="contactus-logo"
          onClick={onBackToMenu}
          style={{ cursor: "pointer" }}
          title="Back to Menu"
        />

        <button
          className="contactus-menu-btn"
          onClick={onBackToMenu}
          type="button"
          aria-label="Back to menu"
        >
          &#9776;
        </button>
      </header>

      <main className="contactus-main">
        <form className="contactus-panel" onSubmit={handleSubmit}>
          <h1>Contact Us</h1>
          <p className="contactus-subtitle">We would love to hear from you!</p>

          <div className="contactus-grid">
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

            <label>Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />

            <label>Message</label>
            <textarea
              placeholder="How can we help you?"
              rows="5"
              name="message"
              value={formData.message}
              onChange={handleChange}
              style={{ gridColumn: "span 2" }}
              required
            />
          </div>

          <div className="submit-wrap">
            <button type="submit" className="submit-btn">
              SEND MESSAGE
            </button>
          </div>
        </form>
      </main>

      <footer className="contactus-footer">
        <div className="contactus-footer-col contactus-footer-brand">
          <img src={logo} alt="Logo" className="contactus-footer-logo" />
          <ul>
            <li>Cookie Policy</li>
            <li>Privacy Policy</li>
            <li>Sitemap</li>
            <li>Powered by SLK</li>
            <li>Copyright © 2023 Renuka City Hotel</li>
          </ul>
        </div>

        <div className="contactus-footer-col">
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

        <div className="contactus-footer-col">
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

        <div className="contactus-footer-col">
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

export default ContactUs;
