<template>
  <v-card :min-height="size">
    <v-network-graph
        :style="graphStyle"
        :nodes="graph.nodes"
        :edges="graph.edges"
        :layouts="graph.layouts"
        :configs="configs"
    >
      <template #override-node-label="{ nodeId, scale, x, y, config, textAnchor, dominantBaseline }">
        <text
            x="0"
            y="0"
            :font-size="9 * scale"
            text-anchor="middle"
            dominant-baseline="central"
            fill="#ffffff"
        >{{ graph?.nodes[nodeId]?.weight }}</text>
        <text
            x="0"
            y="0"
            :font-size="config.fontSize * scale"
            :text-anchor="textAnchor"
            :dominant-baseline="dominantBaseline"
            :fill="config.color"
            :transform="`translate(${x} ${y})`"
        >{{ graph?.nodes[nodeId]?.label }}</text>
      </template>
      <template #edge-label="{ edgeId, ...slotProps }">
        <v-edge-label
            :text="String(graph?.edges[edgeId]?.weight)"
            align="center"
            vertical-align="below"
            v-bind="slotProps"
        />
        <v-edge-label
            :text="String(graph?.edges[edgeId]?.label)"
            align="center"
            vertical-align="above"
            v-bind="slotProps"
        />
      </template>
    </v-network-graph>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import undirectGraphConfigs, { directGraphConfigs } from "@/components/graph/network/helper/graphConfig"
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { VEdgeLabel, VNetworkGraph, Configs } from "v-network-graph";

export default defineComponent({
  name: 'GraphSolutionCardComponent',
  components: { VEdgeLabel, VNetworkGraph },
  props: {
    graph: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const { name } = useDisplay()
    const size = computed(() => {
      switch (name.value) {
        case 'xs': return 220
        case 'sm': return 400
        case 'md': return 500
        case 'lg': return 600
        case 'xl': return 800
        case 'xxl': return 1200
        default: return 500
      }
    })

    const graphStyle = computed(() => ({
      width: `${size.value}px`,
      height: `${size.value}px`,
      border: "1px solid #000"
    }))


    const configs = computed((): Configs => {
      return (props.graph?.isDirect ? directGraphConfigs : undirectGraphConfigs) as Configs
    })

    return {
      graph: computed(() => props.graph),
      configs,
      graphStyle,
      size
    }
  }
})
</script>