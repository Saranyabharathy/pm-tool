const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' })
const shortDateFormat = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', timeZone: 'UTC' })
const dateTimeFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeStyle: 'short' })

// For calendar dates stored as 'YYYY-MM-DD'.
export function formatDate(value: string) {
  return dateFormat.format(new Date(`${value}T00:00:00Z`))
}

// Compact form for cards: '12 Oct', with the year only when it is not this year.
export function formatShortDate(value: string, today: string) {
  if (value.slice(0, 4) !== today.slice(0, 4)) return formatDate(value)
  return shortDateFormat.format(new Date(`${value}T00:00:00Z`))
}

export function formatDateTime(value: Date) {
  return dateTimeFormat.format(value)
}

export function todayIso() {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}
