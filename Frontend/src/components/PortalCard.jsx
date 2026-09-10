export default function PortalCard({ portal }) {
  return (
    <article className={`portal-card ${portal.className}`}>
      <img className="portal-image" src={portal.image} alt={portal.alt} />
      <div className="portal-content">
        <span className="portal-label">{portal.label}</span>
        <h3>{portal.title}</h3>
        <p>{portal.description}</p>
        <a href={portal.href} className="btn btn-card">Enter Portal →</a>
      </div>
    </article>
  )
}
