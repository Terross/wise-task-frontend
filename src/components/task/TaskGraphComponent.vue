<template>
  <v-container>
    <v-row>
      <v-col>
        <Graph :style="{ width: '100%', border: '1px solid black' }" />
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>{{ activeTask.name }}</v-card-title>
          <v-card-text
            class="text-pre-wrap"
            v-html="formatDescription(activeTask.description)"
          >
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" variant="outlined" @click="solveTask">
              Отправить решение
            </v-btn>
          </v-card-actions>
          <v-card
            v-if="extraGraph && extraGraph.vertexList.length !== 0"
            class="mt-4"
          >
            <v-card-text>
              <v-network-graph
                :style="{
                  width: '100%',
                  height: '500px',
                  border: '1px solid #000',
                }"
                :nodes="graphData.nodes"
                :edges="graphData.edges"
                :layouts="graphData.layouts"
                :configs="graphConfigs"
              >
                <template #override-node="{ nodeId, ...props }">
                  <circle
                    :r="20"
                    :fill="getColorCode(props.config.color)"
                    stroke="#000"
                    stroke-width="1"
                  />
                  <text
                    v-if="graphData.nodes[nodeId].weight !== undefined"
                    font-size="12"
                    text-anchor="middle"
                    fill="#000000"
                    style="margin-top: 30px"
                    y="45"
                  >
                    Вес: {{ graphData.nodes[nodeId].weight }}
                  </text>
                  <text
                    font-size="12"
                    text-anchor="middle"
                    fill="#000000"
                    y="30"
                  >
                    {{ graphData.nodes[nodeId].label }}
                  </text>
                  <text
                    font-size="12"
                    text-anchor="middle"
                    fill="#000000"
                    y="60"
                  >
                    Координаты: ({{ graphData.nodes[nodeId].xCoordinate }},
                    {{ graphData.nodes[nodeId].yCoordinate }})
                  </text>
                </template>
                <template #edge-label="{ edgeId, ...slotProps }">
                  <v-edge-label
                    :text="`${graphData.edges[edgeId].weight}`"
                    align="center"
                    vertical-align="below"
                    v-bind="slotProps"
                  />
                  <v-edge-label
                    :text="`${graphData.edges[edgeId].label}`"
                    align="center"
                    vertical-align="above"
                    v-bind="slotProps"
                  />
                </template>
              </v-network-graph>
            </v-card-text>
          </v-card>
        </v-card>
        <v-alert
          v-model="successAlert"
          text="Задача решена верно"
          title="Успех!"
          type="success"
          closable
          variant="tonal"
        ></v-alert>
        <v-alert
          v-model="errorAlert"
          text="В решении есть ошибка"
          title="Ошибка!"
          type="error"
          closable
          variant="tonal"
        ></v-alert>
        <v-card v-if="errorAlert">
          <v-card-title>Ошибки в модулях</v-card-title>
          <v-card-text>
            <v-list lines="one">
              <v-list-item
                v-for="(item, i) in result"
                :key="i"
                :title="i + 1 + '. ' + item.mistakeText + ' = ' + item.value"
              ></v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
        <v-card>
            <v-card-text class="text-center">
            <!-- Загрузка -->
            <div v-if="statisticLoading" class="d-flex align-center justify-center">
                <v-progress-circular indeterminate size="20" width="2" class="mr-2" />
                <span class="text-caption">Загрузка...</span>
            </div>
            
            <!-- Данные -->
            <div v-else-if="statistic">
                <div class="text-h5 font-weight-bold primary--text mb-1">
                {{ formatPercentage(statistic.value) }}
                </div>
                <div class="text-body-2">
                успешно решили задачу
                </div>
            </div>
            
            <!-- Если данных нет -->
            <div v-else class="text-body-2">
                Ошибка загрузки сервиса статистики
            </div>
            </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { SOLVE_TASK_GRAPH } from "@/api/Mutations";
import { GET_GRAPH_BY_ID, GET_TASK, GET_STATISTIC } from "@/api/Queries";
import { StatisticRequestInput, StatisticResponse } from "@/api/Statistic";
import { useTaskStore } from "@/store/task";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { PluginResult, Graph as GraphType } from "@/__generated__/graphql";
import Graph from "@/features/graph/ui/graph/Graph.vue";
import { useNodeStore } from "@/features/graph/stores/nodes";
import { convertToGqlFormat } from "@/features/graph/lib/helpers/GqlFormatter";
import * as vNG from "v-network-graph";
import {
  directGraphConfigs,
  undirectGraphConfigs,
} from "@/components/graph/network/helper/graphConfig";
import { eventsApi } from "@/api/rest";

const props = defineProps({
  id: String,
  onCorrectSolution: {
    type: Function,
    default: null,
  },
});

const emit = defineEmits(["isCorrect"]);

const taskStore = useTaskStore();
const nodeStore = useNodeStore();
const { activeTask } = storeToRefs(taskStore);

