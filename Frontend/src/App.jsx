import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import FarmerLogin from './pages/farmer/FarmerLogin.jsx'
import FarmerDashboard from './pages/farmer/FarmerDashboard.jsx'
import {Token,Schedule,Centre,CropStatus,Payment} from './pages/farmer/BasicFarmerPages.jsx'
import FarmerComplaints from './pages/farmer/FarmerComplaints.jsx'
import OfficerLogin from './pages/officer/OfficerLogin.jsx'
import OfficerDashboard from './pages/officer/OfficerDashboard.jsx'
import {
  Farmers as OfficerFarmers,
  Procurement as OfficerProcurement,
  LiveQueue as OfficerLiveQueue,
  Notifications as OfficerNotifications,
  Reports as OfficerReports,
  Settings as OfficerSettings,
} from './pages/officer/OfficerPages.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import {
  Farmers as AdminFarmers,
  Centres,
  Reports as AdminReports,
  FarmerApplications,
  EligibleFarmers,
  TokenManagement,
  AdminProcurement,
  AdminPayments,
  Complaints,
  Settings as AdminSettings,
} from './pages/admin/BasicAdminPages.jsx'
import { LanguageProvider } from './pages/farmer/smart-kisan/i18n/LanguageContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

export default function App(){
 return <AuthProvider><LanguageProvider><BrowserRouter><Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/farmer/login" element={<FarmerLogin/>}/>
  <Route path="/farmer/dashboard" element={<FarmerDashboard/>}/>
  <Route path="/farmer/token" element={<Token/>}/>
  <Route path="/farmer/schedule" element={<Schedule/>}/>
  <Route path="/farmer/centre" element={<Centre/>}/>
  <Route path="/farmer/crop-status" element={<CropStatus/>}/>
  <Route path="/farmer/payment" element={<Payment/>}/>
  <Route path="/farmer/complaints" element={<FarmerComplaints/>}/>
  <Route path="/officer/login" element={<OfficerLogin/>}/>
  <Route path="/officer/dashboard" element={<OfficerDashboard/>}/>
  <Route path="/officer/farmers" element={<OfficerFarmers/>}/>
  <Route path="/officer/procurement" element={<OfficerProcurement/>}/>
  <Route path="/officer/live-queue" element={<OfficerLiveQueue/>}/>
  <Route path="/officer/notifications" element={<OfficerNotifications/>}/>
  <Route path="/officer/reports" element={<OfficerReports/>}/>
  <Route path="/officer/settings" element={<OfficerSettings/>}/>
  <Route path="/admin/login" element={<AdminLogin/>}/>
  <Route path="/admin/dashboard" element={<AdminDashboard/>}/>
  <Route path="/admin/farmers" element={<AdminFarmers/>}/>
  <Route path="/admin/centres" element={<Centres/>}/>
  <Route path="/admin/reports" element={<AdminReports/>}/>
  <Route path="/admin/farmer-applications" element={<FarmerApplications/>}/>
  <Route path="/admin/eligible-farmers" element={<EligibleFarmers/>}/>
  <Route path="/admin/token-management" element={<TokenManagement/>}/>
  <Route path="/admin/procurement" element={<AdminProcurement/>}/>
  <Route path="/admin/payments" element={<AdminPayments/>}/>
  <Route path="/admin/complaints" element={<Complaints/>}/>
  <Route path="/admin/settings" element={<AdminSettings/>}/>
 </Routes></BrowserRouter></LanguageProvider></AuthProvider>
}