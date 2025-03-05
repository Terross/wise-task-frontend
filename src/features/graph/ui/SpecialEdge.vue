<script setup lang="ts">
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type EdgeProps, MarkerType
} from '@vue-flow/core';
import { computed, ref } from 'vue';
import { useNodeStore } from "@/features/graph/stores/nodes";

const props = defineProps<EdgeProps>();

const nodeStore = useNodeStore();
const isHovered = ref(false);
const isPanelHovered = ref(false);
const selectedColor = ref(props.data?.color || "#555555");
const weight = ref(props.data?.weight || "");

const isDirectedMode = true;

const updateEdgeData = () => {
  nodeStore.updateEdge(props.id, { color: selectedColor.value, weight: weight.value });
};

const path = computed(() => getBezierPath(props));

const midX = computed(() => (props.sourceX + props.targetX) / 2);
const midY = computed(() => (props.sourceY + props.targetY) / 2);

const deleteEdge = () => {
  nodeStore.removeEdge(props.id);
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

  <g @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <BaseEdge
        :path="path"
        :style="{ stroke: selectedColor, strokeWidth: 3 }"
        :marker-start="isDirectedMode ? `url(#${MarkerType.Arrow})` : undefined"
    />

    <div v-if="!!weight">
      <EdgeLabelRenderer>
        <div
            :style="{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${midX}px,${midY}px)`,
            background: 'rgba(255, 255, 255, 0.8)',
            padding: '4px 8px',
            borderRadius: '6px',
            boxShadow: '0px 2px 5px rgba(0,0,0,0.15)',
            pointerEvents: 'none',
            fontSize: '14px',
            fontWeight: 'bold',
            color: 'black',
          }"
            class="nodrag nopan"
        >
          {{ weight }}
        </div>
      </EdgeLabelRenderer>
    </div>

    <EdgeLabelRenderer v-if="isHovered || isPanelHovered">
      <div
          @mouseenter="isPanelHovered = true"
          @mouseleave="isPanelHovered = false"
          :style="{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${midX}px,${midY + 10}px)`,
            background: 'rgba(255, 255, 255, 0.95)',
            padding: '8px 12px',
            borderRadius: '10px',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.15)',
            pointerEvents: 'all',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: '500'
          }"
          class="nodrag nopan"
      >
        <input
            type="number"
            v-model="weight"
            min="1"
            max="100"
            @change="updateEdgeData"
            :style="{
              width: '40px',
              padding: '4px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              textAlign: 'center'
            }"
        />


        <button
            :style="{ backgroundColor: '#ff0000', borderRadius: '50%', width: '20px', height: '20px', border: 'none', cursor: 'pointer' }"
            @click="setColor('#ff0000')"
        ></button>
        <button
            :style="{ backgroundColor: '#00ff00', borderRadius: '50%', width: '20px', height: '20px', border: 'none', cursor: 'pointer' }"
            @click="setColor('#00ff00')"
        ></button>
        <button
            :style="{ backgroundColor: '#0000ff', borderRadius: '50%', width: '20px', height: '20px', border: 'none', cursor: 'pointer' }"
            @click="setColor('#0000ff')"
        ></button>
        <button
            @click="deleteEdge"
            :style="{
              padding: '6px 10px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#e74c3c',
              color: '#fff',
              cursor: 'pointer'
            }"
        >
          ✖
        </button>
      </div>
    </EdgeLabelRenderer>
  </g>
</template>