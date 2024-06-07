<template>
  <el-form
    :model="formSearchParams"
    :style="{ marginBottom: '5px' }"
    inline="ture"
    @submit="doSearch"
  >
    <el-form-item field="appName" label="应用名称">
      <el-input
        v-model="formSearchParams.appName"
        placeholder="请输入应用名称"
        clearable
      />
    </el-form-item>
    <el-form-item field="appDesc" label="应用描述">
      <el-input
        v-model="formSearchParams.appDesc"
        placeholder="请输入应用描述"
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
    <el-table-column prop="appName" label="名称" width="200" />
    <el-table-column prop="appDesc" label="描述" width="320" />
    <el-table-column prop="reviewMessage" label="审核信息" width="100" />
    <el-table-column prop="reviewerId" label="审核人id" width="100" />
    <el-table-column prop="userId" label="用户id" width="100" />
    <el-table-column label="图标" width="120">
      <template #default="scope">
        <!-- 自定义插槽 -->
        <el-image
          class="el-image"
          :src="scope.row.appIcon"
          style="width: 70px; height: 70px; z-index: 1000"
          :preview-src-list="[scope.row.appIcon]"
          preview-teleported="true"
          fit="contain"
        >
        </el-image>
      </template>
    </el-table-column>
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
    <el-table-column label="审核状态" width="100">
      <template #default="scope">
        {{ REVIEW_STATUS_MAP[scope.row.reviewStatus] }}
      </template>
    </el-table-column>

    <el-table-column label="审核时间" width="200">
      <template #default="scope">
        <span>{{
          dayjs(scope.row.reviewTime).format("YYYY-MM-DD HH:MM:ss")
        }}</span>
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
          dayjs(scope.row.updateTime).format("YYYY-MM-DD HH:MM:ss")
        }}</span>
      </template>
    </el-table-column>

    <el-table-column fixed="right" label="操作" width="200">
      <template #default="scope">
        <el-space>
          <el-button
            type="success"
            round
            v-if="scope.row.reviewStatus !== REVIEW_STATUS_ENUM.PASS"
            @click="doReview(scope.row, REVIEW_STATUS_ENUM.PASS, '')"
          >
            通过
          </el-button>

          <el-button
            type="warning"
            round
            v-if="scope.row.reviewStatus !== REVIEW_STATUS_ENUM.REJECT"
            @click="
              doReview(scope.row, REVIEW_STATUS_ENUM.REJECT, '不符合上架要求')
            "
          >
            拒绝
          </el-button>

          <el-space>
            <el-button type="danger" @click="doDelete(scope.row)" round
              >删除
            </el-button>
          </el-space>
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
  deleteAppUsingPost,
  doAppReviewUsingPost,
  listAppByPageUsingPost,
} from "@/api/appController";
import API from "@/api";
import message from "@arco-design/web-vue/es/message";
import { dayjs } from "@arco-design/web-vue/es/_utils/date";
import {
  APP_SCORING_STRATEGY_MAP,
  APP_TYPE_MAP,
  REVIEW_STATUS_ENUM,
  REVIEW_STATUS_MAP,
} from "@/constant/app";

const formSearchParams = ref<API.AppQueryRequest>({});

// 初始化搜索条件（不应该被修改）
const initSearchParams = {
  current: 1,
  pageSize: 10,
};

const searchParams = ref<API.AppQueryRequest>({
  ...initSearchParams,
});
const dataList = ref<API.App[]>([]);
const total = ref<number>(0);

/**
 * 加载数据
 */
const loadData = async () => {
  const res = await listAppByPageUsingPost(searchParams.value);
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
const doDelete = async (record: API.App) => {
  if (!record.id) {
    return;
  }

  const res = await deleteAppUsingPost({
    id: record.id,
  });
  if (res.data.code === 0) {
    loadData();
  } else {
    message.error("删除失败，" + res.data.message);
  }
};

/**
 * 审核
 * @param record
 * @param reviewStatus
 * @param reviewMessage
 */
const doReview = async (
  record: API.App,
  reviewStatus: number,
  reviewMessage?: string
) => {
  if (!record.id) {
    return;
  }

  const res = await doAppReviewUsingPost({
    id: record.id,
    reviewStatus,
    reviewMessage,
  });
  if (res.data.code === 0) {
    loadData();
  } else {
    message.error("审核失败，" + res.data.message);
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
    title: "名称",
    dataIndex: "appName",
  },
  {
    title: "描述",
    dataIndex: "appDesc",
  },
  {
    title: "图标",
    dataIndex: "appIcon",
    slotName: "appIcon",
  },
  {
    title: "应用类型",
    dataIndex: "appType",
    slotName: "appType",
  },
  {
    title: "评分策略",
    dataIndex: "scoringStrategy",
    slotName: "scoringStrategy",
  },
  {
    title: "审核状态",
    dataIndex: "reviewStatus",
    slotName: "reviewStatus",
  },
  {
    title: "审核信息",
    dataIndex: "reviewMessage",
  },
  {
    title: "审核时间",
    dataIndex: "reviewTime",
    slotName: "reviewTime",
  },
  {
    title: "审核人id",
    dataIndex: "reviewerId",
  },
  {
    title: "用户id",
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
