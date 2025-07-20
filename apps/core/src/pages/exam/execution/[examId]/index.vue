<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ExamCRUDProxy } from "@/entities/exam/api/exam.proxy";
import { ExamExecutionProxy } from "@/entities/exam/api/execution.proxy";
import TaskGraphComponent from "@/components/task/TaskGraphComponent.vue";
import TaskImplementationComponent from "@/components/task/TaskImplementationComponent.vue";
import { useVueFlowBus } from "@/features/graph/stores/vueFlowBus";
import { useNodeStore } from "@/features/graph/stores/nodes";

const route = useRoute();
const router = useRouter();
const examId: string = Array.isArray(route.params.examId)
  ? route.params.examId[0]
  : route.params.examId;
const exam = ref(ExamCRUDProxy.getExamById(examId));
const currentTaskIndex = ref(0);
const timeLeft = ref("00:00");
const timerExpired = ref(false);
const showConfirmDialog = ref(false);

onMounted(() => {
  if (exam.value && exam.value.isFinished) {
    router.push("/exam/list");
  }
  if (!exam.value?.startTime) {
    ExamExecutionProxy.startExam(examId);
    exam.value = ExamCRUDProxy.getExamById(examId);
  }
  startTimer();
});

const currentTask = computed(() => {
  return exam.value?.tasks?.[currentTaskIndex.value];
});

const progress = computed(() => {
  if (!exam.value?.tasks) return 0;
  const completed = exam.value.tasks.filter(
    (t) => t.progress === "COMPLETED",
  ).length;
  return Math.round((completed / exam.value.tasks.length) * 100);
});

const finishExam = () => {
  showConfirmDialog.value = false;
  ExamExecutionProxy.finishExam(examId);
  router.push("/exam/list");
};

const handleCompleted = () => {
  if (!exam.value) return;

  const taskOrder = exam.value.tasks[currentTaskIndex.value].order;
  ExamExecutionProxy.completeTask(examId, taskOrder);
  exam.value = ExamCRUDProxy.getExamById(examId);
};

const startTimer = () => {
  if (!exam.value?.startTime || !exam.value.overallTime) return;

  const overallTimeMs = parseInt(exam.value.overallTime) * 60 * 1000;
  const startTime = parseInt(exam.value.startTime);
  const endTime = startTime + overallTimeMs;

  const updateTimer = () => {
    const now = Date.now();
    const remaining = endTime - now;

    if (remaining <= 0) {
      timeLeft.value = "00:00";
      timerExpired.value = true;
      finishExam();
      return;
    }

    const minutes = Math.floor(remaining / 60000)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor((remaining % 60000) / 1000)
      .toString()
      .padStart(2, "0");

    timeLeft.value = `${minutes}:${seconds}`;
  };

  updateTimer();
  const timer = setInterval(updateTimer, 1000);
  return () => clearInterval(timer);
};

const goToTask = (index: number) => {
  const nodeStore = useNodeStore();
  if (index >= 0 && index < (exam.value?.tasks?.length || 0)) {
    nodeStore.$reset();
    currentTaskIndex.value = index;
    exam.value = ExamCRUDProxy.getExamById(examId);
  }
};
</script>

<template>
  <v-container class="exam-container">
    <v-card class="exam-card" elevation="4">
      <v-card-title class="d-flex justify-space-between align-center">
        <div>
          <h1 class="text-h4">{{ exam?.name }}</h1>
          <p class="text-subtitle-1 text-grey-darken-1">
            {{ exam?.description }}
          </p>
        </div>
        <div>
          <v-btn
            class="mr-6"
            density="comfortable"
            color="blue"
            @click="showConfirmDialog = true"
            >Завершить экзамен</v-btn
          >
          <v-chip
            :color="timerExpired ? 'error' : 'primary'"
            size="large"
            prepend-icon="mdi-clock-outline"
          >
            {{ timeLeft }}
          </v-chip>
        </div>
      </v-card-title>

      <v-card-text>
        <v-progress-linear
          :model-value="progress"
          color="light-green"
          height="20"
          rounded
        >
          <template v-slot:default="{ value }">
            <strong>{{ Math.ceil(value) }}%</strong>
          </template>
        </v-progress-linear>
      </v-card-text>

      <v-card-text class="task-content">
        <v-card outlined v-if="currentTask">
          <v-card-title>Задание {{ currentTask.order }}</v-card-title>
          <v-card-text>
            <task-implementation-component
              v-if="currentTask.type === 'IMPLEMENTATION'"
              :id="currentTask.taskId"
              :on-correct-solution="handleCompleted"
            />
            <task-graph-component
              v-else-if="currentTask.type === 'GRAPH'"
              :id="currentTask.taskId"
              :on-correct-solution="handleCompleted"
            />
          </v-card-text>
        </v-card>
      </v-card-text>

      <v-card-actions class="d-flex justify-center pa-4">
        <v-pagination
          :model-value="currentTaskIndex + 1"
          :length="exam?.tasks?.length || 0"
          :total-visible="7"
          rounded
          @update:modelValue="(newPage) => goToTask(newPage - 1)"
        >
          <template v-slot:prev="props">
            <v-btn
              variant="text"
              icon="mdi-chevron-left"
              v-bind="props"
              class="pagination-button"
            ></v-btn>
          </template>

          <template v-slot:item="{ page, isActive }">
            <v-btn
              :color="
                isActive
                  ? 'primary'
                  : exam?.tasks[+page - 1]?.progress === 'COMPLETED'
                    ? 'success'
                    : 'default'
              "
              :variant="
                isActive || exam?.tasks[+page - 1]?.progress === 'COMPLETED'
                  ? 'flat'
                  : 'text'
              "
              :prepend-icon="
                exam?.tasks[+page - 1]?.progress === 'COMPLETED'
                  ? 'mdi-check'
                  : undefined
              "
              size="small"
              class="font-weight-bold pagination-button"
              @click="goToTask(+page - 1)"
            >
              {{ exam?.tasks[+page - 1]?.order ?? page }}
            </v-btn>
          </template>

          <template v-slot:next="props">
            <v-btn
              variant="text"
              icon="mdi-chevron-right"
              v-bind="props"
              class="pagination-button"
            ></v-btn>
          </template>
        </v-pagination>
      </v-card-actions>
    </v-card>

    <!-- Диалог подтверждения завершения экзамена -->
    <v-dialog v-model="showConfirmDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">Подтверждение</v-card-title>
        <v-card-text>
          Вы уверены, что хотите завершить экзамен? После завершения вы не
          сможете вернуться к заданиям.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" @click="showConfirmDialog = false">Отмена</v-btn>
          <v-btn color="primary" @click="finishExam">Завершить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.exam-container {
  max-width: 90%;
  padding-top: 32px;
}

.exam-card {
  padding: 20px;
}

.task-content {
  min-height: 400px;
}

.v-btn--variant-flat.v-btn--color-success {
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
}

.v-btn--variant-flat.v-btn--color-success:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}

/* Выравнивание всех элементов пагинации */
:deep(.v-pagination__list) {
  display: flex;
  align-items: center;
}

.pagination-button {
  margin: 0 2px;
  height: 36px;
  min-width: 36px;
}
</style>
