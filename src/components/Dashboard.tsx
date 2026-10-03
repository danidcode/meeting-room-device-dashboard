import { useState } from 'react'
import AddDeviceDialog from './AddDeviceDialog'
import DeviceTable from './DeviceTable'
import StatusChart from './StatusChart'
import Toast from './Toast'
import { useToast } from '../hooks/useToast'
import type { Device, NewDevice } from '../types'
import { statusColors, statusLabels, statuses } from '../constants/deviceStatus'
import { getInitialFleet } from '../utils/getInitialFleet'

export default function Dashboard() {
  const [devices, setDevices] = useState(getInitialFleet)
  const [showForm, setShowForm] = useState(false)
  const { notice, showToast, dismissToast } = useToast()
  const counts = { online: 0, inMeeting: 0, offline: 0, deactivated: 0 }
  for (const device of devices) counts[device.status]++

  function closeForm() {
    setShowForm(false)
  }

  function addDevice(device: NewDevice) {
    setDevices((current) => [{ ...device, id: crypto.randomUUID() }, ...current])
    showToast(`${device.name} added successfully.`)
    closeForm()
  }

  function removeDevice(device: Device) {
    setDevices((current) => current.filter((item) => item.id !== device.id))
    showToast(`${device.name} removed successfully.`)
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-navy bg-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-6 py-5">
          <span
            aria-hidden="true"
            className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-5"
            >
              <rect x="3" y="4" width="18" height="13" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </span>
          <span className="text-sm font-semibold">Meeting Room Device Dashboard</span>
        </div>
      </header>
      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-600">Workspace overview</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Every room. One view.</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Monitor device availability and manage your meeting-room fleet.
            </p>
          </div>
          <button
            type="button"
            className="button-primary self-start sm:self-auto"
            aria-haspopup="dialog"
            aria-controls="add-device-dialog"
            onClick={() => setShowForm(true)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="size-4"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add device
          </button>
        </div>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {(['total', ...statuses] as const).map((status) => (
            <div key={status} className="panel bg-slate-50 p-5">
              <dt className="flex items-center gap-2 text-sm text-slate-600">
                {status !== 'total' && (
                  <span
                    aria-hidden="true"
                    className={`size-2 rounded-full ${statusColors[status]}`}
                  />
                )}
                {status === 'total' ? 'Total devices' : statusLabels[status]}
              </dt>
              <dd className="mt-2 text-3xl font-semibold tabular-nums">
                {status === 'total' ? devices.length : counts[status]}
              </dd>
            </div>
          ))}
        </dl>
        {showForm && <AddDeviceDialog onAdd={addDevice} onClose={closeForm} />}
        <StatusChart />
        <DeviceTable devices={devices} onRemove={removeDevice} />
        <p className="pb-4 text-xs text-slate-500">
          Changes are kept for this session. Refreshing restores the sample devices.
        </p>
      </main>
      <Toast message={notice?.message} onDismiss={dismissToast} />
    </div>
  )
}
