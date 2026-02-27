const KEYS = {
  TRANSACTIONS: 'fm_transactions',
  BUDGETS: 'fm_budgets',
  CATEGORIES: 'fm_categories',
  SETTINGS: 'fm_settings',
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export const DEFAULT_CATEGORIES = {
  income: [
    { id: 'salary', name: 'Salaire', icon: '💼', color: '#10b981' },
    { id: 'freelance', name: 'Freelance', icon: '💻', color: '#3b82f6' },
    { id: 'investment', name: 'Investissements', icon: '📈', color: '#8b5cf6' },
    { id: 'other_income', name: 'Autres revenus', icon: '💰', color: '#f59e0b' },
  ],
  expense: [
    { id: 'housing', name: 'Logement', icon: '🏠', color: '#ef4444' },
    { id: 'food', name: 'Alimentation', icon: '🛒', color: '#f97316' },
    { id: 'transport', name: 'Transport', icon: '🚗', color: '#eab308' },
    { id: 'health', name: 'Santé', icon: '🏥', color: '#ec4899' },
    { id: 'entertainment', name: 'Loisirs', icon: '🎮', color: '#06b6d4' },
    { id: 'clothing', name: 'Vêtements', icon: '👕', color: '#a78bfa' },
    { id: 'education', name: 'Éducation', icon: '📚', color: '#2dd4bf' },
    { id: 'savings', name: 'Épargne', icon: '🏦', color: '#34d399' },
    { id: 'utilities', name: 'Factures', icon: '⚡', color: '#fb923c' },
    { id: 'other_expense', name: 'Autres dépenses', icon: '📦', color: '#94a3b8' },
  ],
}

export const DEFAULT_SETTINGS = {
  currency: 'EUR',
  currencySymbol: '€',
  locale: 'fr-FR',
}

export function loadTransactions() {
  return load(KEYS.TRANSACTIONS, [])
}

export function saveTransactions(transactions) {
  save(KEYS.TRANSACTIONS, transactions)
}

export function loadBudgets() {
  return load(KEYS.BUDGETS, {})
}

export function saveBudgets(budgets) {
  save(KEYS.BUDGETS, budgets)
}

export function loadCategories() {
  return load(KEYS.CATEGORIES, DEFAULT_CATEGORIES)
}

export function saveCategories(categories) {
  save(KEYS.CATEGORIES, categories)
}

export function loadSettings() {
  return load(KEYS.SETTINGS, DEFAULT_SETTINGS)
}

export function saveSettings(settings) {
  save(KEYS.SETTINGS, settings)
}
