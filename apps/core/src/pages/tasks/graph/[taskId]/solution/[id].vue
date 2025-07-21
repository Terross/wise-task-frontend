<template>
    <solution-graph-component :id="id" :taskId="taskId"></solution-graph-component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    data () {
        return {
            id: this.$route.params.id,
            taskId: this.$route.params.taskId
        }
    }
})
</script>
