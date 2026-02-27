import React from 'react'
import { formatMonth } from '../utils/format.js'
import { useApp } from '../context/AppContext.jsx'

export default function MonthPicker() {
  const { selectedMonth, setSelectedMonth } = useApp()

  function prev() {
    const [y, m] = selectedMonth.split('-').map(Number)
    const d = new Date(y, m - 2, 1)
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  function next() {
    const [y, m] = selectedMonth.split('-').map(Number)
    const d = new Date(y, m, 1)
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
  }

  return (
    <div className="month-picker">
      <button className="btn-icon" onClick={prev} title="Mois précédent">‹</button>
      <span className="month-label">{formatMonth(selectedMonth)}</span>
      <button className="btn-icon" onClick={next} title="Mois suivant">›</button>
    </div>
  )
}
