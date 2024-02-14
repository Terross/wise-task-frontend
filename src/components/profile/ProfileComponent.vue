<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <profile-info-component v-bind:profile="result"></profile-info-component>
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
import { GET_PROFILE } from '@/api/Queries'
import { useQuery } from '@vue/apollo-composable'

export default defineComponent({
  setup(props) {
    const { result, loading, error } = useQuery(GET_PROFILE, { id: props.id })
    return {
      result,
      loading,
      error
    }
  },
  props: ["id"],
  data() {
    return {
      profileId: this.id,
      profile: null
    }
  },
})
</script>
