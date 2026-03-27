import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { api } from "../api/api";
import "./Rooms.css";
import Footer from "../components/Footer";

import logo from "../assets/logo.png";
import heroRoom from "../assets/rooms.png";
import superDeluxe from "../assets/SuperDeluxeroom.png";
import deluxeRoom from "../assets/deluxeroom.png";
import standardRoom from "../assets/StandardRoom.png";

function RoomInfoCard({
  image,
  title,
  description,
  onBookingClick,
  availableRooms,
}) {
  return (
    <section className="room-info-card">
      <div className="room-info-image-wrap">
        <img src={image} alt={title} className="room-info-image" />
      </div>

      <div className="room-info-text">
        <h2>{title}</h2>
        <p>{description}</p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <button
            type="button"
            onClick={() => onBookingClick(title)}
            disabled={availableRooms === 0}
            style={{ opacity: availableRooms === 0 ? 0.5 : 1 }}
          >
            {availableRooms === 0 ? "SOLD OUT" : "BOOK NOW"}
          </button>

          {availableRooms !== undefined && (
            <span
              style={{
                fontWeight: "bold",
                color: availableRooms > 0 ? "#28a745" : "#dc3545",
                fontSize: "14px",
                padding: "6px 12px",
                backgroundColor: availableRooms > 0 ? "#e8f5e9" : "#f8d7da",
                borderRadius: "4px",
              }}
            >
              {availableRooms > 0
                ? `${availableRooms} Room(s) Available`
                : "No Rooms Available"}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

function AmenityItem({ text }) {
  return (
    <div className="amenity-item">
      <div className="amenity-icon">•</div>
      <span>{text}</span>
    </div>
  );
}

function Rooms() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchDefaults = location.state || {};

  const [checkIn, setCheckIn] = useState(searchDefaults.checkIn || "");
  const [checkOut, setCheckOut] = useState(searchDefaults.checkOut || "");
  const [adults, setAdults] = useState(
    searchDefaults.adults || Number(searchDefaults.guests) || 1
  );
  const [children, setChildren] = useState(searchDefaults.children || 0);
  const [roomCount, setRoomCount] = useState(searchDefaults.roomCount || 1);
  const [guestPopupOpen, setGuestPopupOpen] = useState(false);
  const [guestSelectionStarted, setGuestSelectionStarted] = useState(false);
  const [availability, setAvailability] = useState([]);

  const guestPopupRef = useRef(null);

  const today = new Date().toISOString().split("T")[0];

  const getTomorrow = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (searchDefaults) {
      if (searchDefaults.checkIn) setCheckIn(searchDefaults.checkIn);
      if (searchDefaults.checkOut) setCheckOut(searchDefaults.checkOut);
      if (searchDefaults.adults) setAdults(searchDefaults.adults);
      if (searchDefaults.children !== undefined)
        setChildren(searchDefaults.children);
      if (searchDefaults.roomCount) setRoomCount(searchDefaults.roomCount);
      if (searchDefaults.guests && !searchDefaults.adults) {
        setAdults(Number(searchDefaults.guests));
      }
    }
  }, [searchDefaults]);

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

  useEffect(() => {
    const fetchAvailability = async () => {
      if (checkIn && checkOut) {
        try {
          const response = await api.checkRoomAvailability({
            checkInDate: checkIn,
            checkOutDate: checkOut,
          });
          setAvailability(response.data.data || []);
        } catch (error) {
          console.error("Failed to fetch availability:", error);
        }
      } else {
        setAvailability([]);
      }
    };
    fetchAvailability();
  }, [checkIn, checkOut]);

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

  const handleRoomBookClick = (roomTypeTitle) => {
    const cleanRoomType = roomTypeTitle.replace(" Room", "");
    navigate("/booking", {
      state: {
        roomType: cleanRoomType,
        checkIn,
        checkOut,
        adults,
        children,
        roomCount,
      },
    });
  };

  const getAvailableCount = (roomType) => {
    if (!checkIn || !checkOut) return undefined;
    const roomInfo = availability.find((r) => r.roomType === roomType);
    return roomInfo ? roomInfo.availableRooms : undefined;
  };

  const roomDescription =
    "Combining elegant decor with modern amenities, all our rooms feature free Wi-Fi, satellite TV and 24-hour room service. Relax in our contemporary ambience and enjoy spectacular Indian Ocean sunsets from our ocean view rooms. Interconnecting family rooms and disabled accessible rooms are available. Choose from our Super Deluxe, Deluxe and Standard room selections for your stay. A ground floor smoking lounge is available for your convenience.";

  return (
    <div className="rooms-page">
      <section className="rooms-hero">
        <img src={heroRoom} alt="Our Rooms" className="rooms-hero-bg" />
        <div className="rooms-hero-overlay"></div>

        <header className="rooms-top-bar">
          <img src={logo} alt="Logo" className="rooms-logo" />
          <button
            className="rooms-menu-btn"
            aria-label="Back to menu"
            onClick={() => navigate("/menu")}
            type="button"
          >
            &#9776;
          </button>
        </header>

        <div className="rooms-hero-content">
          <h1>Our Rooms</h1>
        </div>

        <div className="rooms-booking-bar">
          <div
            className="rooms-booking-item"
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
            className="rooms-booking-item"
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
            className="rooms-booking-item guest-booking-item"
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
              className="rooms-guest-trigger"
              onClick={() => setGuestPopupOpen((prev) => !prev)}
            >
              {guestSummary}
            </button>

            {guestPopupOpen && (
              <div className="rooms-guest-popup">
                <div className="guest-row">
                  <span>Adults</span>
                  <div className="guest-counter">
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

                <div className="guest-row">
                  <span>Children</span>
                  <div className="guest-counter">
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

                <div className="guest-row">
                  <span>Rooms</span>
                  <div className="guest-counter">
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
                  className="guest-done-btn"
                  onClick={() => setGuestPopupOpen(false)}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rooms-content">
        <RoomInfoCard
          image={superDeluxe}
          title="Super Deluxe Room"
          description={roomDescription}
          onBookingClick={handleRoomBookClick}
          availableRooms={getAvailableCount("Super Deluxe")}
        />

        <RoomInfoCard
          image={deluxeRoom}
          title="Deluxe Room"
          description={roomDescription}
          onBookingClick={handleRoomBookClick}
          availableRooms={getAvailableCount("Deluxe")}
        />

        <RoomInfoCard
          image={standardRoom}
          title="Standard Room"
          description={roomDescription}
          onBookingClick={handleRoomBookClick}
          availableRooms={getAvailableCount("Standard")}
        />

        <section className="amenities-section">
          <h2>Amenities</h2>

          <div className="amenities-grid">
            <AmenityItem text="Satellite Television" />
            <AmenityItem text="In-room tea / coffee" />
            <AmenityItem text="In-room safe" />
            <AmenityItem text="IDD telephone" />
            <AmenityItem text="Mini fridge" />
            <AmenityItem text="Free Wi-Fi" />
            <AmenityItem text="Bath amenities" />
            <AmenityItem text="Hot & cold shower" />
            <AmenityItem text="Air conditioned" />
            <AmenityItem text="24-hour room service" />
            <AmenityItem text="In-room hair dryer" />
            <AmenityItem text="Free mineral water" />
            <AmenityItem text="Free newspaper" />
            <AmenityItem text="Iron & ironing board" />
            <AmenityItem text="Media hubs" />
          </div>
        </section>
      </section>

      <Footer />
    </div>
  );
}

export default Rooms;