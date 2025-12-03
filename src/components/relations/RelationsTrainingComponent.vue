<template>
  <RelationsComponent
      :description-name="trainingDescription.name"
      :description-text="trainingDescription.text"
      :isCompleted="isCompleted"
  >
    <div class="training-component">
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
                @completed="handleTrainingCompleted"
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
import { useRelationsGraphStore } from '@/store/relations'
import {onMounted, ref, watch} from "vue";
import { useNotifications } from "./ui/utils/useNotification"
import { GraphInstance } from "@/components/relations/ui/types/types";
import RelationsComponent from "@/components/relations/RelationsComponent.vue";
import { trainingDescription } from "@/components/relations/ui/types/descriptions";


const graphs = ref<GraphInstance[]>([]);
const graphStore = useRelationsGraphStore();


const {
  showCompletionMessage
} = useNotifications();


const isCompleted = ref(false);


const updateGraphs = () => {
  if (graphStore.created){
    isCompleted.value = graphStore.lastGraph.isEquals(graphStore.lastAnswerGraph) && graphStore.graphCount > 1;
  }
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
      mode = 'training';
      isLocked = isCompleted.value;
    }

    graphs.value.push({
      currentGraph: graphStore.getGraphById(i),
      answerGraph: graphStore.getAnswerGraphById(i),
      mode: mode,
      isLocked: isLocked,
      text: `Степень: ${graphStore.getCurrentPower - (graphStore.graphCount - i - 1)}`
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
  updateGraphs();
});


const handleTrainingCompleted = () => {
  showCompletionMessage();
  graphs.value[1].isLocked = true;
  isCompleted.value = true;
};
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