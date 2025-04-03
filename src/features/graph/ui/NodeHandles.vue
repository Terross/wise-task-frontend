<script setup lang="ts">
import { Handle, Position } from "@vue-flow/core";

const props = defineProps<{
  isEditing: boolean;
}>();
</script>

<template>
  <Handle
    type="source"
    id="source-a"
    :position="Position.Right"
    :is-valid-connection="() => !props.isEditing"
    class="full-node-handle"
  />
  <Handle
    type="source"
    id="source-b"
    :position="Position.Left"
    :is-valid-connection="() => !props.isEditing"
    class="full-node-handle"
  />
  <Handle
    type="source"
    id="source-c"
    :position="Position.Top"
    :is-valid-connection="() => !props.isEditing"
    class="full-node-handle"
  />
  <Handle
    type="source"
    id="source-d"
    :position="Position.Bottom"
    :is-valid-connection="() => !props.isEditing"
    class="full-node-handle"
  />

  <Handle
    type="target"
    id="target-a"
    :position="Position.Right"
    :is-valid-connection="() => !props.isEditing"
    class="full-node-handle"
  />
  <Handle
    type="target"
    id="target-b"
    :position="Position.Left"
    :is-valid-connection="() => !props.isEditing"
    class="full-node-handle"
  />
  <Handle
    type="target"
    id="target-c"
    :position="Position.Top"
    :is-valid-connection="() => !props.isEditing"
    class="full-node-handle"
  />
  <Handle
    type="target"
    id="target-d"
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
