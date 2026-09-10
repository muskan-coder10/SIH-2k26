import { useState, useEffect } from 'react'
import AppShell from '../../components/AppShell.jsx'
import { Construction } from 'lucide-react'
import {
  getAllFarmers, getAllCentres, createCentre, deleteFarmer, deleteCentre,
  getReports, verifyFarmer, rejectFarmer, getAllComplaints, replyComplaint,
  getEligibleFarmers, getAllBookingsAdmin, updateBookingAdmin, cancelBookingAdmin,
  getAllPaymentsAdmin, updatePaymentAdmin, changeAdminPassword,
} from '../../services/adminService'

export function Farmers() {
  const [farmers, setFarmers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getAllFarmers()
      .then((res) => setFarmers(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load farmers'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    try {
      await deleteFarmer(id)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete farmer')
    }
  }

  const handleVerify = async (id) => {
    try {
      await verifyFarmer(id)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not verify farmer')
    }
  }

  const handleReject = async (id) => {
    const reason = window.prompt('Rejection reason:')
    if (reason === null) return
    try {
      await rejectFarmer(id, reason)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reject farmer')
    }
  }

  const statusStyle = {
    pending: { background: '#f7ebcf', color: '#b17a16' },
    verified: { background: '#e3f2e5', color: '#2e6342' },
    rejected: { background: '#fbe3e3', color: '#c0392b' },
  }

  return <AppShell role="admin">
    <div className="panel page-panel">
      <h2>✅ Farmer Verification</h2>
      <p>Review farmer applications and verify or reject them.</p>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && farmers.length === 0 && <p>No farmers registered yet.</p>}
      {farmers.map((f) => (
        <div key={f._id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #eee', flexWrap:'wrap', gap:8}}>
          <div>
            <b>{f.name}</b> {f.farmerId && `(${f.farmerId})`} · {f.phone} {f.village && `· ${f.village}`} {f.district && `, ${f.district}`}
            {f.verificationStatus && (
              <span className="status-pill" style={{marginLeft:10, ...statusStyle[f.verificationStatus]}}>
                {f.verificationStatus}
              </span>
            )}
            {f.verificationStatus === 'rejected' && f.rejectionReason && (
              <div style={{fontSize:12, color:'#c0392b', marginTop:4}}>Reason: {f.rejectionReason}</div>
            )}
          </div>
          <div style={{display:'flex', gap:10}}>
            {f.verificationStatus !== 'verified' && (
              <button onClick={() => handleVerify(f._id)} style={{color:'#2e6342', background:'none', border:'1px solid #2e6342', borderRadius:8, padding:'6px 12px', cursor:'pointer'}}>Verify</button>
            )}
            {f.verificationStatus !== 'rejected' && (
              <button onClick={() => handleReject(f._id)} style={{color:'#c0392b', background:'none', border:'1px solid #c0392b', borderRadius:8, padding:'6px 12px', cursor:'pointer'}}>Reject</button>
            )}
            <button onClick={() => handleDelete(f._id)} style={{color:'red', background:'none', border:'none', cursor:'pointer'}}>Remove</button>
          </div>
        </div>
      ))}
    </div>
  </AppShell>
}

export function Centres() {
  const [centres, setCentres] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [district, setDistrict] = useState('')
  const [capacityPerDay, setCapacityPerDay] = useState('')

  const load = () => {
    setLoading(true)
    getAllCentres()
      .then((res) => setCentres(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load centres'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    try {
      await createCentre({ name, location, district, capacityPerDay: Number(capacityPerDay) || 0 })
      setName(''); setLocation(''); setDistrict(''); setCapacityPerDay('')
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add centre')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCentre(id)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete centre')
    }
  }

  return <AppShell role="admin">
    <div className="panel page-panel">
      <h2>🏢 Procurement Centres</h2>
      <p>Manage centre capacity, schedules and availability.</p>

      <form onSubmit={handleAdd} style={{display:'flex', gap:10, flexWrap:'wrap', margin:'16px 0'}}>
        <input placeholder="Centre name" value={name} onChange={(e)=>setName(e.target.value)} required/>
        <input placeholder="Location" value={location} onChange={(e)=>setLocation(e.target.value)} required/>
        <input placeholder="District" value={district} onChange={(e)=>setDistrict(e.target.value)}/>
        <input placeholder="Capacity/day" type="number" value={capacityPerDay} onChange={(e)=>setCapacityPerDay(e.target.value)}/>
        <button type="submit">Add Centre</button>
      </form>

      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && centres.length === 0 && <p>No centres added yet.</p>}
      {centres.map((c) => (
        <div key={c._id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #eee'}}>
          <div><b>{c.name}</b> · {c.location} {c.district && `, ${c.district}`} · Capacity: {c.capacityPerDay}/day</div>
          <button onClick={() => handleDelete(c._id)} style={{color:'red', background:'none', border:'none', cursor:'pointer'}}>Remove</button>
        </div>
      ))}
    </div>
  </AppShell>
}

export function Reports() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getReports()
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load reports'))
      .finally(() => setLoading(false))
  }, [])

  return <AppShell role="admin">
    <div className="panel page-panel">
      <h2>📊 Reports</h2>
      <p>View procurement, token, payment and centre reports.</p>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {stats && <>
        <p>Total Farmers: <b>{stats.totalFarmers}</b></p>
        <p>Total Centres: <b>{stats.totalCentres}</b></p>
        <p>Total Bookings: <b>{stats.totalBookings}</b></p>
        <p>Total Paid Amount: <b>₹{stats.totalPaidAmount.toLocaleString('en-IN')}</b></p>
        <h3 style={{marginTop:16}}>Bookings by Status</h3>
        {stats.bookingsByStatus.map((s) => (
          <p key={s._id}>{s._id}: <b>{s.count}</b></p>
        ))}
      </>}
    </div>
  </AppShell>
}

