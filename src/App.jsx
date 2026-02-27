import React, { useState } from 'react'
import { AppProvider } from './context/AppContext.jsx'
import Navbar from './components/Navbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Transactions from './pages/Transactions.jsx'
import Budget from './pages/Budget.jsx'
import Reports from './pages/Reports.jsx'
import Settings from './pages/Settings.jsx'

const PAGES = {
  dashboard: Dashboard,
  transactions: Transactions,
  budget: Budget,
  reports: Reports,
  settings: Settings,
}

function AppInner() {
  const [page, setPage] = useState('dashboard')
  const PageComponent = PAGES[page] || Dashboard

  return (
    <div className="app-layout">
      <Navbar currentPage={page} onNavigate={setPage} />
      <main className="app-main">
        <PageComponent onNavigate={setPage} />
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  )
}
