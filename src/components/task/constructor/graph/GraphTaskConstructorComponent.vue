<template>
    <v-container>
        <v-row>
            <v-col v-if="taskGraphConstructorInfo.isGraphPresent">
                <control-panel-component></control-panel-component>
				<graph-constructor-component></graph-constructor-component>
            </v-col>
            <v-col>
                <v-textarea variant="outlined" auto-grow v-model="taskTextModel"></v-textarea>
                <task-condition-component ></task-condition-component>
                <task-plugin-table-component ></task-plugin-table-component>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { usePluginStore } from '@/store/plugin';
import { storeToRefs } from 'pinia';
import { useQuery } from '@vue/apollo-composable';
import { GET_ALL_PLUGINS } from '@/api/Queries';
import { useTaskStore } from '@/store/task';


export default defineComponent({
    setup() {
        const { plugins } = storeToRefs(usePluginStore())
		const { onResult } = useQuery(GET_ALL_PLUGINS)
        const { taskGraphInput, taskGraphConstructorInfo } = storeToRefs(useTaskStore())
		onResult(response => {
			if (response.data) {
				plugins.value = response.data.getAllPlugins
			}
		})

        const taskTextModel = computed({
            get() {
                return taskGraphInput.value.description
            },
            set(value) {
                taskGraphInput.value.description = value
            }
        })

        return {
            taskTextModel,
            taskGraphConstructorInfo
        }
    },
})
</script>