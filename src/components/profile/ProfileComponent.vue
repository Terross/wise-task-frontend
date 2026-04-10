<template>
  <v-container fluid>
    <v-row>
      <v-col cols="4">
        <profile-info-component
            v-if="profile"
            :profile="profile"
            :loading="loading"/>
      </v-col>
      <v-col cols="8">
        <v-row>
          <v-col cols="12">
            <profile-task-component
                v-if="profile"
                :profile="profile"
                :loading="loading"/>
          </v-col>
          <v-col cols="12">
            <profile-solutions-component
                v-if="profile"
                :profile="profile"
                :loading="loading"/>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { GET_PROFILE } from '@/api/Queries'
import { useQuery } from '@vue/apollo-composable'
import { useProfileStore } from '@/store/profile'
import { storeToRefs } from 'pinia'
import ProfileTaskComponent from "@/components/profile/ProfileTaskComponent.vue";
import ProfileSolutionsComponent from "@/components/profile/ProfileSolutionsComponent.vue";
import ProfileInfoComponent from "@/components/profile/ProfileInfoComponent.vue";

export default defineComponent({
  components: {ProfileInfoComponent, ProfileSolutionsComponent, ProfileTaskComponent},
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const profileStore = useProfileStore()
    const { currentUser } = storeToRefs(profileStore)

    const { onResult, loading } = useQuery(
        GET_PROFILE,
        { id: props.id }
    )

    onResult(response => {
      if (response.data) {
        profileStore.currentUser = response.data.getProfile
      }
    })

    return {
      profile: currentUser,
      loading
    }
  }
})
</script>