import {RestoreObject} from "@/features/graph/types/RestoreObject";
import {NodeAddRestore, Restore} from "@/features/graph/types/restores"
import {NodesStoreState} from "@/features/graph/types/NodesStore";

export class NodeAddRestoreObject extends RestoreObject {
    private nodeId: number;

    constructor(properties: NodeAddRestore) {
        super(properties as Restore);
        this.nodeId = properties.properties.nodeId;
    }

    public restore = (state: NodesStoreState): NodesStoreState => {
        return state;
    }
}