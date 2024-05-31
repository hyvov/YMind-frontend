<template>
  <div id="userRegisterPage">
    <h2 style="margin-bottom: 16px">用户注册</h2>
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
      <el-form-item
        field="checkPassword"
        tooltip="确认密码不小于 8 位"
        label="确认密码"
      >
        <el-input
          type="password"
          v-model="form.checkPassword"
          placeholder="请输入确认密码"
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
            注册
          </el-button>
          <el-link href="/user/login">老用户登录</el-link>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import API from "@/api";
import { userRegisterUsingPost } from "@/api/userController";
import { ElMessage } from "element-plus";
// import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const router = useRouter();

const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as API.UserRegisterRequest);

/**
 * 提交
 */
const handleSubmit = async () => {
  const res = await userRegisterUsingPost(form);
  if (res.data.code === 0) {
    ElMessage.success("注册成功");
    router.push({
      path: "/user/login",
      replace: true,
    });
  } else {
    ElMessage.error("注册失败，" + res.data.message);
  }
};
</script>
