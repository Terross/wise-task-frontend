import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";

/**
 * Возвращает массив узлов в порядке следования по графу-цепи, поддерживает циклы.
 */
export const getNodesPriority = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): CustomNode[] => {
  if (nodes.length === 0) return [];

  const nodeById = new Map<string, CustomNode>();
  for (const node of nodes) {
    nodeById.set(node.id, node);
  }

  const outgoing = new Map<string, CustomEdge>();
  const incoming = new Map<string, CustomEdge>();

  for (const edge of edges) {
    outgoing.set(edge.sourceNode.id, edge);
    incoming.set(edge.targetNode.id, edge);
  }

  let startNode: CustomNode | undefined = undefined;
  for (const node of nodes) {
    if (!incoming.has(node.id)) {
      startNode = node;
      break;
    }
  }

  if (!startNode) {
    startNode = nodes[0];
  }

  const visited = new Set<string>();
  const priorityList: CustomNode[] = [];

  let currentNode = startNode;
  while (currentNode && !visited.has(currentNode.id)) {
    priorityList.push(currentNode);
    visited.add(currentNode.id);

    const edge = outgoing.get(currentNode.id);
    if (!edge) break;
    // @ts-ignore
    currentNode = edge.targetNode;
  }

  return priorityList;
};

/**
 * Возвращает связанный список графа (в виде массива), можно использовать для обхода или отрисовки.
 */
export const buildLinkedListFromGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): { current: CustomNode; next?: CustomNode }[] => {
  const ordered = getNodesPriority(nodes, edges);
  const linkedList: { current: CustomNode; next?: CustomNode }[] = [];

  for (let i = 0; i < ordered.length; i++) {
    linkedList.push({
      current: ordered[i],
      next: ordered[i + 1],
    });
  }

  return linkedList;
};
