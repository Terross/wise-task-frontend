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
    <v-card-actions v-if="isUserAdmin">
      <v-row justify="center" align="center">
        <v-col cols="auto">
          <v-btn
              color="primary"
              @click="updateProfileClick"
              variant="outlined"
          >Редактировать</v-btn
          >
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>

  <profile-dialog-component
      v-if="dialog"
      :dialog="dialog"
      :profile="profileModel"
      @hideDialog="dialog = false"
  ></profile-dialog-component>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref} from 'vue'
import ProfileDialogComponent from "@/components/profile/ProfileDialogComponent.vue"
import {useProfileStore} from "@/store/profile";
import {UserStorageGetters} from "@/entities/user/storage/getters";
import {getUserFromToken} from "@/entities/user/lib/getUserFromToken";

export default defineComponent({
  components: { ProfileDialogComponent },
  props: {
    profile: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const dialog = ref(false)
    const profileModel = ref({ ...props.profile })
    const profileStore = useProfileStore();
    const items = computed(() => {
      if (props.profile) {
        return [
          {
            title: "Имя: " + props.profile.firstName,
            value: 1,
          },
          {
            title: "Фамилия: " + props.profile.lastName,
            value: 2,
          },
          {
            title: "Отчество: " + props.profile.patronymic,
            value: 3,
          },
          {
            title: "Email: " + props.profile.email,
            value: 4,
          },
          {
            title: "Роль: " + props.profile.profileRole,
            value: 5,
          }
        ]
      }
      return []
    })

    onMounted(async () => {
      if (!profileStore.activeUser) {
        const token = await UserStorageGetters.getToken();
        if (token) {
          profileStore.activeUser = await getUserFromToken(token);
        }
      }
    });

    const isUserAdmin = computed(() => {
      return profileStore.activeUser?.role === "ADMIN"
    })

    const updateProfileClick = () => {
      dialog.value = true
      profileModel.value = { ...props.profile }
    }

    return {
      items,
      dialog,
      profileModel,
      updateProfileClick,
      isUserAdmin
    }
  }
})
</script>