<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps<{
  position: { x: number; y: number };
}>();

const emit = defineEmits(["close", "addNode"]);

const menuRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    emit("close");
  }
};

const handleAction = (action: () => void) => {
  action();
  emit("close");
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("pointerdown", handleClickOutside);
  document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("pointerdown", handleClickOutside);
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<template>
  <div
    ref="menuRef"
    class="context-menu"
    :style="{
      left: `${props.position.x}px`,
      top: `${props.position.y}px`,
    }"
    @click.stop
  >
    <v-card>
      <v-card-title class="headline">Контекстное меню</v-card-title>
      <v-card-text>
        <v-btn block @click="handleAction(() => emit('addNode'))">
          Добавить вершину здесь
        </v-btn>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="emit('close')">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.context-menu {
  position: absolute;
  z-index: 10;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 200px;
}

.headline {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 16px;
}
</style>
