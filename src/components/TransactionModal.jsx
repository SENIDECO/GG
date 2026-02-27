import React, { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext.jsx'

export default function TransactionModal({ transaction, onClose }) {
  const { addTransaction, updateTransaction, categories } = useApp()
  const isEdit = Boolean(transaction)

  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    categoryId: '',
    description: '',
  })

  useEffect(() => {
    if (transaction) {
      setForm({
        type: transaction.type,
        amount: String(transaction.amount),
        date: transaction.date,
        categoryId: transaction.categoryId,
        description: transaction.description,
      })
    }
  }, [transaction])

  const currentCats = categories[form.type] || []

  function set(field, value) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'type') next.categoryId = ''
      return next
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.amount || !form.date || !form.categoryId) return

    const cat = currentCats.find(c => c.id === form.categoryId)
    const payload = {
      type: form.type,
      amount: parseFloat(form.amount),
      date: form.date,
      categoryId: form.categoryId,
      categoryName: cat?.name || form.categoryId,
      description: form.description.trim(),
    }

    if (isEdit) {
      updateTransaction(transaction.id, payload)
    } else {
      addTransaction(payload)
    }
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{isEdit ? 'Modifier la transaction' : 'Nouvelle transaction'}</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-tabs">
            <button
              type="button"
              className={`tab-btn${form.type === 'expense' ? ' active expense' : ''}`}
              onClick={() => set('type', 'expense')}
            >
              Dépense
            </button>
            <button
              type="button"
              className={`tab-btn${form.type === 'income' ? ' active income' : ''}`}
              onClick={() => set('type', 'income')}
            >
              Revenu
            </button>
          </div>

          <div className="form-group">
            <label>Montant (€) *</label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="0,00"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              value={form.date}
              onChange={e => set('date', e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Catégorie *</label>
            <select
              value={form.categoryId}
              onChange={e => set('categoryId', e.target.value)}
              required
            >
              <option value="">-- Choisir --</option>
              {currentCats.map(c => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Ex: Courses Carrefour"
              maxLength={120}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Annuler</button>
            <button
              type="submit"
              className={`btn ${form.type === 'income' ? 'btn-income' : 'btn-expense'}`}
            >
              {isEdit ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
