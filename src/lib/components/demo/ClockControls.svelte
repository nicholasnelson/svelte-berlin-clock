<script lang="ts">
  export let tick: boolean = true
  export let size: 'sm' | 'md' | 'lg' | number = 'md'
  export let themeClass: string = ''
  export let time: Date = new Date()

  function setTimeFromInputs(hh: string, mm: string, ss: string) {
    const h = Math.max(0, Math.min(23, Number(hh) || 0))
    const m = Math.max(0, Math.min(59, Number(mm) || 0))
    const s = Math.max(0, Math.min(59, Number(ss) || 0))
    time = new Date(1970, 0, 1, h, m, s, 0)
  }
</script>

<div class="flex flex-col gap-3">
  <div class="flex items-center gap-3">
    <label class="flex items-center gap-2 text-sm">
      <input type="checkbox" bind:checked={tick} />
      Ticking
    </label>

    <div class="flex items-center gap-2">
      <span class="text-sm">Size</span>
      <select class="rounded border border-neutral-700 bg-neutral-900 p-1 text-sm" bind:value={size}>
        <option value="sm">sm</option>
        <option value="md">md</option>
        <option value="lg">lg</option>
      </select>
    </div>
  </div>

  <div class="flex items-center gap-3">
    <span class="text-sm">Time</span>
    <input class="w-12 rounded border border-neutral-700 bg-neutral-900 p-1 text-sm" type="number" min="0" max="23" value={time.getHours()} on:change={(e) => setTimeFromInputs((e.target as HTMLInputElement).value, String(time.getMinutes()), String(time.getSeconds()))} />
    :
    <input class="w-12 rounded border border-neutral-700 bg-neutral-900 p-1 text-sm" type="number" min="0" max="59" value={time.getMinutes()} on:change={(e) => setTimeFromInputs(String(time.getHours()), (e.target as HTMLInputElement).value, String(time.getSeconds()))} />
    :
    <input class="w-12 rounded border border-neutral-700 bg-neutral-900 p-1 text-sm" type="number" min="0" max="59" value={time.getSeconds()} on:change={(e) => setTimeFromInputs(String(time.getHours()), String(time.getMinutes()), (e.target as HTMLInputElement).value)} />
  </div>

  <div class="flex items-center gap-2">
    <span class="text-sm">Theme</span>
    <select class="rounded border border-neutral-700 bg-neutral-900 p-1 text-sm" bind:value={themeClass}>
      <option value="">default</option>
      <option value="theme-warm">warm</option>
      <option value="theme-cool">cool</option>
    </select>
  </div>
</div>


