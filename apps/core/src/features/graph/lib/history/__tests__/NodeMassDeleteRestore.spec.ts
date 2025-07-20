import { NodesStoreState } from "@/features/graph/types/NodesStore";
import {
  edge1,
  edge2,
  mockedDataStoreState,
  node1,
  node2,
} from "@/features/graph/lib/history/__tests__/__mock__";
import { NodeMassDeleteRestoreObject } from "@/features/graph/lib/history/NodeMassDelete";

const sortById = <T extends { id: string }>(arr: T[]): T[] => {
  return [...arr].sort((a, b) => a.id.localeCompare(b.id));
};

describe("edge mass delete restore", () => {
  let storeData: NodesStoreState;
  let copiedState: NodesStoreState;

  beforeEach(() => {
    storeData = JSON.parse(JSON.stringify(mockedDataStoreState));
    copiedState = JSON.parse(JSON.stringify(mockedDataStoreState));
  });

  test("basic usage", () => {
    const nodeMassDeleteRestore = new NodeMassDeleteRestoreObject({
      type: "node:mass_delete",
      properties: {
        nodes: [],
        edges: [],
      },
    });
    const restoredObject = nodeMassDeleteRestore.restore(copiedState);

    expect(sortById(restoredObject.nodes)).toEqual(sortById(storeData.nodes));
    expect(sortById(restoredObject.edges)).toEqual(sortById(storeData.edges));
  });

  test("one node restoring [no edges]", () => {
    copiedState.nodes = storeData.nodes.filter((node) => node.id !== node1.id);
    const nodeMassDeleteRestore = new NodeMassDeleteRestoreObject({
      type: "node:mass_delete",
      properties: {
        edges: [],
        nodes: [node1],
      },
    });
    const restoredObject = nodeMassDeleteRestore.restore(copiedState);

    expect(restoredObject.nodes.find((el) => el.id === node1.id)).toBeDefined();

    expect(sortById(restoredObject.nodes)).toEqual(sortById(storeData.nodes));
    expect(sortById(restoredObject.edges)).toEqual(sortById(storeData.edges));
  });

  test("two nodes and two edges restoring", () => {
    copiedState.nodes = storeData.nodes.filter(
      (node) => node.id !== node1.id && node.id !== node2.id,
    );
    copiedState.edges = storeData.edges.filter(
      (edge) => edge.id !== edge1.id && edge.id !== edge2.id,
    );

    const nodeMassDeleteRestore = new NodeMassDeleteRestoreObject({
      type: "node:mass_delete",
      properties: {
        nodes: [node1, node2],
        edges: [edge1, edge2],
      },
    });
    const restoredObject = nodeMassDeleteRestore.restore(copiedState);

    expect(restoredObject.nodes.find((el) => el.id === node1.id)).toBeDefined();
    expect(restoredObject.nodes.find((el) => el.id === node2.id)).toBeDefined();

    expect(restoredObject.edges.find((el) => el.id === edge1.id)).toBeDefined();
    expect(restoredObject.edges.find((el) => el.id === edge2.id)).toBeDefined();

    expect(sortById(restoredObject.nodes)).toEqual(sortById(storeData.nodes));
    expect(sortById(restoredObject.edges)).toEqual(sortById(storeData.edges));
  });
});
