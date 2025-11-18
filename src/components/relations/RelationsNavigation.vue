<template>
  <nav class="relations-navigation">
    <router-link
        to="/relations/demonstration"
        class="nav-button"
        :class="{ active: $route.path.includes('demonstration') }"
    >
      Демонстрация
    </router-link>
    <router-link
        to="/relations/training"
        class="nav-button"
        :class="{ active: $route.path.includes('training') }"
    >
      Тренировка
    </router-link>
    <router-link
        to="/relations/check"
        class="nav-button"
        :class="{ active: $route.path.includes('check') }"
    >
      Проверка
    </router-link>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.relations-navigation {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}

.nav-button {
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  background: white;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: #f5f5f5;
}

.nav-button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}
</style>