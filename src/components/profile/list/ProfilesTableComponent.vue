<template>
  <v-data-table
      v-if="!loading"
      :headers="headers"
      :items="profileStore.getFilteredProfiles"
      density="compact"
  >
    <template v-slot:item.patronymic="{ value }">
      {{ (value as string)?.length === 0 ? '-' : value }}
    </template>
    <template v-slot:item.studentGroup="{ value }">
      {{ (value as string)?.length === 0 ? '-' : value }}
    </template>
    <template v-slot:item.profileRole="{ value }">
      {{ mapRole(value as string) }}
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
          size="small"
          @click="toProfile((item as Profile).id)"
      >
        mdi-eye
      </v-icon>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useProfileStore } from '@/store/profile'
import { useQuery } from '@vue/apollo-composable'
import { GET_ALL_PROFILES_QUERY } from '@/api/Queries'
import { Role, getKeyByValue } from '@/common/Role'
import type { Profile } from '@/__generated__/graphql'

export default defineComponent({
  setup() {
    const profileStore = useProfileStore()

    const { loading, onResult } = useQuery(GET_ALL_PROFILES_QUERY)

    onResult(queryResult => {
      if (!queryResult.loading) {
        profileStore.userList = queryResult.data.getAllProfiles
      }
    })

    return {
      profileStore,
      loading
    }
  },
  data () {
    return {
      Role,
      headers: [
        { title: 'Имя', align: 'start' as const, key: 'firstName' },
        { title: 'Фамилия', align: 'start' as const, key: 'lastName' },
        { title: 'Отчество', align: 'start' as const, key: 'patronymic' },
        { title: 'E-mail', align: 'start' as const, key: 'email' },
        { title: 'Роль', align: 'start' as const, key: 'profileRole' },
        { title: '', align: 'start' as const, key: 'actions', sortable: false }
      ] as const
    }
  },
  methods: {
    mapRole(role: string) {
      return getKeyByValue(role)
    },
    toProfile(id: string) {
      this.$router.push('/profiles/' + id)
    }
  }
})
</script>