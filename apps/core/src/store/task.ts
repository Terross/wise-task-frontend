import { Maybe, RuleInput, Task, TaskGraphInput, TaskType, PluginInfoInput, GraphType, PluginType, TaskImplementationInput, TaskGraph, TaskImplementation } from "@/__generated__/graphql";
import { defineStore } from "pinia";

export const useTaskStore = defineStore('task', {
    state: () => {
        return {
            tasks: [] as Task[],
            taskGraphInput: {
                name: "",
                description: "Постройте граф, который удовлетворяет следующим условиям",
                category: "",
                taskType: TaskType.Graph as TaskType,
                authorId: "",
                isPublic: false,
                isHiddenMistake: false,
                rule: {
                    isColor: true,
                    isEdit: true,
                    isMove: true,
                    isDelete: true
                } as RuleInput,
                condition: [] as PluginInfoInput[]
            } as TaskGraphInput,
            taskImplementationInput: {
                name: "",
                description: "Постройте граф, который удовлетворяет следующим условиям",
                category: "",
                taskType: TaskType.Implementation as TaskType,
                authorId: "",
                isPublic: false,
                pluginId: ""
            } as TaskImplementationInput,
            taskGraphConstructorInfo: {
                isGraphPresent: false,
                graphType: GraphType.Direct
            },
            activeTask: {
                id: "",
                name: "",
                description: "",
                category: "",
                taskType: TaskType.Implementation as TaskType,
                authorId: "",
                isPublic: false
            } as Task | TaskGraph | TaskImplementation
        }
    }
})

