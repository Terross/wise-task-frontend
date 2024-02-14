<template>
  <v-card>
    <v-card-title>Карточка профиля</v-card-title>
    <v-card-text>{{ result }}</v-card-text>
  </v-card>
</template>

<script lang="ts">
import { watch } from 'fs'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    profile: Object
  },
  setup(props) {
    const result = computed(() => props.profile)
    return { result }
  },
})
</script>
