<template>
  <v-container>
    <v-row>
      <v-col v-if="taskGraphConstructorInfo.isGraphPresent">
        <Graph
          :style="{
            width: '100%',
            height: '100%',
            border: '1px solid black',
            boxSizing: 'border-box',
          }"
        />
      </v-col>
      <v-col>
        <v-textarea
          variant="outlined"
          auto-grow
          v-model="taskTextModel"
        ></v-textarea>
        <task-condition-component></task-condition-component>
        <task-graph-plugin-table-component></task-graph-plugin-table-component>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { usePluginStore } from "@/store/plugin";
import { storeToRefs } from "pinia";
import { useQuery } from "@vue/apollo-composable";
import { GET_ALL_PLUGINS } from "@/api/Queries";
import { useTaskStore } from "@/store/task";
import Graph from "@/features/graph/ui/graph/Graph.vue";

export default defineComponent({
  components: { Graph },
  setup() {
    const { plugins } = storeToRefs(usePluginStore());
    const { onResult } = useQuery(GET_ALL_PLUGINS);
    const { taskGraphInput, taskGraphConstructorInfo } =
      storeToRefs(useTaskStore());
    onResult((response) => {
      if (response.data) {
        plugins.value = response.data.getAllPlugins;
      }
    });

    const taskTextModel = computed({
      get() {
        return taskGraphInput.value.description;
      },
      set(value) {
        taskGraphInput.value.description = value;
      },
    });

    return {
      taskTextModel,
      taskGraphConstructorInfo,
    };
  },
});
</script>
