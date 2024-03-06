<template>
  <v-layout>
		<v-row>
			<v-col>
				<v-card id="edit-panel">
					<v-btn color="primary">MOVE</v-btn>
					<v-btn color="primary">DRAW</v-btn>
					<v-btn color="primary">EDIT</v-btn>
					<v-btn color="primary">DELETE</v-btn>
				</v-card>
			</v-col>
		</v-row>
	</v-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
	setup() {
			
	},
})
</script>

<style scoped>
#edit-panel {
  background-color: rgb(24, 103, 192);
  width: 100%;
}

</style>