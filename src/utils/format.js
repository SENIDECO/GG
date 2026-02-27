export function formatCurrency(amount, settings) {
  return new Intl.NumberFormat(settings.locale, {
    style: 'currency',
    currency: settings.currency,
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(dateStr) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateStr))
}

export function formatMonth(yearMonth) {
  const [year, month] = yearMonth.split('-')
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
    .format(new Date(Number(year), Number(month) - 1, 1))
}

export function getYearMonth(dateStr) {
  return dateStr.slice(0, 7) // "YYYY-MM"
}

export function currentYearMonth() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}`
}

export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function exportToCSV(transactions, settings) {
  const headers = ['Date', 'Type', 'Catégorie', 'Description', 'Montant']
  const rows = transactions.map(t => [
    t.date,
    t.type === 'income' ? 'Revenu' : 'Dépense',
    t.categoryName,
    `"${t.description.replace(/"/g, '""')}"`,
    t.type === 'income' ? t.amount : -t.amount,
  ])
  const csv = [headers, ...rows].map(r => r.join(';')).join('\n')
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `financemaster_export_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
