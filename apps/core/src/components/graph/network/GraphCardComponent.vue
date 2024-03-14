<template>
	<v-card>
		<v-card-text>
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
		</v-card-text>
	</v-card>
	
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from 'vue'
import { directGraphConfigs, undirectGraphConfigs } from "@/components/graph/network/helper/graphConfig"
import * as vNG from "v-network-graph"

export default defineComponent({
	props: {
		graph: Object
	},
	setup(props) {
		const { graph } = toRefs(props)
		const graphStyle = computed(() => {
			return {
				// "width": size.value + "px",
				// "height": size.value + "px",
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
			graphStyle
		}
	}
})
</script>