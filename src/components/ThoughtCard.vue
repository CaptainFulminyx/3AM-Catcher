<template>
  <article
    @click="goToPost"
    class="group relative rounded-2xl border border-night-700/60 bg-night-900/60 backdrop-blur-sm p-5 cursor-pointer
           hover:border-night-600 hover:bg-night-800/60 transition-all duration-300 animate-fade-up"
    :style="{ animationDelay: `${index * 60}ms` }"
  >
    <!-- Top row: user + time -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-2.5">
        <!-- Avatar -->
        <router-link
          :to="`/profile/${post.user.username}`"
          @click.stop
          class="w-8 h-8 rounded-full bg-night-700 border border-night-600 flex items-center justify-center
                 text-xs font-mono text-mist flex-shrink-0 hover:border-ember/60 transition-colors duration-200"
        >
          {{ post.user.initials }}
        </router-link>

        <!-- Username + timestamp -->
        <div class="flex flex-col">
          <router-link
            :to="`/profile/${post.user.username}`"
            @click.stop
            class="text-sm font-display font-600 text-mist-bright hover:text-ember transition-colors duration-200 leading-none"
          >
            {{ post.user.username }}
          </router-link>
          <span class="text-xs text-mist-dim mt-0.5">{{ timeAgo }}</span>
        </div>
      </div>

      <!-- Sacred timestamp -->
      <div class="flex flex-col items-end gap-1">
        <span class="font-mono text-xs text-ember/80 tabular-nums">{{ post.postTime }}</span>
        <ReflectionBadge v-if="post.reflectionStatus" :status="post.reflectionStatus" />
      </div>
    </div>

    <!-- Content -->
    <p class="text-mist-bright/90 text-sm leading-relaxed mb-4 font-body">
      {{ post.content }}
    </p>

    <!-- Tags -->
    <div class="flex flex-wrap gap-1.5 mb-4">
      <span
        v-for="tag in post.tags"
        :key="tag"
        :class="tagClass(tag)"
        class="text-xs font-mono px-2 py-0.5 rounded-full border"
      >
        {{ tag }}
      </span>
    </div>

    <!-- Bottom row: reactions + comments -->
    <div class="flex items-center justify-between">
      <ReactionBar
        :postId="post.id"
        :initialCounts="post.reactions"
        :initialReaction="post.userReaction"
        @react="onReact"
      />

      <div class="flex items-center gap-1 text-xs text-mist-dim font-mono">
        <span>💬</span>
        <span>{{ post.comments }}</span>
      </div>
    </div>

    <!-- Collab glow for #collab posts -->
    <div
      v-if="post.tags.includes('#collab')"
      class="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style="box-shadow: inset 0 0 40px 0 rgba(255, 107, 53, 0.04);"
    />
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import ReactionBar from './ReactionBar.vue'
import ReflectionBadge from './ReflectionBadge.vue'

const props = defineProps({
  post: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

const emit = defineEmits(['react'])
const router = useRouter()

function goToPost() {
  router.push({ name: 'post', params: { id: props.post.id } })
}

function onReact(payload) {
  emit('react', payload)
}

const timeAgo = computed(() => {
  const diff = Date.now() - new Date(props.post.timestamp).getTime()
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
</script>