<template>
	<v-layout>
		<v-row>
			<graph-card-component 
				v-for="graph in graphLibrary"
				v-bind:graph = "graph"
				v-bind:key = "graph.name">
			</graph-card-component>
		</v-row>
	</v-layout>
  
</template>

<script lang="ts">
import { useGraphStore } from '@/store/graph'
import { storeToRefs } from 'pinia'
import { defineComponent } from 'vue'

export default defineComponent({
	setup() {
		const { graphLibrary } = storeToRefs(useGraphStore())

		return {
			graphLibrary
		}
	},
})
</script>
