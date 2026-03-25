import logo from "../assets/logo.png";

function Footer() {
  return (
    <footer className="common-footer">
      <div className="common-footer-col common-footer-brand">
        <img src={logo} alt="Logo" className="common-footer-logo" />
        <ul>
          <li>Cookie Policy</li>
          <li>Privacy Policy</li>
          <li>Sitemap</li>
          <li>Powered by SLK</li>
          <li>Copyright © 2023 Renuka City Hotel</li>
        </ul>
      </div>

      <div className="common-footer-col">
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

      <div className="common-footer-col">
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

      <div className="common-footer-col">
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
  );
}

export default Footer;