<template>
  <div class="flex items-center gap-1">
    <button
      v-for="reaction in reactions"
      :key="reaction.key"
      @click.stop="handleReaction(reaction.key)"
      :class="[
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all duration-200',
        activeReaction === reaction.key
          ? reaction.activeClass
          : 'bg-night-800 border border-night-600 text-mist-dim hover:border-mist-dim/40 hover:text-mist'
      ]"
    >
      <span>{{ reaction.emoji }}</span>
      <span class="tabular-nums">{{ formatCount(counts[reaction.key]) }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  postId: { type: String, required: true },
  initialCounts: { type: Object, required: true },
  initialReaction: { type: String, default: null },
})

const emit = defineEmits(['react'])

const reactions = [
  {
    key: 'felt',
    emoji: '🫀',
    activeClass: 'bg-rose-950/60 border border-rose-500/50 text-rose-300',
  },
  {
    key: 'wantIn',
    emoji: '⚡',
    activeClass: 'bg-amber-950/60 border border-amber-500/50 text-amber-300',
  },
  {
    key: 'tellMore',
    emoji: '👁',
    activeClass: 'bg-indigo-950/60 border border-indigo-500/50 text-indigo-300',
  },
]

const activeReaction = ref(props.initialReaction)
const counts = ref({ ...props.initialCounts })

function handleReaction(key) {
  const prev = activeReaction.value

  if (prev === key) {
    // undo
    counts.value[key]--
    activeReaction.value = null
    emit('react', { postId: props.postId, reaction: null })
  } else {
    // switch or new
    if (prev) counts.value[prev]--
    counts.value[key]++
    activeReaction.value = key
    emit('react', { postId: props.postId, reaction: key })
  }
}

function formatCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return n
}

watch(() => props.initialReaction, (val) => {
  activeReaction.value = val
})
</script>