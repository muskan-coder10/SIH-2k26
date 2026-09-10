import { useState, useEffect } from 'react'
import AppShell from '../../components/AppShell.jsx'
import {
  getOfficerFarmers,
  getAllBookings,
  verifyBooking,
  updateProcurement,
  createOrUpdatePayment,
  getOfficerReports,
  changeOfficerPassword,
} from '../../services/officerService'
import useAuth from '../../hooks/useAuth.js'

const STATUS_PILL_STYLE = {
  pending: { background: '#f7ebcf', color: '#b17a16' },
  verified: { background: '#e3f2e5', color: '#2e6342' },
  weighed: { background: '#e5eff5', color: '#39708e' },
  procured: { background: '#e3f2e5', color: '#2e6342' },
  rejected: { background: '#fbe1e1', color: '#c0392b' },
}

// ------------------ FARMERS (read-only directory) ------------------

export function Farmers() {
  const [farmers, setFarmers] = useState([])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOfficerFarmers()
      .then((res) => setFarmers(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load farmers'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = farmers.filter((f) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return (
      f.name?.toLowerCase().includes(q) ||
      f.phone?.includes(q) ||
      f.village?.toLowerCase().includes(q) ||
      f.farmerId?.toLowerCase().includes(q)
    )
  })

  return <AppShell role="officer">
    <div className="panel page-panel">
      <h2>👨‍🌾 Farmers</h2>
      <p>Directory of all registered farmers.</p>
      <input
        className="simple-input"
        placeholder="Search by name, phone, village or ID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ margin: '14px 0' }}
      />
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && filtered.length === 0 && <p>No farmers found.</p>}
      {filtered.map((f) => (
        <div key={f._id} style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <b>{f.name}</b> {f.farmerId && `(${f.farmerId})`} · {f.phone} {f.village && `· ${f.village}`} {f.district && `, ${f.district}`}
          {f.verificationStatus && (
            <span className="status-pill" style={{ marginLeft: 10, background: '#edf1ed', color: '#68766c' }}>
              {f.verificationStatus}
            </span>
          )}
        </div>
      ))}
    </div>
  </AppShell>
}

// ------------------ PROCUREMENT (combined: verify -> weigh -> procure -> payment) ------------------

