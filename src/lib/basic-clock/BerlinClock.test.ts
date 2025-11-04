import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import BerlinClock from './BerlinClock.svelte'

function d(h: number, m: number, s: number) {
  return new Date(1970, 0, 1, h, m, s, 0)
}

describe.skip('BerlinClock.svelte', () => {
  it('renders correct counts of lamps', () => {
    render(BerlinClock, { props: { tick: false, time: d(0, 0, 0) } })

    // 1 second lamp
    expect(screen.getByTestId('sec')).toBeTruthy()

    // 4 + 4 hours
    for (let i = 0; i < 4; i += 1) {
      expect(screen.getByTestId(`hour-upper-${i}`)).toBeTruthy()
      expect(screen.getByTestId(`hour-lower-${i}`)).toBeTruthy()
    }

    // 11 + 4 minutes
    for (let i = 0; i < 11; i += 1) {
      expect(screen.getByTestId(`min-upper-${i}`)).toBeTruthy()
    }
    for (let i = 0; i < 4; i += 1) {
      expect(screen.getByTestId(`min-lower-${i}`)).toBeTruthy()
    }
  })

  it('lights match encoder for 12:32:01', async () => {
    render(BerlinClock, { props: { tick: false, time: d(12, 32, 1) } })

    // seconds (odd -> ON)
    expect(screen.getByTestId('sec').getAttribute('data-lit')).toBe('true')

    // hours 12 => upper 2, lower 2
    const upperLit = Array.from({ length: 4 }, (_, i) => screen.getByTestId(`hour-upper-${i}`).getAttribute('data-lit') === 'true').filter(Boolean).length
    const lowerLit = Array.from({ length: 4 }, (_, i) => screen.getByTestId(`hour-lower-${i}`).getAttribute('data-lit') === 'true').filter(Boolean).length
    expect(upperLit).toBe(2)
    expect(lowerLit).toBe(2)

    // minutes 32 => upper 6, lower 2
    const minUpperLit = Array.from({ length: 11 }, (_, i) => screen.getByTestId(`min-upper-${i}`).getAttribute('data-lit') === 'true').filter(Boolean).length
    const minLowerLit = Array.from({ length: 4 }, (_, i) => screen.getByTestId(`min-lower-${i}`).getAttribute('data-lit') === 'true').filter(Boolean).length
    expect(minUpperLit).toBe(6)
    expect(minLowerLit).toBe(2)
  })
})


