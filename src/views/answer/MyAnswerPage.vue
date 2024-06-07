<template>
  <el-form
    :model="formSearchParams"
    :style="{ marginBottom: '5px' }"
    inline="true"
    @submit="doSearch"
  >
    <el-form-item field="resultName" label="结果名称">
      <el-input
        style="width: 200px"
        v-model="formSearchParams.resultName"
        placeholder="请输入结果名称"
        clearable
      />
    </el-form-item>
    <el-form-item field="resultDesc" label="结果描述">
      <el-input
        style="width: 240px"
        v-model="formSearchParams.resultDesc"
        placeholder="请输入结果描述"
        clearable
      />
    </el-form-item>
    <el-form-item field="appId" label="应用 id">
      <el-input
        style="width: 240px"
        v-model="formSearchParams.appId"
        placeholder="请输入应用 id"
        clearable
      />
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        html-type="submit"
        style="width: 100px"
        @click="doSearch"
      >
        搜索
      </el-button>
    </el-form-item>
  </el-form>

  <el-table :data="dataList" style="width: 100%" height="675px">
    <el-table-column prop="id" label="id" width="110" />
    <el-table-column prop="resultId" label="结果id" width="100" />
    <el-table-column prop="resultName" label="名称" width="120" />
    <el-table-column prop="resultDesc" label="描述" width="700" />
    <el-table-column label="图片" width="120">
      <template #default="scope">
        <!-- 自定义插槽 -->
        <el-image
          class="el-image"
          :src="scope.row.resultPicture"
          style="width: 70px; height: 70px; z-index: 1000"
          :preview-src-list="[scope.row.resultPicture]"
          preview-teleported="true"
          fit="contain"
        >
        </el-image>
      </template>
    </el-table-column>
    <el-table-column prop="resultScore" label="得分" width="100" />
    <el-table-column prop="appId" label="应用id" width="85" />
    <el-table-column label="应用类型" width="100">
      <template #default="scope">
        {{ APP_TYPE_MAP[scope.row.appType] }}
      </template>
    </el-table-column>
    <el-table-column label="评分策略" width="100">
      <template #default="scope">
        {{ APP_SCORING_STRATEGY_MAP[scope.row.scoringStrategy] }}
      </template>
    </el-table-column>
    <el-table-column prop="choices" label="选项" width="200" />
    <el-table-column label="创建时间" width="300">
      <template #default="scope">
        <span>{{
          dayjs(scope.row.createTime).format("YYYY-MM-DD HH:MM:ss")
        }}</span>
      </template>
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="100">
      <template #default="scope">
        <el-space>
          <el-button type="danger" @click="doDelete(scope.row)" round
            >删除
          </el-button>
        </el-space>
      </template>
    </el-table-column>
  </el-table>

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
<style scoped></style>
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import {
  deleteUserAnswerUsingPost,
  listMyUserAnswerVoByPageUsingPost,
} from "@/api/userAnswerController";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { dayjs } from "@arco-design/web-vue/es/_utils/date";
import { APP_SCORING_STRATEGY_MAP, APP_TYPE_MAP } from "@/constant/app";

const formSearchParams = ref<API.UserAnswerQueryRequest>({});

// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  current: 1,
  pageSize: 10,
};

const searchParams = ref<API.UserAnswerQueryRequest>({
  ...initSearchParams,
});
const dataList = ref<API.UserAnswerVO[]>([]);
const total = ref<number>(0);

/**
 * 加载数据
 */
const loadData = async () => {
  const res = await listMyUserAnswerVoByPageUsingPost(searchParams.value);
  if (res.data.code === 0) {
    dataList.value = res.data.data?.records || [];
    // total.value = res.data.data?.total || 0;
    // total.value = res.data.data?.total || 1;
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
 * 删除
 * @param record
 */
const doDelete = async (record: API.UserAnswer) => {
  if (!record.id) {
    return;
  }

  const res = await deleteUserAnswerUsingPost({
    id: record.id,
  });
  if (res.data.code === 0) {
    loadData();
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
