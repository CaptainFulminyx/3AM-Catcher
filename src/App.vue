<template>
  <div class="min-h-screen bg-[#0a0a0f]">
    <div
      class="border-b border-gray-800 sticky top-0 bg-[#0a0a0f]/95 backdrop-blur z-10"
    >
      <div
        class="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center"
      >
        <h1 class="font-['Syne'] text-2xl font-extrabold text-[#e8ff47]">
          3AM CATCHER
        </h1>
        <button
          v-if="authStore.user"
          @click="authStore.signOut"
          class="font-mono text-sm text-gray-400 hover:text-[#47d4ff] transition-colors"
        >
          {{ authStore.callsign }} ⚡ SIGN OUT
        </button>
        <button
          v-else
          @click="authStore.showAuthModal = true"
          class="bg-[#e8ff47] text-black font-mono font-bold px-4 py-2 hover:bg-[#47d4ff] transition-colors"
        >
          JOIN / SIGN IN
        </button>
      </div>
    </div>

    <div class="px-4 py-6">
      <router-view />
    </div>

    <AuthModal
      :show="authStore.showAuthModal"
      @close="authStore.showAuthModal = false"
    />
  </div>
</template>

<script setup>
import { useAuthStore } from "./stores/auth";
import AuthModal from "./components/AuthModal.vue";

const authStore = useAuthStore();
</script>
