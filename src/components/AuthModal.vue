<!-- components/AuthModal.vue -->
<template>
  <div class="auth-modal">
    <div class="modal">
      <!-- Header -->
      <div class="modal-header">
        <div class="wordmark">3AM</div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- Mode toggle -->
      <div class="mode-toggle">
        <button
          :class="['toggle-btn', { active: mode === 'signup' }]"
          @click="switchMode('signup')"
        >
          Join
        </button>
        <button
          :class="['toggle-btn', { active: mode === 'signin' }]"
          @click="switchMode('signin')"
        >
          Sign in
        </button>
      </div>

      <!-- ── SIGN UP ── -->
      <div v-if="mode === 'signup'" class="form-body">
        <div class="callsign-section">
          <div class="field-label">Your callsign</div>
          <div class="callsign-display">
            <span class="callsign-text">{{ callsign }}</span>
            <button
              class="regen-btn"
              @click="generateCallsign"
              title="Generate new"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
              >
                <path d="M23 4v6h-6M1 20v-6h6" />
                <path
                  d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
                />
              </svg>
            </button>
          </div>
          <div class="field-hint">
            Auto-generated. Tap ↺ to get a different one.
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Email</label>
          <input
            v-model="email"
            type="email"
            class="field-input"
            placeholder="you@somewhere.com"
            autocomplete="email"
            @keyup.enter="handleSignup"
          />
        </div>

        <div class="field-group">
          <label class="field-label">Password</label>
          <div class="input-wrap">
            <input
              v-model="password"
              :type="showPass ? 'text' : 'password'"
              class="field-input"
              placeholder="min 8 characters"
              autocomplete="new-password"
              @keyup.enter="handleSignup"
            />
            <button class="eye-btn" @click="showPass = !showPass" tabindex="-1">
              <svg
                v-if="!showPass"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg
                v-else
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
          <div class="password-strength" v-if="password.length > 0">
            <div class="strength-bar">
              <div
                class="strength-fill"
                :style="{ width: strengthWidth, background: strengthColor }"
              ></div>
            </div>
            <span class="strength-label" :style="{ color: strengthColor }">{{
              strengthLabel
            }}</span>
          </div>
        </div>

        <div class="error-msg" v-if="error">{{ error }}</div>

        <button class="submit-btn" @click="handleSignup" :disabled="loading">
          <span v-if="!loading">Create account</span>
          <span v-else class="loading-dots"
            ><span>.</span><span>.</span><span>.</span></span
          >
        </button>

        <div class="fine-print">
          By joining you agree to keep it raw and real.
        </div>
      </div>

      <!-- ── SIGN IN ── -->
      <div v-if="mode === 'signin'" class="form-body">
        <div class="field-group">
          <label class="field-label">Email</label>
          <input
            v-model="email"
            type="email"
            class="field-input"
            placeholder="you@somewhere.com"
            autocomplete="email"
            @keyup.enter="handleSignin"
          />
        </div>

        <div class="field-group">
          <label class="field-label">Password</label>
          <div class="input-wrap">
            <input
              v-model="password"
              :type="showPass ? 'text' : 'password'"
              class="field-input"
              placeholder="your password"
              autocomplete="current-password"
              @keyup.enter="handleSignin"
            />
            <button class="eye-btn" @click="showPass = !showPass" tabindex="-1">
              <svg
                v-if="!showPass"
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              <svg
                v-else
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            </button>
          </div>
        </div>

        <div class="error-msg" v-if="error">{{ error }}</div>

        <button class="submit-btn" @click="handleSignin" :disabled="loading">
          <span v-if="!loading">Sign in</span>
          <span v-else class="loading-dots"
            ><span>.</span><span>.</span><span>.</span></span
          >
        </button>

        <button class="forgot-btn" @click="handleForgot" v-if="!forgotSent">
          Forgot password?
        </button>
        <div class="success-msg" v-if="forgotSent">
          Reset link sent. Check your email.
        </div>
      </div>

      <!-- Success state -->
      <Transition name="success">
        <div v-if="success" class="success-overlay">
          <div class="success-icon">✓</div>
          <div class="success-title">You're in.</div>
          <div class="success-callsign">{{ callsign }}</div>
          <div class="success-sub">That's your callsign. Own it.</div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { supabase } from "@/lib/supabase"; // Import shared instance

