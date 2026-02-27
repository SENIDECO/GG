import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { formatCurrency, formatDate } from '../utils/format.js'
import MonthPicker from '../components/MonthPicker.jsx'
import TransactionModal from '../components/TransactionModal.jsx'

export default function Dashboard({ onNavigate }) {
  const {
    monthIncome, monthExpenses, monthBalance,
    monthTransactions, settings, getCategoryById,
    transactions,
  } = useApp()

  const [showModal, setShowModal] = useState(false)

  const savingsRate = monthIncome > 0
    ? Math.round((monthBalance / monthIncome) * 100)
    : 0

  const recentTransactions = monthTransactions.slice(0, 5)

  // Expense breakdown by category
  const expenseByCategory = {}
  monthTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      expenseByCategory[t.categoryId] = (expenseByCategory[t.categoryId] || 0) + t.amount
    })

  const sortedExpenses = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Tableau de bord</h1>
          <p className="page-subtitle">Vue d'ensemble de vos finances</p>
        </div>
        <div className="header-actions">
          <MonthPicker />
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Ajouter
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="cards-grid">
        <div className="card card-income">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <span className="card-label">Revenus</span>
            <span className="card-value income">{formatCurrency(monthIncome, settings)}</span>
          </div>
        </div>
        <div className="card card-expense">
          <div className="card-icon">💸</div>
          <div className="card-content">
            <span className="card-label">Dépenses</span>
            <span className="card-value expense">{formatCurrency(monthExpenses, settings)}</span>
          </div>
        </div>
        <div className={`card ${monthBalance >= 0 ? 'card-positive' : 'card-negative'}`}>
          <div className="card-icon">{monthBalance >= 0 ? '📈' : '📉'}</div>
          <div className="card-content">
            <span className="card-label">Solde</span>
            <span className={`card-value ${monthBalance >= 0 ? 'income' : 'expense'}`}>
              {formatCurrency(monthBalance, settings)}
            </span>
          </div>
        </div>
        <div className="card card-savings">
          <div className="card-icon">🏦</div>
          <div className="card-content">
            <span className="card-label">Taux d'épargne</span>
            <span className={`card-value ${savingsRate >= 0 ? 'income' : 'expense'}`}>
              {savingsRate}%
            </span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Progress bar income vs expenses */}
        <div className="widget">
          <h3>Revenus vs Dépenses</h3>
          {monthIncome === 0 && monthExpenses === 0 ? (
            <p className="empty-hint">Aucune transaction ce mois-ci</p>
          ) : (
            <div className="balance-bar-wrap">
              <div className="balance-bar">
                {monthIncome > 0 && (
                  <div
                    className="bar-income"
                    style={{ width: `${Math.min(100, (monthIncome / (monthIncome + monthExpenses)) * 100)}%` }}
                    title={`Revenus: ${formatCurrency(monthIncome, settings)}`}
                  />
                )}
                {monthExpenses > 0 && (
                  <div
                    className="bar-expense"
                    style={{ width: `${Math.min(100, (monthExpenses / (monthIncome + monthExpenses)) * 100)}%` }}
                    title={`Dépenses: ${formatCurrency(monthExpenses, settings)}`}
                  />
                )}
              </div>
              <div className="bar-legend">
                <span><span className="dot income" /> Revenus {formatCurrency(monthIncome, settings)}</span>
                <span><span className="dot expense" /> Dépenses {formatCurrency(monthExpenses, settings)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Top expenses */}
        <div className="widget">
          <h3>Top dépenses</h3>
          {sortedExpenses.length === 0 ? (
            <p className="empty-hint">Aucune dépense ce mois-ci</p>
          ) : (
            <ul className="top-expenses">
              {sortedExpenses.map(([catId, amount]) => {
                const cat = getCategoryById(catId)
                const pct = monthExpenses > 0 ? (amount / monthExpenses) * 100 : 0
                return (
                  <li key={catId}>
                    <div className="top-expense-header">
                      <span>{cat.icon} {cat.name}</span>
                      <span className="expense">{formatCurrency(amount, settings)}</span>
                    </div>
                    <div className="mini-bar">
                      <div
                        className="mini-bar-fill"
                        style={{ width: `${pct}%`, background: cat.color }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {/* Recent transactions */}
        <div className="widget widget-wide">
          <div className="widget-header">
            <h3>Transactions récentes</h3>
            <button className="btn-link" onClick={() => onNavigate('transactions')}>Voir tout →</button>
          </div>
          {recentTransactions.length === 0 ? (
            <div className="empty-state">
              <p>Aucune transaction ce mois-ci.</p>
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Ajouter votre première transaction
              </button>
            </div>
          ) : (
            <ul className="transaction-list">
              {recentTransactions.map(t => {
                const cat = getCategoryById(t.categoryId)
                return (
                  <li key={t.id} className="transaction-item">
                    <span className="tx-icon" style={{ background: cat.color + '22', color: cat.color }}>
                      {cat.icon}
                    </span>
                    <div className="tx-info">
                      <span className="tx-name">{t.description || cat.name}</span>
                      <span className="tx-date">{formatDate(t.date)} · {cat.name}</span>
                    </div>
                    <span className={`tx-amount ${t.type}`}>
                      {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, settings)}
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>

      {showModal && <TransactionModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
