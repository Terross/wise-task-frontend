<template>
  <div class="relations-container">
    <RelationsNavigation />

    <div class="controls-section">
      <div class="description-section control-item">
        <div class="description-header">
          <h3> {{ relationsDescription.name }}</h3>
          <p> {{ relationsDescription.text }} </p>
        </div>
      </div>
      <div class="control-group control-item">
        <RelationsGraphSelect ref="selectManager" />
        <button class="create-button button" @click="handleSubmit">Создать граф</button>
      </div>

      <div class="control-group control-item">
        <RelationsMultiplySelect ref="multiplyManager" />
        <button class="multiply-button button" @click="multiplySumbit">Применить</button>
      </div>

      <div class="description-control-section control-item">
        <div class="description-control-content">
          <div class="description-header">
            <h3>{{ descriptionName }}</h3>
            <p>{{ descriptionText }}</p>
          </div>

          <RelationsSpeedControl
              ref="speedControlRef"
              :is-start="isStartDemonstration"
              :total-steps="totalSteps"
              @step-change="stepChange"
          />

          <button
              class="check-button button"
              @click="clickCheckButton"
              v-if="isChecking"
          >
            Проверить
          </button>

          <button
              class="next-button button"
              :class="{ 'active': isCompleted }"
              :disabled="!isCompleted"
              @click="clickNextButton"
          >
            Следующая степень
          </button>
        </div>
      </div>
    </div>

    <div class="page-content">
      <slot
          @step-change="stepChange"
          @click-check="clickCheckButton"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRelationsGraphStore, useSelectGraphStore } from '@/store/relations'
import { computed, ref } from "vue";
import RelationsGraphSelect from "@/components/relations/ui/RelationsGraphSelect.vue";
import RelationsMultiplySelect from "@/components/relations/ui/RelationsMultiplySelect.vue";
import {useNotifications} from "@/components/relations/ui/utils/useNotification";
import RelationsSpeedControl from "@/components/relations/ui/RelationsSpeedControl.vue";
import { relationsDescription } from "@/components/relations/ui/types/descriptions";

const {
  showErrorSelectMessage
} = useNotifications();

const graphStore = useRelationsGraphStore();
const selectStore = useSelectGraphStore();


const selectManager = ref<InstanceType<typeof RelationsGraphSelect>>();
const multiplyManager = ref<InstanceType<typeof RelationsMultiplySelect>>();


const props = defineProps<{
  descriptionName: string;
  descriptionText: string;
  isCompleted: boolean;
  isChecking?: boolean;
  demonstrationData?: {
    isStartDemonstration: boolean;
    totalSteps: number;
  };
}>();


const descriptionName = ref(props.descriptionName);
const descriptionText = ref(props.descriptionText);
const isCompleted = computed(() => props.isCompleted && graphStore.getCurrentPower < 5);
const isChecking = computed(() => props.isChecking);

const handleSubmit = () => {
  if (!selectManager.value) return;

  const graphType = selectManager.value.getGraphType();
  const vertexCount = selectManager.value.getVertexCount();
  const edgeCount = selectManager.value.getEdgeCount();

  if (!graphType || vertexCount === -1 || edgeCount === -1) {
    showErrorSelectMessage();
    return;
  }

  selectStore.updateState(graphType, vertexCount, edgeCount);

  graphStore.clearGraphs()
  graphStore.createGraph(vertexCount, edgeCount, graphType);
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


const clickNextButton = () => {
  graphStore.addGraph();
}


const emit = defineEmits<{
  'step-change': [step: number];
  'click-check': [];
}>();


const clickCheckButton = () => {
  emit('click-check');
}


const speedControlRef = ref<InstanceType<typeof RelationsSpeedControl>>();
const isStartDemonstration = computed(() => props.demonstrationData?.isStartDemonstration || false);
const totalSteps = computed(() => props.demonstrationData?.totalSteps || 0);


const speedControlMethods = ref({
  startAutoPlay: () => speedControlRef.value?.startAutoPlay(),
  stopAutoPlay: () => speedControlRef.value?.stopAutoPlay(),
  togglePlayPause: () => speedControlRef.value?.togglePlayPause(),
  changeStep: (step: number) => speedControlRef.value?.changeStep(step)
});


const stepChange = (step: number) => {
  emit('step-change', step);
};


defineExpose({
  speedControl: speedControlMethods.value
});
</script>

<style scoped>
.relations-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.controls-section {
  padding-top: 2rem;
  display: flex;
  min-width: 0;
  max-width: 100%;
  gap: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
}

.control-item {
  flex: 1;
  padding: 2rem;
  border-radius: 50px;
  min-width: 0;
  max-width: 100%;
  border: 3px solid #d0dcf2;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: #E5ECF8FF;
  justify-content: space-between;
}

.description-control-section {
  flex: 1;
  padding: 2rem;
  border-radius: 50px;
  border: 3px solid #d0dcf2;
  display: flex;
  flex-direction: column;
}

.description-control-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1.5rem;
  justify-content: space-between;
}

.description-header {
  text-align: justify;
  text-justify: inter-word;
}

.description-header h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
}

.description-header p {
  margin: 0;
  color: #666;
  line-height: 1.4;
  font-size: 0.9rem;
  white-space: pre-wrap;
}

.page-content {
  flex: 1;
  padding: 2rem;
  overflow: auto;
}

.button {
  padding: 0.5rem 1rem;
  border: 3px solid #d0dcf2;
  background: #6b95c4;
  border-radius: 15px;
  text-decoration: none;
  color: #ffffff;
  transition: all 0.3s ease;
  width: 100%;
}

.button:hover {
  background: #0074e8;
}

.button.active {
  background: #007bff;
  border-color: #007bff;
}

.button:disabled {
  background: #cccccc;
  border-color: #999999;
  color: #666666;
  cursor: not-allowed;
  opacity: 0.6;
}
</style>