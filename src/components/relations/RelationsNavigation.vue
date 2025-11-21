<template>
  <nav class="relations-navigation">
    <div class="nav-container">
      <router-link
          to="/relations/demonstration"
          class="nav-button"
          :class="{ active: $route.path.includes('demonstration') }"
      >
        <span class="button-text">Демонстрация</span>
      </router-link>
      <router-link
          to="/relations/training"
          class="nav-button"
          :class="{ active: $route.path.includes('training') }"
      >
        <span class="button-text">Тренировка</span>
      </router-link>
      <router-link
          to="/relations/check"
          class="nav-button"
          :class="{ active: $route.path.includes('check') }"
      >
        <span class="button-text">Проверка</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.relations-navigation {
  display: flex;
  justify-content: center;
}

.nav-container {
  display: flex;
  gap: 2rem;
  justify-content: center;
  align-items: flex-end;
}

.nav-button {
  position: relative;
  padding: 1.2rem 2.5rem 0.8rem 2.5rem;
  background: transparent;
  border: none;
  text-decoration: none;
  color: #286bbf;;
  text-align: center;
  transition: all 0.3s ease;
  overflow: hidden;
  z-index: 1;
  flex: 1;
  min-width: 200px;
  max-width: 400px;
}

.nav-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 15%;
  right: 15%;
  bottom: 0;
  border-radius: 0 0 20px 20px;
  transform: perspective(100px) rotateX(-35deg);
  transform-origin: bottom;
  z-index: -1;
  transition: all 0.3s ease;
  border: 3px solid #286bbf;
}

.nav-button:hover::before {
  background: #5184bf;
  transform: perspective(100px) rotateX(-35deg) translateY(-2px);
}

.nav-button.active::before {
  background: #286bbf;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.button-text {
  font-weight: 600;
  font-size: 1.1rem;
  display: block;
  transform: translateY(-5px);
  transition: all 0.3s ease;
}

.nav-button:hover .button-text {
  color: white;
}

.nav-button.active .button-text {
  color: white;
  font-weight: 700;
}
</style>