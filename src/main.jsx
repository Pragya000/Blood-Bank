import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import RouterProviderMain from './providers/RouterProviderMain.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProviderMain />
  </React.StrictMode>,
)
