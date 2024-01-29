<template>
    <v-table v-if="!loading">
      <thead>
        <tr>
          <th class="text-left">
            Имя
          </th>
          <th class="text-left">
            Фамилия
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in profileStore.userList"
          :key="user.firstName"
        >
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
        </tr>
      </tbody>
    </v-table>
  </template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { mapStores } from 'pinia'
import { useProfileStore } from '@/store/profile'
import { useQuery } from '@vue/apollo-composable'
import { GET_ALL_PROFILES_QUERY } from '@/api/Queries'

export default defineComponent({ 
  
  beforeMount() {
    
    const { onResult } = useQuery(GET_ALL_PROFILES_QUERY)

    onResult(queryResult => {
      this.loading = queryResult.loading
      if (!queryResult.loading) {
        console.log(this.profileStore)
        this.profileStore.userList = queryResult.data.getAllProfiles
      }
      console.log(queryResult.networkStatus)
    })
    
  },
  data () {
      return {
          profileStore: useProfileStore(),
          loading: true
      }
  },
    
})
</script>