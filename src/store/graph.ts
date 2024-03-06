import { Maybe } from "@/__generated__/graphql";
import { Edge, Layout } from "@/components/graph/network/helper/graph";
import { Node } from "@/components/graph/network/helper/graph";
import { defineStore } from "pinia";

export const useGraphStore = defineStore('graph', {
    state: () => {
        return {
            graphLibrary: [] as Graph[],
            activeGraph: {
                edges: {},
                nodes: {},
                layouts: {}
            } as Graph,
            constructorGraphState: {
                isDirect: false,
                mode: ConstructionMode.MOVE
            } as any
        }
    }
})


interface Graph {
    name: Maybe<string> | undefined,
    edges: Object,
    nodes: Object,
    layouts: Object
}

enum ConstructionMode {
    MOVE,
    DRAW,
    EDIT,
    DELETE
}
