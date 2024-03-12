<template>
  <v-layout>
		<v-row>
			<v-col>
				<v-card id="edit-panel">
					<v-btn color="primary" @click="setMoveMode">MOVE</v-btn>
					<v-btn color="primary" @click="setDrawMode">DRAW</v-btn>
					<v-btn color="primary" @click="setEditMode">EDIT</v-btn>
					<v-btn color="primary" @click="setDeleteMode">DELETE</v-btn>
				</v-card>
			</v-col>
		</v-row>
	</v-layout>
</template>

<script lang="ts">
import { ConstructionMode, useGraphStore } from '@/store/graph';
import { storeToRefs } from 'pinia';
import { defineComponent } from 'vue'

export default defineComponent({
	setup() {
			
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
		setEditMode() {
			const { constructorGraphState } = storeToRefs(useGraphStore())
			constructorGraphState.value.mode = ConstructionMode.EDIT
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