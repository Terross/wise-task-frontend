<template>
    <v-container>
        <v-row>
            <v-col>
                <graph-solution-card-component></graph-solution-card-component>
            </v-col>
            <v-col>
                <v-card>
                    <v-card-title>Описание задачи</v-card-title>
                    <v-card-text class="text-pre-wrap">
                        {{ description }}
                    </v-card-text>
                </v-card>
                <v-alert
                    v-if="activeSolution.isCorrect"
                    text="Задача решена верно"
                    title="Успех!"
                    type="success"
                    variant="tonal"
                ></v-alert>
                <v-alert
                    v-else
                    text="В решении есть ошибка"
                    title="Ошибка!"
                    type="error"
                    variant="tonal"
                ></v-alert>
                <v-card v-if="!activeSolution.isCorrect">
                    <v-card-title>Ошибки в модулях</v-card-title>
                    <v-card-text>
                        <v-list lines="one">
                            <v-list-item
                                v-for="(item, i) in activeSolution.pluginResults"
                                :key="i"
                                :title="(i + 1) + '. ' + item.pluginMessage + ' = ' + item.value"
                            ></v-list-item>
                            </v-list>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { storeToRefs } from 'pinia'
import { useSolutionStore } from '@/store/solution'
import { useQuery } from '@vue/apollo-composable'
import { toVGraph } from '../graph/network/helper/graph'

import { GET_SOLUTION_WITH_TASK_DESCRIPTION } from '@/api/Queries'

export default defineComponent({

    setup(props) {
        const { activeSolution, graph, description } = storeToRefs(useSolutionStore())
        const { onResult } = useQuery(GET_SOLUTION_WITH_TASK_DESCRIPTION, { solutionId: props.id, taskId: props.taskId })
        onResult(response => {
            if (response.data) {
                activeSolution.value = response.data.getTaskSolution
                graph.value = toVGraph(response.data.getTaskSolution.graph)
                description.value = response.data.getTask.description
                if (response.data.getTaskSolution.isCorrect) {
                    this.successAlert 
                } else {

                }
            }
        })
        
        return {
            activeSolution,
            graph,
            description
        }
    },
    props: ["id", "taskId"]
})
</script>
