import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, Clock, CheckCircle2, XCircle, Building2, Package, PackageCheck,
} from 'lucide-react'
import AppShell from '../../components/AppShell.jsx'
import { getDashboardSummary } from '../../services/adminService'

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

const STATUS_PILL_STYLE = {
  pending: { background: '#f7ebcf', color: '#b17a16' },
  verified: { background: '#e3f2e5', color: '#2e6342' },
  rejected: { background: '#fbe1e1', color: '#c0392b' },
}

export default function AdminDashboard() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getDashboardSummary()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load dashboard'))
  }, [])

  if (error) {
    return (
      <AppShell role="admin">
        <div className="panel page-panel">
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </AppShell>
    )
  }

  if (!data) {
    return (
      <AppShell role="admin">
        <div className="panel page-panel">
          <p>Loading dashboard…</p>
        </div>
      </AppShell>
    )
  }

  const { stats, capacity, awaitingAction, recentAuditActivity } = data
  const percentBooked = capacity.total > 0
    ? Math.min(100, Math.round((capacity.booked / capacity.total) * 100))
    : 0

  const statCards = [
    { label: 'Registered Farmers', value: stats.registeredFarmers, icon: Users, variant: '' },
    { label: 'Pending Verification', value: stats.pendingVerification, icon: Clock, variant: 'gold' },
    { label: 'Verified Farmers', value: stats.verifiedFarmers, icon: CheckCircle2, variant: 'blue' },
    { label: 'Rejected Applications', value: stats.rejectedApplications, icon: XCircle, variant: 'orange' },
    { label: 'Active Procurement Centres', value: stats.activeCentres, icon: Building2, variant: '' },
    { label: "Today's Capacity", value: stats.todaysCapacity, icon: Package, variant: 'gold' },
    { label: "Today's Booked Capacity", value: stats.todaysBookedCapacity, icon: PackageCheck, variant: 'blue' },
  ]

  return (
    <AppShell role="admin">
      {/* 7 stat cards */}
      <div className="stats-grid">
        {statCards.map(({ label, value, icon: Icon, variant }) => (
          <div key={label} className={`stat-card ${variant}`}>
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

      {/* Today's Procurement Capacity panel */}
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
            <p>Total</p>
            <strong>{capacity.total}</strong>
          </div>
          <div className="capacity-box">
            <p>Booked</p>
            <strong>{capacity.booked}</strong>
          </div>
          <div className="capacity-box">
            <p>Remaining</p>
            <strong>{capacity.remaining}</strong>
          </div>
        </div>
      </div>

      <div className="two-col">
        {/* Farmers awaiting action */}
        <div className="panel">
          <div className="panel-head">
            <h2>Farmers awaiting action</h2>
            <Link to="/admin/farmers" className="back-home">View all</Link>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Farmer</th>
                  <th>Village</th>
                  <th>Crop</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {awaitingAction.length === 0 && (
                  <tr><td colSpan={4}>No pending bookings</td></tr>
                )}
                {awaitingAction.map((b, idx) => (
                  <tr key={idx}>
                    <td>
                      <strong>{b.farmerName}</strong>
                      <div style={{ fontSize: 12, color: '#718075' }}>{b.farmerId}</div>
                    </td>
                    <td>{b.village || '—'}</td>
                    <td>{b.crop}</td>
                    <td>
                      <span className="status-pill" style={STATUS_PILL_STYLE[b.status]}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent audit activity */}
        <div className="panel">
          <div className="panel-head">
            <h2>Recent audit activity</h2>
            <span className="back-home" style={{ opacity: 0.5, cursor: 'default' }}>Full log</span>
          </div>
          <div className="audit-feed">
            {recentAuditActivity.length === 0 && <p>No recent activity</p>}
            {recentAuditActivity.map((log) => (
              <div key={log._id} className="audit-item">
                <div className="audit-icon" />
                <div className="audit-text">
                  <strong>{log.action}</strong>
                  <p>{log.details}</p>
                  <span className="audit-time">{timeAgo(log.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}