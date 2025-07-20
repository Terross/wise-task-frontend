import { NodesStoreState } from "@/features/graph/types/NodesStore";
import {
  mockedDataStoreState,
  node1,
} from "@/features/graph/lib/history/__tests__/__mock__";
import { NodeShiftRestoreObjet } from "@/features/graph/lib/history/NodeShiftRestore";

describe("NodeShiftRestoreObjet", () => {
  let initialStoreData: NodesStoreState;
  let stateToRestore: NodesStoreState;

  beforeEach(() => {
    initialStoreData = JSON.parse(JSON.stringify(mockedDataStoreState));
    stateToRestore = JSON.parse(JSON.stringify(mockedDataStoreState));
  });

  test("should restore a node's position correctly", () => {
    const newPosition = { x: 999, y: -1234 };

    const nodeShiftRestore = new NodeShiftRestoreObjet({
      type: "node:change_shift",
      properties: {
        nodeId: node1.id,
        position: newPosition,
      },
    });

    const expectedState: NodesStoreState = JSON.parse(
      JSON.stringify(initialStoreData),
    );
    const nodeIndex = expectedState.nodes.findIndex(
      (node) => node.id === node1.id,
    );
    if (nodeIndex !== -1) {
      expectedState.nodes[nodeIndex].position = newPosition;
    }

    const restoredState = nodeShiftRestore.restore(stateToRestore);

    expect(restoredState.nodes[nodeIndex].position).toEqual(newPosition);
    expect(restoredState).toEqual(expectedState);
  });

  test("should not modify state if the node is not found", () => {
    const newPosition = { x: 100, y: 200 };
    const nonExistentNodeId = "non-existent-node";

    const nodeShiftRestore = new NodeShiftRestoreObjet({
      type: "node:change_shift",
      properties: {
        nodeId: nonExistentNodeId,
        position: newPosition,
      },
    });

    const restoredState = nodeShiftRestore.restore(stateToRestore);

    expect(restoredState).toEqual(initialStoreData);
    expect(restoredState).toBe(stateToRestore);
  });
});
