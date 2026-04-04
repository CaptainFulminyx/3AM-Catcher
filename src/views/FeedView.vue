<template>
  <div class="max-w-3xl mx-auto">
    <PostComposer @post-created="loadPosts" />
    
    <div v-if="posts.length === 0 && !loading" class="text-center py-12">
      <p class="font-mono text-gray-500">No posts yet. Be the first to break the silence at 3am.</p>
    </div>

    <div v-else class="space-y-0">
      <PostItem v-for="post in posts" :key="post.$id" :post="post" />
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="font-mono text-gray-500">Loading...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { databases, DB_ID, POSTS_ID } from '../lib/appwrite';
import { useAuthStore } from '../stores/auth';
import PostComposer from '../components/PostComposer.vue';
import PostItem from '../components/PostItem.vue';

const authStore = useAuthStore();
const posts = ref([]);
const loading = ref(true);
let unsubscribe = null;

async function loadPosts() {
  loading.value = true;
  try {
    const response = await databases.listDocuments(DB_ID, POSTS_ID, [
      'orderDesc("$createdAt")'
    ]);
    posts.value = response.documents;
  } catch (error) {
    console.error('Failed to load posts:', error);
  } finally {
    loading.value = false;
  }
}

function setupRealtime() {
  unsubscribe = databases.client.subscribe(`databases.${DB_ID}.collections.${POSTS_ID}.documents`, () => {
    loadPosts();
  });
}

onMounted(async () => {
  await authStore.checkAuth();
  await loadPosts();
  setupRealtime();
});

onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>