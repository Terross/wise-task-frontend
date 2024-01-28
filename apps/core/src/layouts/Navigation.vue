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
          @click="showTaskConstructor"></v-list-item>
        <v-list-item 
          prepend-icon="mdi-pen" 
          title="Задачи" 
          value="supervisors"
          @click="showTaskList"></v-list-item>
        <v-list-item 
          prepend-icon="mdi-toy-brick-plus"
          title="Модули"
          value="module"
          @click="showModuleList"></v-list-item>
        <v-list-item
          prepend-icon="mdi-face-man-profile" 
          title="Пользователи" 
          value="profile"
          @click="showProfileList"></v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  props: ['drawer'],
  methods: {
    showTaskConstructor() {
      this.$router.push('/taskconstructor')
    },
    showTaskList() {
      this.$router.push('/tasks')
    },
    showModuleList() {
      this.$router.push('/modules')
    },
    showProfileList() {
      this.$router.push('/profiles')
    }
  }
})
</script>
