<template>
  <div id="userLoginPage">
    <h2 style="margin-bottom: 16px">用户登录</h2>
    <el-form
      :model="form"
      :style="{ width: '480px', margin: '0 auto' }"
      label-align="left"
      auto-label-width
    >
      <el-form-item field="userAccount" label="账号">
        <el-input v-model="form.userAccount" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item field="userPassword" tooltip="密码不小于 8 位" label="密码">
        <el-input
          type="password"
          v-model="form.userPassword"
          placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item>
        <div
          style="
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
          "
        >
          <el-button
            type="primary"
            @click="handleSubmit"
            html-type="submit"
            style="width: 120px"
          >
            登录
          </el-button>
          <a-link href="/user/register">新用户注册</a-link>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import API from "@/api";
import { userLoginUsingPost } from "@/api/userController";
import { useLoginUserStore } from "@/store/userStore";
// import message from "@arco-design/web-vue/es/message";
// import message from "element-plus/es/components/message";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";

const loginUserStore = useLoginUserStore();
const router = useRouter();

const form = reactive({
  userAccount: "",
  userPassword: "",
} as API.UserLoginRequest);

/**
 * 提交
 */
const handleSubmit = async () => {
  const res = await userLoginUsingPost(form);
  if (res.data.code === 0) {
    await loginUserStore.fetchLoginUser();
    localStorage.setItem("token", res.data.data.token);
    // ElMessage.success("登录成功")
    ElMessage({
      showClose: true,
      message: "登录成功",
      type: "success",
    });
    // message.success("登录成功");
    //登录成功跳转主页
    router.push({
      path: "/",
      replace: true,
    });
  } else {
    ElMessage.error("登录失败，" + res.data.message);
    // ElMessage({
    //   message: "这是一条消息",
    //   type: "error",
    // });
  }
};
</script>
