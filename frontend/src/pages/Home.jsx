import { useState } from "react";
import "./Home.css";
import SectionCard from "../components/SectionCard";

import hero from "../assets/home.png";
import logo from "../assets/logo.png";
import building from "../assets/Building.png";
import rooms from "../assets/rooms.png";
import pool from "../assets/pool.png";
import food from "../assets/food.png";
import flower from "../assets/flower.png";
import meeting from "../assets/meeting.png";

function Home({ onOpenMenu, onBookNowClick }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const handleSearch = () => {
    if (onBookNowClick) {
      onBookNowClick({ checkIn, checkOut, guests });
    }
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <img src={hero} alt="Renuka City Hotel" className="hero-bg" />
        <div className="hero-overlay" />

        <header className="top-bar">
          <img src={logo} alt="Logo" className="logo" />
          <button className="menu-btn" aria-label="menu" onClick={onOpenMenu}>
            &#9776;
          </button>
        </header>

        <div className="hero-content">
          <p className="hero-subtitle">In the heart of Colombo city</p>
          <h1>RENUKA CITY HOTEL</h1>
        </div>

        <div className="booking-bar">
          <div className="booking-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '0 20px', justifyContent: 'center' }}>
            <span style={{ fontSize: '10px', color: '#666', fontWeight: 'bold', letterSpacing: '1px' }}>CHECK IN</span>
            <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} style={{ padding: '0', border: 'none', outline: 'none', background: 'transparent', color: '#111', fontSize: '1rem', width: '100%', cursor: 'pointer', marginTop: '4px' }} />
          </div>
          <div className="booking-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '0 20px', justifyContent: 'center' }}>
            <span style={{ fontSize: '10px', color: '#666', fontWeight: 'bold', letterSpacing: '1px' }}>CHECK OUT</span>
            <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} style={{ padding: '0', border: 'none', outline: 'none', background: 'transparent', color: '#111', fontSize: '1rem', width: '100%', cursor: 'pointer', marginTop: '4px' }} />
          </div>
          <div className="booking-item" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '0 20px', justifyContent: 'center' }}>
            <span style={{ fontSize: '10px', color: '#666', fontWeight: 'bold', letterSpacing: '1px' }}>GUESTS</span>
            <input type="number" min="1" value={guests} onChange={(e) => setGuests(e.target.value)} style={{ padding: '0', border: 'none', outline: 'none', background: 'transparent', color: '#111', fontSize: '1rem', width: '100%', cursor: 'pointer', marginTop: '4px' }} />
          </div>
          <button className="book-now-btn" onClick={handleSearch}>BOOK NOW</button>
        </div>
      </section>

      <section className="intro-section">
        <div className="intro-card">
          <img src={building} alt="Hotel Building" className="intro-image" />
          <p>
            Centrally located, Renuka City Hotel is perfect for business travellers seeking
            world-class service and modern amenities. Experience the ultimate in hospitality
            with our stylish accommodation and authentic Sri Lankan cuisine at our fine dining
            restaurant.
          </p>
        </div>
      </section>

      <SectionCard
        image={rooms}
        title="Rooms with modern amenities & facilities"
      />

      <SectionCard
        image={pool}
        title="Infinity pool (open till 10pm)"
        smallText
      />

      <SectionCard
        image={food}
        title="Authentic SriLankan cuisine"
      />

      <SectionCard
        image={flower}
        title="An ideal venue for any special occasions banquets, weddings oe cocktail party"
        light
        reverse
      />

      <SectionCard
        image={meeting}
        title="Workshops seminars meetings & conferences"
      />

      <section className="spacer-section" />

      <footer className="footer">
        <div className="footer-col footer-brand">
          <img src={logo} alt="Logo" className="footer-logo" />
          <ul>
            <li>Cookie Policy</li>
            <li>Privacy Policy</li>
            <li>Sitemap</li>
            <li>Powered by SLK</li>
            <li>Copyright © 2023 Renuka City Hotel</li>
          </ul>
        </div>

        <div className="footer-col">
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

        <div className="footer-col">
          <ul>
            <li>328 Galle Road Colombo 3 Sri Lanka</li>
            <li>+94-112573598/602</li>
            <li>+94-112573145/8</li>
            <li>+94-112573137</li>
            <li>+94-112576183</li>
            <li>ranukah@renukahotel.com</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}

export default Home;