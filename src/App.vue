<template>
  <div class="relative min-h-screen bg-night-950 font-body">

    <!-- Ambient background glow -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-[0.04]"
        style="background: radial-gradient(ellipse, #ff6b35 0%, transparent 70%); filter: blur(40px);"
      />
      <div
        class="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.03]"
        style="background: radial-gradient(ellipse, #6b5aff 0%, transparent 70%); filter: blur(60px);"
      />
    </div>

    <!-- Navbar -->
    <NavBar @open-post="openPostModal" />

    <!-- Router view -->
    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component
          :is="Component"
          ref="currentView"
        />
      </Transition>
    </RouterView>

    <!-- Post modal -->
    <PostThought
      :is-open="postModalOpen"
      @close="postModalOpen = false"
      @post="handleNewPost"
    />

    <!-- Toast -->
    <Transition name="toast">
      <div
        v-if="toast.visible"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]
               flex items-center gap-2 px-4 py-2.5 rounded-full
               bg-night-800 border border-night-600 shadow-xl
               font-mono text-xs text-mist-bright whitespace-nowrap"
      >
        <span>{{ toast.emoji }}</span>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import PostThought from '@/components/PostThought.vue'

const postModalOpen = ref(false)
const currentView  = ref(null)

const toast = reactive({
  visible: false,
  message: '',
  emoji: '◉',
  timer: null,
})

function openPostModal() {
  postModalOpen.value = true
}

function handleNewPost(post) {
  // Forward to FeedView if it's currently mounted and exposes addPost
  if (currentView.value && typeof currentView.value.addPost === 'function') {
    currentView.value.addPost(post)
  }

  showToast('thought released into the night', '🌙')
}

function showToast(message, emoji = '◉') {
  if (toast.timer) clearTimeout(toast.timer)
  toast.message = message
  toast.emoji   = emoji
  toast.visible = true
  toast.timer   = setTimeout(() => { toast.visible = false }, 3000)
}
</script>

<style scoped>
/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Toast */
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}
</style>