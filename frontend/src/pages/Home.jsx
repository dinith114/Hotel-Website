import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import SectionCard from "../components/SectionCard";
import Footer from "../components/Footer";

import hero from "../assets/home.png";
import logo from "../assets/logo.png";
import building from "../assets/Building.png";
import rooms from "../assets/rooms.png";
import pool from "../assets/pool.png";
import food from "../assets/food.png";
import flower from "../assets/flower.png";
import meeting from "../assets/meeting.png";

function Home() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [roomCount, setRoomCount] = useState(1);
  const [guestPopupOpen, setGuestPopupOpen] = useState(false);
  const [guestSelectionStarted, setGuestSelectionStarted] = useState(false);

  const guestPopupRef = useRef(null);
  const navigate = useNavigate();

  const today = new Date().toISOString().split("T")[0];

  const getTomorrow = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        guestPopupRef.current &&
        !guestPopupRef.current.contains(event.target)
      ) {
        setGuestPopupOpen(false);
      }
    };

    if (guestPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [guestPopupOpen]);

  const guestSummary = guestSelectionStarted
    ? `${adults} adult${adults > 1 ? "s" : ""} · ${children} children · ${roomCount} room${roomCount > 1 ? "s" : ""}`
    : "Guests";

  const updateGuestField = (field, delta) => {
    setGuestSelectionStarted(true);

    if (field === "adults") {
      setAdults((prev) => Math.max(1, prev + delta));
    }
    if (field === "children") {
      setChildren((prev) => Math.max(0, prev + delta));
    }
    if (field === "roomCount") {
      setRoomCount((prev) => Math.max(1, prev + delta));
    }
  };

  const handleSearch = () => {
    if (!checkIn || !checkOut) {
      alert("Please select both check-in and check-out dates.");
      return;
    }

    if (checkOut <= checkIn) {
      alert("Check-out date must be after check-in date.");
      return;
    }

    navigate("/rooms", {
      state: { checkIn, checkOut, adults, children, roomCount },
    });
  };

  return (
    <div className="home-page">
      <section className="hero-section">
        <img src={hero} alt="Renuka City Hotel" className="hero-bg" />
        <div className="hero-overlay" />

        <header className="top-bar">
          <img src={logo} alt="Logo" className="logo" />
          <button
            className="menu-btn"
            aria-label="menu"
            onClick={() => navigate("/menu")}
          >
            &#9776;
          </button>
        </header>

        <div className="hero-content">
          <p className="hero-subtitle">In the heart of Colombo city</p>
          <h1>RENUKA CITY HOTEL</h1>
        </div>

        <div className="booking-bar">
          <div
            className="booking-item"
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "0 20px",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "#666",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              CHECK IN
            </span>
            <input
              type="date"
              min={today}
              value={checkIn}
              onChange={(e) => {
                const newCheckIn = e.target.value;
                setCheckIn(newCheckIn);

                if (checkOut && checkOut <= newCheckIn) {
                  setCheckOut("");
                }
              }}
              style={{
                padding: "0",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#111",
                fontSize: "1rem",
                width: "100%",
                cursor: "pointer",
                marginTop: "4px",
              }}
            />
          </div>

          <div
            className="booking-item"
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "0 20px",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "#666",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              CHECK OUT
            </span>
            <input
              type="date"
              min={checkIn ? getTomorrow(checkIn) : today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              style={{
                padding: "0",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#111",
                fontSize: "1rem",
                width: "100%",
                cursor: "pointer",
                marginTop: "4px",
              }}
            />
          </div>

          <div
            ref={guestPopupRef}
            className="booking-item home-guest-booking-item"
            style={{
              flexDirection: "column",
              alignItems: "flex-start",
              padding: "0 20px",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <span
              style={{
                fontSize: "10px",
                color: "#666",
                fontWeight: "bold",
                letterSpacing: "1px",
              }}
            >
              GUESTS
            </span>

            <button
              type="button"
              className="home-guest-trigger"
              onClick={() => setGuestPopupOpen((prev) => !prev)}
            >
              {guestSummary}
            </button>

            {guestPopupOpen && (
              <div className="home-guest-popup">
                <div className="home-guest-row">
                  <span>Adults</span>
                  <div className="home-guest-counter">
                    <button
                      type="button"
                      onClick={() => updateGuestField("adults", -1)}
                    >
                      -
                    </button>
                    <span>{adults}</span>
                    <button
                      type="button"
                      onClick={() => updateGuestField("adults", 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="home-guest-row">
                  <span>Children</span>
                  <div className="home-guest-counter">
                    <button
                      type="button"
                      onClick={() => updateGuestField("children", -1)}
                    >
                      -
                    </button>
                    <span>{children}</span>
                    <button
                      type="button"
                      onClick={() => updateGuestField("children", 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="home-guest-row">
                  <span>Rooms</span>
                  <div className="home-guest-counter">
                    <button
                      type="button"
                      onClick={() => updateGuestField("roomCount", -1)}
                    >
                      -
                    </button>
                    <span>{roomCount}</span>
                    <button
                      type="button"
                      onClick={() => updateGuestField("roomCount", 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  className="home-guest-done-btn"
                  onClick={() => setGuestPopupOpen(false)}
                >
                  Done
                </button>
              </div>
            )}
          </div>

          <button className="book-now-btn" onClick={handleSearch}>
            BOOK NOW
          </button>
        </div>
      </section>

      <section className="intro-section">
        <div className="intro-card">
          <img src={building} alt="Hotel Building" className="intro-image" />
          <p>
            Centrally located, Renuka City Hotel is perfect for business
            travellers seeking world-class service and modern amenities.
            Experience the ultimate in hospitality with our stylish
            accommodation and authentic Sri Lankan cuisine at our fine dining
            restaurant.
          </p>
        </div>
      </section>

      <SectionCard
        image={rooms}
        title="Rooms with modern amenities & facilities"
        onButtonClick={() => navigate("/rooms")}
      />

      <SectionCard
        image={pool}
        title="Infinity pool (open till 10pm)"
        smallText
        showButton={false}
      />

      <SectionCard
        image={food}
        title="Authentic SriLankan cuisine"
        onButtonClick={() => navigate("/dine")}
      />

      <SectionCard
        image={flower}
        title="An ideal venue for any special occasions banquets, weddings oe cocktail party"
        light
        reverse
        onButtonClick={() => navigate("/special")}
      />

      <SectionCard
        image={meeting}
        title="Workshops seminars meetings & conferences"
        onButtonClick={() => navigate("/meetings")}
      />

      <section className="home-map-section">
        <div className="home-map-content">
          <div className="home-map-text">
            <p className="home-map-subtitle">Find Us</p>
            <h2>Visit Renuka City Hotel</h2>
            <p>
              Conveniently located on Galle Road, Colombo 3, Renuka City Hotel
              offers easy access to business, shopping, dining, and leisure
              destinations in the city.
            </p>
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
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;