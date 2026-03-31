<template>
  <div class="page-wrapper">
    <Nav title="Idéra" @toggle-menu="handleMenu" />

    <!-- Pull to refresh indicator -->
    <div
      class="ptr-bar"
      :class="{
        pulling: isPulling,
        refreshing: isRefreshing,
        ready: pullReady,
      }"
      :style="{ '--pull-progress': pullProgress }"
    >
      <div class="ptr-inner">
        <svg
          v-if="!isRefreshing"
          class="ptr-icon"
          :class="{ flipped: pullReady }"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M8 3v9M8 12l-3-3M8 12l3-3"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div v-else class="ptr-spinner"></div>
        <span class="ptr-text">{{
          isRefreshing
            ? "Refreshing…"
            : pullReady
              ? "Release"
              : "Pull to refresh"
        }}</span>
      </div>
    </div>

    <!-- Header -->
    <header class="feed-header">
      <span class="feed-label">FEED</span>
      <h1 class="feed-title">What's on your mind?</h1>
    </header>

    <!-- Post count row -->
    <div class="count-row">
      <span class="count-label">{{ posts.length }} posts</span>
      <span class="count-dot"></span>
      <span class="count-live">LIVE</span>
    </div>

    <!-- Feed -->
    <main
      class="feed-list"
      ref="feedEl"
      @touchstart="onTouchStart"
      @touchmove="onTouchMove"
      @touchend="onTouchEnd"
    >
      <div
        v-for="(post, i) in posts"
        :key="post.id"
        class="post-row"
        @click="openPost(post)"
      >
        <div class="post-num">{{ String(i + 1).padStart(2, "0") }}</div>
        <div class="post-content">
          <p class="post-text">{{ post.content }}</p>
          <div class="post-meta">
            <span class="post-author">{{ post.uName || "anon" }}</span>
            <div class="post-right">
              <span v-if="post.ageHours" class="post-age">{{
                formatAge(post.ageHours)
              }}</span>
              <span v-if="post.collab" class="collab-pill">collab</span>
            </div>
          </div>
        </div>
        <div class="post-arrow">↗</div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="skeleton-wrap">
        <div v-for="n in 5" :key="n" class="skeleton-row">
          <div class="sk sk-num"></div>
          <div class="sk-body">
            <div
              class="sk sk-line"
              :style="{ width: [88, 72, 60, 80, 66][n - 1] + '%' }"
            ></div>
            <div class="sk sk-line short"></div>
          </div>
        </div>
      </div>

      <!-- End -->
      <div v-if="exhausted && !loading" class="feed-end">
        <span></span>
        <span>you're all caught up</span>
        <span></span>
      </div>

      <div ref="loadMoreSentry" style="height: 1px"></div>
    </main>

    <!-- Modal -->
    <Transition name="slide-up">
      <div v-if="activePost" class="modal-overlay" @click.self="closePost">
        <div class="modal-sheet">
          <div class="sheet-handle"></div>

          <div class="sheet-header">
            <div class="sheet-meta">
              <span class="sheet-author">{{ activePost.uName || "anon" }}</span>
              <span v-if="activePost.ageHours" class="sheet-age"
                >{{ formatAge(activePost.ageHours) }} ago</span
              >
            </div>
            <button class="sheet-close" @click="closePost">✕</button>
          </div>

          <div class="sheet-body">
            <p class="sheet-text">{{ activePost.content }}</p>
          </div>

          <div
            class="sheet-footer"
            v-if="activePost.collab && activePost.email"
          >
            <a
              :href="`mailto:${activePost.email}`"
              class="collab-btn"
              @click.stop
            >
              Open to collab ↗
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
const feedEl = ref(null);
const activePost = ref(null);
const currentPage = ref(0);
const itemsPerPage = 10;

// Pull to refresh state
const isPulling = ref(false);
const isRefreshing = ref(false);
const pullReady = ref(false);
const pullProgress = ref(0);
let touchStartY = 0;
const PULL_THRESHOLD = 72;

const onTouchStart = (e) => {
  if (window.scrollY > 0) return;
  touchStartY = e.touches[0].clientY;
  isPulling.value = true;
};

const onTouchMove = (e) => {
  if (!isPulling.value) return;
  const delta = e.touches[0].clientY - touchStartY;
  if (delta < 0) return;
  pullProgress.value = Math.min(delta / PULL_THRESHOLD, 1);
  pullReady.value = delta >= PULL_THRESHOLD;
};

const onTouchEnd = async () => {
  if (!isPulling.value) return;
  isPulling.value = false;
  if (pullReady.value) {
    pullReady.value = false;
    await doRefresh();
  }
  pullProgress.value = 0;
};

