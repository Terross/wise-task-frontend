<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
import {
  ConnectionSourceID,
  ConnectionTargetID,
} from "@/features/graph/types/CustomEdge";
import { computed } from "vue";
import { graphSettingsStore } from "@/features/graph/stores/graphSettings";

const props = defineProps<{
  isEditing: boolean;
}>();

const isOneHandle = computed(() => {
  return graphSettingsStore.isOneHandle;
});

const checkValidConnection = (connection: any) => {
  if (isOneHandle.value) {
    return !props.isEditing;
  }

  const isValidConnection =
    (connection.sourceHandle === "target-d" &&
      connection.targetHandle === "target-c") ||
    (connection.sourceHandle === "target-c" &&
      connection.targetHandle === "target-d") ||
    (connection.sourceHandle === "target-a" &&
      connection.targetHandle === "target-b") ||
    (connection.sourceHandle === "target-b" &&
      connection.targetHandle === "target-a");

  if (!isValidConnection && connection.source === connection.target) {
    return false;
  }

  return !props.isEditing;
};
</script>

<template>
  <div v-if="isOneHandle">
    <Handle
      type="source"
      :id="ConnectionSourceID.Right"
      :position="Position.Right"
      :is-valid-connection="checkValidConnection"
      class="center-handle"
    />

    <Handle
      type="target"
      :id="ConnectionTargetID.Right"
      :position="Position.Right"
      :is-valid-connection="checkValidConnection"
      class="center-handle"
    />
  </div>
  <div v-else>
    <Handle
      type="source"
      :id="ConnectionSourceID.Right"
      :position="Position.Right"
      :is-valid-connection="checkValidConnection"
      class="full-node-handle"
    />
    <Handle
      type="source"
      :id="ConnectionSourceID.Left"
      :position="Position.Left"
      :is-valid-connection="checkValidConnection"
      class="full-node-handle"
    />
    <Handle
      type="source"
      :id="ConnectionSourceID.Top"
      :position="Position.Top"
      :is-valid-connection="checkValidConnection"
      class="full-node-handle"
    />
    <Handle
      type="source"
      :id="ConnectionSourceID.Bottom"
      :position="Position.Bottom"
      :is-valid-connection="checkValidConnection"
      class="full-node-handle"
    />

    <Handle
      type="target"
      :id="ConnectionTargetID.Right"
      :position="Position.Right"
      :is-valid-connection="checkValidConnection"
      class="full-node-handle"
    />
    <Handle
      type="target"
      :id="ConnectionTargetID.Left"
      :position="Position.Left"
      :is-valid-connection="checkValidConnection"
      class="full-node-handle"
    />
    <Handle
      type="target"
      :id="ConnectionTargetID.Top"
      :position="Position.Top"
      :is-valid-connection="checkValidConnection"
      class="full-node-handle"
    />
    <Handle
      type="target"
      :id="ConnectionTargetID.Bottom"
      :position="Position.Bottom"
      :is-valid-connection="checkValidConnection"
      class="full-node-handle"
    />
  </div>
</template>

<style>
.center-handle {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  opacity: 0;
  pointer-events: auto;
}

.full-node-handle {
  position: absolute;
  padding: 2px;
  pointer-events: auto;
}

.center-handle::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: #4caf50;
  border-radius: 50%;
  opacity: 0.3;
}
</style>
