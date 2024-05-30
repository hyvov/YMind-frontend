<template>
  <el-row id="globalHeader" align="middle" :warp="false">
    <el-col :span="23">
      <div>
        <el-menu
          :default-active="selectedIndex"
          mode="horizontal"
          class="el-menu-demo"
          @select="doMenuClick"
        >
          <el-menu-item
            index="0"
            :style="{ padding: 0, marginRight: '38px' }"
            disabled
          >
            <div class="titleBar">
              <img class="logo" style="width: 40px" src="../assets/icon.png" />
              <div class="title">YMind</div>
            </div>
          </el-menu-item>
          <el-menu-item
            v-for="item in visibleRoutes"
            :key="item.path"
            :index="item.path"
            >{{ item.name }}
          </el-menu-item>
        </el-menu>
      </div>
    </el-col>
    <el-col :span="1">
      <div v-if="loginUserStore.loginUser.id">
        {{ loginUserStore.loginUser.userName ?? "无名" }}
      </div>
      <div v-else>
        <a-button type="primary" href="/user/login">登录</a-button>
      </div>
    </el-col>
  </el-row>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

import { useLoginUserStore } from "@/store/userStore";
import checkAccess from "@/access/checkAccess";
const loginUserStore = useLoginUserStore();

const router = useRouter();
const route = useRoute();
const selectedIndex = ref(["/"]);
router.afterEach((to, from, failure) => {
  console.log("selectedIndex" + selectedIndex.value);
  selectedIndex.value = [to.path];
});

// const selectedIndex = ref(route.path); // 初始时选中第一个菜单项
// watch(
//   () => route.path,
//   (newPath, oldPath) => {
//     console.log("selectedIndex" + selectedIndex.value);
//     selectedIndex.value = newPath;
//   }
// );

// const visibleRoutes = routes.filter((item) => {
//   if (item.meta?.hideInMenu) {
//     return false;
//   }
//   // 根据权限过滤菜单
//   if (!checkAccess(loginUserStore.loginUser, item.meta?.access as string)) {
//     return false;
//   }
//   return true;
// });
// 展示在菜单栏的路由数组
const visibleRoutes = computed(() => {
  return routes.filter((item) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    // 根据权限过滤菜单
    if (!checkAccess(loginUserStore.loginUser, item.meta?.access as string)) {
      return false;
    }
    return true;
  });
});
const doMenuClick = (key: string) => {
  console.log("key:" + key);
  router.push({
    path: key,
  });
};

//

// const doMenuClick = (key: string) => {
//   router.push({
//     path: key,
//   });
// };
</script>

<style scoped>
/*.flex-grow {*/
/*  flex-grow: 1;*/
/*}*/

#globalHeader {
}

.titleBar {
  display: flex;
  align-items: center;
}

.title {
  margin-right: 20px;
  margin-left: 5px;
  color: black;
}
</style>
