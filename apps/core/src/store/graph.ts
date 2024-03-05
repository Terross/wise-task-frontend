import { Maybe } from "@/__generated__/graphql";
import { Edge, Layout } from "@/components/graph/network/helper/graph";
import { Node } from "@/components/graph/network/helper/graph";
import { defineStore } from "pinia";

export const useGraphStore = defineStore('graph', {
    state: () => {
        return {
            graphLibrary: [] as Graph[],
        }
    }
})


interface Graph {
    name: Maybe<string> | undefined,
    edges: Object,
    nodes: Object,
    layouts: Object
}
