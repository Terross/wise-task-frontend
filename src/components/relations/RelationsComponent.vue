<template>
  <div class="relations-container">
    <RelationsNavigation />

    <RelationsGraphSelect ref="selectManager" />

    <button class="create-button button" @click="handleSubmit">Создать граф</button>

    <RelationsMultiplySelect ref="multiplyManager" />

    <button class="multiply-button button" @click="multiplySumbit">Применить</button>

    <div class="global-value" v-if="isCreated">
      <RelationsGraphRenderer
          :graph="globalGraph"
          mode="default"
          :is-locked="true"
      >
        <template #text-content>
          <h3>Заполните матрицу достижимости</h3>
        </template>
      </RelationsGraphRenderer>
    </div>

    <div class="page-content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRelationsGraphStore, useSelectGraphStore } from '@/store/relations'
import {ref, watch} from "vue";
import {RelationsGraph} from "@/components/relations/types/RelationsGraph";
import RelationsGraphSelect from "@/components/relations/ui/RelationsGraphSelect.vue";
import RelationsMultiplySelect from "@/components/relations/ui/RelationsMultiplySelect.vue";
import {useNotifications} from "@/components/relations/ui/utils/useNotification";

const {
  showCompletionMessage,
  showFailMessage,
  showErrorSelectMessage,
  showNotification
} = useNotifications();

const graphStore = useRelationsGraphStore();
const selectStore = useSelectGraphStore();

const globalGraph = ref<RelationsGraph | null>(null);
const isCreated = ref<boolean>(graphStore.created);
if (isCreated) {
  globalGraph.value = graphStore.firstGraph;
}

watch(
    () => graphStore.firstGraph,
    () => {
      globalGraph.value = graphStore.firstGraph;
    }
)

const selectManager = ref<InstanceType<typeof RelationsGraphSelect>>();
const multiplyManager = ref<InstanceType<typeof RelationsMultiplySelect>>();

const handleSubmit = () => {
  if (!selectManager.value) return;

  const graphType = selectManager.value.getGraphType();
  const vertexCount = selectManager.value.getVertexCount();
  const edgeCount = selectManager.value.getEdgeCount();

  if (!graphType || vertexCount === -1 || edgeCount === -1) {
    showErrorSelectMessage();
    return;
  }

  selectStore.updateState(graphType, vertexCount, edgeCount);                   //вынести в select

  graphStore.clearGraphs()
  graphStore.createGraph(vertexCount, edgeCount, graphType);

  globalGraph.value = graphStore.firstGraph
  isCreated.value = true
};

const multiplySumbit = () => {
  if (!multiplyManager.value) return;

  if (!graphStore.created) {
    showErrorSelectMessage();
    return;
  }

  const multiplyType = multiplyManager.value.getMultiplyType();
  const multiplyPower = multiplyManager.value.getMultiplyPower();

  graphStore.clearWithoutFirst();
  graphStore.addGraph(multiplyType, multiplyPower);
};

</script>

<style scoped>
.relations-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.global-value {
  border-bottom: 1px solid #e0e0e0;
  padding: 1rem;
  background: #f8f9fa;
  min-height: 300px;
}

.page-content {
  flex: 1;
  padding: 1rem;
  overflow: auto;
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

.button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto; /* ✅ ДОБАВЬТЕ ЭТО - включает прокрутку */
  min-height: 0; /* ✅ ВАЖНО для flexbox чтобы overflow работал */
}
</style>