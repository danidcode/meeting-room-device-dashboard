import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Dashboard from './Dashboard'

// Canvas rendering is unrelated to device management and toast behavior.
vi.mock('./StatusChart', () => ({ default: () => null }))

function summaryCount(label: string) {
  return screen.getByText(label, { selector: 'dt' }).nextElementSibling
}

describe('device management', () => {
  it('adds a device, updates counts, closes the dialog, and announces success', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)

    await user.click(screen.getByRole('button', { name: 'Add device' }))
    const dialog = screen.getByRole('dialog', { name: 'Add device' })
    await user.type(within(dialog).getByLabelText('Name'), '  New meeting room  ')
    await user.type(within(dialog).getByLabelText('Description'), 'Second floor')
    await user.selectOptions(within(dialog).getByLabelText('Status'), 'offline')
    await user.click(within(dialog).getByRole('button', { name: 'Save device' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('New meeting room added successfully.')
    const row = screen.getByRole('row', { name: /New meeting room/ })
    expect(within(row).getByText('Offline')).toBeInTheDocument()
    expect(summaryCount('Total devices')).toHaveTextContent('434')
    expect(summaryCount('Offline')).toHaveTextContent('86')
  })

  it('removes a device, updates counts, and announces success', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)

    await user.click(screen.getByRole('button', { name: 'Remove London - Boardroom 1' }))

    expect(screen.queryByRole('row', { name: /London - Boardroom 1\b/ })).not.toBeInTheDocument()
    expect(summaryCount('Total devices')).toHaveTextContent('432')
    expect(summaryCount('Online')).toHaveTextContent('179')
    expect(screen.getByRole('status')).toHaveTextContent(
      'London - Boardroom 1 removed successfully.',
    )
  })

  it('dismisses a confirmation without undoing the device change', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)
    await user.click(screen.getByRole('button', { name: 'Remove London - Boardroom 1' }))
    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }))

    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(screen.queryByRole('button', { name: 'Dismiss notification' })).not.toBeInTheDocument()
    expect(summaryCount('Total devices')).toHaveTextContent('432')
  })

  it('does not show success or change counts for an invalid or cancelled form', async () => {
    const user = userEvent.setup()
    render(<Dashboard />)
    await user.click(screen.getByRole('button', { name: 'Add device' }))
    await user.type(screen.getByLabelText('Name'), '   ')
    await user.click(screen.getByRole('button', { name: 'Save device' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Enter a device name.')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(summaryCount('Total devices')).toHaveTextContent('433')

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(summaryCount('Total devices')).toHaveTextContent('433')
  })
})
