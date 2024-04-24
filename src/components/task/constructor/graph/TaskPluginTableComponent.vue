<template>
	<v-card class="my-4">
		<template v-slot:text>
			<v-row>
				<v-text-field
					v-model="search"
					label="Поиск"
					prepend-inner-icon="mdi-magnify"
					variant="outlined"
					hide-details
					single-line
				></v-text-field>
			</v-row>
		</template>
			<v-data-table
				:headers="headers"
				:search="search"
				:items="getFilteredPlugins"
				:group-by="groupBy"
			>
				<template v-slot:item.actions="{ item }">
					<v-icon
						class="me-2"
						size="small"
						@click="addPluginToCondition(item)"
					>
						mdi-plus
					</v-icon>
				</template>
			</v-data-table>
	</v-card>
</template>

<script lang="ts">
import { Plugin } from '@/__generated__/graphql';
import { DELETE_PLUGIN, VALIDATE_PLUGIN } from '@/api/Mutations';
import { usePluginStore } from '@/store/plugin';
import { useTaskStore } from '@/store/task';
import { useMutation } from '@vue/apollo-composable';
import { storeToRefs } from 'pinia';
import { defineComponent, ref } from 'vue'


export default defineComponent({
	setup() {
		const { getFilteredPlugins, plugins, dialog, pluginInput } = storeToRefs(usePluginStore())
		const { taskGraphInput } = storeToRefs(useTaskStore())
		const headers = [
			{ key: 'name', title: 'Название'},
			{ key: 'description', title: 'Описание'},
			{ key: 'actions', title: 'Добавить в задачу', sortable: false}
		]
		const search = ref('')
		const groupBy = [
			{
				key: 'category',
				order: 'asc'
			}
		]
		return {
			getFilteredPlugins,
			headers,
			search,
			groupBy,
			dialog,
			pluginInput,
			plugins,
			taskGraphInput
		}
	},
	methods: {
		addPluginToCondition(plugin: Plugin) {
            this.taskGraphInput.condition.push({
				pluginId: plugin.id,
				value: "true",
				mistakeText: plugin.description,
				pluginType: plugin.pluginType,
				sign: "=",
				order:  this.taskGraphInput.condition.length + 1
			})
		}
	}
})
</script>
