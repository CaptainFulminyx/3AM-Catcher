<template>
  <div v-for="(post, index) in data" :key="index">
    <div class="pfp">{{ post.uName.slice(0, 2) }}</div>
  </div>
</template>
<script>
import data from "../data/mockPosts.js";
</script>
