<template>
  <div class="page-wrapper">
    <Nav title="Idéra" @toggle-menu="handleMenu" />

    <!-- Hero -->
    <div class="hero-area">
      <div class="hero-label">FEED</div>
      <h1 class="hero-title">What's on your mind?</h1>
    </div>

    <main class="feed-container">
      <!-- Masonry Grid -->
      <div class="masonry-grid">
        <div
          v-for="post in posts"
          :key="post.id"
          class="post-card"
          @click="openPost(post)"
        >
          <div class="post-age" v-if="post.ageHours">
            {{ formatAge(post.ageHours) }}
          </div>
          <p class="post-text">{{ post.content }}</p>
          <div class="post-footer">
            <span class="post-author">{{ post.uName || "anon" }}</span>
            <span class="post-expand-hint">↗</span>
          </div>
        </div>
      </div>

      <!-- Infinite scroll sentinel -->
      <div ref="loadMoreSentry" class="loading-trigger">
        <div v-if="loading" class="loading-state">
          <div class="skeleton-card skeleton-tall"></div>
          <div class="skeleton-card skeleton-short"></div>
          <div class="skeleton-card skeleton-mid"></div>
        </div>
        <div v-if="exhausted && !loading" class="end-state">
          <span class="end-dot"></span>
          <span class="end-text">You've reached the end</span>
          <span class="end-dot"></span>
        </div>
      </div>
    </main>

    <!-- Expanded Post Modal -->
    <Transition name="modal">
      <div v-if="activePost" class="modal-overlay" @click.self="closePost">
        <div class="modal-card">
          <button class="modal-close" @click="closePost">✕</button>
          <div class="modal-age" v-if="activePost.ageHours">
            {{ formatAge(activePost.ageHours) }} ago
          </div>
          <p class="modal-text">{{ activePost.content }}</p>
          <div class="modal-footer">
            <span class="modal-author">{{ activePost.uName || "anon" }}</span>
            <a
              v-if="activePost.collab && activePost.email"
              :href="`mailto:${activePost.email}`"
              class="collab-btn"
              @click.stop
            >
              Collab ↗
            </a>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import Nav from "../components/NavBar.vue";
import { mockDatabase } from "../data/mockPosts.js";

const posts = ref([]);
const loading = ref(false);
const exhausted = ref(false);
const loadMoreSentry = ref(null);
const activePost = ref(null);

const currentPage = ref(0);
const itemsPerPage = 6;

// In script setup — replace fetchMorePosts
const fetchMorePosts = async () => {
  if (loading.value || exhausted.value) return;

  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 900));

  const start = currentPage.value * itemsPerPage;
  const end = start + itemsPerPage;
  const nextBatch = mockDatabase.slice(start, end);

  if (nextBatch.length > 0) {
    // Auto-generate a stable id if the data doesn't have one
    const withIds = nextBatch.map((post, i) => ({
      id: post.id ?? `post-${start + i}`,
      ...post,
    }));
    posts.value.push(...withIds);
    currentPage.value++;
  }

  if (posts.value.length >= mockDatabase.length) {
    exhausted.value = true;
  }

  loading.value = false;

  // KEY FIX: if the page still isn't scrollable, keep loading
  await nextTick();
  const sentinel = loadMoreSentry.value;
  if (sentinel && !exhausted.value) {
    const rect = sentinel.getBoundingClientRect();
    if (rect.top < window.innerHeight + 400) {
      fetchMorePosts();
    }
  }
};

const openPost = (post) => {
  activePost.value = post;
  document.body.style.overflow = "hidden";
};

const closePost = () => {
  activePost.value = null;
  document.body.style.overflow = "";
};

const handleMenu = () => {
  // wire up to your sidebar/drawer toggle
};

const formatAge = (hours) => {
  if (hours < 1) return "< 1h";
  if (hours < 24) return `${Math.floor(hours)}h`;
  return `${Math.floor(hours / 24)}d`;
};

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) fetchMorePosts();
    },
    { rootMargin: "400px" },
  );

  if (loadMoreSentry.value) observer.observe(loadMoreSentry.value);
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap");
@import "tailwindcss";

:root {
  --bg: #111210;
  --surface: #1c1d1a;
  --card-bg: #afd;
  --card-muted: #e8e2d6;
  --ink: #000;
  --ink-muted: #333;
  --accent: #c8922a;
  --accent-dim: #7a5618;
  --radius: 14px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: var(--bg);
  font-family: "DM Sans", sans-serif;
}

