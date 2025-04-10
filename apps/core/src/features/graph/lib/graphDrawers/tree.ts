import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";

type TreeNode = CustomNode & {
  children: TreeNode[];
  subtreeWidth: number;
};

const VERTICAL_SPACING = 100;
const HORIZONTAL_SPACING = 40;

export const drawTreeGraph = (
  nodes: CustomNode[],
  edges: CustomEdge[],
): CustomNode[] => {
  const nodeMap = new Map<string, TreeNode>();
  nodes.forEach((node) => {
    nodeMap.set(node.id, { ...node, children: [], subtreeWidth: 0 });
  });

  // Находим root — ноду без входящих рёбер
  const hasParent = new Set(edges.map((edge) => edge.target));
  const rootId = nodes.find((n) => !hasParent.has(n.id))?.id;
  if (!rootId) throw new Error("No root node found");

  // Строим дерево
  edges.forEach((edge) => {
    const parent = nodeMap.get(edge.source);
    const child = nodeMap.get(edge.target);
    if (parent && child) {
      parent.children.push(child);
    }
  });

  const root = nodeMap.get(rootId)!;

  // 1. Подсчёт ширины поддеревьев
  const calculateSubtreeWidth = (node: TreeNode): number => {
    const { width } = node.data.size || { width: 100, height: 100 };
    if (node.children.length === 0) {
      node.subtreeWidth = width;
    } else {
      const childWidths = node.children.map((c) => calculateSubtreeWidth(c));
      node.subtreeWidth =
        childWidths.reduce((a, b) => a + b, 0) +
        (node.children.length - 1) * HORIZONTAL_SPACING;
    }
    return node.subtreeWidth;
  };

  // 2. Расположение нод
  const setPositions = (node: TreeNode, xStart: number, depth: number) => {
    const { width, height } = node.data?.size || { width: 100, height: 100 };
    const xCenter = xStart + node.subtreeWidth / 2;
    node.position = {
      x: xCenter - width / 2,
      y: depth * (height + VERTICAL_SPACING),
    };

    let childX = xStart;
    node.children.forEach((child) => {
      setPositions(child, childX, depth + 1);
      childX += child.subtreeWidth + HORIZONTAL_SPACING;
    });
  };

  calculateSubtreeWidth(root);
  setPositions(root, 0, 0);

  return Array.from(nodeMap.values());
};
