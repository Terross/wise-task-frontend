import { computed, Ref } from "vue"
import { storeToRefs } from "pinia"
import { useGraphStore } from '@/store/graph';


const { activeGraph } = storeToRefs(useGraphStore())


export function createInputModels(
    menuTargetNode: Ref<string>,
    menuTargetEdge: Ref<string>
) {
	const nodeLabelModel = computed({
		get() {
			return activeGraph.value.nodes[menuTargetNode.value] === undefined ? '': activeGraph.value.nodes[menuTargetNode.value].label
		},
		set(value) {
			return activeGraph.value.nodes[menuTargetNode.value].label = value
		}
	})

	const nodeWeightModel = computed({
		get() {
			return activeGraph.value.nodes[menuTargetNode.value] === undefined ? '': activeGraph.value.nodes[menuTargetNode.value].weight
		},
		set(value) {
			return activeGraph.value.nodes[menuTargetNode.value].weight = value
		}
	})

	const nodeColorModel = computed({
		get() {
			return activeGraph.value.nodes[menuTargetNode.value] === undefined ? '': activeGraph.value.nodes[menuTargetNode.value].color
		},
		set(value) {
			return activeGraph.value.nodes[menuTargetNode.value].color = value
		}
	})

	const edgeLabelModel = computed({
		get() {
			return activeGraph.value.edges[menuTargetEdge.value] === undefined ? '': activeGraph.value.edges[menuTargetEdge.value].label
		},
		set(value) {
			return activeGraph.value.edges[menuTargetEdge.value].label = value
		}
	})

	const edgeWeightModel = computed({
		get() {
			return activeGraph.value.edges[menuTargetEdge.value] === undefined ? '': activeGraph.value.edges[menuTargetEdge.value].weight
		},
		set(value) {
			return activeGraph.value.edges[menuTargetEdge.value].weight = value
		}
	})

	const edgeColorModel = computed({
		get() {
				return activeGraph.value.edges[menuTargetEdge.value] === undefined ? '': activeGraph.value.edges[menuTargetEdge.value].color
		},
		set(value) {
				return activeGraph.value.edges[menuTargetEdge.value].color = value
		}
	})

	return {
			nodeLabelModel,
			nodeWeightModel,
			nodeColorModel,
			edgeLabelModel,
			edgeWeightModel,
			edgeColorModel
	}
}