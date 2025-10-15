<template>
	<v-card :min-height="size">
			<v-network-graph
				:style="graphStyle"
				:nodes="graph.nodes"
				:edges="graph.edges"
				:layouts="graph.layouts"
				:configs="configs"
			>
			<template
				#override-node-label="{
					nodeId, scale, x, y, config, textAnchor, dominantBaseline
				}"
				>
				<text
					x="0"
					y="0"
					:font-size="9 * scale"
					text-anchor="middle"
					dominant-baseline="central"
					fill="#ffffff"
				>{{ graph.nodes[nodeId].weight }}</text>
				<text
					x="0"
					y="0"
					:font-size="config.fontSize * scale"
					:text-anchor="textAnchor"
					:dominant-baseline="dominantBaseline"
					:fill="config.color"
					:transform="`translate(${x} ${y})`"
				>{{ graph.nodes[nodeId].label }}</text>
			</template>
			<template #edge-label="{ edgeId, ...slotProps }">
			<v-edge-label
				:text="`${graph.edges[edgeId].weight}`"
				align="center"
				vertical-align="below"
				v-bind="slotProps"
			/>
			<v-edge-label
				:text="`${graph.edges[edgeId].label}`"
				align="center"
				vertical-align="above"
				v-bind="slotProps"
			/>
			</template>
			</v-network-graph>
	</v-card>
	
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from 'vue'
import { directGraphConfigs, undirectGraphConfigs } from "@/components/graph/network/helper/graphConfig"
import * as vNG from "v-network-graph"
import { storeToRefs } from 'pinia'
import { useSolutionStore } from '@/store/solution'
import { useDisplay } from 'vuetify/lib/framework.mjs'

export default defineComponent({
	setup(props) {
		const { activeSolution, graph } = storeToRefs(useSolutionStore())
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
		
		const configs = computed(() => {
			if (graph.value && graph.value.isDirect) {
				return directGraphConfigs
			}
			return undirectGraphConfigs
		})
		return {
			graph,
			configs,
			graphStyle,
			size
		}
	}
})
</script>