/* ── PAGE WRAPPER ── */
.page-wrapper {
  min-height: 100svh;
  background: var(--bg);
}

/* ── HERO ── */
.hero-area {
  padding: 6rem 1.5rem 3rem;
  max-width: 52rem;
  margin: 0 auto;
}

.hero-label {
  font-family: "DM Sans", sans-serif;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.25em;
  color: var(--accent);
  margin-bottom: 0.75rem;
}

.hero-title {
  font-family: "Playfair Display", serif;
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 400;
  color: #f0ebe0;
  line-height: 1.1;
}

/* ── FEED ── */
.feed-container {
  padding: 0 1rem 5rem;
  max-width: 1280px;
  margin: 0 auto;
}

/* CSS columns masonry */
.masonry-grid {
  column-count: 2;
  column-gap: 0.75rem;
}

@media (min-width: 640px) {
  .masonry-grid {
    column-count: 2;
  }
}
@media (min-width: 900px) {
  .masonry-grid {
    column-count: 3;
  }
}
@media (min-width: 1200px) {
  .masonry-grid {
    column-count: 4;
  }
}

/* ── POST CARD ── */
.post-card {
  background: var(--card-bg);
  border-radius: var(--radius);
  padding: 1.25rem 1.25rem 1rem;
  margin-bottom: 0.75rem;
  break-inside: avoid;
  display: inline-block;
  width: 100%;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
  position: relative;
  overflow: hidden;
}

.post-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(200, 146, 42, 0.08) 0%,
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.35);
}

.post-card:hover::before {
  opacity: 1;
}

.post-age {
  font-size: 0.6rem;
  font-weight: 500;
  letter-spacing: 0.15em;
  color: var(--accent);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
}

.post-text {
  font-family: "DM Sans", sans-serif;
  font-size: 0.88rem;
  line-height: 1.65;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.9rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--card-muted);
}

.post-author {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--ink-muted);
  letter-spacing: 0.05em;
}

.post-expand-hint {
  font-size: 0.8rem;
  color: var(--accent-dim);
  opacity: 0;
  transition: opacity 0.15s;
}

.post-card:hover .post-expand-hint {
  opacity: 1;
}

/* ── LOADING SKELETONS ── */
.loading-trigger {
  padding: 1.5rem 0 3rem;
}

.loading-state {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
}

@media (max-width: 640px) {
  .loading-state {
    grid-template-columns: 1fr 1fr;
  }
  .skeleton-tall:last-child {
    display: none;
  }
}

.skeleton-card {
  background: var(--surface);
  border-radius: var(--radius);
  animation: shimmer 1.4s ease-in-out infinite;
  background-image: linear-gradient(
    90deg,
    var(--surface) 0%,
    #2a2b28 50%,
    var(--surface) 100%
  );
  background-size: 200% 100%;
}

.skeleton-tall {
  height: 9rem;
}
.skeleton-short {
  height: 5.5rem;
}
.skeleton-mid {
  height: 7rem;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* ── END STATE ── */
.end-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 2rem 0;
}

.end-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--accent-dim);
}

.end-text {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-muted);
}

/* ── MODAL ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(10, 10, 9, 0.85);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-card {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 2.25rem 2rem 1.75rem;
  max-width: 560px;
  width: 100%;
  position: relative;
  max-height: 85svh;
  overflow-y: auto;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.6);
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--card-muted);
  border: none;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  font-size: 0.75rem;
  cursor: pointer;
  color: var(--ink-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.modal-close:hover {
  background: #d6d0c4;
}

.modal-age {
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1rem;
}

.modal-text {
  font-family: "Playfair Display", serif;
  font-size: 1.1rem;
  line-height: 1.75;
  color: var(--ink);
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.75rem;
  padding-top: 1rem;
  border-top: 1px solid var(--card-muted);
}

.modal-author {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: var(--ink-muted);
}

.collab-btn {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--card-bg);
  background: var(--accent);
  padding: 0.45rem 1rem;
  border-radius: 100px;
  text-decoration: none;
  transition: background 0.15s;
}

.collab-btn:hover {
  background: #a8761e;
}

/* ── MODAL TRANSITION ── */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.22s ease;
}

.modal-enter-active .modal-card,
.modal-leave-active .modal-card {
  transition:
    transform 0.22s ease,
    opacity 0.22s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-card,
.modal-leave-to .modal-card {
  transform: translateY(18px) scale(0.97);
  opacity: 0;
}
</style>
