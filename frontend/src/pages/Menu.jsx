import "./Menu.css";

import rooms from "../assets/rooms.png";
import meeting from "../assets/meeting.png";
import dine from "../assets/dine.png";
import special from "../assets/special.png";
import gallery from "../assets/gallery.png";
import facility from "../assets/facility.png";

function MenuCard({ image, title, lines = [], onView }) {
  return (
    <div className="menu-card">
      <img src={image} alt={title} className="menu-card-image" />
      <div className="menu-card-overlay"></div>

      <div className="menu-card-content">
        <h2>{title}</h2>

        {lines.map((line, index) => (
          <p key={index}>{line}</p>
        ))}

        <button type="button" onClick={onView}>
          View
        </button>
      </div>
    </div>
  );
}

function Menu({
  onClose,
  onRoomsClick,
  onDineClick,
  onGalleryClick,
  onMeetingsClick,
  onSpecialClick,
  onFacilitiesClick,
  onCareersClick,
  onContactClick,
  onColomboClick,
}) {
  return (
    <div className="menu-page">
      <nav className="menu-topbar">
        <div className="menu-links">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onColomboClick();
            }}
          >
            Colombo
          </a>

          <a href="#">Offers</a>
          <a href="#">Our story</a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onCareersClick();
            }}
          >
            Careers
          </a>

          <a href="#">Blog</a>

          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onContactClick();
            }}
          >
            Contact us
          </a>
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
            onView={onRoomsClick}
          />

          <MenuCard
            image={meeting}
            title="Meetings"
            onView={onMeetingsClick}
          />

          <MenuCard
            image={dine}
            title="Dine & Drink"
            lines={["Palmyrah", "restaurant", "& bar"]}
            onView={onDineClick}
          />

          <MenuCard
            image={special}
            title="Special Occasion"
            onView={onSpecialClick}
          />

          <MenuCard
            image={gallery}
            title="Gallery"
            onView={onGalleryClick}
          />

          <MenuCard
            image={facility}
            title="Facilities"
            onView={onFacilitiesClick}
          />
        </div>
      </section>
    </div>
  );
}

export default Menu;