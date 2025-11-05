<script lang="ts">
  import { onMount } from 'svelte'
  import { BerlinClock as Encoder } from '../../clock.js'
  import type { BerlinClockOutputState } from '../../clock.js'

  type Props = {
    class?: string
    themeClass?: string
    time?: Date
    tick?: boolean
    size?: 'xs' | 'sm' | 'md' | 'lg' | number
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
    if (tick) startTicking()
    return () => {
      stopTicking()
    }
  })

  function startTicking() {
    if (timer) return
    timer = setInterval(() => {
      internalNow = new Date()
    }, 1000) as unknown as number
  }

  function stopTicking() {
    if (!timer) return
    clearInterval(timer)
    timer = undefined
  }

  $effect(() => {
    if (tick) startTicking()
    else stopTicking()
  })

  const effectiveTime: Date = $derived(tick ? internalNow : time)
  const clock = new Encoder()
  $effect(() => {
    clock.setTime(effectiveTime)
  })
  let clockState: BerlinClockOutputState = $derived(clock.getState(effectiveTime))

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
          : size === 'xs'
            ? '1.25rem'
            : '2rem'
  )
  const gapSize = $derived(
    typeof size === 'number'
      ? '0.5rem'
      : size === 'xs'
        ? '0.375rem'
        : '0.5rem'
  )
  const secondUnit = $derived(
    typeof size === 'number'
      ? `${Math.max(6, size) + 4}px`
      : size === 'xs'
        ? '1.5rem'
        : size === 'sm'
          ? '2rem'
          : size === 'lg'
            ? '3.5rem'
            : '2.5rem'
  )
  const a11yComputed = $derived(labelFor(effectiveTime))

  function lampStyle(on: boolean, color: 'red' | 'yellow') {
    if (!on) {
      return 'background: var(--lamp-off); border-color: var(--lamp-off-border);'
    }
    if (color === 'red') {
      return 'background: var(--lamp-red); border-color: var(--lamp-red-border); box-shadow: 0 0 10px var(--lamp-glow-red);'
    }
    return 'background: var(--lamp-yellow); border-color: var(--lamp-yellow-border); box-shadow: 0 0 10px var(--lamp-glow-yellow);'
  }
</script>

<div
  data-testid="berlin-clock-basic"
  class={`clock ${className} ${themeClass}`}
  role="img"
  aria-live="polite"
  aria-label={a11yComputed}
  style={`--lamp-unit:${unitSize}; --lamp-gap:${gapSize}; --lamp-sec-unit:${secondUnit}; --lamp-row-width: calc(4 * var(--lamp-unit) + 3 * var(--lamp-gap));`}
>
  <!-- Seconds: 1 circle -->
  <div class="clock__seconds">
    <div
      class={`lamp lamp--seconds ${clockState.seconds === 1 ? 'lamp--seconds-active' : ''}`}
      style={lampStyle(clockState.seconds === 1, 'yellow')}
      data-testid="sec"
      data-lit={clockState.seconds === 1}
    ></div>
  </div>

  <!-- Hours: 2 rows of 4 squares -->
  <div class="clock__group">
    <div class="clock__row">
      {#each clockState.hours.upper as lit, i}
        <div
          class="lamp"
          style={lampStyle(lit, 'red')}
          data-testid={`hour-upper-${i}`}
          data-lit={lit}
        ></div>
      {/each}
    </div>
    <div class="clock__row">
      {#each clockState.hours.lower as lit, i}
        <div
          class="lamp"
          style={lampStyle(lit, 'red')}
          data-testid={`hour-lower-${i}`}
          data-lit={lit}
        ></div>
      {/each}
    </div>
  </div>

  <!-- Minutes: upper row 11 squares, lower row 4 squares -->
  <div class="clock__group">
    <div class="clock__row clock__row--minutes-upper">
      {#each clockState.minutes.upper as lit, i}
        <div
          class="lamp lamp--minutes-upper"
          style={lampStyle(lit, [2, 5, 8].includes(i) ? 'red' : 'yellow')}
          data-testid={`min-upper-${i}`}
          data-lit={lit}
        ></div>
      {/each}
    </div>
    <div class="clock__row clock__row--minutes-lower">
      {#each clockState.minutes.lower as lit, i}
        <div
          class="lamp"
          style={lampStyle(lit, 'yellow')}
          data-testid={`min-lower-${i}`}
          data-lit={lit}
        ></div>
      {/each}
    </div>
  </div>
</div>

<style>
  @import '$lib/theme.css';

  .clock {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: calc(var(--lamp-gap) * 2);
    padding: 1.5rem;
  }

  .clock__seconds {
    display: flex;
    justify-content: center;
    width: var(--lamp-row-width);
  }

  .clock__group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--lamp-gap);
  }

  .clock__row {
    display: flex;
    justify-content: center;
    gap: var(--lamp-gap);
    width: var(--lamp-row-width);
  }

  .clock__row--minutes-upper .lamp {
    flex: 1 1 0%;
    width: auto;
  }

  .lamp {
    display: block;
    width: var(--lamp-unit);
    height: var(--lamp-unit);
    border-radius: 3px;
    border: 1px solid var(--lamp-off-border);
    background: var(--lamp-off);
    box-shadow: none;
    transition: background-color 500ms ease-out, border-color 500ms ease-out, box-shadow 500ms ease-out;
  }

  .lamp--minutes-upper {
    height: var(--lamp-unit);
  }

  .lamp--seconds {
    border-radius: 9999px;
    width: var(--lamp-sec-unit);
    height: var(--lamp-sec-unit);
  }

  .lamp--seconds-active {
    animation: sec-pulse 1000ms ease-out 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .lamp {
      transition: none;
    }

    .lamp--seconds-active {
      animation: none;
    }
  }
</style>

