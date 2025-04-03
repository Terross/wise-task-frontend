interface BaseRestore {
    type: string;
    properties: any;
}

export interface NodeAddRestore extends BaseRestore {
    type: "node:add";
    properties: {
        nodeId: number;
    };
}

export interface NodeRemoveRestore extends BaseRestore {
    type: "node:remove";
    properties: {
        nodeId: number;
        reason?: string;
    };
}

export type Restore = NodeAddRestore | NodeRemoveRestore