<template>
  <div class="check-component">
    <h1>Режим проверки</h1>

    <div class="content">
      <button class="next-button button" @click="clickNextButton" v-if="isCompleted">Следующая степень</button>
      <button class="check-button button" @click="clickCheckButton" v-if="isChecking">Проверить</button>
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
import { useRelationsGraphStore, useSelectMultiplyStore } from '@/store/relations'
import {RelationsGraph} from "@/components/relations/types/RelationsGraph";
import {onMounted, ref, watch} from "vue";
import {useNotifications} from "@/components/relations/ui/utils/useNotification";

interface GraphInstance {
  currentGraph: RelationsGraph;
  answerGraph: RelationsGraph;
  mode: 'default' | 'check';
  isLocked: boolean;
  power: number;
}

const graphs = ref<GraphInstance[]>([]);

const {
  showCompletionMessage,
  showFailMessage,
  showErrorSelectMessage,
  showNotification
} = useNotifications();



const graphStore = useRelationsGraphStore();
const multiplyStore = useSelectMultiplyStore();

const isCompleted = ref(false);
const isChecking = ref(false);

const updateGraphs = () => {
  graphs.value = [];
  for (let i = graphStore.graphCount - 1; i >= 1; i--)  {

    let mode = 'default';
    let isLocked = true;
    if (!graphStore.getStateById(i)) {
      mode = 'check';
      isLocked = false;
    }

    graphs.value.push({
      currentGraph: graphStore.getGraphById(i),
      answerGraph: graphStore.getAnswerGraphById(i),
      mode: mode,
      isLocked: isLocked,
      power: graphStore.getCurrentPower - (graphStore.graphCount - i - 1)
    });
  }
  isChecking.value = graphs.value.length > 0;
};

watch(
    [
      () => graphStore.graphs,
      () => graphStore.countGraphs,
    ],
    () => {
      isCompleted.value = false;
      updateGraphs();
    },
    { immediate: true }
);

onMounted(() => {
  isCompleted.value = false;
  isChecking.value = false;
  const isCreated = graphStore.created;
  if (isCreated) {
    const tempGraph = graphStore.firstGraph;
    graphStore.createGraph(tempGraph.Size, tempGraph.EdgeNumber, tempGraph.GenType);
    graphStore.addGraph(multiplyStore.multiplyType, multiplyStore.multiplyPower);
    isChecking.value = true;
  }
  updateGraphs();
});

const clickNextButton = () => {
  graphStore.addGraph();
  isCompleted.value = false;
}

const clickCheckButton = () => {
  if (graphStore.lastGraph.isEquals(graphStore.lastAnswerGraph)){
    showCompletionMessage();
    isCompleted.value = true;
    isChecking.value = false;
    graphs.value[graphs.value.length - 1].isLocked = true;
  } else {
    showFailMessage();
  }
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