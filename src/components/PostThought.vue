<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-night-950/80 backdrop-blur-sm" @click="close" />

        <!-- Panel -->
        <div class="relative w-full max-w-lg bg-night-900 border border-night-700/80 rounded-2xl p-6 shadow-2xl">

          <!-- Header -->
          <div class="flex items-center justify-between mb-5">
            <div class="flex items-center gap-2">
              <span class="text-ember animate-flicker">◉</span>
              <span class="font-mono text-xs text-mist-dim tabular-nums">{{ currentTime }}</span>
            </div>
            <button
              @click="close"
              class="text-mist-dim hover:text-mist transition-colors text-lg leading-none"
            >
              ×
            </button>
          </div>

          <!-- Textarea -->
          <textarea
            ref="textareaRef"
            v-model="content"
            placeholder="what's keeping you up..."
            maxlength="500"
            rows="5"
            class="w-full bg-transparent text-mist-bright placeholder-mist-dim/40 text-sm leading-relaxed
                   font-body resize-none outline-none border-none focus:ring-0"
            @keydown.meta.enter="submit"
            @keydown.ctrl.enter="submit"
          />

          <!-- Char count -->
          <div class="flex justify-end mb-4">
            <span
              class="font-mono text-xs tabular-nums transition-colors duration-200"
              :class="content.length > 450 ? 'text-ember' : 'text-mist-dim/50'"
            >
              {{ content.length }}/500
            </span>
          </div>

          <!-- Divider -->
          <div class="border-t border-night-700/60 mb-4" />

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-5">
            <button
              v-for="tag in availableTags"
              :key="tag.value"
              @click="toggleTag(tag.value)"
              :class="[
                'text-xs font-mono px-2.5 py-1 rounded-full border transition-all duration-200',
                selectedTags.includes(tag.value)
                  ? tag.activeClass
                  : 'border-night-600 text-mist-dim hover:border-mist-dim/40 hover:text-mist'
              ]"
            >
              {{ tag.value }}
            </button>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-between">
            <p class="text-xs text-mist-dim/50 font-mono">
              ⌘↵ to post
            </p>

            <button
              @click="submit"
              :disabled="!canSubmit"
              :class="[
                'px-5 py-2 rounded-full text-sm font-display font-600 transition-all duration-200',
                canSubmit
                  ? 'bg-ember text-night-950 hover:bg-ember-glow shadow-lg shadow-ember/20'
                  : 'bg-night-700 text-mist-dim cursor-not-allowed'
              ]"
            >
              release it
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'post'])

const content = ref('')
const selectedTags = ref([])
const textareaRef = ref(null)
const currentTime = ref('')

const availableTags = [
  { value: '#idea',     activeClass: 'border-sky-500/50 text-sky-400 bg-sky-950/40' },
  { value: '#rant',     activeClass: 'border-rose-500/50 text-rose-400 bg-rose-950/40' },
  { value: '#question', activeClass: 'border-violet-500/50 text-violet-400 bg-violet-950/40' },
  { value: '#collab',   activeClass: 'border-amber-500/50 text-amber-400 bg-amber-950/40' },
  { value: '#creative', activeClass: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/40' },
]

const canSubmit = computed(() => content.value.trim().length > 0 && selectedTags.value.length > 0)

function toggleTag(tag) {
  const i = selectedTags.value.indexOf(tag)
  if (i === -1) selectedTags.value.push(tag)
  else selectedTags.value.splice(i, 1)
}

function updateTime() {
  currentTime.value = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function close() {
  emit('close')
}

function submit() {
  if (!canSubmit.value) return

  const now = new Date()
  const postTime = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  emit('post', {
    id: `local-${Date.now()}`,
    user: { id: 'u0', username: 'you', initials: 'YO', avatar: null },
    content: content.value.trim(),
    tags: [...selectedTags.value],
    postTime,
    timestamp: now.toISOString(),
    reactions: { felt: 0, wantIn: 0, tellMore: 0 },
    userReaction: null,
    reflectionStatus: null,
    comments: 0,
  })

  content.value = ''
  selectedTags.value = []
  close()
}

watch(() => props.isOpen, async (val) => {
  if (val) {
    updateTime()
    await nextTick()
    textareaRef.value?.focus()
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 0.25s ease, opacity 0.25s ease;
}
.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: translateY(16px);
  opacity: 0;
}
</style>