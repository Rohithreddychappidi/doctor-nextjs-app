export default function ScholarCard({ profile }) {
  return (
    <a
      href={profile.url}
      target="_blank"
      rel="noopener noreferrer"
      className="scholar-card"
    >
      <div className="scholar-card-icon">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor">
          <path d="M12 2L1 8l4 2.18v6L12 20l7-3.82v-6l2-1.09V17h2V8L12 2zm6.82 6L12 11.72 5.18 8 12 4.28 18.82 8zM17 15.99l-5 2.73-5-2.73v-3.72L12 14l5-2.73v3.72z" />
        </svg>
      </div>
      <div className="scholar-card-body">
        <span className="scholar-card-eyebrow">Verified Profile</span>
        <h3>Google Scholar</h3>
        <p>View the complete, continuously updated publication and citation record.</p>
        <div className="scholar-card-stats">
          <div><strong>{profile.citations}</strong><span>Citations</span></div>
          <div><strong>{profile.hIndex}</strong><span>h-index</span></div>
          <div><strong>{profile.i10Index}</strong><span>i10-index</span></div>
        </div>
      </div>
      <div className="scholar-card-arrow">&#8599;</div>
    </a>
  );
}
