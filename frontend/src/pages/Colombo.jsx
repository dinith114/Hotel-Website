import "./Colombo.css";

import logo from "../assets/logo.png";
import hero from "../assets/colo.png";
import sea from "../assets/sea.png";
import hos from "../assets/hos.png";
import paddy from "../assets/paddy.png";
import ttt from "../assets/ttt.png";

function ColomboCard({ image, title }) {
  return (
    <div className="colombo-card">
      <img src={image} alt={title} className="colombo-card-image" />
      <div className="colombo-card-body">
        <h3>{title}</h3>
      </div>
    </div>
  );
}

function Colombo({ onBackToMenu, onBookingClick }) {
  return (
    <div className="colombo-page">
      <section className="colombo-hero">
        <img src={hero} alt="Colombo" className="colombo-hero-bg" />
        <div className="colombo-hero-overlay" />

        <header className="colombo-top-bar">
          <img src={logo} alt="Logo" className="colombo-logo" />

          <button
            className="colombo-menu-btn"
            aria-label="Back to menu"
            onClick={onBackToMenu}
            type="button"
          >
            &#9776;
          </button>
        </header>

        <div className="colombo-hero-content">
          <h1>Colombo</h1>
        </div>

        <div className="colombo-booking-bar">
          <div className="colombo-booking-item">📅 CHECK IN</div>
          <div className="colombo-booking-item">📅 CHECK OUT</div>
          <div className="colombo-booking-item">👥 GUESTS</div>
          <button
            className="colombo-book-now-btn"
            type="button"
            onClick={onBookingClick}
          >
            BOOK NOW
          </button>
        </div>
      </section>

      <section className="colombo-content">
        <section className="colombo-intro-row">
          <div className="colombo-intro-image-wrap">
            <img src={sea} alt="Colombo city" className="colombo-intro-image" />
          </div>

          <div className="colombo-intro-text">
            <p>
              We are literally within walking distance of many key attractions in
              the heart of Colombo city. We are located just 30km from the
              Bandaranaike International Airport. You can access both public
              transport and a range of taxi services right from our doorstep.
              You can also get on the Colombo City Bus tour directly from the
              hotel.
            </p>

            <p>
              Banks, embassies, shopping malls, night clubs, casinos and a range
              of restaurants and cafes are all located within minutes from us.
            </p>

            <button type="button" className="near-stay-btn">
              Near youe Stay
            </button>
          </div>
        </section>

        <section className="colombo-slider-section">
          <button type="button" className="slider-arrow left-arrow">
            &#8249;
          </button>

          <div className="colombo-cards-grid">
            <ColomboCard image={hos} title="Hospitals" />
            <ColomboCard image={paddy} title="Royal Colombo Golf Club" />
            <ColomboCard image={ttt} title="shopping centres" />
          </div>

          <button type="button" className="slider-arrow right-arrow">
            &#8250;
          </button>
        </section>

        <section className="colombo-map-section">
          <div className="colombo-map-header">
            <h2>Find Us</h2>
            <p>Renuka City Hotel location in Colombo</p>
          </div>

          <div className="colombo-map-wrapper">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10884.05906765484!2d79.8561858624767!3d6.908082007437513!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2595d36c8e22b%3A0xb571996103908d71!2sRenuka%20City%20Hotel!5e0!3m2!1sen!2slk!4v1774428233555!5m2!1sen!2slk"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Renuka City Hotel Map"
            ></iframe>
          </div>
        </section>
      </section>

      <footer className="colombo-footer">
        <div className="colombo-footer-col colombo-footer-brand">
          <img src={logo} alt="Logo" className="colombo-footer-logo" />
          <ul>
            <li>Cookie Policy</li>
            <li>Privacy Policy</li>
            <li>Sitemap</li>
            <li>Powered by SLK</li>
            <li>Copyright © 2023 Renuka City Hotel</li>
          </ul>
        </div>

        <div className="colombo-footer-col">
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

        <div className="colombo-footer-col">
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

        <div className="colombo-footer-col">
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

export default Colombo;