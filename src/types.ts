export type DeviceStatus = 'online' | 'inMeeting' | 'offline' | 'deactivated'

export interface Device {
  id: string
  name: string
  model?: string
  description: string
  status: DeviceStatus
}

export type NewDevice = Pick<Device, 'name' | 'description' | 'status'>
