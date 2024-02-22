<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <profile-info-component 
          v-bind:profile="profile" 
          v-bind:loading="loading"></profile-info-component>
      </v-col>
      <v-col cols="8">
        <v-row>
          <v-col cols="12">
            <profile-task-component v-bind:profile="profile" v-bind:loading="loading"></profile-task-component>
          </v-col>         
          <v-col cols="12">
            <profile-solutions-component v-bind:profile="profile" v-bind:loading="loading"></profile-solutions-component>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { GET_PROFILE } from '@/api/Queries'
import { useQuery } from '@vue/apollo-composable'
import { useProfileStore } from '@/store/profile'
import { storeToRefs } from 'pinia'


export default defineComponent({
  setup(props) {
    const { onResult, loading, error } = useQuery(GET_PROFILE, { id: props.id })
    const { currentUser } = storeToRefs(useProfileStore())
    const profile = computed(() => currentUser)
    onResult(response => {
      if (response.data) {
        useProfileStore().currentUser = response.data.getProfile
      }
    })
    return {
      profile,
      loading,
      error
    }
  },
  props: ["id"]
})
</script>
