import { useState, type SubmitEvent } from 'react'
import type { NewDevice } from '../types'
import { statusLabels, statuses } from '../constants/deviceStatus'

interface Props {
  onAdd: (device: NewDevice) => void
  onCancel: () => void
}

export default function DeviceForm({ onAdd, onCancel }: Props) {
  const [error, setError] = useState('')

  function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const status = statuses.find((value) => value === data.get('status'))
    if (!name) {
      setError("Enter a device name.")
      event.currentTarget.querySelector<HTMLInputElement>('#device-name')?.focus()
      return
    }
    if (!status) return
    onAdd({ name, description: String(data.get('description') ?? '').trim(), status })
  }

  return (
    <section className="p-6" aria-labelledby="add-title">
      <h2 id="add-title" className="text-lg font-semibold">Add device</h2>
      <p className="mt-1 text-sm text-slate-500">Name is required. Description is optional.</p>
      <form onSubmit={submit} className="mt-5 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="device-name" className="field-label">Name</label>
          <input id="device-name" name="name" required autoFocus maxLength={120} placeholder="e.g. London — Boardroom"
            className="field" aria-invalid={Boolean(error)} aria-describedby={error ? 'name-error' : undefined}
            onChange={() => setError('')} />
          {error && <p id="name-error" role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
        </div>
        <div>
          <label htmlFor="device-status" className="field-label">Status</label>
          <select id="device-status" name="status" className="field" defaultValue="online">
            {statuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="device-description" className="field-label">Description</label>
          <textarea id="device-description" name="description" rows={2} maxLength={500} className="field resize-y" placeholder="Room location or useful details" />
        </div>
        <div className="flex gap-3 sm:col-span-2">
          <button className="button-primary" type="submit">Save device</button>
          <button className="button-secondary" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </section>
  )
}
