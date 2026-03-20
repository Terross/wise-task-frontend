<template>
    <v-app-bar
        color="primary"
        density="compact"
      >
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer">

        </v-app-bar-nav-icon>

      </template>

      <v-app-bar-title>Wise Task</v-app-bar-title>
      <v-btn
        v-if="activeUser != null"
        density="comfortable"
        icon="mdi-logout"
        @click="logout"
        >
      </v-btn>
    </v-app-bar>
    <navigation :drawer="drawer" @hideMenu="drawer = !drawer"></navigation>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { useProfileStore } from '@/store/profile'
import { mapState } from 'pinia'
import Navigation from './Navigation.vue'
import {UserStorageGetters} from "@/entities/user/storage/getters";


export default defineComponent({
  components: { Navigation },
  computed: {
    ...mapState(useProfileStore, ['activeUser'])
  },
  data () {
    return {
      drawer: false,
    }
  },
  methods: {
    logout () {
      UserStorageGetters.removeToken()
      this.activeUser = null
      this.$router.push('/auth/signin')
    },

    toSelfProfile() {
      this.$router.push('/auth/signin') //TODO: redirect to self profile page
    }
  }
})
</script>
