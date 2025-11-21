<template>
  <RelationsComponent
      :description-name="checkDescription.name"
      :description-text="checkDescription.text"
      :isCompleted="isCompleted"
      :isChecking="isChecking"
      @click-check="clickCheckButton"
  >
    <div class="check-component">
      <div class="content">
        <div class="graphs-grid">
          <div
              v-for="(graph, index) in graphs"
              :key="index"
              class="graph-item"
          >
            <RelationsGraphRenderer
                :graph="graph.currentGraph"
                :answer-graph="graph.answerGraph"
                :mode="graph.mode"
                :is-locked="graph.isLocked"
            >
              <template #text-content>
                <h3>{{ graph.text }}</h3>
              </template>
            </RelationsGraphRenderer>
          </div>
         </div>
      </div>
    </div>
  </RelationsComponent>
</template>

<script setup lang="ts">
import { useRelationsGraphStore, useSelectMultiplyStore } from '@/store/relations'
import {computed, onMounted, ref, watch} from "vue";
import {useNotifications} from "@/components/relations/ui/utils/useNotification";
import {GraphInstance} from "@/components/relations/ui/types/types";
import RelationsComponent from "@/components/relations/RelationsComponent.vue";
import { checkDescription } from "@/components/relations/ui/types/descriptions";

const graphs = ref<GraphInstance[]>([]);

const {
  showCompletionMessage,
  showFailMessage
} = useNotifications();

const graphStore = useRelationsGraphStore();
const multiplyStore = useSelectMultiplyStore();

const isCompleted = ref(false);

let isFinished = false;

const isChecking = computed(() => {
  return graphStore.countGraphs > 1 && !isCompleted.value && !isFinished;
});

const updateGraphs = () => {
  graphs.value = [];
  if (graphStore.created){
    graphs.value.push({
      currentGraph: graphStore.firstGraph,
      answerGraph: graphStore.firstGraph,
      mode: 'default',
      isLocked: true,
      text: 'Начальный граф'
    });
  }

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
      text: `Степень: ${graphStore.getCurrentPower - (graphStore.graphCount - i - 1)}`
    });
  }
  isFinished = false;
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

const clickCheckButton = () => {
  if (graphStore.lastGraph.isEquals(graphStore.lastAnswerGraph)){
    showCompletionMessage();
    graphs.value[graphs.value.length - 1].isLocked = true;
    if (graphStore.getCurrentPower < 5){
      isCompleted.value = true;
    } else{
      isFinished = true;
    }
    graphs.value[graphs.value.length - 1].isLocked = true;
  } else {
    showFailMessage();
  }
}

onMounted(() => {
  isCompleted.value = false;
  const isCreated = graphStore.created;
  if (isCreated) {
    const tempGraph = graphStore.firstGraph;
    graphStore.createGraph(tempGraph.Size, tempGraph.EdgeNumber, tempGraph.GenType);
    graphStore.addGraph(multiplyStore.multiplyType, multiplyStore.multiplyPower);
  }
  updateGraphs();
});
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.graphs-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
}

.graph-item {
  display: flex;
  flex-direction: column;
}
</style>