const doRefresh = async () => {
  isRefreshing.value = true;
  await new Promise((r) => setTimeout(r, 900));
  currentPage.value = 0;
  exhausted.value = false;
  posts.value = [];
  await fetchMorePosts();
  isRefreshing.value = false;
};

const fetchMorePosts = async () => {
  if (loading.value || exhausted.value) return;
  loading.value = true;
  await new Promise((r) => setTimeout(r, 600));

  const start = currentPage.value * itemsPerPage;
  const end = start + itemsPerPage;
  const batch = mockDatabase.slice(start, end);

  if (batch.length > 0) {
    const withIds = batch.map((post, i) => ({
      id: post.id ?? `post-${start + i}`,
      ...post,
    }));
    posts.value.push(...withIds);
    currentPage.value++;
  }

  if (posts.value.length >= mockDatabase.length) exhausted.value = true;
  loading.value = false;

  await nextTick();
  const sentinel = loadMoreSentry.value;
  if (sentinel && !exhausted.value) {
    const rect = sentinel.getBoundingClientRect();
    if (rect.top < window.innerHeight + 400) fetchMorePosts();
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

const handleMenu = () => {};

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
@import url("https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap");
@import "tailwindcss";

:root {
  --bg: #0c0c0b;
  --surface: #141413;
  --border: rgba(255, 255, 255, 0.07);
  --fg: #f0ede6;
  --fg-mid: #9e9b94;
  --fg-dim: #4a4843;
  --accent: #c8922a;
  --card-bg: #afd5b8;
  --card-ink: #0a0c09;
  --card-ink-mid: #3c4038;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  background: #000;
  font-family: "Satoshi", sans-serif;
  color: var(--fg);
  -webkit-font-smoothing: antialiased;
}

.page-wrapper {
  min-height: 100svh;
}

/* ── PTR BAR ── */
.ptr-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  height: 0;
  overflow: hidden;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  transition: height 0.2s ease;
}

.ptr-bar.pulling {
  height: calc(var(--pull-progress, 0) * 52px);
  transition: none;
}

.ptr-bar.refreshing {
  height: 52px;
}

.ptr-inner {
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.ptr-icon {
  color: var(--fg-mid);
  transition: transform 0.25s ease;
  flex-shrink: 0;
}
.ptr-icon.flipped {
  transform: rotate(180deg);
}

.ptr-text {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.03em;
  color: var(--fg-mid);
}

.ptr-spinner {
  width: 14px;
  height: 14px;
  border: 1.5px solid var(--fg-dim);
  border-top-color: var(--fg-mid);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── HEADER ── */
.feed-header {
  padding: 5.5rem 1.5rem 1.25rem;
  max-width: 720px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .feed-header {
    padding: 6.5rem 2rem 1.5rem;
    max-width: 860px;
  }
}

.feed-label {
  display: block;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  color: var(--accent);
  margin-bottom: 0.5rem;
}

.feed-title {
  font-size: clamp(1.5rem, 4vw, 2.2rem);
  font-weight: 700;
  color: var(--fg);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* ── COUNT ROW ── */
.count-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0 1.5rem 1rem;
  max-width: 720px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .count-row {
    max-width: 860px;
    padding: 0 2rem 1.25rem;
  }
}

.count-label {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--fg-dim);
}

.count-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--fg-dim);
}

.count-live {
  font-size: 0.54rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: var(--accent);
}

/* ── FEED LIST ── */
.feed-list {
  max-width: 720px;
  margin: 0 auto;
  padding-bottom: 6rem;
  border-top: 1px solid var(--border);
}

@media (min-width: 768px) {
  .feed-list {
    max-width: 860px;
  }
}

/* ── POST ROW ── */
.post-row {
  display: grid;
  grid-template-columns: 36px 1fr 20px;
  gap: 1rem;
  align-items: start;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  transition: background 0.12s;
}

@media (min-width: 768px) {
  .post-row {
    grid-template-columns: 48px 1fr 20px;
    padding: 1.5rem 2rem;
    gap: 1.5rem;
  }
}

.post-row:hover {
  background: var(--surface);
}
.post-row:hover .post-arrow {
  opacity: 1;
  transform: translate(1px, -1px);
}

.post-num {
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--fg-dim);
  letter-spacing: 0.06em;
  padding-top: 0.22rem;
  text-align: right;
}

