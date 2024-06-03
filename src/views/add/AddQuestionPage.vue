<template>
  <div id="addQuestionPage">
    <h2 style="margin-bottom: 32px">设置题目</h2>
    <el-form
      :model="questionContent"
      :style="{ width: '480px' }"
      label-align="left"
      auto-label-width
      @submit="handleSubmit"
    >
      <el-form-item label="应用 id">
        {{ appId }}
      </el-form-item>
      <el-form-item label="题目列表" :content-flex="false" :merge-props="false">
        <el-space size="medium">
          <el-button @click="addQuestion(questionContent.length)">
            底部添加题目
          </el-button>
          <AiGenerateQuestionDrawer
            :appId="appId"
            :onSuccess="onAiGenerateSuccess"
            :onSSESuccess="onAiGenerateSuccessSSE"
            :onSSEClose="onSSEClose"
            :onSSEStart="onSSEStart"
          />
        </el-space>

        <!-- 遍历每道题目 -->
        <div v-for="(question, index) in questionContent" :key="index">
          <el-space size="large">
            <h3>题目 {{ index + 1 }}</h3>
            <el-button size="small" @click="addQuestion(index + 1)">
              添加题目
            </el-button>
            <el-button
              size="small"
              status="danger"
              @click="deleteQuestion(index)"
            >
              删除题目
            </el-button>
          </el-space>
          <el-form-item field="posts.post1" :label="`题目 ${index + 1} 标题`">
            <a-input v-model="question.title" placeholder="请输入标题" />
          </el-form-item>
          <!--  题目选项 -->
          <el-space size="large">
            <h4>题目 {{ index + 1 }} 选项列表</h4>
            <el-button
              size="small"
              @click="addQuestionOption(question, question.options.length)"
            >
              底部添加选项
            </el-button>
          </el-space>
          <el-form-item
            v-for="(option, optionIndex) in question.options"
            :key="optionIndex"
            :label="`选项 ${optionIndex + 1}`"
            :content-flex="false"
            :merge-props="false"
          >
            <el-form-item label="选项 key" label-width="100px">
              <a-input v-model="option.key" placeholder="请输入选项 key" />
            </el-form-item>
            <el-form-item label="选项值" label-width="100px">
              <a-input v-model="option.value" placeholder="请输入选项值" />
            </el-form-item>
            <el-form-item label="选项结果" label-width="100px">
              <a-input v-model="option.result" placeholder="请输入选项结果" />
            </el-form-item>
            <el-form-item label="选项得分" label-width="100px">
              <el-input-number
                v-model="option.score"
                placeholder="请输入选项得分"
              />
            </el-form-item>
            <el-space size="large">
              <el-button
                size="mini"
                @click="addQuestionOption(question, optionIndex + 1)"
              >
                添加选项
              </el-button>
              <el-button
                size="mini"
                status="danger"
                @click="deleteQuestionOption(question, optionIndex as any)"
              >
                删除选项
              </el-button>
            </el-space>
          </el-form-item>
          <!-- 题目选项结尾 -->
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          html-type="submit"
          style="width: 120px"
          @click="handleSubmit"
        >
          提交
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style scoped>
.el-form-item {
  margin-bottom: 10px;
}
</style>

<script setup lang="ts">
import { defineProps, ref, watchEffect, withDefaults } from "vue";
import API from "@/api";
import { useRouter } from "vue-router";
import {
  addQuestionUsingPost,
  editQuestionUsingPost,
  listQuestionVoByPageUsingPost,
} from "@/api/questionController";
import message from "@arco-design/web-vue/es/message";
import AiGenerateQuestionDrawer from "@/views/add/components/AiGenerateQuestionDrawer.vue";
import axios from "axios";

interface Props {
  appId: string;
  onSucess?: (result: API.QuestionContentDTO[]) => void;
}

const props = withDefaults(defineProps<Props>(), {
  appId: () => {
    return "";
  },
});

const router = useRouter();

// 题目内容结构（理解为题目列表）
const questionContent = ref<API.QuestionContentDTO[]>([]);

/**
 * 添加题目
 * @param index
 */
const addQuestion = (index: number) => {
  questionContent.value.splice(index, 0, {
    title: "",
    options: [],
  });
};

/**
 * 删除题目
 * @param index
 */
const deleteQuestion = (index: number) => {
  questionContent.value.splice(index, 1);
};

/**
 * 添加题目选项
 * @param question
 * @param index
 */
const addQuestionOption = (question: API.QuestionContentDTO, index: number) => {
  if (!question.options) {
    question.options = [];
  }
  question.options.splice(index, 0, {
    key: "",
    value: "",
  });
};

/**
 * 删除题目选项
 * @param question
 * @param index
 */
const deleteQuestionOption = (
  question: API.QuestionContentDTO,
  index: number
) => {
  if (!question.options) {
    question.options = [];
  }
  question.options.splice(index, 1);
};

const oldQuestion = ref<API.QuestionVO>();

/**
 * 加载数据
 */
const loadData = async () => {
  if (!props.appId) {
    return;
  }
  const res = await listQuestionVoByPageUsingPost({
    appId: props.appId as any,
    current: 1,
    pageSize: 1,
    sortField: "createTime",
    sortOrder: "descend",
  });
  if (res.data.code === 0 && res.data.data?.records) {
    oldQuestion.value = res.data.data?.records[0];
    if (oldQuestion.value) {
      questionContent.value = oldQuestion.value.questionContent ?? [];
    }
    message.success("获取数据成功，" + res.data.message);
  } else {
    message.error("获取数据失败，" + res.data.message);
  }
};

// 获取旧数据
watchEffect(() => {
  loadData();
});

/**
 * 提交
 */
const handleSubmit = async () => {
  if (!props.appId || !questionContent.value) {
    return;
  }
  let res: any;

  // 如果是修改
  if (oldQuestion.value?.id) {
    res = await editQuestionUsingPost({
      id: oldQuestion.value.id,
      questionContent: questionContent.value,
    });
    console.log("修改成功");
  } else {
    // // 创建
    // res = await addQuestionUsingPost({
    //   appId: props.appId as any,
    //   questionContent: questionContent.value,
    // });
    console.log("创建成功");
  }
  if (res.data.code === 0) {
    message.success("操作成功，即将跳转到应用详情页");
    setTimeout(() => {
      router.push(`/app/detail/${props.appId}`);
    }, 3000);
  } else {
    message.error("操作失败，" + res.data.message);
  }
};
/*
 * AI 生成题目执行
 */
const onAiGenerateSuccess = (result: API.QuestionContentDTO[]) => {
  questionContent.value = [...questionContent.value, ...result];
  message.success(`AI 生成题目成功，已新增 ${result.length} 道题目`);
};
/*
 * AI 实时生成题目执行
 */
const onAiGenerateSuccessSSE = (result: API.QuestionContentDTO[]) => {
  questionContent.value = [...questionContent.value, result];
};
const onSSEStart = (event: any) => {
  message.success("开始生成");
};
const onSSEClose = (event: any) => {
  message.success("生成完毕");
};
const myAxios = axios.create({
  baseURL: "http://localhost:8101",
  timeout: 60000,
  withCredentials: true,
});
</script>
