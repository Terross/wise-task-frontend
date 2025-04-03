<template>
    <task-implementation-component :id="id"></task-implementation-component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data () {
        return {
            id: this.$route.params.id
        }
    }
})
</script>
