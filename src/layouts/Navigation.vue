<template>
  <v-navigation-drawer
    image="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
    permanent
    v-model="drawer"
    theme="dark"
  >
    <v-list nav>
      <v-list-item
        prepend-icon="mdi-graph"
        title="Конструктор задач"
        value="inbox"
        @click="showTaskConstructor"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-pen"
        title="Задачи"
        value="supervisors"
        @click="showTaskList"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-toy-brick-plus"
        title="Плагины"
        value="plugin"
        @click="showPluginPage"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-face-man-profile"
        title="Пользователи"
        value="profile"
        @click="showProfileList"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-library"
        title="Библиотека графов"
        value="graphLibrary"
        @click="showGraphLibrary"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-file-document-outline"
        title="Материалы"
        value="materials"
        @click="showMaterialPage"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-school"
        title="Экзамен"
        value="exam"
        @click="showExamPage"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["drawer"],
  methods: {
    showTaskConstructor() {
      this.$router.push("/taskconstructor");
      this.$emit("hideMenu");
    },
    showTaskList() {
      this.$router.push("/tasks");
      this.$emit("hideMenu");
    },
    showPluginPage() {
      this.$router.push("/plugins");
      this.$emit("hideMenu");
    },
    showProfileList() {
      this.$router.push("/profiles");
      this.$emit("hideMenu");
    },
    showGraphLibrary() {
      this.$router.push("/graph/library");
      this.$emit("hideMenu");
    },
    showMaterialPage() {
      this.$router.push("/materials");
      this.$emit("hideMenu");
    },
    showExamPage() {
      this.$router.push("/exam");
      this.$emit("hideMenu");
    },
  },
});
</script>
