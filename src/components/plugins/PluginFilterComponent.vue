<template>
  <v-card>
		<v-card-title>Поиск модуля</v-card-title>
		<v-card-subtitle>Показывать только</v-card-subtitle>
		<v-card-text>
			<v-text-field label="Категория" v-model="categoryModel"></v-text-field>
			<v-checkbox label="Одобрен" v-model="isValidModel"></v-checkbox>
		</v-card-text>
		<v-card-actions>
			<v-btn @click="isFiltered=true" color="primary" variant="outlined">
				Применить
			</v-btn>
			<v-btn @click="isFiltered=false" color="primary" variant="outlined">
				Сброс
			</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
import { usePluginStore } from '@/store/plugin';
import { storeToRefs } from 'pinia';
import { defineComponent, computed } from 'vue'

export default defineComponent({
	setup() {
		const { pluginFilter } = storeToRefs(usePluginStore())
		const categoryModel = computed({
			get() {
				return pluginFilter.value.category
			},
			set(value) {
				pluginFilter.value.category = value
			}
		})
		const isValidModel = computed({
			get() {
				return pluginFilter.value.isValid
			},
			set(value) {
				pluginFilter.value.isValid = value
			}
		})
		const isFiltered = computed({
			get() {
				return pluginFilter.value.isFiltered
			},
			set(value) {
				pluginFilter.value.isFiltered = value
			}
		})
		
		return {
			categoryModel,
			isValidModel,
			isFiltered
		}
	},
})
</script>
