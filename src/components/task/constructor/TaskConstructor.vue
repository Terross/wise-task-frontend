<template>
	<v-container class="fill-height" fluid>
		<v-row>
			<v-col>
				<v-card class="mx-auto pa-4 pb-4 justify-center" max-width="548" rounded="lg">
					<v-card-title>Выберете тип задачи</v-card-title>
					<v-card-text>
						<v-radio-group v-model="radios">
							<v-radio label="Задача на строительство графа" value="1"></v-radio>
							<v-radio label="Задача на редактирование графа" value="2"></v-radio>
							<v-radio label="Задача на реализацию алгоритма" value="3"></v-radio>
						</v-radio-group>
					</v-card-text>
					<v-card-actions>
						<v-btn
							type="submit"
							block
							color="primary"
							text="Открыть конструктор задачи"
							variant="outlined"
							@click="openTaskConstructor"
						></v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'

export default defineComponent({
	setup() {

	},
	data () {
		return {
			radios: '1'
		}
	},
	methods: {
		openTaskConstructor() {
			switch (this.radios) {
				case '1': this.$router.push('/taskconstructor/common')
				case '2': this.$router.push('/taskconstructor/graph')
				case '3': this.$router.push('/taskconstructor/implementation')
			}
		}
	}
})
</script>