const successAlert = ref(false);
const errorAlert = ref(false);
const result = ref<PluginResult[]>([]);
const extraGraph = ref<null | GraphType>(null);

// Для событий
const isTaskOpened = ref(false);

// Загрузка задачи
const { onResult: onTaskResult } = useQuery(GET_TASK, { id: props.id });
onTaskResult((response) => {
  if (response.data) {
    activeTask.value = response.data.getTask;
  }
});

// Загрузка графика
const { onResult: onGraphResult } = useQuery(
  GET_GRAPH_BY_ID,
  () => ({
    id: activeTask.value?.graph?.id || "",
  }),
  () => ({
    enabled: !!activeTask.value?.graph?.id,
    fetchPolicy: "cache-first",
  })
);

onGraphResult((response) => {
  if (response.data?.getGraphById) {
    extraGraph.value = response.data.getGraphById;
  }
});

// статистика
const statistic = ref<StatisticResponse | null>(null);
const statisticLoading = ref(false);
//

// cтатистика
const loadStatisticForTask = (taskId: string) => {
  if (!taskId) return;
  
  statisticLoading.value = true;
  
  const request: StatisticRequestInput = {
    type: 'SUCCESS_RATE',
    scope: 'TASK',
    event_type: 'task_success,task_wrong',
    task_id: taskId
  };
  
  const { onResult } = useQuery(
    GET_STATISTIC,
    { request },
    { fetchPolicy: 'cache-first' }
  );
  
  onResult((result) => {
    if (result.data?.getStatistic) {
      statistic.value = result.data.getStatistic;
    }
    console.log(statistic);
    statisticLoading.value = false;
  });
};

const formatPercentage = (value: number) => {
  return `${(value || 0).toFixed(1)}%`;
};
// статистика

// Отслеживаем изменения активной задачи
watch(
  () => activeTask.value,
  (newValue) => {
    if (!newValue?.graph?.id) return;

    const { onResult: onGraphResult } = useQuery(GET_GRAPH_BY_ID, {
      id: newValue.graph.id,
    });

    onGraphResult((response) => {
      extraGraph.value = response.data.getGraphById;
    });
    
    if (newValue?.id) {
      console.log("Загружаем статистику")
      loadStatisticForTask(newValue.id);
      
    }
  },
  { immediate: true },
);

// === ФУНКЦИИ ДЛЯ ОТПРАВКИ СОБЫТИЙ ===

/**
 * Универсальная функция отправки события
 */
const sendEvent = async (eventType: string, eventValue: string): Promise<boolean> => {
  try {
    console.group(`Отправка события: ${eventType}`);
    
    if (!activeTask.value?.id) {
      console.warn("ID задачи не найден");
      console.groupEnd();
      return false;
    }

    const currentToken = eventsApi.getCurrentToken?.();
    if (!currentToken) {
      console.warn("Токен не установлен");
    }

    const eventData = {
      taskId: activeTask.value.id,
      eventType: eventType,
      eventEntityId: 0,
      eventValue: eventValue
    };

    console.log("Данные события:", eventData);
    
    const result = await eventsApi.createEvent(eventData);
    
    if (typeof result === 'object' && 'detail' in result) {
      console.error(`Ошибка API: ${result.detail}`);
      console.groupEnd();
      return false;
    } else {
      console.log(`Событие отправлено`);
      console.groupEnd();
      return true;
    }
  } catch (error) {
    console.error(`Ошибка при отправке события ${eventType}:`, error);
    console.groupEnd();
    return false;
  }
};

/**
 * Отправка события открытия задачи
 */
const sendOpenTaskEvent = async (): Promise<void> => {
  if (!isTaskOpened.value && activeTask.value?.id && activeTask.value?.name) {
    const success = await sendEvent(
      "open_task",
      `Открыта задача: ${activeTask.value.name}`
    );
    if (success) {
      isTaskOpened.value = true;
    }
  }
};

/**
 * Отправка события отправки решения
 */
const sendSubmitEvent = async (): Promise<void> => {
  if (activeTask.value?.name) {
    await sendEvent(
      "submit",
      `Отправлено решение для задачи: ${activeTask.value.name}`
    );
  }
};

/**
 * Отправка события успешного решения
 */
const sendTaskSuccessEvent = async (): Promise<void> => {
  if (activeTask.value?.name) {
    await sendEvent(
      "task_success",
      `Задача успешно решена: ${activeTask.value.name}`
    );
  }
};

/**
 * Отправка события ошибочного решения
 */
const sendTaskWrongEvent = async (): Promise<void> => {
  if (activeTask.value?.name) {
    await sendEvent(
      "task_wrong",
      `Задача решена с ошибками: ${activeTask.value.name}`
    );
  }
};

// Отправляем событие открытия задачи
watch(
  () => activeTask.value,
  (newTask) => {
    if (newTask?.id && newTask?.name && !isTaskOpened.value) {
      setTimeout(() => {
        sendOpenTaskEvent();
      }, 500);
    }
  },
  { immediate: true }
);