// ── Props & Emits ──────────────────────────────────────────────
const props = defineProps({
  show: { type: Boolean, default: true }, // For route view, always true
});

const emit = defineEmits(["close", "authenticated"]);

// ── State ──────────────────────────────────────────────────────
const mode = ref("signup");
const email = ref("");
const password = ref("");
const showPass = ref(false);
const loading = ref(false);
const error = ref("");
const success = ref(false);
const forgotSent = ref(false);
const callsign = ref("");

// ── Callsign generator ─────────────────────────────────────────
const ADJECTIVES = [
  "king",
  "lord",
  "dark",
  "wild",
  "swift",
  "iron",
  "cold",
  "brave",
  "lone",
  "grey",
  "night",
  "storm",
  "frost",
  "ash",
  "void",
  "pixel",
  "null",
  "ghost",
  "steel",
  "ember",
  "neon",
  "rust",
  "byte",
  "dead",
  "raw",
  "lost",
  "deep",
];

const NOUNS = [
  "bird",
  "wolf",
  "grass",
  "stone",
  "tide",
  "spark",
  "forge",
  "blade",
  "shore",
  "peak",
  "root",
  "core",
  "node",
  "signal",
  "stack",
  "loop",
  "gate",
  "cache",
  "bit",
  "flux",
  "shift",
  "wire",
  "code",
  "call",
  "port",
  "flag",
  "hook",
  "thread",
];

function generateCallsign() {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(Math.random() * 90) + 10; // 10–99
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  callsign.value = `${cap(adj)}${cap(noun)}${num}`;
}

onMounted(() => generateCallsign());

// ── Password strength ──────────────────────────────────────────
const strength = computed(() => {
  const p = password.value;
  if (p.length === 0) return 0;
  let s = 0;
  if (p.length >= 8) s++;
  if (p.length >= 12) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
});

const strengthWidth = computed(() => `${(strength.value / 5) * 100}%`);
const strengthColor = computed(() => {
  if (strength.value <= 1) return "#ff4444";
  if (strength.value <= 2) return "#ff8800";
  if (strength.value <= 3) return "#ffcc00";
  return "#6eff6e";
});
const strengthLabel = computed(() => {
  if (strength.value <= 1) return "weak";
  if (strength.value <= 2) return "okay";
  if (strength.value <= 3) return "good";
  return "strong";
});

// ── Helpers ────────────────────────────────────────────────────
function switchMode(m) {
  mode.value = m;
  error.value = "";
  password.value = "";
  forgotSent.value = false;
  if (m === "signup") generateCallsign();
}

function validateEmail(e) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

// ── Sign up ────────────────────────────────────────────────────
async function handleSignup() {
  error.value = "";
  if (!validateEmail(email.value)) {
    error.value = "Enter a valid email.";
    return;
  }
  if (password.value.length < 8) {
    error.value = "Password must be at least 8 characters.";
    return;
  }

  loading.value = true;
  try {
    // Check callsign uniqueness first
    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("callsign", callsign.value)
      .maybeSingle();

    if (existing) {
      generateCallsign(); // auto-regen on collision
      error.value = "Callsign taken — got you a new one. Try again.";
      loading.value = false;
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: { callsign: callsign.value },
      },
    });

    if (authError) throw authError;

    success.value = true;
    setTimeout(() => {
      emit("authenticated", { user: data.user, callsign: callsign.value });
      emit("close");
    }, 2200);
  } catch (e) {
    error.value = e.message || "Something went wrong.";
  } finally {
    loading.value = false;
  }
}

