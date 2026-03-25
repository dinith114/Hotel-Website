import "./Careers.css";
import logo from "../assets/logo.png";
import hero from "../assets/career.png";

function Careers({ onBackToMenu, onBookingClick }) {
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

          <select className="vacancy-select" defaultValue="">
            <option value="" disabled>
              Select
            </option>
            <option>Front Office Executive</option>
            <option>Chef</option>
            <option>Restaurant Supervisor</option>
            <option>Housekeeping Staff</option>
            <option>Receptionist</option>
          </select>

          <p>
            Join our team of highly trained hospitality professionals.
          </p>
        </div>

        <div className="careers-form-panel">
          <div className="careers-form-grid">
            <label>Name</label>
            <input type="text" />

            <label>Email</label>
            <input type="email" />

            <label>Mobile Phone</label>
            <input type="text" />

            <label>Address</label>
            <input type="text" />
          </div>

          <div className="resume-row">
            <button type="button" className="upload-btn">
              Uplode Resume
            </button>
            <p>Please upload file with PDF format (max-file-size 2MB)</p>
          </div>

          <div className="apply-wrap">
            <button type="button" className="apply-btn">
              APPLY
            </button>
          </div>
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
    </div>
  );
}

export default Careers;