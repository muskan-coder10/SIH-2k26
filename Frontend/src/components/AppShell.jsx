import { Link, useNavigate, useLocation } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import {
  Home, Ticket, CalendarDays, MapPin, Wheat, WalletCards,
  Users, Building2, BarChart3, ClipboardCheck, Scale, PackageCheck,
  LogOut, FileText, UserCheck, AlertTriangle, Settings as SettingsIcon
} from 'lucide-react'

const roleConfig = {
  farmer: {
    title: 'Farmer Portal',
    links: [
      ['Dashboard', '/farmer/dashboard', Home],
      ['My Token', '/farmer/token', Ticket],
      ['My Schedule', '/farmer/schedule', CalendarDays],
      ['Find Centre', '/farmer/centre', MapPin],
      ['Crop Status', '/farmer/crop-status', Wheat],
      ['Payment', '/farmer/payment', WalletCards],
      ['Complaints', '/farmer/complaints', AlertTriangle],
    ]
  },
  officer: {
    title: 'Procurement Officer',
    links: [
      ['Dashboard', '/officer/dashboard', Home],
      ['Farmers', '/officer/farmers', Users],
      ['Procurement', '/officer/procurement', PackageCheck],
      ['Live Queue', '/officer/live-queue', ClipboardCheck],
      ['Notifications', '/officer/notifications', AlertTriangle],
      ['Reports', '/officer/reports', BarChart3],
      ['Settings', '/officer/settings', SettingsIcon],
    ]
  },
  admin: {
    title: 'Admin Portal',
    links: [
      ['Dashboard', '/admin/dashboard', Home],
      ['Farmer Applications', '/admin/farmer-applications', FileText],
      ['Farmer Verification', '/admin/farmers', ClipboardCheck],
      ['Eligible Farmers', '/admin/eligible-farmers', UserCheck],
      ['Procurement Centres', '/admin/centres', Building2],
      ['Token Management', '/admin/token-management', Ticket],
      ['Procurement', '/admin/procurement', PackageCheck],
      ['Payments', '/admin/payments', WalletCards],
      ['Reports', '/admin/reports', BarChart3],
      ['Complaints', '/admin/complaints', AlertTriangle],
      ['Settings', '/admin/settings', SettingsIcon],
    ]
  }
}

const todayLabel = () =>
  new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export default function AppShell({ role = 'farmer', children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const config = roleConfig[role]

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // ---------- ADMIN: distinct sidebar + topbar ----------
  if (role === 'admin') {
    return (
      <div className="app-shell admin-shell">
        <aside className="side-nav admin-side-nav">
          <Link to="/" className="side-logo">
            <img src="/images/anndisha-logo.png" alt="ANNDISHA" />
          </Link>
          <div className="admin-brand">
            <span className="admin-brand-title">ANNDISHA</span>
            <span className="admin-brand-sub">Admin Portal</span>
          </div>
          <nav className="admin-nav">
            {config.links.map(([label, path, Icon]) => (
              <Link
                key={path}
                to={path}
                className={location.pathname === path ? 'active' : ''}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="dashboard-main admin-main">
          <div className="admin-topbar">
            <div className="admin-topbar-left">{location.pathname.split('/').pop().replace(/-/g, ' ')}</div>
            <div className="admin-topbar-right">
              <span className="admin-date">{todayLabel()}</span>
              <span className="admin-name">{user?.name || 'Admin'}</span>
              <span className="admin-role-badge">Admin</span>
              <span className="admin-id-badge">{user?.adminId || '—'}</span>
              <button className="admin-signout-btn" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </div>
          {children}
        </main>
      </div>
    )
  }

  // ---------- OFFICER: distinct sidebar + topbar (matches Admin styling) ----------
  if (role === 'officer') {
    return (
      <div className="app-shell officer-shell">
        <aside className="side-nav officer-side-nav">
          <Link to="/" className="side-logo">
            <img src="/images/anndisha-logo.png" alt="ANNDISHA" />
          </Link>
          <div className="officer-brand">
            <span className="officer-brand-title">ANNDISHA</span>
            <span className="officer-brand-sub">Officer Portal</span>
          </div>
          <nav className="officer-nav">
            {config.links.map(([label, path, Icon]) => (
              <Link
                key={path}
                to={path}
                className={location.pathname === path ? 'active' : ''}
              >
                <Icon size={18} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
        </aside>

        <main className="dashboard-main officer-main">
          <div className="officer-topbar">
            <div className="officer-topbar-left">{location.pathname.split('/').pop().replace(/-/g, ' ')}</div>
            <div className="officer-topbar-right">
              <span className="officer-date">{todayLabel()}</span>
              <span className="officer-name">{user?.name || 'Officer'}</span>
              <span className="officer-role-badge">Officer</span>
              <button className="officer-signout-btn" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </div>
          {children}
        </main>
      </div>
    )
  }

  // ---------- FARMER: original layout, unchanged ----------
  return (
    <div className="app-shell">
      <aside className="side-nav">
        <Link to="/" className="side-logo"><img src="/images/anndisha-logo.png" alt="ANNDISHA" /></Link>
        <div className="side-title">{config.title}</div>
        <nav>
          {config.links.map(([label, path, Icon]) => (
            <Link key={path} to={path}><Icon size={19} /><span>{label}</span></Link>
          ))}
        </nav>
        <button className="logout-btn" onClick={() => navigate('/')}><LogOut size={18} /> Logout</button>
      </aside>
      <main className="dashboard-main">
        <div className="dash-topbar">
          <div><span className="dash-kicker">ANNDISHA</span><h1>{config.title}</h1></div>
          <Link className="back-home" to="/">← Home</Link>
        </div>
        {children}
      </main>
    </div>
  )
}