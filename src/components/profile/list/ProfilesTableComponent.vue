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
      <v-icon
          v-if="isUserAdmin"
          class="me-2"
          size="small"
          @click="deleteProfile((item as Profile).id)"
      >
        mdi-delete
      </v-icon>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { defineComponent, onMounted, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useProfileStore } from '@/store/profile'
import { useMutation, useQuery } from '@vue/apollo-composable'
import { GET_ALL_PROFILES_QUERY } from '@/api/Queries'
import { Role, getKeyByValue } from '@/common/Role'
import { Profile } from '@/__generated__/graphql'
import { DELETE_PROFILE } from "@/api/Mutations"
import { UserStorageGetters } from "@/entities/user/storage/getters"
import { getUserFromToken } from "@/entities/user/lib/getUserFromToken"

export default defineComponent({
  setup() {
    const router = useRouter()
    const profileStore = useProfileStore()

    const { loading, onResult } = useQuery(GET_ALL_PROFILES_QUERY)

    const headers = [
      { title: 'Имя', align: 'start' as const, key: 'firstName' },
      { title: 'Фамилия', align: 'start' as const, key: 'lastName' },
      { title: 'Отчество', align: 'start' as const, key: 'patronymic' },
      { title: 'E-mail', align: 'start' as const, key: 'email' },
      { title: 'Роль', align: 'start' as const, key: 'profileRole' },
      { title: 'Действия', align: 'start' as const, key: 'actions', sortable: false }
    ]

    onResult(queryResult => {
      if (!queryResult.loading) {
        profileStore.userList = queryResult.data.getAllProfiles
      }
    })

    onMounted(async () => {
      if (!profileStore.activeUser) {
        const token = await UserStorageGetters.getToken()
        if (token) {
          profileStore.activeUser = await getUserFromToken(token)
        }
      }
    })

    const isUserAdmin = computed(() => {
      return profileStore.activeUser?.role === "ADMIN"
    })

    const mapRole = (role: string) => {
      return getKeyByValue(role)
    }

    const toProfile = (id: string) => {
      router.push('/profiles/' + id)
    }

    const deleteProfile = async (id: string) => {
      try {
        const { mutate } = useMutation(DELETE_PROFILE)
        await mutate({ id: id })
        profileStore.userList = profileStore.userList.filter(
            (profile: Profile) => profile.id !== id
        )
      } catch(error) {
        console.error("Ошибка при удалении профиля:", error)
      }
    }

    return {
      profileStore,
      loading,
      headers,
      isUserAdmin,
      mapRole,
      toProfile,
      deleteProfile,
      Role
    }
  }
})
</script>