import { page } from 'vitest/browser'
import { describe, it, expect } from 'vitest'
import BerlinClock from './BerlinClock.svelte'
import { render } from 'vitest-browser-svelte'
// import { expect as playwrightExpect } from '@playwright/test'

function d(h: number, m: number, s: number) {
  return new Date(1970, 0, 1, h, m, s, 0)
}

describe('BerlinClock.svelte', () => {
  it('renders correct structure and a11y attributes', async () => {
    render(BerlinClock, { tick: false, time: d(0, 0, 0), a11yLabel: 'Berlin Clock at 00:00:00' })

    // Container role and a11y
    const img = page.getByRole('img')
    await expect.element(img).toBeInTheDocument()
    await expect.element(img).toHaveAttribute('aria-live', 'polite')
    await expect.element(img).toHaveAttribute('aria-label')

    // 1 second lamp
    await expect.element(page.getByTestId('sec')).toBeInTheDocument()
    await expect.element(page.getByTestId('sec')).toBeVisible()

    // 4 + 4 hours
    for (let i = 0; i < 4; i += 1) {
      await expect.element(page.getByTestId(`hour-upper-${i}`)).toBeInTheDocument()
      await expect.element(page.getByTestId(`hour-lower-${i}`)).toBeInTheDocument()
    }

    // 11 + 4 minutes
    for (let i = 0; i < 11; i += 1) {
      await expect.element(page.getByTestId(`min-upper-${i}`)).toBeInTheDocument()
    }
    for (let i = 0; i < 4; i += 1) {
      await expect.element(page.getByTestId(`min-lower-${i}`)).toBeInTheDocument()
    }
  })

  it('lights match encoder for 12:32:01', async () => {
    render(BerlinClock, { tick: false, time: d(12, 32, 1) })

    // seconds (odd -> ON)
    await expect.element(page.getByTestId('sec')).toHaveAttribute('data-lit', 'true')

    // hours 12 => upper 2, lower 2
    const upperLit = Array.from({ length: 4 }, (_, i) => page.getByTestId(`hour-upper-${i}`).element().getAttribute('data-lit') === 'true').filter(Boolean).length
    const lowerLit = Array.from({ length: 4 }, (_, i) => page.getByTestId(`hour-lower-${i}`).element().getAttribute('data-lit') === 'true').filter(Boolean).length
    expect(upperLit).toBe(2)
    expect(lowerLit).toBe(2)

    // minutes 32 => upper 6, lower 2
    const minUpperLit = Array.from({ length: 11 }, (_, i) => page.getByTestId(`min-upper-${i}`).element().getAttribute('data-lit') === 'true').filter(Boolean).length
    const minLowerLit = Array.from({ length: 4 }, (_, i) => page.getByTestId(`min-lower-${i}`).element().getAttribute('data-lit') === 'true').filter(Boolean).length
    expect(minUpperLit).toBe(6)
    expect(minLowerLit).toBe(2)
  })

  it('minute markers at 15/30/45 are rendered in red when lit', async () => {
    // 00:45 => upper minutes lit 9 (0..8), lower 0
    render(BerlinClock, { tick: false, time: d(0, 45, 1) })

    const redIndices = [2, 5, 8]
    for (const i of redIndices) {
      const el = page.getByTestId(`min-upper-${i}`).element()
      expect(el.getAttribute('data-lit')).toBe('true')
      expect(el.getAttribute('style') || '').toContain('--lamp-red')
    }

    // A non-marker lit minute should be yellow
    const yellowEl = page.getByTestId(`min-upper-0`).element()
    expect(yellowEl.getAttribute('data-lit')).toBe('true')
    expect(yellowEl.getAttribute('style') || '').toContain('--lamp-yellow')
  })
})
