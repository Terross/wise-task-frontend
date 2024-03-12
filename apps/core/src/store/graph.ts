import { Maybe } from "@/__generated__/graphql";
import { defineStore } from "pinia";

export const useGraphStore = defineStore('graph', {
    state: () => {
        return {
            graphLibrary: [] as Graph[],
            activeGraph: {
                edges: {},
                nodes: {},
                layouts: { nodes: {} }
            } as Graph,
            constructorGraphState: {
                isDirect: false,
                mode: ConstructionMode.DRAW
            } as any
        }
    }
})


interface Graph {
    name: Maybe<string> | undefined,
    edges: any,
    nodes: any,
    layouts: any
}

export enum ConstructionMode {
    MOVE,
    DRAW,
    EDIT,
    DELETE
}
