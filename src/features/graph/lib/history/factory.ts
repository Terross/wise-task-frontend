import {Restore} from "@/features/graph/types/restores";
import {RestoreObject} from "@/features/graph/types/RestoreObject";
import {NodeAddRestoreObject} from "@/features/graph/lib/history/NodeAddRestore";

export class RestoreObjectFactory {
    public static create(restore: Restore): RestoreObject {
        switch (restore.type) {
            case "node:add":
                return new NodeAddRestoreObject(restore)
            default:
                throw new Error(`Unknown restore type: ${(restore as any).type}`);
        }
    }
}