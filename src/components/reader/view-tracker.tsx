"use client"

import { useEffect, useRef } from "react"

interface ViewTrackerProps {
  bookId: string
}

export function ViewTracker({ bookId }: ViewTrackerProps) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) {
      return
    }

    hasTracked.current = true

    fetch(`/api/books/${bookId}/views`, {
      method: "POST",
      keepalive: true,
    }).catch(() => {
      // View tracking is non-blocking for the reader experience.
    })
  }, [bookId])

  return null
}
