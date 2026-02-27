import React, { createContext, useContext, useState, useCallback } from 'react'
import {
  loadTransactions, saveTransactions,
  loadBudgets, saveBudgets,
  loadCategories, saveCategories,
  loadSettings, saveSettings,
} from '../utils/storage.js'
import { generateId, currentYearMonth, getYearMonth } from '../utils/format.js'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(() => loadTransactions())
  const [budgets, setBudgets] = useState(() => loadBudgets())
  const [categories, setCategories] = useState(() => loadCategories())
  const [settings, setSettings] = useState(() => loadSettings())
  const [selectedMonth, setSelectedMonth] = useState(currentYearMonth)

  // ---- Transactions ----
  const addTransaction = useCallback((data) => {
    const tx = { ...data, id: generateId(), createdAt: new Date().toISOString() }
    setTransactions(prev => {
      const next = [tx, ...prev]
      saveTransactions(next)
      return next
    })
  }, [])

  const updateTransaction = useCallback((id, data) => {
    setTransactions(prev => {
      const next = prev.map(t => t.id === id ? { ...t, ...data } : t)
      saveTransactions(next)
      return next
    })
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => {
      const next = prev.filter(t => t.id !== id)
      saveTransactions(next)
      return next
    })
  }, [])

  // ---- Budgets ----
  const setBudget = useCallback((month, categoryId, amount) => {
    setBudgets(prev => {
      const next = {
        ...prev,
        [month]: { ...prev[month], [categoryId]: amount },
      }
      saveBudgets(next)
      return next
    })
  }, [])

  // ---- Categories ----
  const addCategory = useCallback((type, category) => {
    setCategories(prev => {
      const next = {
        ...prev,
        [type]: [...prev[type], { ...category, id: generateId() }],
      }
      saveCategories(next)
      return next
    })
  }, [])

  const deleteCategory = useCallback((type, id) => {
    setCategories(prev => {
      const next = { ...prev, [type]: prev[type].filter(c => c.id !== id) }
      saveCategories(next)
      return next
    })
  }, [])

  // ---- Settings ----
  const updateSettings = useCallback((data) => {
    setSettings(prev => {
      const next = { ...prev, ...data }
      saveSettings(next)
      return next
    })
  }, [])

  // ---- Derived data ----
  const monthTransactions = transactions.filter(
    t => getYearMonth(t.date) === selectedMonth
  )

  const monthIncome = monthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const monthExpenses = monthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const monthBalance = monthIncome - monthExpenses

  const allCategories = [...categories.income, ...categories.expense]

  function getCategoryById(id) {
    return allCategories.find(c => c.id === id) || { name: id, icon: '❓', color: '#94a3b8' }
  }

  return (
    <AppContext.Provider value={{
      transactions, monthTransactions,
      budgets, categories, settings,
      selectedMonth, setSelectedMonth,
      monthIncome, monthExpenses, monthBalance,
      addTransaction, updateTransaction, deleteTransaction,
      setBudget,
      addCategory, deleteCategory,
      updateSettings,
      getCategoryById,
      allCategories,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
