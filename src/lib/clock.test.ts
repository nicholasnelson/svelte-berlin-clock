import { describe, it, expect } from 'vitest'
import { BerlinClock } from './clock'

function d(h: number, m: number, s: number) {
  // Local timezone-safe constructor
  return new Date(1970, 0, 1, h, m, s, 0)
}

describe('BerlinClock encoder', () => {
  it('seconds lamp is ON for odd seconds, OFF for even seconds', () => {
    const bc = new BerlinClock()

    // even seconds -> OFF (0)
    expect(bc.getState(d(0, 0, 0)).seconds).toBe(0)
    expect(bc.getState(d(12, 0, 42)).seconds).toBe(0)

    // odd seconds -> ON (1)
    expect(bc.getState(d(0, 0, 1)).seconds).toBe(1)
    expect(bc.getState(d(23, 59, 59)).seconds).toBe(1)
  })

  it('encodes 12:32 correctly (hours 2/2, minutes 6/2)', () => {
    const bc = new BerlinClock()
    const state = bc.getState(d(12, 32, 1))

    // hours 12 => upper 2 (10), lower 2 (2)
    expect(state.hours.upper.length).toBe(4)
    expect(state.hours.lower.length).toBe(4)
    expect(state.hours.upper.filter(Boolean).length).toBe(2)
    expect(state.hours.lower.filter(Boolean).length).toBe(2)

    // minutes 32 => upper 6 (30), lower 2 (2)
    expect(state.minutes.upper.length).toBe(11)
    expect(state.minutes.lower.length).toBe(4)
    expect(state.minutes.upper.filter(Boolean).length).toBe(6)
    expect(state.minutes.lower.filter(Boolean).length).toBe(2)
  })

  it('encodes 00:00 correctly', () => {
    const bc = new BerlinClock()
    const state = bc.getState(d(0, 0, 0))

    expect(state.hours.upper.filter(Boolean).length).toBe(0)
    expect(state.hours.lower.filter(Boolean).length).toBe(0)
    expect(state.minutes.upper.filter(Boolean).length).toBe(0)
    expect(state.minutes.lower.filter(Boolean).length).toBe(0)
  })

  it('encodes 23:59 correctly', () => {
    const bc = new BerlinClock()
    const state = bc.getState(d(23, 59, 59))

    // hours 23 => upper 4 (20), lower 3 (3)
    expect(state.hours.upper.filter(Boolean).length).toBe(4)
    expect(state.hours.lower.filter(Boolean).length).toBe(3)

    // minutes 59 => upper 11 (55), lower 4 (4)
    expect(state.minutes.upper.filter(Boolean).length).toBe(11)
    expect(state.minutes.lower.filter(Boolean).length).toBe(4)
  })

  it('boundary 04:59 -> 05:00 transitions correctly', () => {
    const bc = new BerlinClock()
    const before = bc.getState(d(4, 59, 59))
    const after = bc.getState(d(5, 0, 0))

    // Before: 4 hours => upper 0, lower 4
    expect(before.hours.upper.filter(Boolean).length).toBe(0)
    expect(before.hours.lower.filter(Boolean).length).toBe(4)

    // After: 5 hours => upper 1, lower 0
    expect(after.hours.upper.filter(Boolean).length).toBe(1)
    expect(after.hours.lower.filter(Boolean).length).toBe(0)

    // Minutes reset from 59 -> 0
    expect(before.minutes.upper.filter(Boolean).length).toBe(11)
    expect(before.minutes.lower.filter(Boolean).length).toBe(4)
    expect(after.minutes.upper.filter(Boolean).length).toBe(0)
    expect(after.minutes.lower.filter(Boolean).length).toBe(0)
  })

  it('boundary 09:59 -> 10:00 transitions correctly', () => {
    const bc = new BerlinClock()
    const before = bc.getState(d(9, 59, 59))
    const after = bc.getState(d(10, 0, 0))

    // Before: 9 hours => upper 1 (5), lower 4 (4)
    expect(before.hours.upper.filter(Boolean).length).toBe(1)
    expect(before.hours.lower.filter(Boolean).length).toBe(4)

    // After: 10 hours => upper 2 (10), lower 0 (0)
    expect(after.hours.upper.filter(Boolean).length).toBe(2)
    expect(after.hours.lower.filter(Boolean).length).toBe(0)

    // Minutes reset
    expect(before.minutes.upper.filter(Boolean).length).toBe(11)
    expect(before.minutes.lower.filter(Boolean).length).toBe(4)
    expect(after.minutes.upper.filter(Boolean).length).toBe(0)
    expect(after.minutes.lower.filter(Boolean).length).toBe(0)
  })
})



