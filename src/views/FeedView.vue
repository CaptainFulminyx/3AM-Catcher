<template>
  <div class="min-h-screen bg-night-950">

    <!-- Hero header -->
    <div class="pt-28 pb-10 px-6 max-w-2xl mx-auto">
      <div class="flex items-center gap-2 mb-3">
        <span class="font-mono text-xs text-mist-dim tabular-nums">{{ todayLabel }}</span>
        <span class="text-night-600">·</span>
        <span class="font-mono text-xs text-ember/70">{{ activePosts.length }} thoughts last night</span>
      </div>
      <h1 class="font-display font-800 text-3xl text-mist-bright leading-tight tracking-tight">
        what kept people up<br />
        <span class="text-ember">last night</span>
      </h1>
    </div>

    <!-- Filter bar -->
    <div class="sticky top-16 z-40 bg-night-950/90 backdrop-blur-md border-b border-night-800/60">
      <div class="max-w-2xl mx-auto px-6 py-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          @click="activeFilter = null"
          :class="[
            'flex-shrink-0 text-xs font-mono px-3 py-1.5 rounded-full border transition-all duration-200',
            activeFilter === null
              ? 'border-ember/60 text-ember bg-ember/10'
              : 'border-night-600 text-mist-dim hover:border-mist-dim/40 hover:text-mist'
          ]"
        >
          all
        </button>
        <button
          v-for="tag in availableTags"
          :key="tag.value"
          @click="activeFilter = activeFilter === tag.value ? null : tag.value"
          :class="[
            'flex-shrink-0 text-xs font-mono px-3 py-1.5 rounded-full border transition-all duration-200',
            activeFilter === tag.value ? tag.activeClass : 'border-night-600 text-mist-dim hover:border-mist-dim/40 hover:text-mist'
          ]"
        >
          {{ tag.value }}
        </button>

        <div class="flex-shrink-0 w-px h-4 bg-night-700 mx-1" />

        <!-- Graveyard toggle -->
        <button
          @click="showGraveyard = !showGraveyard"
          :class="[
            'flex-shrink-0 text-xs font-mono px-3 py-1.5 rounded-full border transition-all duration-200',
            showGraveyard
              ? 'border-rose-800/60 text-rose-500 bg-rose-950/30'
              : 'border-night-600 text-mist-dim hover:border-rose-800/40 hover:text-rose-500/70'
          ]"
        >
          💀 graveyard
        </button>
      </div>
    </div>

    <!-- Main content -->
    <div class="max-w-2xl mx-auto px-6 py-6 space-y-4">

      <!-- Graveyard section -->
      <template v-if="showGraveyard">
        <div class="mb-2">
          <p class="font-mono text-xs text-mist-dim/60 mb-1">ideas people abandoned — revive one</p>
          <div class="h-px bg-gradient-to-r from-rose-900/40 to-transparent" />
        </div>

        <article
          v-for="(post, i) in graveyardPosts"
          :key="post.id"
          class="relative rounded-2xl border border-rose-900/30 bg-rose-950/10 p-5 animate-fade-up"
          :style="{ animationDelay: `${i * 60}ms` }"
        >
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-night-800 border border-rose-900/40 flex items-center justify-center text-xs font-mono text-rose-600/60">
                {{ post.user.initials }}
              </div>
              <div>
                <p class="text-sm font-display font-600 text-mist-dim line-through decoration-rose-900/60">
                  {{ post.user.username }}
                </p>
                <p class="text-xs font-mono text-mist-dim/40">buried {{ post.buriedAt }}</p>
              </div>
            </div>
            <span class="font-mono text-xs text-rose-600/50 tabular-nums">{{ post.postTime }}</span>
          </div>

          <p class="text-mist/60 text-sm leading-relaxed mb-4 font-body italic">
            "{{ post.content }}"
          </p>

          <div class="flex items-center justify-between">
            <div class="flex gap-1.5">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="text-xs font-mono px-2 py-0.5 rounded-full border border-rose-900/30 text-rose-600/50"
              >
                {{ tag }}
              </span>
            </div>
            <button
              @click="revivePost(post)"
              class="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full border border-rose-800/40 text-rose-400/70
                     hover:border-rose-500/60 hover:text-rose-400 hover:bg-rose-950/40 transition-all duration-200"
            >
              ✦ revive
              <span class="text-rose-600/50">{{ post.revivals }}</span>
            </button>
          </div>
        </article>
      </template>

      <!-- Feed -->
      <template v-else>
        <TransitionGroup name="list" tag="div" class="space-y-4">
          <ThoughtCard
            v-for="(post, i) in filteredPosts"
            :key="post.id"
            :post="post"
            :index="i"
            @react="onReact"
          />
        </TransitionGroup>

        <!-- Empty state -->
        <div
          v-if="filteredPosts.length === 0"
          class="text-center py-20 animate-fade-up"
        >
          <p class="text-4xl mb-4">🌑</p>
          <p class="font-display text-mist-dim">nothing with {{ activeFilter }} yet tonight</p>
          <p class="font-mono text-xs text-mist-dim/40 mt-2">be the first</p>
        </div>

        <!-- End of feed -->
        <div v-if="filteredPosts.length > 0" class="text-center py-12">
          <div class="inline-flex items-center gap-3">
            <div class="h-px w-16 bg-gradient-to-r from-transparent to-night-700" />
            <span class="font-mono text-xs text-mist-dim/40">that's last night</span>
            <div class="h-px w-16 bg-gradient-to-l from-transparent to-night-700" />
          </div>
        </div>
      </template>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ThoughtCard from '@/components/ThoughtCard.vue'
import { mockPosts, mockGraveyardPosts } from '@/data/mockPosts.js'

const activeFilter = ref(null)
const showGraveyard = ref(false)

const availableTags = [
  { value: '#idea',     activeClass: 'border-sky-500/50 text-sky-400 bg-sky-950/40' },
  { value: '#rant',     activeClass: 'border-rose-500/50 text-rose-400 bg-rose-950/40' },
  { value: '#question', activeClass: 'border-violet-500/50 text-violet-400 bg-violet-950/40' },
  { value: '#collab',   activeClass: 'border-amber-500/50 text-amber-400 bg-amber-950/40' },
  { value: '#creative', activeClass: 'border-emerald-500/50 text-emerald-400 bg-emerald-950/40' },
]

const activePosts = ref([...mockPosts])
const graveyardPosts = ref([...mockGraveyardPosts])

const filteredPosts = computed(() => {
  if (!activeFilter.value) return activePosts.value
  return activePosts.value.filter(p => p.tags.includes(activeFilter.value))
})

const todayLabel = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
})

function onReact({ postId, reaction }) {
  const post = activePosts.value.find(p => p.id === postId)
  if (!post) return
  post.userReaction = reaction
}

function revivePost(post) {
  post.revivals++
}

// Called from App.vue when a new thought is posted
function addPost(post) {
  activePosts.value.unshift(post)
}

defineExpose({ addPost })
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.list-enter-active { transition: all 0.35s ease; }
.list-enter-from   { opacity: 0; transform: translateY(-10px); }
</style>