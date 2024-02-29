<template>
	<v-card max-width="444">
		<v-card-title>{{ title }}</v-card-title>
		<v-card-text>
			<v-network-graph
				class="graph"
				:nodes="nodes"
				:edges="edges"
				:layouts="layouts"
				:configs="configs"
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
			</v-network-graph>
		</v-card-text>
	</v-card>
	
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
import { configs } from "@/helper/graphConfig"
import { useQuery } from '@vue/apollo-composable'
import { GET_GRAPH_LIBRARY } from '@/api/Queries'
import { toVGraph } from '@/helper/graph'
import test from 'node:test'


export default defineComponent({
	setup() {
		const nodes = reactive({ })
		const edges = reactive({ })
		const layouts = reactive({ nodes: {} })
		const { result, onResult, loading, error } = useQuery(GET_GRAPH_LIBRARY)
		const title = computed(() => {
			if (result.value) {
				return result.value.getGraphLibrary.title
			}
			return ''
		})
		onResult(response => {
			if (response.data) {
				toVGraph(response.data.getGraphLibrary[0], nodes, edges, layouts)
			}
		})
		return {
			nodes,
			edges,
			layouts,
			configs,
			title
		}
	},
})
</script>
