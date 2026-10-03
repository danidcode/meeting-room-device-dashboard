import { useEffect, useRef } from 'react'
import type { NewDevice } from '../types'
import DeviceForm from './DeviceForm'

interface Props {
  onAdd: (device: NewDevice) => void
  onClose: () => void
}

export default function AddDeviceDialog({ onAdd, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current!
    const previouslyFocused = document.activeElement
    dialog.showModal()
    return () => {
      dialog.close()
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      id="add-device-dialog"
      aria-labelledby="add-title"
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto rounded-xl bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-900/40"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <DeviceForm onAdd={onAdd} onCancel={onClose} />
    </dialog>
  )
}
