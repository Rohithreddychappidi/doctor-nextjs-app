export default function TestimonialCard({ testimonial }) {
  const { quote, name, role } = testimonial;
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="testimonial-card">
      <p className="testimonial-quote">&ldquo;{quote}&rdquo;</p>
      <div className="testimonial-person">
        <span className="testimonial-avatar">{initials}</span>
        <div>
          <div className="testimonial-name">{name}</div>
          <div className="testimonial-role">{role}</div>
        </div>
      </div>
    </div>
  );
}
