import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'; // Importando Bootstrap CSS
import './index.css'
import MenuPlayer from './MenuPlayer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MenuPlayer/>
  </StrictMode>,
)
