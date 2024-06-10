<template>
  <el-form
    :model="formSearchParams"
    :style="{ marginBottom: '5px' }"
    inline="true"
    @submit="doSearch"
  >
    <el-form-item field="appId" label="应用 id">
      <el-input
        v-model="formSearchParams.appId"
        placeholder="请输入应用 id"
        allow-clear
      />
    </el-form-item>
    <el-form-item field="userId" label="用户 id">
      <el-input
        v-model="formSearchParams.userId"
        placeholder="请输入用户 id"
        allow-clear
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" html-type="submit" style="width: 100px">
        搜索
      </el-button>
    </el-form-item>
  </el-form>

  <el-table :data="dataList" style="width: 100%" height="675px">
    <el-table-column prop="id" label="id" width="100" />
    <el-table-column prop="appId" label="应用 id" width="100" />
    <el-table-column prop="userId" label="用户 id" width="100" />

    <el-table-column label="题目内容" width="1200">
      <template #default="scope">
        <div
          v-for="question in JSON.parse(scope.row.questionContent)"
          :key="question.title"
        >
          {{ question }}
        </div>
      </template>
    </el-table-column>

    <el-table-column label="创建时间" width="200">
      <template #default="scope">
        <span>{{
          dayjs(scope.row.createTime).format("YYYY-MM-DD HH:MM:ss")
        }}</span>
      </template>
    </el-table-column>
    <el-table-column label="更新时间" width="200">
      <template #default="scope">
        <span>{{
          dayjs(scope.row.updateTime).format("YYYY/MM/DD HH:MM:ss")
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

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import {
  deleteQuestionUsingPost,
  listQuestionByPageUsingPost,
} from "@/api/questionController";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { dayjs } from "@arco-design/web-vue/es/_utils/date";

const formSearchParams = ref<API.QuestionQueryRequest>({});

// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  current: 1,
  pageSize: 10,
};

const searchParams = ref<API.QuestionQueryRequest>({
  ...initSearchParams,
});
const dataList = ref<API.Question[]>([]);
const total = ref<number>(0);

/**
 * 加载数据
 */
const loadData = async () => {
  const res = await listQuestionByPageUsingPost(searchParams.value);
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
 * 删除
 * @param record
 */
const doDelete = async (record: API.Question) => {
  if (!record.id) {
    return;
  }

  const res = await deleteQuestionUsingPost({
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

// 表格列配置
const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "题目内容",
    dataIndex: "questionContent",
    slotName: "questionContent",
  },
  {
    title: "应用 id",
    dataIndex: "appId",
  },
  {
    title: "用户 id",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    slotName: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
    slotName: "updateTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
</script>
