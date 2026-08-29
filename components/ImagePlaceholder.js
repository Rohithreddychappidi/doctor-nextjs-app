export default function ImagePlaceholder({ label = "Photo coming soon", height = 180, radius = "10px", imageUrl = "" }) {
  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={imageUrl}
        alt={label}
        style={{ width: "100%", height, objectFit: "cover", borderRadius: radius, display: "block" }}
      />
    );
  }
  return (
    <div className="img-placeholder" style={{ height, borderRadius: radius }}>
      <span>&#128247;</span>
      <span>{label}</span>
    </div>
  );
}
