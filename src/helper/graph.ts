import { Graph } from "@/__generated__/graphql"
import * as vNG from "v-network-graph"

export interface Node extends vNG.Node {
    color: string
    label?: string
    weight?: number
}

export interface Edge extends vNG.Edge {
    color: string
    label?: string
    weight?: number
}

export interface Layout {
    x: number | undefined
    y: number | undefined
    nodeId: number | undefined
}

export function toVGraph(graph: Graph, nodes: any, edges: any, layouts: any) {
    console.log(graph)
    graph.vertexList.forEach(node => {
        addNode({ 
            id: node?.id,
            color: node?.color,
            label: node?.label, 
            weight: node?.weight 
        }, nodes)
        addLayout({
            x: node?.xCoordinate,
            y: node?.yCoordinate,
            nodeId: node?.id
        }, layouts)
    });

    let edgeId = 1;
    graph.edgeList.forEach(edge => {
        addEdge({
            id: edgeId,
            color: edge?.color,
            label: edge?.label, 
            weight: edge?.weight,
            source: edge?.source,
            target: edge?.target 
        }, edges)
        edgeId++
    })
}

export function toGraph(nodes: Node[], edges: Edge[]) {
    
}

export function addNode(node: Omit<Node, "name">, nodes:any) {
    const nodeId = `node${node.id}`
    const name = node.label
    node.id = nodeId
    nodes[nodeId] = { name, ...node } as Node
}

export function addEdge(edge: Omit<Edge, "source" | "target">, edges:any) {
    const source = `node${edge.source}`
    const target = `node${edge.target}`
    const edgeId = `edge${edge.id}`
    edge.source = source
    edge.target = target
    edges[edgeId] = { source, target, ...edge } as Edge
}

export function addLayout(layout: Layout, layouts:any) {
    const nodeId = `node${layout.nodeId}`
    layouts.nodes[nodeId] = { ...layout }
    console.log(layouts)
}