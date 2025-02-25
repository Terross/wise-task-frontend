import {defineStore} from "pinia";
import {Node} from "@/features/graph/types/Node";


interface NodesStoreState {
    nodes: Node[]
}


export const useNodeStore = defineStore("nodes", {
    state: (): NodesStoreState => ({
        nodes: [{
            id: '1',
            position: { x: 250, y: 5 },
            data: { label: 'Node 1' },
            type: "special"
        }]
    }),
    actions: {
        addNode(): void {
            setTimeout(() => {}, 1)
            const id: string = Date.now().toString()
            this.nodes.push({id: id, position: {x: 0, y: 0}, type: "special", data: {label: "Новая вершина"}})
        },
    }
})