import { NodesStoreState } from "@/features/graph/types/NodesStore";
import {
  mockedDataStoreState,
  node1,
  node2,
  node3,
} from "@/features/graph/lib/history/__tests__/__mock__";
import { NodeMassMovementRestoreObject } from "@/features/graph/lib/history/NodeMassMovement";
import { CustomNode } from "@/features/graph/types/CustomNode";

describe("node mass movement restore", () => {
  let storeData: NodesStoreState;

  beforeEach(() => {
    storeData = JSON.parse(JSON.stringify(mockedDataStoreState));
  });

  test("basic usage", () => {
    const nodeMassMovementRestore = new NodeMassMovementRestoreObject({
      type: "node:mass_movement",
      properties: new Map([[node1.id, { x: 10, y: 20 }]]),
    });
    expect(nodeMassMovementRestore).toBeInstanceOf(
      NodeMassMovementRestoreObject,
    );
  });

  test("should correctly move specified nodes and ignore invalid ones", () => {
    const initialNodes: CustomNode[] = JSON.parse(
      JSON.stringify(storeData.nodes),
    );

    const newPosition1 = { x: 100, y: 200 };
    const newPosition2 = { x: 300, y: 400 };
    const invalidNodeId = "nonExistentNode";
    const invalidPosition = { x: 999, y: 999 };

    const nodeMassMovementRestore = new NodeMassMovementRestoreObject({
      type: "node:mass_movement",
      properties: new Map([
        [node1.id, newPosition1],
        [node2.id, newPosition2],
        [invalidNodeId, invalidPosition],
      ]),
    });

    const newState = nodeMassMovementRestore.restore(storeData);

    const restoredNode1 = newState.nodes.find((node) => node.id === node1.id);
    expect(restoredNode1?.position).toEqual(newPosition1);

    const restoredNode2 = newState.nodes.find((node) => node.id === node2.id);
    expect(restoredNode2?.position).toEqual(newPosition2);

    const restoredNode3 = newState.nodes.find((node) => node.id === node3.id);
    expect(restoredNode3?.position).toEqual(node3.position);

    const nonExistentNode = newState.nodes.find(
      (node) => node.id === invalidNodeId,
    );
    expect(nonExistentNode).toBeUndefined();

    const unaffectedNodes: CustomNode[] = initialNodes.filter(
      (node) => ![node1.id, node2.id].includes(node.id),
    );
    unaffectedNodes.forEach((node) => {
      const restoredNode = newState.nodes.find((n) => n.id === node.id);
      expect(restoredNode?.position).toEqual(node.position);
    });
  });

  test("should not move any nodes if no node positions are provided", () => {
    const initialNodes = JSON.parse(JSON.stringify(storeData.nodes));
    const nodeMassMovementRestore = new NodeMassMovementRestoreObject({
      type: "node:mass_movement",
      properties: new Map(),
    });

    const newState = nodeMassMovementRestore.restore(storeData);

    expect(newState.nodes).toEqual(initialNodes);
  });
});
