import type { Connection, Edge } from "@vue-flow/core";
import { CustomEdge } from "@/features/graph/types/CustomEdge";

/**
 * Преобразует Connection в Edge с опциональными параметрами
 * @param connection - Объект Connection (source, target, sourceHandle, targetHandle)
 * @param overrides - Дополнительные свойства Edge (например, id, type, label)
 * @returns Новый Edge
 */
export function createEdgeFromConnection(
  connection: Connection,
  overrides: Partial<Edge> = {},
): CustomEdge {
  const defaultEdgeProps = {
    id: `edge-${connection.source}-${connection.target}-${Date.now()}`,
    ...connection,
    type: "special",
  };

  // TODO: поправить тип
  // @ts-ignore
  return {
    ...defaultEdgeProps,
    ...overrides,
    data: {},
  };
}
