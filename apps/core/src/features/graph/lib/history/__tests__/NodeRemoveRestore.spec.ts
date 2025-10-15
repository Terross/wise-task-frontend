import { NodesStoreState } from "@/features/graph/types/NodesStore";
import {
  edge1,
  edge2,
  mockedDataStoreState,
  node1,
} from "../__tests__/__mock__";
import { NodeRemoveRestoreObject } from "@/features/graph/lib/history/NodeRemoveRestore";

describe("node add restore", () => {
  let storeData: NodesStoreState;
  let copiedState: NodesStoreState;

  beforeEach(() => {
    storeData = JSON.parse(JSON.stringify(mockedDataStoreState));
    copiedState = JSON.parse(JSON.stringify(mockedDataStoreState));
  });

  test("should correctly restore removed node and its edges", () => {
    storeData.nodes = storeData.nodes.filter((node) => node.id !== node1.id);
    storeData.edges = storeData.edges.filter(
      (edge) =>
        edge.sourceNode.id !== node1.id && edge.targetNode.id !== node1.id,
    );

    const nodeRemoveRestore = new NodeRemoveRestoreObject({
      type: "node:remove",
      properties: {
        node: node1,
        edges: [edge1, edge2],
      },
    });

    expect(storeData.nodes.some((n) => n.id === node1.id)).toBe(false);

    const restoredState = nodeRemoveRestore.restore(storeData);

    expect(restoredState.nodes).toContainEqual(node1);
    expect(restoredState.nodes.some((n) => n.id === node1.id)).toBe(true);

    expect(restoredState.edges).toEqual(expect.arrayContaining([edge1, edge2]));
    expect(restoredState.edges.some((e) => e.id === edge1.id)).toBe(true);
    expect(restoredState.edges.some((e) => e.id === edge2.id)).toBe(true);
  });
});
