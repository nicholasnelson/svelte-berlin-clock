<script lang="ts">
  import { onMount } from 'svelte'
  import { BerlinClock as Encoder } from '../clock.js'
  import type { BerlinClockOutputState } from '../clock.js'

  type Props = {
    class?: string
    themeClass?: string
    time?: Date
    tick?: boolean
    size?: 'sm' | 'md' | 'lg' | number
    a11yLabel?: string
  }

  let {
    class: className = '',
    themeClass = '',
    time = new Date(),
    tick = true,
    size = 'md',
    a11yLabel
  }: Props = $props()

  let internalNow: Date = $state(new Date())
  let timer: number | undefined

  onMount(() => {
    if (tick) {
      timer = setInterval(() => {
        internalNow = new Date()
      }, 1000) as unknown as number
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  })

  $effect(() => {
    if (!tick && timer) {
      clearInterval(timer)
      timer = undefined
    }
  })

  const effectiveTime: Date = $derived(tick ? internalNow : time)
  const clock = new Encoder(effectiveTime)
  $effect(() => {
    clock.setTime(effectiveTime)
  })
  let clockState: BerlinClockOutputState = $derived(clock.getState(effectiveTime))

  function sizeClass(kind: 'sec' | 'hour' | 'min') {
    if (typeof size === 'number') {
      const px = Math.max(6, size)
      if (kind === 'sec') return `h-[${px + 4}px] w-[${px + 4}px]`
      return `h-[${px}px] w-[${px}px]`
    }
    if (size === 'sm') return kind === 'sec' ? 'h-8 w-8' : 'h-6 w-6'
    if (size === 'lg') return kind === 'sec' ? 'h-14 w-14' : 'h-12 w-12'
    return kind === 'sec' ? 'h-10 w-10' : 'h-8 w-8'
  }

  function labelFor(time: Date) {
    return a11yLabel ?? time.toLocaleTimeString()
  }

  const unitSize = $derived(
    typeof size === 'number'
      ? `${Math.max(6, size)}px`
      : size === 'sm'
        ? '1.5rem'
        : size === 'lg'
          ? '3rem'
          : '2rem'
  )
  const a11yComputed = $derived(labelFor(effectiveTime))
</script>

<div class={`flex flex-col items-center gap-4 p-4 ${className} ${themeClass}`} role="img" aria-live="polite" aria-label={a11yComputed} style={`--lamp-unit:${unitSize}; --lamp-gap:0.5rem`}>
  <!-- Seconds: 1 circle -->
  <div class="flex justify-center">
    <div class={`${sizeClass('sec')} rounded-full border ${clockState.seconds === 1 ? 'border-yellow-700/60 bg-yellow-400' : 'border-neutral-700/40 bg-neutral-800'}`} data-testid="sec" data-lit={clockState.seconds === 1}></div>
  </div>

  <!-- Hours: 2 rows of 4 squares -->
  <div class="flex flex-col items-center gap-2">
    <div class="flex gap-2 justify-center" style="width: calc(4 * var(--lamp-unit) + 3 * var(--lamp-gap))">
      {#each clockState.hours.upper as lit, i}
        <div class={`${sizeClass('hour')} rounded-sm border ${lit ? 'border-red-700/60 bg-red-500' : 'border-neutral-700/40 bg-neutral-800'}`} data-testid={`hour-upper-${i}`} data-lit={lit}></div>
      {/each}
    </div>
    <div class="flex gap-2 justify-center" style="width: calc(4 * var(--lamp-unit) + 3 * var(--lamp-gap))">
      {#each clockState.hours.lower as lit, i}
        <div class={`${sizeClass('hour')} rounded-sm border ${lit ? 'border-red-700/60 bg-red-500' : 'border-neutral-700/40 bg-neutral-800'}`} data-testid={`hour-lower-${i}`} data-lit={lit}></div>
      {/each}
    </div>
  </div>

  <!-- Minutes: upper row 11 squares, lower row 4 squares -->
  <div class="flex flex-col items-center gap-2">
    <div class="flex gap-2" style="width: calc(4 * var(--lamp-unit) + 3 * var(--lamp-gap))">
      {#each clockState.minutes.upper as lit, i}
        {#if lit}
          <div class={`flex-1 ${sizeClass('min').split(' ').filter(c => c.startsWith('h-') || c.startsWith('h[')).join(' ')} rounded-sm border ${[2,5,8].includes(i) ? 'border-red-700/60 bg-red-500' : 'border-yellow-700/60 bg-yellow-400'}`} data-testid={`min-upper-${i}`} data-lit={lit}></div>
        {:else}
          <div class={`flex-1 ${sizeClass('min').split(' ').filter(c => c.startsWith('h-') || c.startsWith('h[')).join(' ')} rounded-sm border border-neutral-700/40 bg-neutral-800`} data-testid={`min-upper-${i}`} data-lit={lit}></div>
        {/if}
      {/each}
    </div>
    <div class="flex gap-2 justify-center" style="width: calc(4 * var(--lamp-unit) + 3 * var(--lamp-gap))">
      {#each clockState.minutes.lower as lit, i}
        <div class={`${sizeClass('min')} rounded-sm border ${lit ? 'border-yellow-700/60 bg-yellow-400' : 'border-neutral-700/40 bg-neutral-800'}`} data-testid={`min-lower-${i}`} data-lit={lit}></div>
      {/each}
    </div>
  </div>
</div>



