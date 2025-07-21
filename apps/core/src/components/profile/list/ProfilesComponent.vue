<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" sm="9">
        <v-card>
          <profiles-table-component></profiles-table-component>
        </v-card>
      </v-col>
      <v-col cols="12" sm="3">
        <profile-filter-component></profile-filter-component>
      </v-col>
    </v-row>
  </v-container>
  
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
      
  },
})
</script>
