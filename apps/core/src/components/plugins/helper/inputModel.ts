import { computed } from "vue"
import { usePluginStore } from '@/store/plugin';
import { storeToRefs } from 'pinia';

const { pluginInput, dialog } = storeToRefs(usePluginStore())

export function buildPluginInputModels() {
    const nameModel = computed({
        get() {
            return pluginInput.value.name
        },
        set(value) {
            pluginInput.value.name = value
        }
    }) 
    const descriptionModel = computed({
        get() {
            return pluginInput.value.description
        },
        set(value) {
            pluginInput.value.description = value
        }
    }) 
    const categoryModel = computed({
        get() {
            return pluginInput.value.category
        },
        set(value) {
            pluginInput.value.category = value
        }
    }) 
    const graphTypeModel = computed({
        get() {
            return pluginInput.value.graphType
        },
        set(value) {
            pluginInput.value.graphType = value
        }
    }) 
    const pluginTypeModel = computed({
        get() {
            return pluginInput.value.pluginType
        },
        set(value) {
            pluginInput.value.pluginType = value
        }
    }) 
    const jarFileModel = computed({
        get() {
            return pluginInput.value.jarFile
        },
        set(value) {
            pluginInput.value.jarFile = value
        }
    })
    const dialogModel = computed({
        get() {
            return dialog.value
        },
        set(value) {
            dialog.value = value
        }
    })

    return {
        nameModel,
        descriptionModel,
        categoryModel,
        graphTypeModel,
        pluginTypeModel,
        jarFileModel,
        dialogModel
    }
}