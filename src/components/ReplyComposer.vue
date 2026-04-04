<template>
  <div class="mt-2 pl-4">
    <div class="flex gap-2 items-start">
      <textarea
        v-model="replyContent"
        :placeholder="`Reply as ${authStore.callsign || '...'}`"
        maxlength="500"
        rows="2"
        class="flex-1 bg-black/50 border border-gray-700 p-2 font-mono text-sm text-white placeholder-gray-500 focus:border-[#47d4ff] outline-none resize-none"
        @keydown.enter.ctrl="submitReply"
        @keydown.enter.meta="submitReply"
      ></textarea>
      <button
        @click="submitReply"
        :disabled="!replyContent.trim() || isLoading"
        class="bg-[#e8ff47] text-black font-mono text-sm font-bold px-4 py-2 hover:bg-[#47d4ff] transition-colors disabled:opacity-50"
      >
        {{ isLoading ? '...' : '→' }}
      </button>
    </div>
    <div class="flex justify-between mt-1">
      <span class="font-mono text-xs text-gray-500">{{ replyContent.length }}/500</span>
      <span class="font-mono text-xs text-gray-500">Ctrl+Enter to send</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { databases, ID, DB_ID, POSTS_ID, REPLIES_ID } from '../lib/appwrite';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
  postId: String
});

const emit = defineEmits(['reply-submitted']);
const authStore = useAuthStore();
const replyContent = ref('');
const isLoading = ref(false);

async function submitReply() {
  if (!replyContent.value.trim()) return;
  if (!authStore.user) {
    authStore.showAuthModal = true;
    return;
  }

  isLoading.value = true;

  try {
    await databases.createDocument(DB_ID, REPLIES_ID, ID.unique(), {
      content: replyContent.value.trim(),
      postId: props.postId,
      userId: authStore.user.$id,
      callsign: authStore.callsign
    });

    const post = await databases.getDocument(DB_ID, POSTS_ID, props.postId);
    await databases.updateDocument(DB_ID, POSTS_ID, props.postId, {
      score: (post.score || 0) + 8,
      replyCount: (post.replyCount || 0) + 1
    });

    replyContent.value = '';
    emit('reply-submitted');
  } catch (error) {
    console.error('Failed to submit reply:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>