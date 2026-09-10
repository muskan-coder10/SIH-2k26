export default function Contact() {
  const info = [
    ['📞 Helpline', '1800-XXX-XXXX'],
    ['🕐 Support Time', '8:00 AM – 8:00 PM'],
    ['📧 Email', 'support@anndisha.gov.in'],
    ['📍 Department', 'Procurement Dept.'],
  ]

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="contact-box">
          <div className="contact-info">
            {info.map(([title, text]) => (
              <div className="info-item" key={title}>
                <h5>{title}</h5>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <a className="btn btn-primary" href="tel:1800000000">☎ Call Helpline</a>
        </div>
      </div>
    </section>
  )
}
