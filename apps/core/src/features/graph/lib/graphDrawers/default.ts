import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";
import { DrawerResults } from "@/features/graph/types/ConnectedComponents";
import { graphSettingsStore } from "@/features/graph/stores/graphSettings";

export const drawDefaultTypeGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): DrawerResults => {
  let width = 0;
  let height = 0;

  nodes.forEach((node) => {
    width +=
      (node.data.size?.width || graphSettingsStore.defaultNodeSize) +
      graphSettingsStore.defaultNodeSpacingX;
    height = Math.max(
      height,
      node.data.size?.height || graphSettingsStore.defaultNodeSize,
    );
  });

  width -= graphSettingsStore.defaultNodeSpacingX;

  return {
    nodes,
    edges,
    width,
    height,
  };
};
