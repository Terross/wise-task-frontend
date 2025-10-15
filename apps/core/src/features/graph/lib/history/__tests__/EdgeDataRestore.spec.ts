import { NodesStoreState } from "@/features/graph/types/NodesStore";
import { edge1, mockedDataStoreState } from "./__mock__";
import { EdgeDataRestoreObject } from "@/features/graph/lib/history/EdgeDataRestore";

describe("edge add restore", () => {
  let storeData: NodesStoreState;
  let copiedState: NodesStoreState;

  beforeEach(() => {
    storeData = JSON.parse(JSON.stringify(mockedDataStoreState));
    copiedState = JSON.parse(JSON.stringify(mockedDataStoreState));
  });

  test("basic usage", () => {
    const edgeDataRestore = new EdgeDataRestoreObject({
      type: "edge:change_data",
      properties: {
        edgeId: "1",
        data: edge1.data,
      },
    });
    expect(edgeDataRestore.restore(copiedState)).toEqual(storeData);
  });

  test("changing params", () => {
    const newWeight: number = 202;
    const newColor: string = "#ff0000";
    const edgeDataRestore = new EdgeDataRestoreObject({
      type: "edge:change_data",
      properties: {
        edgeId: "1",
        data: {
          weight: newWeight,
          color: newColor,
        },
      },
    });
    const restored = edgeDataRestore.restore(copiedState);
    expect(restored.edges[0].data).toEqual({
      weight: newWeight,
      color: newColor,
    });
  });

  test("incorrect edge id", () => {
    const edgeDataRestore = new EdgeDataRestoreObject({
      type: "edge:change_data",
      properties: {
        edgeId: "SUPER_ULTRA_INCORRECT_ID_M5_COMPETITION",
        data: edge1.data,
      },
    });
    expect(edgeDataRestore.restore(copiedState)).toEqual(storeData);
  });
});