// ── Sign in ────────────────────────────────────────────────────
async function handleSignin() {
  error.value = "";
  if (!validateEmail(email.value)) {
    error.value = "Enter a valid email.";
    return;
  }
  if (!password.value) {
    error.value = "Enter your password.";
    return;
  }

  loading.value = true;
  try {
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (authError) throw authError;

    // Fetch their callsign
    const { data: profile } = await supabase
      .from("profiles")
      .select("callsign")
      .eq("id", data.user.id)
      .single();

    callsign.value = profile?.callsign || "";
    success.value = true;

    setTimeout(() => {
      emit("authenticated", { user: data.user, callsign: callsign.value });
      emit("close");
    }, 2200);
  } catch (e) {
    error.value =
      e.message === "Invalid login credentials"
        ? "Wrong email or password."
        : e.message || "Something went wrong.";
  } finally {
    loading.value = false;
  }
}

// ── Forgot password ────────────────────────────────────────────
async function handleForgot() {
  if (!validateEmail(email.value)) {
    error.value = "Enter your email first.";
    return;
  }
  error.value = "";
  loading.value = true;
  try {
    const { error: e } = await supabase.auth.resetPasswordForEmail(email.value);
    if (e) throw e;
    forgotSent.value = true;
  } catch (e) {
    error.value = e.message || "Could not send reset email.";
  } finally {
    loading.value = false;
  }
}
</script>
<style scoped>
/* Your existing styles */
.auth-modal {
  width: 100%;
}

.modal {
  background: rgba(0, 0, 0, 0.95);
  border-radius: 24px;
  padding: 32px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.wordmark {
  font-size: 28px;
  font-weight: bold;
  background: linear-gradient(135deg, #fff, #888);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 24px;
  cursor: pointer;
  padding: 4px 8px;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #fff;
}

.mode-toggle {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: 12px;
}

.toggle-btn {
  flex: 1;
  background: none;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  color: #888;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn.active {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.callsign-section {
  text-align: center;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.callsign-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 12px 0 8px;
}

.callsign-text {
  font-size: 28px;
  font-weight: bold;
  font-family: monospace;
  letter-spacing: 1px;
  background: linear-gradient(135deg, #fff, #6eff6e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.regen-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
}

.regen-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(180deg);
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-label {
  font-size: 14px;
  font-weight: 500;
  color: #aaa;
}

.field-input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
  font-size: 14px;
  transition: all 0.2s;
}

.field-input:focus {
  outline: none;
  border-color: #6eff6e;
  background: rgba(255, 255, 255, 0.08);
}

.input-wrap {
  position: relative;
}

.eye-btn {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  padding: 4px;
}

.password-strength {
  margin-top: 8px;
}

.strength-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 6px;
}

.strength-fill {
  height: 100%;
  transition:
    width 0.2s,
    background 0.2s;
}

.strength-label {
  font-size: 12px;
  text-transform: uppercase;
}

.error-msg {
  color: #ff4444;
  font-size: 13px;
  text-align: center;
  padding: 8px;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 8px;
}

.success-msg {
  color: #6eff6e;
  font-size: 13px;
  text-align: center;
}

.submit-btn {
  background: linear-gradient(135deg, #6eff6e, #4caf50);
  border: none;
  padding: 14px;
  border-radius: 12px;
  color: black;
  font-weight: bold;
  font-size: 16px;
  cursor: pointer;
  transition:
    transform 0.1s,
    opacity 0.2s;
}

.submit-btn:active {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-dots span {
  animation: blink 1.4s infinite both;
  display: inline-block;
}

.loading-dots span:nth-child(2) {
  animation-delay: 0.2s;
}
.loading-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0%,
  80%,
  100% {
    opacity: 0;
  }
  40% {
    opacity: 1;
  }
}

.forgot-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 13px;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 8px;
}

.forgot-btn:hover {
  color: #fff;
}

.fine-print {
  font-size: 12px;
  color: #666;
  text-align: center;
  margin-top: 8px;
}

.success-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  animation: fadeIn 0.3s ease;
}

.success-icon {
  font-size: 64px;
  color: #6eff6e;
  animation: bounce 0.5s ease;
}

.success-title {
  font-size: 32px;
  font-weight: bold;
}

.success-callsign {
  font-size: 24px;
  font-family: monospace;
  background: linear-gradient(135deg, #fff, #6eff6e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  padding: 8px 16px;
  background-color: rgba(110, 255, 110, 0.1);
  border-radius: 40px;
}

.success-sub {
  font-size: 14px;
  color: #888;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes bounce {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
</style>
