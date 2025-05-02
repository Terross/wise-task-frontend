<script setup lang="ts">
import { ref } from "vue";
import { graphSettingsStore as store } from "@/features/graph/stores/graphSettings";

const isOpen = ref(false);

const form = ref({
  edgeType: "Bezie",
  defaultNodeSize: 100,
  defaultNodeSpacingX: 100,
  defaultNodeSpacingY: 100,
  defaultCirclePadding: 10,
  patternType: "dots",
  patternGap: 20,
  patternSize: 1,
  patternColor: "#e5e7eb",
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
    min: 100,
    max: 1000,
    step: 10,
  },
  patternType: {
    label: "Тип фона",
    description: "Какой тип фона использовать?",
    options: ["dots", "lines"],
  },
  patternGap: {
    label: "Отступ фона",
    description: "Какой отступ между элементами фона?",
    min: 5,
    max: 100,
  },
  patternSize: {
    label: "Размер элементов фона",
    description: "Какой размер элементов фона?",
    min: 0.1,
    max: 10,
    step: 0.1,
  },
  patternColor: {
    label: "Цвет фона",
    description: "Какой цвет использовать для фона?",
  },
};

const open = () => {
  form.value = {
    edgeType: store.edgeType,
    defaultNodeSize: store.defaultNodeSize,
    defaultNodeSpacingX: store.defaultNodeSpacingX,
    defaultNodeSpacingY: store.defaultNodeSpacingY,
    defaultCirclePadding: store.defaultCirclePadding,
    patternType: store.patternType,
    patternGap: store.patternGap,
    patternSize: store.patternSize,
    patternColor: store.patternColor,
  };
  isOpen.value = true;
};

const save = () => {
  store.edgeType = form.value.edgeType as "Straight" | "Bezie" | "Step";
  store.defaultNodeSize = form.value.defaultNodeSize;
  store.defaultNodeSpacingX = form.value.defaultNodeSpacingX;
  store.defaultNodeSpacingY = form.value.defaultNodeSpacingY;
  store.defaultCirclePadding = form.value.defaultCirclePadding;
  store.patternType = form.value.patternType as "dots" | "lines";
  store.patternGap = form.value.patternGap;
  store.patternSize = form.value.patternSize;
  store.patternColor = form.value.patternColor;

  store.saveToLocalStorage();
  isOpen.value = false;
};

const resetToDefaults = () => {
  store.resetToDefaults();
  form.value = {
    edgeType: store.edgeType,
    defaultNodeSize: store.defaultNodeSize,
    defaultNodeSpacingX: store.defaultNodeSpacingX,
    defaultNodeSpacingY: store.defaultNodeSpacingY,
    defaultCirclePadding: store.defaultCirclePadding,
    patternType: store.patternType,
    patternGap: store.patternGap,
    patternSize: store.patternSize,
    patternColor: store.patternColor,
  };
};

const cancel = () => {
  isOpen.value = false;
};
</script>

<template>
  <div>
    <v-btn @click="open">Настройки графа</v-btn>

    <v-dialog v-model="isOpen" max-width="360px">
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

            <template v-if="key === 'edgeType' || key === 'patternType'">
              <v-select
                v-model="form[key]"
                :items="(configItem as any).options"
                variant="underlined"
                color="primary"
                density="compact"
              />
            </template>
            <template v-else-if="key === 'patternColor'">
              <div class="color-input-wrapper">
                <v-text-field
                  v-model="form[key]"
                  variant="underlined"
                  color="primary"
                  density="compact"
                  placeholder="#FFFFFF или rgb(255,255,255)"
                />
                <div
                  class="color-preview"
                  :style="{ backgroundColor: form[key] }"
                />
              </div>
            </template>
            <template v-else>
              <v-text-field
                v-model.number="form[key]"
                type="number"
                :min="(configItem as any).min"
                :max="(configItem as any).max"
                :step="(configItem as any).step || 1"
                variant="underlined"
                color="primary"
                density="compact"
              />
            </template>
          </div>
        </v-card-text>

        <v-card-actions class="settings-actions">
          <v-btn variant="text" @click="resetToDefaults">По умолчанию</v-btn>
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
  border-radius: 8px;
  padding: 12px;
}

.settings-title {
  padding-bottom: 0;
  font-weight: bold;
}

.field-with-tooltip {
  margin-bottom: 4px;
}

.field-label {
  display: flex;
  align-items: center;
  margin-bottom: 0;
}

.info-icon {
  margin-left: 6px;
  font-size: 18px;
  color: #3b82f6;
}

.color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #ddd;
  flex-shrink: 0;
}
</style>
