import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import './styles/responsive.css'
import './styles/dashboard.css'
import './styles/farmer.css'

createRoot(document.getElementById('root')).render(
  <StrictMode><App /></StrictMode>
)
