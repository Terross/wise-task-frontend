<template>
    <profile-component :id="id"></profile-component>
</template>

<script lang="ts">
import ProfileComponent from '@/components/profile/ProfileComponent.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { ProfileComponent },
    data () {
        return {
            id: this.$route.params.id
        }
    }
})
</script>
