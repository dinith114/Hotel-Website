import "./SpecialOccasions.css";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

import logo from "../assets/logo.png";
import hero from "../assets/flo.png";
import girl from "../assets/girl.png";
import shoe from "../assets/shoe.png";
import glass from "../assets/glass.png";
import boket from "../assets/boket.png";

function OccasionCard({ image, title }) {
  return (
    <div className="occasion-card">
      <div className="occasion-card-image-wrap">
        <img src={image} alt={title} className="occasion-card-image" />
      </div>

      <div className="occasion-card-body">
        <h3>{title}</h3>
        <button type="button" className="occasion-card-btn">
          View
        </button>
      </div>
    </div>
  );
}

function SpecialOccasions() {
  const navigate = useNavigate();

  const handleEnquiryClick = () => {
    navigate("/enquiry");
  };

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
            onClick={() => navigate("/menu")}
            type="button"
          >
            &#9776;
          </button>
        </header>

        <div className="special-hero-content">
          <p className="special-hero-tag">Celebrate unforgettable moments</p>
          <h1>Special Occasions</h1>
        </div>
      </section>

      <section className="special-content">
        <section className="special-intro-row">
          <div className="special-intro-image-wrap">
            <img
              src={girl}
              alt="Special event"
              className="special-intro-image"
            />
          </div>

          <div className="special-intro-text">
            <p className="special-section-tag">Elegant events</p>
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
            <p className="banquet-mini-title">Luxury event planning</p>
            <h2>Banqueting packages</h2>

            <button
              type="button"
              className="banquet-enquiry-btn"
              onClick={handleEnquiryClick}
            >
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

      <Footer />
    </div>
  );
}

export default SpecialOccasions;