<template>
	<v-card>
		<v-card-title>Добавление графа</v-card-title>
		<v-card-text>
			<v-text-field label="Название графа" v-model="name">

			</v-text-field>
		</v-card-text>
		<v-card-actions>
			<v-btn color="primary" @click="saveGraph">Добавить</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
import { useGraphStore } from '@/store/graph';
import { storeToRefs } from 'pinia';
import { defineComponent, computed } from 'vue'
import { toGraph } from './network/helper/graph';
import { CREATE_GRAPH } from '@/api/Mutations';
import { useMutation } from '@vue/apollo-composable'
export default defineComponent({
    setup() {
			const { activeGraph, graphLibrary } = storeToRefs(useGraphStore())
			const name = computed({
				get() {
					return activeGraph.value.name
				},
				set(value) {
					activeGraph.value.name = value
				}
			})
			return {
				name,
				activeGraph,
				graphLibrary
			}
    },
		methods: {
			saveGraph() {
				if (!this.activeGraph.id) {
					this.activeGraph.id = self.crypto.randomUUID()
				}
 				const graph = toGraph(this.activeGraph)
				const { mutate, onDone, onError } = useMutation(CREATE_GRAPH)
				const request = {
					graph: graph
				}
				mutate(request)

				onDone(response => {
					this.graphLibrary.push(this.activeGraph)
				})

				onError(({graphQLErrors}) => {
					if (graphQLErrors) {
					graphQLErrors.map(({message}) => {
						console.error(message)
					})
					} 
				})
			}
		}
})
</script>
