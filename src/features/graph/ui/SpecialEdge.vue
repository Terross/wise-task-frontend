<script setup lang="ts">
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps, Position } from '@vue-flow/core'
import { computed } from 'vue'

const props = defineProps<EdgeProps>()

const path = computed(() => {
  if (props.sourceNode && props.targetNode && props.sourceNode === props.targetNode) {
    if (
        (props.sourcePosition === Position.Bottom && props.targetPosition === Position.Top) ||
        (props.sourcePosition === Position.Top && props.targetPosition === Position.Bottom)
    ) {
      const radiusX = 80
      const radiusY = props.sourceY - props.targetY - 20

      return [`M ${props.sourceX} ${props.sourceY} A ${radiusX} ${radiusY} 0 1 0 ${props.targetX} ${props.targetY}`]
    } else if (
        (props.sourcePosition === Position.Left && props.targetPosition === Position.Right) ||
        (props.sourcePosition === Position.Right && props.targetPosition === Position.Left)
    ) {
      const radiusX = (props.sourceX - props.targetX) * 0.6
      const radiusY = 50

      return [`M ${props.sourceX} ${props.sourceY} A ${radiusX} ${radiusY} 0 1 0 ${props.targetX} ${props.targetY}`]
    }
  }
  return getBezierPath(props)
})
</script>

<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<template>
  <BaseEdge :path="path" />

  <EdgeLabelRenderer>
    <div
        :style="{
        pointerEvents: 'all',
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${props.sourceX}px,${props.sourceY}px)`,
      }"
        class="nodrag nopan"
    >
      {{ props.data?.hello }}
      {{ props.data?.title }}
    </div>
  </EdgeLabelRenderer>
</template>