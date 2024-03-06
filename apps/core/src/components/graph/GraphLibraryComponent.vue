<template>
	<v-layout>
		<v-row>
			<v-col>
				<control-panel-component></control-panel-component>
				<graph-constructor-component></graph-constructor-component>
			</v-col>
			<v-col>
				<named-graph-list-component></named-graph-list-component>
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
import ControlPanelComponent from './network/ControlPanelComponent.vue'



export default defineComponent({
  components: { ControlPanelComponent },
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