// === КОНЕЦ ФУНКЦИЙ ДЛЯ СОБЫТИЙ ===

const getColorCode = (color: string) => {
  switch (color) {
    case "RED":
      return "#ff0000";
    case "GREEN":
      return "#00ff00";
    case "BLUE":
      return "#0000ff";
    case "GRAY":
    default:
      return "#808080";
  }
};

const graphData = computed(() => {
  if (!extraGraph.value) {
    return { nodes: {}, edges: {}, layouts: { nodes: {} } };
  }

  const nodes: vNG.Nodes = {};
  const layouts: vNG.Layouts = { nodes: {} };

  extraGraph.value.vertexList.forEach((vertex) => {
    if (!vertex) return;
    nodes[vertex.id] = {
      label: String(vertex.label),
      weight: vertex.weight,
      color: vertex.color,
      xCoordinate: vertex.xCoordinate,
      yCoordinate: vertex.yCoordinate,
    };
    layouts.nodes[vertex.id] = {
      x: vertex.xCoordinate,
      y: vertex.yCoordinate,
    };
  });

  const edges: vNG.Edges = {};
  extraGraph.value.edgeList.forEach((edge, index) => {
    if (!edge) return;
    edges[`edge${index}`] = {
      source: String(edge.source),
      target: String(edge.target),
      label: edge.label,
      weight: edge.weight,
      color: edge.color,
    };
  });

  return { nodes, edges, layouts };
});

const graphConfigs = computed(() => {
  const config = extraGraph.value?.isDirect
    ? directGraphConfigs
    : undirectGraphConfigs;

  return {
    ...config,
    node: {
      ...config.node,
      color: (node: any) => {
        const vertex = extraGraph.value?.vertexList.find(
          (v) => v?.id === node.id,
        );
        return getColorCode(vertex?.color || "GRAY");
      },
      label: {
        ...config.node?.label,
        color: "#000000",
      },
    },
    edge: {
      ...config.edge,
      color: (edge: any) => {
        const edgeData = extraGraph.value?.edgeList.find(
          (e) => e?.source === edge.source && e?.target === edge.target,
        );
        return getColorCode(edgeData?.color || "GRAY");
      },
    },
  };
});

const { mutate: solveTaskMutation } = useMutation(SOLVE_TASK_GRAPH);

const formatDescription = (description: string) => {
  if (!description) return "";

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return description.replace(urlRegex, (url) => {
    const escapedUrl = url
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

    return `<a href="${escapedUrl}" target="_blank" rel="noopener noreferrer">${escapedUrl}</a>`;
  });
};

const solveTask = async () => {
  if (!activeTask.value?.id || !activeTask.value?.name) {
    console.error("Данные задачи не загружены");
    return;
  }

  // Отправляем событие submit
  await sendSubmitEvent();

  const graph = convertToGqlFormat(nodeStore);
  graph.id = self.crypto.randomUUID();

  const request = {
    solution: {
      id: self.crypto.randomUUID(),
      taskId: activeTask.value.id,
      authorId: "00000000-0000-0000-0000-000000000000",
      graph: graph,
    },
  };

  try {
    const response = await solveTaskMutation(request);

    if (!response?.data) {
      console.error("No data received");
      return;
    }

    const { isCorrect, pluginResults } = response.data.solveTaskGraph;

    if (isCorrect) {
      await sendTaskSuccessEvent();
      successAlert.value = true;
      errorAlert.value = false;
      emit("isCorrect", true);
      props.onCorrectSolution?.();
    } else {
      await sendTaskWrongEvent();
      errorAlert.value = true;
      successAlert.value = false;

      const incorrectResults = pluginResults.filter(
        (item: PluginResult) => !item.isCorrect,
      );

      result.value = activeTask.value.isHiddenMistake
        ? [incorrectResults[0]]
        : incorrectResults;

      result.value = result.value.map((item) => ({
        ...item,
        mistakeText:
          activeTask.value.condition.find(
            (element: any) => element.pluginId === item.pluginId,
          )?.mistakeText || "",
      }));
    }
  } catch (error) {
    console.error("Error solving task:", error);
    errorAlert.value = true;
    successAlert.value = false;
  }
};

// Функция для отладки
declare global {
  interface Window {
    checkEventsStatus?: () => void;
  }
}

onMounted(() => {
  window.checkEventsStatus = () => {
    console.group('📊 Статус Events API');
    const token = eventsApi.getCurrentToken?.();
    console.log('Токен установлен:', token ? '✅ Да' : '❌ Нет');
    if (token) {
      console.log('Длина токена:', token.length);
      console.log('Первые 30 символов:', token.substring(0, 30) + '...');
    }
    const state = eventsApi.getState?.();
    console.log('Состояние:', state);
    console.groupEnd();
  };
});
</script>

<style scoped>
.text-pre-wrap {
  white-space: pre-wrap;
}
</style>