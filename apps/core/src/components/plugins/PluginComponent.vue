<template>
  <v-layout>
		<v-row>
			<v-col>
				<v-row>
					<v-col>
						<plugin-input-component></plugin-input-component>
					</v-col>
				</v-row>
				<v-row>
					<v-col cols="9">
						<plugin-table-component></plugin-table-component>
					</v-col>
					<v-col cols="3">
						<plugin-filter-component></plugin-filter-component>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { usePluginStore } from '@/store/plugin';
import { storeToRefs } from 'pinia';
import { useQuery } from '@vue/apollo-composable';
import { GET_ALL_PLUGINS } from '@/api/Queries';

export default defineComponent({
	setup() {
		const { plugins } = storeToRefs(usePluginStore())
		const { onResult } = useQuery(GET_ALL_PLUGINS)
		onResult(response => {
			if (response.data) {
				plugins.value = response.data.getAllPlugins
			}
		})
	},
})
</script>
