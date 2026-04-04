<template>
  <div class="border-b border-gray-800 p-4 hover:bg-white/5 transition-colors">
    <div class="flex items-start justify-between mb-2">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="font-['Syne'] font-extrabold text-[#47d4ff]">{{ post.callsign }}</span>
        <span class="font-mono text-xs text-gray-500">{{ formatTime(post.$createdAt) }}</span>
        <span :class="typeColor" class="px-2 py-0.5 font-mono text-xs font-bold uppercase tracking-wider">
          {{ post.type }}
        </span>
      </div>
      <div class="flex items-center gap-2 font-mono text-xs text-gray-500">
        <span>💬 {{ post.replyCount || 0 }}</span>
        <span>⚡ {{ post.score || 0 }}</span>
      </div>
    </div>

    <div class="font-mono text-gray-300 whitespace-pre-wrap mb-3" v-html="renderMarkdown(post.content)"></div>

    <div v-if="post.type === 'project' && post.url" class="mb-3">
      <a :href="post.url" target="_blank" class="block border border-gray-700 p-3 hover:border-[#47d4ff] transition-colors">
        <div v-if="post.ogImageUrl" class="mb-2">
          <img :src="post.ogImageUrl" alt="Preview" class="w-full h-32 object-cover">
        </div>
        <div v-if="post.ogTitle" class="font-['Syne'] font-bold text-[#e8ff47] mb-1">{{ post.ogTitle }}</div>
        <div v-if="post.ogDescription" class="font-mono text-sm text-gray-400">{{ post.ogDescription }}</div>
        <div class="font-mono text-xs text-[#47d4ff] mt-2 break-all">{{ post.url }}</div>
      </a>
    </div>

    <button
      @click="toggleReplies"
      class="font-mono text-xs text-gray-500 hover:text-[#47d4ff] transition-colors mb-2"
    >
      {{ showReplies ? '▼ HIDE REPLIES' : '▶ SHOW REPLIES' }}
    </button>

    <div v-if="showReplies" class="mt-3 space-y-3">
      <ReplyItem v-for="reply in replies" :key="reply.$id" :reply="reply" />
      <ReplyComposer :postId="post.$id" @reply-submitted="loadReplies" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { databases, DB_ID, REPLIES_ID } from '../lib/appwrite';
import ReplyItem from './ReplyItem.vue';
import ReplyComposer from './ReplyComposer.vue';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const props = defineProps({
  post: Object
});

const showReplies = ref(false);
const replies = ref([]);

const typeColor = {
  thought: 'bg-gray-700 text-gray-300',
  project: 'bg-[#47d4ff]/20 text-[#47d4ff]',
  help: 'bg-[#e8ff47]/20 text-[#e8ff47]',
  rant: 'bg-red-500/20 text-red-400'
};

function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return `${Math.floor(minutes / 1440)}d ago`;
}

function renderMarkdown(content) {
  const html = marked.parse(content);
  return DOMPurify.sanitize(html);
}

async function loadReplies() {
  const response = await databases.listDocuments(DB_ID, REPLIES_ID, [
    `postId="${props.post.$id}"`
  ]);
  replies.value = response.documents;
}

async function toggleReplies() {
  showReplies.value = !showReplies.value;
  if (showReplies.value && replies.value.length === 0) {
    await loadReplies();
  }
}
</script>