<template>
  <el-drawer v-model="drawer" title="I am the title" :with-header="false">
    <span>好友列表</span>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";

const triggerZoneWidth = 10; // 触发区域的宽度

const handleMouseMove = (event: MouseEvent) => {
  const viewportWidth = window.innerWidth;
  const mouseX = event.clientX;

  if (viewportWidth - mouseX <= triggerZoneWidth) {
    drawer.value = true;
  }
};
onMounted(() => {
  window.addEventListener("mousemove", handleMouseMove);
});

onUnmounted(() => {
  window.removeEventListener("mousemove", handleMouseMove);
});
const drawer = ref(false);
</script>
