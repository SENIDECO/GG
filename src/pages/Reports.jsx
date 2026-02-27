import React, { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { formatCurrency, getYearMonth, formatMonth } from '../utils/format.js'

function DonutChart({ data, total }) {
  if (!data.length || total === 0) return <p className="empty-hint">Aucune donnée</p>

  const size = 200
  const r = 70
  const cx = size / 2
  const cy = size / 2
  let cumAngle = -Math.PI / 2

  const slices = data.map(d => {
    const angle = (d.value / total) * 2 * Math.PI
    const startAngle = cumAngle
    cumAngle += angle
    const endAngle = cumAngle

    const x1 = cx + r * Math.cos(startAngle)
    const y1 = cy + r * Math.sin(startAngle)
    const x2 = cx + r * Math.cos(endAngle)
    const y2 = cy + r * Math.sin(endAngle)
    const large = angle > Math.PI ? 1 : 0

    return {
      ...d,
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`,
    }
  })

  return (
    <div className="donut-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} className="donut-svg">
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} opacity="0.9">
            <title>{s.label}: {s.value.toFixed(2)} €</title>
          </path>
        ))}
        <circle cx={cx} cy={cy} r={r * 0.55} fill="var(--bg-card)" />
      </svg>
      <ul className="donut-legend">
        {data.map((d, i) => (
          <li key={i}>
            <span className="legend-dot" style={{ background: d.color }} />
            <span className="legend-label">{d.icon} {d.label}</span>
            <span className="legend-value">{((d.value / total) * 100).toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function MonthlyBarChart({ data, settings }) {
  if (!data.length) return <p className="empty-hint">Aucune donnée</p>

  const maxVal = Math.max(...data.flatMap(d => [d.income, d.expense]), 1)

  return (
    <div className="bar-chart">
      {data.map((d, i) => (
        <div key={i} className="bar-group">
          <div className="bar-col">
            <div
              className="bar income"
              style={{ height: `${(d.income / maxVal) * 140}px` }}
              title={`Revenus: ${formatCurrency(d.income, settings)}`}
            />
            <div
              className="bar expense"
              style={{ height: `${(d.expense / maxVal) * 140}px` }}
              title={`Dépenses: ${formatCurrency(d.expense, settings)}`}
            />
          </div>
          <span className="bar-label">{d.month}</span>
        </div>
      ))}
      <div className="bar-chart-legend">
        <span><span className="dot income" /> Revenus</span>
        <span><span className="dot expense" /> Dépenses</span>
      </div>
    </div>
  )
}

export default function Reports() {
  const { transactions, settings, categories, getCategoryById, selectedMonth } = useApp()
  const [tab, setTab] = useState('month') // month | year

  // Monthly expense breakdown
  const monthExpenses = useMemo(() => {
    const byCategory = {}
    transactions
      .filter(t => t.type === 'expense' && getYearMonth(t.date) === selectedMonth)
      .forEach(t => {
        byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + t.amount
      })
    const total = Object.values(byCategory).reduce((s, v) => s + v, 0)
    const data = Object.entries(byCategory)
      .map(([id, value]) => {
        const cat = getCategoryById(id)
        return { label: cat.name, icon: cat.icon, value, color: cat.color }
      })
      .sort((a, b) => b.value - a.value)
    return { data, total }
  }, [transactions, selectedMonth, getCategoryById])

  // Monthly income breakdown
  const monthIncomes = useMemo(() => {
    const byCategory = {}
    transactions
      .filter(t => t.type === 'income' && getYearMonth(t.date) === selectedMonth)
      .forEach(t => {
        byCategory[t.categoryId] = (byCategory[t.categoryId] || 0) + t.amount
      })
    const total = Object.values(byCategory).reduce((s, v) => s + v, 0)
    const data = Object.entries(byCategory)
      .map(([id, value]) => {
        const cat = getCategoryById(id)
        return { label: cat.name, icon: cat.icon, value, color: cat.color }
      })
      .sort((a, b) => b.value - a.value)
    return { data, total }
  }, [transactions, selectedMonth, getCategoryById])

  // Last 6 months evolution
  const evolution = useMemo(() => {
    const months = []
    const [y, m] = selectedMonth.split('-').map(Number)
    for (let i = 5; i >= 0; i--) {
      const d = new Date(y, m - 1 - i, 1)
      const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      const label = new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(d)
      const income = transactions
        .filter(t => t.type === 'income' && getYearMonth(t.date) === ym)
        .reduce((s, t) => s + t.amount, 0)
      const expense = transactions
        .filter(t => t.type === 'expense' && getYearMonth(t.date) === ym)
        .reduce((s, t) => s + t.amount, 0)
      months.push({ month: label, income, expense })
    }
    return months
  }, [transactions, selectedMonth])

  // Annual stats
  const year = selectedMonth.slice(0, 4)
  const annualIncome = transactions
    .filter(t => t.type === 'income' && t.date.startsWith(year))
    .reduce((s, t) => s + t.amount, 0)
  const annualExpense = transactions
    .filter(t => t.type === 'expense' && t.date.startsWith(year))
    .reduce((s, t) => s + t.amount, 0)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Rapports</h1>
          <p className="page-subtitle">Analysez vos habitudes financières</p>
        </div>
      </div>

      {/* Annual summary */}
      <div className="cards-grid cards-grid-3">
        <div className="card">
          <div className="card-icon">📅</div>
          <div className="card-content">
            <span className="card-label">Revenus annuels {year}</span>
            <span className="card-value income">{formatCurrency(annualIncome, settings)}</span>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">📉</div>
          <div className="card-content">
            <span className="card-label">Dépenses annuelles {year}</span>
            <span className="card-value expense">{formatCurrency(annualExpense, settings)}</span>
          </div>
        </div>
        <div className="card">
          <div className="card-icon">💎</div>
          <div className="card-content">
            <span className="card-label">Épargne annuelle {year}</span>
            <span className={`card-value ${annualIncome - annualExpense >= 0 ? 'income' : 'expense'}`}>
              {formatCurrency(annualIncome - annualExpense, settings)}
            </span>
          </div>
        </div>
      </div>

      {/* 6-month evolution */}
      <div className="widget">
        <h3>Évolution sur 6 mois</h3>
        <MonthlyBarChart data={evolution} settings={settings} />
      </div>

      {/* Donut charts */}
      <div className="reports-grid">
        <div className="widget">
          <h3>Répartition des dépenses</h3>
          <p className="widget-subtitle">{formatMonth(selectedMonth)}</p>
          <DonutChart data={monthExpenses.data} total={monthExpenses.total} />
        </div>
        <div className="widget">
          <h3>Répartition des revenus</h3>
          <p className="widget-subtitle">{formatMonth(selectedMonth)}</p>
          <DonutChart data={monthIncomes.data} total={monthIncomes.total} />
        </div>
      </div>
    </div>
  )
}
