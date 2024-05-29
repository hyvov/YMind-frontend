<template>
  <div id="userLayout">
    <el-container style="height: 100vh">
      <el-header class="header">
        <el-space>
          <img class="logo" src="../assets/icon.png" />
          <div>YMind AI智慧平台</div>
        </el-space>
      </el-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </el-container>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
#userLayout {
  text-align: center;
  background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png")
    0% 0% / 100% 100%;
}

#userLayout .logo {
  width: 48px;
  height: 48px;
}

#userLayout .header {
  margin-top: 16px;
  font-size: 21px;
}

#userLayout .content {
  margin-bottom: 16px;
  padding: 20px;
}

.footer {
  padding: 16px;
  text-align: center;
  background: #efefef;
}
</style>
