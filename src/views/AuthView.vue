<!-- views/AuthView.vue -->
<template>
  <div class="auth-view">
    <div class="auth-container">
      <AuthModal
        :show="true"
        @close="handleClose"
        @authenticated="handleAuth"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import AuthModal from "@/components/AuthModal.vue";

const router = useRouter();
const route = useRoute();

const handleClose = () => {
  const redirect = route.query.redirect || "/";
  router.push(redirect);
};

const handleAuth = (userData) => {
  const redirect = route.query.redirect || "/";
  router.push(redirect);
};
</script>

<style scoped>
.auth-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
}

.auth-container {
  width: 100%;
  max-width: 480px;
  padding: 20px;
}
</style>
