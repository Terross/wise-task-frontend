import { ConnectedComponent } from "@/features/graph/types/ConnectedComponents";

export const isGraphTree = (component: ConnectedComponent): boolean => {
  if (component.edges.length !== component.nodes.length - 1) {
    return false;
  }

  const incomingCount = new Map<string, number>();
  const hasParent = new Set<string>();

  for (const node of component.nodes) {
    incomingCount.set(node.id, 0);
  }

  for (const edge of component.edges) {
    const target = edge.sourceNode.id;
    incomingCount.set(target, incomingCount.get(target)! + 1);
    hasParent.add(target);
  }

  let rootCount = 0;
  for (const node of component.nodes) {
    const count = incomingCount.get(node.id)!;
    if (count === 0) {
      rootCount++;
    } else if (count > 1) {
      return false;
    }
  }

  return rootCount === 1;
};
