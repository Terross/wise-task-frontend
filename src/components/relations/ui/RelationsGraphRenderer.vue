<template>
  <div class="graph-renderer">
    <div class="content-wrapper">
      <div class="content-text-container">
        <slot name="text-content"></slot>
      </div>
      <div class="matrix-graph-container">
        <GraphMatrix
            class="matrix-container"
            :graph="graph"
            :answer-graph="answerGraph"
            :mode="mode"
            :is-locked="props.isLocked"
            :demonstration-step="demonstrationStep"
            :total-steps="totalSteps"
            @cell-change="onCellChange"
            @cell-hover="onCellHover"
            @cell-leave="onCellLeave"
            @demonstration-cell-revealed="onDemonstrationCellRevealed"
        />
        <GraphVisualization
            class="graph-container"
            :key="graphVersion"
            :graph="graph"
            :answer-graph="answerGraph"
            :highlight-edge="highlightedEdge"
            :mode="mode"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch} from 'vue';
import { RelationsGraph } from '../types/RelationsGraph';
import GraphMatrix from './RelationsGraphMatrix.vue';
import GraphVisualization from './RelationsGraphVisualization.vue';
import {RenderMode} from "@/components/relations/ui/types/types";


const graphVersion = ref(0);


interface Props {
  graph: RelationsGraph;
  answerGraph?: RelationsGraph;
  mode: RenderMode;
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
}>();


const highlightedEdge = ref<{ from: number; to: number } | null>(null);


const onCellChange = (row: number, col: number, value: number) => {
  props.graph.changeEdge(row, col, value);
  graphVersion.value++;
  if (props.mode === 'training' && props.answerGraph) {
    const isComplete = props.graph.isEquals(props.answerGraph);
    if (isComplete){
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
  min-width: 0;
  max-width: 100%;
  border: 3px solid #ccc;
  border-radius: 50px;
  padding: 15px;
  background: #f9f9f9;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.matrix-graph-container {
  display: flex;
  width: 100%;
  gap: 20px;
}

.matrix-container {
  flex: 60%;
  max-height: 430px;
  overflow: auto;
}

.graph-container {
  flex: 40%;
  min-height: 370px;
}
</style>