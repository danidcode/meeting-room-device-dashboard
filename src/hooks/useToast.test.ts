import { StrictMode } from 'react'
import { act, cleanup, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useToast } from './useToast'

describe('useToast', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    cleanup()
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
  })

  it('starts empty and dismisses a message after four seconds', () => {
    const { result } = renderHook(useToast, { wrapper: StrictMode })
    expect(result.current.notice).toBeNull()
    act(() => result.current.showToast('Device added successfully.'))

    act(() => vi.advanceTimersByTime(3999))
    expect(result.current.notice?.message).toBe('Device added successfully.')
    act(() => vi.advanceTimersByTime(1))
    expect(result.current.notice).toBeNull()
  })

  it.each(['Device removed successfully.', 'Device added successfully.'])(
    'restarts the timer for a replacement message: %s',
    (message) => {
      const { result } = renderHook(useToast, { wrapper: StrictMode })
      act(() => result.current.showToast('Device added successfully.'))
      act(() => vi.advanceTimersByTime(3000))
      act(() => result.current.showToast(message))

      // The old timer must not dismiss the replacement, even with identical text.
      act(() => vi.advanceTimersByTime(1000))
      expect(result.current.notice?.message).toBe(message)
      act(() => vi.advanceTimersByTime(2999))
      expect(result.current.notice?.message).toBe(message)
      act(() => vi.advanceTimersByTime(1))
      expect(result.current.notice).toBeNull()
    },
  )

  it('cleans up its pending timer when unmounted', () => {
    const { result, unmount } = renderHook(useToast)
    act(() => result.current.showToast('Saved'))
    expect(vi.getTimerCount()).toBe(1)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })
})
