import "./DineDrink.css";

import logo from "../assets/logo.png";
import hero from "../assets/dine.png";
import food from "../assets/food.png";
import whisk from "../assets/whisk.png";
import two from "../assets/two.png";
import table from "../assets/table.png";

function DineDrink({ onBackToMenu, onBookingClick }) {
  return (
    <div className="dine-page">
      <section className="dine-hero">
        <img src={hero} alt="Dine and Drink" className="dine-hero-bg" />
        <div className="dine-hero-overlay" />

        <header className="dine-top-bar">
          <img src={logo} alt="Logo" className="dine-logo" />

          <button
            className="dine-menu-btn"
            aria-label="Back to menu"
            onClick={onBackToMenu}
            type="button"
          >
            &#9776;
          </button>
        </header>

        <div className="dine-hero-content">
          <h1>Dine &amp; Drink</h1>
        </div>

    
      </section>

      <section className="dine-content">
        <section className="dine-info-row">
          <div className="dine-info-image-wrap">
            <img src={food} alt="24-hour room service" className="dine-info-image" />
          </div>

          <div className="dine-info-text">
            <h2>24-hour room service</h2>
            <p>
              Enjoy a tantalising selection of Jaffna specialities at the Palmyrah
              restaurant, renowned for elevating traditional Sri Lankan favourites
              into a fine dining experience for over 45 years. For your convenience
              24-hour in-room dining is available, offering a comprehensive range
              of Asian and continental options. Our breakfast buffet, open from
              6.30am, offers a delicious and quick start to your day.
            </p>
          </div>
        </section>

        <section className="dine-split-banner">
          <div className="split-card left">
            <img src={whisk} alt="Palmyrah bar" />
            <div className="split-overlay" />
            <div className="split-title left-title">Palmyrah bar</div>
          </div>

          <div className="split-card right">
            <img src={food} alt="International breakfast buffet" />
            <div className="split-overlay" />
            <div className="split-title right-title">
              International breakfast buffet
            </div>
          </div>
        </section>

        <section className="dine-paragraph-block">
          <p>
            Relax at our pool cafe and enjoy a magnificent sunset after a busy day,
            or change into something casual and head down to the Eclipse bar for
            a drink with friends. We would be happy to recommend a fine wine or
            spirit from our exclusive menu to complement your favourite dishes at
            the Palmyrah.
          </p>
        </section>

        <section className="dine-bottom-grid">
          <div className="bottom-image">
            <img src={two} alt="Pool cafe" />
          </div>

          <div className="bottom-center-text">
            <h2>
              Pool cafe
              <br />
              &amp;
              <br />
              Eclipse bar
            </h2>
          </div>

          <div className="bottom-image">
            <img src={table} alt="Eclipse bar" />
          </div>
        </section>
      </section>

      <footer className="dine-footer">
        <div className="dine-footer-col dine-footer-brand">
          <img src={logo} alt="Logo" className="dine-footer-logo" />
          <ul>
            <li>Cookie Policy</li>
            <li>Privacy Policy</li>
            <li>Sitemap</li>
            <li>Powered by SLK</li>
            <li>Copyright © 2023 Renuka City Hotel</li>
          </ul>
        </div>

        <div className="dine-footer-col">
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

        <div className="dine-footer-col">
          <ul>
            <li>meetings</li>
            <li>special occasions</li>
            <li>facilities</li>
            <li>Colombo</li>
            <li>offers</li>
            <li>our story</li>
            <li>careers</li>
            <li>blogs</li>
            <li>privacy policy</li>
            <li>contact us</li>
          </ul>
        </div>

        <div className="dine-footer-col">
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

export default DineDrink;