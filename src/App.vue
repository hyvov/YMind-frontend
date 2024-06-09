<template>
  <div id="app">
    <template
      v-if="
        route.path.startsWith('/user/login') ||
        route.path.startsWith('/user/register')
      "
    >
      <router-view />
      <div></div>
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import { useRoute } from "vue-router";
import { onMounted } from "vue";
import { getLoginUserUsingGet } from "@/api/userController";
import { useLoginUserStore } from "@/store/userStore";

const route = useRoute();

/**
 * 全局初始化函数，有全局单次调用的代码，都可以写到这里
 */
const doInit = () => {
  console.log("YMind start");
};

onMounted(() => {
  doInit();
});

getLoginUserUsingGet().then((res) => {
  console.log(res);
});
</script>

<style scoped></style>
