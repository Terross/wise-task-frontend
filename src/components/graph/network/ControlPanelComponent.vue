<template>
  <v-layout>
		<v-row>
			<v-col>
				<v-card id="edit-panel">
					<v-col>
						<v-btn color="primary" @click="setMoveMode">MOVE</v-btn>
						<v-btn color="primary" @click="setDrawMode">DRAW</v-btn>
						<v-btn color="primary" @click="setDeleteMode">DELETE</v-btn>
						<v-checkbox label="Ориентированный" v-model="isDirect"></v-checkbox>
					</v-col>
				</v-card>
			</v-col>
		</v-row>
	</v-layout>
</template>

<script lang="ts">
import { ConstructionMode, useGraphStore } from '@/store/graph';
import { storeToRefs } from 'pinia';
import { defineComponent, computed } from 'vue'

export default defineComponent({
	setup() {
		const { constructorGraphState, activeGraph } = storeToRefs(useGraphStore())
		const isDirect = computed({
			get() {
				return constructorGraphState.value.isDirect
			},
			set(value) {
				constructorGraphState.value.isDirect = value
				activeGraph.value.isDirect = value
			}
		})

		return {
			isDirect
		}
	},
	methods: {
		setMoveMode() {
			const { constructorGraphState } = storeToRefs(useGraphStore())
			constructorGraphState.value.mode = ConstructionMode.MOVE
		},
		setDrawMode() {
			const { constructorGraphState } = storeToRefs(useGraphStore())
			constructorGraphState.value.mode = ConstructionMode.DRAW
		},
		setDeleteMode() {
			const { constructorGraphState } = storeToRefs(useGraphStore())
			constructorGraphState.value.mode = ConstructionMode.DELETE
		}
	}
})
</script>

<style scoped>
#edit-panel {
  background-color: rgb(24, 103, 192);
  width: 100%;
}

</style>