import React, { useState, useMemo } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { formatCurrency, formatDate, exportToCSV } from '../utils/format.js'
import MonthPicker from '../components/MonthPicker.jsx'
import TransactionModal from '../components/TransactionModal.jsx'

export default function Transactions() {
  const { monthTransactions, deleteTransaction, settings, getCategoryById } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [filter, setFilter] = useState('all') // all | income | expense
  const [search, setSearch] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = useMemo(() => {
    return monthTransactions
      .filter(t => filter === 'all' || t.type === filter)
      .filter(t => {
        if (!search) return true
        const q = search.toLowerCase()
        return (
          t.description?.toLowerCase().includes(q) ||
          t.categoryName?.toLowerCase().includes(q)
        )
      })
  }, [monthTransactions, filter, search])

  function handleEdit(tx) {
    setEditTarget(tx)
    setShowModal(true)
  }

  function handleDelete(id) {
    deleteTransaction(id)
    setConfirmDelete(null)
  }

  function handleCloseModal() {
    setShowModal(false)
    setEditTarget(null)
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p className="page-subtitle">Gérez vos revenus et dépenses</p>
        </div>
        <div className="header-actions">
          <MonthPicker />
          <button
            className="btn btn-secondary"
            onClick={() => exportToCSV(monthTransactions, settings)}
            title="Exporter en CSV"
          >
            ↓ Export CSV
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Ajouter
          </button>
        </div>
      </div>

      <div className="toolbar">
        <div className="filter-tabs">
          {[['all','Tout'], ['income','Revenus'], ['expense','Dépenses']].map(([val, label]) => (
            <button
              key={val}
              className={`filter-tab${filter === val ? ' active' : ''}`}
              onClick={() => setFilter(val)}
            >
              {label}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          type="text"
          placeholder="Rechercher…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <p>Aucune transaction trouvée.</p>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Ajouter une transaction
          </button>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Catégorie</th>
                <th>Description</th>
                <th>Montant</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const cat = getCategoryById(t.categoryId)
                return (
                  <tr key={t.id}>
                    <td className="td-date">{formatDate(t.date)}</td>
                    <td>
                      <span className="cat-badge" style={{ background: cat.color + '22', color: cat.color }}>
                        {cat.icon} {cat.name}
                      </span>
                    </td>
                    <td className="td-desc">{t.description || <span className="muted">—</span>}</td>
                    <td>
                      <span className={`tx-amount ${t.type}`}>
                        {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, settings)}
                      </span>
                    </td>
                    <td className="td-actions">
                      <button className="btn-icon-sm" onClick={() => handleEdit(t)} title="Modifier">✏️</button>
                      <button className="btn-icon-sm danger" onClick={() => setConfirmDelete(t.id)} title="Supprimer">🗑️</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <TransactionModal transaction={editTarget} onClose={handleCloseModal} />
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Supprimer la transaction ?</h2>
            </div>
            <div className="modal-body">
              <p>Cette action est irréversible.</p>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Annuler</button>
                <button className="btn btn-danger" onClick={() => handleDelete(confirmDelete)}>Supprimer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
