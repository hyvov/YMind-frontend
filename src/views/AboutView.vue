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

## 功能概述

### 用户功能
- **快速制作和发布多种答题应用**
  - 基于 AI 技术，用户可以轻松创建各种类型的答题应用。
- **检索和分享应用**
  - 提供便捷的检索功能，用户可以快速找到感兴趣的答题应用，并分享给他人。
- **在线答题**
  - 用户可以在线答题，并获得即时反馈。
- **基于评分算法或 AI 的回答总结**
  - 通过先进的评分算法或 AI 技术，用户可以得到详细的答题总结和分析。

### 管理员功能
- **审核应用**
  - 管理员可以审核用户提交的答题应用，确保内容的质量和合规性。
- **集中管理整站内容**
  - 管理员可以对平台上的所有内容进行集中管理，保证平台的正常运行。
- **统计分析**
  - 提供详细的统计分析功能，管理员可以根据数据进行优化和调整。

## 平台特点
- **智能化**
  - 利用 AI 技术，提高答题和管理的效率和准确性。
- **便捷性**
  - 用户界面友好，操作简单，适合各类用户使用。
- **互动性**
  - 支持用户之间的互动和分享，增强用户体验。

`;
</script>
