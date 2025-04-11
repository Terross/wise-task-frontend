<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";
import {
  ConnectionSourceID,
  ConnectionTargetID,
} from "@/features/graph/types/CustomEdge";

const props = defineProps<{
  isEditing: boolean;
}>();
</script>

<template>
  <Handle
    type="source"
    :id="ConnectionSourceID.Right"
    :position="Position.Right"
    :is-valid-connection="() => !props.isEditing"
    class="full-node-handle"
  />
  <Handle
    type="source"
    :id="ConnectionSourceID.Left"
    :position="Position.Left"
    :is-valid-connection="() => !props.isEditing"
    class="full-node-handle"
  />
  <Handle
    type="source"
    :id="ConnectionSourceID.Top"
    :position="Position.Top"
    :is-valid-connection="() => !props.isEditing"
    class="full-node-handle"
  />
  <Handle
    type="source"
    :id="ConnectionSourceID.Bottom"
    :position="Position.Bottom"
    :is-valid-connection="() => !props.isEditing"
    class="full-node-handle"
  />

  <Handle
    type="target"
    :id="ConnectionTargetID.Right"
    :position="Position.Right"
    :is-valid-connection="() => !props.isEditing"
    class="full-node-handle"
  />
  <Handle
    type="target"
    :id="ConnectionTargetID.Left"
    :position="Position.Left"
    :is-valid-connection="() => !props.isEditing"
    class="full-node-handle"
  />
  <Handle
    type="target"
    :id="ConnectionTargetID.Top"
    :position="Position.Top"
    :is-valid-connection="() => !props.isEditing"
    class="full-node-handle"
  />
  <Handle
    type="target"
    :id="ConnectionTargetID.Bottom"
    :position="Position.Bottom"
    :is-valid-connection="() => !props.isEditing"
    class="full-node-handle"
  />
</template>

<style>
.full-node-handle {
  width: 20px;
  height: 20px;
}
</style>
