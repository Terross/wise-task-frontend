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
import { defineComponent, ref, onMounted } from "vue";
import { useProfileStore } from "@/store/profile";
import { UserStorageGetters } from "@/entities/user/storage/getters";
import { getUserFromToken } from "@/entities/user/lib/getUserFromToken";

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
    const groupBy = [
      {
        key: "category",
        order: "asc",
      },
    ];

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
