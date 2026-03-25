import { useState } from "react";
import axios from "axios";
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
    type: "",
  });

  const [errors, setErrors] = useState({});

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.mobilePhone.trim()) {
      newErrors.mobilePhone = "Mobile phone is required";
    } else if (!/^[0-9+\-\s]{10,15}$/.test(formData.mobilePhone)) {
      newErrors.mobilePhone = "Enter a valid phone number";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.seating) {
      newErrors.seating = "Please select a seating type";
    }

    if (!formData.menuType) {
      newErrors.menuType = "Please select a menu type";
    }

    if (!formData.guests || Number(formData.guests) < 1) {
      newErrors.guests = "Guests must be at least 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const handleEquipmentChange = (item) => {
    setFormData((prev) => {
      const exists = prev.equipment.includes(item);

      return {
        ...prev,
        equipment: exists
          ? prev.equipment.filter((eq) => eq !== item)
          : [...prev.equipment, item],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/meeting-enquiries",
        formData
      );

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

      setErrors({});
    } catch (error) {
      setPopup({
        show: true,
        message:
          error.response?.data?.message ||
          "Failed to send meeting enquiry.",
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
            <div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="error-text">{errors.name}</p>}
            </div>

            <label>Email</label>
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="error-text">{errors.email}</p>}
            </div>

            <label>Mobile Phone</label>
            <div>
              <input
                type="text"
                name="mobilePhone"
                value={formData.mobilePhone}
                onChange={handleChange}
              />
              {errors.mobilePhone && (
                <p className="error-text">{errors.mobilePhone}</p>
              )}
            </div>

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
              <div>
                <div className="input-with-icon">
                  <span className="input-icon">📅</span>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                  />
                </div>
                {errors.date && <p className="error-text">{errors.date}</p>}
              </div>

              <div className="field-with-label">
                <span>Seating</span>
                <div>
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
                  {errors.seating && (
                    <p className="error-text">{errors.seating}</p>
                  )}
                </div>
              </div>
            </div>

            <label>Type of menu</label>
            <div className="row-two">
              <div>
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
                {errors.menuType && (
                  <p className="error-text">{errors.menuType}</p>
                )}
              </div>

              <div className="field-with-label">
                <span>No. of guests</span>
                <div>
                  <input
                    type="number"
                    min="1"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                  />
                  {errors.guests && (
                    <p className="error-text">{errors.guests}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="equipment-grid">
            {equipmentItems.map((item, index) => (
              <label key={index} className="equipment-item">
                <input
                  type="checkbox"
                  checked={formData.equipment.includes(item)}
                  onChange={() => handleEquipmentChange(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>

          <textarea
            className="special-requirement"
            placeholder="Special Requirement"
            rows="5"
            name="specialRequirement"
            value={formData.specialRequirement}
            onChange={handleChange}
          />

          <div className="submit-wrap">
            <button type="submit" className="submit-btn">
              SUBMIT
            </button>
          </div>
        </form>
      </main>

      {popup.show && (
        <div className={`popup-overlay ${popup.type}`}>
          <div className="popup-box">
            <p>{popup.message}</p>
            <button
              type="button"
              onClick={() =>
                setPopup({ show: false, message: "", type: "" })
              }
            >
              OK
            </button>
          </div>
        </div>
      )}

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
    </div>
  );
}

export default EnquiryForm;