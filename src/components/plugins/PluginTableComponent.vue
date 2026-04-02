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
    <v-data-table :headers="headers" :items="displayedPlugins" :group-by="groupBy">
      <template v-slot:item.actions="{ item }">
        <v-icon class="me-2" size="small" @click="editPlugin(item)">
          mdi-pencil
        </v-icon>
        <v-icon
          v-if="isUserTeacher"
          class="me-2"
          size="small"
          @click="deletePlugin(item)"
        >
          mdi-delete
        </v-icon>
        <v-icon
          v-if="isUserTeacher"
          class="me-2"
          size="small"
          @click="approvePlugin(item)"
        >
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
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useProfileStore } from "@/store/profile";
import { UserStorageGetters } from "@/entities/user/storage/getters";
import { getUserFromToken } from "@/entities/user/lib/getUserFromToken";
import { searchPlugins, SemanticPluginWithScore } from "@/services/semanticSearchApi";
import { Plugin } from "@/__generated__/graphql";

export default defineComponent({
  setup() {
    const { getFilteredPlugins, plugins, dialog, pluginInput } =
      storeToRefs(usePluginStore());
    const profileStore = useProfileStore();
    const headers = [
      { key: "name", title: "Название" },
      { key: "description", title: "Описание" },
      { key: "category", title: "Категория" },
      { key: "isValid", title: "Одобрен" },
      { key: "graphType", title: "Тип графа" },
      { key: "actions", title: "Действия", sortable: false },
    ];
    const search = ref("");
    const searchResults = ref<Array<Plugin & { score?: number }>>([]);
    const groupBy = [
      {
        key: "category",
        order: "asc",
      },
    ];
    
    const filteredPlugins = computed(() => getFilteredPlugins.value);

    const displayedPlugins = computed(() => {
      const trimmedSearch = search.value.trim();

      if (!trimmedSearch) {
        return filteredPlugins.value;
      }

      const filteredIds = new Set(filteredPlugins.value.map((plugin) => plugin.id));

      return searchResults.value.filter((plugin) => filteredIds.has(plugin.id));
    });

    const fallbackSearch = (
      value: string,
    ): Array<Plugin & { score?: number }> => {
      const normalizedQuery = value.trim().toLowerCase();

      if (!normalizedQuery) {
        return filteredPlugins.value;
      }

      return filteredPlugins.value.filter((plugin) => {
        const haystack = [
          plugin.name,
          plugin.description ?? "",
          plugin.category ?? "",
          plugin.graphType ?? "",
          plugin.pluginType ?? "",
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      });
    };

    const mapSemanticResults = (
      results: SemanticPluginWithScore[],
    ): Array<Plugin & { score: number }> =>
      results
        .map((result) => {
          const basePlugin = plugins.value.find(
            (plugin) => plugin.id === result.id,
          );

          if (!basePlugin) {
            console.warn(
              `Plugin with id ${result.id} not found in store for semantic result`,
            );
            return null;
          }

          return { ...basePlugin, score: result.score };
        })
        .filter((plugin): plugin is Plugin & { score: number } => Boolean(plugin));

    const performSearch = async (value: string) => {
      if (!value.trim()) {
        searchResults.value = [];
        return;
      }

      try {
        const results = await searchPlugins(value.trim(), 3);
        searchResults.value = mapSemanticResults(results);
      } catch (error) {
        console.error("Semantic plugin search request failed", error);
        searchResults.value = fallbackSearch(value);
      }
    };

    let searchTimeout: number | undefined;

    watch(
      search,
      (value) => {
        if (searchTimeout) {
          window.clearTimeout(searchTimeout);
        }

        searchTimeout = window.setTimeout(() => performSearch(value), 300);
      },
      { immediate: false },
    );

    // Загружаем пользователя при инициализации компонента
    onMounted(async () => {
      if (!profileStore.activeUser) {
        const token = await UserStorageGetters.getToken();
        if (token) {
          profileStore.activeUser = await getUserFromToken(token);
        }
      }
    });

    return {
      getFilteredPlugins,
      profileStore,
      headers,
      search,
      displayedPlugins,
      groupBy,
      dialog,
      pluginInput,
      plugins,
    };
  },
  computed: {
    isUserTeacher(): boolean {
      return this.profileStore.activeUser?.role === "TEACHER";
    },
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
    async deletePlugin(plugin: Plugin) {
      try {
        const { mutate } = useMutation(DELETE_PLUGIN);
        await mutate({ id: plugin.id });
        this.plugins = this.plugins.filter((item) => item.id !== plugin.id);
      } catch (error) {
        console.error("Ошибка при удалении плагина:", error);
      }
    },
    async approvePlugin(plugin: Plugin) {
      try {
        const { mutate } = useMutation(VALIDATE_PLUGIN);
        await mutate({ id: plugin.id });

        const index = this.plugins.findIndex((item) => item.id === plugin.id);
        if (index !== -1) {
          this.plugins = [
            ...this.plugins.slice(0, index),
            { ...this.plugins[index], isValid: true },
            ...this.plugins.slice(index + 1),
          ];
        }
      } catch (error) {
        console.error("Ошибка при подтверждении плагина:", error);
      }
    },
    addPlugin() {
      this.dialog = true;
    },
  },
});
</script>
