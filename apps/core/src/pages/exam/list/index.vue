<script setup lang="ts">
import { ExamCRUDProxy } from "@/entities/exam/api/exam.proxy";
import { ref, onMounted, computed } from "vue";
import {
  VCard,
  VBtn,
  VSpacer,
  VContainer,
  VRow,
  VCol,
  VDialog,
} from "vuetify/components";
import { Exam } from "@/entities/exam/types/base";
import { ExamExecutionProxy } from "@/entities/exam/api/execution.proxy";
import { useRouter } from "vue-router";

const exams = ref<Exam[]>([]);
const router = useRouter();
const showConfirmDialog = ref(false);
const showResultsDialog = ref(false);
const selectedExamId = ref<string | null>(null);
const examResults = ref<{ completed: number; total: number } | null>(null);

onMounted(() => {
  exams.value = ExamCRUDProxy.getExamsList();
});

const currentTime = computed(() => Date.now());

const getExamStatus = (exam: Exam) => {
  if (!exam.startTime) return "not_started";
  if (exam.isFinished) return "finished";

  const examDurationMs = (parseInt(exam.overallTime) || 0) * 60 * 1000;
  const examEndTime = parseInt(exam.startTime) + examDurationMs;

  if (currentTime.value < examEndTime) return "in_progress";
  return "finished";
};

const openConfirmDialog = (examId: string) => {
  selectedExamId.value = examId;
  showConfirmDialog.value = true;
};

const startExam = () => {
  if (!selectedExamId.value) return;

  const result = ExamExecutionProxy.startExam(selectedExamId.value);
  if (result) {
    router.push(`/exam/execution/${selectedExamId.value}`);
  }
  showConfirmDialog.value = false;
};

const continueExam = (examId: string) => {
  router.push(`/exam/execution/${examId}`);
};

const finishExam = (examId: string) => {
  const exam = exams.value.find((e) => e.id === examId);
  if (!exam || !exam.tasks) return;

  // Помечаем экзамен как завершенный
  exam.isFinished = true;

  const completed = exam.tasks.filter((t) => t.progress === "COMPLETED").length;
  const total = exam.tasks.length;

  examResults.value = { completed, total };
  selectedExamId.value = examId;
  showResultsDialog.value = true;
};

const showResults = (examId: string) => {
  const exam = exams.value.find((e) => e.id === examId);
  if (!exam || !exam.tasks) return;

  const completed = exam.tasks.filter((t) => t.progress === "COMPLETED").length;
  const total = exam.tasks.length;

  examResults.value = { completed, total };
  selectedExamId.value = examId;
  showResultsDialog.value = true;
};

const getExamById = (examId: string) => {
  return exams.value.find((exam) => exam.id === examId);
};
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-6">Список экзаменов</h1>

    <v-row v-if="exams.length === 0">
      <v-col>
        <v-card class="pa-4 text-center">
          <p class="text-body-1">Экзамены не найдены</p>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12" md="6" lg="4" v-for="exam in exams" :key="exam.id">
        <v-card class="h-100 d-flex flex-column" elevation="3">
          <v-card-title class="text-h6">{{ exam.name }}</v-card-title>

          <v-card-subtitle class="text-body-1">
            {{ exam.description || "Описание отсутствует" }}
          </v-card-subtitle>

          <v-card-text class="flex-grow-1">
            <div class="mb-2">
              <strong>Количество заданий:</strong> {{ exam.tasks?.length || 0 }}
            </div>
            <div>
              <strong>Общее время:</strong>
              {{ exam.overallTime || "Не указано" }} минут
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions class="pa-4">
            <v-spacer></v-spacer>
            <template v-if="!exam.startTime">
              <v-btn
                color="primary"
                variant="flat"
                @click="openConfirmDialog(exam.id)"
              >
                Начать
              </v-btn>
            </template>
            <template v-else-if="getExamStatus(exam) === 'in_progress'">
              <v-btn
                color="primary"
                variant="flat"
                @click="continueExam(exam.id)"
              >
                Продолжить
              </v-btn>
            </template>
            <template v-else>
              <v-btn
                color="primary"
                variant="outlined"
                @click="showResults(exam.id)"
              >
                Показать результаты
              </v-btn>
            </template>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Диалог подтверждения начала экзамена -->
    <v-dialog v-model="showConfirmDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h5">Подтверждение</v-card-title>
        <v-card-text> Вы уверены, что хотите начать экзамен? </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="showConfirmDialog = false">
            Отмена
          </v-btn>
          <v-btn color="primary" variant="flat" @click="startExam">
            Начать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог с результатами -->
    <v-dialog v-model="showResultsDialog" max-width="500">
      <v-card v-if="examResults && selectedExamId">
        <v-card-title class="text-h5">
          Результаты: {{ getExamById(selectedExamId)?.name }}
        </v-card-title>

        <v-card-text>
          <div class="text-h6 mb-4">
            Выполнено заданий: {{ examResults.completed }} из
            {{ examResults.total }}
          </div>
          <div class="text-h6">
            Процент выполнения:
            {{ Math.round((examResults.completed / examResults.total) * 100) }}%
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            variant="flat"
            @click="showResultsDialog = false"
          >
            Закрыть
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<style scoped>
.v-card {
  transition: transform 0.2s;
}

.v-card:hover {
  transform: translateY(-5px);
}

.h-100 {
  height: 100%;
}

.flex-grow-1 {
  flex-grow: 1;
}
</style>
