import { NodesStoreState } from "@/features/graph/types/NodesStore";
import {
  edge1,
  mockedDataStoreState,
  node1,
} from "@/features/graph/lib/history/__tests__/__mock__";
import { EdgeRemoveRestoreObject } from "../EdgeRemoveRestore";
import { createCustomEdge } from "@/features/graph/types/CustomEdge";
import { EdgeMassDeleteRestoreObject } from "@/features/graph/lib/history/EdgeMassDeleteRestore";
import { NodeAddRestoreObject } from "@/features/graph/lib/history/NodeAddRestore";

describe("node add restore", () => {
  let storeData: NodesStoreState;
  let copiedState: NodesStoreState;

  beforeEach(() => {
    storeData = JSON.parse(JSON.stringify(mockedDataStoreState));
    copiedState = JSON.parse(JSON.stringify(mockedDataStoreState));
  });

  test("basic usage", () => {
    const nodeAddRestore = new NodeAddRestoreObject({
      type: "node:add",
      properties: {
        nodeId: node1.id,
      },
    });
    const restoredObject = nodeAddRestore.restore(copiedState);
    const removedElementIndex = restoredObject.nodes.findIndex(
      (n) => n.id === node1.id,
    );
    expect(restoredObject.nodes.length).toBe(storeData.nodes.length - 1);
    expect(removedElementIndex).toBe(-1);
  });

  test("incorrect node id", () => {
    const nodeAddRestore = new NodeAddRestoreObject({
      type: "node:add",
      properties: {
        nodeId: "SUPER ULTRA RANDOM ID",
      },
    });
    const restoredObject = nodeAddRestore.restore(copiedState);
    expect(restoredObject).toEqual(storeData);
  });
});
