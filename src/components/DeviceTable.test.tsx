import { useState } from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import type { Device } from '../types'
import DeviceTable from './DeviceTable'

const devices: Device[] = Array.from({ length: 26 }, (_, index) => ({
  id: String(index + 1),
  name: `Room ${index + 1}`,
  model: 'Room system',
  description: '',
  status: 'online',
}))

function DeviceTableExample() {
  const [items, setItems] = useState(devices)
  return (
    <DeviceTable
      devices={items}
      onRemove={(device) => {
        setItems((current) => current.filter((item) => item.id !== device.id))
      }}
    />
  )
}

describe('DeviceTable', () => {
  it('resets pagination when searching and recovers from an empty result', async () => {
    const user = userEvent.setup()
    render(<DeviceTableExample />)

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument()

    const search = screen.getByRole('searchbox', { name: 'Search devices by name' })
    await user.type(search, '  rOoM 1  ')
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument()
    expect(screen.getByText('Showing 1–11 of 11 devices')).toBeInTheDocument()
    expect(screen.getAllByRole('rowheader')).toHaveLength(11)
    expect(screen.queryByRole('rowheader', { name: 'Room 26' })).not.toBeInTheDocument()

    await user.clear(search)
    await user.type(search, 'Missing room')
    expect(screen.getByText('No matching devices')).toBeInTheDocument()
    expect(screen.getByText('Showing 0–0 of 0 devices')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()

    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(search).toHaveValue('')
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument()
    expect(screen.getAllByRole('rowheader')).toHaveLength(25)
  })

  it('returns to the previous page after removing the only device on the last page', async () => {
    const user = userEvent.setup()
    render(<DeviceTableExample />)

    await user.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getAllByRole('rowheader')).toHaveLength(1)
    const row = screen.getByRole('row', { name: /Room 26/ })
    await user.click(within(row).getByRole('button', { name: 'Remove Room 26' }))

    expect(screen.queryByRole('rowheader', { name: 'Room 26' })).not.toBeInTheDocument()
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument()
    expect(screen.getByText('Showing 1–25 of 25 devices')).toBeInTheDocument()
    expect(screen.getAllByRole('rowheader')).toHaveLength(25)
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  })
})
