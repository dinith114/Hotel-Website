import "./Menu.css";

import rooms from "../assets/rooms.png";
import meeting from "../assets/meeting.png";
import dine from "../assets/dine.png";
import special from "../assets/special.png";
import gallery from "../assets/gallery.png";
import facility from "../assets/facility.png";

function MenuCard({ image, title, lines = [] }) {
  return (
    <div className="menu-card">
      <img src={image} alt={title} className="menu-card-image" />
      <div className="menu-card-overlay"></div>

      <div className="menu-card-content">
        <h2>{title}</h2>

        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}

        <button type="button">View</button>
      </div>
    </div>
  );
}

function Menu({ onClose }) {
  return (
    <div className="menu-page">
      <nav className="menu-topbar">
        <div className="menu-links">
          <a href="#">Colombo</a>
          <a href="#">Offers</a>
          <a href="#">Our story</a>
          <a href="#">Careers</a>
          <a href="#">Blog</a>
          <a href="#">Contact us</a>
        </div>

        <button
          className="menu-icon-btn"
          aria-label="Close menu"
          onClick={onClose}
          type="button"
        >
          &#9776;
        </button>
      </nav>

      <section className="menu-grid-section">
        <div className="menu-grid">
          <MenuCard
            image={rooms}
            title="Rooms"
            lines={["super deluxe", "deluxe", "standard"]}
          />

          <MenuCard image={meeting} title="Meetings" />

          <MenuCard
            image={dine}
            title="Dine & Drink"
            lines={["Palmyrah", "restaurant", "& bar"]}
          />

          <MenuCard image={special} title="Special Occasion" />

          <MenuCard image={gallery} title="Gallery" />

          <MenuCard image={facility} title="Facilities" />
        </div>
      </section>
    </div>
  );
}

export default Menu;