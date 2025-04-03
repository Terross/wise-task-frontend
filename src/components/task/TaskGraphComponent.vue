<template>
  <v-container>
    <v-row>
      <v-col>
        <Graph :style="{ width: '100%', border: '1px solid black' }" />
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>{{ activeTask.name }}</v-card-title>
          <v-card-text
            class="text-pre-wrap"
            v-html="formatDescription(activeTask.description)"
          >
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" variant="outlined" @click="solveTask">
              Отправить решение
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-alert
          v-model="successAlert"
          text="Задача решена верно"
          title="Успех!"
          type="success"
          closable
          variant="tonal"
        ></v-alert>
        <v-alert
          v-model="errorAlert"
          text="В решении есть ошибка"
          title="Ошибка!"
          type="error"
          closable
          variant="tonal"
        ></v-alert>
        <v-card v-if="errorAlert">
          <v-card-title>Ошибки в модулях</v-card-title>
          <v-card-text>
            <v-list lines="one">
              <v-list-item
                v-for="(item, i) in result"
                :key="i"
                :title="i + 1 + '. ' + item.mistakeText + ' = ' + item.value"
              ></v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { SOLVE_TASK_GRAPH } from "@/api/Mutations";
import { GET_TASK } from "@/api/Queries";
import { useGraphStore } from "@/store/graph";
import { useTaskStore } from "@/store/task";
import { useMutation, useQuery } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";
import { toGraph } from "../graph/network/helper/graph";
import { PluginResult } from "@/__generated__/graphql";
import Graph from "@/features/graph/ui/Graph.vue";
import { useNodeStore } from "@/features/graph/stores/nodes";
import { convertToGqlFormat } from "@/features/graph/lib/convertToGqlFormat";

export default defineComponent({
  components: { Graph },
  setup(props) {
    const { activeTask } = storeToRefs(useTaskStore());
    const { onResult } = useQuery(GET_TASK, { id: props.id });
    const activeGraph = useNodeStore();
    onResult((response) => {
      if (response.data) {
        activeTask.value = response.data.getTask;
      }
    });

    return {
      activeTask,
      activeGraph,
    };
  },
  data() {
    return {
      successAlert: false,
      errorAlert: false,
      result: [],
    };
  },
  props: ["id"],
  methods: {
    solveTask() {
      const { mutate, onDone, onError } = useMutation(SOLVE_TASK_GRAPH);
      const graph = convertToGqlFormat(this.activeGraph);
      graph.id = self.crypto.randomUUID();
      const request = {
        solution: {
          id: self.crypto.randomUUID(),
          taskId: this.activeTask.id,
          authorId: "00000000-0000-0000-0000-000000000000",
          graph: graph,
        },
      };
      mutate(request);

      onDone((response) => {
        if (response.data.solveTaskGraph.isCorrect) {
          this.successAlert = true;
          this.errorAlert = false;
          this.$emit("isCorrect", true);
        } else {
          this.errorAlert = true;
          this.successAlert = false;
          const pluginResults =
            response.data.solveTaskGraph.pluginResults.filter(
              (item: PluginResult) => {
                return !item.isCorrect;
              }
            );
          if (this.activeTask.isHiddenMistake) {
            this.result = pluginResults[0];
          } else {
            this.result = pluginResults;
          }
          for (let i = 0; i < this.result.length; i++) {
            const mistakeText = this.activeTask.condition.find(
              (element: string) => {
                return element.pluginId === this.result[i].pluginId;
              }
            ).mistakeText;
            this.result[i]["mistakeText"] = mistakeText;
          }
        }
        // this.alert = true
      });

      onError(({ graphQLErrors }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message }) => {
            console.error(message);
          });
        }
      });
    },
    formatDescription(description: string) {
      if (!description) return "";

      const urlRegex = /(https?:\/\/[^\s]+)/g;

      return description.replace(urlRegex, (url) => {
        const escapedUrl = url
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");

        return `<a href="${escapedUrl}" target="_blank" rel="noopener noreferrer">${escapedUrl}</a>`;
      });
    },
  },
});
</script>

<style scoped></style>
