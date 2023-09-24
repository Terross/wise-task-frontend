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
          v-for="user in users.userList"
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
import { provideApolloClient } from "@vue/apollo-composable";
import gql from 'graphql-tag'
import { ApolloClient, InMemoryCache } from '@apollo/client/core'


export default defineComponent({ 
  
  beforeMount() {
    const GET_ALL_PROFILES_QUERY = gql`
            {
                getAllProfiles {
                    id
                    email
                    profilePassword
                    firstName
                    lastName
                    patronymic
                    profileRole
                    studentGroup
                    studentCourse
                }
            }
            `

    const cache = new InMemoryCache()

    const apolloClient = new ApolloClient({
      cache,
      uri: 'http://localhost:8084/graphql',
    })

    const { onResult } = provideApolloClient(apolloClient)(() => useQuery(GET_ALL_PROFILES_QUERY))

    onResult(queryResult => {
      this.loading = queryResult.loading
      if (!queryResult.loading) {
        this.users.userList = queryResult.data.getAllProfiles
      }
      console.log(queryResult.networkStatus)
    })
    
  },
  computed: {
      ...mapStores(useProfileStore)
  },
  data () {
      return {
          users: useProfileStore(),
          loading: true
      }
  },
    
})
</script>
