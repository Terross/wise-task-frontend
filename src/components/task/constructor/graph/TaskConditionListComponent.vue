<template>
    <v-card class="my-4">
        <draggable v-model="condition" item-key="pluginId">
            <template #item="{element}">
                <v-list-item>
                    <v-container v-if="!isCharacteristic(element.pluginType)">
                        <v-row>
                            <v-col>
                                <v-textarea variant="outlined"
                                    class="ma-1"
                                    rows="1"
                                    v-model="element.mistakeText"
                                    label="Описание модуля"></v-textarea>
                            </v-col>
                            <v-col>
                                <v-select
                                    :items="['Выполняется', 'Не выполняется']"
                                    variant="underlined">
                                </v-select>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-container v-else>
                        <v-row>
                            <v-col>
                                <v-textarea variant="outlined"
                                    class="ma-1"
                                    rows="1"
                                    v-model="element.mistakeText"
                                    label="Описание модуля">
                                </v-textarea>
                            </v-col>
                            <v-col>
                                <v-select
                                    :items="['=', '>', '<']"
                                    variant="underlined"
                                    >                                  
                                </v-select>           
                            </v-col>
                            <v-col>
                                <v-text-field variant="underlined" class="ma-1" label="Значение"></v-text-field>
                            </v-col>
                        </v-row>
                    </v-container>
                    
                    
                    <template v-slot:prepend>
                        <v-chip class="ma-2">
                            {{element.order}}
                        </v-chip>
                    </template>
                    <template v-slot:append>
                    <v-btn
                        icon="mdi-delete"
                        variant="text"
                        @click="deletePlugin(element.order)"
                    ></v-btn>
                    </template>
                </v-list-item>
            </template>
        </draggable>
	</v-card>
</template>

<script lang="ts">
import { PluginType } from '@/__generated__/graphql';
import { usePluginStore } from '@/store/plugin';
import { useTaskStore } from '@/store/task';
import { storeToRefs } from 'pinia';
import { computed, defineComponent } from 'vue'
import draggable from 'vuedraggable'

export default defineComponent({
    components: {
        draggable
    },
    setup() {
        const { taskGraphInput } = storeToRefs(useTaskStore())
        const condition = computed({
            get() {
                return taskGraphInput.value.condition
            },
            set(value) {
                for (let i = 0; i < value.length; i++) {
                    value[i].order = i + 1
                }
                taskGraphInput.value.condition = value
            }
        })

        return {
            condition,
            taskGraphInput
        }
    },
    methods: {
        isCharacteristic(pluginType: PluginType) {
            if (pluginType === PluginType.GraphCharacteristic) {
                return true
            } else {
                return false
            }
        },
        deletePlugin(order: any) {
            console.log(order)
            const tmpCondition = this.taskGraphInput.condition.filter(c => c?.order !== order)
            for (let i = 0; i < tmpCondition.length; i++) {
                    tmpCondition[i].order = i + 1
                }
            this.taskGraphInput.condition = tmpCondition
        }
    }
   
})
</script>
