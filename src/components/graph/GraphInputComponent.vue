<template>
  <v-card>
    <v-card-title>Добавление графа</v-card-title>
    <v-card-text>
      <v-text-field label="Название графа" v-model="name"> </v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="saveGraph">Добавить</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { useGraphStore } from "@/store/graph";
import { storeToRefs } from "pinia";
import { defineComponent, computed, onMounted } from "vue";
import { toGraph } from "./network/helper/graph";
import { CREATE_GRAPH } from "@/api/Mutations";
import { useMutation } from "@vue/apollo-composable";
import { useNodeStore } from "@/features/graph/stores/nodes";
import { convertToGqlFormat } from "@/features/graph/lib/convertToGqlFormat";

export default defineComponent({
  setup() {
    const { graphLibrary } = storeToRefs(useGraphStore());
    const graph = useNodeStore();
    const name = computed({
      get() {
        return graph.$state.name;
      },
      set(value) {
        graph.$state.name = value;
      },
    });
    return {
      name,
      graph,
      graphLibrary,
    };
  },
  methods: {
    saveGraph() {
      if (!this.graph.$state.id) {
        this.graph.$state.id = self.crypto.randomUUID();
      }
      const graph = convertToGqlFormat(this.graph);
      const { mutate, onDone, onError } = useMutation(CREATE_GRAPH);
      const request = {
        graph: graph,
      };
      mutate(request);

      onDone((response) => {
        console.log(response);
      });

      onError(({ graphQLErrors }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message }) => {
            console.error(message);
          });
        }
      });
    },
  },
});
</script>
