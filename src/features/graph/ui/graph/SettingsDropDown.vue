<script setup lang="ts">
import { ref } from "vue";
import { useGraphSettings } from "@/features/graph/stores/graphSettings";

const store = useGraphSettings();

const isOpen = ref(false);

const form = ref({
  edgeType: "Bezie",
  defaultNodeSize: 100,
  defaultNodeSpacingX: 100,
  defaultNodeSpacingY: 100,
  defaultCirclePadding: 10,
});

const config = {
  edgeType: {
    label: "Тип ребра",
    description: "Что за тип ребра?",
    options: ["Bezie", "Straight", "Step"],
  },
  defaultNodeSize: {
    label: "Размер вершины",
    description: "Какой размер должен быть у вершины?",
    min: 10,
    max: 500,
  },
  defaultNodeSpacingX: {
    label: "Отступ по X",
    description: "Какой отступ по оси X?",
    min: 10,
    max: 500,
  },
  defaultNodeSpacingY: {
    label: "Отступ по Y",
    description: "Какой отступ по оси Y?",
    min: 10,
    max: 500,
  },
  defaultCirclePadding: {
    label: "Padding круга",
    description: "Какой padding для круга?",
    min: 0,
    max: 100,
  },
};

const open = () => {
  form.value = {
    edgeType: store.edgeType,
    defaultNodeSize: store.defaultNodeSize,
    defaultNodeSpacingX: store.defaultNodeSpacingX,
    defaultNodeSpacingY: store.defaultNodeSpacingY,
    defaultCirclePadding: store.defaultCirclePadding,
  };
  isOpen.value = true;
};

const save = () => {
  store.edgeType = form.value.edgeType;
  store.defaultNodeSize = form.value.defaultNodeSize;
  store.defaultNodeSpacingX = form.value.defaultNodeSpacingX;
  store.defaultNodeSpacingY = form.value.defaultNodeSpacingY;
  store.defaultCirclePadding = form.value.defaultCirclePadding;
  isOpen.value = false;
};

const cancel = () => {
  isOpen.value = false;
};
</script>

<template>
  <div>
    <v-btn @click="open">Настройки графа</v-btn>

    <v-dialog v-model="isOpen" max-width="420px">
      <v-card class="settings-card">
        <v-card-title class="text-h6 settings-title">
          Настройки графа
        </v-card-title>

        <v-card-text>
          <div
            class="field-with-tooltip"
            v-for="(configItem, key) in config"
            :key="key"
          >
            <label class="field-label">
              {{ configItem.label }}
              <v-tooltip location="top">
                <template #activator="{ props }">
                  <v-icon
                    v-bind="props"
                    class="info-icon"
                    icon="mdi-help-circle-outline"
                  />
                </template>
                <span>{{ configItem.description }}</span>
              </v-tooltip>
            </label>

            <template v-if="key === 'edgeType'">
              <v-select
                v-model="form[key]"
                :items="(configItem as any).options"
                variant="underlined"
                color="primary"
              />
            </template>
            <template v-else>
              <v-text-field
                v-model.number="form[key]"
                :type="'number'"
                :min="(configItem as any).min"
                :max="(configItem as any).max"
                variant="underlined"
                color="primary"
              />
            </template>
          </div>
        </v-card-text>

        <v-card-actions class="settings-actions">
          <v-spacer />
          <v-btn variant="text" @click="cancel">Отмена</v-btn>
          <v-btn color="primary" variant="flat" @click="save">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.settings-card {
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  padding: 12px;
}

.settings-title {
  padding-bottom: 0;
  font-weight: bold;
  color: #1e3a8a;
}

.settings-actions {
  padding: 12px 16px;
}

.field-with-tooltip {
  margin-bottom: 16px;
}

.field-label {
  display: flex;
  align-items: center;
  font-weight: 500;
  margin-bottom: 4px;
}

.info-icon {
  margin-left: 6px;
  font-size: 18px;
  color: #3b82f6;
  cursor: pointer;
}
</style>
