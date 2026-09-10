import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Hero from '../sections/Hero.jsx'
import Portals from '../sections/Portals.jsx'
import HowItWorks from '../sections/HowItWorks.jsx'
import Help from '../sections/Help.jsx'
import Contact from '../sections/Contact.jsx'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Portals />
        <HowItWorks />
        <Help />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
