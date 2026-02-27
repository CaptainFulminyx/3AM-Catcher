<template>
  <div class="min-h-screen bg-night-950">
    <div class="max-w-2xl mx-auto px-6 pt-24 pb-16">

      <!-- Back -->
      <button
        @click="$router.back()"
        class="flex items-center gap-2 text-xs font-mono text-mist-dim hover:text-mist transition-colors duration-200 mb-8 group"
      >
        <span class="group-hover:-translate-x-1 transition-transform duration-200">←</span>
        back to feed
      </button>

      <!-- Loading -->
      <div v-if="!post" class="text-center py-32">
        <p class="font-mono text-xs text-mist-dim/40 animate-pulse-slow">loading...</p>
      </div>

      <template v-else>
        <!-- Main post card (expanded) -->
        <article class="rounded-2xl border border-night-700/60 bg-night-900/60 backdrop-blur-sm p-6 mb-6">

          <!-- Header -->
          <div class="flex items-start justify-between mb-5">
            <div class="flex items-center gap-3">
              <router-link
                :to="`/profile/${post.user.username}`"
                class="w-10 h-10 rounded-full bg-night-700 border border-night-600 flex items-center justify-center
                       text-sm font-mono text-mist hover:border-ember/60 transition-colors duration-200"
              >
                {{ post.user.initials }}
              </router-link>
              <div>
                <router-link
                  :to="`/profile/${post.user.username}`"
                  class="text-base font-display font-600 text-mist-bright hover:text-ember transition-colors duration-200 leading-none block"
                >
                  {{ post.user.username }}
                </router-link>
                <span class="text-xs text-mist-dim mt-0.5 block">{{ timeAgo }}</span>
              </div>
            </div>

            <!-- Sacred timestamp -->
            <div class="flex flex-col items-end gap-1.5">
              <span class="font-mono text-sm text-ember tabular-nums">{{ post.postTime }}</span>
              <ReflectionBadge v-if="post.reflectionStatus" :status="post.reflectionStatus" />
            </div>
          </div>

          <!-- Content -->
          <p class="text-mist-bright text-base leading-relaxed mb-5 font-body">
            {{ post.content }}
          </p>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 mb-6">
            <span
              v-for="tag in post.tags"
              :key="tag"
              :class="tagClass(tag)"
              class="text-xs font-mono px-2.5 py-1 rounded-full border"
            >
              {{ tag }}
            </span>
          </div>

          <!-- Reactions -->
          <div class="border-t border-night-700/60 pt-5">
            <ReactionBar
              :postId="post.id"
              :initialCounts="post.reactions"
              :initialReaction="post.userReaction"
              @react="onReact"
            />
          </div>

          <!-- Collab CTA -->
          <div
            v-if="post.tags.includes('#collab')"
            class="mt-5 rounded-xl border border-amber-500/20 bg-amber-950/20 p-4 flex items-center justify-between"
          >
            <div>
              <p class="text-sm font-display font-600 text-amber-300">this needs a team</p>
              <p class="text-xs text-mist-dim mt-0.5">slide into the collab thread</p>
            </div>
            <button
              class="px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300
                     text-xs font-mono hover:bg-amber-500/30 transition-all duration-200"
            >
              ⚡ i want in
            </button>
          </div>
        </article>

        <!-- Morning reflection -->
        <div
          v-if="post.user.id === 'u0' && !post.reflectionStatus"
          class="rounded-2xl border border-night-700/40 bg-night-900/40 p-5 mb-6"
        >
          <p class="text-sm font-body text-mist-dim mb-1">
            you thought this at <span class="text-ember font-mono">{{ post.postTime }}</span> — still feel it?
          </p>
          <p class="text-xs text-mist-dim/40 font-mono mb-4">morning has come. time to reflect.</p>
          <div class="flex gap-2">
            <button
              v-for="status in reflectionOptions"
              :key="status.value"
              @click="setReflection(status.value)"
              :class="status.class"
              class="flex-1 text-xs font-mono py-2 px-3 rounded-full border transition-all duration-200 text-center"
            >
              {{ status.label }}
            </button>
          </div>
        </div>

        <!-- Comments section -->
        <div class="space-y-1">
          <div class="flex items-center justify-between mb-4">
            <p class="font-display font-600 text-sm text-mist-bright">
              {{ comments.length }} responses
            </p>
          </div>

          <!-- Comment input -->
          <div class="rounded-2xl border border-night-700/60 bg-night-900/60 p-4 mb-4">
            <textarea
              v-model="newComment"
              placeholder="add to the thought..."
              rows="2"
              class="w-full bg-transparent text-sm text-mist-bright placeholder-mist-dim/40
                     font-body resize-none outline-none border-none focus:ring-0 leading-relaxed"
            />
            <div class="flex justify-end mt-2">
              <button
                @click="postComment"
                :disabled="!newComment.trim()"
                :class="newComment.trim()
                  ? 'bg-ember text-night-950 hover:bg-ember-glow shadow-lg shadow-ember/20'
                  : 'bg-night-700 text-mist-dim cursor-not-allowed'"
                class="px-4 py-1.5 rounded-full text-xs font-display font-600 transition-all duration-200"
              >
                reply
              </button>
            </div>
          </div>

          <!-- Comments list -->
          <TransitionGroup name="list" tag="div" class="space-y-3">
            <div
              v-for="comment in comments"
              :key="comment.id"
              class="rounded-xl border border-night-700/40 bg-night-900/40 p-4 animate-fade-up"
            >
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 rounded-full bg-night-700 border border-night-600 flex items-center justify-center text-xs font-mono text-mist">
                    {{ comment.user.initials }}
                  </div>
                  <span class="text-xs font-display font-600 text-mist">{{ comment.user.username }}</span>
                </div>
                <span class="font-mono text-xs text-mist-dim/50 tabular-nums">{{ comment.postTime }}</span>
              </div>
              <p class="text-sm text-mist-bright/80 font-body leading-relaxed">{{ comment.content }}</p>
            </div>
          </TransitionGroup>

          <!-- No comments -->
          <div v-if="comments.length === 0" class="text-center py-10">
            <p class="font-mono text-xs text-mist-dim/40">no replies yet — be the first</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { mockPosts } from '@/data/mockPosts.js'
