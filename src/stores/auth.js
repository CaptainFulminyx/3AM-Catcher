import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref({
    id: 'u0',
    username: 'you',
    initials: 'YO',
    avatar: null,
    joinedAt: '2024-11-01',
    bio: 'chronic overthinker. building things at odd hours.',
    stats: {
      thoughts: 24,
      stillObsessed: 11,
      collabs: 3,
    },
  })

  const isLoggedIn = computed(() => !!user.value)

  function updateReaction(postId, reaction) {
    // will wire to supabase later — no-op for now
    console.log(`[mock] reaction on ${postId}: ${reaction}`)
  }

  function updateReflection(postId, status) {
    console.log(`[mock] reflection on ${postId}: ${status}`)
  }

  return {
    user,
    isLoggedIn,
    updateReaction,
    updateReflection,
  }
})