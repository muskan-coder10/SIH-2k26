import SectionHeading from '../components/SectionHeading.jsx'
import { stepsData } from '../data/stepsData.js'

export default function HowItWorks() {
  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <SectionHeading
          title="How It Works / प्रक्रिया"
          subtitle="Sell your crop in 5 simple and hassle-free steps"
        />
        <div className="steps-container">
          {stepsData.map((step) => (
            <div className="step-item" key={step.number}>
              <div className="step-number">{step.number}</div>
              <h4>{step.title}</h4>
              <p>{step.hindi}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