import ReactionBar from '@/components/ReactionBar.vue'
import ReflectionBadge from '@/components/ReflectionBadge.vue'

const route = useRoute()
const post = ref(mockPosts.find(p => p.id === route.params.id) ?? null)
const newComment = ref('')

const mockComments = [
  {
    id: 'c1',
    user: { username: 'voidwalker__', initials: 'VW' },
    content: 'this is exactly what i needed to read at 4am. adding it to the graveyard if you ever burn it.',
    postTime: '4:12 AM',
  },
  {
    id: 'c2',
    user: { username: 'entropymachine', initials: 'EM' },
    content: 'been thinking about this for an hour. you broke my brain in the best way.',
    postTime: '4:51 AM',
  },
]

const comments = ref(post.value ? [...mockComments] : [])

const reflectionOptions = [
  { value: 'Still Obsessed', label: '🔥 still obsessed', class: 'border-ember/40 text-ember hover:bg-ember/10' },
  { value: 'Meh',            label: '🌫 meh',            class: 'border-mist-dim/30 text-mist-dim hover:bg-night-700' },
  { value: 'Burn It',        label: '💀 burn it',        class: 'border-rose-900/50 text-rose-500 hover:bg-rose-950/30' },
]

const timeAgo = computed(() => {
  if (!post.value) return ''
  const diff = Date.now() - new Date(post.value.timestamp).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
})

const tagColors = {
  '#idea':     'border-sky-500/30 text-sky-400 bg-sky-950/40',
  '#rant':     'border-rose-500/30 text-rose-400 bg-rose-950/40',
  '#question': 'border-violet-500/30 text-violet-400 bg-violet-950/40',
  '#collab':   'border-amber-500/30 text-amber-400 bg-amber-950/40',
  '#creative': 'border-emerald-500/30 text-emerald-400 bg-emerald-950/40',
}

function tagClass(tag) {
  return tagColors[tag] ?? 'border-night-600 text-mist-dim bg-night-800'
}

function onReact({ reaction }) {
  if (post.value) post.value.userReaction = reaction
}

function setReflection(status) {
  if (post.value) post.value.reflectionStatus = status
}

function postComment() {
  if (!newComment.value.trim()) return
  comments.value.push({
    id: `c${Date.now()}`,
    user: { username: 'you', initials: 'YO' },
    content: newComment.value.trim(),
    postTime: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
  })
  newComment.value = ''
}
</script>

<style scoped>
.list-enter-active { transition: all 0.3s ease; }
.list-enter-from   { opacity: 0; transform: translateY(-8px); }
</style>