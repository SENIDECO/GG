import React, { useState } from 'react'
import { useApp } from '../context/AppContext.jsx'
import { generateId } from '../utils/format.js'

const CURRENCIES = [
  { code: 'EUR', symbol: '€', label: 'Euro', locale: 'fr-FR' },
  { code: 'USD', symbol: '$', label: 'Dollar américain', locale: 'en-US' },
  { code: 'GBP', symbol: '£', label: 'Livre sterling', locale: 'en-GB' },
  { code: 'CHF', symbol: 'Fr', label: 'Franc suisse', locale: 'fr-CH' },
  { code: 'CAD', symbol: '$', label: 'Dollar canadien', locale: 'fr-CA' },
  { code: 'MAD', symbol: 'DH', label: 'Dirham marocain', locale: 'ar-MA' },
  { code: 'TND', symbol: 'DT', label: 'Dinar tunisien', locale: 'ar-TN' },
  { code: 'DZD', symbol: 'DA', label: 'Dinar algérien', locale: 'ar-DZ' },
  { code: 'XOF', symbol: 'CFA', label: 'Franc CFA', locale: 'fr-SN' },
]

const COLORS = ['#10b981','#3b82f6','#8b5cf6','#f59e0b','#ef4444','#f97316','#ec4899','#06b6d4','#2dd4bf','#a78bfa']

export default function Settings() {
  const { settings, updateSettings, categories, addCategory, deleteCategory } = useApp()
  const [catTab, setCatTab] = useState('expense')
  const [newCat, setNewCat] = useState({ name: '', icon: '📌', color: '#10b981' })
  const [confirmDel, setConfirmDel] = useState(null)
  const [saved, setSaved] = useState(false)

  function handleCurrencyChange(code) {
    const cur = CURRENCIES.find(c => c.code === code)
    if (cur) updateSettings({ currency: cur.code, currencySymbol: cur.symbol, locale: cur.locale })
    flash()
  }

  function flash() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleAddCat(e) {
    e.preventDefault()
    if (!newCat.name.trim()) return
    addCategory(catTab, { name: newCat.name.trim(), icon: newCat.icon, color: newCat.color })
    setNewCat({ name: '', icon: '📌', color: '#10b981' })
  }

  function handleDelete(type, id) {
    deleteCategory(type, id)
    setConfirmDel(null)
  }

  function clearAllData() {
    if (window.confirm('Voulez-vous vraiment supprimer TOUTES vos données ? Cette action est irréversible.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Paramètres</h1>
          <p className="page-subtitle">Personnalisez votre application</p>
        </div>
        {saved && <span className="save-badge">✓ Enregistré</span>}
      </div>

      {/* Currency */}
      <section className="settings-section">
        <h2>Devise</h2>
        <div className="settings-card">
          <select
            value={settings.currency}
            onChange={e => handleCurrencyChange(e.target.value)}
            className="settings-select"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.symbol} — {c.label} ({c.code})
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Categories */}
      <section className="settings-section">
        <h2>Catégories</h2>
        <div className="settings-card">
          <div className="filter-tabs">
            <button className={`filter-tab${catTab === 'expense' ? ' active' : ''}`} onClick={() => setCatTab('expense')}>
              Dépenses
            </button>
            <button className={`filter-tab${catTab === 'income' ? ' active' : ''}`} onClick={() => setCatTab('income')}>
              Revenus
            </button>
          </div>

          <ul className="cat-list">
            {categories[catTab].map(cat => (
              <li key={cat.id} className="cat-item">
                <span className="cat-preview" style={{ background: cat.color + '22', color: cat.color }}>
                  {cat.icon}
                </span>
                <span className="cat-item-name">{cat.name}</span>
                <button
                  className="btn-icon-sm danger"
                  onClick={() => setConfirmDel({ type: catTab, id: cat.id, name: cat.name })}
                  title="Supprimer"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>

          <form onSubmit={handleAddCat} className="add-cat-form">
            <h3>Ajouter une catégorie</h3>
            <div className="add-cat-row">
              <input
                type="text"
                placeholder="Icône (emoji)"
                value={newCat.icon}
                onChange={e => setNewCat(p => ({ ...p, icon: e.target.value }))}
                maxLength={4}
                className="input-emoji"
              />
              <input
                type="text"
                placeholder="Nom de la catégorie"
                value={newCat.name}
                onChange={e => setNewCat(p => ({ ...p, name: e.target.value }))}
                required
                className="input-name"
              />
              <div className="color-picker-row">
                {COLORS.map(c => (
                  <button
                    type="button"
                    key={c}
                    className={`color-dot${newCat.color === c ? ' selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => setNewCat(p => ({ ...p, color: c }))}
                    title={c}
                  />
                ))}
              </div>
              <button type="submit" className="btn btn-primary">Ajouter</button>
            </div>
          </form>
        </div>
      </section>

      {/* Danger zone */}
      <section className="settings-section">
        <h2 className="danger-title">Zone de danger</h2>
        <div className="settings-card danger-card">
          <p>Supprimer toutes les données (transactions, budgets, catégories, paramètres).</p>
          <button className="btn btn-danger" onClick={clearAllData}>
            Réinitialiser l'application
          </button>
        </div>
      </section>

      {/* Confirm delete category */}
      {confirmDel && (
        <div className="modal-overlay" onClick={() => setConfirmDel(null)}>
          <div className="modal modal-sm" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Supprimer « {confirmDel.name} » ?</h2>
            </div>
            <div className="modal-body">
              <p>Les transactions existantes utilisant cette catégorie ne seront pas supprimées.</p>
              <div className="modal-actions">
                <button className="btn btn-secondary" onClick={() => setConfirmDel(null)}>Annuler</button>
                <button className="btn btn-danger" onClick={() => handleDelete(confirmDel.type, confirmDel.id)}>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
