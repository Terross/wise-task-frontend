<template>
  <Transition name="notification">
    <div
        v-if="visible"
        :class="['notification', typeClass]"
        @click="hide"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'


interface Props {
  type: 'success' | 'error' | 'warning'
  message: string
  duration?: number
}


const props = withDefaults(defineProps<Props>(), {
  duration: 3000
})


const visible = ref(false)


const typeClass = computed(() => `notification--${props.type}`)


const hide = () => {
  visible.value = false
}


onMounted(() => {
  visible.value = true
  const timer = setTimeout(hide, props.duration)
  return () => clearTimeout(timer)
})


defineExpose({
  hide
})
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  color: white;
  padding: 15px 30px;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  cursor: pointer;
  min-width: 300px;
  text-align: center;
}

.notification--success {
  background-color: #4CAF50;
}

.notification--error {
  background-color: #f17575;
}

.notification--warning {
  background-color: #ff9800;
}

.notification-enter-active {
  animation: fadeIn 0.5s;
}

.notification-leave-active {
  animation: fadeOut 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    top: 0;
  }
  to {
    opacity: 1;
    top: 20px;
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    top: 20px;
  }
  to {
    opacity: 0;
    top: 0;
  }
}
</style>