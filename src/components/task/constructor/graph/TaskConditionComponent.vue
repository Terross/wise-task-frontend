<template>
    <v-card class="my-4">
        <v-card-title>Настройки условия</v-card-title>
        <v-card-text>
            <v-container>
                <v-row>
                    <v-switch label="Граф задан" v-model="graphPresentModel"></v-switch>
                </v-row>
            </v-container>
            <v-select
                label="Вид графа"
                :items="['Ориетированный', 'Неориентированный', 'Любой']"
                variant="outlined"
                v-model="graphTypeModel"
            ></v-select>
            <v-container>
                <v-row v-if="taskGraphConstructorInfo.isGraphPresent">
                    <v-switch label="Можно редактировать" v-model="isEditModel"></v-switch>
                    <v-switch label="Можно красить" v-model="isColorModel"></v-switch>
                    <v-switch label="Можно удалять вершины" v-model="isDeleteModel" ></v-switch>
                </v-row>
            </v-container>
            <task-condition-list-component></task-condition-list-component>
            
        </v-card-text>
        <v-card-actions>

        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import { useTaskStore } from '@/store/task';
import { computed, defineComponent } from 'vue'
import { storeToRefs } from 'pinia';
import { GraphType } from '@/__generated__/graphql';


export default defineComponent({
    setup() {
        const { taskGraphConstructorInfo, taskGraphInput } = storeToRefs(useTaskStore())
        const graphPresentModel = computed({
            get() {
                return taskGraphConstructorInfo.value.isGraphPresent
            },
            set(value) {
                taskGraphConstructorInfo.value.isGraphPresent = value
            }
        })

        const graphTypeModel = computed({
            get() {
                switch(taskGraphConstructorInfo.value.graphType) {
                    case GraphType.Any:
                        return 'Любой'
                    case GraphType.Direct:
                        return 'Ориентированный'
                    case GraphType.Undirect:
                        return 'Неориентированный'
                }
            },
            set(value) {
                switch(value) {
                    case 'Любой':
                        return taskGraphConstructorInfo.value.graphType = GraphType.Any
                    case 'Ориентированный':
                        return taskGraphConstructorInfo.value.graphType = GraphType.Direct
                    case 'Неориентированный':
                    return taskGraphConstructorInfo.value.graphType = GraphType.Undirect
                }
            }
        })

        const isEditModel = computed({
            get() {
                return taskGraphInput.value.rule.isEdit
            },
            set(value) {
                taskGraphInput.value.rule.isEdit = value
            }
        })

        const isColorModel = computed({
            get() {
                return taskGraphInput.value.rule.isColor
            },
            set(value) {
                taskGraphInput.value.rule.isColor = value
            }
        })

        const isDeleteModel = computed({
            get() {
                return taskGraphInput.value.rule.isDelete
            },
            set(value) {
                taskGraphInput.value.rule.isDelete = value
            }
        })

        return {
            graphPresentModel,
            graphTypeModel,
            taskGraphConstructorInfo,
            isEditModel,
            isColorModel,
            isDeleteModel
        }
    },
})
</script>
