import { useState, useEffect } from 'react'
import AppShell from '../../components/AppShell.jsx'
import { submitComplaint, getMyComplaints } from '../../services/farmerService'

const STATUS_PILL_STYLE = {
  pending: { background: '#f7ebcf', color: '#b17a16' },
  resolved: { background: '#e3f2e5', color: '#2e6342' },
}

export default function FarmerComplaints() {
  const [complaints, setComplaints] = useState([])
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getMyComplaints()
      .then((res) => setComplaints(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load complaints'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await submitComplaint({ subject, description })
      setSubject('')
      setDescription('')
      setSuccess('Complaint submitted successfully.')
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit complaint')
    }
  }

  return (
    <AppShell role="farmer">
      <div className="panel page-panel">
        <h2>📝 Raise a Complaint</h2>
        <p>Facing an issue with booking, procurement or payment? Let us know.</p>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10, margin: '16px 0', maxWidth: 450 }}>
          <input
            className="simple-input"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
          <textarea
            className="simple-input"
            placeholder="Describe your issue"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit" className="action-btn" style={{ width: 'fit-content' }}>
            Submit Complaint
          </button>
        </form>

        {success && <p style={{ color: '#2e6342' }}>{success}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      <div className="panel page-panel">
        <h2>Your Complaints</h2>
        {loading && <p>Loading…</p>}
        {!loading && complaints.length === 0 && <p>No complaints raised yet.</p>}
        {complaints.map((c) => (
          <div key={c._id} style={{ padding: '12px 0', borderBottom: '1px solid #eee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <b>{c.subject}</b>
              <span className="status-pill" style={STATUS_PILL_STYLE[c.status]}>{c.status}</span>
            </div>
            <p style={{ margin: '6px 0', color: '#425247' }}>{c.description}</p>
            {c.adminReply && (
              <div style={{ background: '#f5f8f3', borderRadius: 10, padding: 10, marginTop: 6 }}>
                <b style={{ fontSize: 12, color: '#2e6342' }}>Admin reply:</b>
                <p style={{ margin: '4px 0 0', fontSize: 13 }}>{c.adminReply}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </AppShell>
  )
}