<template>
  <div class="about">
    <h1>This is an about page</h1>
    {{ JSON.stringify(loginUserStore.loginUser, null, 2) }}
  </div>
</template>
<script setup lang="ts">
// 获取store实例
import { useLoginUserStore } from "@/store/userStore";

const loginUserStore = useLoginUserStore();
</script>
