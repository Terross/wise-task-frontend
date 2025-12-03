<template>
  <RelationsComponent
      ref="relationsComponentRef"
      :description-name="demonstrationDescription.name"
      :description-text="demonstrationDescription.text"
      :isCompleted="isCompleted"
      :demonstration-data="{
        isStartDemonstration: isStartDemonstration,
        totalSteps: totalSteps
      }"
      @step-change="handleStepChange"
  >
    <div class="demonstration-component">
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
              :demonstration-step="currentStep"
              :total-steps="totalSteps"
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
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import { GraphInstance } from "@/components/relations/ui/types/types";
import RelationsComponent from "@/components/relations/RelationsComponent.vue";
import { demonstrationDescription } from "@/components/relations/ui/types/descriptions";


const relationsComponentRef = ref<InstanceType<typeof RelationsComponent>>();
const speedControl = computed(() => relationsComponentRef.value?.speedControl);


const graphs = ref<GraphInstance[]>([]);
const currentStep = ref(0);
const graphStore = useRelationsGraphStore();


const isCompleted = computed(() => {
  return graphStore.countGraphs > 1 && currentStep.value === totalSteps.value;
});


const isStartDemonstration = computed(() => {
  return graphStore.countGraphs > 1;
});


const totalSteps = computed(() => {
  if (graphs.value.length === 0) return 0;

  const firstGraph = graphs.value[0];
  if (!firstGraph.currentGraph) return 0;

  const matrixSize = firstGraph.currentGraph.Size;
  return matrixSize * matrixSize;
})


watch([isStartDemonstration, totalSteps], () => {});


const handleStepChange = (step: number) => {
  currentStep.value = step;
};


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
      mode = 'demonstration';
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
};


watch(
    [
      () => graphStore.graphs,
      () => graphStore.countGraphs,
    ],
    () => {
      speedControl.value?.changeStep(0);
      speedControl.value?.stopAutoPlay();
      updateGraphs();
    },
    { immediate: true }
);


onMounted(() => {
  updateGraphs();
  if (graphStore.created){
    const newStep = graphStore.lastGraph.isEquals(graphStore.lastAnswerGraph) ? totalSteps.value : 0;
    speedControl.value?.changeStep(newStep);
  }
});


onUnmounted(() => {
  speedControl.value?.stopAutoPlay();
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