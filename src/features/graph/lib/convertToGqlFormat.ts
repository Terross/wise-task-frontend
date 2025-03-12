import { NodesStoreState } from "../stores/nodes";
import {
  Color,
  EdgeInput,
  Graph,
  InputMaybe,
  Vertex,
} from "@/__generated__/graphql";
import { CustomEdge } from "@/features/graph/types/Edge";
import { CustomNode } from "@/features/graph/types/CustomNode";

const generateEdgesList = (
  edges: CustomEdge[],
): Array<InputMaybe<EdgeInput>> => {
  const edgeList: Array<InputMaybe<EdgeInput>> = [];

  for (let edge of edges) {
    const color: Color = (() => {
      if (!edge.data || !edge.data.color) {
        return Color.Gray;
      }
      if (edge.data.color === "#ff0000") {
        return Color.Red;
      }
      if (edge.data.color === "#00FF00") {
        return Color.Green;
      }
      if (edge.data.color === "#0000FF") {
        return Color.Blue;
      }
      return Color.Gray;
    })();
    edgeList.push({
      color: color,
      label: "",
      source: +edge.sourceNode.id,
      target: +edge.targetNode.id,
      weight: +(edge.data?.weight || "") || 0,
    });
  }

  return edgeList;
};

const generateNodesList = (nodes: CustomNode[]): Vertex[] => {
  const vertexList: Vertex[] = [];

  for (let node of nodes) {
    const color: Color = (() => {
      if (!node.data || !node.data.color) {
        return Color.Gray;
      }
      if (node.data.color === "#ff0000") {
        return Color.Red;
      }
      if (node.data.color === "#00FF00") {
        return Color.Green;
      }
      if (node.data.color === "#0000FF") {
        return Color.Blue;
      }
      return Color.Gray;
    })();
    vertexList.push({
      color: color,
      id: +node.id,
      label: node.data.label || "",
      weight: node.data.weight || 0,
      xCoordinate: node.position.x,
      yCoordinate: node.position.y,
    });
  }

  return vertexList;
};

export const convertToGqlFormat = (graphState: NodesStoreState): Graph => {
  return {
    edgeCount: graphState.edges.length,
    edgeList: generateEdgesList(graphState.edges),
    id: self.crypto.randomUUID(),
    isDirect: graphState.isDirected,
    isNamed: graphState.name.length > 0,
    name: graphState.name || undefined,
    vertexCount: graphState.nodes.length,
    vertexList: generateNodesList(graphState.nodes),
  };
};
