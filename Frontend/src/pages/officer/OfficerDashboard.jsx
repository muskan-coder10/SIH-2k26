import { useState, useEffect } from 'react'
import { Users, Ticket, Clock3 } from 'lucide-react'
import AppShell from '../../components/AppShell.jsx'
import useAuth from '../../hooks/useAuth.js'
import { getOfficerDashboardSummary } from '../../services/officerService'

const STATUS_PILL_STYLE = {
  pending: { background: '#f7ebcf', color: '#b17a16' },
  verified: { background: '#e3f2e5', color: '#2e6342' },
  weighed: { background: '#e5eff5', color: '#39708e' },
  procured: { background: '#e3f2e5', color: '#2e6342' },
  rejected: { background: '#fbe1e1', color: '#c0392b' },
}

const STATUS_LABEL = {
  pending: 'Waiting',
  verified: 'Verified',
  weighed: 'Weighed',
  procured: 'Procured',
  rejected: 'Rejected',
}

export default function OfficerDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getOfficerDashboardSummary()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load dashboard'))
  }, [])

  if (error) {
    return (
      <AppShell role="officer">
        <div className="panel page-panel">
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </AppShell>
    )
  }

  if (!data) {
    return (
      <AppShell role="officer">
        <div className="panel page-panel">
          <p>Loading dashboard…</p>
        </div>
      </AppShell>
    )
  }

  const { stats, capacity, todaysBookings } = data
  const percentBooked = capacity.total > 0
    ? Math.min(100, Math.round((capacity.booked / capacity.total) * 100))
    : 0

  // "Next in Queue" — bookings still waiting on this officer's action
  const nextInQueue = todaysBookings
    .filter((b) => b.status === 'pending' || b.status === 'verified')
    .slice(0, 5)

  // "Today's Schedule" — everything booked for today, time-ordered
  const todaysSchedule = todaysBookings.slice(0, 5)

  const statCards = [
    { label: 'Total Farmers', value: stats.totalFarmers, icon: Users },
    { label: "Today's Tokens", value: stats.todaysTokens, icon: Ticket, variant: 'gold' },
    { label: 'Farmers Waiting', value: stats.farmersWaiting, icon: Clock3, variant: 'orange' },
  ]

  return (
    <AppShell role="officer">
      <div className="panel" style={{ marginBottom: 20 }}>
        <h2 style={{ marginBottom: 4 }}>Today's Overview</h2>
        <p style={{ color: '#718075', fontSize: 13, margin: 0 }}>
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'short', year: 'numeric' })}
          {user?.centreName && ` · ${user.centreName}`}
        </p>
      </div>

      <div className="stats-grid">
        {statCards.map(({ label, value, icon: Icon, variant }) => (
          <div key={label} className={`stat-card ${variant || ''}`}>
            <div className="stat-icon">
              <Icon size={20} />
            </div>
            <div>
              <p>{label}</p>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className="panel">
        <h2>Today's Procurement Capacity</h2>
        <div className="progress-row">
          <span>Booked</span>
          <span>{percentBooked}%</span>
        </div>
        <div className="progress">
          <i style={{ width: `${percentBooked}%` }} />
        </div>
        <div className="capacity-boxes">
          <div className="capacity-box">
            <p>Daily Capacity</p>
            <strong>{capacity.total} Q</strong>
          </div>
          <div className="capacity-box">
            <p>Booked</p>
            <strong>{capacity.booked} Q</strong>
          </div>
          <div className="capacity-box">
            <p>Remaining</p>
            <strong>{capacity.remaining} Q</strong>
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="panel">
          <div className="panel-head">
            <h2>Next in Queue</h2>
          </div>
          <div className="table-wrap">
            {nextInQueue.length === 0 && <p style={{ color: '#718075' }}>No one waiting right now.</p>}
            {nextInQueue.map((b) => (
              <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #edf1ed' }}>
                <div>
                  <strong>{b.farmer?.name || '—'}</strong>
                  <div style={{ fontSize: 12, color: '#718075' }}>
                    {b.tokenNumber} · {b.farmer?.village || '—'} · {b.quantity}kg · {b.slotTime}
                  </div>
                </div>
                <span className="status-pill" style={STATUS_PILL_STYLE[b.status]}>
                  {STATUS_LABEL[b.status] || b.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-head">
            <h2>Today's Schedule (next up)</h2>
          </div>
          <div className="table-wrap">
            {todaysSchedule.length === 0 && <p style={{ color: '#718075' }}>No bookings scheduled for today.</p>}
            {todaysSchedule.map((b) => (
              <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #edf1ed' }}>
                <div>
                  <strong>{b.slotTime}</strong> — {b.tokenNumber} — {b.farmer?.name || '—'}
                  <div style={{ fontSize: 12, color: '#718075' }}>
                    {b.farmer?.village || '—'} · {b.cropType} · {b.quantity}kg
                  </div>
                </div>
                <span className="status-pill" style={STATUS_PILL_STYLE[b.status]}>
                  {STATUS_LABEL[b.status] || b.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}