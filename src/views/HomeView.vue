<template>
  <div id="homePage">
    <div class="searchBar">
      <el-form
        :model="formSearchParams"
        :style="{ marginBottom: '5px' }"
        inline="true"
        @submit="doSearch"
      >
        <el-form-item field="userName" label="用户名">
          <el-input
            style="width: 200px"
            v-model="formSearchParams.appName"
            placeholder="请输入App名字"
            size="large"
            clearable
          />
          <el-button
            type="primary"
            @click="doSearch"
            html-type="submit"
            size="large"
            style="width: 70px"
          >
            搜索
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <a-list
      class="list-demo-action-layout"
      :grid-props="{ gutter: [20, 20], sm: 24, md: 12, lg: 8, xl: 6 }"
      :bordered="false"
      :data="dataList"
    >
      <template #item="{ item }">
        <AppCard :app="item" />
      </template>
    </a-list>

    <el-pagination
      background
      :total="total"
      :page-size="searchParams.pageSize"
      :current-page="searchParams.current"
      @current-change="onPageChange"
      layout="prev, pager, next"
      style="display: flex; justify-content: center"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import AppCard from "@/components/AppCard.vue";
import API from "@/api";
import { listAppVoByPageUsingPost } from "@/api/appController";
import message from "@arco-design/web-vue/es/message";
import { REVIEW_STATUS_ENUM } from "@/constant/app";
import { Edit } from "@element-plus/icons-vue";

const formSearchParams = ref<API.AppQueryRequest>({});
// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  current: 1,
  pageSize: 12,
};

const searchParams = ref<API.AppQueryRequest>({
  ...initSearchParams,
});
const dataList = ref<API.AppVO[]>([]);
const total = ref<number>(0);

/**
 * 加载数据
 */
const loadData = async () => {
  const params = {
    reviewStatus: REVIEW_STATUS_ENUM.PASS,
    ...searchParams.value,
  };
  const res = await listAppVoByPageUsingPost(params);
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || [];
    // total.value = res.data.data?.total || 0;
    // 细化的 total 赋值逻辑 上面的操作不知道为什么无法在el分页组件中无法读取total值
    if (res.data.data?.total) {
      const parsedTotal = Number(res.data.data?.total);
      total.value = parsedTotal;
    } else {
      total.value = Number(1);
    }
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
};

/**
 * 监听 searchParams 变量，改变时触发数据的重新加载
 */
watchEffect(() => {
  loadData();
});
</script>

<style scoped>
#homePage {
}

.searchBar {
  margin-bottom: 28px;
  text-align: center;
}

.list-demo-action-layout .image-area {
  width: 183px;
  height: 119px;
  overflow: hidden;
  border-radius: 2px;
}

.list-demo-action-layout .list-demo-item {
  padding: 20px 0;
  border-bottom: 1px solid var(--color-fill-3);
}

.list-demo-action-layout .image-area img {
  width: 100%;
}

.list-demo-action-layout .arco-list-item-action .arco-icon {
  margin: 0 4px;
}
</style>
