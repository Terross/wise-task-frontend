<script setup lang="ts">
import { ref } from "vue";
import { CustomNode } from "@/features/graph/types/CustomNode";

interface Props {
  nodes: CustomNode[];
}

const props = defineProps<Props>();

const expandedNodes = ref<Record<string, boolean>>({});
const isPanelExpanded = ref(false);

const toggleNode = (nodeId: string) => {
  expandedNodes.value = {
    ...expandedNodes.value,
    [nodeId]: !expandedNodes.value[nodeId],
  };
};

const togglePanel = () => {
  isPanelExpanded.value = !isPanelExpanded.value;
};
</script>

<template>
  <div class="nodes-panel">
    <div v-if="nodes.length > 0" class="nodes-container">
      <div class="panel-header" @click="togglePanel">
        <div class="header-content">
          <v-icon
            :icon="isPanelExpanded ? 'mdi-chevron-down' : 'mdi-chevron-right'"
            size="small"
            color="#0D47A1"
          />
          <h4>Выбранные вершины графа</h4>
          <span class="counter">{{ nodes.length }}</span>
        </div>
      </div>

      <v-expand-transition>
        <div v-if="isPanelExpanded">
          <div class="nodes-list">
            <div v-for="node in nodes" :key="node.id" class="node-item">
              <div class="node-header" @click.stop="toggleNode(node.id)">
                <v-icon
                  :icon="
                    expandedNodes[node.id]
                      ? 'mdi-chevron-down'
                      : 'mdi-chevron-right'
                  "
                  size="small"
                  color="#0D47A1"
                />
                <span class="node-title">
                  {{ node.data.label || `Узел ${node.id.slice(0, 4)}` }}
                </span>
                <v-chip
                  v-if="node.data.color"
                  :color="node.data.color"
                  size="x-small"
                  class="color-chip"
                />
              </div>

              <v-expand-transition>
                <div v-if="expandedNodes[node.id]" class="node-details">
                  <div v-if="node.data.color" class="detail-row">
                    <span class="detail-label">Цвет:</span>
                    <span class="detail-value">
                      <v-chip :color="node.data.color" size="x-small" label>
                        {{ node.data.color }}
                      </v-chip>
                    </span>
                  </div>

                  <div v-if="node.data.weight" class="detail-row">
                    <span class="detail-label">Вес:</span>
                    <span class="detail-value">{{ node.data.weight }}</span>
                  </div>

                  <div v-if="node.data.size" class="detail-row">
                    <span class="detail-label">Размер:</span>
                    <span class="detail-value">
                      {{ node.data.size.width }}×{{ node.data.size.height }}
                    </span>
                  </div>

                  <div class="detail-row">
                    <span class="detail-label">Позиция:</span>
                    <span class="detail-value">
                      ({{ Math.round(node.position.x) }},
                      {{ Math.round(node.position.y) }})
                    </span>
                  </div>
                </div>
              </v-expand-transition>
            </div>
          </div>
        </div>
      </v-expand-transition>
    </div>

    <div v-else class="empty-state">
      <v-icon icon="mdi-information-outline" size="small" color="#0D47A1" />
      <span>Выберите вершины</span>
    </div>
  </div>
</template>

<style scoped>
.nodes-panel {
  width: 100%;
  margin-top: 10px;
  background-color: #ffffff;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: "Roboto", sans-serif;
  border: 1px solid #e0e0e0;
}

.panel-header {
  padding: 12px 16px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  cursor: pointer;
}

.panel-header:hover {
  background-color: #eeeeee;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: #0d47a1;
  flex-grow: 1;
}

.counter {
  background-color: #0d47a1;
  color: white;
  border-radius: 10px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
}

.nodes-list {
  padding: 8px 0;
  max-height: 200px;
  overflow-y: auto;
}

.node-item {
  margin: 0 8px 6px;
  border-radius: 4px;
  background-color: white;
  box-shadow: 0 1px 2px rgba(13, 71, 161, 0.1);
  border: 1px solid #eeeeee;
  transition: all 0.2s ease;
}

.node-item:hover {
  border-color: #bbdefb;
}

.node-header {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  user-select: none;
}

.node-header:hover {
  background-color: #f8f9fa;
}

.node-title {
  flex: 1;
  margin-left: 8px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #0d47a1;
}

.color-chip {
  width: 16px;
  height: 16px;
  margin-left: 8px;
  flex-shrink: 0;
}

.node-details {
  padding: 10px 16px 12px 30px;
  font-size: 12px;
  border-top: 1px solid #eeeeee;
  background-color: #fafafa;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.detail-label {
  color: #616161;
  font-weight: 400;
}

.detail-value {
  color: #212121;
  font-weight: 500;
  text-align: right;
  max-width: 60%;
  word-break: break-word;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 16px;
  color: #757575;
  font-size: 13px;
  background-color: white;
}

.empty-state .v-icon {
  margin-right: 8px;
}

/* Стили для скроллбара */
.nodes-list::-webkit-scrollbar {
  width: 6px;
}

.nodes-list::-webkit-scrollbar-track {
  background: #fafafa;
}

.nodes-list::-webkit-scrollbar-thumb {
  background-color: #cfd8dc;
  border-radius: 3px;
}
</style>
