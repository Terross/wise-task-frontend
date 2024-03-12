import { addLayout, addNode } from '@/components/graph/network/helper/graph';
import * as vNG from "v-network-graph"
import { Ref, computed, ref, watch } from "vue";
import { storeToRefs } from 'pinia';
import { ConstructionMode, useGraphStore } from '@/store/graph';


const { activeGraph, constructorGraphState } = storeToRefs(useGraphStore())

export function createEventHandlers(
    graph: Ref<vNG.Instance | undefined>,

) {
    const eventHandlers: vNG.EventHandlers = {
        "view:click": ({ event }) => {
            console.log(constructorGraphState.value.mode)
            if (constructorGraphState.value.mode === ConstructionMode.DRAW) {
                if (!graph.value) return
                const nextNodeIndex = ref(Object.keys(activeGraph.value.nodes).length + 1)
                const nextEdgeIndex = ref(Object.keys(activeGraph.value.edges).length + 1)
                const nodeId = nextNodeIndex.value
                const edgeId = nextEdgeIndex.value
                const point = { x: event.offsetX, y: event.offsetY }
                const svgPoint = graph.value.translateFromDomToSvgCoordinates(point)
                addNode({
                    id: nextNodeIndex.value,
                    color: "BLUE",
                    label: '',
                    weight: ''
                }, activeGraph.value.nodes)
                addLayout({
                    x: svgPoint.x,
                    y: svgPoint.y,
                    nodeId: nodeId
                }, activeGraph.value.layouts)
            }
        }
    }

    return {
        eventHandlers
    }
}
