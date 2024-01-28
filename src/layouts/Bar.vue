<template>
    <v-app-bar
        color="primary"
        density="compact"
      >
      <template v-slot:prepend>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer">
          
        </v-app-bar-nav-icon>
        
      </template>

      <v-app-bar-title>WiseTasks</v-app-bar-title>
      <v-btn
        v-if="activeUser != null"
        density="comfortable"
        icon="mdi-login"
        @click="login"
        >
      </v-btn>
      <v-btn
        v-if="activeUser != null"
        density="comfortable"
        icon="mdi-login"
        @click="login"
        >
      </v-btn>
    </v-app-bar>
    <navigation :drawer="drawer"></navigation>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { useProfileStore } from '@/store/profile'
import { mapState } from 'pinia'
import Navigation from './Navigation.vue'


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
    login() {
      this.$router.push('/auth/signin')
    },
    toSelfProfile() {
      this.$router.push('/auth/signin') //TODO: redirect to self profile page
    }
  }
})
</script>
