<template>
  <div class="header-spacer">
    <header class="floating-header">
      <nav class="header-container">
        <div class="header-left">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:svg="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="40"
            height="40"
            viewBox="0 0 176.29 414.3"
            preserveAspectRatio="xMidYMid meet"
          >
            <g
              transform="matrix(1, 0, 0, 1, -146.57913208007812, 172.25167846679688)"
            >
              <path
                d="M170.85,-19.8 L240.29,-19.8 L240.29,207.05 L287.86,207.05M287.86,207.05"
                fill-rule="evenodd"
                style="
                  fill: none;
                  stroke: #000;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                  stroke-width: 70;
                "
              />
              <path
                d="M170.85,-19.8 L240.29,-19.8 L240.29,207.05 L287.86,207.05M287.86,207.05"
                fill-rule="evenodd"
                style="
                  fill: none;
                  stroke: #fff;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                  stroke-width: 20;
                "
              />
              <path
                d="M265.2,-99.06 L242.85,-137.25 L217.94,-99.06"
                fill-rule="evenodd"
                style="
                  fill: none;
                  stroke: #000;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                  stroke-width: 70;
                "
              />

              <path
                d="M265.2,-99.06 L242.85,-137.25 L217.94,-99.06"
                fill-rule="evenodd"
                style="
                  fill: none;
                  stroke: #ffff60;
                  stroke-linecap: round;
                  stroke-linejoin: round;
                  stroke-width: 20;
                "
              />
            </g>
          </svg>
          <span class="header-title">{{ title }}</span>
        </div>

        <button
          class="menu-toggle"
          @click="$emit('toggle-menu')"
          aria-label="Open Menu"
        >
          <Icon
            icon="material-symbols:menu-rounded"
            class="menu-icon"
            width="40"
            height="40"
          />
        </button>
      </nav>
    </header>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
defineProps({
  title: {
    type: String,
    default: "Idéra",
  },
});

defineEmits(["toggle-menu"]);
</script>

<style>
@import "tailwindcss";

.header-spacer {
  @apply fixed top-4 z-50 px-4 w-full pointer-events-none;
}

.floating-header {
  @apply pointer-events-auto max-w-7xl mx-auto;
}

.header-container {
  @apply flex items-center justify-between px-6 py-3;
  @apply backdrop-blur-md;
  @apply rounded-2xl shadow-lg shadow-black/5;

  background: var(--bg-color);
}

.header-left {
  @apply flex items-center gap-3;
}

.header-logo {
  @apply w-8 h-8 text-indigo-600;
}

.header-title {
  @apply text-xl font-bold tracking-tight;
}

.menu-toggle {
  @apply rounded-lg p-1;
  transition: all 0.5s;
}

.menu-toggle:hover {
  background: #aaa;
}

.menu-icon {
  @apply w-8 h-8;
}
</style>
