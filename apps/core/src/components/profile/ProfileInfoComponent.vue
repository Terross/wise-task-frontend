<template>
  <v-skeleton-loader
          v-if="loading"
          class="mx-auto border"
          type="card"
  ></v-skeleton-loader>
  <v-card v-if="!loading">
    <v-card-title>Карточка профиля</v-card-title>
    <v-card-text v-if="profile">
      <v-list :items="items"></v-list>
    </v-card-text>
    <v-card-actions>
      <v-row justify="center" align="center">
        <v-col cols="auto">
          <v-btn
            color="primary"
            @click="updateProfileClick"
            variant="outlined">Редактировать</v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
  <profile-dialog-component
    v-bind:dialog="dialog"
    v-bind:profile="profileModel"
    @hideDialog="dialog = false"></profile-dialog-component>
</template>

<script lang="ts">
import { Role } from '@/__generated__/graphql'
import { computed, defineComponent, reactive, ref, toRefs } from 'vue'

export default defineComponent({
  props: {
    profile: Object,
    loading: Boolean
  },
  setup(props) {
    const { profile } = toRefs(props)
    const items = computed(() => {
      if (profile.value) {
        const result = []
        result.push(
          {
            title: "Имя: " + profile.value.firstName,
            value: 1,
          },
          {
            title: "Фамилия: " + profile.value.lastName,
            value: 2,
          },
          {
            title: "Отчество: " + profile.value.patronymic,
            value: 3,
          },
          {
            title: "Email: " + profile.value.email,
            value: 4,
          },
          {
            title: "Роль: " + profile.value.profileRole,
            value: 5,
          }
        )
        if (profile.value.profileRole === Role.Student) {
          result.push(
            {
              title: "Группа: " + profile.value.studentGroup,
              value: 6,
            }
          )
        }
        console.log(profile.value.profileRole === Role.Student)
        return result
      } else {
        return []
      }
    })
    const dialog = ref(false)
    const profileModel = reactive({ ...profile.value })
    return { 
      profile,
      items, 
      dialog, 
      profileModel
     }
  },
  methods: {
    updateProfileClick() {
      this.dialog = !this.dialog
      Object.assign(this.profileModel, { ...this.profile })
    }
  }
})
</script>
