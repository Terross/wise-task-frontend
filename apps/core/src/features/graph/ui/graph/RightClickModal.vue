<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useNodeStore } from "@/features/graph/stores/nodes";
import { CustomNode } from "@/features/graph/types/CustomNode";
import { CustomEdge } from "@/features/graph/types/CustomEdge";

const props = defineProps<{
  position: { x: number; y: number };
  modalPosition: { x: number; y: number };
}>();

const emit = defineEmits(["close", "addNode"]);

const menuRef = ref<HTMLElement | null>(null);
const nodeStore = useNodeStore();

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    emit("close");
  }
};

const addNode = () => {
  nodeStore.addNode({ x: props.position.x, y: props.position.y });
  emit("close");
};

function generateNumericId(): string {
  return Math.floor(Math.random() * 1000000).toString();
}

function processCopiedElements(
  originalNodes: CustomNode[],
  originalEdges: CustomEdge[],
  targetPosition: { x: number; y: number },
): { nodes: CustomNode[]; edges: CustomEdge[] } {
  const idMap = new Map<string, string>();
  const handleIdMap = new Map<string, string>();

  const processedNodes = originalNodes.map((node) => {
    const newNodeId = generateNumericId();
    idMap.set(node.id, newNodeId);

    const newHandleBounds = { ...node.handleBounds };

    if (newHandleBounds.source) {
      newHandleBounds.source = newHandleBounds.source.map((handle) => {
        const newHandleId = generateNumericId();
        handleIdMap.set(handle.id, newHandleId);
        return {
          ...handle,
          id: newHandleId,
          nodeId: newNodeId,
        };
      });
    }

    if (newHandleBounds.target) {
      newHandleBounds.target = newHandleBounds.target.map((handle) => {
        const newHandleId = generateNumericId();
        handleIdMap.set(handle.id, newHandleId);
        return {
          ...handle,
          id: newHandleId,
          nodeId: newNodeId,
        };
      });
    }

    return {
      ...node,
      id: newNodeId,
      handleBounds: newHandleBounds,
    };
  });

  const minX = Math.min(...originalNodes.map((n) => n.position.x));
  const minY = Math.min(...originalNodes.map((n) => n.position.y));

  const positionedNodes = processedNodes.map((node) => ({
    ...node,
    position: {
      x: targetPosition.x + (node.position.x - minX),
      y: targetPosition.y + (node.position.y - minY),
    },
  }));

  const processedEdges = originalEdges.map((edge) => {
    const newEdgeId = generateNumericId();
    const newSourceHandle = edge.sourceHandle
      ? handleIdMap.get(edge.sourceHandle) || edge.sourceHandle
      : undefined;
    const newTargetHandle = edge.targetHandle
      ? handleIdMap.get(edge.targetHandle) || edge.targetHandle
      : undefined;

    return {
      ...edge,
      id: newEdgeId,
      source: idMap.get(edge.source) || edge.source,
      target: idMap.get(edge.target) || edge.target,
      sourceHandle: newSourceHandle,
      targetHandle: newTargetHandle,
      ...(edge.sourceNode && {
        sourceNode: {
          ...edge.sourceNode,
          id: idMap.get(edge.sourceNode.id) || edge.sourceNode.id,
        },
      }),
      ...(edge.targetNode && {
        targetNode: {
          ...edge.targetNode,
          id: idMap.get(edge.targetNode.id) || edge.targetNode.id,
        },
      }),
    };
  });

  return {
    nodes: positionedNodes,
    edges: processedEdges,
  };
}

const addCopiedElements = () => {
  const { nodes, edges } = nodeStore.getCopiedElements();
  const processed = processCopiedElements(nodes, edges, props.position);
  nodeStore.pasteElements(processed.nodes, processed.edges);
  emit("close");
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  document.addEventListener("pointerdown", handleClickOutside);
  document.addEventListener("mousedown", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
  document.removeEventListener("pointerdown", handleClickOutside);
  document.removeEventListener("mousedown", handleClickOutside);
});
</script>

<template>
  <div
    ref="menuRef"
    class="context-menu"
    :style="{
      left: `${props.modalPosition.x}px`,
      top: `${props.modalPosition.y}px`,
    }"
    @click.stop
  >
    <v-card>
      <v-card-title class="headline">Контекстное меню</v-card-title>
      <v-card-text>
        <v-btn block @click="addNode"> Добавить вершину здесь </v-btn>
        <v-btn block @click="addCopiedElements" style="margin-top: 10px"
          >Вставить</v-btn
        >
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" @click="emit('close')">Закрыть</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped>
.context-menu {
  position: absolute;
  z-index: 10;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  min-width: 200px;
}

.headline {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 16px;
}
</style>
