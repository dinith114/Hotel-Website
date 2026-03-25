import logo from "../assets/logo.png";

function Header({ onMenuClick, dark = false }) {
  return (
    <header className={`common-header ${dark ? "dark-header" : ""}`}>
      <img src={logo} alt="Logo" className="common-logo" />

      <button
        className="common-menu-btn"
        aria-label="menu"
        onClick={onMenuClick}
        type="button"
      >
        &#9776;
      </button>
    </header>
  );
}

export default Header;