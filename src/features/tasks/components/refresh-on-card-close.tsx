'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

// Closing the card dialog goes back to a page Next.js kept in memory, which
// can predate changes made in the dialog (a new comment, for example). This
// reloads that page's data whenever a card is left.
export function RefreshOnCardClose() {
  const pathname = usePathname()
  const router = useRouter()
  const previous = useRef(pathname)

  useEffect(() => {
    const wasOnCard = previous.current.includes('/tasks/')
    const isOnCard = pathname.includes('/tasks/')
    previous.current = pathname
    if (wasOnCard && !isOnCard) router.refresh()
  }, [pathname, router])

  return null
}
