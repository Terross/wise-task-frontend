<template>
  <v-card>
		<v-data-table>
			
		</v-data-table>
	</v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { storeToRefs } from 'pinia'


export default defineComponent({
	setup() {
		const { graphLibrary } = storeToRefs(useGraphStore())

		return {
			graphLibrary
		}
	},
})
</script>
