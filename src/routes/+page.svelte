<script lang="ts">
  import { BerlinClock } from '$lib/index.js'
  import { formatTime } from '$lib/utils/format.js'
  import ClockControls from '$lib/components/demo/ClockControls.svelte'
  import ClockLegend from '$lib/components/demo/ClockLegend.svelte'

  let tick = true
  let time = new Date()
  let size: 'sm' | 'md' | 'lg' | number = 'md'
  let themeClass = ''
</script>

<div class="mx-auto max-w-3xl p-6">
  <h1 class="mb-2 text-2xl font-semibold">Berlin Clock – Demo</h1>
  <p class="mb-6 text-sm text-gray-600">This route is for testing the library component.</p>

  <div class="mb-4 flex items-center justify-between gap-4">
    <ClockControls bind:tick bind:time bind:size bind:themeClass />
    <div class="text-sm text-gray-400">{formatTime(time)}</div>
  </div>

  <div class="flex justify-center">
    <BerlinClock class="w-full max-w-md" {tick} {time} {size} {themeClass} />
  </div>

  <ClockLegend />
</div>
