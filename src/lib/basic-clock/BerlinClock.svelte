<script lang="ts">
  import { BerlinClock as Encoder } from '../clock.js'

  type Props = {
    class?: string
    time?: Date
  }

  let { class: className = '', time = new Date() }: Props = $props()

  const clock = new Encoder(time)
  $effect(() => {
    clock.setTime(time)
  })
  let state = $derived(clock.getState(time))
</script>

<div class={`flex flex-col items-center gap-4 p-4 ${className}`}>
  <!-- Seconds: 1 circle -->
  <div class="flex justify-center">
    <div class={`h-10 w-10 rounded-full border ${state.seconds === 1 ? 'border-yellow-700/60 bg-yellow-400' : 'border-neutral-700/40 bg-neutral-800'}`}></div>
  </div>

  <!-- Hours: 2 rows of 4 squares -->
  <div class="flex flex-col items-center gap-2">
    <div class="flex gap-2">
      {#each state.hours.upper as lit}
        <div class={`h-10 w-10 rounded-sm border ${lit ? 'border-red-700/60 bg-red-500' : 'border-neutral-700/40 bg-neutral-800'}`}></div>
      {/each}
    </div>
    <div class="flex gap-2">
      {#each state.hours.lower as lit}
        <div class={`h-10 w-10 rounded-sm border ${lit ? 'border-red-700/60 bg-red-500' : 'border-neutral-700/40 bg-neutral-800'}`}></div>
      {/each}
    </div>
  </div>

  <!-- Minutes: upper row 11 squares, lower row 4 squares -->
  <div class="flex flex-col items-center gap-2">
    <div class="flex flex-nowrap justify-center gap-2 overflow-x-auto w-full">
      {#each state.minutes.upper as lit}
        <div class={`h-8 w-8 rounded-sm border ${lit ? 'border-yellow-700/60 bg-yellow-400' : 'border-neutral-700/40 bg-neutral-800'}`}></div>
      {/each}
    </div>
    <div class="flex gap-2">
      {#each state.minutes.lower as lit}
        <div class={`h-8 w-8 rounded-sm border ${lit ? 'border-yellow-700/60 bg-yellow-400' : 'border-neutral-700/40 bg-neutral-800'}`}></div>
      {/each}
    </div>
  </div>
</div>



