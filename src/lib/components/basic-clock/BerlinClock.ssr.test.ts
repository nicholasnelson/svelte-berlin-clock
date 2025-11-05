import { describe, it, expect } from 'vitest'
import { render } from 'svelte/server'
import BerlinClock from './BerlinClock.svelte'

function d(h: number, m: number, s: number) {
  return new Date(1970, 0, 1, h, m, s, 0)
}

describe('BerlinClock SSR', () => {
  it('renders on server without errors', () => {
    expect(() => {
      render(BerlinClock, { props: { tick: false, time: d(12, 32, 1), a11yLabel: 'Berlin Clock 12:32:01' } })
    }).not.toThrow()
  })

  it('includes essential attributes in SSR output', () => {
    const { body } = render(BerlinClock, { props: { tick: false, time: d(0, 0, 0), a11yLabel: 'Berlin Clock 00:00:00' } })
    expect(body).toContain('role="img"')
    expect(body).toContain('aria-live="polite"')
    expect(body).toContain('aria-label=')
  })
})



