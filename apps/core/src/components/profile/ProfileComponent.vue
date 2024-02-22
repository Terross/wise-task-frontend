<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <profile-info-component 
          v-bind:profile="result" 
          v-bind:loading="loading"
          @updateProfile="updateProfile1"></profile-info-component>
      </v-col>
      <v-col cols="8">
        <v-row>
          <v-col cols="12">
            <profile-task-component v-bind:profile="result" v-bind:loading="loading"></profile-task-component>
          </v-col>         
          <v-col cols="12">
            <profile-solutions-component v-bind:profile="result" v-bind:loading="loading"></profile-solutions-component>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, defineEmits } from 'vue'
import { GET_PROFILE } from '@/api/Queries'
import { useQuery } from '@vue/apollo-composable'
import { useProfileStore } from '@/store/profile'
import { Profile } from '@/__generated__/graphql'

export default defineComponent({
  setup(props) {
    const { result, onResult, loading, error } = useQuery(GET_PROFILE, { id: props.id })
    onResult(result => {
      if (result.data) {
        useProfileStore().currentUser = result.data.getProfile
      }
    })
    return {
      result,
      loading,
      error
    }
  },
  props: ["id"],
  methods: {
    updateProfile1(profile: Profile) {
      console.log(12344)
      this.result = profile
    }
  }
})
</script>
