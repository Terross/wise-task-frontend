<template>
  <v-card class="my-4">
    <draggable v-model="condition" item-key="pluginId">
      <template #item="{ element }">
        <v-list-item>
          <v-container v-if="!isCharacteristic(element.pluginType)">
            <v-row>
              <v-col>
                <v-textarea
                  variant="outlined"
                  class="ma-1"
                  rows="1"
                  v-model="element.mistakeText"
                  label="Описание модуля"
                ></v-textarea>
              </v-col>
              <v-col>
                <v-select
                  :items="['Выполняется', 'Не выполняется']"
                  variant="underlined"
                  v-model="element.value"
                >
                </v-select>
              </v-col>
            </v-row>
          </v-container>
          <v-container v-else>
            <v-row>
              <v-col>
                <v-textarea
                  variant="outlined"
                  class="ma-1"
                  rows="1"
                  v-model="element.mistakeText"
                  label="Описание модуля"
                >
                </v-textarea>
              </v-col>
              <v-col>
                <v-select
                  :items="['=', '>', '<']"
                  variant="underlined"
                  v-model="element.sign"
                >
                </v-select>
              </v-col>
              <v-col>
                <v-text-field
                  variant="underlined"
                  class="ma-1"
                  label="Значение"
                  v-model="element.value"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>

          <template v-slot:prepend>
            <v-chip class="ma-2">
              {{ element.order }}
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
import { PluginType } from "@/__generated__/graphql";
import { usePluginStore } from "@/store/plugin";
import { useTaskStore } from "@/store/task";
import { storeToRefs } from "pinia";
import { computed, defineComponent, watch } from "vue";
import draggable from "vuedraggable";

export default defineComponent({
  components: {
    draggable,
  },
  setup() {
    const { taskGraphInput } = storeToRefs(useTaskStore());
    const condition = computed({
      get() {
        return taskGraphInput.value.condition;
      },
      set(value) {
        for (let i = 0; i < value.length; i++) {
          value[i].order = i + 1;
        }
        taskGraphInput.value.condition = value;
      },
    });

    useTaskStore().$subscribe((mutation, state) => {
      if (mutation.events.key !== "description") {
        const condition = state.taskGraphInput.condition;
        let description =
          "Постройте граф, который удовлетворяет следующим условиям";
        for (let i = 0; i < condition.length; i++) {
          const c = condition[i];
          const conditionDescription =
            c?.pluginType === PluginType.GraphCharacteristic
              ? '"' + c?.mistakeText + '"' + " " + c?.sign + " " + c?.value
              : c?.value + ' "' + c?.mistakeText + '"';
          description += "\n" + (i + 1) + ". " + conditionDescription;
        }
        taskGraphInput.value.description = description;
      }
    });

    return {
      condition,
      taskGraphInput,
    };
  },
  methods: {
    isCharacteristic(pluginType: PluginType) {
      if (pluginType === PluginType.GraphCharacteristic) {
        return true;
      } else {
        return false;
      }
    },
    deletePlugin(order: any) {
      const tmpCondition = this.taskGraphInput.condition.filter(
        (c) => c?.order !== order,
      );
      for (let i = 0; i < tmpCondition.length; i++) {
        tmpCondition[i].order = i + 1;
      }
      this.taskGraphInput.condition = tmpCondition;
    },
  },
});
</script>
