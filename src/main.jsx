import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'
import 'leaflet/dist/leaflet.css'

window.history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
)
