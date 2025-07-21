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
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { SOLVE_TASK_GRAPH } from "@/api/Mutations";
import { GET_GRAPH_BY_ID, GET_TASK } from "@/api/Queries";
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

const { onResult: onTaskResult } = useQuery(GET_TASK, { id: props.id });
onTaskResult((response) => {
  if (response.data) {
    activeTask.value = response.data.getTask;
  }
});

watch(
  activeTask,
  (newValue) => {
    if (!newValue.graph?.id) return;

    const { onResult: onGraphResult } = useQuery(GET_GRAPH_BY_ID, {
      id: newValue.graph.id,
    });

    onGraphResult((response) => {
      extraGraph.value = response.data.getGraphById;
    });
  },
  { immediate: true },
);

const getColorCode = (color: string) => {
  console.log(color);
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
      xCoordinate: vertex.xCoordinate, // Add xCoordinate
      yCoordinate: vertex.yCoordinate, // Add yCoordinate
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
      successAlert.value = true;
      errorAlert.value = false;
      emit("isCorrect", true);
      props.onCorrectSolution?.();
    } else {
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
</script>

<style scoped>
.text-pre-wrap {
  white-space: pre-wrap;
}
</style>
