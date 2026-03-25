import { useEffect, useMemo, useState } from "react";
import { api } from "../api/api";
import "./Careers.css";
import logo from "../assets/logo.png";
import hero from "../assets/career.png";

function Careers({ onBackToMenu, onBookingClick }) {
  const [careers, setCareers] = useState([]);
  const [careersLoading, setCareersLoading] = useState(true);
  const [careersError, setCareersError] = useState("");
  const [selectedCareerId, setSelectedCareerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobilePhone: "",
    address: "",
    country: "",
    education: "",
    experience: "",
    skills: "",
    expectedSalary: "",
    availability: "",
    coverLetter: "",
  });

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        setCareersLoading(true);
        setCareersError("");

        const response = await api.getCareers();
        const jobs = response.data?.data?.docs || [];

        setCareers(jobs);
        if (jobs.length > 0) {
          setSelectedCareerId(jobs[0]._id);
        }
      } catch (error) {
        setCareersError(
          error.response?.data?.message ||
            "Unable to load careers right now. Please try again shortly.",
        );
      } finally {
        setCareersLoading(false);
      }
    };

    fetchCareers();
  }, []);

  const selectedCareer = useMemo(
    () => careers.find((career) => career._id === selectedCareerId),
    [careers, selectedCareerId],
  );

  const formattedDeadline = useMemo(() => {
    if (!selectedCareer?.applicationDeadline) {
      return "Open until filled";
    }

    const deadlineDate = new Date(selectedCareer.applicationDeadline);
    if (Number.isNaN(deadlineDate.getTime())) {
      return "Open until filled";
    }

    return deadlineDate.toLocaleDateString();
  }, [selectedCareer]);

  const formattedSalaryRange = useMemo(() => {
    if (!selectedCareer?.salaryRange) {
      return "Not specified";
    }

    const { min, max, currency } = selectedCareer.salaryRange;
    const salaryCurrency = currency || "USD";

    if (min == null && max == null) {
      return "Not specified";
    }

    if (min != null && max != null) {
      return `${salaryCurrency} ${min} - ${max}`;
    }

    if (min != null) {
      return `${salaryCurrency} ${min}+`;
    }

    return `Up to ${salaryCurrency} ${max}`;
  }, [selectedCareer]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = async (event) => {
    event.preventDefault();

    if (!selectedCareerId) {
      setPopup({
        show: true,
        message: "Please select a vacancy before submitting your application.",
        type: "error",
      });
      return;
    }

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      phone: formData.mobilePhone.trim(),
      address: {
        street: formData.address.trim(),
        city: "",
        state: "",
        country: formData.country.trim(),
        zipCode: "",
      },
      education: formData.education.trim(),
      experience: formData.experience.trim(),
      skills: formData.skills.trim(),
      expectedSalary: formData.expectedSalary
        ? Number(formData.expectedSalary)
        : undefined,
      availability: formData.availability,
      coverLetter: formData.coverLetter.trim(),
    };

    try {
      setIsSubmitting(true);
      const response = await api.applyToCareer(selectedCareerId, payload);

      setPopup({
        show: true,
        message:
          response.data?.message ||
          "Your application has been submitted successfully.",
        type: "success",
      });

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        mobilePhone: "",
        address: "",
        country: "",
        education: "",
        experience: "",
        skills: "",
        expectedSalary: "",
        availability: "Negotiable",
        coverLetter: "",
      });
    } catch (error) {
      setPopup({
        show: true,
        message:
          error.response?.data?.errors?.[0]?.message ||
          error.response?.data?.message ||
          "Failed to submit application. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="careers-page">
      <section className="careers-hero">
        <img src={hero} alt="Careers" className="careers-hero-bg" />
        <div className="careers-hero-overlay" />

        <header className="careers-top-bar">
          <img src={logo} alt="Logo" className="careers-logo" />

          <button
            className="careers-menu-btn"
            aria-label="Back to menu"
            onClick={onBackToMenu}
            type="button"
          >
            &#9776;
          </button>
        </header>

        <div className="careers-hero-content">
          <h1>Careers</h1>
        </div>

        <div className="careers-booking-bar">
          <div className="careers-booking-item">📅 CHECK IN</div>
          <div className="careers-booking-item">📅 CHECK OUT</div>
          <div className="careers-booking-item">👥 GUESTS</div>
          <button
            className="careers-book-now-btn"
            type="button"
            onClick={onBookingClick}
          >
            BOOK NOW
          </button>
        </div>
      </section>

      <section className="careers-content">
        <div className="vacancies-panel">
          <h2>Vacancies</h2>

          <select
            className="vacancy-select"
            value={selectedCareerId}
            onChange={(event) => setSelectedCareerId(event.target.value)}
            disabled={careersLoading || careers.length === 0}
          >
            {careers.length === 0 && (
              <option value="">
                {careersLoading ? "Loading..." : "No vacancies"}
              </option>
            )}
            {careers.map((career) => (
              <option key={career._id} value={career._id}>
                {career.title}
              </option>
            ))}
          </select>

          {careersError && <p className="career-status-text">{careersError}</p>}

          {!careersError && selectedCareer ? (
            <div className="career-details-card">
              <p className="career-status-text">
                {selectedCareer.department} | {selectedCareer.location} |{" "}
                {selectedCareer.employmentType}
              </p>

              <ul className="career-details-list">
                <li>
                  <strong>Vacancies:</strong> {selectedCareer.vacancies || 1}
                </li>
                <li>
                  <strong>Experience Required:</strong>{" "}
                  {selectedCareer.experienceRequired || "Not specified"}
                </li>
                <li>
                  <strong>Salary Range:</strong> {formattedSalaryRange}
                </li>
                <li>
                  <strong>Application Deadline:</strong> {formattedDeadline}
                </li>
              </ul>

              <p className="career-detail-block">
                <strong>Description:</strong> {selectedCareer.description}
              </p>

              <p className="career-detail-block">
                <strong>Requirements:</strong> {selectedCareer.requirements}
              </p>

              {selectedCareer.responsibilities && (
                <p className="career-detail-block">
                  <strong>Responsibilities:</strong>{" "}
                  {selectedCareer.responsibilities}
                </p>
              )}
            </div>
          ) : (
            <p>Join our team of highly trained hospitality professionals.</p>
          )}
        </div>

        <div className="careers-form-panel">
          <form className="careers-form-grid" onSubmit={handleApply}>
            <label>First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />

            <label>Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
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

            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <label>Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Enter country"
              required
            />

            <label>Education</label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleChange}
              required
            />

            <label>Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              required
            />

            <label>Skills</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="Optional"
            />

            <label>Expected Salary</label>
            <input
              type="number"
              min="0"
              name="expectedSalary"
              value={formData.expectedSalary}
              onChange={handleChange}
              placeholder="Optional"
            />

            <label>Availability</label>
            <select
              className="careers-availability-select"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
            >
              <option value="Immediate">Immediate</option>
              <option value="Within 2 weeks">Within 2 weeks</option>
              <option value="Within 1 month">Within 1 month</option>
              <option value="Within 2 months">Within 2 months</option>
              <option value="Negotiable">Negotiable</option>
            </select>

            <label>Cover Letter</label>
            <textarea
              className="careers-cover-letter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleChange}
              maxLength={2000}
              required
            />

            <div className="resume-row">
              <button type="button" className="upload-btn">
                Uplode Resume
              </button>
              <p>Please upload file with PDF format (max-file-size 2MB)</p>
            </div>

            <div className="apply-wrap">
              <button
                type="submit"
                className="apply-btn"
                disabled={
                  isSubmitting || careersLoading || careers.length === 0
                }
              >
                {isSubmitting ? "APPLYING..." : "APPLY"}
              </button>
            </div>
          </form>
        </div>
      </section>

      <footer className="careers-footer">
        <div className="careers-footer-col careers-footer-brand">
          <img src={logo} alt="Logo" className="careers-footer-logo" />
          <ul>
            <li>Cookie Policy</li>
            <li>Privacy Policy</li>
            <li>Sitemap</li>
            <li>Powered by SLK</li>
            <li>Copyright © 2023 Renuka City Hotel</li>
          </ul>
        </div>

        <div className="careers-footer-col">
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

        <div className="careers-footer-col">
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

        <div className="careers-footer-col">
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
              maxWidth: "420px",
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
              type="button"
              onClick={() =>
                setPopup({ show: false, message: "", type: "success" })
              }
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
              {popup.type === "success" ? "Close" : "Close Details"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Careers;
