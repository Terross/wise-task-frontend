<template>
    <div>{{ id }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: ["id"]
})
</script>
