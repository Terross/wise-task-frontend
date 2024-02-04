<template>
    <v-data-table 
      v-if="!loading"
      :headers="headers"
      :items="profileStore.getFilteredProfiles"
      density="compact"
      >
        <template v-slot:item.patronymic="{ value }">
            {{ value.length === 0 ? '-' : value }}
        </template>
        <template v-slot:item.studentGroup="{ value }">
            {{ value.length === 0 ? '-' : value }}
        </template>
        <template v-slot:item.profileRole="{ value }">
            {{ mapRole(value) }}
        </template>
    </v-data-table>
  </template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import { useProfileStore } from '@/store/profile'
import { useQuery } from '@vue/apollo-composable'
import { GET_ALL_PROFILES_QUERY } from '@/api/Queries'
import { Role } from '@/common/Role'
import { getKeyByValue } from '@/common/Role'

export default defineComponent({ 
  beforeMount() {
    console.log(getKeyByValue('ADMIN'))
    const { onResult } = useQuery(GET_ALL_PROFILES_QUERY)

    onResult(queryResult => {
      this.loading = queryResult.loading
      if (!queryResult.loading) {
        this.profileStore.userList = queryResult.data.getAllProfiles
      }
    })
    
  },
  data () {
      return {
          profileStore: useProfileStore(),
          loading: true,
          Role: Role,
          headers: [
            { title: 'Имя', align: 'start', key: 'firstName' },
            { title: 'Фамилия', align: 'start', key: 'lastName' },
            { title: 'Отчество', align: 'start', key: 'patronymic' },
            { title: 'Группа', align: 'start', key: 'studentGroup' },
            { title: 'E-mail', align: 'start', key: 'email' },
            { title: 'Роль', align: 'start', key: 'profileRole' },
          ]
      }
  },
  methods: {
    mapRole(role: string) {
      return getKeyByValue(role)
    }
  }
    
})
</script>