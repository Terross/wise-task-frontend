<template>
  <v-card>
    <template v-slot:text>
      <v-row>
        <v-text-field
          v-model="search"
          label="Поиск"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
        ></v-text-field>
        <v-btn class="ma-2" @click="addPlugin" icon="mdi-plus"> </v-btn>
      </v-row>
    </template>
    <v-data-table
      :headers="headers"
      :search="search"
      :items="getFilteredPlugins"
      :group-by="groupBy"
    >
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="editPlugin(item)">
          mdi-pencil
        </v-icon>
        <v-icon class="me-2" size="small" @click="deletePlugin(item)">
          mdi-delete
        </v-icon>
        <v-icon class="me-2" size="small" @click="approvePlugin(item)">
          mdi-check-decagram
        </v-icon>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { DELETE_PLUGIN, VALIDATE_PLUGIN } from "@/api/Mutations";
import { usePluginStore } from "@/store/plugin";
import { useMutation } from "@vue/apollo-composable";
import { storeToRefs } from "pinia";
import { defineComponent, Plugin, ref } from "vue";

export default defineComponent({
  setup() {
    const { getFilteredPlugins, plugins, dialog, pluginInput } =
      storeToRefs(usePluginStore());
    const headers = [
      { key: "name", title: "Название" },
      { key: "description", title: "Описание" },
      { key: "category", title: "Категория" },
      { key: "isValid", title: "Одобрен" },
      { key: "graphType", title: "Тип графа" },
      { key: "actions", title: "Действия", sortable: false },
    ];
    const search = ref("");
    const groupBy = [
      {
        key: "category",
        order: "asc",
      },
    ];
    return {
      getFilteredPlugins,
      headers,
      search,
      groupBy,
      dialog,
      pluginInput,
      plugins,
    };
  },
  methods: {
    editPlugin(plugin: Plugin) {
      this.pluginInput = {
        id: plugin.id,
        name: plugin.name,
        description: plugin.description,
        category: plugin.category,
        graphType: plugin.graphType,
        pluginType: plugin.pluginType,
      };
      this.dialog = true;
    },
    deletePlugin(plugin: Plugin) {
      const { mutate, onDone, onError } = useMutation(DELETE_PLUGIN);
      const request = {
        id: plugin.id,
      };
      mutate(request);
      onDone((response) => {
        this.plugins = this.plugins.filter((item) => {
          return item.id !== plugin.id;
        });
      });

      onError(({ graphQLErrors }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message }) => {
            console.error(message);
          });
        }
      });
    },
    approvePlugin(plugin: Plugin) {
      const { mutate, onDone, onError } = useMutation(VALIDATE_PLUGIN);
      const request = {
        id: plugin.id,
      };
      mutate(request);
      onDone((response) => {
        const index = this.plugins.findIndex((item) => {
          return item.id === plugin.id;
        });
        this.plugins = [
          ...this.plugins.slice(0, index),
          { ...this.plugins[index], isValid: true },
          ...this.plugins.slice(index + 1),
        ];
        console.log(123);
      });

      onError(({ graphQLErrors }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message }) => {
            console.error(message);
          });
        }
      });
    },
    addPlugin() {
      this.dialog = true;
    },
  },
});
</script>
