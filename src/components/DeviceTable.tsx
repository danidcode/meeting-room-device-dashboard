import { useDeviceTable } from '../hooks/useDeviceTable'
import type { Device } from '../types'
import { badgeStyles, statusLabels } from '../constants/deviceStatus'

interface Props {
  devices: Device[]
  onRemove: (device: Device) => void
}

export default function DeviceTable({ devices, onRemove }: Props) {
  const {
    query,
    search,
    visibleDevices,
    total,
    rangeStart,
    rangeEnd,
    currentPage,
    pages,
    previousPage,
    nextPage,
    removeDevice,
  } = useDeviceTable(devices, onRemove)

  return (
    <section className="panel overflow-hidden" aria-labelledby="devices-title">
      <div className="flex flex-col gap-4 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
        <h2 id="devices-title" className="text-lg font-semibold">
          Devices <span className="ml-2 text-sm font-normal text-slate-500">{devices.length}</span>
        </h2>
        <div className="w-full sm:max-w-xs">
          <label htmlFor="device-search" className="sr-only">
            Search devices by name
          </label>
          <input
            id="device-search"
            type="search"
            className="field"
            placeholder="Search by name…"
            value={query}
            onChange={(event) => search(event.target.value)}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Devices</caption>
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              {['Name', 'Model', 'Status', 'Actions'].map((label) => (
                <th key={label} scope="col" className="px-6 py-3 font-medium">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visibleDevices.map((device) => (
              <tr key={device.id} className="hover:bg-slate-50/70">
                <th scope="row" className="min-w-56 max-w-md px-6 py-4 font-medium">
                  <span className="block break-words">{device.name}</span>
                  {device.description && (
                    <span className="mt-1 block break-words text-xs font-normal text-slate-500">
                      {device.description}
                    </span>
                  )}
                </th>
                <td className="px-6 py-4 text-slate-600">{device.model || 'Not specified'}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${badgeStyles[device.status]}`}
                  >
                    {statusLabels[device.status]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    className="rounded px-2 py-1 text-sm font-medium text-red-700 hover:bg-red-50"
                    aria-label={`Remove ${device.name}`}
                    onClick={() => removeDevice(device)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {visibleDevices.length === 0 && (
        <div className="px-6 py-14 text-center">
          <h3 className="font-medium">
            {devices.length ? 'No matching devices' : 'No devices yet'}
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            {devices.length
              ? 'Try another name or clear your search.'
              : 'Add a device to start building your fleet.'}
          </p>
          {query && (
            <button type="button" className="button-secondary mt-4" onClick={() => search('')}>
              Clear search
            </button>
          )}
        </div>
      )}
      <div className="flex flex-col gap-4 border-t border-slate-200 px-6 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p
          className="text-slate-500"
          aria-live="polite"
        >{`Showing ${rangeStart}–${rangeEnd} of ${total} devices`}</p>
        <nav aria-label="Device pages" className="flex items-center gap-3">
          <button
            type="button"
            className="button-secondary"
            disabled={currentPage === 1}
            onClick={previousPage}
          >
            Previous
          </button>
          <span className="whitespace-nowrap text-xs text-slate-500">{`Page ${currentPage} of ${pages}`}</span>
          <button
            type="button"
            className="button-secondary"
            disabled={currentPage === pages}
            onClick={nextPage}
          >
            Next
          </button>
        </nav>
      </div>
    </section>
  )
}
