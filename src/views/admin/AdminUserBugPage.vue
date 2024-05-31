<template>
  <el-form
    :model="formSearchParams"
    :style="{ marginBottom: '50px' }"
    inline="true"
    @submit="doSearch"
  >
    <el-form-item field="userName" label="用户名">
      <el-input
        v-model="formSearchParams.userName"
        placeholder="请输入用户名"
      />
    </el-form-item>
    <el-form-item field="userProfile" label="用户简介">
      <el-input
        v-model="formSearchParams.userProfile"
        placeholder="请输入用户简介"
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="doSearch"
        html-type="submit"
        style="width: 100px"
      >
        搜索
      </el-button>
    </el-form-item>
  </el-form>

  <el-table :data="dataList" style="width: 100%" height="625px">
    <el-table-column prop="id" label="id" width="200" />
    <el-table-column prop="userAccount" label="账号" width="150" />
    <el-table-column prop="userName" label="用户名" width="200" />
    <el-table-column label="用户头像" width="100">
      <template #default="scope">
        <!-- 自定义插槽 -->
        <el-image
          class="el-image"
          :src="scope.row.userAvatar"
          style="width: 50px; height: 50px; z-index: 1000"
          :preview-src-list="[scope.row.userAvatar]"
          preview-teleported="true"
          fit="contain"
        >
        </el-image>
      </template>
    </el-table-column>
    <el-table-column prop="userProfile" label="用户简介" width="400" />
    <el-table-column prop="userRole" label="权限" width="100" />
    <!--    <el-table-column prop="createTime" label="创建时间" width="300" />-->
    <el-table-column label="创建时间" width="300">
      <template #default="scope">
        <span>{{
          dayjs(scope.row.createTime).format("YYYY-MM-DD HH:MM:ss")
        }}</span>
      </template>
    </el-table-column>
    <!--    <el-table-column prop="updateTime" label="更新时间" width="300" />-->
    <el-table-column label="更新时间" width="300">
      <template #default="scope">
        <span>{{
          dayjs(scope.row.updateTime).format("YYYY/MM/DD HH:MM:ss")
        }}</span>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="220">
      <template #default="scope">
        <el-space>
          <el-button type="danger" @click="doDelete(scope.row)" round
            >删除
          </el-button>
        </el-space>
      </template>
    </el-table-column>
  </el-table>
  <!--  <div>共有{{ total }}条</div>-->
  <el-pagination
    background
    :total="total"
    :page-size="searchParams.pageSize"
    :current-page="searchParams.current"
    @current-change="onPageChange"
    layout="prev, pager, next"
    style="display: flex; justify-content: center"
  />
</template>
<style scoped>
.el-image {
  position: relative; /* 或absolute */
  z-index: auto; /* 设置一个高的z-index值确保在最上层 */
}
</style>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import {
  deleteUserUsingPost,
  listUserByPageUsingPost,
} from "@/api/userController";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import "element-plus/dist/index.css";
import { dayjs } from "element-plus";

const formSearchParams = ref<API.UserQueryRequest>({});

// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  current: 1,
  pageSize: 9,
};
const total = ref<number>(0);

const searchParams = ref<API.UserQueryRequest>({
  ...initSearchParams,
});
const dataList = ref<API.User[]>([]);

/**
 * 加载数据
 */
const loadData = async () => {
  const res = await listUserByPageUsingPost(searchParams.value);
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || [];
    // total.value = res.data.data?.total || 1;
    // 细化的 total 赋值逻辑 上面的操作不知道为什么无法在el分页组件中无法读取total值

    if (res.data.data?.total) {
      const parsedTotal = Number(res.data.data?.total);
      total.value = parsedTotal;
    } else {
      total.value = Number(1);
    }

    // alert("res.data.data?.total" + res.data.data?.total);
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};

/**
 * 执行搜索
 */
const doSearch = () => {
  searchParams.value = {
    ...initSearchParams,
    ...formSearchParams.value,
  };
};

/**
 * 当分页变化时，改变搜索条件，触发数据加载
 * @param page
 */
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
  loadData();
};

/**
 * 删除
 * @param record
 */
const doDelete = async (record: API.User) => {
  if (!record.id) {
    return;
  }

  const res = await deleteUserUsingPost({
    id: record.id,
  });
  if (res.data.code === 0) {
    loadData();
    message.success("删除成功");
  } else {
    message.error("删除失败，" + res.data.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  loadData();
});
</script>
