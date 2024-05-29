<template>
  <div id="basicLayout">
    <el-container style="height: 100vh">
      <el-header class="header">
        <GlobalHeader />
      </el-header>

      <el-main class="content">
        <router-view />
      </el-main>

      <el-footer class="footer"
        ><a href="https://github.com/hyuZzz" target="_blank">
          项目地址
        </a></el-footer
      >
    </el-container>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from "../components/GlobalHeader.vue";
</script>

<style scoped>
#basicLayout {
}

#basicLayout .header {
  margin-bottom: 16px;
  box-shadow: #eee 1px 1px 5px;
  border-bottom: 1px solid #dcdfe6;
}

#basicLayout .content {
  background: linear-gradient(to right, #fefefe, #fff);
  margin-bottom: 28px;
  padding: 20px;
}

#basicLayout .footer {
  background: #efefef;
  padding: 16px;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
