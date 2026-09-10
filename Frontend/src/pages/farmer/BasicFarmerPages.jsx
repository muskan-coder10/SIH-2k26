
import { useState, useEffect } from 'react'
import AppShell from '../../components/AppShell.jsx'
import { getMyToken, getMySchedule, getCropStatus, getMyPayments } from '../../services/farmerService'

export function Token() {
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyToken()
      .then((res) => setBooking(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load token'))
      .finally(() => setLoading(false))
  }, [])

  return <AppShell>
    <div className="panel page-panel">
      <h2>🎟️ My Token</h2>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {booking && <>
        <div className="token-big">{booking.tokenNumber}</div>
        <p>Your procurement slot is confirmed for <b>{new Date(booking.slotDate).toLocaleDateString()}, {booking.slotTime}</b> at <b>{booking.centreName}</b>.</p>
      </>}
    </div>
  </AppShell>
}

export function Schedule() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMySchedule()
      .then((res) => setBookings(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load schedule'))
      .finally(() => setLoading(false))
  }, [])

  return <AppShell>
    <div className="panel page-panel">
      <h2>📅 My Schedule</h2>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && bookings.length === 0 && <p>No bookings yet.</p>}
      {bookings.map((b) => (
        <div key={b._id} style={{marginBottom: 10}}>
          <p>{new Date(b.slotDate).toLocaleDateString()} · {b.slotTime}</p>
          <p>{b.centreName}</p>
        </div>
      ))}
    </div>
  </AppShell>
}

export function Centre() {
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyToken()
      .then((res) => setBooking(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load centre'))
      .finally(() => setLoading(false))
  }, [])

  return <AppShell>
    <div className="panel page-panel">
      <h2>📍 Find Centre</h2>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {booking && <>
        <p><b>{booking.centreName}</b></p>
        <p>Assigned centre for your current booking</p>
      </>}
    </div>
  </AppShell>
}

export function CropStatus() {
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyToken()
      .then((tokenRes) => getCropStatus(tokenRes.data._id))
      .then((res) => setBooking(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load crop status'))
      .finally(() => setLoading(false))
  }, [])

  const statusLabel = {
    pending: 'Token Issued',
    verified: 'Verification Completed',
    weighed: 'Weighing Completed',
    procured: 'Procurement Completed',
    rejected: 'Rejected',
  }

  return <AppShell>
    <div className="panel page-panel">
      <h2>🌾 Crop Status</h2>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {booking && <>
        <p>Token → Verification → Weighing → Procurement → Payment</p>
        <span className="status-pill">{statusLabel[booking.status] || booking.status}</span>
      </>}
    </div>
  </AppShell>
}

export function Payment() {
  const [payments, setPayments] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyPayments()
      .then((res) => setPayments(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load payment'))
      .finally(() => setLoading(false))
  }, [])

  const latest = payments[0]

  return <AppShell>
    <div className="panel page-panel">
      <h2>💰 Payment</h2>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && !latest && <p>No payment records yet.</p>}
      {latest && <>
        <div className="big-money">₹{latest.amount.toLocaleString('en-IN')}</div>
        <p>Status: {latest.status}</p>
      </>}
    </div>
  </AppShell>
}