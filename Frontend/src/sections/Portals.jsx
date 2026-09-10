import PortalCard from '../components/PortalCard.jsx'
import SectionHeading from '../components/SectionHeading.jsx'
import { portalData } from '../data/portalData.js'

export default function Portals() {
  return (
    <section className="portal-section" id="portals">
      <div className="container">
        <SectionHeading
          title="Choose Your Portal"
          subtitle="Select your role to continue with AnnDisha"
        />
        <div className="portal-grid">
          {portalData.map((portal) => <PortalCard key={portal.title} portal={portal} />)}
        </div>
      </div>
    </section>
  )
}
