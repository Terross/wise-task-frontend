<script setup lang="ts">
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps,
  MarkerType,
  Position,
} from "@vue-flow/core";
import { computed, ref } from "vue";
import { useNodeStore } from "@/features/graph/stores/nodes";

const props = defineProps<EdgeProps>();

const nodeStore = useNodeStore();
const isHovered = ref(false);
const isPanelHovered = ref(false);
const selectedColor = ref(props.data?.color || "#555555");
const weight = ref(props.data?.weight || "");

const updateEdgeData = () => {
  nodeStore.updateEdge(props.id, {
    color: selectedColor.value,
    weight: weight.value,
  });
};

const isSelfConnected: boolean = props.targetNode.id === props.sourceNode.id;

const path = computed(() => {
  if (!(props.targetNode.id === props.sourceNode.id)) {
    return getBezierPath(props);
  }
  if (
    (props.sourcePosition === Position.Bottom &&
      props.targetPosition === Position.Top) ||
    (props.sourcePosition === Position.Top &&
      props.targetPosition === Position.Bottom)
  ) {
    const radiusX = 60;
    const radiusY = props.sourceY - props.targetY;

    return [
      `M ${props.sourceX} ${props.sourceY} A ${radiusX} ${radiusY} 0 1 0 ${props.targetX} ${props.targetY}`,
    ];
  } else if (
    (props.sourcePosition === Position.Left &&
      props.targetPosition === Position.Right) ||
    (props.sourcePosition === Position.Right &&
      props.targetPosition === Position.Left)
  ) {
    const radiusX = (props.sourceX - props.targetX) * 0.6;
    const radiusY = 50;

    return [
      `M ${props.sourceX} ${props.sourceY} A ${radiusX} ${radiusY} 0 1 0 ${props.targetX} ${props.targetY}`,
    ];
  }
});

const midX = computed(() => (props.sourceX + props.targetX) / 2);
const midY = computed(() => (props.sourceY + props.targetY) / 2);

const deleteEdge = () => {
  nodeStore.removeEdge(props.id);
  nodeStore.saveState();
};

const removeSelfEdge = () => {
  if (isSelfConnected) {
    deleteEdge();
  }
};

const setColor = (color: string) => {
  selectedColor.value = color;
  updateEdgeData();
};
</script>

<template>
  <svg style="position: absolute; width: 0; height: 0">
    <defs>
      <marker
        id="arrow"
        viewBox="0 0 10 10"
        refX="8"
        refY="5"
        markerWidth="6"
        markerHeight="6"
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#555" />
      </marker>
    </defs>
  </svg>

  <g
    @mouseenter="isHovered = true"
    @click="removeSelfEdge"
    @mouseleave="isHovered = false"
  >
    <BaseEdge
      :path="path"
      :style="{ stroke: selectedColor, strokeWidth: 3 }"
      :marker-start="
        nodeStore.isDirected ? `url(#${MarkerType.Arrow})` : undefined
      "
    />

    <div v-if="!!weight">
      <EdgeLabelRenderer>
        <div
          :style="{
            transform: `translate(-50%, -50%) translate(${midX}px,${midY}px)`,
          }"
          class="edge-label"
        >
          {{ weight }}
        </div>
      </EdgeLabelRenderer>
    </div>

    <EdgeLabelRenderer v-if="(isHovered || isPanelHovered) && !isSelfConnected">
      <div
        @mouseenter="isPanelHovered = true"
        @mouseleave="isPanelHovered = false"
        :style="{
          transform: `translate(-50%, -50%) translate(${midX}px,${midY - 30}px)`,
        }"
        class="edge-panel"
      >
        <input
          type="text"
          inputmode="numeric"
          v-model="weight"
          min="1"
          max="100"
          @change="updateEdgeData"
          class="edge-input"
        />

        <button @click="setColor('#ff0000')" class="color-button red"></button>
        <button
          @click="setColor('#00ff00')"
          class="color-button green"
        ></button>
        <button @click="setColor('#0000ff')" class="color-button blue"></button>
        <button @click="deleteEdge" class="delete-button">✖</button>
      </div>
    </EdgeLabelRenderer>
  </g>
</template>

<style scoped>
.edge-label {
  position: absolute;
  background: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 6px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  font-size: 14px;
  font-weight: bold;
  color: black;
}

.edge-panel {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 12px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.15);
  pointer-events: all;
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
}

.edge-input {
  width: 40px;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 6px;
  text-align: center;
}

.color-button {
  border-radius: 50%;
  width: 20px;
  height: 20px;
  border: none;
  cursor: pointer;
}

.red {
  background-color: #ff0000;
}

.green {
  background-color: #00ff00;
}

.blue {
  background-color: #0000ff;
}

.delete-button {
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  background-color: #e74c3c;
  color: #fff;
  cursor: pointer;
}
</style>
