import { useState, useEffect } from 'react'
import AppShell from '../../components/AppShell.jsx'
import { getPendingBookings, verifyBooking, getAllBookings, updateProcurement, createOrUpdatePayment } from '../../services/officerService'

export function Verification() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getPendingBookings()
      .then((res) => setBookings(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleVerify = async (bookingId) => {
    try {
      await verifyBooking(bookingId)
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not verify')
    }
  }

  return <AppShell role="officer">
    <div className="panel page-panel">
      <h2>✓ Farmer Verification</h2>
      <p>Pending bookings waiting for verification.</p>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && bookings.length === 0 && <p>No pending bookings.</p>}
      {bookings.map((b) => (
        <div key={b._id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #eee'}}>
          <div>
            Token <b>{b.tokenNumber}</b> · {b.farmer?.name} ({b.farmer?.phone}) · {b.cropType}, {b.quantity}kg
          </div>
          <button className="action-btn" onClick={() => handleVerify(b._id)}>Verify Farmer</button>
        </div>
      ))}
    </div>
  </AppShell>
}

export function Weighing() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [weights, setWeights] = useState({})

  const load = () => {
    setLoading(true)
    getAllBookings()
      .then((res) => setBookings(res.data.filter(b => b.status === 'verified')))
      .catch((err) => setError(err.response?.data?.message || 'Could not load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (bookingId) => {
    const weight = weights[bookingId]
    if (!weight) return
    try {
      await updateProcurement(bookingId, { status: 'weighed', quantity: Number(weight) })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit weight')
    }
  }

  return <AppShell role="officer">
    <div className="panel page-panel">
      <h2>⚖️ Weighing</h2>
      <p>Enter verified crop weight and submit the weighing record.</p>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && bookings.length === 0 && <p>No bookings ready for weighing.</p>}
      {bookings.map((b) => (
        <div key={b._id} style={{padding:'10px 0', borderBottom:'1px solid #eee'}}>
          <p>Token <b>{b.tokenNumber}</b> · {b.farmer?.name} · {b.cropType}</p>
          <input
            className="simple-input"
            placeholder="Weight in KG"
            value={weights[b._id] || ''}
            onChange={(e) => setWeights({ ...weights, [b._id]: e.target.value })}
          />
          <button className="action-btn" onClick={() => handleSubmit(b._id)} style={{marginLeft:10}}>Submit Weight</button>
        </div>
      ))}
    </div>
  </AppShell>
}

export function Procurement() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    getAllBookings()
      .then((res) => setBookings(res.data.filter(b => b.status === 'weighed')))
      .catch((err) => setError(err.response?.data?.message || 'Could not load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleConfirm = async (bookingId) => {
    try {
      await updateProcurement(bookingId, { status: 'procured' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not confirm procurement')
    }
  }

  return <AppShell role="officer">
    <div className="panel page-panel">
      <h2>📦 Procurement</h2>
      <p>Confirm procurement after verification and weighing.</p>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && bookings.length === 0 && <p>No bookings ready for procurement.</p>}
      {bookings.map((b) => (
        <div key={b._id} style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid #eee'}}>
          <div>Token <b>{b.tokenNumber}</b> · {b.farmer?.name} · {b.quantity}kg</div>
          <button className="action-btn" onClick={() => handleConfirm(b._id)}>Confirm Procurement</button>
        </div>
      ))}
    </div>
  </AppShell>
}

export function PaymentUpdate() {
  const [bookings, setBookings] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [amounts, setAmounts] = useState({})

  const load = () => {
    setLoading(true)
    getAllBookings()
      .then((res) => setBookings(res.data.filter(b => b.status === 'procured')))
      .catch((err) => setError(err.response?.data?.message || 'Could not load bookings'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleUpdate = async (bookingId, status) => {
    const amount = amounts[bookingId]
    if (!amount) return
    try {
      await createOrUpdatePayment({ bookingId, amount: Number(amount), status })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update payment')
    }
  }

  return <AppShell role="officer">
    <div className="panel page-panel">
      <h2>💰 Payment Update</h2>
      <p>Update the farmer's payment status after procurement.</p>
      {loading && <p>Loading…</p>}
      {error && <p style={{color:'red'}}>{error}</p>}
      {!loading && bookings.length === 0 && <p>No procured bookings pending payment.</p>}
      {bookings.map((b) => (
        <div key={b._id} style={{padding:'10px 0', borderBottom:'1px solid #eee'}}>
          <p>Token <b>{b.tokenNumber}</b> · {b.farmer?.name} · {b.quantity}kg</p>
          <input
            className="simple-input"
            placeholder="Amount ₹"
            value={amounts[b._id] || ''}
            onChange={(e) => setAmounts({ ...amounts, [b._id]: e.target.value })}
          />
          <button className="action-btn" onClick={() => handleUpdate(b._id, 'processing')} style={{marginLeft:10}}>Mark Processing</button>
          <button className="action-btn" onClick={() => handleUpdate(b._id, 'paid')} style={{marginLeft:10}}>Mark Paid</button>
        </div>
      ))}
    </div>
  </AppShell>
}