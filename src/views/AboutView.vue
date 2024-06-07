<template>
  <div class="about">
    <h1>YMind AI答题平台</h1>
  </div>
  <p>
    用户可以基于 AI
    快速制作并发布多种答题应用，支持检索和分享应用、在线答题并基于评分算法或 AI
    得到回答总结；管理员可以审核应用、集中管理整站内容，并进行统计分析。
  </p>
</template>
<script setup lang="ts">
// 获取store实例
import { useLoginUserStore } from "@/store/userStore";

const loginUserStore = useLoginUserStore();
</script>
