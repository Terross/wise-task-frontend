import { NodesStoreState } from "@/features/graph/types/NodesStore";
import {
  edge1,
  mockedDataStoreState,
} from "@/features/graph/lib/history/__tests__/__mock__";
import { EdgeRemoveRestoreObject } from "../EdgeRemoveRestore";
import { createCustomEdge } from "@/features/graph/types/CustomEdge";
import { EdgeMassDeleteRestoreObject } from "@/features/graph/lib/history/EdgeMassDeleteRestore";

describe("edge mass delete restore", () => {
  let storeData: NodesStoreState;
  let copiedState: NodesStoreState;

  beforeEach(() => {
    storeData = JSON.parse(JSON.stringify(mockedDataStoreState));
    copiedState = JSON.parse(JSON.stringify(mockedDataStoreState));
  });

  test("basic usage", () => {
    const edgeMassDeleteRestore = new EdgeMassDeleteRestoreObject({
      type: "edge:mass_delete",
      properties: { edges: [] },
    });
    const restoredObject = edgeMassDeleteRestore.restore(copiedState);
    expect(restoredObject).toEqual(storeData);
  });

  test("one element deletion", () => {
    const edgeMassDeleteRestore = new EdgeMassDeleteRestoreObject({
      type: "edge:mass_delete",
      properties: { edges: [{ ...edge1, id: "RANDOM_ID" }] },
    });
    const restoredObject = edgeMassDeleteRestore.restore(copiedState);
    expect(restoredObject.edges.length).toBe(storeData.edges.length + 1);
  });

  test("two elements deletion", () => {
    const edgeMassDeleteRestore = new EdgeMassDeleteRestoreObject({
      type: "edge:mass_delete",
      properties: {
        edges: [
          { ...edge1, id: "RANDOM_ID" },
          { ...edge1, id: "ANOTHER_RANDOM_ID" },
        ],
      },
    });
    const restoredObject = edgeMassDeleteRestore.restore(copiedState);
    expect(restoredObject.edges.length).toBe(storeData.edges.length + 2);
  });
});
