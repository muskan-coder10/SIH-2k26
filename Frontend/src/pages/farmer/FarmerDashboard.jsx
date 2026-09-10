import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from './smart-kisan/components/Sidebar.jsx'
import Navbar from './smart-kisan/components/Navbar.jsx'
import Footer from './smart-kisan/components/Footer.jsx'
import Dashboard from './smart-kisan/pages/Dashboard.jsx'
import useAuth from '../../hooks/useAuth.js'

export default function FarmerDashboard(){
  const [sidebarOpen,setSidebarOpen]=useState(false)
  const [activeItem,setActiveItem]=useState('dashboard')
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleNavigate=(id)=>{
    setSidebarOpen(false)
    if (id === 'logout') {
      logout()
      navigate('/farmer/login')
      return
    }
    setActiveItem(id)
    document.getElementById(id)?.scrollIntoView({behavior:'smooth'})
  }

  return <div className="min-h-screen bg-kisan-cream">
    <Sidebar activeItem={activeItem} onNavigate={handleNavigate} isOpen={sidebarOpen} onClose={()=>setSidebarOpen(false)}/>
    <div className="lg:pl-[260px] flex flex-col min-h-screen">
      <Navbar onMenuClick={()=>setSidebarOpen(true)}/>
      <main className="flex-1"><Dashboard/></main>
      <Footer/>
    </div>
  </div>
}
