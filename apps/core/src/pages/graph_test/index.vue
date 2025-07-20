<script lang="ts">
import { defineComponent, ref } from "vue";
import ReactMicrofrontendWrapper from '@/shared/wrappers/reactWrapper.vue';


export default defineComponent({
  components: {
    ReactMicrofrontendWrapper,
  },
  setup() {
    const expanded = ref(true);
    const pinned = ref(true);

    const handleMouseEnter = () => {
      if (!pinned.value) {
        expanded.value = true;
      }
    };

    const handleMouseLeave = () => {
      if (!pinned.value) {
        expanded.value = false;
      }
    };

    const togglePin = () => {
      pinned.value = !pinned.value;
      if (!pinned.value) {
        expanded.value = false;
      } else {
        expanded.value = true;
      }
    };

    return {
      expanded,
      pinned,
      handleMouseEnter,
      handleMouseLeave,
      togglePin,
      loadReactApp: () => import('graph/App')
    };
  },
});
</script>

<template>
  <ReactMicrofrontendWrapper :loadComponent="loadReactApp" />

</template>