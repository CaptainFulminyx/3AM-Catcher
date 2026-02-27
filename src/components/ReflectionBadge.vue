<template>
  <span :class="badgeClass" class="text-xs font-mono px-2 py-0.5 rounded-full border tabular-nums">
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true },
})

const config = {
  'Still Obsessed': {
    label: '🔥 obsessed',
    class: 'border-ember/40 text-ember bg-ember/10',
  },
  'Meh': {
    label: '🌫 meh',
    class: 'border-mist-dim/30 text-mist-dim bg-night-800',
  },
  'Burn It': {
    label: '💀 burned',
    class: 'border-rose-900/50 text-rose-600/70 bg-rose-950/20',
  },
}

const badgeClass = computed(() => {
  return config[props.status]?.class ?? 'border-night-600 text-mist-dim bg-night-800'
})

const label = computed(() => {
  return config[props.status]?.label ?? props.status
})
</script>