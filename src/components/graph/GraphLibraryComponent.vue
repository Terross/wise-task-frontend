<template>
    <named-graph-list-component></named-graph-list-component>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue'
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
