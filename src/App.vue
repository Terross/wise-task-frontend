<template>
  <v-app>
    <wise-task-bar></wise-task-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import WiseTaskBar from './components/basic/WiseTaskBar.vue'



export default defineComponent({
  name: 'App',
  components: {WiseTaskBar},
  data () {
    return {
      //
    }
  },
})
</script>

<style>
#app {
  font-family: "Roboto", sans-serif;
}
</style>