<script setup lang="ts">
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getSmoothStepPath,
  getStraightPath,
  MarkerType,
  Position,
} from "@vue-flow/core";
import { computed, ref, onMounted, onUnmounted } from "vue";
import { useNodeStore } from "@/features/graph/stores/nodes";
import { COLORS } from "@/features/graph/config/colors";
import { CustomEdge } from "@/features/graph/types/CustomEdge";
import { isEdgeSelected } from "@/features/graph/lib/flowEventsHandlers/edgeEventsHandling";
import { graphSettingsStore } from "@/features/graph/stores/graphSettings";

const props = defineProps<CustomEdge>();

const nodeStore = useNodeStore();
const isPanelVisible = ref(false);
const tempWeight = ref(props.data?.weight || 0);

const weight = computed({
  get: () => props.data?.weight || 0,
  set: (value) => {
    tempWeight.value = value;
  },
});

const color = computed({
  get: () => props.data?.color || "#595959",
  set: (value) => {
    nodeStore.updateEdge(props.id, {
      weight: weight.value,
      color: value,
    });
  },
});

const sourcePosition = computed({
  get: () => props.sourcePosition,
  set: (val) => {},
});

const targetPosition = computed({
  get: () => props.targetPosition,
  set: (val) => {},
});

function getHighlightColor(baseColor: string): string {
  if (!["#ff0000", "#00ff00", "#0000ff"].includes(baseColor.toLowerCase())) {
    return "#cccccc";
  }

  try {
    const rgb = hexToRgb(baseColor);
    const lighter = {
      r: Math.min(255, Math.round(rgb.r + (255 - rgb.r) * 0.4)),
      g: Math.min(255, Math.round(rgb.g + (255 - rgb.g) * 0.4)),
      b: Math.min(255, Math.round(rgb.b + (255 - rgb.b) * 0.4)),
    };
    return `rgb(${lighter.r}, ${lighter.g}, ${lighter.b})`;
  } catch {
    return "#ffc0cb";
  }
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleanHex = hex.replace("#", "");
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return { r, g, b };
}

const isSelected = computed(() => isEdgeSelected(props.id));

const updateEdgeData = () => {
  nodeStore.updateEdge(props.id, {
    color: color.value,
    weight: tempWeight.value,
  });
};

const labelPosition = computed(() => {
  if (!path.value?.[0]) return { x: midX.value, y: midY.value };

  if (graphSettingsStore.edgeType === "Straight") {
    return { x: midX.value, y: midY.value };
  }

  try {
    const pathString = path.value[0];
    const pathEl = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    pathEl.setAttribute("d", pathString);

    const pathLength = pathEl.getTotalLength();
    const midpoint = pathEl.getPointAtLength(pathLength * 0.5);

    return { x: midpoint.x, y: midpoint.y };
  } catch {
    return { x: midX.value, y: midY.value };
  }
});

const isSelfConnected: boolean = props.targetNode.id === props.sourceNode.id;

const path = computed(() => {
  if (props.targetNode.id !== props.sourceNode.id) {
    if (graphSettingsStore.edgeType === "Straight") {
      return getStraightPath(props);
    }
    if (graphSettingsStore.edgeType === "Step") {
      return getSmoothStepPath(props);
    }
    return getBezierPath(props);
  }
  if (
    (sourcePosition.value === Position.Bottom &&
      targetPosition.value === Position.Top) ||
    (sourcePosition.value === Position.Top &&
      targetPosition.value === Position.Bottom)
  ) {
    const radiusX = 60;
    const radiusY = props.sourceY - props.targetY;

    return [
      `M ${props.sourceX} ${props.sourceY} A ${radiusX} ${radiusY} 0 1 0 ${props.targetX} ${props.targetY}`,
    ];
  } else if (
    (sourcePosition.value === Position.Left &&
      targetPosition.value === Position.Right) ||
    (sourcePosition.value === Position.Right &&
      targetPosition.value === Position.Left)
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
};

const removeSelfEdge = () => {
  if (isSelfConnected) {
    deleteEdge();
  }
};

const setColor = (colorValue: string) => {
  color.value = colorValue;
};

const handleClickOutside = (event: MouseEvent) => {
  const edgePanel = document.querySelector(".edge-panel");
  if (edgePanel && !edgePanel.contains(event.target as Node)) {
    isPanelVisible.value = false;
  }
};

const handleEdgeClick = () => {
  if (isSelfConnected) {
    removeSelfEdge();
  } else {
    // не убирать timeout, т.к. vueFlow получит ивент, поменяет компонент, он заререндерится и окошко не откроется
    setTimeout(() => (isPanelVisible.value = !isPanelVisible.value), 20);
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
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

  <g @click="handleEdgeClick">
    <BaseEdge
      :path="path?.[0] || ''"
      :style="{
        stroke: isSelected ? getHighlightColor(color) : color,
        strokeWidth: isSelected ? 3 : 2,
        filter: isSelected ? 'drop-shadow(0 0 1px currentColor)' : 'none',
        transition: '',
      }"
      :marker-start="
        nodeStore.isDirected ? `url(#${MarkerType.Arrow})` : undefined
      "
    />

    <div v-if="!!weight">
      <EdgeLabelRenderer>
        <
        <div
          :style="{
            transform: `translate(-50%, -50%) translate(${labelPosition.x}px,${labelPosition.y}px)`,
          }"
          class="edge-label"
        >
          {{ weight }}
        </div>
      </EdgeLabelRenderer>
    </div>

    <EdgeLabelRenderer v-if="isPanelVisible && !isSelfConnected">
      <div
        :style="{
          transform: `translate(-50%, -50%) translate(${midX}px,${midY - 30}px)`,
        }"
        class="edge-panel"
      >
        <input
          type="text"
          inputmode="numeric"
          :value="weight"
          @input="(e) => (tempWeight = Number(e.target.value))"
          @blur="updateEdgeData"
          class="edge-input"
        />
        <button
          v-for="(colorValue, colorName) in COLORS"
          :key="colorName"
          @click="setColor(colorValue)"
          :style="{ backgroundColor: colorValue }"
          class="color-button"
        ></button>

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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  font-size: 14px;
  font-weight: bold;
  color: black;
  z-index: 200000;
}

.edge-panel {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  padding: 8px 12px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
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

.delete-button {
  padding: 6px 10px;
  border-radius: 6px;
  border: none;
  background-color: #e74c3c;
  color: #fff;
  cursor: pointer;
}
</style>
