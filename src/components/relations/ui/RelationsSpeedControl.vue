<template>
  <div class="speed-control-panel">
    <div class="control-panel" v-if="isStart">
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

    <div class="progress-container" v-if="isStart">
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
  </div>
</template>

<script setup lang="ts">
import {computed, ref, watch} from "vue";


const props = defineProps<{
  isStart: boolean;
  totalSteps: number;
}>();


const isStart = computed(() => props.isStart);
const currentStep = ref(0);
const totalSteps = computed(() => props.totalSteps);
const isPlaying = ref(false);
const speed = ref(500);
const playInterval = ref<NodeJS.Timeout | null>(null);


const emit = defineEmits<{
  'step-change': [step: number];
}>();


const progressPercentage = computed(() => {
  if (totalSteps.value === 0) return 0;
  return (currentStep.value / totalSteps.value) * 100;
});


const startAutoPlay = () => {
  if (playInterval.value) {
    clearInterval(playInterval.value);
  }
  isPlaying.value = true;
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

const changeStep = (value: number) => {
  if (value <= totalSteps.value) {
    currentStep.value = value;
  }
}


watch(currentStep, (newStep) => {
  emit('step-change', newStep);
});


watch(speed, (newSpeed) => {
  if (isPlaying.value) {
    stopAutoPlay();
    startAutoPlay();
  }
});


defineExpose({
  startAutoPlay,
  stopAutoPlay,
  togglePlayPause,
  changeStep
});
</script>

<style scoped>

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
  border-radius: 8px;
  flex-wrap: wrap;
  justify-content: center;
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