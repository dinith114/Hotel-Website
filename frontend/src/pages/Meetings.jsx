import "./Meetings.css";

import logo from "../assets/logo.png";
import hero from "../assets/meeting.png";
import chair from "../assets/chair.png";
import glass from "../assets/glass.png";
import step from "../assets/step.png";

function CapacityTag({ name, seats }) {
  return (
    <div className="capacity-tag">
      <span className="tag-name">{name}</span>
      <span className="tag-seats">upto {seats} persons</span>
    </div>
  );
}

function VenueCard({ image, tags, featuresLeft, featuresRight }) {
  return (
    <div className="venue-card">
      <img src={image} alt="Venue" className="venue-card-image" />

      <div className="venue-tags">
        {tags.map((tag, index) => (
          <CapacityTag key={index} name={tag.name} seats={tag.seats} />
        ))}
      </div>

      <div className="venue-features">
        <p className="venue-features-title">World class facilities</p>

        <div className="venue-features-grid">
          <div>
            {featuresLeft.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>

          <div>
            {featuresRight.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Meetings({ onBackToMenu, onBookingClick }) {
  return (
    <div className="meetings-page">
      <section className="meetings-hero">
        <img src={hero} alt="Meetings" className="meetings-hero-bg" />
        <div className="meetings-hero-overlay" />

        <header className="meetings-top-bar">
          <img src={logo} alt="Logo" className="meetings-logo" />

          <button
            className="meetings-menu-btn"
            aria-label="Back to menu"
            onClick={onBackToMenu}
            type="button"
          >
            &#9776;
          </button>
        </header>

        <div className="meetings-hero-content">
          <h1>Meetings</h1>
        </div>

        <div className="meetings-booking-bar">
          <div className="meetings-booking-item">📅 CHECK IN</div>
          <div className="meetings-booking-item">📅 CHECK OUT</div>
          <div className="meetings-booking-item">👥 GUESTS</div>
          <button
            className="meetings-book-now-btn"
            type="button"
            onClick={onBookingClick}
          >
            BOOK NOW
          </button>
        </div>
      </section>

      <section className="meetings-content">
        <section className="meetings-intro-row">
          <div className="meetings-intro-image-wrap">
            <img src={chair} alt="Meeting area" className="meetings-intro-image" />
          </div>

          <div className="meetings-intro-text">
            <p>
              Enjoy state-of-the-art facilities and services for your business
              event in our exceptional meeting spaces. We host everything from
              corporate events and seminars to cocktails and banquets. Our venues
              are customizable in a range of configurations and spaces from small
              intimate settings to larger event spaces.
            </p>
          </div>
        </section>

        <section className="conference-section">
          <div className="conference-left">
            <h2>Conference Packages</h2>
            <ul>
              <li>Full Day Conference</li>
              <li>Half Day Conference</li>
              <li>3 Hour Snack Meeting</li>
            </ul>
          </div>

          <div className="conference-right">
            <img src={glass} alt="Conference packages" />
          </div>
        </section>

        <section className="venues-grid">
          <VenueCard
            image={step}
            tags={[
              { name: "Jasmine", seats: 100 },
              { name: "Lotus", seats: 45 },
              { name: "Orchid", seats: 45 },
            ]}
            featuresLeft={[
              "podium with mic",
              "multimedia projector",
              "Flip chart",
            ]}
            featuresRight={[
              "Notepaper & pencils",
              "TV/VCR",
              "PA system",
            ]}
          />

          <VenueCard
            image={hero}
            tags={[
              { name: "Anthurium", seats: 70 },
              { name: "Ebony", seats: 60 },
              { name: "Ivory", seats: 60 },
            ]}
            featuresLeft={[
              "theatre style",
              "U - shape",
              "class room",
            ]}
            featuresRight={[
              "cafe style",
              "board room",
              "cocktail",
            ]}
          />
        </section>
      </section>

      <footer className="meetings-footer">
        <div className="meetings-footer-col meetings-footer-brand">
          <img src={logo} alt="Logo" className="meetings-footer-logo" />
          <ul>
            <li>Cookie Policy</li>
            <li>Privacy Policy</li>
            <li>Sitemap</li>
            <li>Powered by SLK</li>
            <li>Copyright © 2023 Renuka City Hotel</li>
          </ul>
        </div>

        <div className="meetings-footer-col">
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

        <div className="meetings-footer-col">
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

        <div className="meetings-footer-col">
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

export default Meetings;