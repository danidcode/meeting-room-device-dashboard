import initialDevices from '../../devices.json'
import { statuses } from '../constants/deviceStatus'
import type { Device } from '../types'

export function getInitialFleet(): Device[] {
  return initialDevices.map((device) => {
    const status = statuses.find((value) => value === device.status)
    if (!status) throw new Error(`Unknown device status: ${device.status}`)
    return { ...device, status }
  })
}
