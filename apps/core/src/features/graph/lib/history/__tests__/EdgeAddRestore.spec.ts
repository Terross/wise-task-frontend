import { NodesStoreState } from "@/features/graph/types/NodesStore";
import { mockedDataStoreState } from "@/features/graph/lib/history/__tests__/__mock__";
import { EdgeAddRestoreObject } from "@/features/graph/lib/history/EdgeAddRestore";

describe("edge add restore", () => {
  let storeData: NodesStoreState;

  beforeEach(() => {
    storeData = JSON.parse(JSON.stringify(mockedDataStoreState));
  });

  test("basic usage", () => {
    const edgeAddRestore = new EdgeAddRestoreObject({
      type: "edge:add",
      properties: {
        edgeId: "1",
      },
    });
    const stateAfterRestore = edgeAddRestore.restore(
      JSON.parse(JSON.stringify(storeData)),
    );
    expect(stateAfterRestore.edges.length).toBe(storeData.edges.length - 1);
  });

  test("incorrect id", () => {
    const edgeAddRestore = new EdgeAddRestoreObject({
      type: "edge:add",
      properties: {
        edgeId: "33",
      },
    });
    const stateAfterRestore = edgeAddRestore.restore(
      JSON.parse(JSON.stringify(storeData)),
    );
    expect(stateAfterRestore.edges.length).toBe(storeData.edges.length);
  });
});
