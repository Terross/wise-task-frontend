<template>
  <div class="graph-selects">
    <div class="select-group">
      <label for="graph-type">Тип графа:</label>
      <select
          id="graph-type"
          v-model="selectedGraphType"
          class="select-item"
      >
        <option value="">Не выбрано</option>
        <option value="DEFAULT">Любой</option>
        <option value="SYMM">Симметричный</option>
        <option value="ASYMM">Асимметричный</option>
        <option value="ANTISYMM">Антисимметричный</option>
      </select>
    </div>

    <div class="select-group">
      <label for="vertex-count">Количество вершин:</label>
      <select
          id="vertex-count"
          v-model="selectedVertexCount"
          class="select-item"
      >
        <option value="-1">Не выбрано</option>
        <option
            v-for="n in vertexOptions"
            :key="n.value"
            :value="n.value"
        >
          {{ n.text }}
        </option>
      </select>
    </div>

    <div class="select-group">
      <label for="edge-count">Количество рёбер:</label>
      <select
          id="edge-count"
          v-model="selectedEdgeCount"
          :disabled="!isEdgeSelectEnabled"
          class="select-item"
      >
        <option
            v-for="option in computedEdgeOptions"
            :key="option.value"
            :value="option.value"
        >
          {{ option.text }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useGraphCalculations } from './utils/useGraphCalculations';
import type { GraphGenerationType } from '@/components/relations/types/RelationsGraph';
import {SelectOption} from "@/components/relations/ui/types/types";
import {useSelectGraphStore} from "@/store/relations";


const selectStore = useSelectGraphStore();


const selectedGraphType = ref<GraphGenerationType>(selectStore.graphGenType);
const selectedVertexCount = ref<string>(selectStore.countVertex);
const selectedEdgeCount = ref<string>(selectStore.countEdge);


const vertexOptions: SelectOption[] = [
  { value: '3', text: '3' },
  { value: '4', text: '4' },
  { value: '5', text: '5' },
  { value: '6', text: '6' },
  { value: '7', text: '7' },
  { value: '8', text: '8' },
  { value: '9', text: '9' },
];


const numericVertexCount = computed(() => {
  const value = parseInt(selectedVertexCount.value);
  return isNaN(value) || value < 0 ? -1 : value;
});


const { edgeOptions, minEdges, maxEdges } = useGraphCalculations(
    numericVertexCount,
    selectedGraphType
);


const isEdgeSelectEnabled = computed(() => {
  return numericVertexCount.value > 0 && selectedGraphType.value !== '';
});


const computedEdgeOptions = computed(() => {
  if (!isEdgeSelectEnabled.value) {
    return [{ value: '-1', text: 'Не выбрано' }];
  }
  return edgeOptions.value;
});


watch([selectedGraphType, selectedVertexCount], () => {
  updateEdgeCountSelection();
});


const updateEdgeCountSelection = () => {
  if (!isEdgeSelectEnabled.value) {
    selectedEdgeCount.value = '-1';
    return;
  }

  const currentValue = parseInt(selectedEdgeCount.value);
  const min = minEdges.value;
  const max = maxEdges.value;

  if (isNaN(currentValue) || currentValue < min || currentValue > max) {
    selectedEdgeCount.value = min.toString();
  }
};


const getGraphType = (): GraphGenerationType => selectedGraphType.value;


const getVertexCount = (): number => numericVertexCount.value;


const getEdgeCount = (): number => {
  const value = parseInt(selectedEdgeCount.value);
  const min = minEdges.value;
  const max = maxEdges.value;

  if (isNaN(value) || value < min || value > max) {
    return -1;
  }
  return value;
};


const getMinEdges = (): number => minEdges.value;
const getMaxEdges = (): number => maxEdges.value;

onMounted(() => {
  updateEdgeCountSelection();
});

defineExpose({
  getGraphType,
  getVertexCount,
  getEdgeCount,
  getMinEdges,
  getMaxEdges
});
</script>

<style scoped>
.graph-selects {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.select-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.select-group label {
  font-weight: 600;
  font-size: 1.1rem;
}

.select-item {
  padding: 0.5rem;
  border: 3px solid #d0dcf2;
  border-radius: 15px;
  background: white;
}
</style>