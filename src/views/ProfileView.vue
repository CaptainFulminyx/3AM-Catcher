
<template>
  <div class="min-h-screen bg-night-950">
    <div class="max-w-2xl mx-auto px-6 pt-24 pb-16">

      <!-- Back -->
      <button
        @click="$router.back()"
        class="flex items-center gap-2 text-xs font-mono text-mist-dim hover:text-mist transition-colors duration-200 mb-8 group"
      >
        <span class="group-hover:-translate-x-1 transition-transform duration-200">←</span>
        back
      </button>

      <!-- Profile header -->
      <div class="rounded-2xl border border-night-700/60 bg-night-900/60 p-6 mb-6 animate-fade-up">
        <div class="flex items-start justify-between mb-5">

          <!-- Avatar + name -->
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-full bg-night-700 border border-night-600 flex items-center justify-center
                        text-lg font-mono text-mist">
              {{ profile.initials }}
            </div>
            <div>
              <h1 class="font-display font-700 text-xl text-mist-bright leading-none mb-1">
                {{ profile.username }}
              </h1>
              <p class="text-xs font-mono text-mist-dim">
                since {{ profile.joinedAt }}
              </p>
            </div>
          </div>

          <!-- Own profile edit hint -->
          <div
            v-if="isOwnProfile"
            class="text-xs font-mono text-mist-dim/40 border border-night-700/40 px-3 py-1.5 rounded-full"
          >
            you
          </div>
        </div>

        <!-- Bio -->
        <p class="text-sm text-mist/80 font-body leading-relaxed mb-6">
          {{ profile.bio }}
        </p>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-3">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="rounded-xl border border-night-700/40 bg-night-800/60 p-3 text-center"
          >
            <p class="font-mono text-lg font-500 tabular-nums" :class="stat.color">
              {{ stat.value }}
            </p>
            <p class="text-xs text-mist-dim/60 font-mono mt-0.5">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex gap-1 mb-6 border-b border-night-800/60">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="activeTab = tab.value"
          :class="[
            'px-4 py-2.5 text-xs font-mono transition-all duration-200 border-b-2 -mb-px',
            activeTab === tab.value
              ? 'border-ember text-ember'
              : 'border-transparent text-mist-dim hover:text-mist'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab: thoughts -->
      <div v-if="activeTab === 'thoughts'" class="space-y-4">
        <ThoughtCard
          v-for="(post, i) in profilePosts"
          :key="post.id"
          :post="post"
          :index="i"
        />
        <div v-if="profilePosts.length === 0" class="text-center py-16">
          <p class="font-mono text-xs text-mist-dim/40">no thoughts yet</p>
        </div>
      </div>

      <!-- Tab: obsessed -->
      <div v-if="activeTab === 'obsessed'" class="space-y-4">
        <ThoughtCard
          v-for="(post, i) in obsessedPosts"
          :key="post.id"
          :post="post"
          :index="i"
        />
        <div v-if="obsessedPosts.length === 0" class="text-center py-16">
          <p class="font-mono text-xs text-mist-dim/40">nothing marked obsessed yet</p>
        </div>
      </div>

      <!-- Tab: collabs -->
      <div v-if="activeTab === 'collabs'" class="space-y-4">
        <ThoughtCard
          v-for="(post, i) in collabPosts"
          :key="post.id"
          :post="post"
          :index="i"
        />
        <div v-if="collabPosts.length === 0" class="text-center py-16">
          <p class="font-mono text-xs text-mist-dim/40">no collabs yet</p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import { mockPosts } from '@/data/mockPosts.js'
import ThoughtCard from '@/components/ThoughtCard.vue'

const props = defineProps({
  username: { type: String, required: true },
})

const route  = useRoute()
const auth   = useAuthStore()

const activeTab = ref('thoughts')

const tabs = [
  { value: 'thoughts', label: 'thoughts' },
  { value: 'obsessed', label: '🔥 obsessed' },
  { value: 'collabs',  label: '⚡ collabs' },
]

const isOwnProfile = computed(() => props.username === auth.user.username)

const profile = computed(() => {
  if (isOwnProfile.value) return auth.user
  // mock other profiles
  const found = mockPosts.find(p => p.user.username === props.username)
  if (found) {
    return {
      ...found.user,
      bio: 'somewhere between midnight and morning.',
      joinedAt: 'Jan 2025',
      stats: { thoughts: 12, stillObsessed: 5, collabs: 2 },
    }
  }
  return {
    username: props.username,
    initials: props.username.slice(0, 2).toUpperCase(),
    bio: '...',
    joinedAt: '2025',
    stats: { thoughts: 0, stillObsessed: 0, collabs: 0 },
  }
})

const stats = computed(() => [
  {
    label: 'thoughts',
    value: profile.value.stats?.thoughts ?? 0,
    color: 'text-mist-bright',
  },
  {
    label: 'obsessed',
    value: profile.value.stats?.stillObsessed ?? 0,
    color: 'text-ember',
  },
  {
    label: 'collabs',
    value: profile.value.stats?.collabs ?? 0,
    color: 'text-amber-400',
  },
])

const profilePosts = computed(() =>
  mockPosts.filter(p => p.user.username === props.username)
)

const obsessedPosts = computed(() =>
  profilePosts.value.filter(p => p.reflectionStatus === 'Still Obsessed')
)

const collabPosts = computed(() =>
  profilePosts.value.filter(p => p.tags.includes('#collab'))
)
</script>
