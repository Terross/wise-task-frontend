<template>
    <task-graph-component :id="id"></task-graph-component>
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