export function Procurement() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [weights, setWeights] = useState({})
  const [amounts, setAmounts] = useState({})
  const [filter, setFilter] = useState('all')

  const load = () => {
    setLoading(true)
    getAllBookings()
      .then((res) => setBookings(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleVerify = async (bookingId) => {
    try { await verifyBooking(bookingId); load() }
    catch (err) { setError(err.response?.data?.message || 'Could not verify') }
  }

  const handleWeigh = async (bookingId) => {
    const weight = weights[bookingId]
    if (!weight) return
    try {
      await updateProcurement(bookingId, { status: 'weighed', quantity: Number(weight) })
      load()
    } catch (err) { setError(err.response?.data?.message || 'Could not submit weight') }
  }

  const handleConfirmProcurement = async (bookingId) => {
    try { await updateProcurement(bookingId, { status: 'procured' }); load() }
    catch (err) { setError(err.response?.data?.message || 'Could not confirm procurement') }
  }

  const handlePayment = async (bookingId, status) => {
    const amount = amounts[bookingId]
    if (!amount) return
    try {
      await createOrUpdatePayment({ bookingId, amount: Number(amount), status })
      load()
    } catch (err) { setError(err.response?.data?.message || 'Could not update payment') }
  }

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)

  const FILTERS = [
    ['all', 'All'],
    ['pending', 'Pending'],
    ['verified', 'Verified'],
    ['weighed', 'Weighed'],
    ['procured', 'Procured'],
  ]

  return <AppShell role="officer">
    <div className="panel page-panel" style={{ maxWidth: 950 }}>
      <h2>📦 Procurement</h2>
      <p>Full workflow — verify, weigh, confirm procurement and update payment, all in one place.</p>

      <div style={{ display: 'flex', gap: 8, margin: '14px 0', flexWrap: 'wrap' }}>
        {FILTERS.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, cursor: 'pointer',
              border: filter === key ? '1px solid #2e6342' : '1px solid #ccd9ce',
              background: filter === key ? '#2e6342' : '#fff',
              color: filter === key ? '#fff' : '#425247',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && filtered.length === 0 && <p>No bookings in this stage.</p>}

      {filtered.map((b) => (
        <div key={b._id} style={{ padding: '14px 0', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
            <div>
              Token <b>{b.tokenNumber}</b> · {b.farmer?.name} ({b.farmer?.phone}) · {b.cropType}, {b.quantity}kg
            </div>
            <span className="status-pill" style={STATUS_PILL_STYLE[b.status]}>{b.status}</span>
          </div>

          <div style={{ marginTop: 10, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
            {b.status === 'pending' && (
              <button className="action-btn" onClick={() => handleVerify(b._id)}>Verify Farmer</button>
            )}

            {b.status === 'verified' && (
              <>
                <input
                  className="simple-input"
                  style={{ maxWidth: 160 }}
                  placeholder="Weight in KG"
                  value={weights[b._id] || ''}
                  onChange={(e) => setWeights({ ...weights, [b._id]: e.target.value })}
                />
                <button className="action-btn" onClick={() => handleWeigh(b._id)}>Submit Weight</button>
              </>
            )}

            {b.status === 'weighed' && (
              <button className="action-btn" onClick={() => handleConfirmProcurement(b._id)}>Confirm Procurement</button>
            )}

            {b.status === 'procured' && (
              <>
                <input
                  className="simple-input"
                  style={{ maxWidth: 160 }}
                  placeholder="Amount ₹"
                  value={amounts[b._id] || ''}
                  onChange={(e) => setAmounts({ ...amounts, [b._id]: e.target.value })}
                />
                <button className="action-btn" onClick={() => handlePayment(b._id, 'processing')}>Mark Processing</button>
                <button className="action-btn" onClick={() => handlePayment(b._id, 'paid')}>Mark Paid</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  </AppShell>
}

// ------------------ LIVE QUEUE ------------------

export function LiveQueue() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllBookings()
      .then((res) => {
        const today = new Date().toDateString()
        const waiting = res.data
          .filter((b) => (b.status === 'pending' || b.status === 'verified') && new Date(b.slotDate).toDateString() === today)
          .sort((a, b) => (a.slotTime || '').localeCompare(b.slotTime || ''))
        setBookings(waiting)
      })
      .catch((err) => setError(err.response?.data?.message || 'Could not load queue'))
      .finally(() => setLoading(false))
  }, [])

  return <AppShell role="officer">
    <div className="panel page-panel" style={{ maxWidth: 850 }}>
      <h2>📡 Live Queue</h2>
      <p>Farmers waiting to be verified or weighed today, in slot order.</p>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && bookings.length === 0 && <p>No one in the queue right now.</p>}
      {bookings.map((b, idx) => (
        <div key={b._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e3f2e5', color: '#2e6342', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13 }}>
              {idx + 1}
            </div>
            <div>
              <b>{b.farmer?.name}</b>
              <div style={{ fontSize: 12, color: '#718075' }}>{b.tokenNumber} · {b.farmer?.village} · {b.quantity}kg · {b.slotTime}</div>
            </div>
          </div>
          <span className="status-pill" style={STATUS_PILL_STYLE[b.status]}>{b.status}</span>
        </div>
      ))}
    </div>
  </AppShell>
}

// ------------------ NOTIFICATIONS ------------------

const NOTIF_CONFIG = {
  pending: (b) => `${b.farmer?.name || 'A farmer'} booked a slot (Token ${b.tokenNumber}) — awaiting verification.`,
  verified: (b) => `Token ${b.tokenNumber} (${b.farmer?.name || '—'}) was verified.`,
  weighed: (b) => `Token ${b.tokenNumber} (${b.farmer?.name || '—'}) was weighed — ${b.quantity}kg.`,
  procured: (b) => `Token ${b.tokenNumber} (${b.farmer?.name || '—'}) procurement completed.`,
  rejected: (b) => `Token ${b.tokenNumber} (${b.farmer?.name || '—'}) was rejected.`,
}

export function Notifications() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllBookings()
      .then((res) => {
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
        )
        setBookings(sorted.slice(0, 15))
      })
      .catch((err) => setError(err.response?.data?.message || 'Could not load notifications'))
      .finally(() => setLoading(false))
  }, [])

  return <AppShell role="officer">
    <div className="panel page-panel">
      <h2>🔔 Notifications</h2>
      <p>Recent booking activity across your bookings.</p>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && bookings.length === 0 && <p>Nothing new right now.</p>}
      {bookings.map((b) => (
        <div key={b._id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px solid #eee' }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3d7651', marginTop: 6, flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: 13.5 }}>{(NOTIF_CONFIG[b.status] || (() => `Token ${b.tokenNumber} updated.`))(b)}</p>
        </div>
      ))}
    </div>
  </AppShell>
}

// ------------------ REPORTS ------------------

export function Reports() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOfficerReports()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load reports'))
      .finally(() => setLoading(false))
  }, [])

  return <AppShell role="officer">
    <div className="panel page-panel">
      <h2>📊 Reports</h2>
      <p>{stats?.centreName ? `Summary for ${stats.centreName}` : 'Centre summary'}</p>
      {loading && <p>Loading…</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {stats && <>
        <p>Total Bookings: <b>{stats.totalBookings}</b></p>
        <p>Total Paid Amount: <b>₹{stats.totalPaidAmount.toLocaleString('en-IN')}</b></p>
        <h3 style={{ marginTop: 16 }}>Bookings by Status</h3>
        {stats.bookingsByStatus.length === 0 && <p>No bookings yet.</p>}
        {stats.bookingsByStatus.map((s) => (
          <p key={s._id}>{s._id}: <b>{s.count}</b></p>
        ))}
      </>}
    </div>
  </AppShell>
}

// ------------------ SETTINGS ------------------

export function Settings() {
  const { user } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      await changeOfficerPassword({ currentPassword, newPassword })
      setSuccess('Password updated successfully.')
      setCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password')
    } finally {
      setSubmitting(false)
    }
  }

  return <AppShell role="officer">
    <div className="panel page-panel">
      <h2>⚙️ Settings</h2>
      <p>Your profile</p>
      <p><b>Name:</b> {user?.name}</p>
      <p><b>Email:</b> {user?.email}</p>
      {user?.centreName && <p><b>Centre:</b> {user.centreName} {user?.centreLocation && `· ${user.centreLocation}`}</p>}
    </div>

    <div className="panel page-panel">
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 10, maxWidth: 350 }}>
        <input
          className="simple-input"
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          className="simple-input"
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button type="submit" className="action-btn" disabled={submitting} style={{ width: 'fit-content' }}>
          {submitting ? 'Updating…' : 'Update Password'}
        </button>
      </form>
      {success && <p style={{ color: '#2e6342', marginTop: 10 }}>{success}</p>}
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  </AppShell>
}