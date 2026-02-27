import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { formatCurrency } from '../utils/format.js'
import MonthPicker from '../components/MonthPicker.jsx'

export default function Budget() {
  const {
    categories, budgets, setBudget,
    monthTransactions, settings, selectedMonth,
    getCategoryById,
  } = useApp()

  const [editing, setEditing] = useState({}) // categoryId -> string value

  const monthBudgets = budgets[selectedMonth] || {}

  // Expense per category this month
  const spentByCategory = {}
  monthTransactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      spentByCategory[t.categoryId] = (spentByCategory[t.categoryId] || 0) + t.amount
    })

  function startEdit(catId, current) {
    setEditing(prev => ({ ...prev, [catId]: current != null ? String(current) : '' }))
  }

  function commitEdit(catId) {
    const val = editing[catId]
    const amount = parseFloat(val)
    if (!isNaN(amount) && amount >= 0) {
      setBudget(selectedMonth, catId, amount)
    }
    setEditing(prev => { const n = { ...prev }; delete n[catId]; return n })
  }

  const totalBudgeted = Object.values(monthBudgets).reduce((s, v) => s + (v || 0), 0)
  const totalSpent = Object.values(spentByCategory).reduce((s, v) => s + v, 0)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Budget</h1>
          <p className="page-subtitle">Définissez vos limites par catégorie</p>
        </div>
        <MonthPicker />
      </div>

      {/* Summary */}
      <div className="cards-grid cards-grid-3">
        <div className="card">
          <div className="card-icon">🎯</div>
          <div className="card-content">
            <span className="card-label">Budget total</span>
            <span className="card-value">{formatCurrency(totalBudgeted, settings)}</span>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">💸</div>
          <div className="card-content">
            <span className="card-label">Dépensé</span>
            <span className={`card-value ${totalSpent > totalBudgeted && totalBudgeted > 0 ? 'expense' : ''}`}>
              {formatCurrency(totalSpent, settings)}
            </span>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">💰</div>
          <div className="card-content">
            <span className="card-label">Restant</span>
            <span className={`card-value ${totalBudgeted - totalSpent < 0 ? 'expense' : 'income'}`}>
              {formatCurrency(Math.max(0, totalBudgeted - totalSpent), settings)}
            </span>
          </div>
        </div>
      </div>

      <div className="budget-grid">
        {categories.expense.map(cat => {
          const budget = monthBudgets[cat.id]
          const spent = spentByCategory[cat.id] || 0
          const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0
          const over = budget > 0 && spent > budget
          const isEditingThis = cat.id in editing

          return (
            <div key={cat.id} className={`budget-card ${over ? 'over-budget' : ''}`}>
              <div className="budget-card-header">
                <span className="budget-cat-icon">{cat.icon}</span>
                <span className="budget-cat-name">{cat.name}</span>
                {over && <span className="badge-over">Dépassé</span>}
              </div>

              <div className="budget-amounts">
                <span className={`spent ${over ? 'expense' : ''}`}>
                  {formatCurrency(spent, settings)}
                </span>
                <span className="separator">/</span>
                {isEditingThis ? (
                  <input
                    className="budget-input"
                    type="number"
                    min="0"
                    step="1"
                    autoFocus
                    value={editing[cat.id]}
                    onChange={e => setEditing(prev => ({ ...prev, [cat.id]: e.target.value }))}
                    onBlur={() => commitEdit(cat.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitEdit(cat.id)
                      if (e.key === 'Escape') setEditing(prev => { const n = { ...prev }; delete n[cat.id]; return n })
                    }}
                  />
                ) : (
                  <button
                    className="budget-limit-btn"
                    onClick={() => startEdit(cat.id, budget)}
                    title="Cliquez pour définir le budget"
                  >
                    {budget != null ? formatCurrency(budget, settings) : 'Définir…'}
                  </button>
                )}
              </div>

              {budget > 0 && (
                <div className="budget-progress">
                  <div
                    className={`budget-bar ${over ? 'over' : pct > 80 ? 'warning' : 'ok'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              )}

              {budget > 0 && (
                <div className="budget-remaining">
                  {over
                    ? <span className="expense">Dépassement de {formatCurrency(spent - budget, settings)}</span>
                    : <span className="income">Reste {formatCurrency(budget - spent, settings)}</span>
                  }
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
