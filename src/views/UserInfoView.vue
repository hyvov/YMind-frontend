<template>
  <div class="about">
    <MdViewer :value="markdownContent" />
  </div>
</template>
<script setup lang="ts">
// 获取store实例
import { useLoginUserStore } from "@/store/userStore";
import MdViewer from "@/components/MdViewer.vue";
import { ref } from "vue";

const loginUserStore = useLoginUserStore();

// 创建一个对 Markdown 内容的引用
const markdownContent = ref("");

// 在这里设置 Markdown 内容，例如从 API 获取
markdownContent.value = `
# YMind AI 答题平台

`;
</script>
