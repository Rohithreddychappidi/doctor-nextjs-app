import ImagePlaceholder from "./ImagePlaceholder";

export default function MeetingCard({ meeting }) {
  const { title, description, price, isFree, date, imageUrl } = meeting;
  return (
    <div className="meeting-card">
      <div className="meeting-media" style={{ position: "relative" }}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={title} />
        ) : (
          <span>Event Photo</span>
        )}
        <span className={`meeting-price-tag${isFree ? " free" : ""}`}>
          {isFree ? "Free" : `$${price}`}
        </span>
      </div>
      <div className="meeting-body">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="meeting-meta">
          <span>{date}</span>
        </div>
        <a href="/consultation" className="btn btn-outline btn-sm" style={{ marginTop: 8, alignSelf: "flex-start" }}>
          {isFree ? "Join this session" : "Reserve a spot"}
        </a>
      </div>
    </div>
  );
}
