<template>
	<v-layout>
		<v-row>
			<v-col>
				<control-panel-component></control-panel-component>
				<graph-constructor-component></graph-constructor-component>
			</v-col>
			<v-col>
				<v-row>
					<v-col>
						<graph-input-component></graph-input-component>
					</v-col>
					<v-col>
						<graph-filter-component></graph-filter-component>
					</v-col>
				</v-row>
				<v-col>
					<named-graph-list-component></named-graph-list-component>
				</v-col>
			</v-col>
		</v-row>
	</v-layout>
    
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useQuery } from '@vue/apollo-composable'
import { GET_GRAPH_LIBRARY } from '@/api/Queries'
import { useGraphStore } from '@/store/graph'
import { toVGraph } from './network/helper/graph'
import { Graph } from '@/__generated__/graphql'

export default defineComponent({
    setup() {
			const { onResult } = useQuery(GET_GRAPH_LIBRARY)
			onResult(response => {
				if (response.data) {
					response.data.getGraphLibrary.forEach(function (graph: Graph) {
							useGraphStore().graphLibrary.push(toVGraph(graph))
						}
					)
				}
			})
    },
})
</script>
