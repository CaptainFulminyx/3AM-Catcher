<!-- src/views/AuthView.vue -->
<template>
  <div class="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">

    <!-- Logo -->
    <div class="mb-10 text-center">
      <h1 class="text-4xl font-bold text-white tracking-tight">🌙 3AM Catcher</h1>
      <p class="text-zinc-500 mt-2 text-sm">where the real thoughts live</p>
    </div>

    <!-- Card -->
    <div class="w-full max-w-sm bg-[#111118] border border-zinc-800 rounded-2xl p-8">

      <!-- Toggle -->
      <div class="flex mb-6 bg-[#0a0a0f] rounded-lg p-1">
        <button
          @click="mode = 'login'"
          :class="mode === 'login' ? 'bg-zinc-700 text-white' : 'text-zinc-500'"
          class="flex-1 py-2 rounded-md text-sm font-medium transition-all"
        >Login</button>
        <button
          @click="mode = 'signup'"
          :class="mode === 'signup' ? 'bg-zinc-700 text-white' : 'text-zinc-500'"
          class="flex-1 py-2 rounded-md text-sm font-medium transition-all"
        >Sign Up</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">

        <div v-if="mode === 'signup'">
          <label class="text-xs text-zinc-500 mb-1 block">Username</label>
          <input
            v-model="username"
            type="text"
            placeholder="nightowl_42"
            class="w-full bg-[#0a0a0f] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div>
          <label class="text-xs text-zinc-500 mb-1 block">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@night.com"
            class="w-full bg-[#0a0a0f] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <div>
          <label class="text-xs text-zinc-500 mb-1 block">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            class="w-full bg-[#0a0a0f] border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
          />
        </div>

        <!-- Error -->
        <p v-if="error" class="text-red-400 text-xs">{{ error }}</p>

        <!-- Submit -->
        <button
          type="submit"
          :disabled="loading"
          class="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3 rounded-lg text-sm font-semibold transition-all"
        >
          {{ loading ? 'Hold on...' : mode === 'login' ? 'Enter the night' : 'Join the night' }}
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '../lib/supabase.js'

const router = useRouter()

const mode = ref('login')
const email = ref('')
const password = ref('')
const username = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true

  if (mode.value === 'signup') {
    const { data, error: err } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
    })
    if (err) { error.value = err.message; loading.value = false; return }

    // Save username to profiles
    await supabase.from('profiles').upsert({
      id: data.user.id,
      username: username.value,
    })

  } else {
    const { error: err } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })
    if (err) { error.value = err.message; loading.value = false; return }
  }

  loading.value = false
  router.push('/feed')
}
</script>