export function Complaints() {
  const [complaints, setComplaints] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [replyDrafts, setReplyDrafts] = useState({})

  const load = () => {
    setLoading(true)
    getAllComplaints()
      .then((res) => setComplaints(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load complaints'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const statusStyle = {
    pending: { background: '#f7ebcf', color: '#b17a16' },
    resolved: { background: '#e3f2e5', color: '#2e6342' },
  }

  const handleReply = async (id) => {
    const reply = replyDrafts[id]
    if (!reply || !reply.trim()) return
    try {
      await replyComplaint(id, reply)
      setReplyDrafts((prev) => ({ ...prev, [id]: '' }))
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send reply')
    }
  }

  return <AppShell role="admin">
    <div className="panel page-panel">
      <h2>⚠️ Complaints</h2>
      <p>View and resolve farmer complaints.</p>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && complaints.length === 0 && <p>No complaints yet.</p>}
      {complaints.map((c) => (
        <div key={c._id} style={{ padding: '14px 0', borderBottom: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <div>
              <b>{c.subject}</b>
              {c.farmer && <span style={{ color: '#718075', fontSize: 12, marginLeft: 8 }}>
                {c.farmer.name} {c.farmer.farmerId && `(${c.farmer.farmerId})`} {c.farmer.village && `· ${c.farmer.village}`}
              </span>}
            </div>
            <span className="status-pill" style={statusStyle[c.status]}>{c.status}</span>
          </div>
          <p style={{ margin: '6px 0', color: '#425247' }}>{c.description}</p>

          {c.adminReply ? (
            <div style={{ background: '#f5f8f3', borderRadius: 10, padding: 10, marginTop: 6 }}>
              <b style={{ fontSize: 12, color: '#2e6342' }}>Your reply:</b>
              <p style={{ margin: '4px 0 0', fontSize: 13 }}>{c.adminReply}</p>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
              <input
                className="simple-input"
                style={{ maxWidth: 320 }}
                placeholder="Type a reply…"
                value={replyDrafts[c._id] || ''}
                onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [c._id]: e.target.value }))}
              />
              <button
                onClick={() => handleReply(c._id)}
                style={{ color: '#2e6342', background: 'none', border: '1px solid #2e6342', borderRadius: 8, padding: '6px 12px', cursor: 'pointer' }}
              >
                Send & Resolve
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  </AppShell>
}

function Placeholder({ title }) {
  return <AppShell role="admin">
    <div className="panel page-panel" style={{textAlign:'center', padding:'60px 24px'}}>
      <Construction size={40} color="#b17a16" style={{marginBottom:14}}/>
      <h2>{title}</h2>
      <p style={{color:'#718075'}}>Yeh page abhi bana rahe hain — jald hi aayega.</p>
    </div>
  </AppShell>
}

export function FarmerApplications() {
  const [farmers, setFarmers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getAllFarmers()
      .then((res) => setFarmers(res.data.filter((f) => f.verificationStatus === 'pending')))
      .catch((err) => setError(err.response?.data?.message || 'Could not load applications'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleVerify = async (id) => {
    try {
      await verifyFarmer(id)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not verify farmer')
    }
  }

  const handleReject = async (id) => {
    const reason = window.prompt('Rejection reason:')
    if (reason === null) return
    try {
      await rejectFarmer(id, reason)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reject farmer')
    }
  }

  return <AppShell role="admin">
    <div className="panel page-panel">
      <h2>📋 Farmer Applications</h2>
      <p>New / pending applications waiting for your decision.</p>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && farmers.length === 0 && <p>No pending applications right now — all caught up! 🎉</p>}
      {farmers.map((f) => (
        <div key={f._id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #eee', flexWrap:'wrap', gap:8}}>
          <div>
            <b>{f.name}</b> {f.farmerId && `(${f.farmerId})`} · {f.phone} {f.village && `· ${f.village}`} {f.district && `, ${f.district}`}
            <div style={{fontSize:12, color:'#718075', marginTop:2}}>
              Applied {new Date(f.createdAt).toLocaleDateString('en-IN')}
            </div>
          </div>
          <div style={{display:'flex', gap:10}}>
            <button onClick={() => handleVerify(f._id)} style={{color:'#2e6342', background:'none', border:'1px solid #2e6342', borderRadius:8, padding:'6px 12px', cursor:'pointer'}}>Verify</button>
            <button onClick={() => handleReject(f._id)} style={{color:'#c0392b', background:'none', border:'1px solid #c0392b', borderRadius:8, padding:'6px 12px', cursor:'pointer'}}>Reject</button>
          </div>
        </div>
      ))}
    </div>
  </AppShell>
}

export function EligibleFarmers() {
  const [farmers, setFarmers] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEligibleFarmers()
      .then((res) => {
        const data = res.data
        const list = Array.isArray(data) ? data : (data?.farmers || data?.data || [])
        setFarmers(list)
      })
      .catch((err) => setError(err.response?.data?.message || 'Could not load eligible farmers'))
      .finally(() => setLoading(false))
  }, [])

  return <AppShell role="admin">
    <div className="panel page-panel">
      <h2>👤 Eligible Farmers</h2>
      <p>Verified farmers eligible for token booking.</p>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && farmers.length === 0 && <p>No eligible farmers found.</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Farmer</th><th>Village</th><th>Phone</th><th>Status</th></tr>
          </thead>
          <tbody>
            {farmers.map((f) => (
              <tr key={f._id}>
                <td><strong>{f.name}</strong><div style={{fontSize:12, color:'#718075'}}>{f.farmerId}</div></td>
                <td>{f.village || '—'} {f.district && `, ${f.district}`}</td>
                <td>{f.phone}</td>
                <td>
                  {f.hasActiveBooking
                    ? <span className="status-pill" style={{background:'#e3f2e5', color:'#2e6342'}}>Booking Active</span>
                    : <span className="status-pill" style={{background:'#f7ebcf', color:'#b17a16'}}>Free</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </AppShell>
}

export function TokenManagement() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  const load = () => {
    setLoading(true)
    getAllBookingsAdmin(status ? { status } : {})
      .then((res) => {
        const data = res.data
        const list = Array.isArray(data) ? data : (data?.bookings || data?.data || [])
        setBookings(list)
      })
      .catch((err) => setError(err.response?.data?.message || 'Could not load tokens'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [status])

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this token/booking?')) return
    try {
      await cancelBookingAdmin(id)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not cancel booking')
    }
  }

  const tabs = ['', 'pending', 'verified', 'weighed', 'processing', 'paid']

  return <AppShell role="admin">
    <div className="panel page-panel">
      <h2>🎫 Token Management</h2>
      <p>View, edit and cancel farmer tokens.</p>
      <div style={{display:'flex', gap:8, margin:'12px 0', flexWrap:'wrap'}}>
        {tabs.map((t) => (
          <button key={t || 'all'} onClick={() => setStatus(t)}
            style={{
              padding:'6px 14px', borderRadius:20, cursor:'pointer',
              border: status === t ? '1px solid #2e6342' : '1px solid #ccc',
              background: status === t ? '#e3f2e5' : 'none',
              color: status === t ? '#2e6342' : '#425247'
            }}>
            {t || 'All'}
          </button>
        ))}
      </div>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && bookings.length === 0 && <p>No tokens found.</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Farmer</th><th>Centre</th><th>Slot</th><th>Crop</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td><strong>{b.farmerName || b.farmer?.name || '—'}</strong></td>
                <td>{b.centreName || b.centre?.name || '—'}</td>
                <td>{b.slotDate ? new Date(b.slotDate).toLocaleDateString('en-IN') : '—'} {b.slotTime || ''}</td>
                <td>{b.crop || '—'}</td>
                <td><span className="status-pill" style={{background:'#f7ebcf', color:'#b17a16'}}>{b.status}</span></td>
                <td>
                  {b.status !== 'paid' && b.status !== 'cancelled' && (
                    <button onClick={() => handleCancel(b._id)} style={{color:'red', background:'none', border:'none', cursor:'pointer'}}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </AppShell>
}

export function AdminProcurement() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('verified')

  const load = () => {
    setLoading(true)
    getAllBookingsAdmin({ status })
      .then((res) => {
        const data = res.data
        const list = Array.isArray(data) ? data : (data?.bookings || data?.data || [])
        setBookings(list)
      })
      .catch((err) => setError(err.response?.data?.message || 'Could not load procurement data'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [status])

  const tabs = ['verified', 'weighed', 'processing', 'paid']

  return <AppShell role="admin">
    <div className="panel page-panel">
      <h2>📦 Procurement Overview</h2>
      <p>Track procurement progress across centres.</p>
      <div style={{display:'flex', gap:8, margin:'12px 0', flexWrap:'wrap'}}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setStatus(t)}
            style={{
              padding:'6px 14px', borderRadius:20, cursor:'pointer',
              border: status === t ? '1px solid #2e6342' : '1px solid #ccc',
              background: status === t ? '#e3f2e5' : 'none',
              color: status === t ? '#2e6342' : '#425247'
            }}>
            {t}
          </button>
        ))}
      </div>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && bookings.length === 0 && <p>No bookings in this stage.</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Farmer</th><th>Centre</th><th>Crop</th><th>Quantity</th><th>Status</th></tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td><strong>{b.farmerName || b.farmer?.name || '—'}</strong></td>
                <td>{b.centreName || b.centre?.name || '—'}</td>
                <td>{b.crop || '—'}</td>
                <td>{b.quantity ?? '—'}</td>
                <td><span className="status-pill" style={{background:'#e3f2e5', color:'#2e6342'}}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </AppShell>
}

export function AdminPayments() {
  const [payments, setPayments] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')

  const load = () => {
    setLoading(true)
    getAllPaymentsAdmin(status ? { status } : {})
      .then((res) => {
        const data = res.data
        const list = Array.isArray(data) ? data : (data?.payments || data?.data || [])
        setPayments(list)
      })
      .catch((err) => setError(err.response?.data?.message || 'Could not load payments'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [status])

  const handleMarkPaid = async (id) => {
    try {
      await updatePaymentAdmin(id, { status: 'paid' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update payment')
    }
  }

  return <AppShell role="admin">
    <div className="panel page-panel">
      <h2>💰 Payments</h2>
      <p>Track and update farmer payments.</p>
      <div style={{display:'flex', gap:8, margin:'12px 0'}}>
        {['', 'processing', 'paid'].map((t) => (
          <button key={t || 'all'} onClick={() => setStatus(t)}
            style={{
              padding:'6px 14px', borderRadius:20, cursor:'pointer',
              border: status === t ? '1px solid #2e6342' : '1px solid #ccc',
              background: status === t ? '#e3f2e5' : 'none',
              color: status === t ? '#2e6342' : '#425247'
            }}>
            {t || 'All'}
          </button>
        ))}
      </div>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && payments.length === 0 && <p>No payments found.</p>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Farmer</th><th>Centre</th><th>Amount</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p._id}>
                <td><strong>{p.farmerName || p.farmer?.name || '—'}</strong></td>
                <td>{p.centreName || p.centre?.name || '—'}</td>
                <td>₹{(p.amount ?? 0).toLocaleString('en-IN')}</td>
                <td><span className="status-pill" style={{background: p.status === 'paid' ? '#e3f2e5' : '#f7ebcf', color: p.status === 'paid' ? '#2e6342' : '#b17a16'}}>{p.status}</span></td>
                <td>
                  {p.status !== 'paid' && (
                    <button onClick={() => handleMarkPaid(p._id)} style={{color:'#2e6342', background:'none', border:'1px solid #2e6342', borderRadius:8, padding:'6px 12px', cursor:'pointer'}}>Mark Paid</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </AppShell>
}

export function Settings() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setMsg('')
    try {
      await changeAdminPassword({ oldPassword, newPassword })
      setMsg('Password changed successfully.')
      setOldPassword(''); setNewPassword('')
    } catch (err) {
      setError(err.response?.data?.message || 'Could not change password')
    }
  }

  return <AppShell role="admin">
    <div className="panel page-panel">
      <h2>⚙️ Settings</h2>
      <p>Update your account password.</p>
      <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:10, maxWidth:320, marginTop:16}}>
        <input className="simple-input" type="password" placeholder="Current password" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} required/>
        <input className="simple-input" type="password" placeholder="New password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} required/>
        <button type="submit" style={{color:'#2e6342', background:'none', border:'1px solid #2e6342', borderRadius:8, padding:'8px 12px', cursor:'pointer'}}>Change Password</button>
        {msg && <p style={{color:'#2e6342'}}>{msg}</p>}
        {error && <p style={{color:'red'}}>{error}</p>}
      </form>
    </div>
  </AppShell>
}