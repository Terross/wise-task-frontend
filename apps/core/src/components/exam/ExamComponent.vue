<template>
  <v-container class="fill-height" fluid>
    <v-row
      class="fill-height"
      align="center"
      justify="center"
      v-if="!examStarted || examFinished"
    >
      <v-col cols="12" md="6">
        <v-card class="pa-4" elevation="2">
          <v-card-text v-if="!examStarted">
            <v-card-title class="text-h5 text-center"
              >Добро пожаловать на экзамен</v-card-title
            >
            <p class="text-center mb-2">
              Количество: <b>{{ tasks.length }} задач</b>
            </p>
            <p class="text-center mb-4">
              Длительность: <b>{{ totalTime / 60 }} минут</b>
            </p>
            <v-btn color="primary" block @click="startExam"
              >Начать экзамен</v-btn
            >
          </v-card-text>
          <v-card-text v-else>
            <div class="text-center">
              <v-card-title class="text-h5">Экзамен завершен</v-card-title>
              <p>
                Правильных ответов: {{ correctCount }} из {{ tasks.length }}
              </p>
              <v-btn color="primary" block class="mt-4" @click="resetExam">
                Начать снова
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="fill-height" v-else>
      <v-col cols="10" v-if="!isLoading">
        <TaskGraphComponent
          v-if="tasks.length > 0"
          :key="tasks[currentTaskIndex]?.id"
          :id="tasks[currentTaskIndex]?.id"
          @isCorrect="handleCorrectAnswer"
        />
      </v-col>

      <v-col cols="2" class="d-flex flex-column">
        <v-row class="d-flex align-center justify-center mb-8">
          <v-progress-circular
            :model-value="timeLeftPercent"
            size="170"
            width="14"
            :color="
              timeLeftPercent <= 15
                ? 'red'
                : timeLeftPercent <= 35
                ? 'orange'
                : 'blue'
            "
          >
            {{ Math.floor(timeLeft / 60) }}:{{
              ("0" + (timeLeft % 60)).slice(-2)
            }}
          </v-progress-circular>
        </v-row>

        <v-row class="d-flex align-center justify-center mb-4">
          <v-chip color="primary">
            Задача {{ currentTaskIndex + 1 }} из {{ tasks.length }}
          </v-chip>
        </v-row>

        <v-row class="d-flex align-center justify-center mb-4">
          <v-btn
            color="primary"
            class="mr-2"
            @click="goToPreviousTask"
            :disabled="currentTaskIndex <= 0"
          >
            Назад
          </v-btn>
          <v-btn
            color="primary"
            @click="goToNextTask"
            :disabled="currentTaskIndex >= tasks.length - 1"
          >
            Вперед
          </v-btn>
        </v-row>

        <v-row class="d-flex align-start justify-center">
          <v-btn color="orange" @click="endExam"> Завершить экзамен </v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ref, computed, onBeforeUnmount } from "vue";
import TaskGraphComponent from "../task/TaskGraphComponent.vue";
import { GET_ALL_TASKS } from "@/api/Queries";
import { useQuery } from "@vue/apollo-composable";

export default {
  setup() {
    const examStarted = ref(false);
    const examFinished = ref(false);
    const timeLeft = ref(1800);
    const totalTime = ref(1800);
    const tasks = ref([]);
    const currentTaskIndex = ref(0);
    const isLoading = ref(true);
    const correctCount = ref(0);
    const correctAnswers = ref<Record<number, boolean>>({});
    let timer: NodeJS.Timer | null = null;

    const { onResult } = useQuery(GET_ALL_TASKS);
    onResult((response) => {
      if (response.data) {
        isLoading.value = false;
        tasks.value = response.data.getAllTasks;
      }
    });

    const timeLeftPercent = computed(
      () => (timeLeft.value / totalTime.value) * 100
    );

    const handleCorrectAnswer = (isCorrect: boolean) => {
      correctAnswers.value[currentTaskIndex.value] = isCorrect;

      correctCount.value = Object.values(correctAnswers.value).filter(
        Boolean
      ).length;
    };

    const startExam = () => {
      examStarted.value = true;
      examFinished.value = false;
      correctCount.value = 0;
      correctAnswers.value = {};
      timeLeft.value = totalTime.value;
      currentTaskIndex.value = 0;
      timer = setInterval(() => {
        if (timeLeft.value > 0) {
          timeLeft.value--;
        } else {
          endExam();
        }
      }, 1000);
    };

    const endExam = () => {
      clearInterval(timer);
      examFinished.value = true;
    };

    const resetExam = () => {
      clearInterval(timer);
      examStarted.value = false;
      examFinished.value = false;
      timeLeft.value = totalTime.value;
      currentTaskIndex.value = 0;
      correctCount.value = 0;
      correctAnswers.value = {};
    };

    const goToNextTask = () => {
      if (currentTaskIndex.value < tasks.value.length - 1) {
        currentTaskIndex.value++;
      }
    };

    const goToPreviousTask = () => {
      if (currentTaskIndex.value > 0) {
        currentTaskIndex.value--;
      }
    };

    onBeforeUnmount(() => {
      clearInterval(timer);
    });

    return {
      examStarted,
      examFinished,
      timeLeft,
      totalTime,
      timeLeftPercent,
      startExam,
      endExam,
      resetExam,
      tasks,
      isLoading,
      currentTaskIndex,
      goToNextTask,
      goToPreviousTask,
      correctCount,
      handleCorrectAnswer,
    };
  },
};
</script>
