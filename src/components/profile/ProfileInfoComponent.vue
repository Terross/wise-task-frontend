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
    @hideDialog="dialog = false"
    @hideDialogWithUpdating="updateProfile"></profile-dialog-component>
</template>

<script lang="ts">
import { useProfileStore } from '@/store/profile'
import { Profile, Role } from '@/__generated__/graphql'
import { storeToRefs } from 'pinia'
import { computed, defineComponent, reactive, ref, defineEmits } from 'vue'

export default defineComponent({
  props: {
    profile: Object,
    loading: Boolean
  },
  setup(props) {
    const profile = computed(() => {
      if (props.profile && props.profile.getProfile) {
        return props.profile.getProfile
      } else {
        return null
      }
    })
    const items = computed(() => {
      if (profile == null) {
        return []
      } else {
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
      }
    })
    const dialog = ref(false)
    const { currentUser } = storeToRefs(useProfileStore())
    const profileModel = reactive({ ...currentUser.value })
    return { 
      profile,
      items, 
      dialog, 
      profileModel,
      currentUser
     }
  },
  methods: {
    updateProfileClick() {
      this.dialog = !this.dialog
      Object.assign(this.profileModel, { ...this.currentUser })
    },
    updateProfile(dialog: boolean, profile: Profile) {
      console.log(123)
      this.$emit("updateProfile", profile)
      this.dialog = dialog
    }
  }
})
</script>