.post-content {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.post-text {
  font-size: 0.93rem;
  font-weight: 400;
  line-height: 1.65;
  color: var(--fg);
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (min-width: 768px) {
  .post-text {
    font-size: 1rem;
    -webkit-line-clamp: 5;
  }
}

.post-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.post-author {
  font-size: 0.67rem;
  font-weight: 600;
  color: var(--fg-mid);
  letter-spacing: 0.04em;
}

.post-right {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.post-age {
  font-size: 0.62rem;
  font-weight: 500;
  color: var(--fg-dim);
}

.collab-pill {
  font-size: 0.56rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--accent);
  border: 1px solid rgba(200, 146, 42, 0.3);
  border-radius: 100px;
  padding: 0.16rem 0.5rem;
}

.post-arrow {
  font-size: 0.78rem;
  color: var(--fg-dim);
  opacity: 0;
  transition:
    opacity 0.12s,
    transform 0.12s;
  padding-top: 0.2rem;
  justify-self: end;
}

/* ── SKELETON ── */
.skeleton-row {
  display: grid;
  grid-template-columns: 36px 1fr;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

@media (min-width: 768px) {
  .skeleton-row {
    grid-template-columns: 48px 1fr;
    padding: 1.5rem 2rem;
    gap: 1.5rem;
  }
}

.sk {
  border-radius: 4px;
  background: var(--surface);
  background-image: linear-gradient(
    90deg,
    var(--surface) 0%,
    #1e1e1c 50%,
    var(--surface) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.4s ease-in-out infinite;
}

.sk-num {
  width: 18px;
  height: 9px;
  margin-left: auto;
  margin-top: 0.22rem;
}

.sk-body {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  padding-top: 0.15rem;
}

.sk-line {
  height: 13px;
}
.sk-line.short {
  width: 28% !important;
  height: 9px;
  margin-top: 0.2rem;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* ── END ── */
.feed-end {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem 1.5rem;
  font-size: 0.67rem;
  font-weight: 500;
  color: var(--fg-dim);
  letter-spacing: 0.05em;
}

.feed-end span:first-child,
.feed-end span:last-child {
  flex: 1;
  height: 1px;
  background: var(--border);
  display: block;
}

/* ── MODAL SHEET ── */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 8, 7, 0.75);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

@media (min-width: 640px) {
  .modal-overlay {
    align-items: center;
  }
}

.modal-sheet {
  background: var(--card-bg);
  width: 100%;
  max-width: 580px;
  border-radius: 20px 20px 0 0;
  max-height: 80svh;
  overflow-y: auto;
  box-shadow: 0 -16px 60px rgba(0, 0, 0, 0.5);
}

@media (min-width: 640px) {
  .modal-sheet {
    border-radius: 16px;
    max-height: 70svh;
  }
}

.sheet-handle {
  width: 32px;
  height: 3px;
  background: rgba(0, 0, 0, 0.13);
  border-radius: 2px;
  margin: 0.9rem auto 0;
}

@media (min-width: 640px) {
  .sheet-handle {
    display: none;
  }
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem 0;
}

.sheet-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.sheet-author {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: var(--card-ink-mid);
}

.sheet-age {
  font-size: 0.63rem;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.32);
}

.sheet-close {
  background: rgba(0, 0, 0, 0.07);
  border: none;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  font-size: 0.65rem;
  cursor: pointer;
  color: var(--card-ink-mid);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.12s;
}

.sheet-close:hover {
  background: rgba(0, 0, 0, 0.13);
}

.sheet-body {
  padding: 1.1rem 1.5rem 1.4rem;
}

.sheet-text {
  font-size: 1.05rem;
  font-weight: 400;
  line-height: 1.75;
  color: var(--card-ink);
}

.sheet-footer {
  border-top: 1px solid rgba(0, 0, 0, 0.07);
  padding: 1rem 1.5rem 1.4rem;
}

.collab-btn {
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  color: var(--card-bg);
  background: var(--card-ink);
  padding: 0.5rem 1.1rem;
  border-radius: 100px;
  text-decoration: none;
  transition: opacity 0.12s;
}

.collab-btn:hover {
  opacity: 0.8;
}

/* ── TRANSITIONS ── */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: opacity 0.2s ease;
}
.slide-up-enter-active .modal-sheet,
.slide-up-leave-active .modal-sheet {
  transition: transform 0.24s cubic-bezier(0.32, 0.72, 0, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
}
.slide-up-enter-from .modal-sheet,
.slide-up-leave-to .modal-sheet {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .slide-up-enter-active .modal-sheet,
  .slide-up-leave-active .modal-sheet {
    transition:
      transform 0.2s ease,
      opacity 0.2s ease;
  }
  .slide-up-enter-from .modal-sheet {
    transform: translateY(10px) scale(0.98);
    opacity: 0;
  }
  .slide-up-leave-to .modal-sheet {
    transform: translateY(10px) scale(0.98);
    opacity: 0;
  }
}
</style>
