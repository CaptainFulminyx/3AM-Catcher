<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
    @click.self="close"
  >
    <div class="bg-[#0a0a0f] border border-[#e8ff47]/30 max-w-md w-full p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="font-['Syne'] text-2xl font-extrabold text-[#e8ff47]">
          {{ mode === "join" ? "JOIN" : "SIGN IN" }}
        </h2>
        <button
          @click="close"
          class="text-gray-400 hover:text-[#47d4ff] font-mono text-xl"
        >
          &times;
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block font-mono text-sm text-gray-400 mb-1"
            >EMAIL</label
          >
          <input
            v-model="email"
            type="email"
            required
            class="w-full bg-black/50 border border-gray-700 p-3 font-mono text-white focus:border-[#47d4ff] outline-none"
          />
        </div>

        <div>
          <label class="block font-mono text-sm text-gray-400 mb-1"
            >PASSWORD</label
          >
          <input
            v-model="password"
            type="password"
            required
            minlength="8"
            class="w-full bg-black/50 border border-gray-700 p-3 font-mono text-white focus:border-[#47d4ff] outline-none"
          />
        </div>

        <button
          type="submit"
          class="w-full bg-[#e8ff47] text-black font-mono font-bold py-3 hover:bg-[#47d4ff] transition-colors"
        >
          {{ mode === "join" ? "JOIN THE CHAOS" : "ENTER" }}
        </button>
      </form>

      <div class="mt-4 text-center">
        <button
          @click="toggleMode"
          class="font-mono text-sm text-gray-400 hover:text-[#47d4ff]"
        >
          {{
            mode === "join"
              ? "Already have an account? Sign in"
              : "Don't have an account? Join"
          }}
        </button>
      </div>

      <div v-if="error" class="mt-4 p-3 border border-red-500 bg-red-500/10">
        <p class="font-mono text-sm text-red-400">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useAuthStore } from "../stores/auth";

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(["close"]);
const authStore = useAuthStore();

const mode = ref("join");
const email = ref("");
const password = ref("");
const error = ref("");

const toggleMode = () => {
  mode.value = mode.value === "join" ? "signin" : "join";
  error.value = "";
};

const handleSubmit = async () => {
  error.value = "";
  let result;

  if (mode.value === "join") {
    result = await authStore.signUp(email.value, password.value);
  } else {
    result = await authStore.signIn(email.value, password.value);
  }

  if (!result.success) {
    error.value = result.error;
  } else {
    email.value = "";
    password.value = "";
  }
};

const close = () => {
  emit("close");
};
</script>
