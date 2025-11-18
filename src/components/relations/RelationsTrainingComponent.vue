<template>
  <div class="training-component">
    <h1>Режим тренажера</h1>

    <div class="content">
      <button class="next-button button" @click="clickNextButton" v-if="isCompleted">Следующая степень</button>
      <div
          v-for="(graph, index) in graphs"
          :key="index"
          class="graph-container"
      >
        <RelationsGraphRenderer
            :graph="graph.currentGraph"
            :answer-graph="graph.answerGraph"
            :mode="graph.mode"
            :is-locked="graph.isLocked"
            @completed="handleTrainingCompleted"
        >
          <template #text-content>
            <h3>Степень {{ graph.power }}</h3>
          </template>
        </RelationsGraphRenderer>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRelationsGraphStore } from '@/store/relations'
import {RelationsGraph} from "@/components/relations/types/RelationsGraph";
import {onMounted, ref, watch} from "vue";
import { useNotifications } from "./ui/utils/useNotification"

interface GraphInstance {
  currentGraph: RelationsGraph;
  answerGraph: RelationsGraph;
  mode: 'default' | 'training';
  isLocked: boolean;
  power: number;
}

const graphs = ref<GraphInstance[]>([]);

const graphStore = useRelationsGraphStore();

const {
  showCompletionMessage,
  showFailMessage,
  showErrorSelectMessage,
  showNotification
} = useNotifications();

const isCompleted = ref(false);

const updateGraphs = () => {
  graphs.value = [];
  for (let i = graphStore.graphCount - 1; i >= 1; i--)  {

    let mode = 'default';
    let isLocked = true;
    if (!graphStore.getStateById(i)) {
      mode = 'training';
      isLocked = isCompleted.value;
    }

    graphs.value.push({
      currentGraph: graphStore.getGraphById(i),
      answerGraph: graphStore.getAnswerGraphById(i),
      mode: mode,
      isLocked: isLocked,
      power: graphStore.getCurrentPower - (graphStore.graphCount - i - 1)
    });

  }
};

watch(
    [
      () => graphStore.graphs,
      () => graphStore.countGraphs,
    ],
    () => {
      updateGraphs();
    },
    { immediate: true }
);

onMounted(() => {
  if (graphStore.created){
    isCompleted.value = graphStore.lastGraph.isEquals(graphStore.lastAnswerGraph);
  }
  updateGraphs();
});

const handleTrainingCompleted = () => {
  showCompletionMessage();
  if (graphStore.getCurrentPower < 5) {
    isCompleted.value = true;
  }
};

const clickNextButton = () => {
  graphStore.addGraph();
  isCompleted.value = false;
}


</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.graph-container {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 15px;
  background: #f9f9f9;
}

.button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: #007bff;
  border-radius: 4px;
  text-decoration: none;
  color: #ffffff;
  transition: all 0.3s ease;
}

.button:hover {
  background: #0074e8;
}
</style>