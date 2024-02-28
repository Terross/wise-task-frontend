<template>
	<v-card max-width="444">
		<v-card-title>Какой-то граф</v-card-title>
		<v-card-text>
			<v-network-graph
				class="graph"
				:nodes="nodes"
				:edges="edges"
				:layouts="layouts"
				:configs="configs"
			/>
		</v-card-text>
	</v-card>
	
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import * as vNG from "v-network-graph"
import { configs } from "@/helper/graphConfig"
import { useQuery } from '@vue/apollo-composable'
import { GET_GRAPH_LIBRARY } from '@/api/Queries'
import { toVGraph } from '@/helper/graph'


export default defineComponent({
	setup() {
		const nodes = reactive({ })
		const edges = reactive({ })
		const layouts = reactive({ nodes: {} })
		console.log(123)
		const { onResult, loading, error } = useQuery(GET_GRAPH_LIBRARY)
		onResult(response => {
			if (response.data) {
				toVGraph(response.data.getGraphLibrary[0], nodes, edges, layouts)
			}
		})
		return {
			nodes,
			edges,
			layouts,
			configs
		}
	},
})
</script>
