<template>
  <div id="basicLayout">
    <el-container style="height: 100vh">
      <el-header class="header">
        <GlobalHeader />
      </el-header>

      <el-main class="content">
        <router-view class="routerView" />
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
  border-bottom: 1px solid #dcdfe6;
  box-shadow: #eee 1px 1px 5px;
}
#basicLayout .content .routerView{

  max-width: 1200px;
  margin: 0 auto 28px;

}
#basicLayout .content {
  box-sizing: border-box;
  width: 100%;
  margin-bottom:28px;
  padding: 20px;
  background: linear-gradient(to right, #fefefe, #fff);
}

#basicLayout .footer {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 16px;
  text-align: center;
  background: #efefef;
}
</style>
