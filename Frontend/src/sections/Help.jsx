import SectionHeading from '../components/SectionHeading.jsx'

const helpItems = [
  ['🎟️', "I don't know my token"],
  ['📅', 'When should I come?'],
  ['📍', 'Where is my centre?'],
  ['🌾', 'What is my crop status?'],
  ['💰', 'Where is my payment?'],
]

export default function Help() {
  return (
    <section className="help-section" id="help">
      <div className="container">
        <SectionHeading title="Help & Support / सहायता" subtitle="Quick answers to common queries" />
        <div className="help-grid">
          {helpItems.map(([icon, title]) => (
            <button className="help-card" key={title}>
              <div className="help-icon">{icon}</div>
              <h5>{title}</h5>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
