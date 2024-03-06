<template>
	<v-card max-width="444">
		<v-card-title>{{ graph.name }}</v-card-title>
		<v-card-text>
			<v-network-graph
				class="graph"
				:nodes="graph.nodes"
				:edges="graph.edges"
				:layouts="graph.layouts"
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
		</v-card-text>
	</v-card>
	
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, toRefs } from 'vue'
import { configs } from "@/components/graph/network/helper/graphConfig"

export default defineComponent({
	props: {
		graph: Object
	},
	setup(props) {
		const { graph } = toRefs(props)
		return {
			graph,
			configs
		}
	},
})
</script>