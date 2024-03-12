<template>
  <v-card :min-height="size" >
		<v-network-graph
			ref="graph"
			:style="graphStyle"
			:nodes="activeGraph.nodes"
			:edges="activeGraph.edges"
			:layouts="activeGraph.layouts"
			:configs="configs"
			:event-handlers="eventHandlers"
			:class="{ linkMode: isLinkMode, linking: linkModeState.linking }"
		>
		<template
			#override-node-label="{
				scale, text, x, y, config, textAnchor, dominantBaseline
			}"
			>
			<text
				x="0"
				y="0"
				:font-size="9 * scale"
				text-anchor="middle"
				dominant-baseline="central"
				fill="#ffffff"
			>{{ text.weight }}</text>
			<text
				x="0"
				y="0"
				:font-size="config.fontSize * scale"
				:text-anchor="textAnchor"
				:dominant-baseline="dominantBaseline"
				:fill="config.color"
				:transform="`translate(${x} ${y})`"
			>{{ text.label }}</text>
		</template>
		<template #edge-label="{ edgeId, ...slotProps }">
      <v-edge-label
				:text="`${activeGraph.edges[edgeId].weight}`"
        align="center"
        vertical-align="below"
        v-bind="slotProps"
      />
      <v-edge-label
				:text="`${activeGraph.edges[edgeId].label}`"
        align="center"
        vertical-align="above"
        v-bind="slotProps"
      />
    </template>
		<template #linking="{ scale }">
      <line
        v-if="temporaryLinkLinePos"
        v-bind="temporaryLinkLinePos"
        :stroke="
          linkModeState.linking && linkModeState.to ? '#4466cc' : 'hotpink'
        "
        :stroke-width="4 * scale"
      />
    </template>
    <template #override-node="slotProps">
      <v-shape v-bind="{ ...slotProps, ...nodeHandlers(slotProps.nodeId) }" />
    </template>
		</v-network-graph>
	</v-card>
</template>

<script lang="ts">
import { ConstructionMode, useGraphStore } from '@/store/graph';
import { storeToRefs } from 'pinia';
import { defineComponent, computed, ref } from 'vue'
import * as vNG from "v-network-graph"
import { configs } from "@/components/graph/network/helper/graphConfig"
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useLinkMode } from "@/components/graph/network/helper/linkMode";
import { createEventHandlers } from './helper/events';
import { generateEdgeIdFuncFactory } from './helper/graph';

export default defineComponent({
	setup() {
		const { name } = useDisplay()
		const size = computed(() => {
			switch (name.value) {
					case 'xs': return 220
					case 'sm': return 400
					case 'md': return 500
					case 'lg': return 600
					case 'xl': return 800
					case 'xxl': return 1200
				}
		})
		const graphStyle = computed(() => {
			return {
				// "width": size.value + "px",
				"height": size.value + "px",
				"border": "1px solid #000"
			}
		})
		const { activeGraph, constructorGraphState } = storeToRefs(useGraphStore())
		const graph = ref<vNG.Instance>()
		const isLinkMode = computed(() => constructorGraphState.value.mode === ConstructionMode.DRAW)
		const { eventHandlers } = createEventHandlers(graph)
		const { nodeHandlers, linkModeState, temporaryLinkLinePos } = useLinkMode(
			graph,
			isLinkMode,
			activeGraph.value.edges,
			activeGraph.value.layouts,
			generateEdgeIdFuncFactory(activeGraph.value.edges)
		);
		
		return {
			activeGraph,
			configs,
			size,
			eventHandlers,
			graphStyle,
			graph,
			isLinkMode,
			linkModeState,
			nodeHandlers,
			temporaryLinkLinePos
		}
	},
})
</script>