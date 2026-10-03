import { useEffect, useState } from 'react'

export function useToast() {
  const [notice, setNotice] = useState<{ message: string } | null>(null)

  useEffect(() => {
    if (!notice) return
    const timeout = window.setTimeout(() => setNotice(null), 4000)
    return () => window.clearTimeout(timeout)
  }, [notice])

  function showToast(message: string) {
    setNotice({ message })
  }

  function dismissToast() {
    setNotice(null)
  }

  return { notice, showToast, dismissToast }
}
