import { Maybe, RuleInput, Task, TaskGraphInput, TaskType, PluginInfoInput, GraphType } from "@/__generated__/graphql";
import { defineStore } from "pinia";

export const useTaskStore = defineStore('task', {
    state: () => {
        return {
            tasks: [] as Task[],
            taskGraphInput: {
                name: "",
                description: "Постройте граф, который удовлетворяет следующим условиям",
                taskType: TaskType.Graph as TaskType,
                authorId: "",
                isPublic: false,
                isHiddenMistake: false,
                graph: {},
                rule: {
                    isColor: true,
                    isEdit: true,
                    isMove: true,
                    isDelete: true
                } as RuleInput,
                condition: [] as PluginInfoInput[]
            } as TaskGraphInput,
            taskGraphConstructorInfo: {
                isGraphPresent: false,
                graphType: GraphType.Direct
            }
        }
    }
})

