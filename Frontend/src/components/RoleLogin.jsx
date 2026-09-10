import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, LockKeyhole, Phone, ShieldCheck, User } from 'lucide-react'
import { loginFarmer, loginOfficer, loginAdmin, registerFarmer, registerOfficer, registerAdmin } from '../services/authService'
import useAuth from '../hooks/useAuth'

const data = {
 farmer: {title:'Farmer Login',sub:'किसान लॉगिन',desc:'Login to view your token, schedule, crop status and payment.',path:'/farmer/dashboard'},
 officer: {title:'Procurement Officer Login',sub:'अधिकारी लॉगिन',desc:'Manage verification, weighing, procurement and payment updates.',path:'/officer/dashboard'},
 admin: {title:'Admin Login',sub:'एडमिन लॉगिन',desc:'Manage farmers, centres, tokens, schedules and reports.',path:'/admin/dashboard'}
}

export default function RoleLogin({role}) {
 const d=data[role], nav=useNavigate(), [loading,setLoading]=useState(false)
 const [mode,setMode]=useState('login') // 'login' | 'register'
 const [error,setError]=useState('')
 const { login } = useAuth()

 // shared
 const [password,setPassword]=useState('')
 // farmer register fields
 const [name,setName]=useState('')
 const [phone,setPhone]=useState('')
 const [email,setEmail]=useState('')
 const [village,setVillage]=useState('')
 const [district,setDistrict]=useState('')
 // officer register fields
 const [centreName,setCentreName]=useState('')
 const [centreLocation,setCentreLocation]=useState('')
 // login identifier (phone for farmer, email for officer/admin)
 const [identifier,setIdentifier]=useState('')

 const submit=async(e)=>{
   e.preventDefault()
   setError('')
   setLoading(true)
   try {
     let res
     if (mode === 'login') {
       if (role === 'farmer') res = await loginFarmer({ phone: identifier, password })
       else if (role === 'officer') res = await loginOfficer({ email: identifier, password })
       else if (role === 'admin') res = await loginAdmin({ email: identifier, password })
     } else {
       if (role === 'farmer') {
         res = await registerFarmer({ name, phone, email, password, village, district })
       } else if (role === 'officer') {
         res = await registerOfficer({ name, email, password, centreName, centreLocation })
       } else if (role === 'admin') {
         res = await registerAdmin({ name, email, password })
       }
     }
     login(res.data)
     nav(d.path)
   } catch (err) {
     setError(err.response?.data?.message || `${mode === 'login' ? 'Login' : 'Registration'} failed`)
   } finally {
     setLoading(false)
   }
 }

 return <div className="login-page">
   <div className="login-card">
    <Link to="/" className="login-back"><ArrowLeft size={18}/> Back to ANNDISHA</Link>
    <img src="/images/anndisha-logo.png" className="login-logo" alt="ANNDISHA"/>
    <div className="login-role">{d.sub}</div>
    <h1>{mode === 'login' ? d.title : `${role.charAt(0).toUpperCase() + role.slice(1)} Registration`}</h1>
    <p>{d.desc}</p>

    <form onSubmit={submit}>
      {mode === 'register' && <>
        <label>Full Name</label>
        <div className="input-wrap"><User size={18}/><input required placeholder="Enter your name" value={name} onChange={(e)=>setName(e.target.value)}/></div>

        {role === 'farmer' && <>
          <label>Mobile Number</label>
          <div className="input-wrap"><Phone size={18}/><input required placeholder="Enter mobile number" value={phone} onChange={(e)=>setPhone(e.target.value)}/></div>
          <label>Email (optional)</label>
          <div className="input-wrap"><input placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)}/></div>
          <label>Village</label>
          <div className="input-wrap"><input placeholder="Enter village" value={village} onChange={(e)=>setVillage(e.target.value)}/></div>
          <label>District</label>
          <div className="input-wrap"><input placeholder="Enter district" value={district} onChange={(e)=>setDistrict(e.target.value)}/></div>
        </>}

        {role === 'officer' && <>
          <label>Email</label>
          <div className="input-wrap"><input required type="email" placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)}/></div>
          <label>Centre Name</label>
          <div className="input-wrap"><input placeholder="Assigned centre name" value={centreName} onChange={(e)=>setCentreName(e.target.value)}/></div>
          <label>Centre Location</label>
          <div className="input-wrap"><input placeholder="Centre location" value={centreLocation} onChange={(e)=>setCentreLocation(e.target.value)}/></div>
        </>}

        {role === 'admin' && <>
          <label>Email</label>
          <div className="input-wrap"><input required type="email" placeholder="Enter email" value={email} onChange={(e)=>setEmail(e.target.value)}/></div>
        </>}
      </>}

      {mode === 'login' && <>
        <label>{role === 'farmer' ? 'Mobile Number' : 'Email'}</label>
        <div className="input-wrap"><Phone size={18}/><input required placeholder={role === 'farmer' ? 'Enter mobile number' : 'Enter email'} value={identifier} onChange={(e)=>setIdentifier(e.target.value)}/></div>
      </>}

      <label>Password</label>
      <div className="input-wrap"><LockKeyhole size={18}/><input required type="password" placeholder="Enter password" value={password} onChange={(e)=>setPassword(e.target.value)}/></div>

      {error && <div style={{color:'red', fontSize:13, marginBottom:10}}>{error}</div>}
      <button className="login-submit" disabled={loading}>{loading ? 'Please wait…' : (mode === 'login' ? 'Continue →' : 'Register →')}</button>
    </form>

    <p style={{marginTop:14, fontSize:14, textAlign:'center'}}>
      {mode === 'login' ? (
        <>New here? <button type="button" onClick={()=>setMode('register')} style={{background:'none',border:'none',color:'#2563eb',cursor:'pointer',textDecoration:'underline'}}>Register</button></>
      ) : (
        <>Already registered? <button type="button" onClick={()=>setMode('login')} style={{background:'none',border:'none',color:'#2563eb',cursor:'pointer',textDecoration:'underline'}}>Login</button></>
      )}
    </p>

    <div className="login-note"><ShieldCheck size={16}/> Secure {mode} connected to ANNDISHA backend.</div>
   </div>
 </div>
}