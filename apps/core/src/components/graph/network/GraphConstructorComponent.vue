<template>
  <v-card :min-height="height">
		<v-network-graph
			class="graph"
			:nodes="activeGraph.nodes"
			:edges="activeGraph.edges"
			:layouts="activeGraph.layouts"
			:configs="configs"
		>
		<template
			#override-node-label="{
				scale, text, x, y, config, textAnchor, dominantBaseline
			}"
			>
			<text
				x="0"
				y="0"
				:font-size="9 * scale"
				text-anchor="middle"
				dominant-baseline="central"
				fill="#ffffff"
			>{{ text.weight }}</text>
			<text
				x="0"
				y="0"
				:font-size="config.fontSize * scale"
				:text-anchor="textAnchor"
				:dominant-baseline="dominantBaseline"
				:fill="config.color"
				:transform="`translate(${x} ${y})`"
			>{{ text.label }}</text>
			</template>
		</v-network-graph>
	</v-card>
</template>

<script lang="ts">
import { useGraphStore } from '@/store/graph';
import { storeToRefs } from 'pinia';
import { defineComponent, computed } from 'vue'
import { configs } from "@/components/graph/network/helper/graphConfig"
import { useDisplay } from 'vuetify/lib/framework.mjs';


export default defineComponent({
	setup() {
		const { activeGraph } = storeToRefs(useGraphStore())
		const { name } = useDisplay()
		const height = computed(() => {
			switch (name.value) {
					case 'xs': return 220
					case 'sm': return 400
					case 'md': return 500
					case 'lg': return 600
					case 'xl': return 800
					case 'xxl': return 1200
				}
		})
		return {
			activeGraph,
			configs,
			height
		}
	},
})
</script>
