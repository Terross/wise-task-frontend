<template>
  <div class="graph-renderer">
    <div class="content-wrapper">
      <div class="content-text-container wrapper-item-1">
        <slot name="text-content"></slot>
      </div>
      <GraphMatrix
          class="matrix-container wrapper-item-2"
          :graph="graph"
          :answer-graph="answerGraph"
          :mode="mode"
          :is-locked="isMatrixLocked"
          :demonstration-step="demonstrationStep"
          :total-steps="totalSteps"
          @cell-change="onCellChange"
          @cell-hover="onCellHover"
          @cell-leave="onCellLeave"
          @demonstration-cell-revealed="onDemonstrationCellRevealed"
      />
      <GraphVisualization
          class="graph-container wrapper-item-3"
          :key="graphVersion"
          :graph="graph"
          :answer-graph="answerGraph"
          :highlight-edge="highlightedEdge"
          :mode="mode"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import { RelationsGraph } from '../types/RelationsGraph';
import GraphMatrix from './RelationsGraphMatrix.vue';
import GraphVisualization from './RelationsGraphVisualization.vue';

const graphVersion = ref(0);
const isCompleted = ref(false);

const isMatrixLocked = computed(() =>
    props.isLocked || isCompleted.value
);

interface Props {
  graph: RelationsGraph;
  answerGraph?: RelationsGraph;
  mode: 'default' | 'training' | 'check' | 'demonstration';
  isLocked?: boolean;
  demonstrationStep?: number;
  totalSteps?: number;
}

const props = withDefaults(defineProps<Props>(), {
  isLocked: false,
  demonstrationStep: 0,
  totalSteps: 0
});

const emit = defineEmits<{
  completed: [];
  cellChanged: [row: number, col: number, value: number];
  demonstrationStepChanged: [step: number];
}>();

const highlightedEdge = ref<{ from: number; to: number } | null>(null);

const onCellChange = (row: number, col: number, value: number) => {
  props.graph.changeEdge(row, col, value);
  graphVersion.value++;
  emit('cellChanged', row, col, value);

  if (props.mode === 'training' && props.answerGraph) {
    const isComplete = props.graph.isEquals(props.answerGraph);
    if (isComplete){
      isCompleted.value = true;
      emit('completed');
    }
  }
};

const onCellHover = (row: number, col: number) => {
  highlightedEdge.value = { from: row, to: col };
};

const onCellLeave = () => {
  highlightedEdge.value = null;
};

const onDemonstrationCellRevealed = (row: number, col: number, value: number) => {
  if (props.mode === 'demonstration') {
    props.graph.changeEdge(row, col, value);
    graphVersion.value++;
  }
};

</script>

<style scoped>
.graph-renderer {
  width: 100%;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 20px;
  padding: 20px;
}

.wrapper-item-1 {
  grid-column: 1 / -1;
}

.wrapper-item-2 {
  grid-column: 1;
}

.wrapper-item-3 {
  grid-column: 2;
}

.matrix-container {
  max-height: 400px;
  overflow: auto;
}

.graph-container {
  min-height: 370px;
}
</style>