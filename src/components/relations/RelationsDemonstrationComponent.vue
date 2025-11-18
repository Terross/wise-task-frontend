<template>
  <div class="demonstration-component">
    <h1>Режим демонстрации</h1>

    <div class="content">
      <div class="control-panel">
        <button
            class="control-button button"
            @click="previousStep"
            :disabled="currentStep === 0"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </button>

        <button
            class="control-button button"
            @click="togglePlayPause"
            :class="{ 'pause': isPlaying }"
        >
          <v-icon>{{ isPlaying ? 'mdi-pause' : 'mdi-play' }}</v-icon>
        </button>

        <button
            class="control-button button"
            @click="nextStep"
            :disabled="currentStep >= totalSteps"
        >
          <v-icon>mdi-chevron-right</v-icon>
        </button>

        <div class="speed-control">
          <label>Скорость:</label>
          <input
              type="range"
              min="100"
              max="2000"
              step="100"
              v-model="speed"
              class="speed-slider"
          />
          <span class="speed-value">{{ 2100 - speed }} мс</span>
        </div>
      </div>

      <button class="next-button button" @click="clickNextButton" v-if="isCompleted">Следующая степень</button>

      <div class="progress-container">
        <div class="progress-bar">
          <div
              class="progress-fill"
              :style="{ width: progressPercentage + '%' }"
          ></div>
        </div>
        <span class="progress-text">
        Шаг {{ currentStep }} из {{ totalSteps }}
      </span>
      </div>
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
            :demonstration-step="currentStep"
            :total-steps="totalSteps"
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
import {computed, onMounted, onUnmounted, ref, watch} from "vue";

interface GraphInstance {
  currentGraph: RelationsGraph;
  answerGraph: RelationsGraph;
  mode: 'default' | 'demonstration';
  isLocked: boolean;
  power: number;
}

const graphs = ref<GraphInstance[]>([]);

const graphStore = useRelationsGraphStore();

const isCompleted = ref(false);

const currentStep = ref(0);
const totalSteps = ref(0);
const isPlaying = ref(false);
const speed = ref(500);
const playInterval = ref<NodeJS.Timeout | null>(null);

const calculateTotalSteps = () => {
  if (graphs.value.length === 0) return 0;

  const firstGraph = graphs.value[0];
  if (!firstGraph.currentGraph) return 0;

  const matrixSize = firstGraph.currentGraph.Size;
  return matrixSize * matrixSize;
};

const progressPercentage = computed(() => {
  if (totalSteps.value === 0) return 0;
  return (currentStep.value / totalSteps.value) * 100;
});


const startAutoPlay = () => {
  if (playInterval.value) {
    clearInterval(playInterval.value);
  }

  playInterval.value = setInterval(() => {
    if (currentStep.value < totalSteps.value) {
      currentStep.value++;
    } else {
      stopAutoPlay();
    }
  }, 2100 - speed.value);
};

const stopAutoPlay = () => {
  if (playInterval.value) {
    clearInterval(playInterval.value);
    playInterval.value = null;
  }
  isPlaying.value = false;
};

const togglePlayPause = () => {
  if (isPlaying.value) {
    stopAutoPlay();
  } else {
    isPlaying.value = true;
    startAutoPlay();
  }
};

const nextStep = () => {
  if (currentStep.value < totalSteps.value) {
    currentStep.value++;
  }
};

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const updateGraphs = () => {
  graphs.value = [];
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
      power: graphStore.getCurrentPower - (graphStore.graphCount - i - 1)
    });
  }
  totalSteps.value = calculateTotalSteps();
};


watch(speed, (newSpeed) => {
  if (isPlaying.value) {
    stopAutoPlay();
    startAutoPlay();
  }
});


watch(
    [
      () => graphStore.graphs,
      () => graphStore.countGraphs,
    ],
    () => {
      isCompleted.value = false;
      currentStep.value = 0;
      stopAutoPlay();
      updateGraphs();
    },
    { immediate: true }
);

watch(
    () => currentStep.value,
    () => {
      isCompleted.value = currentStep.value === totalSteps.value;
    },
    { immediate: true }
);

onMounted(() => {
  updateGraphs();
  if (graphStore.created){
    isCompleted.value = graphStore.lastGraph.isEquals(graphStore.lastAnswerGraph);
  }
  currentStep.value = isCompleted.value ? totalSteps.value : 0;
});

onUnmounted(() => {
  stopAutoPlay();
});

const clickNextButton = () => {
  graphStore.addGraph();
  isCompleted.value = false;
  currentStep.value = 0;
  stopAutoPlay();
  updateGraphs();
};
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



.control-panel {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f5f5f5;
  border-radius: 8px;
  flex-wrap: wrap;
}

.control-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: #007bff;
  border-radius: 4px;
  text-decoration: none;
  color: #ffffff;
  transition: all 0.3s ease;
  cursor: pointer;
}

.control-button:hover:not(:disabled) {
  background: #0074e8;
}

.control-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.control-button.pause {
  background: #dc3545;
}

.control-button.pause:hover {
  background: #c82333;
}



.speed-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.speed-slider {
  width: 150px;
}

.speed-value {
  font-size: 0.9rem;
  color: #666;
  min-width: 60px;
}

.progress-container {
  margin-bottom: 20px;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: #e9ecef;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transition: width 0.3s ease;
  border-radius: 10px;
}

.progress-text {
  display: block;
  text-align: center;
  margin-top: 5px;
  font-size: 0.9rem;
  color: #666;
}
</style>