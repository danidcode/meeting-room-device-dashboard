import type { DeviceStatus } from '../types'

export const statuses: DeviceStatus[] = ['online', 'inMeeting', 'offline', 'deactivated']

export const statusLabels: Record<DeviceStatus, string> = {
  online: 'Online',
  inMeeting: 'In meeting',
  offline: 'Offline',
  deactivated: 'Deactivated',
}

export const statusColors: Record<DeviceStatus, string> = {
  online: 'bg-online',
  inMeeting: 'bg-primary',
  offline: 'bg-offline',
  deactivated: 'bg-deactivated',
}

export const badgeStyles: Record<DeviceStatus, string> = {
  online: 'bg-online/15 text-navy ring-online/40',
  inMeeting: 'bg-primary/10 text-navy ring-primary/25',
  offline: 'bg-offline/25 text-navy ring-offline/50',
  deactivated: 'bg-deactivated/15 text-navy ring-deactivated/35',
}

export const chartStatusColors: Record<DeviceStatus, string> = {
  online: '#27c6be',
  inMeeting: '#0169f5',
  offline: '#a5b9ca',
  deactivated: '#f59e0c',
}
