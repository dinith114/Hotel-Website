function SectionCard({
  image,
  title,
  buttonText = "View",
  light = false,
  reverse = false,
  smallText = false,
  onButtonClick,
  showButton = true,
}) {
  return (
    <section className={`section-card ${light ? "light" : "dark"} ${reverse ? "reverse" : ""}`}>
      <div className="section-image-wrapper">
        <img src={image} alt={title} className="section-image" />
        {!light && <div className="section-overlay" />}
      </div>

      <div className={`section-content ${smallText ? "small-text" : ""}`}>
        <h2>{title}</h2>
        {showButton && (
          <button type="button" className="section-btn" onClick={onButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
    </section>
  );
}

export default SectionCard;