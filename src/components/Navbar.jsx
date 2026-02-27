import React from 'react'

const PAGES = [
  { id: 'dashboard', label: 'Tableau de bord', icon: '📊' },
  { id: 'transactions', label: 'Transactions', icon: '💳' },
  { id: 'budget', label: 'Budget', icon: '🎯' },
  { id: 'reports', label: 'Rapports', icon: '📈' },
  { id: 'settings', label: 'Paramètres', icon: '⚙️' },
]

export default function Navbar({ currentPage, onNavigate }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">€</span>
        <span className="navbar-title">FinanceMaster</span>
      </div>
      <ul className="navbar-menu">
        {PAGES.map(p => (
          <li key={p.id}>
            <button
              className={`nav-link${currentPage === p.id ? ' active' : ''}`}
              onClick={() => onNavigate(p.id)}
            >
              <span className="nav-icon">{p.icon}</span>
              <span className="nav-label">{p.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
