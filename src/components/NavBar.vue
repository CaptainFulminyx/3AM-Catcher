<template>
  <nav class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
       :class="scrolled ? 'bg-night-950/90 backdrop-blur-md border-b border-night-700/40' : 'bg-transparent'">

    <!-- Logo -->
    <router-link to="/" class="flex items-center gap-2 group">
      <span class="text-ember animate-flicker text-lg">◉</span>
      <span class="font-display font-700 text-mist-bright tracking-tight text-lg group-hover:text-ember transition-colors duration-300">
        3am
      </span>
    </router-link>

    <!-- Center — current time if it's night -->
    <div v-if="isNightTime" class="font-mono text-xs text-mist-dim tabular-nums">
      {{ currentTime }}
    </div>
    <div v-else class="font-mono text-xs text-mist-dim/50 tabular-nums">
      {{ currentTime }} — you're early
    </div>

    <!-- Right actions -->
    <div class="flex items-center gap-3">
      <!-- New thought button -->
      <button
        @click="$emit('open-post')"
        class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-ember/40 text-ember text-xs font-mono hover:bg-ember/10 hover:border-ember transition-all duration-200"
      >
        <span class="text-base leading-none">+</span>
        <span class="hidden sm:inline">thought</span>
      </button>

      <!-- Profile -->
      <router-link
        :to="`/profile/${user.username}`"
        class="w-8 h-8 rounded-full bg-night-700 border border-night-600 flex items-center justify-center text-xs font-mono text-mist hover:border-ember/60 transition-colors duration-200"
      >
        {{ user.initials }}
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth.js'

defineEmits(['open-post'])

const auth = useAuthStore()
const user = computed(() => auth.user)

const scrolled = ref(false)
const currentTime = ref('')

const isNightTime = computed(() => {
  const h = new Date().getHours()
  return h >= 22 || h < 6
})

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

function onScroll() {
  scrolled.value = window.scrollY > 20
}

let timer
onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  clearInterval(timer)
  window.removeEventListener('scroll', onScroll)
})
</script>