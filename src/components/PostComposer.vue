<template>
  <div class="border-b border-gray-800 mb-6 p-4 bg-[#0a0a0f]/50">
    <div class="flex gap-3 mb-3">
      <button
        v-for="type in postTypes"
        :key="type.value"
        @click="selectedType = type.value"
        :class="[
          'px-3 py-1 font-mono text-sm transition-colors',
          selectedType === type.value
            ? 'bg-[#e8ff47] text-black'
            : 'bg-transparent border border-gray-700 text-gray-400 hover:border-[#47d4ff]'
        ]"
      >
        {{ type.label }}
      </button>
    </div>

    <textarea
      v-model="content"
      placeholder="What's on your mind at 3am?"
      maxlength="2000"
      rows="4"
      class="w-full bg-black/50 border border-gray-700 p-3 font-mono text-white placeholder-gray-500 focus:border-[#47d4ff] outline-none resize-none"
    ></textarea>

    <div v-if="selectedType === 'project'" class="mt-3">
      <input
        v-model="url"
        type="url"
        placeholder="Project URL (optional)"
        class="w-full bg-black/50 border border-gray-700 p-3 font-mono text-white placeholder-gray-500 focus:border-[#47d4ff] outline-none"
      />
    </div>

    <div class="flex justify-between items-center mt-3">
      <span class="font-mono text-xs text-gray-500">{{ content.length }}/2000</span>
      <button
        @click="submitPost"
        :disabled="!content.trim() || isLoading"
        class="bg-[#e8ff47] text-black font-mono font-bold px-6 py-2 hover:bg-[#47d4ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isLoading ? 'POSTING...' : 'POST' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { databases, ID, DB_ID, POSTS_ID } from '../lib/appwrite';
import { useAuthStore } from '../stores/auth';

const emit = defineEmits(['post-created']);
const authStore = useAuthStore();

const postTypes = [
  { value: 'thought', label: 'THOUGHT' },
  { value: 'project', label: 'PROJECT' },
  { value: 'help', label: 'HELP' },
  { value: 'rant', label: 'RANT' }
];

const selectedType = ref('thought');
const content = ref('');
const url = ref('');
const isLoading = ref(false);

async function fetchOGMetadata(urlToFetch) {
  try {
    const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(urlToFetch)}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        ogTitle: data.data.title || '',
        ogDescription: data.data.description || '',
        ogImageUrl: data.data.image?.url || ''
      };
    }
  } catch (error) {
    console.error('Failed to fetch OG metadata:', error);
  }
  return { ogTitle: '', ogDescription: '', ogImageUrl: '' };
}

async function submitPost() {
  if (!content.value.trim()) return;
  if (!authStore.user) {
    authStore.showAuthModal = true;
    return;
  }

  isLoading.value = true;
  
  let metadata = {};
  if (selectedType.value === 'project' && url.value) {
    metadata = await fetchOGMetadata(url.value);
  }

  try {
    await databases.createDocument(DB_ID, POSTS_ID, ID.unique(), {
      content: content.value.trim(),
      type: selectedType.value,
      userId: authStore.user.$id,
      callsign: authStore.callsign,
      score: 0,
      replyCount: 0,
      url: url.value || null,
      ogTitle: metadata.ogTitle || null,
      ogDescription: metadata.ogDescription || null,
      ogImageUrl: metadata.ogImageUrl || null
    });

    content.value = '';
    url.value = '';
    selectedType.value = 'thought';
    emit('post-created');
  } catch (error) {
    console.error('Failed to create post:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>