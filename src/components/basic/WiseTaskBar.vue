<template>
    <v-app-bar
        color="primary"
        density="compact"
      >
        <template v-slot:prepend>
          <v-app-bar-nav-icon></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title>WiseTasks</v-app-bar-title>
        <v-btn
          density="comfortable"
          icon="mdi-login"
          @click="login"
          >

        </v-btn>
      </v-app-bar>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
    methods: {
      login() {
        this.$router.push('/signin')
      }
    }
})
</script>
