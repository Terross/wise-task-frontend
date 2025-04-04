import {RestoreObject} from "@/features/graph/types/RestoreObject";
import {NodeAddRestore, Restore} from "@/features/graph/types/restores"
import {NodesStoreState} from "@/features/graph/types/NodesStore";

export class NodeAddRestoreObject extends RestoreObject {
    private nodeId: string;

    constructor(properties: NodeAddRestore) {
        super(properties as Restore);
        this.nodeId = properties.properties.nodeId;
    }

    public restore = (state: NodesStoreState): NodesStoreState => {
        state.nodes = state.nodes.filter(node => node.id !== this.nodeId);
        return state;
    }
}