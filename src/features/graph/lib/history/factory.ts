import { Restore } from "@/features/graph/types/restores";
import { RestoreObject } from "@/features/graph/types/RestoreObject";
import { NodeAddRestoreObject } from "@/features/graph/lib/history/NodeAddRestore";
import { NodeRemoveRestoreObject } from "@/features/graph/lib/history/NodeRemoveRestoreObject";
import { NodeSizeRestoreObject } from "@/features/graph/lib/history/NodeResizeRestore";

export class RestoreObjectFactory {
  public static create(restore: Restore): RestoreObject {
    switch (restore.type) {
      case "node:add":
        return new NodeAddRestoreObject(restore);
      case "node:remove":
        return new NodeRemoveRestoreObject(restore);
      case "node:change_size":
        return new NodeSizeRestoreObject(restore);
      default:
        throw new Error(`Unknown restore type: ${(restore as any).type}`);
    }
  }
}
