import "./SpecialOccasions.css";

import logo from "../assets/logo.png";
import hero from "../assets/flo.png";
import girl from "../assets/girl.png";
import shoe from "../assets/shoe.png";
import glass from "../assets/glass.png";
import boket from "../assets/boket.png";

function OccasionCard({ image, title }) {
  return (
    <div className="occasion-card">
      <img src={image} alt={title} className="occasion-card-image" />
      <div className="occasion-card-body">
        <h3>{title}</h3>
      </div>
      <button type="button" className="occasion-card-btn">
        View
      </button>
    </div>
  );
}

function SpecialOccasions({ onBackToMenu, onBookingClick, onEnquiryClick }) {
  return (
    <div className="special-page">
      <section className="special-hero">
        <img src={hero} alt="Special Occasions" className="special-hero-bg" />
        <div className="special-hero-overlay" />

        <header className="special-top-bar">
          <img src={logo} alt="Logo" className="special-logo" />

          <button
            className="special-menu-btn"
            aria-label="Back to menu"
            onClick={onBackToMenu}
            type="button"
          >
            &#9776;
          </button>
        </header>

        <div className="special-hero-content">
          <h1>Special Occasions</h1>
        </div>

        <div className="special-booking-bar">
          <div className="special-booking-item">📅 CHECK IN</div>
          <div className="special-booking-item">📅 CHECK OUT</div>
          <div className="special-booking-item">👥 GUESTS</div>
          <button
            className="special-book-now-btn"
            type="button"
            onClick={onBookingClick}
          >
            BOOK NOW
          </button>
        </div>
      </section>

      <section className="special-content">
        <section className="special-intro-row">
          <div className="special-intro-image-wrap">
            <img src={girl} alt="Special event" className="special-intro-image" />
          </div>

          <div className="special-intro-text">
            <p>
              Enjoy our unparalleled facilities and service standard for your
              special events. Our venues are an ideal option for anything from
              cocktails to birthday parties. We will coordinate closely with you
              on every detail to ensure that everything goes smoothly, so that
              you can focus on your event.
            </p>
          </div>
        </section>

        <section className="special-cards-grid">
          <OccasionCard image={shoe} title="Weddings" />
          <OccasionCard image={glass} title="Outdoor catering" />
        </section>

        <section className="banquet-section">
          <div className="banquet-left">
            <h2>Banqueting packages</h2>
            <button type="button" className="banquet-enquiry-btn" onClick={onEnquiryClick}>
              Enquiry Form
            </button>

            <div className="banquet-tags">
              <div className="banquet-tag">
                <span className="banquet-tag-name">EBONY &amp; IVORY</span>
                <span className="banquet-tag-seats">upto 120 persons</span>
              </div>

              <div className="banquet-tag">
                <span className="banquet-tag-name">PARADISE</span>
                <span className="banquet-tag-seats">upto 250 persons</span>
              </div>
            </div>
          </div>

          <div className="banquet-right">
            <img src={boket} alt="Banqueting packages" />
          </div>
        </section>
      </section>

      <footer className="special-footer">
        <div className="special-footer-col special-footer-brand">
          <img src={logo} alt="Logo" className="special-footer-logo" />
          <ul>
            <li>Cookie Policy</li>
            <li>Privacy Policy</li>
            <li>Sitemap</li>
            <li>Powered by SLK</li>
            <li>Copyright © 2023 Renuka City Hotel</li>
          </ul>
        </div>

        <div className="special-footer-col">
          <ul>
            <li>home</li>
            <li>rooms</li>
            <li>• super deluxe room</li>
            <li>• deluxe room</li>
            <li>• standard room</li>
            <li>dine & drink</li>
            <li>• Palmyrah restaurant & bar</li>
            <li>gallery</li>
          </ul>
        </div>

        <div className="special-footer-col">
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

        <div className="special-footer-col">
          <ul>
            <li>328 Galle Road Colombo 3 Sri Lanka</li>
            <li>+94-112573598/602</li>
            <li>+94-112573145/8</li>
            <li>+94-112574137</li>
            <li>+94-112576183</li>
            <li>renukah@renukahotel.com</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default SpecialOccasions;