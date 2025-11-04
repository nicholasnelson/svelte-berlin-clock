<script lang="ts">
  import { onMount } from 'svelte'
  import { BerlinClock } from '../lib/index.js'

  let now = new Date()
  let timer: number | undefined

  onMount(() => {
    timer = setInterval(() => {
      now = new Date()
    }, 1000) as unknown as number
    return () => {
      if (timer) clearInterval(timer)
    }
  })
</script>

<div class="mx-auto max-w-3xl p-6">
  <h1 class="mb-2 text-2xl font-semibold">Berlin Clock – Demo</h1>
  <p class="mb-6 text-sm text-gray-600">This route is for testing the library component.</p>

  <div class="flex justify-center">
    <BerlinClock class="w-full max-w-md" time={now} />
  </div>
</div>
