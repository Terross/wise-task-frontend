<template>
	<div class="pa-4 text-center">
		<v-dialog v-model="dialogModel" max-width="800">
			<v-card >
				<v-card-title>Создание плагина</v-card-title>
				<v-card-text>
					<v-text-field
						label="Название"
						v-model="nameModel"
					></v-text-field>
					<v-text-field
						label="Описание"
						v-model="descriptionModel"
					></v-text-field>
					<v-text-field
						label="Категория"
						v-model="categoryModel"
					></v-text-field>
					<v-select
						label="Тип графа"
						:items="['DIRECT', 'UNDIRECT', 'ANY']"
						v-model="graphTypeModel"
					></v-select>
					<v-select
						label="Тип плагина"
						:items="['GRAPH_PROPERTY', 'GRAPH_CHARACTERISTIC', 'GRAPH_NEW_GRAPH']"
						v-model="pluginTypeModel"
					></v-select>
					<v-file-input 
						label="Jar файл"
						v-model="jarFileModel"
					></v-file-input>
					<v-card-actions>
						<v-btn 
						color = "primary"
						variant="outlined"
						@click="savePlugin">Сохранить</v-btn>
						<v-btn 
						color = "primary"
						variant="outlined"
						@click="dialogModel = false">Закрыть</v-btn>
					</v-card-actions>
				</v-card-text>
			</v-card>
		</v-dialog>
	</div>
</template>

<script lang="ts">
import { usePluginStore } from '@/store/plugin';
import { storeToRefs } from 'pinia';
import { defineComponent, computed } from 'vue'
import { buildPluginInputModels } from './helper/inputModel';
import { useMutation } from '@vue/apollo-composable';
import { CREATE_PLUGIN, UPDATE_PLUGIN } from '@/api/Mutations';

export default defineComponent({
	setup() {
		const { pluginInput, plugins, dialog } = storeToRefs(usePluginStore())
		
		const { nameModel, descriptionModel, categoryModel,
			 graphTypeModel, pluginTypeModel, jarFileModel, dialogModel } = buildPluginInputModels()

		
		return {
			nameModel,
			descriptionModel,
			categoryModel,
			graphTypeModel,
			pluginTypeModel,
			jarFileModel,
			pluginInput,
			plugins,
			dialogModel,
			dialog
		}
	},
	methods: {
		savePlugin() {
			if (this.pluginInput.id) {
				this.updatePlugin()
			} else {
				this.createPlugin()
			}
		},
		toBase64(file: File) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result);
				reader.onerror = error => reject(error);
			});
		},
		async createPlugin() {
			const id = self.crypto.randomUUID()
			const file = this.pluginInput.jarFile[0]
			const fileName = (file.name as string).replace(".jar", "")
			const jarFile = ((await this.toBase64(file)) as string).replace("data:application/x-java-archive;base64,", "")
			const { mutate, onDone, onError } = useMutation(CREATE_PLUGIN)
			const request = {
				plugin: {
					id: id,
					name: this.pluginInput.name,
					description: this.pluginInput.description,
					category: this.pluginInput.category,
					graphType: this.pluginInput.graphType,
					pluginType: this.pluginInput.pluginType,
					isInternal: false,
					authorId: "00000000-0000-0000-0000-000000000000", //TODO: replace to security context
					isValid: false,
					jarName: fileName,
					jarFile: jarFile
				}
			}
			mutate(request)
			
			onDone(response => {
				this.plugins.push(response.data.createPlugin)
				this.dialog = false
			})

			onError(({graphQLErrors}) => {
				if (graphQLErrors) {
				graphQLErrors.map(({message}) => {
					console.error(message)
				})
				} 
			})
		},
		async updatePlugin() {
			let fileName
			let jarFile
			if (this.pluginInput.jarFile) {
				const file = this.pluginInput.jarFile[0]
				fileName = (file.name as string).replace(".jar", "")
				jarFile = ((await this.toBase64(file)) as string).replace("data:application/x-java-archive;base64,", "")
			} else {
				fileName = ""
				jarFile = ""
			}
			
			const { mutate, onDone, onError } = useMutation(UPDATE_PLUGIN)
			const request = {
				plugin: {
					id: this.pluginInput.id,
					name: this.pluginInput.name,
					description: this.pluginInput.description,
					category: this.pluginInput.category,
					graphType: this.pluginInput.graphType,
					pluginType: this.pluginInput.pluginType,
					isInternal: false,
					authorId: "00000000-0000-0000-0000-000000000000", //TODO: replace to security context
					isValid: false,
					jarName: fileName,
					jarFile: jarFile
				}
			}
			mutate(request)
			
			onDone(response => {
				const index = this.plugins.findIndex(item => {
					return item.id === this.pluginInput.id
				})
				this.plugins = [...this.plugins.slice(0, index),response.data.updatePlugin,...this.plugins.slice(index + 1)]
				this.dialog = false
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
