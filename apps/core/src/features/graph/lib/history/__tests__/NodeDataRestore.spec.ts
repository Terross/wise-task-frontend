import { NodesStoreState } from "@/features/graph/types/NodesStore";
import {
  mockedDataStoreState,
  node1,
} from "@/features/graph/lib/history/__tests__/__mock__";
import { NodeDataRestoreObjet } from "@/features/graph/lib/history/NodeDataRestore";
import { CustomNode } from "@/features/graph/types/CustomNode";

// Node data type example
// data: {
//     size?: { width: number; height: number };
//     weight?: number;
//     label?: string;
//     color?: string;
// };

describe("node add restore", () => {
  let storeData: NodesStoreState;
  let copiedState: NodesStoreState;

  beforeEach(() => {
    storeData = JSON.parse(JSON.stringify(mockedDataStoreState));
    copiedState = JSON.parse(JSON.stringify(mockedDataStoreState));
  });

  test("basic usage", () => {
    const nodeDataRestore = new NodeDataRestoreObjet({
      type: "node:change_data",
      properties: {
        nodeId: node1.id,
        data: {},
      },
    });
    const restoredObject = nodeDataRestore.restore(copiedState);
    const changedNodeIndex = storeData.nodes.findIndex(
      (node) => node.id === node1.id,
    );
    expect(changedNodeIndex).toBeGreaterThan(-1);
    expect(restoredObject.nodes[changedNodeIndex].data).toEqual({});
  });

  test("replacing existing data", () => {
    const newDataReplacement: CustomNode["data"] = {
      color: "RED",
      label: "A LABEL",
    };
    const nodeDataRestore = new NodeDataRestoreObjet({
      type: "node:change_data",
      properties: {
        nodeId: node1.id,
        data: newDataReplacement,
      },
    });
    const restoredObject = nodeDataRestore.restore(copiedState);
    const changedNodeIndex = storeData.nodes.findIndex(
      (node) => node.id === node1.id,
    );
    expect(changedNodeIndex).toBeGreaterThan(-1);
    expect(restoredObject.nodes[changedNodeIndex].data).toEqual(
      newDataReplacement,
    );
  });

  test("incorrect id", () => {
    const newDataReplacement: CustomNode["data"] = {
      color: "RED",
      label: "A LABEL",
    };
    const RANDOM_ID = "ULTRA_SUPER_RANDOM_ID";
    const nodeDataRestore = new NodeDataRestoreObjet({
      type: "node:change_data",
      properties: {
        nodeId: RANDOM_ID,
        data: newDataReplacement,
      },
    });
    const restoredObject = nodeDataRestore.restore(copiedState);
    const changedNodeIndex = storeData.nodes.findIndex(
      (node) => node.id === RANDOM_ID,
    );
    expect(changedNodeIndex).toBe(-1);
    expect(restoredObject).toEqual(storeData);
  });
});
