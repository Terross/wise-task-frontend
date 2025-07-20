import { NodesStoreState } from "@/features/graph/types/NodesStore";
import { mockedDataStoreState } from "@/features/graph/lib/history/__tests__/__mock__";
import { EdgeRemoveRestoreObject } from "../EdgeRemoveRestore";
import { createCustomEdge } from "@/features/graph/types/CustomEdge";

describe("edge add restore", () => {
  let storeData: NodesStoreState;
  let copiedState: NodesStoreState;

  beforeEach(() => {
    storeData = JSON.parse(JSON.stringify(mockedDataStoreState));
    copiedState = JSON.parse(JSON.stringify(mockedDataStoreState));
  });

  test("basic usage", () => {
    const edgeRemoveRestore = new EdgeRemoveRestoreObject({
      type: "edge:remove",
      properties: createCustomEdge({ id: "123" }),
    });
    expect(edgeRemoveRestore.restore(copiedState).edges.length).toBe(
      storeData.edges.length + 1,
    );
  });
});
