import { Maybe, Plugin } from "@/__generated__/graphql";
import { defineStore } from "pinia";

export const usePluginStore = defineStore('plugin', {
    state: () => {
        return {
            plugins: [] as Plugin[],
            pluginInput: {
                name: "",
                description: "",
                category: "",
                graphType: "ANY",
                pluginType: "GRAPH_PROPERTY"
            } as PluginInput,
            dialog: false,
            pluginFilter: {
                category: "",
                isValid: false,
                isFiltered: false
            } as PluginFilter,
            persist: true
        }
    },
    getters: {
        getFilteredPlugins(state) {
            const { category, isValid, isFiltered }: PluginFilter = state.pluginFilter
            return state.plugins.filter((item) => {
                return !isFiltered || ((category === "" || item.category === category) && (item.isValid === isValid))
            })
        }
    }
})

interface PluginInput {
    id?: string,
    name: string,
    description: string,
    category: string
    graphType: string,
    pluginType: string,
    jarFile?: any
}

interface PluginFilter {
    category: string,
    isValid: boolean,
    isFiltered: boolean
}