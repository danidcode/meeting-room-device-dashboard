import { useState } from 'react'
import type { Device } from '../types'

const pageSize = 25

export function useDeviceTable(devices: Device[], onRemove: (device: Device) => void) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = devices.filter((device) => device.name.toLowerCase().includes(normalizedQuery))
  const total = filtered.length
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const currentPage = Math.min(page, pages)
  const offset = (currentPage - 1) * pageSize
  const visibleDevices = filtered.slice(offset, offset + pageSize)

  function search(value: string) {
    setQuery(value)
    setPage(1)
  }

  function previousPage() {
    setPage(Math.max(1, currentPage - 1))
  }

  function nextPage() {
    setPage(Math.min(pages, currentPage + 1))
  }

  function removeDevice(device: Device) {
    // Keep the current page valid when its final matching device is removed.
    const remainingPages = Math.max(1, Math.ceil((total - 1) / pageSize))
    setPage(Math.min(currentPage, remainingPages))
    onRemove(device)
  }

  return {
    query,
    search,
    visibleDevices,
    total,
    rangeStart: total ? offset + 1 : 0,
    rangeEnd: Math.min(offset + pageSize, total),
    currentPage,
    pages,
    previousPage,
    nextPage,
    removeDevice,
  }
}
