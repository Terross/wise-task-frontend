<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <profile-info-component></profile-info-component>
      </v-col>
      <v-col cols="8">
        <v-row>
          <v-col cols="12">
            <profile-task-component></profile-task-component>
          </v-col>         
          <v-col cols="12">
            <profile-solutions-component></profile-solutions-component>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  props: ["id"]
})
</script>
