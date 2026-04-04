<template>
  <div class="pl-4 border-l-2 border-gray-800 mb-3">
    <div class="flex items-start gap-2 mb-1">
      <span class="font-['Syne'] font-extrabold text-[#47d4ff] text-sm">{{ reply.callsign }}</span>
      <span class="font-mono text-xs text-gray-500">{{ formatTime(reply.$createdAt) }}</span>
    </div>
    <div class="font-mono text-sm text-gray-300 whitespace-pre-wrap" v-html="renderMarkdown(reply.content)"></div>
  </div>
</template>

<script setup>
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const props = defineProps({
  reply: Object
});

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
</script>