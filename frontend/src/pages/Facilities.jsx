import "./Facilities.css";
import "../components/CommonLayout.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import hero from "../assets/renuka2.png";

function FacilityItem({ icon, text }) {
  return (
    <div className="facility-item">
      <div className="facility-icon">{icon}</div>
      <span>{text}</span>
    </div>
  );
}

function Facilities({ onBackToMenu, onBookingClick }) {
  const hotelFacilities = [
    { icon: "🛏", text: "99 rooms" },
    { icon: "📺", text: "Satellite Television" },
    { icon: "🏢", text: "Business centre" },
    { icon: "📶", text: "Free Wi-Fi" },
    { icon: "🚕", text: "Airport Transfers" },
    { icon: "🧳", text: "Luggage storage" },
    { icon: "🍷", text: "Eclipse bar" },
    { icon: "💳", text: "Credit cards accepted" },
    { icon: "❄", text: "Air conditioned" },
    { icon: "🛎", text: "24 hour room service" },
    { icon: "👕", text: "Laundry & dry cleaning" },
    { icon: "💱", text: "Foreign currency encashment" },
    { icon: "🏋", text: "State of the art gymnasium" },
    { icon: "🍽", text: "Palmyrah restaurant" },
    { icon: "🩺", text: "Doctor on call" },
    { icon: "⏱", text: "24-hour check-in" },
    { icon: "🌐", text: "foreign language channels" },
    { icon: "🏊", text: "kids pool available" },
    { icon: "🏖", text: "Infinity pool" },
    { icon: "📺", text: "Kids channels available" },
    { icon: "🛎", text: "concierge service" },
    { icon: "🛋", text: "Spacious lounge" },
    { icon: "🍳", text: "Breakfast buffet" },
    { icon: "🚗", text: "Car rental" },
    { icon: "🚬", text: "Smoking room" },
    { icon: "🧭", text: "Tour desk" },
    { icon: "♿", text: "Wheelchair accessible" },
    { icon: "🛗", text: "Elevator" },
    { icon: "🕘", text: "24 hour front desk" },
  ];

  const roomFacilities = [
    { icon: "📺", text: "Satellite Television" },
    { icon: "📶", text: "Free Wi-Fi" },
    { icon: "🔐", text: "in-room safe" },
    { icon: "📞", text: "IDD telephone" },
    { icon: "🧊", text: "Mini fridge" },
    { icon: "☕", text: "In-room tea / coffee" },
    { icon: "🧴", text: "Bath amenities" },
    { icon: "🚿", text: "Hot & cold shower" },
    { icon: "❄", text: "Air conditioned" },
    { icon: "🛎", text: "24 hour room service" },
    { icon: "💨", text: "In-room hair dryer" },
    { icon: "💧", text: "free mineral water" },
    { icon: "📰", text: "Free newspaper" },
    { icon: "🧺", text: "Iron & ironing board" },
    { icon: "🎞", text: "Media hubs" },
    { icon: "⏱", text: "24-hour check-in" },
  ];

  return (
    <div className="facilities-page">
      <section className="facilities-hero">
        <img src={hero} alt="Facility" className="facilities-hero-bg" />
        <div className="facilities-hero-overlay" />

        <Header onMenuClick={onBackToMenu} />

        <div className="facilities-hero-content">
          <h1>Facility</h1>
        </div>

        <div className="facilities-booking-bar">
          <div className="facilities-booking-item">📅 CHECK IN</div>
          <div className="facilities-booking-item">📅 CHECK OUT</div>
          <div className="facilities-booking-item">👥 GUESTS</div>
          <button
            className="facilities-book-now-btn"
            type="button"
            onClick={onBookingClick}
          >
            BOOK NOW
          </button>
        </div>
      </section>

      <section className="facilities-content">
        <section className="facilities-section">
          <h2>
            Hotel <span>facilities</span>
          </h2>

          <div className="facilities-grid">
            {hotelFacilities.map((item, index) => (
              <FacilityItem key={index} icon={item.icon} text={item.text} />
            ))}
          </div>
        </section>

        <section className="facilities-section room-section">
          <h2>
            Room <span>facilities</span>
          </h2>

          <div className="facilities-grid room-grid">
            {roomFacilities.map((item, index) => (
              <FacilityItem key={index} icon={item.icon} text={item.text} />
            ))}
          </div>
        </section>
      </section>

      <Footer />
    </div>
  );
}

export default Facilities;