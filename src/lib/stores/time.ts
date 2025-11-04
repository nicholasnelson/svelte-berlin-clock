import { readable, derived, type Readable } from 'svelte/store'
import { BerlinClock } from '../clock.js'

export const timeNow: Readable<Date> = readable(new Date(), (set) => {
  const id = setInterval(() => set(new Date()), 1000)
  return () => clearInterval(id)
})

export const berlinState = derived(timeNow, ($now) => {
  const encoder = new BerlinClock($now)
  return encoder.getState($now)
})

export function deriveBerlinState(from: Readable<Date>) {
  return derived(from, ($d) => {
    const encoder = new BerlinClock($d)
    return encoder.getState($d)
  })
}


