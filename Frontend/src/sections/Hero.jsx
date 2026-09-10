import { useEffect, useState } from 'react'

const slides = [
  { image: '/images/hero-farmer.jpg', alt: 'Indian farmer in crop field' },
  { image: '/images/hero-admin.jpg', alt: 'Agriculture department administrator' },
  { image: '/images/hero-officer.jpg', alt: 'Procurement officer at grain centre' },
]

export default function Hero() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => setActive((current) => (current + 1) % slides.length), 4500)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="hero" id="home">
      <div className="container hero-flex">
        <div className="hero-text">
          <span className="hero-badge">🌾 Sugam Procurement Initiative</span>
          <h1>ANNDISHA</h1>
          <div className="tagline">इंतज़ार नहीं, अब समय अनुसार।</div>
          <p>
            No More Waiting, Come at the Right Time. Easily get your token,
            schedule your visit to the procurement centre, and track your
            payments hassle-free.
          </p>
          <div className="hero-btns">
            <a href="#portals" className="btn btn-hero-primary">Get Started / टोकन प्राप्त करें</a>
            <a href="#how-it-works" className="btn btn-hero-secondary">Learn More</a>
          </div>
        </div>

        <div className="hero-carousel">
          <img src={slides[active].image} alt={slides[active].alt} />
          <div className="carousel-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={index === active ? 'active' : ''}
                onClick={() => setActive(index)}
                aria-label={`Show slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
