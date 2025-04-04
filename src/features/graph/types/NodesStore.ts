import type {CustomNode} from "./CustomNode";
import {CustomEdge} from "./Edge";

export interface NodesStoreState {
    nodes: CustomNode[];
    edges: CustomEdge[];
    historyIndex: number;
    isDirected: boolean;
    name: string;
    id?: string;
}