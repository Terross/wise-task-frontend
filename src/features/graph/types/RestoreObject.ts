import {NodesStoreState} from "./NodesStore";
import {Restore} from "./restores";

export abstract class RestoreObject {
    protected constructor(protected properties: Restore) {}
    public abstract restore(state: NodesStoreState): NodesStoreState;
}

