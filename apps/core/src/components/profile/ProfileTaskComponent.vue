<template>
  <v-skeleton-loader
    v-if="loading"
    class="mx-auto border"
    type="table"
  ></v-skeleton-loader>
  <v-card v-if="!loading">
    <v-card-title>Карточка заданий для профилей</v-card-title>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  props: {
    profile: Object,
    loading: Boolean
  },
  setup(props) {
    const profile = computed(() => props.profile)
    return { profile }
	},
})
</script>
